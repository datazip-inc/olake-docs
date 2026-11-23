#!/usr/bin/env bash
# What the Debezium SQL Server connector does without SQL Server Agent, and when a column is added
# to a captured table.
#
#   ./run.sh up            SQL Server 2022 with the Agent off, Kafka and Kafka Connect; CDC on dbo.orders
#   ./run.sh agent-off     the connector with the Agent off: its state, its log, a row that does not arrive
#   ./run.sh agent-on      the container is created again with the Agent on: the row arrives
#   ./run.sh new-column    ALTER TABLE ADD, rows written before and after a second capture instance
#   ./run.sh old-instance  the first capture instance is dropped, the last step of Debezium's procedure
#   ./run.sh down          remove everything, the data volume included
#
# Run the steps in this order.
set -euo pipefail
cd "$(dirname "$0")"

export CONNECT_PORT="${CONNECT_PORT:-18311}"
CONNECT="http://localhost:$CONNECT_PORT"
PW=Lab_Passw0rd_2026
SQLCMD=/opt/mssql-tools18/bin/sqlcmd
TOPIC=mssql.cdclab.dbo.orders

dc() { docker compose "$@"; }
say() { printf '\n## %s\n' "$*"; }
now() { date -u +%H:%M:%S; }
# sql DATABASE STATEMENT: print the statement, then its result and messages.
sql() {
  printf '%s\n' "$2"
  dc exec -T mssql "$SQLCMD" -S localhost -U sa -P "$PW" -C -I -d "$1" -W -s '|' -w 600 -Q "SET NOCOUNT ON; $2" < /dev/null 2>&1 | tr -d '\r' || true
  echo
}
wait_sql() {
  for _ in $(seq 1 90); do
    if dc exec -T mssql "$SQLCMD" -S localhost -U sa -P "$PW" -C -Q "SET NOCOUNT ON; SELECT 1" > /dev/null 2>&1; then return 0; fi
    sleep 2
  done
  echo "SQL Server did not answer"; return 1
}
wait_connect() {
  for _ in $(seq 1 120); do
    if curl -s -m 3 -o /dev/null "$CONNECT/connectors"; then return 0; fi
    sleep 1
  done
  echo "(Kafka Connect did not answer)"
}

rest() { curl -s -o /dev/null -w "\$ $1 $2  ->  HTTP %{http_code}\n" -X "$1" "$CONNECT$2"; }
put() {
  local out code
  out="$(curl -s -w '\n%{http_code}' -X PUT -H 'Content-Type: application/json' --data "$2" "$CONNECT/connectors/$1/config")"
  code="${out##*$'\n'}"
  echo "\$ PUT /connectors/$1/config  ->  HTTP $code"
  if [[ "$code" != 2* ]]; then echo "${out%$'\n'*}" | cut -c1-900; fi
}
state() {
  curl -s -m 5 "$CONNECT/connectors/$1/status" |
    python3 -c 'import sys,json; d=json.load(sys.stdin); print("connector=%s tasks=[%s]" % (d["connector"]["state"], ",".join(t["state"] for t in d.get("tasks",[]))) if "connector" in d else "no such connector")' 2>/dev/null || echo "no answer from Kafka Connect"
}
show_state() { echo "$(now)  $1: $(state "$1")"; }
wait_for() {
  local s=""
  for _ in $(seq 1 "$3"); do
    s="$(state "$1")"
    if [[ "$s" =~ $2 ]]; then echo "$(now)  $1: $s"; return 0; fi
    sleep 1
  done
  echo "$(now)  $1: $s (gave up waiting for /$2/)"
}
trace() {
  curl -s -m 5 "$CONNECT/connectors/$1/status" |
    python3 -c 'import sys,json
for t in json.load(sys.stdin).get("tasks",[]):
    for l in t.get("trace","").splitlines():
        if not l.startswith("\tat ") and not l.startswith("\t..."): print("  "+l[:400])' 2>/dev/null || true
}
MARK=0
connect_all() { dc logs --no-color --no-log-prefix connect 2>/dev/null; }
mark() { MARK="$(connect_all | wc -l | tr -d ' ')"; }
connectlog() { # pattern, most lines to print: the matching lines since the last mark, and how many there were
  local hits
  hits="$(connect_all | tail -n +"$((MARK + 1))" | grep -a -E "$1" | grep -v -E '^\s+at |^\s+\.\.\. ' || true)"
  echo "--- Kafka Connect log ($(grep -c . <<<"$hits" || true) matching lines since the last mark)"
  cut -c1-460 <<<"$hits" | head -n "${2:-10}"
  echo "---"
}
kafka() { dc exec -T -e KAFKA_HEAP_OPTS=-Xmx128m kafka /opt/kafka/bin/"$@" 2>/dev/null; }
count() {
  local n
  n="$(kafka kafka-get-offsets.sh --bootstrap-server kafka:9092 --topic "$TOPIC" | awk -F: '{s+=$3} END {print s+0}')"
  echo "$(now)  topic $TOPIC holds ${n:-0} records"
}
# events: one line per change event in the topic, oldest first.
events() {
  kafka kafka-console-consumer.sh --bootstrap-server kafka:9092 --topic "$TOPIC" --from-beginning --timeout-ms 10000 |
    python3 -c 'import sys,json
n = 0
for line in sys.stdin:
    try: p = json.loads(line)["payload"]
    except Exception: continue
    if p is None: continue
    n += 1
    row = p.get("after") or p.get("before") or {}
    note = repr(row["note"]) if "note" in row else "(no such field)"
    print("  %2d  op=%s  id=%s  columns=%s  note=%s  commit_lsn=%s" % (n, p.get("op"), row.get("id"), ",".join(row.keys()), note, p.get("source",{}).get("commit_lsn")))'
}
CFG='{
  "connector.class": "io.debezium.connector.sqlserver.SqlServerConnector",
  "tasks.max": "1",
  "database.hostname": "mssql",
  "database.port": "1433",
  "database.user": "sa",
  "database.password": "Lab_Passw0rd_2026",
  "database.names": "cdclab",
  "database.encrypt": "false",
  "topic.prefix": "mssql",
  "table.include.list": "dbo.orders",
  "schema.history.internal.kafka.bootstrap.servers": "kafka:9092",
  "schema.history.internal.kafka.topic": "schemahistory.mssql"
}'
AGENT_STATE="SELECT servicename, status_desc FROM sys.dm_server_services WHERE servicename LIKE N'SQL Server Agent%';"
CAPTURE="SELECT capture_instance, sys.fn_varbintohexstr(start_lsn) AS start_lsn, create_date FROM cdc.change_tables ORDER BY create_date;"
CT_OLD="SELECT sys.fn_varbintohexstr(__\$start_lsn) AS start_lsn, __\$operation AS operation, id, quantity FROM cdc.dbo_orders_CT ORDER BY __\$start_lsn, __\$seqval, __\$operation;"
CT_COLUMNS="SELECT OBJECT_NAME(object_id) AS change_table, STRING_AGG(name, ', ') WITHIN GROUP (ORDER BY column_id) AS columns FROM sys.columns WHERE object_id IN (SELECT object_id FROM cdc.change_tables) AND name NOT LIKE N'\_\_\$%' ESCAPE N'\\' GROUP BY object_id ORDER BY 1;"

case "${1:-}" in
up)
  AGENT=false dc up -d --wait
  wait_sql; wait_connect
  say "versions"
  sql master "SELECT SERVERPROPERTY('ProductVersion') AS product_version, SERVERPROPERTY('ProductUpdateLevel') AS update_level, SERVERPROPERTY('Edition') AS edition;"
  echo "\$ GET /"
  curl -s "$CONNECT/"; echo
  echo "\$ GET /connector-plugins (SQL Server)"
  curl -s "$CONNECT/connector-plugins" | python3 -c 'import sys,json
for p in json.load(sys.stdin):
    if "sqlserver" in p["class"]: print("  %s %s" % (p["class"], p["version"]))'
  say "the lab database, and CDC enabled with the Agent off"
  dc exec -T mssql "$SQLCMD" -S localhost -U sa -P "$PW" -C -I -d master -i /dev/stdin < sql/init.sql 2>&1 | tr -d '\r' || true
  sql cdclab "EXEC sys.sp_cdc_enable_db;"
  sql cdclab "EXEC sys.sp_cdc_enable_table @source_schema = N'dbo', @source_name = N'orders', @role_name = NULL, @supports_net_changes = 1;"
  sql cdclab "$CAPTURE"
  sql master "$AGENT_STATE"
  ;;

agent-off)
  say "the connector is registered while SQL Server Agent is stopped"
  sql master "$AGENT_STATE"
  sql cdclab "SELECT sys.fn_varbintohexstr(sys.fn_cdc_get_max_lsn()) AS max_lsn;"
  mark
  echo "$CFG" | grep -v password
  put orders "$CFG"
  wait_for orders 'connector=RUNNING tasks=\[RUNNING\]' 180
  sleep 25
  count
  events
  say "a row is written"
  sql cdclab "INSERT INTO dbo.orders (customer_id, quantity) VALUES (5, 3);"
  sleep 30
  count
  show_state orders
  sql cdclab "SELECT COUNT(*) AS rows_in_change_table FROM cdc.dbo_orders_CT;"
  connectlog 'No maximum LSN|Agent' 3
  ;;

agent-on)
  say "the connector is stopped, and the SQL Server container is created again with the Agent on"
  rest PUT /connectors/orders/stop
  wait_for orders 'connector=STOPPED' 30
  AGENT=true dc up -d --wait mssql
  wait_sql
  sleep 30
  sql master "$AGENT_STATE"
  sql cdclab "SELECT sys.fn_varbintohexstr(sys.fn_cdc_get_max_lsn()) AS max_lsn, (SELECT COUNT(*) FROM cdc.dbo_orders_CT) AS rows_in_change_table;"
  mark
  rest PUT /connectors/orders/resume
  wait_for orders 'connector=RUNNING tasks=\[RUNNING\]' 120
  sleep 25
  count
  events
  connectlog 'No maximum LSN|Agent' 3
  ;;

new-column)
  say "before the change: one more row"
  sql cdclab "INSERT INTO dbo.orders (customer_id, quantity) VALUES (6, 1);"
  sleep 15
  count
  say "a column is added, a row is written with it, and an old row gets a value in it"
  mark
  sql cdclab "ALTER TABLE dbo.orders ADD note NVARCHAR(100) NULL;"
  sql cdclab "INSERT INTO dbo.orders (customer_id, quantity, note) VALUES (7, 1, N'written before the second capture instance');"
  sql cdclab "UPDATE dbo.orders SET note = N'updated before the second capture instance' WHERE id = 1;"
  sleep 20
  sql cdclab "$CT_COLUMNS"
  sql cdclab "SELECT OBJECT_NAME(source_object_id) AS source_table, ddl_command, sys.fn_varbintohexstr(ddl_lsn) AS ddl_lsn FROM cdc.ddl_history;"
  sql cdclab "$CT_OLD"
  count
  events
  show_state orders
  connectlog ' (WARN|ERROR) |capture instance|chema will be changed|Migrating schema|column' 8
  say "a second capture instance, then a new row"
  mark
  sql cdclab "EXEC sys.sp_cdc_enable_table @source_schema = N'dbo', @source_name = N'orders', @role_name = NULL, @supports_net_changes = 1, @capture_instance = N'dbo_orders_v2';"
  sql cdclab "$CAPTURE"
  sql cdclab "INSERT INTO dbo.orders (customer_id, quantity, note) VALUES (8, 2, N'written after the second capture instance');"
  sleep 20
  count
  events
  connectlog 'capture instance|chema will be changed|Migrating schema' 6
  say "the two rows whose note the connector never saw are changed again"
  sql cdclab "UPDATE dbo.orders SET quantity = quantity + 1 WHERE note LIKE N'%before the second capture instance';"
  sleep 20
  count
  events
  say "the source table against the events"
  sql cdclab "SELECT id, quantity, note FROM dbo.orders ORDER BY id;"
  sql cdclab "$CT_COLUMNS"
  sql cdclab "$CT_OLD"
  sql cdclab "SELECT sys.fn_varbintohexstr(__\$start_lsn) AS start_lsn, __\$operation AS operation, id, quantity, note FROM cdc.dbo_orders_v2_CT ORDER BY __\$start_lsn, __\$seqval, __\$operation;"
  show_state orders
  ;;

old-instance)
  say "the first capture instance is dropped while the connector runs"
  mark
  sql cdclab "EXEC sys.sp_cdc_disable_table @source_schema = N'dbo', @source_name = N'orders', @capture_instance = N'dbo_orders';"
  sql cdclab "$CAPTURE"
  sql cdclab "INSERT INTO dbo.orders (customer_id, quantity, note) VALUES (9, 1, N'written after the first capture instance was dropped');"
  sleep 30
  count
  events
  show_state orders
  trace orders
  echo "exceptions in the Kafka Connect log since the drop:"
  connect_all | tail -n +"$((MARK + 1))" | grep -a -E '^[A-Za-z.]+Exception: ' | sort | uniq -c | cut -c1-300 || true
  connectlog 'Producer failure' 1
  connectlog 'Retry [0-9]+ of|Going to restart|Attempting to restart|Successfully restarted|Starting streaming' 8
  ;;

down)
  dc down -v
  ;;

*)
  sed -n '2,13p' "$0"
  ;;
esac
