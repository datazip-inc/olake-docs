#!/usr/bin/env bash
# Lab: add a table to a running Debezium MySQL connector, and load the rows the table already holds.
# Every step counts the change events that reached the table's topic and compares them with the table.
#
#   ./run.sh up               start Kafka, MySQL and Kafka Connect
#   ./run.sh include-list     a connector captures customers; orders is added to table.include.list
#   ./run.sh signal-unlisted  a signal table and signal.data.collection; the signal table is not in table.include.list
#   ./run.sh signal-denied    the signal table in table.include.list; the capture user cannot write to it
#   ./run.sh signal           GRANT INSERT on the signal table, then execute-snapshot again
#   ./run.sh outside-list     execute-snapshot for a table that is not in table.include.list
#   ./run.sh no-key           a table without a primary key, then surrogate-key, then message.key.columns
#   ./run.sh stop             stop-snapshot while an incremental snapshot runs
#   ./run.sh restart          restart the task while an incremental snapshot runs
#   ./run.sh blocking         execute-snapshot with "type": "blocking"
#   ./run.sh kafka-signal     a read-only incremental snapshot started from a Kafka topic, with no signal table
#   ./run.sh changes          updates and deletes while an incremental snapshot runs
#   ./run.sh all              every step above in order, each captured under logs/debezium-<version>/
#   ./run.sh down             remove everything
#
# Old Debezium on an old Kafka Connect (amd64 image, slow on Apple silicon):
#   DEBEZIUM_IMAGE=quay.io/debezium/connect:1.9.7.Final MYSQL_IMAGE=mysql:8.0.46 ./run.sh all
set -euo pipefail
cd "$(dirname "$0")"

export DEBEZIUM_IMAGE="${DEBEZIUM_IMAGE:-quay.io/debezium/connect:3.7.1.Final}"
export MYSQL_IMAGE="${MYSQL_IMAGE:-mysql:8.4.13}"
DBZ_VERSION="${DEBEZIUM_IMAGE##*:}"
DBZ_VERSION="${DBZ_VERSION%.Final}"
CONNECT="http://localhost:${CONNECT_PORT:-18316}"
RUNNING='RUNNING tasks=\[RUNNING\]'
MARK=0

legacy() { [[ "$DBZ_VERSION" == 1.* ]]; }
# Seconds to let the connector settle. The 1.9 image is built for x86 and runs under emulation on Apple silicon.
SETTLE="${SETTLE:-$(legacy && echo 20 || echo 8)}"
# Chunk size for the steps that need a snapshot that runs long enough to interrupt.
SMALL_CHUNK="${SMALL_CHUNK:-2}"

dc() { docker compose "$@"; }
kafka() { dc exec -T -e KAFKA_HEAP_OPTS=-Xmx128m kafka /opt/kafka/bin/"$@" 2>/dev/null; }
# sql STATEMENT: print the statement, then its result or its error.
sql() { printf 'mysql> %s\n' "$1"; dc exec -T mysql mysql -uroot -prootpw -t -e "$1" 2>&1 | grep -v 'Using a password' || true; }
# val STATEMENT: bare values, for the script itself.
val() { dc exec -T mysql mysql -uroot -prootpw -N -B -e "$1" 2>/dev/null; }
say() { printf '\n## %s\n' "$*"; }

connect_log() { dc logs --no-color --no-log-prefix connect 2>/dev/null; }
mark() { MARK=$(connect_log | wc -l | tr -d ' '); }
since_mark() { connect_log | tail -n +"$((MARK + 1))"; }
wait_log() { # pattern, seconds: wait for a log line written after the last mark
  for _ in $(seq 1 "$2"); do
    if [[ "$(since_mark | grep -cE "$1" || true)" -gt 0 ]]; then return 0; fi
    sleep 1
  done
  echo "  (no log line matched /$1/ in $2 s)"
}
# logged PATTERN: the connector log lines since the last mark that match, without the timestamp and
# without the configuration that Kafka Connect and Debezium print when a task starts.
logged() {
  echo "--- connector log since the last mark"
  since_mark | grep -E "$1" | grep -vE "^[[:space:]]|[[:space:]]{3,}[a-z0-9._-]+ = |RestServer\]|NetworkClient\]|records sent during previous|isn't a known config|Requested thread factory|Not updating high watermark" |
    sed -E -e 's/^[0-9]{4}-[0-9]{2}-[0-9]{2}[T ][0-9:,]+ +//' -e 's/(SnapshotResult \[status=[A-Z]+),.*/\1, ...]/' |
    cut -c1-420 | uniq | head -n "${2:-25}" || true
  echo "---"
}

state() {
  curl -s "$CONNECT/connectors/$1/status" |
    python3 -I -c 'import sys,json; d=json.load(sys.stdin); print("connector=%s tasks=[%s]" % (d["connector"]["state"], ",".join(t["state"] for t in d.get("tasks",[]))))' 2>/dev/null || echo "(no status)"
}
wait_for() { # connector name, pattern, seconds
  local s=""
  for _ in $(seq 1 "$3"); do
    s="$(state "$1")"
    if [[ "$s" =~ $2 ]]; then echo "  $1: $s"; return 0; fi
    sleep 1
  done
  echo "  $1: $s (gave up waiting for /$2/)"
}
cause() { # connector name: the exception lines of a failed task, without stack frames
  curl -s "$CONNECT/connectors/$1/status" |
    python3 -I -c 'import sys,json
for t in json.load(sys.stdin).get("tasks",[]):
    for l in t.get("trace","").splitlines():
        if not l.startswith("\tat ") and not l.startswith("\t..."): print("  "+l[:420])'
}
rest() { curl -s -o /dev/null -w "  $1 $2: %{http_code}\n" -X "$1" "$CONNECT$2"; }
put() { # connector name, configuration as JSON
  local out code
  out="$(curl -s -w '\n%{http_code}' -X PUT -H 'Content-Type: application/json' --data "$2" "$CONNECT/connectors/$1/config")"
  code="${out##*$'\n'}"
  echo "  PUT /connectors/$1/config: $code"
  if [[ "$code" != 2* ]]; then echo "${out%$'\n'*}" | cut -c1-900; fi
}
# apply NAME CONFIG: replace the configuration, restart the task if it stays FAILED, wait for streaming.
apply() {
  mark
  put "$1" "$2"
  sleep 5
  if [[ "$(state "$1")" == *FAILED* ]]; then rest POST "/connectors/$1/tasks/0/restart"; fi
  wait_for "$1" "$RUNNING" 240
  wait_log 'Starting streaming' 240
  sleep "$SETTLE"
}
clear_connectors() { # delete every connector, so that no other connector reads the next signal
  local c
  for c in $(curl -s "$CONNECT/connectors" | python3 -I -c 'import sys,json; print(" ".join(json.load(sys.stdin)))'); do
    rest DELETE "/connectors/$c"
  done
  sleep 5
}

# Connector configuration. Debezium 2.0 renamed database.server.name to topic.prefix and
# database.history.* to schema.history.internal.*. Extra arguments are key=value pairs; a value
# of "-" removes the key.
config() { # topic prefix, key=value ...
  python3 -I - "$(legacy && echo 1 || echo 0)" "$@" <<'PY'
import json, sys
legacy, prefix, extra = sys.argv[1] == "1", sys.argv[2], sys.argv[3:]
c = {
    "connector.class": "io.debezium.connector.mysql.MySqlConnector", "tasks.max": "1",
    "database.hostname": "mysql", "database.port": "3306",
    "database.user": "debezium", "database.password": "dbz",
    "database.server.id": str(184000 + sum(map(ord, prefix)) % 1000),
    "database.include.list": "inventory",
    "table.include.list": "inventory.customers",
}
if legacy:
    c.update({"database.server.name": prefix, "database.ssl.mode": "preferred",
              "database.history.kafka.bootstrap.servers": "kafka:9092",
              "database.history.kafka.topic": "schemahistory." + prefix})
else:
    c.update({"topic.prefix": prefix,
              "schema.history.internal.kafka.bootstrap.servers": "kafka:9092",
              "schema.history.internal.kafka.topic": "schemahistory." + prefix})
for kv in extra:
    k, _, v = kv.partition("=")
    if v == "-": c.pop(k, None)
    else: c[k] = v
print(json.dumps(c))
PY
}
no_data() { legacy && echo schema_only || echo no_data; } # the snapshot mode that reads no rows
WITH_SIGNAL=(table.include.list=inventory.customers,inventory.orders,inventory.debezium_signal
             signal.data.collection=inventory.debezium_signal)

signal() { # id, type, data: write a signal row as root, the way an operator would
  sql "INSERT INTO inventory.debezium_signal (id, type, data) VALUES ('$1', '$2', '$3');"
}
SNAPSHOT_ORDERS='{"data-collections": ["inventory.orders"], "type": "incremental"}'

topic_exists() { kafka kafka-topics.sh --bootstrap-server kafka:9092 --list | grep -qx "$1"; }
end_offset() { # topic: the number of events written to it, 0 while it does not exist
  { kafka kafka-get-offsets.sh --bootstrap-server kafka:9092 --topic "$1" || true; } | awk -F: '{s += $NF} END {print s + 0}'
}
topics() { # prefix: every topic of that prefix with its end offset (the number of events written)
  local out
  out="$(kafka kafka-get-offsets.sh --bootstrap-server kafka:9092 --topic "^$1\\..*" | sort || true)"
  echo "\$ kafka-get-offsets.sh --topic '^$1\\..*'"
  if [[ -n "$out" ]]; then echo "$out" | sed 's/^/  /'; else echo "  (no topic starts with $1.)"; fi
}
wait_events() { # topic, count, seconds: wait until the topic holds at least that many events
  local n=0
  for _ in $(seq 1 "$3"); do
    n="$(end_offset "$1")"
    if [[ "$n" -ge "$2" ]]; then return 0; fi
    sleep 1
  done
  echo "  (the topic $1 held $n events after $3 s)"
}
wait_quiet() { # topic, seconds: wait until the topic stops growing for 15 s
  local last=-1 now same=0
  for _ in $(seq 1 $(($2 / 5))); do
    now="$(end_offset "$1")"
    if [[ "$now" == "$last" ]]; then
      same=$((same + 1)); [[ "$same" -ge 3 ]] && return 0
    else same=0; fi
    last="$now"
    sleep 5
  done
}
# count TOPIC [KEY]: the events of the topic, compared with the rows of the table it belongs to.
count() {
  local topic="$1" key="${2:-id}" table="${1##*.}" ids
  echo "\$ kafka-console-consumer.sh --topic $topic --from-beginning    -- counted by count.py"
  if ! topic_exists "$topic"; then echo "  (no topic $topic)"; return 0; fi
  ids="$(mktemp)"
  val "SELECT $key FROM inventory.$table" > "$ids"
  kafka kafka-console-consumer.sh --bootstrap-server kafka:9092 --topic "$topic" --from-beginning \
    --timeout-ms 15000 --consumer-property allow.auto.create.topics=false |
    python3 -I count.py --key "$key" --ids "$ids" ${SAMPLE:+--sample}
  rm -f "$ids"
}
stored_offset() { # connector name: the last offset Kafka Connect stored for it, read from the offsets topic
  local last
  echo "\$ kafka-console-consumer.sh --topic lab_connect_offsets --formatter-property print.key=true    -- last record for $1"
  last="$(kafka kafka-console-consumer.sh --bootstrap-server kafka:9092 --topic lab_connect_offsets --from-beginning \
    --formatter-property print.key=true --timeout-ms 3000 | grep -F "\"$1\"" | tail -1 || true)"
  echo "$last" | cut -c1-1800
  # The two keys are Java-serialized arrays. For a table with one INT key column, an array that holds
  # one java.lang.Integer, the value is the last 4 bytes.
  echo "$last" | python3 -I -c '
import json, sys
line = sys.stdin.read().strip()
if "\t" in line:
    offset = json.loads(line.split("\t", 1)[1])
    for k in ("incremental_snapshot_primary_key", "incremental_snapshot_maximum_key"):
        v = offset.get(k)
        one_integer = "aced0005757200135b4c6a6176612e6c616e672e4f626a6563743b90ce589f1073296c020000787000000001737200116a6176612e6c616e672e496e746567657212e2a0a4f781873802000149000576616c7565787200106a6176612e6c616e672e4e756d62657286ac951d0b94e08b0200007870"
        if v and v.startswith(one_integer) and len(v) == len(one_integer) + 8:
            print("  %s decoded: [%d]" % (k, int(v[-8:], 16)))
'
}
took() { # table: seconds from the last snapshot request to the end of that snapshot, from the log timestamps
  since_mark | python3 -I -c '
import re, sys
from datetime import datetime
start = end = None
for line in sys.stdin:
    m = re.match(r"(\d{4}-\d\d-\d\d)[T ](\d\d:\d\d:\d\d),(\d{3})", line)
    if not m:
        continue
    t = datetime.strptime(m.group(1) + " " + m.group(2), "%Y-%m-%d %H:%M:%S").timestamp() + int(m.group(3)) / 1000
    if "Requested" in line and "snapshot of data collections" in line:
        start, end = t, None
    if start is not None and "incremental snapshotting of table" in line and sys.argv[1] in line and "finished" in line:
        end = t
print("  from the request to the end of the snapshot, by the log timestamps: %s"
      % ("%.1f s" % (end - start) if start is not None and end is not None else "not found"))
' "$1"
}
SIGNAL_LINES='Received signal|Signal .* has|ignal .*not|Requested|incremental snapshot|Incremental snapshot|incremental snapshotting|[Ss]napshot window|stop of snapshot|BLOCKING|denied|ERROR|WARN|^(java|io|org|com)\.[A-Za-z.]+(Exception|Error)'

case "${1:-}" in
up)
  dc up -d --wait --quiet-pull >/dev/null 2>&1 || { dc logs --tail 30; exit 1; }
  for _ in $(seq 1 300); do curl -sf "$CONNECT/connectors" >/dev/null && break; sleep 1; done
  echo "\$ curl $CONNECT/"
  curl -s "$CONNECT/"; echo
  echo "\$ curl $CONNECT/connector-plugins    (the MySQL connector)"
  curl -s "$CONNECT/connector-plugins" | python3 -I -c 'import sys,json
for p in json.load(sys.stdin):
    if "MySql" in p["class"]: print("  %s %s" % (p["class"], p.get("version")))'
  sql "SELECT VERSION();"
  sql "SELECT 'customers' AS table_name, COUNT(*) AS row_count FROM inventory.customers
       UNION ALL SELECT 'orders', COUNT(*) FROM inventory.orders
       UNION ALL SELECT 'shipments', COUNT(*) FROM inventory.shipments
       UNION ALL SELECT 'order_notes', COUNT(*) FROM inventory.order_notes;"
  ;;

include-list)
  say "A connector that captures inventory.customers, with an initial snapshot"
  apply inventory-connector "$(config dbserver1)"
  topics dbserver1
  say "inventory.orders added to table.include.list on the running connector"
  apply inventory-connector "$(config dbserver1 table.include.list=inventory.customers,inventory.orders)"
  logged 'previous offset|SnapshotResult|No previous offset'
  say "One new order after the change"
  sql "INSERT INTO inventory.orders (customer_id, quantity) VALUES (1, 5);"
  sleep "$SETTLE"
  topics dbserver1
  count dbserver1.inventory.orders
  ;;

signal-unlisted)
  say "The signal table, as the Debezium documentation creates it"
  sql "CREATE TABLE inventory.debezium_signal (id VARCHAR(42) PRIMARY KEY, type VARCHAR(32) NOT NULL, data VARCHAR(2048) NULL);"
  say "signal.data.collection set; table.include.list names customers and orders, not the signal table"
  apply inventory-connector "$(config dbserver1 table.include.list=inventory.customers,inventory.orders signal.data.collection=inventory.debezium_signal)"
  mark
  signal backfill-1 execute-snapshot "$SNAPSHOT_ORDERS"
  wait_log 'Received signal|Requested|denied|ERROR' 60
  sleep $((SETTLE * 2))
  state inventory-connector
  cause inventory-connector
  logged "$SIGNAL_LINES"
  topics dbserver1
  count dbserver1.inventory.orders
  ;;

signal-denied)
  say "The signal table added to table.include.list. The capture user still has no INSERT on it"
  sql "SHOW GRANTS FOR 'debezium'@'%';"
  apply inventory-connector "$(config dbserver1 "${WITH_SIGNAL[@]}")"
  logged "$SIGNAL_LINES|Found previous partition offset"
  cause inventory-connector
  mark
  signal backfill-2 execute-snapshot "$SNAPSHOT_ORDERS"
  wait_log 'Received signal|Requested|denied|ERROR' 60
  sleep $((SETTLE * 2))
  state inventory-connector
  cause inventory-connector
  logged "$SIGNAL_LINES"
  topics dbserver1
  count dbserver1.inventory.orders
  ;;

signal)
  say "The capture user may now write to the signal table"
  mark
  sql "GRANT INSERT ON inventory.debezium_signal TO 'debezium'@'%';"
  if [[ "$(state inventory-connector)" == *FAILED* ]]; then
    rest POST "/connectors/inventory-connector/tasks/0/restart"
    wait_for inventory-connector "$RUNNING" 240; wait_log 'Starting streaming' 240; sleep "$SETTLE"
  fi
  signal backfill-3 execute-snapshot "$SNAPSHOT_ORDERS"
  wait_log 'Received signal|Requested|denied|ERROR' 60
  wait_events dbserver1.inventory.orders 2 300
  wait_quiet dbserver1.inventory.orders 600
  state inventory-connector
  took inventory.orders
  logged "$SIGNAL_LINES"
  topics dbserver1
  SAMPLE=1 count dbserver1.inventory.orders
  say "What the connector wrote into the signal table"
  sql "SELECT type, COUNT(*) AS signal_rows FROM inventory.debezium_signal GROUP BY type ORDER BY type;"
  ;;

outside-list)
  say "execute-snapshot for inventory.shipments, which is not in table.include.list"
  mark
  signal outside-1 execute-snapshot '{"data-collections": ["inventory.shipments"], "type": "incremental"}'
  wait_log 'Received signal|Requested|denied|ERROR' 60
  sleep $((SETTLE * 2))
  state inventory-connector
  logged "$SIGNAL_LINES"
  topics dbserver1
  count dbserver1.inventory.shipments
  ;;

no-key)
  say "inventory.order_notes, a table without a primary key, added to table.include.list"
  apply inventory-connector "$(config dbserver1 "${WITH_SIGNAL[@]}" table.include.list=inventory.customers,inventory.orders,inventory.debezium_signal,inventory.order_notes)"
  mark
  signal nokey-1 execute-snapshot '{"data-collections": ["inventory.order_notes"], "type": "incremental"}'
  wait_log 'Received signal|Requested|denied|ERROR' 60
  sleep $((SETTLE * 2))
  logged "$SIGNAL_LINES"
  count dbserver1.inventory.order_notes note_id
  say "The same signal with a surrogate key"
  mark
  signal nokey-2 execute-snapshot '{"data-collections": ["inventory.order_notes"], "type": "incremental", "surrogate-key": "note_id"}'
  wait_log 'Received signal|Requested|denied|ERROR' 60
  sleep $((SETTLE * 2))
  logged "$SIGNAL_LINES"
  count dbserver1.inventory.order_notes note_id
  say "message.key.columns gives the table a key, then the first signal again"
  apply inventory-connector "$(config dbserver1 "${WITH_SIGNAL[@]}" table.include.list=inventory.customers,inventory.orders,inventory.debezium_signal,inventory.order_notes message.key.columns=inventory.order_notes:note_id)"
  mark
  signal nokey-3 execute-snapshot '{"data-collections": ["inventory.order_notes"], "type": "incremental"}'
  wait_log 'Received signal|Requested|denied|ERROR' 60
  sleep $((SETTLE * 2))
  logged "$SIGNAL_LINES"
  count dbserver1.inventory.order_notes note_id
  ;;

stop)
  clear_connectors
  say "A connector that captures orders from the start and reads no rows (snapshot.mode=$(no_data)), incremental.snapshot.chunk.size=$SMALL_CHUNK"
  apply stop-connector "$(config stop "${WITH_SIGNAL[@]}" snapshot.mode="$(no_data)" incremental.snapshot.chunk.size="$SMALL_CHUNK")"
  mark
  signal stop-1 execute-snapshot "$SNAPSHOT_ORDERS"
  wait_events stop.inventory.orders 1 180
  echo "  events in stop.inventory.orders when stop-snapshot is sent: $(end_offset stop.inventory.orders)"
  signal stop-2 stop-snapshot "$SNAPSHOT_ORDERS"
  wait_log 'stop of snapshot|Received signal id = .stop-2|not recognized|ERROR' 120
  wait_quiet stop.inventory.orders 1800
  state stop-connector
  logged "$SIGNAL_LINES"
  count stop.inventory.orders
  ;;

restart)
  clear_connectors
  say "The same set-up under another name, then a task restart halfway through the snapshot"
  apply restart-connector "$(config restart "${WITH_SIGNAL[@]}" snapshot.mode="$(no_data)" incremental.snapshot.chunk.size="$SMALL_CHUNK")"
  mark
  signal restart-1 execute-snapshot "$SNAPSHOT_ORDERS"
  wait_events restart.inventory.orders 5000 1800
  say "The offset Kafka Connect stored while the snapshot runs"
  stored_offset restart-connector
  echo "  events in restart.inventory.orders at the restart: $(end_offset restart.inventory.orders)"
  mark
  rest POST "/connectors/restart-connector/tasks/0/restart"
  wait_for restart-connector "$RUNNING" 240
  wait_log 'Starting streaming' 240
  wait_quiet restart.inventory.orders 1800
  state restart-connector
  logged 'Incremental snapshot|incremental snapshot|incremental snapshotting|ERROR|WARN'
  count restart.inventory.orders
  ;;

blocking)
  clear_connectors
  say "A connector that reads no rows at start, then execute-snapshot with type blocking"
  apply blocking-connector "$(config blocking "${WITH_SIGNAL[@]}" snapshot.mode="$(no_data)")"
  mark
  signal blocking-1 execute-snapshot '{"data-collections": ["inventory.orders"], "type": "blocking"}'
  wait_log 'Requested|Received signal|not recognized|Exception|ERROR' 60
  wait_events blocking.inventory.orders 1 120
  wait_quiet blocking.inventory.orders 600
  state blocking-connector
  logged "$SIGNAL_LINES|Snapshot step|Snapshot completed|Streaming will now pause|Streaming resumed"
  cause blocking-connector
  if [[ "$(state blocking-connector)" == *FAILED* ]]; then
    say "One restart of the failed task"
    mark
    rest POST "/connectors/blocking-connector/tasks/0/restart"
    sleep $((SETTLE * 3))
    state blocking-connector
    cause blocking-connector
    logged "$SIGNAL_LINES|Found previous partition offset"
  fi
  count blocking.inventory.orders
  ;;

kafka-signal)
  clear_connectors
  sql "SELECT COUNT(*) AS rows_in_signal_table FROM inventory.debezium_signal;"
  say "A connector with read.only=true and a Kafka signal topic, and no signal table"
  kafka kafka-topics.sh --bootstrap-server kafka:9092 --create --topic readonly-signals --partitions 1 --replication-factor 1 | sed 's/^/  /' || true
  extra=(table.include.list=inventory.customers,inventory.orders snapshot.mode="$(no_data)" read.only=true
         signal.kafka.topic=readonly-signals signal.kafka.bootstrap.servers=kafka:9092)
  legacy || extra+=(signal.enabled.channels=kafka)
  apply readonly-connector "$(config readonly "${extra[@]}")"
  mark
  msg='readonly|{"type":"execute-snapshot","data":{"data-collections":["inventory.orders"],"type":"INCREMENTAL"}}'
  echo "\$ kafka-console-producer.sh --topic readonly-signals --reader-property parse.key=true --reader-property key.separator='|'"
  echo "  $msg"
  echo "$msg" | kafka kafka-console-producer.sh --bootstrap-server kafka:9092 --topic readonly-signals \
    --reader-property parse.key=true --reader-property 'key.separator=|'
  wait_log 'Requested|ERROR' 120
  wait_events readonly.inventory.orders 1 600
  wait_quiet readonly.inventory.orders 900
  state readonly-connector
  took inventory.orders
  logged "$SIGNAL_LINES"
  count readonly.inventory.orders
  sql "SELECT COUNT(*) AS rows_in_signal_table FROM inventory.debezium_signal;"
  ;;

changes)
  clear_connectors
  say "A connector that reads no rows at start, incremental.snapshot.chunk.size=$SMALL_CHUNK"
  apply changes-connector "$(config changes "${WITH_SIGNAL[@]}" snapshot.mode="$(no_data)" incremental.snapshot.chunk.size="$SMALL_CHUNK")"
  mark
  signal changes-1 execute-snapshot "$SNAPSHOT_ORDERS"
  wait_events changes.inventory.orders 1 180
  say "While the snapshot runs: 20 rounds, each updating 5 rows and deleting 1, spread over the table"
  echo "  events in changes.inventory.orders before the first change: $(end_offset changes.inventory.orders)"
  for r in $(seq 1 20); do
    val "UPDATE inventory.orders SET quantity = quantity + 1000 WHERE id IN ($((r * 7)), $((r * 7 + 5000)), $((r * 7 + 10000)), $((r * 7 + 15000)), $((20000 - r * 3)));
         DELETE FROM inventory.orders WHERE id = $((r * 11 + 2500));"
  done
  echo "  events in changes.inventory.orders after the last change: $(end_offset changes.inventory.orders)"
  wait_quiet changes.inventory.orders 1800
  echo "  events in changes.inventory.orders at the end: $(end_offset changes.inventory.orders)"
  state changes-connector
  logged 'incremental snapshotting|ERROR|WARN'
  count changes.inventory.orders
  say "The last event of each row, compared with the table"
  state_file="$(mktemp)"
  val "SELECT id, quantity FROM inventory.orders" > "$state_file"
  kafka kafka-console-consumer.sh --bootstrap-server kafka:9092 --topic changes.inventory.orders --from-beginning \
    --timeout-ms 15000 --consumer-property allow.auto.create.topics=false |
    python3 -I count.py --compare "$state_file"
  rm -f "$state_file"
  ;;

all)
  LOG="logs/debezium-$DBZ_VERSION"
  mkdir -p "$LOG"
  rm -f "$LOG"/*.txt
  n=0
  for step in up include-list signal-unlisted signal-denied signal outside-list no-key stop restart blocking kafka-signal changes; do
    n=$((n + 1))
    file="$LOG/$(printf '%02d' "$n")-$step.txt"
    echo "== $step -> $file"
    { echo "# ./run.sh $step    Debezium $DBZ_VERSION, $MYSQL_IMAGE    $(date -u +%Y-%m-%dT%H:%M:%SZ)"; "$0" "$step"; } > "$file" 2>&1 < /dev/null || echo "   (step exited with an error, see the file)"
  done
  connect_log | grep -E "Kafka version|$SIGNAL_LINES|^Caused by: " |
    grep -vE "^[[:space:]]|[[:space:]]{3,}[a-z0-9._-]+ = |isn't a known config|Requested thread factory|Not updating high watermark" |
    cut -c1-500 > "$LOG/connect-log-excerpt.txt" || true
  "$0" down
  ;;

down)
  dc down -v --remove-orphans
  ;;

*)
  sed -n '2,21p' "$0"
  exit 1
  ;;
esac
