#!/usr/bin/env bash
# Lab: a Debezium connector that is RUNNING and captures nothing.
#
#   ./run.sh up                 start Kafka (topic auto-creation off), MySQL, PostgreSQL and Kafka Connect
#   ./run.sh filter-mysql       table.include.list in the wrong format on MySQL, then the fix and the backfill
#   ./run.sh filter-postgres    the same on PostgreSQL, where the schema name is the usual mistake
#   ./run.sh old-names          table.whitelist and its siblings on this Debezium version
#   ./run.sh snapshot-mysql     a snapshot mode that reads no existing rows, then the fix
#   ./run.sh snapshot-postgres  the same on PostgreSQL
#   ./run.sh topics             no topic.creation.default.* on a broker without auto-creation, then two fixes
#   ./run.sh publication        a PostgreSQL publication that lacks one of the tables, then two fixes
#   ./run.sh no-task            tasks.max=2: the connector is RUNNING and has no task, then the fix
#   ./run.sh topics-worker-off  restart the worker with topic.creation.enable=false, then turn it back on
#   ./run.sh all                every step above, in this order
#   ./run.sh down               remove everything
#
# Second stack, two workers (Debezium 3.7.1 only):
#   ./run.sh two-workers        both workers advertise "localhost": RUNNING with no task, then the fix
#   ./run.sh two-workers-down   remove it
#
# Old property names and an old Kafka Connect (amd64 image, slow to start on Apple silicon):
#   export LEGACY=1 DEBEZIUM_IMAGE=quay.io/debezium/connect:1.9 MYSQL_IMAGE=mysql:8.0 POSTGRES_IMAGE=postgres:13
#   ./run.sh up && ./run.sh all && ./run.sh down
#
# Set LOG_DIR=logs/<folder> to keep the status responses and log lines of a run.
set -eu
cd "$(dirname "$0")"

CONNECT="http://localhost:${CONNECT_PORT:-18083}"
LEGACY="${LEGACY:-0}"
LOG_DIR="${LOG_DIR:-}"
SETTLE="${SETTLE:-$([[ "$LEGACY" == 1 ]] && echo 25 || echo 10)}"
COMPOSE=(docker compose)
MARK=0

step() { printf '\n== %s\n' "$*"; }
kafka() { "${COMPOSE[@]}" exec -T -e KAFKA_HEAP_OPTS=-Xmx128m kafka /opt/kafka/bin/"$@" 2>/dev/null; }
my() { "${COMPOSE[@]}" exec -T mysql mysql -uroot -prootpw -N -e "$1" 2>/dev/null; }
pg() { "${COMPOSE[@]}" exec -T postgres psql -U postgres -d inventory -At -c "$1"; }
save() { # file name: copy stdin to the terminal and, when LOG_DIR is set, to a file
  if [[ -n "$LOG_DIR" ]]; then mkdir -p "$LOG_DIR"; tee "$LOG_DIR/$1" | cut -c1-600; else cut -c1-600; fi
}
connect_log() { "${COMPOSE[@]}" logs --no-color --no-log-prefix "${1:-connect}" 2>/dev/null; }
mark() { MARK=$(connect_log | wc -l | tr -d ' '); }
since_mark() { connect_log | tail -n +"$((MARK + 1))"; }
wait_log() { # pattern, seconds: wait for a log line written after the last mark
  for _ in $(seq 1 "$2"); do
    if [[ "$(since_mark | grep -cE "$1")" -gt 0 ]]; then return 0; fi
    sleep 1
  done
  echo "  (no log line matched /$1/ in $2 s)"; return 0
}
state() {
  curl -s "$CONNECT/connectors/$1/status" |
    python3 -c 'import sys,json; d=json.load(sys.stdin); print("connector=%s tasks=[%s]" % (d["connector"]["state"], ",".join(t["state"] for t in d.get("tasks",[]))))' 2>/dev/null || true
}
wait_for() { # connector name, pattern, seconds
  local s=""
  for _ in $(seq 1 "$3"); do
    s="$(state "$1")"
    if [[ "$s" =~ $2 ]]; then echo "  $1: $s"; return 0; fi
    sleep 1
  done
  echo "  $1: $s (gave up waiting for /$2/)"; return 0
}
status() { curl -s "$CONNECT/connectors/$1/status" | python3 -m json.tool; }
cause() { # connector name: the exception lines of a failed task, without stack frames
  curl -s "$CONNECT/connectors/$1/status" |
    python3 -c 'import sys,json
for t in json.load(sys.stdin).get("tasks",[]):
    for l in t.get("trace","").splitlines():
        if not l.startswith("\tat ") and not l.startswith("\t..."): print("  "+l[:400])'
}
put() { # connector name, configuration as JSON
  local out code
  out="$(curl -s -w '\n%{http_code}' -X PUT -H 'Content-Type: application/json' --data "$2" "$CONNECT/connectors/$1/config")"
  code="${out##*$'\n'}"
  echo "  PUT /connectors/$1/config: $code"
  if [[ "$code" != 2* ]]; then echo "${out%$'\n'*}" | python3 -c 'import sys,json; print("  "+json.load(sys.stdin).get("message","")[:900])' 2>/dev/null || true; fi
}
rest() { curl -s -o /dev/null -w "  $1 $2: %{http_code}\n" -X "$1" "$CONNECT$2"; }
drop() { # connector name, then for PostgreSQL the prefix whose slot and publication go too
  rest DELETE "/connectors/$1"
  if [[ -n "${2:-}" ]]; then
    for _ in $(seq 1 60); do # a slot can be dropped only once the task has let go of it
      [[ "$(pg "SELECT count(*) FROM pg_replication_slots WHERE slot_name = '$2_slot' AND active" 2>/dev/null)" == 0 ]] && break
      sleep 1
    done
    pg "SELECT pg_drop_replication_slot(slot_name) FROM pg_replication_slots WHERE slot_name = '$2_slot'" > /dev/null 2>&1 || true
    pg "DROP PUBLICATION IF EXISTS $2_pub" > /dev/null 2>&1 || true
  fi
}
topics() { # prefix: every topic of that prefix with its end offset (the number of events written)
  local out
  out="$(kafka kafka-get-offsets.sh --bootstrap-server kafka:9092 --topic "^$1(\\..*)?\$" | sort || true)"
  if [[ -n "$out" ]]; then echo "$out" | sed 's/^/  /'; else echo "  (no topic starts with $1)"; fi
}
events() { # topic: one line per change event
  kafka kafka-console-consumer.sh --bootstrap-server kafka:9092 --topic "$1" --from-beginning --timeout-ms 8000 |
    python3 -c 'import sys,json
for line in sys.stdin:
    try: p = json.loads(line)["payload"]
    except Exception: continue
    row = p.get("after") or p.get("before") or {}
    print("  op=%s snapshot=%s id=%s columns=%s" % (p.get("op"), p.get("source",{}).get("snapshot"), row.get("id"), ",".join(row.keys())))'
}
offsets() { # connector name: the stored offsets (the endpoint exists from Kafka Connect 3.5)
  printf '  GET /connectors/%s/offsets: ' "$1"; curl -s "$CONNECT/connectors/$1/offsets" | cut -c1-300; echo
}
validate() { # connector class short name, configuration as JSON, property: the validation errors for it
  curl -s -X PUT -H 'Content-Type: application/json' --data "$2" "$CONNECT/connector-plugins/$1/config/validate" |
    python3 -c 'import sys,json
d = json.load(sys.stdin)
for c in d.get("configs",[]):
    if c["value"]["name"] == sys.argv[1]:
        print("  %s=%s errors=%s" % (sys.argv[1], c["value"].get("value"), c["value"].get("errors")))' "$3"
}

# Connector configurations. Debezium 2.0 renamed database.server.name to topic.prefix and
# database.history.* to schema.history.internal.*. Extra arguments are key=value pairs; a value
# of "-" removes the key.
mysql_config() { # topic prefix, key=value ...
  python3 - "$LEGACY" "$@" <<'PY'
import json, sys
legacy, prefix, extra = sys.argv[1] == "1", sys.argv[2], sys.argv[3:]
c = {
    "connector.class": "io.debezium.connector.mysql.MySqlConnector", "tasks.max": "1",
    "database.hostname": "mysql", "database.port": "3306",
    "database.user": "debezium", "database.password": "dbz",
    "database.server.id": str(184000 + sum(map(ord, prefix)) % 1000),
    "database.include.list": "inventory",
    "topic.creation.default.replication.factor": "1",
    "topic.creation.default.partitions": "1",
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
pg_config() { # topic prefix, key=value ...
  python3 - "$LEGACY" "$@" <<'PY'
import json, sys
legacy, prefix, extra = sys.argv[1] == "1", sys.argv[2], sys.argv[3:]
c = {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector", "tasks.max": "1",
    "database.hostname": "postgres", "database.port": "5432",
    "database.user": "postgres", "database.password": "postgrespw",
    "database.dbname": "inventory", "plugin.name": "pgoutput",
    "slot.name": prefix + "_slot", "publication.name": prefix + "_pub",
    "topic.creation.default.replication.factor": "1",
    "topic.creation.default.partitions": "1",
}
c["database.server.name" if legacy else "topic.prefix"] = prefix
for kv in extra:
    k, _, v = kv.partition("=")
    if v == "-": c.pop(k, None)
    else: c[k] = v
print(json.dumps(c))
PY
}
history_topic() { echo "schemahistory.$1"; }
no_data_mode() { # database: the snapshot mode that reads the structure and no rows
  if [[ "$LEGACY" == 1 ]]; then [[ "$1" == mysql ]] && echo schema_only || echo never; else echo no_data; fi
}

# Read the existing rows with a connector that already has offsets.
# Kafka Connect 3.6 and later: stop the connector, delete its offsets, start it again.
# Before that: register the same configuration under a new connector name.
resnapshot() { # connector name, configuration as JSON, history topic to delete (MySQL) or ""
  if [[ "$LEGACY" == 1 ]]; then
    rest DELETE "/connectors/$1"; sleep 5
    [[ -n "$3" ]] && { kafka kafka-topics.sh --bootstrap-server kafka:9092 --delete --topic "$3" || true; sleep 3; }
    mark; put "$1-v2" "$2"
    wait_for "$1-v2" 'RUNNING tasks=\[RUNNING\]' 180; wait_log 'Starting streaming' 180
  else
    rest PUT "/connectors/$1/stop"; sleep 5
    printf '  DELETE /connectors/%s/offsets: ' "$1"; curl -s -X DELETE "$CONNECT/connectors/$1/offsets"; echo
    [[ -n "$3" ]] && { kafka kafka-topics.sh --bootstrap-server kafka:9092 --delete --topic "$3" || true; sleep 3; }
    put "$1" "$2"
    mark; rest PUT "/connectors/$1/resume"
    wait_for "$1" 'RUNNING tasks=\[RUNNING\]' 120; wait_log 'Starting streaming' 120
  fi
  sleep "$SETTLE"
}

try_filter() { # mysql|postgres, topic prefix, table.include.list value: does a new connector capture customers?
  mark
  if [[ "$1" == mysql ]]; then put "try-$2" "$(mysql_config "$2" table.include.list="$3")"
  else put "try-$2" "$(pg_config "$2" table.include.list="$3")"; fi
  wait_for "try-$2" 'RUNNING tasks=\[RUNNING\]' 180; wait_log 'Starting streaming' 180; sleep "$SETTLE"
  echo "  table.include.list=$3 warnings=$(since_mark | grep -c 'no changes will be captured')"
  topics "$2"
  if [[ "$1" == mysql ]]; then drop "try-$2"; else drop "try-$2" "$2"; fi
}

filter_mysql() {
  step "MySQL 1: table.include.list=customers (no database name)"
  mark; put my-filter "$(mysql_config myf table.include.list=customers)"
  wait_for my-filter 'RUNNING tasks=\[RUNNING\]' 180; wait_log 'Starting streaming' 180; sleep "$SETTLE"
  status my-filter | save 01-filter-mysql-status.json
  since_mark | grep -E 'no changes will be captured' | save 01-filter-mysql-warning.txt
  echo "  tables as MySQL names them:"; my "SELECT CONCAT(table_schema, '.', table_name) FROM information_schema.tables WHERE table_schema = 'inventory'" | sed 's/^/    /'
  my "INSERT INTO inventory.customers (first_name,last_name,email) VALUES ('Wrong','Filter','wrong.filter@example.com')"
  sleep "$SETTLE"; topics myf
  offsets my-filter | save 01-filter-mysql-offsets.txt

  step "MySQL 2: other values, each on a new connector"
  try_filter mysql myc INVENTORY.CUSTOMERS | save 01-filter-mysql-other-values.txt
  try_filter mysql myg 'inventory.cust*' | save 01-filter-mysql-other-values-2.txt

  step "MySQL 3: fix on the same connector, table.include.list=inventory.customers"
  mark; put my-filter "$(mysql_config myf table.include.list=inventory.customers)"
  wait_for my-filter 'RUNNING tasks=\[RUNNING\]' 180; wait_log 'Starting streaming' 180; sleep "$SETTLE"
  echo "  warnings after the fix: $(since_mark | grep -c 'no changes will be captured' || true)"
  since_mark | grep -E 'previous offset|snapshot.*(skipp|not be|found)' | save 01-filter-mysql-after-fix-log.txt || true
  topics myf
  my "INSERT INTO inventory.customers (first_name,last_name,email) VALUES ('After','Fix','after.fix@example.com')"
  sleep "$SETTLE"; topics myf
  echo "  rows in inventory.customers: $(my 'SELECT COUNT(*) FROM inventory.customers')"
  events myf.inventory.customers

  step "MySQL 4: read the rows that were there before the fix"
  resnapshot my-filter "$(mysql_config myf table.include.list=inventory.customers)" "$(history_topic myf)"
  topics myf
  events myf.inventory.customers | sort | uniq -c | sed 's/^/  /' | save 01-filter-mysql-after-backfill.txt
  drop my-filter; [[ "$LEGACY" == 1 ]] && drop my-filter-v2

  step "MySQL 5: column.include.list=id,email (no database and table name), table list correct"
  mark; put my-columns "$(mysql_config myk table.include.list=inventory.customers column.include.list=id,email)"
  wait_for my-columns 'RUNNING tasks=\[RUNNING\]|FAILED' 180; wait_log 'Starting streaming' 120; sleep "$SETTLE"
  { state my-columns; cause my-columns; topics myk; events myk.inventory.customers | head -2; } | save 01-filter-mysql-columns.txt
  mark; put my-columns "$(mysql_config myk table.include.list=inventory.customers 'column.include.list=inventory\.customers\.(id|email)')"
  wait_for my-columns 'RUNNING tasks=\[RUNNING\]' 180; wait_log 'Starting streaming' 120; sleep "$SETTLE"
  my "INSERT INTO inventory.customers (first_name,last_name,email) VALUES ('Column','Filter','column.filter@example.com')"
  sleep "$SETTLE"
  { echo "  with column.include.list=inventory\\.customers\\.(id|email):"; topics myk; events myk.inventory.customers | tail -1; } | save 01-filter-mysql-columns-fixed.txt
  drop my-columns
  return 0
}

filter_postgres() {
  step "PostgreSQL 1: table.include.list=inventory.customers (database name where the schema belongs)"
  mark; put pg-filter "$(pg_config pgf table.include.list=inventory.customers)"
  wait_for pg-filter 'RUNNING tasks=\[RUNNING\]' 180; wait_log 'Starting streaming' 180; sleep "$SETTLE"
  status pg-filter | save 02-filter-postgres-status.json
  since_mark | grep -E 'no changes will be captured' | save 02-filter-postgres-warning.txt
  echo "  tables as PostgreSQL names them:"; pg "SELECT schemaname || '.' || tablename FROM pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema')" | sed 's/^/    /'
  echo "  publication (name|all tables): $(pg "SELECT pubname, puballtables FROM pg_publication WHERE pubname = 'pgf_pub'")"
  echo "  slot (name|active): $(pg "SELECT slot_name, active FROM pg_replication_slots WHERE slot_name = 'pgf_slot'")"
  pg "INSERT INTO public.customers (first_name,last_name,email) VALUES ('Wrong','Filter','wrong.filter@example.com')" > /dev/null
  sleep "$SETTLE"; topics pgf

  step "PostgreSQL 2: table.include.list=customers (no schema name)"
  mark; put pg-filter "$(pg_config pgf table.include.list=customers)"
  wait_for pg-filter 'RUNNING tasks=\[RUNNING\]' 180; wait_log 'Starting streaming' 180; sleep "$SETTLE"
  echo "  warnings: $(since_mark | grep -c 'no changes will be captured' || true)"
  topics pgf
  offsets pg-filter | save 02-filter-postgres-offsets.txt
  echo "  'No previous offsets found' lines since the change: $(since_mark | grep -c 'No previous offsets found' || true)"

  step "PostgreSQL 3: other values, each on a new connector"
  try_filter postgres pgc PUBLIC.CUSTOMERS | save 02-filter-postgres-other-values.txt
  try_filter postgres pgd inventory.public.customers | save 02-filter-postgres-other-values-2.txt

  step "PostgreSQL 4: fix on the same connector, table.include.list=public.customers"
  mark; put pg-filter "$(pg_config pgf table.include.list=public.customers)"
  wait_for pg-filter 'RUNNING tasks=\[RUNNING\]' 180; wait_log 'Starting streaming' 180; sleep "$SETTLE"
  echo "  warnings after the fix: $(since_mark | grep -c 'no changes will be captured' || true)"
  echo "  rows in public.customers: $(pg 'SELECT COUNT(*) FROM public.customers')"
  topics pgf
  events pgf.public.customers | sort | uniq -c | sed 's/^/  /' | save 02-filter-postgres-after-fix.txt
  pg "INSERT INTO public.customers (first_name,last_name,email) VALUES ('After','Fix','after.fix@example.com')" > /dev/null
  sleep "$SETTLE"; topics pgf
  drop pg-filter pgf

  step "PostgreSQL 5: the same wrong filter with publication.autocreate.mode=filtered"
  mark; put pg-filter-filtered "$(pg_config pgg table.include.list=inventory.customers publication.autocreate.mode=filtered)"
  wait_for pg-filter-filtered 'FAILED|RUNNING tasks=\[RUNNING\]' 120; sleep "$SETTLE"
  status pg-filter-filtered | save 02-filter-postgres-filtered-status.json
  cause pg-filter-filtered
  drop pg-filter-filtered pgg
}

old_names() {
  step "MySQL: database.whitelist, table.whitelist and column.whitelist in place of the include lists"
  mark; put my-oldnames "$(mysql_config myo database.include.list=- database.whitelist=inventory table.whitelist=inventory.customers 'column.whitelist=inventory\.customers\.(id|email)')"
  wait_for my-oldnames 'RUNNING tasks=\[RUNNING\]' 180; wait_log 'Starting streaming' 180; sleep "$SETTLE"
  since_mark | grep -iE 'whitelist' | grep -vE '^\s+[a-z.]+ = ' | head -5 | save 03-old-names-mysql-log.txt || true
  topics myo
  events myo.inventory.customers | head -1
  drop my-oldnames

  step "PostgreSQL: schema.whitelist and table.whitelist in place of the include lists"
  mark; put pg-oldnames "$(pg_config pgo schema.whitelist=public table.whitelist=public.customers)"
  wait_for pg-oldnames 'RUNNING tasks=\[RUNNING\]' 180; wait_log 'Starting streaming' 180; sleep "$SETTLE"
  since_mark | grep -iE 'whitelist' | grep -vE '^\s+[a-z.]+ = ' | head -5 | save 03-old-names-postgres-log.txt || true
  topics pgo
  drop pg-oldnames pgo
}

snapshot_mysql() {
  local mode; mode="$(no_data_mode mysql)"
  step "MySQL 1: snapshot.mode=$mode"
  mark; put my-snapshot "$(mysql_config mys table.include.list=inventory.orders snapshot.mode="$mode")"
  wait_for my-snapshot 'RUNNING tasks=\[RUNNING\]' 180; wait_log 'Starting streaming' 180; sleep "$SETTLE"
  status my-snapshot | save 04-snapshot-mysql-status.json
  since_mark | grep -E 'Snapshot (step|ended|completed|- Final)|snapshot.mode|According to the connector configuration' | save 04-snapshot-mysql-log.txt || true
  echo "  rows in inventory.orders: $(my 'SELECT COUNT(*) FROM inventory.orders')"
  topics mys
  my "INSERT INTO inventory.orders (customer_id, quantity) VALUES (1, 7)"
  sleep "$SETTLE"; topics mys
  events mys.inventory.orders

  step "MySQL 2: change snapshot.mode to initial on the same connector"
  mark; put my-snapshot "$(mysql_config mys table.include.list=inventory.orders snapshot.mode=initial)"
  wait_for my-snapshot 'RUNNING tasks=\[RUNNING\]' 180; wait_log 'Starting streaming' 180; sleep "$SETTLE"
  since_mark | grep -E 'previous offset|Snapshot ended|snapshot.*(skipp|not be|found)' | save 04-snapshot-mysql-initial-log.txt || true
  topics mys

  step "MySQL 3: read the existing rows"
  resnapshot my-snapshot "$(mysql_config mys table.include.list=inventory.orders snapshot.mode=initial)" "$(history_topic mys)"
  topics mys
  events mys.inventory.orders | sort | uniq -c | sed 's/^/  /'
  drop my-snapshot; [[ "$LEGACY" == 1 ]] && drop my-snapshot-v2

  step "MySQL 4: does this version accept the snapshot mode name of the other one?"
  local other; other="$([[ "$LEGACY" == 1 ]] && echo no_data || echo schema_only)"
  validate MySqlConnector "$(mysql_config myv snapshot.mode="$other")" snapshot.mode | save 04-snapshot-mysql-other-name.txt
  return 0
}

snapshot_postgres() {
  local mode; mode="$(no_data_mode postgres)"
  step "PostgreSQL 1: snapshot.mode=$mode"
  mark; put pg-snapshot "$(pg_config pgs table.include.list=public.orders snapshot.mode="$mode")"
  wait_for pg-snapshot 'RUNNING tasks=\[RUNNING\]' 180; wait_log 'Starting streaming' 180; sleep "$SETTLE"
  status pg-snapshot | save 05-snapshot-postgres-status.json
  since_mark | grep -E 'Snapshot (step|ended|completed|- Final)|snapshot.mode|According to the connector configuration|no snapshot' | save 05-snapshot-postgres-log.txt || true
  echo "  rows in public.orders: $(pg 'SELECT COUNT(*) FROM public.orders')"
  topics pgs
  pg "INSERT INTO public.orders (customer_id, quantity) VALUES (1, 7)" > /dev/null
  sleep "$SETTLE"; topics pgs
  events pgs.public.orders

  step "PostgreSQL 2: change snapshot.mode to initial on the same connector"
  mark; put pg-snapshot "$(pg_config pgs table.include.list=public.orders snapshot.mode=initial)"
  wait_for pg-snapshot 'RUNNING tasks=\[RUNNING\]' 180; wait_log 'Starting streaming' 180; sleep "$SETTLE"
  since_mark | grep -E 'previous offset|Previous snapshot|Snapshot ended|snapshot.*(skipp|not be|found)' | save 05-snapshot-postgres-initial-log.txt || true
  topics pgs

  step "PostgreSQL 3: read the existing rows"
  resnapshot pg-snapshot "$(pg_config pgs table.include.list=public.orders snapshot.mode=initial $([[ "$LEGACY" == 1 ]] && echo slot.name=pgs2_slot))" ""
  topics pgs
  events pgs.public.orders | sort | uniq -c | sed 's/^/  /'
  if [[ "$LEGACY" == 1 ]]; then
    drop pg-snapshot-v2 pgs2
    pg "SELECT pg_drop_replication_slot('pgs_slot')" > /dev/null 2>&1 || true
    pg "DROP PUBLICATION IF EXISTS pgs_pub" > /dev/null 2>&1 || true
  else
    drop pg-snapshot pgs
  fi

  step "PostgreSQL 4: does this version accept the snapshot mode name of the other one?"
  local other; other="$([[ "$LEGACY" == 1 ]] && echo no_data || echo never)"
  validate PostgresConnector "$(pg_config pgv snapshot.mode="$other")" snapshot.mode | save 05-snapshot-postgres-other-name.txt
  return 0
}

topics_step() {
  step "Broker: auto.create.topics.enable"
  kafka kafka-configs.sh --bootstrap-server kafka:9092 --describe --entity-type brokers --entity-name 1 --all | grep -E 'auto.create.topics.enable' | sed 's/^ */  /' | save 06-topics-broker-setting.txt

  step "MySQL 1: connector without topic.creation.default.*"
  mark; put my-topics "$(mysql_config myt topic.creation.default.replication.factor=- topic.creation.default.partitions=-)"
  wait_for my-topics 'RUNNING tasks=\[RUNNING\]' 180; sleep $((SETTLE * 3))
  status my-topics | save 06-topics-mysql-status.json
  echo "  UNKNOWN_TOPIC_OR_PARTITION lines so far: $(since_mark | grep -c 'UNKNOWN_TOPIC_OR_PARTITION' || true)"
  since_mark | grep -E 'UNKNOWN_TOPIC_OR_PARTITION' | tail -3 | save 06-topics-mysql-log.txt || true
  topics myt
  echo "  topics that do exist for this connector:"; kafka kafka-topics.sh --bootstrap-server kafka:9092 --list | grep -E 'myt' | sed 's/^/    /' || true

  step "MySQL 2: fix, add topic.creation.default.replication.factor and topic.creation.default.partitions"
  mark; put my-topics "$(mysql_config myt)"
  wait_for my-topics 'RUNNING tasks=\[RUNNING\]' 180; wait_log 'Created topic' 120; sleep "$SETTLE"
  since_mark | grep -E "Created topic" | head -4 | save 06-topics-mysql-fix-log.txt || true
  topics myt
  drop my-topics

  step "PostgreSQL 1: connector without topic.creation.default.*"
  mark; put pg-topics "$(pg_config pgt topic.creation.default.replication.factor=- topic.creation.default.partitions=-)"
  wait_for pg-topics 'RUNNING tasks=\[RUNNING\]' 180; sleep $((SETTLE * 3))
  status pg-topics | save 06-topics-postgres-status.json
  since_mark | grep -E 'UNKNOWN_TOPIC_OR_PARTITION' | tail -3 | save 06-topics-postgres-log.txt || true
  topics pgt

  step "PostgreSQL 2: fix without touching the connector, create the topics by hand"
  for t in pgt.public.customers pgt.public.orders; do
    kafka kafka-topics.sh --bootstrap-server kafka:9092 --create --topic "$t" --partitions 1 --replication-factor 1 | sed 's/^/  /'
  done
  sleep $((SETTLE * 3)); topics pgt
  drop pg-topics pgt
}

publication() {
  step "PostgreSQL 1: a publication that exists already and holds one of the two tables"
  pg "CREATE PUBLICATION pgp_pub FOR TABLE public.orders" | sed 's/^/  /'
  mark; put pg-publication "$(pg_config pgp table.include.list=public.customers,public.orders)"
  wait_for pg-publication 'RUNNING tasks=\[RUNNING\]' 180; wait_log 'Starting streaming' 180; sleep "$SETTLE"
  status pg-publication | save 07-publication-status.json
  since_mark | grep -E 'PostgresReplicationConnection' | grep -iE 'publication' | head -5 | save 07-publication-log.txt || true
  echo "  after the snapshot:"; topics pgp
  pg "INSERT INTO public.customers (first_name,last_name,email) VALUES ('Not','Published','not.published@example.com')" > /dev/null
  pg "INSERT INTO public.orders (customer_id, quantity) VALUES (2, 5)" > /dev/null
  sleep "$SETTLE"; echo "  after one insert into each table:"; topics pgp
  echo "  tables in the publication:"; pg "SELECT pubname, schemaname, tablename FROM pg_publication_tables WHERE pubname = 'pgp_pub'" | sed 's/^/    /' | save 07-publication-tables.txt

  step "PostgreSQL 2: fix, ALTER PUBLICATION ... ADD TABLE"
  pg "ALTER PUBLICATION pgp_pub ADD TABLE public.customers" | sed 's/^/  /'
  pg "INSERT INTO public.customers (first_name,last_name,email) VALUES ('Now','Published','now.published@example.com')" > /dev/null
  sleep "$SETTLE"; topics pgp
  echo "  rows in public.customers: $(pg 'SELECT COUNT(*) FROM public.customers')"
  events pgp.public.customers | tail -3
  drop pg-publication pgp

  step "PostgreSQL 3: the same starting point with publication.autocreate.mode=filtered"
  pg "CREATE PUBLICATION pgq_pub FOR TABLE public.orders" | sed 's/^/  /'
  mark; put pg-publication-filtered "$(pg_config pgq table.include.list=public.customers,public.orders publication.autocreate.mode=filtered)"
  wait_for pg-publication-filtered 'RUNNING tasks=\[RUNNING\]' 180; wait_log 'Starting streaming' 180; sleep "$SETTLE"
  since_mark | grep -E 'PostgresReplicationConnection' | grep -iE 'publication' | head -5 | save 07-publication-filtered-log.txt || true
  echo "  tables in the publication:"; pg "SELECT pubname, schemaname, tablename FROM pg_publication_tables WHERE pubname = 'pgq_pub'" | sed 's/^/    /' | save 07-publication-filtered-tables.txt
  pg "INSERT INTO public.customers (first_name,last_name,email) VALUES ('Filtered','Mode','filtered.mode@example.com')" > /dev/null
  sleep "$SETTLE"; topics pgq
  drop pg-publication-filtered pgq
}

no_task() {
  step "MySQL 1: tasks.max=2"
  mark; put my-notask "$(mysql_config myn tasks.max=2)"
  wait_for my-notask 'RUNNING tasks=\[\]' 60; sleep $((SETTLE * 2))
  status my-notask | save 08-no-task-mysql-status.json
  since_mark | grep -E "Failed to reconfigure connector's tasks|Only a single connector task" | head -4 | save 08-no-task-mysql-log.txt || true
  topics myn

  step "MySQL 2: fix, tasks.max=1"
  mark; put my-notask "$(mysql_config myn tasks.max=1)"
  wait_for my-notask 'RUNNING tasks=\[RUNNING\]' 180; wait_log 'Starting streaming' 180; sleep "$SETTLE"
  topics myn
  drop my-notask

  step "PostgreSQL: tasks.max=2"
  mark; put pg-notask "$(pg_config pgn tasks.max=2)"
  wait_for pg-notask 'RUNNING tasks=\[RUNNING\]' 120; sleep "$SETTLE"
  status pg-notask | save 08-no-task-postgres-status.json
  drop pg-notask pgn
}

topics_worker_off() {
  step "Worker: restart with topic.creation.enable=false"
  TOPIC_CREATION_ENABLE=false "${COMPOSE[@]}" up -d connect 2>&1 | tail -1
  curl -sf --retry 150 --retry-delay 2 --retry-all-errors -o /dev/null "$CONNECT/connectors"
  connect_log | grep -E 'topic.creation.enable = ' | tail -1 | awk '{print "  " $1, $2, $3}'
  mark; put my-topics-off "$(mysql_config myw)"
  wait_for my-topics-off 'RUNNING tasks=\[RUNNING\]' 180; sleep $((SETTLE * 3))
  status my-topics-off | save 09-topics-worker-off-status.json
  echo "  UNKNOWN_TOPIC_OR_PARTITION lines so far: $(since_mark | grep -c 'UNKNOWN_TOPIC_OR_PARTITION' || true)"
  { since_mark | grep -iE 'topic.creation|topic creation' | grep -vE '^\s+[a-z.]+ = |were supplied but' | cut -c1-400 | head -4
    since_mark | grep -E 'UNKNOWN_TOPIC_OR_PARTITION' | tail -2; } | save 09-topics-worker-off-log.txt || true
  topics myw

  step "Worker: back to topic.creation.enable=true"
  "${COMPOSE[@]}" up -d connect 2>&1 | tail -1
  curl -sf --retry 150 --retry-delay 2 --retry-all-errors -o /dev/null "$CONNECT/connectors"
  wait_for my-topics-off 'RUNNING tasks=\[RUNNING\]' 180; sleep $((SETTLE * 2))
  topics myw
  drop my-topics-off
}

two_workers() {
  COMPOSE=(docker compose -f docker-compose.two-workers.yml)
  local second="http://localhost:${CONNECT_PORT_2:-18084}"
  step "Two workers 1: both advertise localhost"
  "${COMPOSE[@]}" up -d --wait kafka postgres connect-1 2>&1 | tail -1
  curl -sf --retry 150 --retry-delay 2 --retry-all-errors -o /dev/null "$CONNECT/connectors"
  put pg-first "$(pg_config pwa)"
  wait_for pg-first 'RUNNING tasks=\[RUNNING\]' 120
  "${COMPOSE[@]}" up -d connect-2 2>&1 | tail -1
  curl -sf --retry 150 --retry-delay 2 --retry-all-errors -o /dev/null "$second/connectors"
  sleep 20
  put pg-second "$(pg_config pwb)"
  wait_for pg-second 'RUNNING tasks=\[\]' 60; sleep 30
  status pg-second | save 10-two-workers-status.json
  for w in connect-1 connect-2; do
    echo "  $w:"
    connect_log "$w" | grep -E -A1 "Creating connector pg-second|Failed to reconfigure connector's tasks|Request to leader to reconfigure" | grep -vE '^--$|^\s+at ' | cut -c1-520 | tail -5 | sed 's/^/    /'
  done | save 10-two-workers-log.txt
  topics pwb

  step "Two workers 2: fix, each worker advertises a name the other one resolves"
  ADVERTISED_1=connect-1 ADVERTISED_2=connect-2 "${COMPOSE[@]}" up -d connect-1 connect-2 2>&1 | tail -1
  curl -sf --retry 150 --retry-delay 2 --retry-all-errors -o /dev/null "$CONNECT/connectors"
  curl -sf --retry 150 --retry-delay 2 --retry-all-errors -o /dev/null "$second/connectors"
  wait_for pg-second 'RUNNING tasks=\[RUNNING\]' 240; sleep "$SETTLE"
  status pg-second | save 10-two-workers-status-fixed.json
  topics pwb
}

case "${1:-}" in
up)
  "${COMPOSE[@]}" up -d --wait
  curl -sf --retry 150 --retry-delay 2 --retry-all-errors -o /dev/null "$CONNECT/connectors"
  curl -s "$CONNECT/"; echo
  ;;
filter-mysql) filter_mysql ;;
filter-postgres) filter_postgres ;;
old-names) old_names ;;
snapshot-mysql) snapshot_mysql ;;
snapshot-postgres) snapshot_postgres ;;
topics) topics_step ;;
publication) publication ;;
no-task) no_task ;;
topics-worker-off) topics_worker_off ;;
all)
  filter_mysql; filter_postgres; old_names; snapshot_mysql; snapshot_postgres
  topics_step; publication; no_task; topics_worker_off
  ;;
two-workers) two_workers ;;
two-workers-down) docker compose -f docker-compose.two-workers.yml down -v ;;
down)
  "${COMPOSE[@]}" down -v
  ;;
*)
  sed -n '2,25p' "$0"; exit 1
  ;;
esac
