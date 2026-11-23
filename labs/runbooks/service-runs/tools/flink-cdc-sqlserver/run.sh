#!/usr/bin/env bash
# Service test: a Flink CDC job on SQL Server and a column added to a CDC-enabled table.
#
#   ./run.sh fetch            download the SQL Server CDC connector jar from Maven Central into lib/
#   ./run.sh up               SQL Server 2022 with the Agent on, CDC on dbo.orders, a Flink 2.2.1 session cluster
#   ./run.sh start            job 1, declared with the four original columns: snapshot, then one streamed insert
#   ./run.sh add-column       ALTER TABLE ... ADD note, two inserts with a value in it: what job 1 prints
#   ./run.sh with-column      job 2, declared with the new column: its snapshot, then one streamed insert
#   ./run.sh second-instance  a second capture instance that has the column: what job 2 prints afterwards
#   ./run.sh restart          job 3, the same declaration started again after the second instance exists
#   ./run.sh agent-off        the server again with the Agent off, CDC enabled on a new database: job 4
#   ./run.sh all              every step in order, each captured under logs/
#   ./run.sh down             remove everything
set -euo pipefail
cd "$(dirname "$0")"

JAR=flink-sql-connector-sqlserver-cdc-3.7.0-2.2.jar
REST=http://localhost:18382
PW=Lab_Passw0rd_2026
SQLCMD=/opt/mssql-tools18/bin/sqlcmd

dc() { docker compose "$@"; }
say() { printf '\n## %s\n' "$*"; }
stamp() { date -u '+%Y-%m-%d %H:%M:%S UTC'; }
q() { printf '%s\n' "$1"; dc exec -T mssql "$SQLCMD" -S localhost -U sa -P "$PW" -C -I -d "${DB:-cdclab}" -W -s '|' -w 600 -Q "SET NOCOUNT ON; $1" < /dev/null 2>&1 | tr -d '\r' || true; echo; }
json() { python3 -c "import json,sys; d=json.load(sys.stdin); $1"; }
instances() {
  q "SELECT capture_instance, start_lsn, create_date FROM cdc.change_tables ORDER BY create_date;"
  q "SELECT ct.capture_instance, cc.column_name FROM cdc.captured_columns cc JOIN cdc.change_tables ct ON ct.object_id = cc.object_id ORDER BY ct.capture_instance, cc.column_ordinal;"
}
wait_sql() { local i; for i in $(seq 1 90); do dc exec -T mssql "$SQLCMD" -S localhost -U sa -P "$PW" -C -Q "SET NOCOUNT ON; SELECT 1" > /dev/null 2>&1 && return 0; sleep 2; done; echo "SQL Server did not answer"; }

# The rows a job has printed. Every job prints under its own name.
printed() { dc logs --no-log-prefix taskmanager 2>&1 | grep -a -E "^$1> " || true; }
printed_count() { printed "$1" | wc -l | tr -d ' '; }
wait_rows() { local name=$1 want=$2 i; for i in $(seq 1 "$3"); do [[ "$(printed_count "$name")" -ge "$want" ]] && return 0; sleep 1; done; echo "(gave up after $3 s waiting for $want printed rows of $name; there are $(printed_count "$name"))"; }

# submit NAME DATABASE WITH_NOTE(yes|no) SET OPTIONS
submit() {
  local name=$1 database=$2 note=$3 set=$4 options=$5 out
  mkdir -p work
  python3 - "$name" "$database" "$note" "$set" "$options" <<'EOF'
import sys
name, database, note, set_, options = sys.argv[1:6]
t = open("sql/job.sql.tmpl").read()
t = t.replace("@NAME@", name).replace("@DATABASE@", database).replace("@SET@", set_).replace("@OPTIONS@", options)
t = t.replace("@COLUMNS@", "note STRING," if note == "yes" else "").replace("@OUTCOLUMNS@", ", note STRING" if note == "yes" else "")
open("work/job-%s.sql" % name, "w").write(t)
EOF
  echo "--- job $name: database $database, declares the column note: $note${options:+, options: $options}"
  dc cp "work/job-$name.sql" jobmanager:/tmp/job.sql > /dev/null 2>&1
  out="$(dc exec -T jobmanager ./bin/sql-client.sh -f /tmp/job.sql 2>&1 || true)"
  grep -a -E 'Job ID|ERROR|Exception' <<<"$out" | head -12 || true
  JOB="$(grep -a -o -E 'Job ID: [0-9a-f]{32}' <<<"$out" | tail -1 | awk '{print $3}')"
  echo "$JOB" > work/job.id
  echo "submitted $(stamp), job id ${JOB:-none}"
}
job() { cat work/job.id 2>/dev/null || true; }
state() { curl -s "$REST/jobs/$1" | json "print(d.get('state', d))" 2>/dev/null || echo "?"; }
restarts() { curl -s "$REST/jobs/$1/metrics?get=numRestarts" | json "print(d[0]['value'] if d else '?')" 2>/dev/null || echo "?"; }
watch_job() { local id=$1 i; for i in $(seq 0 10 "$2"); do printf '%s  after %3d s: %-11s restarts %s\n' "$(date -u +%H:%M:%S)" "$i" "$(state "$id")" "$(restarts "$id")"; sleep 10; done; }
exceptions() {
  echo "--- the newest exception of the job, from the REST API"
  curl -s "$REST/jobs/$1/exceptions?maxExceptions=3" | json "
es = d.get('exceptionHistory', {}).get('entries', [])
print('exceptions recorded: %d' % len(es))
for e in es[:1]:
    lines = e.get('stacktrace', '').split('\n')
    print('exceptionName:', e.get('exceptionName'))
    for l in [l for l in lines if l and not l.startswith('\tat ')][:12]: print('  ' + l[:900])
"
}
cancel() { local id; id="$(job)"; [[ -n "$id" ]] && dc exec -T jobmanager ./bin/flink cancel "$id" 2>&1 | grep -a -E 'Cancelled' | head -1 || true; }
flink_up() {
  dc up -d --wait jobmanager
  dc up -d taskmanager
  dc exec -T -u root jobmanager chown -R flink:flink /state
  local i; for i in $(seq 1 60); do [[ "$(curl -s "$REST/overview" | json "print(d.get('taskmanagers', 0))" 2>/dev/null)" == 1 ]] && break; sleep 1; done
}

case "${1:-}" in
fetch)
  mkdir -p lib
  url="https://repo1.maven.org/maven2/org/apache/flink/flink-sql-connector-sqlserver-cdc/3.7.0-2.2/$JAR"
  [[ -f "lib/$JAR" ]] || curl -sS -o "lib/$JAR" "$url"
  echo "sha1 of lib/$JAR: $(shasum -a 1 "lib/$JAR" | cut -d' ' -f1)"
  echo "sha1 on Maven Central:  $(curl -s "$url.sha1")"
  ;;

up)
  mkdir -p work logs
  AGENT=true dc up -d --wait mssql
  wait_sql
  say "SQL Server"
  DB=master q "SELECT SERVERPROPERTY('ProductVersion') AS product_version, SERVERPROPERTY('ProductUpdateLevel') AS update_level, SERVERPROPERTY('Edition') AS edition;"
  say "the lab database, with CDC on dbo.orders"
  dc exec -T mssql "$SQLCMD" -S localhost -U sa -P "$PW" -C -I -d master -i /dev/stdin < sql/init.sql 2>&1 | tr -d '\r' || true
  sleep 8
  DB=master q "SELECT servicename, status_desc FROM sys.dm_server_services;"
  instances
  say "Flink"
  flink_up
  curl -s "$REST/overview" | json "print('flink-version %s, commit %s, taskmanagers %s, slots %s' % (d['flink-version'], d['flink-commit'], d['taskmanagers'], d['slots-total']))"
  say "the connector jar and the Debezium it carries"
  python3 -I - "lib/$JAR" <<'EOF'
import re, sys, zipfile
z = zipfile.ZipFile(sys.argv[1])
print(sys.argv[1].split("/")[-1])
for n in z.namelist():
    m = re.search(r"META-INF/maven/(io\.debezium/debezium-connector-sqlserver|io\.debezium/debezium-core|org\.apache\.flink/flink-connector-sqlserver-cdc|com\.microsoft\.sqlserver/mssql-jdbc)/pom\.properties$", n)
    if m:
        v = re.search(r"version=(.+)", z.read(n).decode())
        print("  %s %s" % (m.group(1), v.group(1).strip()))
EOF
  ;;

start)
  say "job 1 is declared with the four columns the table has"
  submit job1 cdclab no "" ""
  wait_rows job1 4 180
  echo "state: $(state "$(job)")"
  say "what job 1 printed: the snapshot"
  printed job1
  say "one insert while the job runs"
  q "INSERT INTO dbo.orders (customer_id, quantity) VALUES (1, 5);"
  wait_rows job1 5 90
  printed job1 | tail -n +5
  ;;

add-column)
  say "a new column on the source table, then two inserts with a value in it"
  before="$(printed_count job1)"
  q "ALTER TABLE dbo.orders ADD note NVARCHAR(100) NULL;"
  q "INSERT INTO dbo.orders (customer_id, quantity, note) VALUES (2, 6, N'first note'), (3, 7, N'second note');"
  wait_rows job1 $((before + 2)) 90
  say "what job 1 printed for them, and its state"
  printed job1 | tail -n +"$((before + 1))"
  echo "state: $(state "$(job)"), restarts $(restarts "$(job)")"
  exceptions "$(job)"
  say "what CDC has: the capture instance still has the columns it was created with"
  instances
  q "SELECT __\$operation AS op, id, customer_id, quantity FROM cdc.dbo_orders_CT ORDER BY __\$start_lsn, __\$seqval, __\$operation;"
  say "log lines of the TaskManager about the schema"
  dc logs --no-log-prefix --since 2m taskmanager 2>&1 | grep -a -i -E 'schema|capture instance|column' | grep -a -v -E 'print|SchemaCoder' | sed -E 's/^[0-9-]+ [0-9:,]+ //' | sort | uniq -c | sort -rn | head -8 | cut -c1-500 || true
  cancel
  ;;

with-column)
  say "job 2 is declared with the new column and starts without state"
  submit job2 cdclab yes "" ""
  wait_rows job2 7 180
  echo "state: $(state "$(job)")"
  say "what job 2 printed: its snapshot reads the table itself"
  printed job2
  say "one insert with a value in the new column while job 2 runs"
  q "INSERT INTO dbo.orders (customer_id, quantity, note) VALUES (4, 8, N'third note');"
  wait_rows job2 8 90
  say "what job 2 printed for it: this row came through the change table"
  printed job2 | tail -n +8
  q "SELECT id, customer_id, quantity, note FROM dbo.orders WHERE id >= 6 ORDER BY id;"
  ;;

second-instance)
  say "a second capture instance, which has the new column"
  q "EXEC sys.sp_cdc_enable_table @source_schema = N'dbo', @source_name = N'orders', @role_name = NULL, @capture_instance = N'dbo_orders_v2';"
  instances
  sleep 10
  say "one insert with a value in the new column, job 2 still running"
  before="$(printed_count job2)"
  q "INSERT INTO dbo.orders (customer_id, quantity, note) VALUES (1, 9, N'fourth note');"
  wait_rows job2 $((before + 1)) 90
  printed job2 | tail -n +"$((before + 1))"
  say "a second insert one minute later"
  sleep 60
  before="$(printed_count job2)"
  q "INSERT INTO dbo.orders (customer_id, quantity, note) VALUES (2, 10, N'fifth note');"
  wait_rows job2 $((before + 1)) 90
  printed job2 | tail -n +"$((before + 1))"
  echo "state: $(state "$(job)"), restarts $(restarts "$(job)")"
  say "log lines of the TaskManager about the capture instances"
  dc logs --no-log-prefix --since 4m taskmanager 2>&1 | grep -a -i -E 'capture instance|Schema will be changed|dbo_orders_v2|Migrating schema|new change table' | sed -E 's/^[0-9-]+ [0-9:,]+ //' | sort | uniq -c | sort -rn | head -8 | cut -c1-600 || true
  q "SELECT __\$operation AS op, id, quantity, note FROM cdc.dbo_orders_v2_CT ORDER BY __\$start_lsn, __\$seqval, __\$operation;"
  ;;

restart)
  say "job 2 is stopped with a savepoint and job 3, the same declaration, starts from it"
  sleep 6
  out="$(dc exec -T jobmanager ./bin/flink stop --savepointPath file:///state/savepoints "$(job)" 2>&1 || true)"
  grep -a -E 'Savepoint completed|Exception|ERROR' <<<"$out" | head -4
  sp="$(grep -a -o -E 'file:/state/savepoints/savepoint-[0-9a-z-]+' <<<"$out" | tail -1)"
  submit job3 cdclab yes "SET 'execution.state-recovery.path' = '$sp';" ""
  watch_job "$(job)" 20
  say "one insert with a value in the new column while job 3 runs"
  before="$(printed_count job3)"
  q "INSERT INTO dbo.orders (customer_id, quantity, note) VALUES (3, 11, N'sixth note');"
  wait_rows job3 $((before + 1)) 90
  printed job3
  echo "state: $(state "$(job)"), restarts $(restarts "$(job)")"
  exceptions "$(job)"
  dc logs --no-log-prefix --since 2m taskmanager 2>&1 | grep -a -i -E 'capture instance|Schema will be changed|dbo_orders_v2|Migrating schema' | sed -E 's/^[0-9-]+ [0-9:,]+ //' | sort | uniq -c | sort -rn | head -6 | cut -c1-600 || true
  cancel
  ;;

agent-off)
  say "the same server is created again with SQL Server Agent off"
  AGENT=false dc up -d --wait mssql
  wait_sql
  DB=master q "SELECT servicename, status_desc FROM sys.dm_server_services;"
  say "a new database, enabled for CDC while the Agent is off"
  dc exec -T mssql "$SQLCMD" -S localhost -U sa -P "$PW" -C -I -d master -i /dev/stdin < sql/init-agent-off.sql 2>&1 | tr -d '\r' || true
  DB=cdclab2 q "SELECT sys.fn_cdc_get_max_lsn() AS max_lsn, (SELECT COUNT(*) FROM cdc.dbo_orders_CT) AS rows_in_change_table;"
  say "job 4 reads that database"
  submit job4 cdclab2 no "" ""
  id="$(job)"
  watch_job "$id" 60
  say "one insert while job 4 runs"
  DB=cdclab2 q "INSERT INTO dbo.orders (customer_id, quantity) VALUES (1, 5);"
  watch_job "$id" 30
  say "what job 4 printed"
  printed job4; echo "rows: $(printed_count job4)"
  exceptions "$id"
  say "log lines of the TaskManager and the JobManager that mention the Agent or the maximum LSN"
  { dc logs --no-log-prefix --since 4m taskmanager 2>&1; dc logs --no-log-prefix --since 4m jobmanager 2>&1; } | grep -a -i -E 'agent|maximum LSN|max lsn|No maximum' | sed -E 's/^[0-9-]+ [0-9:,]+ //' | sort | uniq -c | sort -rn | head -8 | cut -c1-600 || true
  DB=cdclab2 q "SELECT sys.fn_cdc_get_max_lsn() AS max_lsn, (SELECT COUNT(*) FROM cdc.dbo_orders_CT) AS rows_in_change_table, (SELECT COUNT(*) FROM dbo.orders) AS rows_in_table;"
  cancel
  ;;

all)
  mkdir -p logs
  i=0
  step() { i=$((i + 1)); local name; name="$(printf '%02d-%s' "$i" "$1")"; echo "== $name $(date -u +%H:%M:%S)"; "$0" "$1" > "logs/$name.txt" 2>&1 || true; }
  for s in up start add-column with-column second-instance restart agent-off; do step "$s"; done
  ;;

down)
  dc down -v --remove-orphans
  rm -rf work
  ;;

*)
  sed -n '2,13p' "$0"; exit 1 ;;
esac
