#!/usr/bin/env bash
# Lab: a Kafka Connect task is killed by one bad record and "will not recover until manually restarted".
#
#   ./run.sh up           start Kafka, PostgreSQL and Kafka Connect; a file sink reads the "orders" topic
#   ./run.sh break        write one record that is not JSON: the sink task is killed
#   ./run.sh restart      the three restart calls; none helps while the record is still there
#   ./run.sh dlq          errors.tolerance=all with a dead letter queue: the same pipeline continues
#   ./run.sh dlq-rf       a dead letter queue on one broker with the default replication factor
#   ./run.sh silent       errors.tolerance=all and nothing else: the record is dropped without a trace
#   ./run.sh skip         no dead letter queue: find the record and move the sink's offset past it,
#                         and what the same jump costs a sink that has written nothing yet
#   ./run.sh source       the same wrapper on a source task, where the dead letter queue does nothing
#   ./run.sh put-failure  a record the sink itself rejects (Debezium JDBC sink, needs Debezium 2.2 or later)
#   ./run.sh all          every step above, in this order
#   ./run.sh down         remove everything
#
# Old Kafka Connect (amd64 image, slow to start on Apple silicon):
#   export LEGACY=1 CONNECT_IMAGE=quay.io/debezium/connect:1.9 KAFKA_VERSION=3.2.0
#   ./run.sh up && ./run.sh all && ./run.sh down
#
# Set LOG_DIR=logs/<folder> to keep the status responses and log lines of a run.
set -eu
cd "$(dirname "$0")"

CONNECT="http://localhost:${CONNECT_PORT:-18083}"
LEGACY="${LEGACY:-0}"
LOG_DIR="${LOG_DIR:-}"
SETTLE="${SETTLE:-$([[ "$LEGACY" == 1 ]] && echo 20 || echo 8)}"
MARK=0

step() { printf '\n== %s\n' "$*"; }
kafka() { docker compose exec -T -e KAFKA_HEAP_OPTS=-Xmx128m kafka /opt/kafka/bin/"$@" 2>/dev/null; }
pg() { docker compose exec -T postgres psql -U postgres -d inventory -At -c "$1"; }
save() { # file name: copy stdin to the terminal and, when LOG_DIR is set, to a file
  if [[ -n "$LOG_DIR" ]]; then mkdir -p "$LOG_DIR"; tee "$LOG_DIR/$1" | cut -c1-700; else cut -c1-700; fi
}
connect_log() { docker compose logs --no-color --no-log-prefix connect 2>/dev/null; }
mark() { MARK=$(connect_log | wc -l | tr -d ' '); }
since_mark() { connect_log | tail -n +"$((MARK + 1))"; }
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
ensure_running() { # connector name: after a configuration change, restart the task by hand if it stayed FAILED
  wait_for "$1" 'RUNNING tasks=\[RUNNING\]' 30
  if [[ "$(state "$1")" != *"tasks=[RUNNING]"* ]]; then
    echo "  the task did not pick up the new configuration by itself: restarting it"
    rest POST "/connectors/$1/tasks/0/restart"
    wait_for "$1" 'RUNNING tasks=\[RUNNING\]' 90
  fi
}
status() { curl -s "$CONNECT/connectors/$1/status" | python3 -m json.tool; }
# The real cause under the wrapper: the exception lines of the task trace, without the stack frames.
cause() { curl -s "$CONNECT/connectors/$1/status" | jq -r '.tasks[].trace // empty' | grep -vE '^[[:space:]]+(at |\.\.\. )' | cut -c1-600; }
put() { # connector name, configuration as JSON
  local out code
  out="$(curl -s -w '\n%{http_code}' -X PUT -H 'Content-Type: application/json' --data "$2" "$CONNECT/connectors/$1/config")"
  code="${out##*$'\n'}"
  echo "  PUT /connectors/$1/config: $code"
  if [[ "$code" != 2* ]]; then echo "${out%$'\n'*}" | jq -r '.message // empty' | cut -c1-900 | sed 's/^/  /'; fi
}
rest() { # method, path: the code and the body, if any
  local out; out="$(curl -s -w '\n%{http_code}' -X "$1" "$CONNECT$2")"
  echo "  $1 $2: HTTP ${out##*$'\n'} $(echo "${out%$'\n'*}" | cut -c1-260)"
}
produce() { # topic: one record per line of stdin
  docker compose exec -T -e KAFKA_HEAP_OPTS=-Xmx128m kafka /opt/kafka/bin/kafka-console-producer.sh --bootstrap-server kafka:9092 --topic "$1" > /dev/null 2>&1
}
count() { # topic: its end offset, which is the number of records written to it
  local out; out="$(kafka kafka-get-offsets.sh --bootstrap-server kafka:9092 --topic "^$1\$" || true)"
  echo "  ${out:-$1: no such topic}"
}
lines() { # connector name: what the file sink wrote
  docker compose exec -T connect sh -c "cat /tmp/$1.txt 2>/dev/null" | sed 's/^/    /'
  echo "  /tmp/$1.txt: $(docker compose exec -T connect sh -c "cat /tmp/$1.txt 2>/dev/null | wc -l" | tr -d ' ') lines"
}
group() { # connector name: the consumer group of a sink connector is connect-<name>
  kafka kafka-consumer-groups.sh --bootstrap-server kafka:9092 --describe --group "connect-$1" | grep -vE '^\s*$' | awk '{print "  " $1, $2, $3, $4, $5, $6}'
}
kills() { connect_log | grep -c "WorkerSinkTask{id=$1-0} Task threw an uncaught and unrecoverable exception" || true; }

file_sink() { # connector name, key=value ...
  python3 - "$@" <<'PY'
import json, sys
name, extra = sys.argv[1], sys.argv[2:]
c = {
    "connector.class": "org.apache.kafka.connect.file.FileStreamSinkConnector", "tasks.max": "1",
    "topics": "orders", "file": "/tmp/%s.txt" % name,
    "key.converter": "org.apache.kafka.connect.storage.StringConverter",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter.schemas.enable": "false",
}
for kv in extra:
    k, _, v = kv.partition("=")
    c[k] = v
print(json.dumps(c))
PY
}
DLQ=(errors.tolerance=all errors.deadletterqueue.topic.name=dlq.orders errors.deadletterqueue.topic.replication.factor=1
  errors.deadletterqueue.context.headers.enable=true errors.log.enable=true errors.log.include.messages=true)

up() {
  docker compose up -d --wait
  curl -sf --retry 150 --retry-delay 2 --retry-all-errors -o /dev/null "$CONNECT/connectors"
  curl -s "$CONNECT/"; echo
  step "A topic with two good records and a file sink that reads it"
  kafka kafka-topics.sh --bootstrap-server kafka:9092 --create --topic orders --partitions 1 --replication-factor 1 | sed 's/^/  /'
  printf '%s\n' '{"id":1,"item":"book","quantity":1}' '{"id":2,"item":"pen","quantity":3}' | produce orders
  put orders-file-sink "$(file_sink orders-file-sink)"
  wait_for orders-file-sink 'RUNNING tasks=\[RUNNING\]' 120; sleep "$SETTLE"
  lines orders-file-sink
}

break_it() {
  step "One record that is not JSON, then two good ones"
  mark
  printf '%s\n' 'id=3;item=lamp;quantity=1' '{"id":4,"item":"desk","quantity":1}' '{"id":5,"item":"chair","quantity":2}' | produce orders
  wait_for orders-file-sink 'FAILED' 90; sleep 3
  status orders-file-sink | save 01-status-failed.json
  step "The log: the wrapper line and what precedes it"
  since_mark | grep -E 'orders-file-sink|Caused by|^org\.apache|^com\.fasterxml' | grep -E 'ERROR|Caused by|^org\.apache|^com\.fasterxml' | cut -c1-700 | head -12 | save 01-connect-log-excerpt.txt
  step "The cause, from the status endpoint"
  cause orders-file-sink | save 01-cause.txt
  step "What reached the sink, and where its consumer group stands"
  lines orders-file-sink
  sleep "$SETTLE"; group orders-file-sink | save 01-consumer-group.txt
  count orders
}

restart() {
  step "Restart calls while the bad record is still the next one to read"
  {
    echo "  times the task has been killed so far: $(kills orders-file-sink)"
    rest POST /connectors/orders-file-sink/restart; sleep "$SETTLE"
    echo "  after it: $(state orders-file-sink), killed $(kills orders-file-sink) times"
    rest POST /connectors/orders-file-sink/tasks/0/restart; sleep "$SETTLE"
    echo "  after it: $(state orders-file-sink), killed $(kills orders-file-sink) times"
    rest POST '/connectors/orders-file-sink/restart?includeTasks=true&onlyFailed=true'; sleep "$SETTLE"
    echo "  after it: $(state orders-file-sink), killed $(kills orders-file-sink) times"
  } | save 02-restart.txt
  lines orders-file-sink | tail -1
}

dlq() {
  step "errors.tolerance=all with a dead letter queue, on the same connector"
  mark; put orders-file-sink "$(file_sink orders-file-sink "${DLQ[@]}")"
  ensure_running orders-file-sink | save 03-after-config-change.txt; sleep "$SETTLE"
  status orders-file-sink | save 03-status-with-dlq.json
  lines orders-file-sink
  count dlq.orders
  step "The record in the dead letter queue, with its headers"
  kafka kafka-console-consumer.sh --bootstrap-server kafka:9092 --topic dlq.orders --from-beginning --max-messages 1 --timeout-ms 10000 \
    --formatter-property print.headers=true --formatter-property print.offset=true --formatter-property headers.separator='|' |
    python3 -c 'import sys
raw = sys.stdin.read().rstrip("\n")
head, _, value = raw.rpartition("\t")          # the record value comes last
offset, _, headers = head.partition("\t")
print("  " + offset)
for h in headers.split("|"):                    # a stack trace header spans many lines: keep the first
    if h.startswith("__connect.errors."): print("  header " + h.split("\n")[0][:300])
print("  value  " + value)' | save 03-dlq-record.txt
  step "The line that errors.log.enable writes"
  since_mark | grep -E 'Error encountered in task orders-file-sink' | cut -c1-900 | head -1 | save 03-errors-log-line.txt
  sleep "$SETTLE"; group orders-file-sink | save 03-consumer-group.txt
}

dlq_rf() {
  step "A dead letter queue without errors.deadletterqueue.topic.replication.factor, on one broker"
  mark; put orders-file-sink-rf "$(file_sink orders-file-sink-rf errors.tolerance=all errors.deadletterqueue.topic.name=dlq.orders.rf)"
  wait_for orders-file-sink-rf 'FAILED|tasks=\[RUNNING\]' 90; sleep 3
  { state orders-file-sink-rf; cause orders-file-sink-rf; } | save 04-dlq-rf-cause.txt
  step "Fix: set the replication factor to what the cluster has"
  put orders-file-sink-rf "$(file_sink orders-file-sink-rf errors.tolerance=all errors.deadletterqueue.topic.name=dlq.orders.rf errors.deadletterqueue.topic.replication.factor=1)"
  ensure_running orders-file-sink-rf; sleep "$SETTLE"
  lines orders-file-sink-rf | tail -1
  count dlq.orders.rf
  curl -s -o /dev/null -X DELETE "$CONNECT/connectors/orders-file-sink-rf"
}

silent() {
  step "errors.tolerance=all with no dead letter queue and no error logging"
  mark; put orders-file-sink-silent "$(file_sink orders-file-sink-silent errors.tolerance=all)"
  wait_for orders-file-sink-silent 'RUNNING tasks=\[RUNNING\]' 90; sleep "$SETTLE"
  {
    echo "  $(state orders-file-sink-silent)"
    lines orders-file-sink-silent
    echo "  log lines that mention the dropped record: $(since_mark | grep -cE 'Error encountered in task orders-file-sink-silent|JsonParseException|DataException' || true)"
  } | save 05-silent.txt
  curl -s -o /dev/null -X DELETE "$CONNECT/connectors/orders-file-sink-silent"
}

move_offset() { # connector name, topic, new offset, configuration as JSON
  if [[ "$LEGACY" == 1 ]]; then
    # Kafka Connect 3.2 has no stop and no offsets endpoint. The consumer group of the sink can
    # only be changed while no task is in it, so the connector is removed first.
    rest PUT "/connectors/$1/stop"
    rest DELETE "/connectors/$1"; sleep 10
    kafka kafka-consumer-groups.sh --bootstrap-server kafka:9092 --group "connect-$1" --topic "$2:0" --reset-offsets --to-offset "$3" --execute | grep -vE '^\s*$' | awk '{print "  " $1, $2, $3, $4}'
    put "$1" "$4"
  else
    rest PUT "/connectors/$1/stop"; sleep 5
    rest GET "/connectors/$1/offsets"
    printf '  PATCH /connectors/%s/offsets: ' "$1"
    curl -s -X PATCH -H 'Content-Type: application/json' "$CONNECT/connectors/$1/offsets" \
      --data "{\"offsets\":[{\"partition\":{\"kafka_topic\":\"$2\",\"kafka_partition\":0},\"offset\":{\"kafka_offset\":$3}}]}"; echo
    rest PUT "/connectors/$1/resume"
  fi
}

skip() {
  local cfg
  step "A second topic and sink with no dead letter queue: two good records are written first"
  kafka kafka-topics.sh --bootstrap-server kafka:9092 --create --topic orders2 --partitions 1 --replication-factor 1 | sed 's/^/  /'
  printf '%s\n' '{"id":1,"item":"book","quantity":1}' '{"id":2,"item":"pen","quantity":3}' | produce orders2
  cfg="$(file_sink orders2-file-sink topics=orders2 errors.log.enable=true errors.log.include.messages=true)"
  put orders2-file-sink "$cfg"
  wait_for orders2-file-sink 'RUNNING tasks=\[RUNNING\]' 90; sleep "$SETTLE"
  lines orders2-file-sink | tail -1

  step "Then the bad record and two good ones: the task is killed, and the log names the record"
  mark
  printf '%s\n' 'id=3;item=lamp;quantity=1' '{"id":4,"item":"desk","quantity":1}' '{"id":5,"item":"chair","quantity":2}' | produce orders2
  wait_for orders2-file-sink 'FAILED' 90; sleep 3
  since_mark | grep -E 'Error encountered in task orders2-file-sink' | cut -c1-900 | head -1 | save 06-skip-log-line.txt
  sleep "$SETTLE"; group orders2-file-sink | save 06-skip-consumer-group.txt

  step "Move the sink's offset to the record after the bad one"
  move_offset orders2-file-sink orders2 3 "$cfg" | save 06-skip-offset-change.txt
  wait_for orders2-file-sink 'RUNNING tasks=\[RUNNING\]' 90; sleep "$SETTLE"
  lines orders2-file-sink | save 06-skip-result.txt
  curl -s -o /dev/null -X DELETE "$CONNECT/connectors/orders2-file-sink"

  if [[ "$LEGACY" == 1 ]]; then return 0; fi
  step "The same jump on a new sink that has written nothing yet: the good records before the bad one are skipped too"
  mark; put orders-file-sink-new "$(file_sink orders-file-sink-new errors.log.enable=true)"
  wait_for orders-file-sink-new 'FAILED' 90; sleep 3
  {
    since_mark | grep -E 'Error encountered in task orders-file-sink-new' | cut -c1-900 | head -1
    lines orders-file-sink-new | tail -1
    move_offset orders-file-sink-new orders 3 ""
  } | save 06-skip-new-sink.txt
  wait_for orders-file-sink-new 'RUNNING tasks=\[RUNNING\]' 90; sleep "$SETTLE"
  lines orders-file-sink-new | save 06-skip-new-sink-result.txt
  curl -s -o /dev/null -X DELETE "$CONNECT/connectors/orders-file-sink-new"
}

source_task() {
  step "A source connector whose transformation fails on every record"
  docker compose exec -T connect sh -c 'printf "first line\nsecond line\n" > /tmp/lines.txt'
  local base='{"connector.class":"org.apache.kafka.connect.file.FileStreamSourceConnector","tasks.max":"1","file":"/tmp/lines.txt","topic":"lines","value.converter":"org.apache.kafka.connect.storage.StringConverter","transforms":"pick","transforms.pick.type":"org.apache.kafka.connect.transforms.ExtractField$Value","transforms.pick.field":"id"}'
  mark; put lines-source "$base"
  wait_for lines-source 'FAILED' 90; sleep 3
  status lines-source | save 07-source-status-failed.json
  { since_mark | grep -E 'WorkerSourceTask\{id=lines-source-0\} Task threw' | cut -c1-400 | head -1; cause lines-source; } | save 07-source-cause.txt

  step "The same connector with errors.tolerance=all and a dead letter queue name"
  mark; put lines-source "$(echo "$base" | jq -c '. + {"errors.tolerance":"all","errors.deadletterqueue.topic.name":"dlq.lines","errors.deadletterqueue.topic.replication.factor":"1","errors.log.enable":"true"}')"
  sleep 5; ensure_running lines-source; sleep "$SETTLE"
  {
    echo "  $(state lines-source)"
    count lines
    count dlq.lines
    echo "  'Error encountered in task lines-source' log lines: $(since_mark | grep -c 'Error encountered in task lines-source' || true)"
    since_mark | grep -E 'Error encountered in task lines-source' | cut -c1-500 | head -1
  } | save 07-source-with-tolerance.txt
  curl -s -o /dev/null -X DELETE "$CONNECT/connectors/lines-source"
}

put_failure() {
  if [[ "$LEGACY" == 1 ]]; then echo "  (skipped: this image has no JDBC sink connector)"; return 0; fi
  local schema='{"type":"struct","name":"orders","optional":false,"fields":[{"field":"id","type":"int32","optional":false},{"field":"item","type":"string","optional":false},{"field":"quantity","type":"int32","optional":false}]}'
  rec() { printf '{"schema":%s,"payload":{"id":%s,"item":"%s","quantity":%s}}\n' "$schema" "$1" "$2" "$3"; }
  step "A JDBC sink with errors.tolerance=all and a dead letter queue from the start"
  kafka kafka-topics.sh --bootstrap-server kafka:9092 --create --topic orders_jdbc --partitions 1 --replication-factor 1 | sed 's/^/  /'
  { rec 1 book 1; rec 2 pen 3; } | produce orders_jdbc
  mark; put orders-jdbc-sink '{"connector.class":"io.debezium.connector.jdbc.JdbcSinkConnector","tasks.max":"1","topics":"orders_jdbc","connection.url":"jdbc:postgresql://postgres:5432/inventory","connection.username":"postgres","connection.password":"postgrespw","insert.mode":"upsert","primary.key.mode":"record_value","primary.key.fields":"id","schema.evolution":"none","key.converter":"org.apache.kafka.connect.storage.StringConverter","value.converter":"org.apache.kafka.connect.json.JsonConverter","value.converter.schemas.enable":"true","errors.tolerance":"all","errors.deadletterqueue.topic.name":"dlq.orders_jdbc","errors.deadletterqueue.topic.replication.factor":"1","errors.deadletterqueue.context.headers.enable":"true","errors.log.enable":"true"}'
  wait_for orders-jdbc-sink 'RUNNING tasks=\[RUNNING\]|FAILED' 120; sleep "$SETTLE"
  cause orders-jdbc-sink
  echo "  rows in orders_jdbc: $(pg 'SELECT COUNT(*) FROM public.orders_jdbc')"

  step "A well-formed record that the table rejects (quantity 0 breaks a CHECK constraint), then a good one"
  mark; { rec 3 lamp 0; rec 4 desk 1; } | produce orders_jdbc
  wait_for orders-jdbc-sink 'FAILED' 90; sleep 3
  status orders-jdbc-sink | save 08-put-failure-status.json
  {
    echo "  $(state orders-jdbc-sink)"
    since_mark | grep -E 'WorkerSinkTask\{id=orders-jdbc-sink-0\} Task threw' | cut -c1-400 | head -3
    cause orders-jdbc-sink
    echo "  rows in orders_jdbc: $(pg 'SELECT COUNT(*) FROM public.orders_jdbc')"
    count dlq.orders_jdbc
  } | save 08-put-failure-cause.txt

  step "Skip the record: stop, move the offset past it, resume"
  move_offset orders-jdbc-sink orders_jdbc 3 "" | save 08-put-failure-skip.txt
  wait_for orders-jdbc-sink 'RUNNING tasks=\[RUNNING\]' 90; sleep "$SETTLE"
  echo "  rows in orders_jdbc: $(pg 'SELECT string_agg(id::text, $$,$$ ORDER BY id) FROM public.orders_jdbc')" | save 08-put-failure-rows.txt
}

case "${1:-}" in
up) up ;;
break) break_it ;;
restart) restart ;;
dlq) dlq ;;
dlq-rf) dlq_rf ;;
silent) silent ;;
skip) skip ;;
source) source_task ;;
put-failure) put_failure ;;
all) break_it; restart; dlq; dlq_rf; silent; skip; source_task; put_failure ;;
down) docker compose down -v ;;
*) sed -n '2,21p' "$0"; exit 1 ;;
esac
