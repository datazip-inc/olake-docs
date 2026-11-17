#!/usr/bin/env bash
# Lab: a Debezium MySQL connector loses its schema history topic.
#
#   ./run.sh up            start Kafka, MySQL and Kafka Connect, register the connector
#   ./run.sh lose-topic    stop the connector, delete the history topic, resume: the task fails
#   ./run.sh recover       set snapshot.mode=recovery: the task resumes from its stored offset
#   ./run.sh ddl-outage    change the table while the connector is down, lose the topic again:
#                          recovery mode now fails on the first row written before the ALTER
#   ./run.sh full-reset    clear the connector offsets and take a new initial snapshot
#   ./run.sh add-table     second connector: add a table whose schema is not in the history topic
#   ./run.sh fix-add-table documented fix for add-table
#   ./run.sh down          remove everything
#
# Legacy run (Debezium 1.x key names, Kafka Connect without the stop and offsets endpoints):
#   LEGACY=1 DEBEZIUM_IMAGE=quay.io/debezium/connect:1.9 MYSQL_IMAGE=mysql:8.0 ./run.sh up
#   LEGACY=1 ./run.sh lose-topic && LEGACY=1 ./run.sh recover
set -euo pipefail
cd "$(dirname "$0")"

CONNECT="http://localhost:${CONNECT_PORT:-8083}"
NAME=inventory-connector
LEGACY="${LEGACY:-0}"

kafka() { docker compose exec -T kafka /opt/kafka/bin/"$@" 2>/dev/null; }
sql() { docker compose exec -T mysql mysql -uroot -prootpw -e "$1" 2>/dev/null; }
state() {
  curl -s "$CONNECT/connectors/$1/status" |
    python3 -c 'import sys,json; d=json.load(sys.stdin); print(d["connector"]["state"], ",".join(t["state"] for t in d.get("tasks",[])))' 2>/dev/null || true
}
wait_for() { # connector name, pattern, seconds
  local s=""
  for _ in $(seq 1 "$3"); do
    s="$(state "$1")"
    if [[ "$s" =~ $2 ]]; then echo "  $1: $s"; return 0; fi
    sleep 1
  done
  echo "  $1: $s (gave up waiting for /$2/)"; return 1
}
cause() { # connector name: the exception lines of the failed task, without stack frames
  curl -s "$CONNECT/connectors/$1/status" |
    python3 -c 'import sys,json
for t in json.load(sys.stdin).get("tasks",[]):
    for l in t.get("trace","").splitlines():
        if not l.startswith("\tat ") and not l.startswith("\t..."): print("  "+l[:400])'
}
counts() { kafka kafka-get-offsets.sh --bootstrap-server kafka:9092 --topic-partitions "$1" | sed 's/^/  /'; }
put_config() { curl -s -o /dev/null -w "  PUT config: %{http_code}\n" -X PUT -H 'Content-Type: application/json' --data "$2" "$CONNECT/connectors/$1/config"; }

# Connector configuration. Debezium 2.0 renamed database.server.name to topic.prefix and
# database.history.* to schema.history.internal.*; 2.6 renamed schema_only_recovery to recovery.
config() { # snapshot.mode
  if [[ "$LEGACY" == 1 ]]; then
    python3 - "$1" <<'PY'
import json,sys
print(json.dumps({
  "connector.class": "io.debezium.connector.mysql.MySqlConnector", "tasks.max": "1",
  "database.hostname": "mysql", "database.port": "3306",
  "database.user": "debezium", "database.password": "dbz",
  "database.server.id": "184054", "database.ssl.mode": "preferred",
  "database.server.name": "dbserver1", "database.include.list": "inventory",
  "database.history.kafka.bootstrap.servers": "kafka:9092",
  "database.history.kafka.topic": "schemahistory.inventory",
  "snapshot.mode": sys.argv[1]}))
PY
  else
    python3 - "$1" <<'PY'
import json,sys
c = json.load(open("connector.json"))["config"]; c["snapshot.mode"] = sys.argv[1]
print(json.dumps(c))
PY
  fi
}
recovery_mode() { [[ "$LEGACY" == 1 ]] && echo schema_only_recovery || echo recovery; }

case "${1:-}" in
up)
  docker compose up -d --wait
  curl -s --retry 60 --retry-delay 2 --retry-connrefused -o /dev/null "$CONNECT/"
  put_config "$NAME" "$(config initial)"
  wait_for "$NAME" 'RUNNING RUNNING' 90
  sleep 5
  counts "dbserver1.inventory.customers:0,dbserver1.inventory.orders:0,schemahistory.inventory:0"
  kafka kafka-configs.sh --bootstrap-server kafka:9092 --entity-type topics --entity-name schemahistory.inventory --describe | cut -c1-120
  ;;
lose-topic)
  if [[ "$LEGACY" == 1 ]]; then
    # No stop endpoint before Kafka Connect 3.5: remove the connector, which keeps its offsets.
    curl -s -o /dev/null -w "  DELETE connector: %{http_code}\n" -X DELETE "$CONNECT/connectors/$NAME"; sleep 5
  else
    curl -s -o /dev/null -w "  stop: %{http_code}\n" -X PUT "$CONNECT/connectors/$NAME/stop"; sleep 5
  fi
  sql "INSERT INTO inventory.customers (first_name,last_name,email) VALUES ('Lab','Stopped','lab.stopped@example.com');"
  kafka kafka-topics.sh --bootstrap-server kafka:9092 --delete --topic schemahistory.inventory; sleep 3
  if [[ "$LEGACY" == 1 ]]; then put_config "$NAME" "$(config initial)"
  else curl -s -o /dev/null -w "  resume: %{http_code}\n" -X PUT "$CONNECT/connectors/$NAME/resume"; fi
  wait_for "$NAME" 'FAILED' 60 || true
  cause "$NAME"
  ;;
recover)
  put_config "$NAME" "$(config "$(recovery_mode)")"
  wait_for "$NAME" 'RUNNING RUNNING' 60; sleep 6
  counts "dbserver1.inventory.customers:0,dbserver1.inventory.orders:0,schemahistory.inventory:0"
  ;;
ddl-outage)
  curl -s -o /dev/null -w "  stop: %{http_code}\n" -X PUT "$CONNECT/connectors/$NAME/stop"; sleep 5
  sql "INSERT INTO inventory.customers (first_name,last_name,email) VALUES ('Before','Alter','before.alter@example.com');
       ALTER TABLE inventory.customers ADD COLUMN phone VARCHAR(32) NULL AFTER last_name;
       INSERT INTO inventory.customers (first_name,last_name,phone,email) VALUES ('After','Alter','555-0100','after.alter@example.com');"
  kafka kafka-topics.sh --bootstrap-server kafka:9092 --delete --topic schemahistory.inventory; sleep 3
  curl -s -o /dev/null -w "  resume: %{http_code}\n" -X PUT "$CONNECT/connectors/$NAME/resume"
  wait_for "$NAME" 'FAILED' 60 || true
  cause "$NAME"
  ;;
full-reset)
  curl -s -o /dev/null -w "  stop: %{http_code}\n" -X PUT "$CONNECT/connectors/$NAME/stop"; sleep 5
  curl -s -X DELETE "$CONNECT/connectors/$NAME/offsets"; echo
  kafka kafka-topics.sh --bootstrap-server kafka:9092 --delete --topic schemahistory.inventory || true; sleep 3
  put_config "$NAME" "$(config initial)"
  curl -s -o /dev/null -w "  resume: %{http_code}\n" -X PUT "$CONNECT/connectors/$NAME/resume"
  wait_for "$NAME" 'RUNNING RUNNING' 60; sleep 8
  counts "dbserver1.inventory.customers:0,dbserver1.inventory.orders:0,schemahistory.inventory:0"
  ;;
add-table)
  curl -s -o /dev/null -w "  register: %{http_code}\n" -X POST -H 'Content-Type: application/json' --data @connector-partial.json "$CONNECT/connectors"
  wait_for customers-only-connector 'RUNNING RUNNING' 60; sleep 6
  put_config customers-only-connector "$(python3 -c 'import json; c=json.load(open("connector-partial.json"))["config"]; c["table.include.list"]="inventory.customers,inventory.orders"; print(json.dumps(c))')"
  sleep 10
  sql "INSERT INTO inventory.orders (customer_id, quantity) VALUES (1, 9);"
  wait_for customers-only-connector 'FAILED' 60 || true
  cause customers-only-connector
  ;;
fix-add-table)
  curl -s -o /dev/null -w "  stop: %{http_code}\n" -X PUT "$CONNECT/connectors/customers-only-connector/stop"; sleep 5
  kafka kafka-topics.sh --bootstrap-server kafka:9092 --delete --topic schemahistory.partial; sleep 3
  put_config customers-only-connector "$(python3 -c 'import json; c=json.load(open("connector-partial.json"))["config"]; c["table.include.list"]="inventory.customers,inventory.orders"; c["schema.history.internal.store.only.captured.tables.ddl"]="false"; c["snapshot.mode"]="recovery"; print(json.dumps(c))')"
  curl -s -o /dev/null -w "  resume: %{http_code}\n" -X PUT "$CONNECT/connectors/customers-only-connector/resume"
  wait_for customers-only-connector 'RUNNING RUNNING' 60; sleep 8
  echo "  rows in inventory.orders: $(docker compose exec -T mysql mysql -uroot -prootpw -N -e 'SELECT COUNT(*) FROM inventory.orders' 2>/dev/null)"
  counts "partial.inventory.orders:0"
  ;;
down)
  docker compose down -v
  ;;
*)
  sed -n '2,16p' "$0"; exit 1
  ;;
esac
