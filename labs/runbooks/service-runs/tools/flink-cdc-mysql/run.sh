#!/usr/bin/env bash
# Service test: a Flink CDC job on MySQL whose binary log position was purged.
#
#   ./run.sh fetch          put the MySQL CDC connector jar and the MySQL JDBC driver into lib/
#   ./run.sh up             MySQL 8.4.13 and a Flink 2.2.1 session cluster with the connector jar
#   ./run.sh start          submit the job: snapshot of 4 customers and 4 orders, then one streamed insert
#   ./run.sh stop           stop the job with a savepoint
#   ./run.sh outage         the job is stopped: 3 customers added, 1 order changed, 1 deleted, the log purged
#   ./run.sh restore        break it: restore the job from the savepoint
#   ./run.sh restore-none   the same restore with restart-strategy.type = none
#   ./run.sh when-needed    the same restore with debezium.snapshot.mode = when_needed
#   ./run.sh latest         a new job without state and scan.startup.mode = latest-offset
#   ./run.sh fresh          fix: a new job without state, which takes a new snapshot
#   ./run.sh faq            the lines of the Flink CDC FAQ that the runbook quotes
#   ./run.sh all            every step in order, each captured under logs/<mode>/
#   ./run.sh down           remove everything
#
#   GTID=ON ./run.sh all                      the same with gtid_mode=ON
#   MYSQL_IMAGE=mysql:8.0.46 ./run.sh all     another MySQL version
set -euo pipefail
cd "$(dirname "$0")"

export GTID="${GTID:-OFF}"
export MYSQL_IMAGE="${MYSQL_IMAGE:-mysql:8.4.13}"
JAR=flink-sql-connector-mysql-cdc-3.7.0-2.2.jar
DRIVER=mysql-connector-java-8.0.28.jar
REST=http://localhost:18381
MODE="gtid-$(tr '[:upper:]' '[:lower:]' <<<"$GTID")"

dc() { docker compose "$@"; }
sql() { printf '%s\n' "$1"; dc exec -T source mysql -uroot -prootpw --table -e "$1" 2>&1 | grep -v 'Using a password' || true; }
val() { dc exec -T source mysql -uroot -prootpw -N -B -e "$1" 2>/dev/null || true; }
say() { printf '\n## %s\n' "$*"; }
stamp() { date -u '+%Y-%m-%d %H:%M:%S UTC'; }
binlogs() { if [[ "$(val 'SELECT VERSION()')" == 8.4.* ]]; then sql "SHOW BINARY LOGS; SHOW BINARY LOG STATUS;"; else sql "SHOW BINARY LOGS; SHOW MASTER STATUS;"; fi; }
counts() { sql "SELECT (SELECT COUNT(*) FROM inventory.customers) AS customers, (SELECT COUNT(*) FROM inventory.orders) AS orders;"; }
json() { python3 -c "import json,sys; d=json.load(sys.stdin); $1"; }

# printed [SINCE]: the rows the job has printed, from line SINCE of the TaskManager output on.
printed_all() { dc logs --no-log-prefix taskmanager 2>&1 | grep -a -E '^(customers|orders)> ' || true; }
printed_count() { printed_all | wc -l | tr -d ' '; }
printed_since() { printed_all | tail -n +"$(( $1 + 1 ))"; }
# wait_rows N SECONDS: wait until N rows in all have been printed.
wait_rows() { local want=$1 i; for i in $(seq 1 "$2"); do [[ "$(printed_count)" -ge "$want" ]] && return 0; sleep 1; done; echo "(gave up after $2 s waiting for $want printed rows; there are $(printed_count))"; }

# submit NAME SET OPTIONS: fill in the template, submit it, print and remember the job id.
submit() {
  local name=$1 set=$2 options=$3 out
  mkdir -p work
  python3 - "$name" "$set" "$options" <<'EOF'
import sys
name, set_, options = sys.argv[1:4]
t = open("sql/job.sql.tmpl").read()
t = t.replace("@NAME@", name).replace("@SET@", set_).replace("@OPTIONS@", options)
open("work/job-%s.sql" % name, "w").write(t)
EOF
  echo "--- what differs from the template in work/job-$name.sql"
  if [[ -n "$set" ]]; then sed 's/^/    /' <<<"$set"; fi
  if [[ -n "$options" ]]; then sed 's/^/    /' <<<"$options"; fi
  if [[ -z "$set$options" ]]; then echo "    (nothing)"; fi
  dc cp "work/job-$name.sql" jobmanager:/tmp/job.sql > /dev/null 2>&1
  out="$(dc exec -T jobmanager ./bin/sql-client.sh -f /tmp/job.sql 2>&1 || true)"
  grep -a -E 'Job ID|ERROR|Exception|error' <<<"$out" | head -12 || true
  JOB="$(grep -a -o -E 'Job ID: [0-9a-f]{32}' <<<"$out" | tail -1 | awk '{print $3}')"
  echo "$JOB" > work/job.id
  echo "submitted $(stamp), job id ${JOB:-none}"
}
job() { cat work/job.id 2>/dev/null || true; }
state() { curl -s "$REST/jobs/$1" | json "print(d.get('state', d))" 2>/dev/null || echo "?"; }
restarts() { curl -s "$REST/jobs/$1/metrics?get=numRestarts" | json "print(d[0]['value'] if d else '?')" 2>/dev/null || echo "?"; }
# watch_job ID SECONDS: the job state every 5 seconds.
watch_job() {
  local id=$1 i
  for i in $(seq 0 5 "$2"); do printf '%s  after %3d s: %-11s restarts %s\n' "$(date -u +%H:%M:%S)" "$i" "$(state "$id")" "$(restarts "$id")"; sleep 5; done
}
exceptions() {
  echo "--- the newest exception of the job, from the REST API"
  curl -s "$REST/jobs/$1/exceptions?maxExceptions=3" | json "
es = d.get('exceptionHistory', {}).get('entries', [])
print('exceptions recorded: %d%s' % (len(es), ' (truncated)' if d.get('exceptionHistory', {}).get('truncated') else ''))
for e in es[:1]:
    st = e.get('stacktrace', '')
    lines = st.split('\n')
    print('exceptionName:', e.get('exceptionName'))
    print('task:', e.get('taskName'))
    keep = [l for l in lines if l and not l.startswith('\tat ')]
    for l in keep[:14]: print('  ' + l[:900])
"
}
# cancel: stop the current job, unless it has already ended by itself.
cancel() {
  local id st; id="$(job)"; [[ -n "$id" ]] || return 0
  st="$(state "$id")"
  if [[ "$st" == FAILED || "$st" == FINISHED || "$st" == CANCELED ]]; then echo "the job has ended by itself: $st"; return 0; fi
  dc exec -T jobmanager ./bin/flink cancel "$id" 2>&1 | grep -a -E '^Cancelled' | head -1 || true
  sleep 3
  echo "state after cancel: $(state "$id")"
}
STEP_START="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

case "${1:-}" in
fetch)
  mkdir -p lib
  url="https://repo1.maven.org/maven2/org/apache/flink/flink-sql-connector-mysql-cdc/3.7.0-2.2/$JAR"
  [[ -f "lib/$JAR" ]] || curl -sS -o "lib/$JAR" "$url"
  echo "sha1 of lib/$JAR: $(shasum -a 1 "lib/$JAR" | cut -d' ' -f1)"
  echo "sha1 on Maven Central:  $(curl -s "$url.sha1")"
  # The MySQL JDBC driver is not in the connector jar. The Flink CDC page names
  # mysql:mysql-connector-java:8.0.27 on Maven Central. This run took 8.0.28 out of the Debezium 1.9
  # Connect image, which was already on the machine.
  if [[ ! -f "lib/$DRIVER" ]]; then
    cid="$(docker create --platform linux/amd64 quay.io/debezium/connect:1.9)"
    docker cp "$cid":/kafka/connect/debezium-connector-mysql/"$DRIVER" lib/ > /dev/null
    docker rm "$cid" > /dev/null
  fi
  echo "sha1 of lib/$DRIVER: $(shasum -a 1 "lib/$DRIVER" | cut -d' ' -f1)"
  echo "sha1 on Maven Central:  $(curl -s "https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.28/$DRIVER.sha1")"
  ;;

up)
  mkdir -p work "logs/$MODE"
  dc up -d --wait source jobmanager
  dc up -d taskmanager
  dc exec -T -u root jobmanager chown -R flink:flink /state
  say "MySQL"
  sql "SELECT VERSION() AS version, @@gtid_mode AS gtid_mode, @@binlog_format AS binlog_format, @@binlog_expire_logs_seconds AS binlog_expire_logs_seconds;"
  say "Flink"
  for i in $(seq 1 60); do [[ "$(curl -s "$REST/overview" | json "print(d.get('taskmanagers', 0))" 2>/dev/null)" == 1 ]] && break; sleep 1; done
  curl -s "$REST/overview" | json "print('flink-version %s, commit %s, taskmanagers %s, slots %s' % (d['flink-version'], d['flink-commit'], d['taskmanagers'], d['slots-total']))"
  say "the connector jar and the Debezium it carries"
  echo "$DRIVER (the MySQL JDBC driver, a separate jar)"
  python3 -I - "lib/$JAR" <<'EOF'
import re, sys, zipfile
z = zipfile.ZipFile(sys.argv[1])
print(sys.argv[1].split("/")[-1])
for n in z.namelist():
    m = re.search(r"META-INF/maven/(io\.debezium/debezium-connector-mysql|io\.debezium/debezium-core|io\.debezium/debezium-embedded|com\.zendesk/mysql-binlog-connector-java|org\.apache\.flink/flink-connector-mysql-cdc)/pom\.properties$", n)
    if m:
        v = re.search(r"version=(.+)", z.read(n).decode())
        print("  %s %s" % (m.group(1), v.group(1).strip()))
EOF
  ;;

start)
  say "the job is submitted"
  before="$(printed_count)"
  submit inventory-cdc "" ""
  wait_rows $((before + 8)) 120
  echo "state: $(state "$(job)")"
  say "what the job printed: the snapshot"
  printed_since "$before"
  say "one insert while the job runs"
  before="$(printed_count)"
  sql "INSERT INTO inventory.orders (customer_id, quantity) VALUES (1, 5);"
  wait_rows $((before + 1)) 60
  printed_since "$before"
  binlogs
  ;;

stop)
  say "the job is stopped with a savepoint"
  sleep 6   # one more checkpoint interval, so that the position of the insert is in the state
  out="$(dc exec -T jobmanager ./bin/flink stop --savepointPath file:///state/savepoints "$(job)" 2>&1 || true)"
  grep -a -E 'Savepoint|savepoint|Exception|ERROR' <<<"$out" | head -6
  sp="$(grep -a -o -E 'file:/state/savepoints/savepoint-[0-9a-z-]+' <<<"$out" | tail -1)"
  echo "$sp" > work/savepoint
  echo "state: $(state "$(job)")"
  say "the binary log position the job had reached, from the TaskManager log"
  dc logs --no-log-prefix taskmanager 2>&1 | grep -a -E 'Binlog offset for tables' | tail -2 | sed -E 's/^[0-9-]+ [0-9:,]+ //' | cut -c1-400 || true
  ;;

outage)
  say "the job is stopped: 3 customers added, 1 order changed, 1 order deleted"
  sql "INSERT INTO inventory.customers (first_name, last_name, email) VALUES ('Jon', 'Doe', 'jon@example.com'), ('Mia', 'Wong', 'mia@example.com'), ('Raj', 'Patel', 'raj@example.com');"
  sql "UPDATE inventory.orders SET quantity = 9 WHERE id = 2;"
  sql "DELETE FROM inventory.orders WHERE id = 4;"
  say "the binary log is rotated twice and every file before the newest one is purged"
  sql "INSERT INTO noise.ticks () VALUES (),(),(); FLUSH BINARY LOGS; INSERT INTO noise.ticks () VALUES (),(),(); FLUSH BINARY LOGS;"
  binlogs
  newest="$(val "SHOW BINARY LOGS" | tail -1 | awk '{print $1}')"
  sql "PURGE BINARY LOGS TO '$newest';"
  binlogs
  counts
  ;;

restore|restore-none|when-needed)
  sp="$(cat work/savepoint)"
  set="SET 'execution.state-recovery.path' = '$sp';"; options=""; name="restore"
  case "$1" in
    restore)      say "the job is restored from the savepoint taken before the purge" ;;
    restore-none) say "the same restore, with restart-strategy.type = none"; set="$set
SET 'restart-strategy.type' = 'none';"; name="restore-none" ;;
    when-needed)  say "the same restore, with debezium.snapshot.mode = when_needed on both tables"; options="'debezium.snapshot.mode' = 'when_needed',"; name="when-needed" ;;
  esac
  before="$(printed_count)"
  submit "$name" "$set" "$options"
  id="$(job)"
  if [[ -z "$id" ]]; then echo "(no job was created)"; exit 0; fi
  watch_job "$id" "${WATCH:-90}"
  exceptions "$id"
  say "rows the job printed after the restore"
  printed_since "$before" | head -20; echo "rows: $(printed_since "$before" | wc -l | tr -d ' ')"
  say "the log lines of the TaskManager that carry the message"
  dc logs --no-log-prefix --since "$STEP_START" taskmanager 2>&1 | grep -a -E 'no longer available|Connector requires binlog file|GTIDs needed|purged' | sed -E 's/^[0-9-]+ [0-9:,]+ //; s/ts_ms=[0-9]+/ts_ms=N/' | sort | uniq -c | sort -rn | head -6 | cut -c1-700
  cancel
  ;;

latest)
  say "a new job without state, with scan.startup.mode = latest-offset"
  before="$(printed_count)"
  submit latest-offset "" "'scan.startup.mode' = 'latest-offset',"
  id="$(job)"
  watch_job "$id" 20
  say "one insert while this job runs"
  sql "INSERT INTO inventory.customers (first_name, last_name, email) VALUES ('Zoe', 'Late', 'zoe@example.com');"
  wait_rows $((before + 1)) 60
  say "rows the job printed"
  printed_since "$before"; echo "rows: $(printed_since "$before" | wc -l | tr -d ' ')"
  counts
  cancel
  ;;

fresh)
  say "a new job without state: scan.startup.mode is at its default, initial"
  before="$(printed_count)"
  expect="$(( $(val 'SELECT COUNT(*) FROM inventory.customers') + $(val 'SELECT COUNT(*) FROM inventory.orders') ))"
  submit fresh "" ""
  id="$(job)"
  wait_rows $((before + expect)) 120
  echo "state: $(state "$id")"
  say "rows the job printed: every row of both tables again"
  printed_since "$before"; echo "rows: $(printed_since "$before" | wc -l | tr -d ' ')"
  say "one insert while this job runs"
  before="$(printed_count)"
  sql "INSERT INTO inventory.orders (customer_id, quantity) VALUES (3, 7);"
  wait_rows $((before + 1)) 60
  printed_since "$before"
  counts
  cancel
  ;;

faq)
  say "the Flink CDC FAQ as published today"
  url=https://nightlies.apache.org/flink/flink-cdc-docs-stable/docs/faq/faq/
  echo "$url"
  curl -s -L -m 60 "$url" | python3 -c "
import html, re, sys
t = sys.stdin.read()
title = re.search(r'<title[^>]*>(.*?)</title>', t, flags=re.S | re.I)
print('page title:', html.unescape(title.group(1)).strip() if title else '(none)')
t = re.sub(r'<script.*?</script>|<style.*?</style>', ' ', t, flags=re.S)
t = html.unescape(re.sub(r'<[^>]+>', ' ', t))
t = re.sub(r'\\s+', ' ', t)
m = re.search(r'(Q\\d+: The job reports an error the connector is trying to read binlog.*?)(?=Q\\d+:)', t)
print()
print('the entry about a purged binary log:')
print(m.group(1).strip() if m else '(not found)')
print()
for word in ('expire_logs_days', 'binlog_expire_logs_seconds', 'when_needed'):
    print('the page mentions %-28s %d time(s)' % (word, t.count(word)))
"
  ;;

all)
  mkdir -p "logs/$MODE"
  i=0
  step() { i=$((i + 1)); local name; name="$(printf '%02d-%s' "$i" "$1")"; echo "== $MODE/$name $(date -u +%H:%M:%S)"; "$0" "$1" > "logs/$MODE/$name.txt" 2>&1 || true; }
  for s in up start stop outage restore restore-none when-needed latest fresh faq; do step "$s"; done
  ;;

down)
  dc down -v --remove-orphans
  rm -rf work
  ;;

*)
  sed -n '2,19p' "$0"; exit 1 ;;
esac
