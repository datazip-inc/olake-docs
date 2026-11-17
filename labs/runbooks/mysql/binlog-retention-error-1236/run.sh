#!/usr/bin/env bash
# Lab: MySQL binary log retention, purging, and a reader whose position was purged.
#
# MySQL only (a source server and a second server that replicates from it):
#   ./run.sh up              start both servers; the second one is loaded from a dump and replicates
#   ./run.sh variables       retention variables, and the statements this version accepts and rejects
#   ./run.sh expire          automatic expiry: nothing is removed until the binary log is flushed
#   ./run.sh expire-on-rotation  the same check when a file fills up and the server rotates by itself
#   ./run.sh purge           SHOW BINARY LOGS, then PURGE BINARY LOGS TO and BEFORE with a replica attached
#   ./run.sh purge-in-use    PURGE while a connected replica is still reading an older file
#   ./run.sh rm-file         delete a binary log file by hand: what SHOW and PURGE do, and the repair
#   ./run.sh break-replica   stop the replica, write, rotate, purge: error 1236 when it comes back
#   ./run.sh skip-replica    the unsafe shortcut: jump over the purged part; rows are missing
#   ./run.sh fix-replica     rebuild the replica from a dump that carries its own position
#   ./run.sh other-1236      an error 1236 that purging did not cause (position past the end of a file)
#
# Debezium as the reader (the second MySQL server is removed first to stay inside the memory budget):
#   ./run.sh up-debezium     start Kafka and Kafka Connect, register the connector, wait for the snapshot
#   ./run.sh break-debezium  stop the connector, write, let the binary log expire, resume: the task fails
#   ./run.sh fix-debezium    snapshot.mode=when_needed: the connector takes a new snapshot
#   ./run.sh reset-debezium  the other fix: clear the stored offset, then snapshot.mode=initial
#   ./run.sh quiet-debezium  a running connector whose tables are quiet: the stored offset goes stale
#   ./run.sh heartbeat-debezium  the same with heartbeat.interval.ms set: the stored offset keeps moving
#
#   ./run.sh down            remove everything, volumes included
#
# Choose the version and the mode with environment variables (set them for every step of a run):
#   MYSQL_IMAGE=mysql:8.0.46                                  MySQL 8.0
#   MYSQL_IMAGE=mysql:5.7.44 MYSQL_PLATFORM=linux/amd64       MySQL 5.7 (x86-64 image)
#   GTID=ON                                                   gtid_mode=ON and GTID auto-positioning
#   LEGACY=1 DEBEZIUM_IMAGE=quay.io/debezium/connect:1.9      Debezium 1.9.7.Final (x86-64 image)
set -euo pipefail
cd "$(dirname "$0")"

export GTID="${GTID:-OFF}"
CONNECT="http://localhost:${CONNECT_PORT:-18183}"
NAME=inventory-connector
LEGACY="${LEGACY:-0}"

# ---- MySQL helpers -------------------------------------------------------------------------
sql() { # service, statements: prints result tables and any error, never stops the script
  docker compose exec -T "$1" mysql -uroot -prootpw -t -e "$2" 2>&1 | grep -v 'Using a password' || true
}
val() { docker compose exec -T "$1" mysql -uroot -prootpw -N -B -e "$2" 2>/dev/null; }
say() { printf '\n## %s\n' "$*"; }
now() { date -u +%Y-%m-%dT%H:%M:%SZ; }

# Statement names changed twice: 8.0 added the source/replica forms, 8.4 removed the old ones.
flavor() {
  VER="$(val source 'SELECT VERSION()')"
  case "$VER" in
    5.7.*)
      CHANGE="CHANGE MASTER TO"; AUTOPOS="MASTER_AUTO_POSITION=1"
      HOSTOPTS="MASTER_HOST='source', MASTER_USER='repl', MASTER_PASSWORD='replpw'"
      LOGFILE=MASTER_LOG_FILE; LOGPOS=MASTER_LOG_POS
      START="START SLAVE"; STOP="STOP SLAVE"; STATUS="SHOW SLAVE STATUS"
      BINSTATUS="SHOW MASTER STATUS"; RESETBIN="RESET MASTER"; DUMPPOS="--master-data=1" ;;
    8.0.*)
      CHANGE="CHANGE REPLICATION SOURCE TO"; AUTOPOS="SOURCE_AUTO_POSITION=1"
      HOSTOPTS="SOURCE_HOST='source', SOURCE_USER='repl', SOURCE_PASSWORD='replpw', GET_SOURCE_PUBLIC_KEY=1"
      LOGFILE=SOURCE_LOG_FILE; LOGPOS=SOURCE_LOG_POS
      START="START REPLICA"; STOP="STOP REPLICA"; STATUS="SHOW REPLICA STATUS"
      BINSTATUS="SHOW MASTER STATUS"; RESETBIN="RESET MASTER"; DUMPPOS="--source-data=1" ;;
    *)
      CHANGE="CHANGE REPLICATION SOURCE TO"; AUTOPOS="SOURCE_AUTO_POSITION=1"
      HOSTOPTS="SOURCE_HOST='source', SOURCE_USER='repl', SOURCE_PASSWORD='replpw', GET_SOURCE_PUBLIC_KEY=1"
      LOGFILE=SOURCE_LOG_FILE; LOGPOS=SOURCE_LOG_POS
      START="START REPLICA"; STOP="STOP REPLICA"; STATUS="SHOW REPLICA STATUS"
      BINSTATUS="SHOW BINARY LOG STATUS"; RESETBIN="RESET BINARY LOGS AND GTIDS"; DUMPPOS="--source-data=1" ;;
  esac
}

status() { # the lines of the replica status that matter here
  docker compose exec -T replica mysql -uroot -prootpw -e "$STATUS\G" 2>/dev/null |
    grep -E '^ *(Master_Log_File|Source_Log_File|Read_Master_Log_Pos|Read_Source_Log_Pos|Relay_Master_Log_File|Relay_Source_Log_File|Exec_Master_Log_Pos|Exec_Source_Log_Pos|Slave_IO_Running|Replica_IO_Running|Slave_SQL_Running|Replica_SQL_Running|Seconds_Behind_Master|Seconds_Behind_Source|Last_IO_Errno|Last_IO_Error|Last_SQL_Errno|Last_SQL_Error|Retrieved_Gtid_Set|Executed_Gtid_Set|Auto_Position):' || true
}
field() { docker compose exec -T replica mysql -uroot -prootpw -e "$STATUS\G" 2>/dev/null | awk -v k="$1:" '$1==k {print $2}'; }
io_running() { local v; v="$(field Replica_IO_Running)"; [[ -n "$v" ]] || v="$(field Slave_IO_Running)"; echo "$v"; }
exec_file() { local v; v="$(field Relay_Source_Log_File)"; [[ -n "$v" ]] || v="$(field Relay_Master_Log_File)"; echo "$v"; }
settle() { # wait until the replica has applied everything the source has written
  local want got
  for _ in $(seq 1 30); do
    want="$(val source 'SELECT CONCAT(COUNT(*), "/", COALESCE(SUM(quantity),0)) FROM inventory.orders')"
    got="$(val replica 'SELECT CONCAT(COUNT(*), "/", COALESCE(SUM(quantity),0)) FROM inventory.orders' || true)"
    [[ "$want" == "$got" && "$(io_running)" == Yes ]] && return 0
    sleep 1
  done
  return 0
}
counts() {
  local s
  for s in source replica; do
    echo "  $s: customers=$(val "$s" 'SELECT COUNT(*) FROM inventory.customers' || echo '?') orders=$(val "$s" 'SELECT COUNT(*) FROM inventory.orders' || echo '?')"
  done
}
errors_since() { # service, timestamp: the error and warning lines the server logged since then
  docker compose logs --no-log-prefix --since "$2" "$1" 2>&1 | grep -E '\[(ERROR|Warning)\]' | grep -v -E 'MY-010897|Storing MySQL user name|If a crash happens this configuration' | cut -c1-900 || echo "  (no error or warning lines)"
}
current_file() { val source "$BINSTATUS" | awk '{print $1}'; }
oldest_file() { val source 'SHOW BINARY LOGS' | head -1 | awk '{print $1}'; }

provision() { # load the replica from a dump of the source that records where the dump was taken
  sql replica "$STOP;"
  if [[ "$GTID" == ON ]]; then
    # The dump sets gtid_purged on the replica, which needs an empty gtid_executed there.
    sql replica "$RESETBIN;"
    docker compose exec -T source mysqldump -uroot -prootpw --databases inventory --single-transaction --set-gtid-purged=ON 2>/dev/null |
      docker compose exec -T replica mysql -uroot -prootpw 2>&1 | grep -v 'Using a password' || true
    sql replica "$CHANGE $HOSTOPTS, $AUTOPOS;"
  else
    # The dump carries the file name and position as a CHANGE statement.
    sql replica "$CHANGE $HOSTOPTS;"
    docker compose exec -T source mysqldump -uroot -prootpw --databases inventory --single-transaction "$DUMPPOS" 2>/dev/null |
      docker compose exec -T replica mysql -uroot -prootpw 2>&1 | grep -v 'Using a password' || true
  fi
  sql replica "$START;"
  settle
}

# ---- Kafka Connect helpers -------------------------------------------------------------------
kafka() { docker compose exec -T kafka /opt/kafka/bin/"$@" 2>/dev/null; }
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
cause() { # the exception lines of the failed task, without stack frames
  curl -s "$CONNECT/connectors/$1/status" |
    python3 -c 'import sys,json
for t in json.load(sys.stdin).get("tasks",[]):
    for l in t.get("trace","").splitlines():
        if not l.startswith("\tat ") and not l.startswith("\t..."): print("  "+(l if len(l)<=520 else l[:260]+" [...] "+l[-240:]))'
}
topic_counts() { kafka kafka-get-offsets.sh --bootstrap-server kafka:9092 --topic-partitions "dbserver1.inventory.customers:0,dbserver1.inventory.orders:0" | sed 's/^/  /'; }
ops() { # topic: how many events of each kind (r snapshot read, c insert, u update, d delete) it holds
  kafka kafka-console-consumer.sh --bootstrap-server kafka:9092 --topic "$1" --from-beginning --timeout-ms 8000 |
    python3 -c 'import sys,json,collections
c=collections.Counter()
for l in sys.stdin:
    l=l.strip()
    if not l or l=="null": c["tombstone"]+=bool(l); continue
    try: p=json.loads(l).get("payload") or {}
    except ValueError: continue
    c[p.get("op","?")+("" if (p.get("source") or {}).get("snapshot") in (None,"false") else "(snapshot)")]+=1
print("  "+sys.argv[1]+": "+", ".join(k+"="+str(v) for k,v in sorted(c.items())))' "$1"
}
put_config() { curl -s -o /dev/null -w "  PUT config: %{http_code}\n" -X PUT -H 'Content-Type: application/json' --data "$2" "$CONNECT/connectors/$1/config"; }
# Debezium 2.0 renamed database.server.name to topic.prefix and database.history.* to schema.history.internal.*.
config() { # snapshot.mode
  if [[ "$LEGACY" == 1 ]]; then
    python3 - "$1" <<'PY'
import json,sys
print(json.dumps({
  "connector.class": "io.debezium.connector.mysql.MySqlConnector", "tasks.max": "1",
  "database.hostname": "source", "database.port": "3306",
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
connect_log() { # timestamp, pattern: the first 30 matching Kafka Connect log lines since then, long ones shortened in the middle
  docker compose logs --no-log-prefix --since "$1" connect 2>&1 | grep -E "$2" | head -30 |
    awk '{ if (length($0) > 620) print substr($0, 1, 330) " [...] " substr($0, length($0) - 259); else print }' || true
}
wait_connect() { # until the Kafka Connect REST API answers; the x86-64 image takes minutes on Apple silicon
  for _ in $(seq 1 240); do
    [[ "$(curl -s -o /dev/null -w '%{http_code}' "$CONNECT/connectors" || true)" == 200 ]] && return 0
    sleep 2
  done
  echo "  Kafka Connect did not answer on $CONNECT"; return 1
}
stop_connector() {
  if [[ "$LEGACY" == 1 ]]; then
    # No stop endpoint before Kafka Connect 3.5: remove the connector, which keeps its offsets.
    curl -s -o /dev/null -w "  DELETE connector: %{http_code}\n" -X DELETE "$CONNECT/connectors/$NAME"
  else
    curl -s -o /dev/null -w "  PUT stop: %{http_code}\n" -X PUT "$CONNECT/connectors/$NAME/stop"
  fi
  sleep 6
}

noise() { # fill, rotate and expire the binary log without touching a captured table
  sql source "INSERT INTO noise.ticks () VALUES (),(),(); FLUSH BINARY LOGS; INSERT INTO noise.ticks () VALUES (),(),(); FLUSH BINARY LOGS;"
  sql source "SET GLOBAL binlog_expire_logs_seconds = 5;"
  sleep 8
  sql source "FLUSH BINARY LOGS; INSERT INTO noise.ticks () VALUES (),(),(); SHOW BINARY LOGS;"
  sql source "SET GLOBAL binlog_expire_logs_seconds = 2592000;"
  sleep 5
  sql source "INSERT INTO noise.ticks () VALUES ();"
}

case "${1:-}" in
up)
  docker compose up -d --wait source replica
  flavor
  say "versions"
  sql source "SELECT VERSION() AS source_version, @@gtid_mode AS gtid_mode, @@binlog_format AS binlog_format;"
  say "load the replica from a dump and start replication"
  provision
  status; counts
  ;;
variables)
  flavor
  say "retention variables on $VER"
  sql source "SHOW GLOBAL VARIABLES WHERE Variable_name IN ('expire_logs_days','binlog_expire_logs_seconds','binlog_expire_logs_auto_purge','max_binlog_size','log_bin_basename','log_bin_index');"
  say "SELECT @@GLOBAL.expire_logs_days"
  sql source "SELECT @@GLOBAL.expire_logs_days;"
  say "SELECT @@GLOBAL.binlog_expire_logs_seconds"
  sql source "SELECT @@GLOBAL.binlog_expire_logs_seconds;"
  case "$VER" in
    5.7.*)
      say "SET GLOBAL expire_logs_days = 7"
      sql source "SET GLOBAL expire_logs_days = 7; SHOW WARNINGS; SELECT @@GLOBAL.expire_logs_days;"
      sql source "SET GLOBAL expire_logs_days = 0;" ;;
    8.0.*)
      say "SET GLOBAL expire_logs_days = 7 (with binlog_expire_logs_seconds at its default)"
      sql source "SET GLOBAL expire_logs_days = 7;"
      say "SET GLOBAL binlog_expire_logs_seconds = 0, then expire_logs_days = 7"
      sql source "SET GLOBAL binlog_expire_logs_seconds = 0; SET GLOBAL expire_logs_days = 7; SHOW WARNINGS; SELECT @@GLOBAL.expire_logs_days, @@GLOBAL.binlog_expire_logs_seconds;"
      say "SET GLOBAL binlog_expire_logs_seconds = 604800 (with expire_logs_days at 7)"
      sql source "SET GLOBAL binlog_expire_logs_seconds = 604800;"
      say "back to the defaults"
      sql source "SET GLOBAL expire_logs_days = 0; SET GLOBAL binlog_expire_logs_seconds = 2592000; SELECT @@GLOBAL.expire_logs_days, @@GLOBAL.binlog_expire_logs_seconds;" ;;
    *)
      say "SET GLOBAL expire_logs_days = 7"
      sql source "SET GLOBAL expire_logs_days = 7;" ;;
  esac
  for stmt in "SHOW BINARY LOGS" "SHOW MASTER LOGS" "SHOW BINARY LOG STATUS" "SHOW MASTER STATUS"; do
    say "$stmt"; sql source "$stmt;"
  done
  for stmt in "SHOW REPLICA STATUS" "SHOW SLAVE STATUS"; do
    say "$stmt (first line of the result or the error)"
    docker compose exec -T replica mysql -uroot -prootpw -e "$stmt\G" 2>&1 | grep -v 'Using a password' | head -2 | cut -c1-200 || true
  done
  ;;
expire)
  flavor
  say "three files, the oldest one back-dated by two days"
  sql source "FLUSH BINARY LOGS; FLUSH BINARY LOGS;"
  OLD="$(oldest_file)"
  docker compose exec -T source touch -d '2 days ago' "/var/lib/mysql/$OLD"
  docker compose exec -T source sh -c 'ls -l --time-style=long-iso /var/lib/mysql/mysql-bin.0*' | awk '{print "  "$6" "$7" "$8}'
  say "retention of one day"
  if [[ "$VER" == 5.7.* ]]; then sql source "SET GLOBAL expire_logs_days = 1; SELECT @@GLOBAL.expire_logs_days;"
  else sql source "SET GLOBAL binlog_expire_logs_seconds = 86400; SELECT @@GLOBAL.binlog_expire_logs_seconds;"; fi
  sleep 10
  say "10 seconds later, no flush yet: $OLD is two days old and still listed"
  sql source "SHOW BINARY LOGS;"
  say "FLUSH BINARY LOGS: the expired file goes"
  sql source "FLUSH BINARY LOGS; SHOW BINARY LOGS;"
  if [[ "$VER" != 5.7.* ]]; then
    say "retention of 5 seconds, then 8 seconds of waiting: nothing is removed"
    sql source "SET GLOBAL binlog_expire_logs_seconds = 5;"
    sleep 8
    sql source "SHOW BINARY LOGS;"
    say "FLUSH BINARY LOGS: every file older than 5 seconds goes"
    sql source "FLUSH BINARY LOGS; SHOW BINARY LOGS;"
    say "binlog_expire_logs_auto_purge = OFF, then 8 seconds and a flush: nothing is removed"
    sql source "SET GLOBAL binlog_expire_logs_auto_purge = OFF;"
    sleep 8
    sql source "FLUSH BINARY LOGS; SHOW BINARY LOGS;"
    sql source "SET GLOBAL binlog_expire_logs_auto_purge = ON;"
  fi
  say "back to the defaults; the replica is still running"
  if [[ "$VER" == 5.7.* ]]; then sql source "SET GLOBAL expire_logs_days = 0;"; else sql source "SET GLOBAL binlog_expire_logs_seconds = 2592000;"; fi
  settle; status
  ;;
expire-on-rotation)
  flavor
  say "a 4096-byte max_binlog_size, a one-day retention, and the oldest file back-dated by two days"
  OLD="$(oldest_file)"
  docker compose exec -T source touch -d '2 days ago' "/var/lib/mysql/$OLD"
  if [[ "$VER" == 5.7.* ]]; then sql source "SET GLOBAL max_binlog_size = 4096; SET GLOBAL expire_logs_days = 1;"
  else sql source "SET GLOBAL max_binlog_size = 4096; SET GLOBAL binlog_expire_logs_seconds = 86400;"; fi
  sql source "SHOW BINARY LOGS;"
  say "40 inserts and no FLUSH statement: the server starts a new file each time one is full"
  for _ in $(seq 1 40); do val source "INSERT INTO inventory.orders (customer_id, quantity) VALUES (1, 1);"; done
  sql source "SHOW BINARY LOGS;"
  say "back to the defaults; the replica is still running"
  if [[ "$VER" == 5.7.* ]]; then sql source "SET GLOBAL max_binlog_size = 1073741824; SET GLOBAL expire_logs_days = 0;"
  else sql source "SET GLOBAL max_binlog_size = 1073741824; SET GLOBAL binlog_expire_logs_seconds = 2592000;"; fi
  settle; status; counts
  ;;
purge)
  flavor
  sql source "FLUSH BINARY LOGS; INSERT INTO inventory.orders (customer_id, quantity) VALUES (1, 2); FLUSH BINARY LOGS; INSERT INTO inventory.orders (customer_id, quantity) VALUES (2, 3); FLUSH BINARY LOGS; FLUSH BINARY LOGS;"
  settle
  # Back-date the two oldest files so that PURGE ... BEFORE has something to remove.
  for f in $(val source 'SHOW BINARY LOGS' | head -2 | awk '{print $1}'); do
    docker compose exec -T source touch -d '3 days ago' "/var/lib/mysql/$f"
  done
  say "step 1: which file is each reader on? (the replica)"
  status
  say "step 2: what the source has, with the time each file was last written"
  sql source "SHOW BINARY LOGS;"
  docker compose exec -T source sh -c 'ls -l --time-style=long-iso /var/lib/mysql/mysql-bin.0*' | awk '{print "  "$6" "$7" "$8}'
  say "PURGE BINARY LOGS BEFORE NOW() - INTERVAL 1 DAY: removes the files last written more than a day ago"
  sql source "PURGE BINARY LOGS BEFORE NOW() - INTERVAL 1 DAY; SHOW WARNINGS; SHOW BINARY LOGS;"
  TARGET="$(exec_file)"
  say "step 3: purge up to, not including, the oldest file a reader still needs: PURGE BINARY LOGS TO '$TARGET'"
  sql source "PURGE BINARY LOGS TO '$TARGET'; SHOW WARNINGS; SHOW BINARY LOGS;"
  say "the replica after the purge"
  sql source "INSERT INTO inventory.orders (customer_id, quantity) VALUES (3, 4);"
  settle; status; counts
  ;;
purge-in-use)
  flavor
  T0="$(now)"
  say "freeze the replica while it is connected, then write about 48 MB on the source"
  sql source "CREATE TABLE IF NOT EXISTS inventory.filler (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, pad MEDIUMBLOB);"
  settle
  docker compose pause replica
  for _ in $(seq 1 16); do
    val source "INSERT INTO inventory.filler (pad) VALUES (REPEAT('x', 1000000)),(REPEAT('y', 1000000)),(REPEAT('z', 1000000));"
  done
  sql source "FLUSH BINARY LOGS; FLUSH BINARY LOGS; SHOW BINARY LOGS;"
  say "the source still has a dump thread open for the frozen replica"
  sql source "SELECT ID, USER, COMMAND, STATE FROM information_schema.PROCESSLIST WHERE COMMAND LIKE 'Binlog Dump%';"
  CUR="$(current_file)"
  say "PURGE BINARY LOGS TO '$CUR' while that thread is in the middle of an older file"
  sql source "PURGE BINARY LOGS TO '$CUR'; SHOW WARNINGS; SHOW BINARY LOGS;"
  say "unfreeze the replica: it carries on"
  docker compose unpause replica
  for _ in $(seq 1 60); do
    [[ "$(val replica 'SELECT COUNT(*) FROM inventory.filler' || true)" == 48 ]] && break; sleep 1
  done
  status
  echo "  filler rows: source=$(val source 'SELECT COUNT(*) FROM inventory.filler') replica=$(val replica 'SELECT COUNT(*) FROM inventory.filler')"
  errors_since replica "$T0"
  sql source "DROP TABLE inventory.filler;"
  settle
  ;;
rm-file)
  flavor
  sql source "FLUSH BINARY LOGS; FLUSH BINARY LOGS; FLUSH BINARY LOGS;"
  settle
  say "before"
  sql source "SHOW BINARY LOGS;"
  VICTIM="$(val source 'SHOW BINARY LOGS' | sed -n '2p' | awk '{print $1}')"
  CUR="$(current_file)"
  T0="$(now)"
  say "rm /var/lib/mysql/$VICTIM (never do this on a server you care about)"
  docker compose exec -T source rm "/var/lib/mysql/$VICTIM"
  say "SHOW BINARY LOGS after the file is gone"
  sql source "SHOW BINARY LOGS;"
  say "PURGE BINARY LOGS TO '$CUR'"
  sql source "PURGE BINARY LOGS TO '$CUR'; SHOW WARNINGS; SHOW BINARY LOGS;"
  say "the index file"
  docker compose exec -T source cat /var/lib/mysql/mysql-bin.index | sed 's/^/  /'
  say "source error log"
  errors_since source "$T0"
  if docker compose exec -T source grep -q "$VICTIM" /var/lib/mysql/mysql-bin.index; then
    say "repair: take the missing file out of the index, then purge again"
    docker compose exec -T source sed -i "/$VICTIM/d" /var/lib/mysql/mysql-bin.index
    sql source "FLUSH BINARY LOGS;"
    CUR="$(current_file)"
    sql source "PURGE BINARY LOGS TO '$CUR'; SHOW WARNINGS; SHOW BINARY LOGS;"
  fi
  say "the replica"
  sql source "INSERT INTO inventory.orders (customer_id, quantity) VALUES (4, 5);"
  settle; status; counts
  ;;
break-replica)
  flavor
  settle
  say "the replica before it stops"
  status
  sql replica "$STOP;"
  TS="$(date +%s)"
  say "while the replica is stopped: 3 new customers, 1 changed order, two rotations"
  sql source "INSERT INTO inventory.customers (first_name,last_name,email) VALUES ('Down','One','down.one.$TS@example.com'),('Down','Two','down.two.$TS@example.com'),('Down','Three','down.three.$TS@example.com');
              FLUSH BINARY LOGS;
              UPDATE inventory.orders SET quantity = quantity + 10 WHERE id = 1;
              FLUSH BINARY LOGS;
              SHOW BINARY LOGS;"
  CUR="$(current_file)"
  say "PURGE BINARY LOGS TO '$CUR'"
  sql source "PURGE BINARY LOGS TO '$CUR'; SHOW WARNINGS; SHOW BINARY LOGS;"
  [[ "$GTID" == ON ]] && sql source "SELECT @@GLOBAL.gtid_executed, @@GLOBAL.gtid_purged\G"
  T0="$(now)"
  say "start the replica again"
  sql replica "$START;"
  sleep 5
  status
  say "replica error log"
  errors_since replica "$T0"
  say "source error log"
  errors_since source "$T0"
  say "rows"
  counts
  ;;
skip-replica)
  flavor
  T0="$(now)"
  if [[ "$GTID" == ON ]]; then
    PURGED="$(val source 'SELECT @@GLOBAL.gtid_purged' | tr -d '\n')"
    say "unsafe: tell the replica it already has everything the source purged ($PURGED)"
    sql replica "$STOP; $RESETBIN; SET GLOBAL gtid_purged = '$PURGED'; $START;"
  else
    FIRST="$(oldest_file)"
    say "unsafe: point the replica at the start of the oldest file the source still has ($FIRST)"
    sql replica "$STOP; $CHANGE $LOGFILE='$FIRST', $LOGPOS=4; $START;"
  fi
  sleep 5
  status
  say "replication reports no error, and the rows written during the outage are missing"
  counts
  echo "  source: order 1 quantity=$(val source 'SELECT quantity FROM inventory.orders WHERE id=1') replica: order 1 quantity=$(val replica 'SELECT quantity FROM inventory.orders WHERE id=1')"
  say "later, the source changes one of the rows the replica never received"
  sql source "UPDATE inventory.customers SET last_name = 'Changed' WHERE first_name = 'Down' AND last_name = 'One';"
  sleep 5
  status
  errors_since replica "$T0"
  ;;
fix-replica)
  flavor
  if [[ "$GTID" == ON ]]; then
    say "first, the dump loaded without clearing the replica's GTID state"
    sql replica "$STOP;"
    docker compose exec -T source mysqldump -uroot -prootpw --databases inventory --single-transaction --set-gtid-purged=ON 2>/dev/null |
      docker compose exec -T replica mysql -uroot -prootpw 2>&1 | grep -v 'Using a password' || true
  fi
  say "rebuild the replica from a dump of the source"
  provision
  sql source "INSERT INTO inventory.customers (first_name,last_name,email) VALUES ('After','Fix','after.fix.$(date +%s)@example.com');"
  settle; sleep 2
  status
  say "rows and checksums"
  counts
  sql source "CHECKSUM TABLE inventory.customers, inventory.orders;"
  sql replica "CHECKSUM TABLE inventory.customers, inventory.orders;"
  ;;
other-1236)
  flavor
  CUR="$(current_file)"
  T0="$(now)"
  say "not a retention problem: ask for a position past the end of a file that exists ($CUR)"
  if [[ "$GTID" == ON ]]; then echo "  run this step with GTID=OFF: a position cannot be set while auto-positioning is on"; exit 0; fi
  sql replica "$STOP; $CHANGE $LOGFILE='$CUR', $LOGPOS=999999999; $START;"
  sleep 5
  status
  errors_since replica "$T0"
  say "put the replica back"
  provision; status
  ;;
up-debezium)
  docker compose rm -sf replica > /dev/null 2>&1 || true
  docker compose up -d --wait source kafka connect
  flavor
  wait_connect
  say "versions"
  sql source "SELECT VERSION() AS source_version, @@gtid_mode AS gtid_mode;"
  curl -s "$CONNECT/" | sed 's/^/  Kafka Connect: /'; echo
  curl -s "$CONNECT/connector-plugins" | python3 -c 'import sys,json
for p in json.load(sys.stdin):
    if "MySqlConnector" in p["class"]: print("  "+p["class"]+" "+p.get("version",""))'
  say "register the connector"
  put_config "$NAME" "$(config initial)"
  wait_for "$NAME" 'RUNNING RUNNING' 180
  sleep 8
  topic_counts
  ops dbserver1.inventory.customers; ops dbserver1.inventory.orders
  ;;
break-debezium)
  flavor
  say "stop the connector"
  stop_connector
  [[ "$LEGACY" == 1 ]] || { echo "  stored offset:"; curl -s "$CONNECT/connectors/$NAME/offsets" | sed 's/^/  /'; echo; }
  TS="$(date +%s)"
  say "while it is stopped: 3 new customers, 1 changed order, 1 deleted order"
  sql source "INSERT INTO inventory.customers (first_name,last_name,email) VALUES ('Down','One','down.one.$TS@example.com'),('Down','Two','down.two.$TS@example.com'),('Down','Three','down.three.$TS@example.com');
              UPDATE inventory.orders SET quantity = quantity + 10 WHERE id = 1;
              DELETE FROM inventory.orders ORDER BY id DESC LIMIT 1;
              FLUSH BINARY LOGS;
              SHOW BINARY LOGS;"
  say "retention of 5 seconds, 8 seconds of waiting, then the next rotation removes the old files"
  sql source "SET GLOBAL binlog_expire_logs_seconds = 5;"
  sleep 8
  sql source "FLUSH BINARY LOGS; SHOW BINARY LOGS;"
  sql source "SET GLOBAL binlog_expire_logs_seconds = 2592000;"
  [[ "$GTID" == ON ]] && sql source "SELECT @@GLOBAL.gtid_executed, @@GLOBAL.gtid_purged\G"
  T0="$(now)"
  say "start the connector again"
  if [[ "$LEGACY" == 1 ]]; then put_config "$NAME" "$(config "${SNAPSHOT_MODE:-initial}")"
  else curl -s -o /dev/null -w "  PUT resume: %{http_code}\n" -X PUT "$CONNECT/connectors/$NAME/resume"; fi
  wait_for "$NAME" 'FAILED' "${FAIL_WAIT:-45}" || echo "  the task did not fail"
  say "task trace"
  cause "$NAME"
  say "Kafka Connect log"
  connect_log "$T0" 'no longer available|Connector requires binlog file|GTIDs|GTID set|purged|has the binlog file|Task threw an uncaught|recorded offset|Attempting to snapshot|Finished exporting|Snapshot completed|Starting streaming|1236|Error during binlog processing|Could not find first log file|Connected to|Retry [0-9]+ of|Going to restart connector'
  say "events in the topics"
  topic_counts
  ;;
fix-debezium)
  flavor
  T0="$(now)"
  say "set snapshot.mode to when_needed"
  put_config "$NAME" "$(config when_needed)"
  wait_for "$NAME" 'RUNNING RUNNING' 120
  sleep 12
  say "Kafka Connect log"
  connect_log "$T0" 'no longer available|Forcing the snapshot|Attempting to snapshot|Snapshot completed|Starting streaming|rows scanned|Finished exporting'
  say "events in the topics"
  topic_counts
  ops dbserver1.inventory.customers; ops dbserver1.inventory.orders
  say "rows in the source"
  echo "  customers=$(val source 'SELECT COUNT(*) FROM inventory.customers') orders=$(val source 'SELECT COUNT(*) FROM inventory.orders')"
  say "a new change after the fix is streamed"
  sql source "INSERT INTO inventory.customers (first_name,last_name,email) VALUES ('After','Fix','after.fix.$(date +%s)@example.com');"
  sleep 6
  topic_counts
  ops dbserver1.inventory.customers
  ;;
reset-debezium)
  flavor
  if [[ "$LEGACY" == 1 ]]; then echo "  needs Kafka Connect 3.6 or later (the offsets endpoint)"; exit 1; fi
  T0="$(now)"
  say "stop the connector, clear its offsets, delete the schema history topic, snapshot again"
  curl -s -o /dev/null -w "  PUT stop: %{http_code}\n" -X PUT "$CONNECT/connectors/$NAME/stop"; sleep 6
  curl -s -X DELETE "$CONNECT/connectors/$NAME/offsets" | sed 's/^/  /'; echo
  kafka kafka-topics.sh --bootstrap-server kafka:9092 --delete --topic schemahistory.inventory || true; sleep 3
  put_config "$NAME" "$(config initial)"
  curl -s -o /dev/null -w "  PUT resume: %{http_code}\n" -X PUT "$CONNECT/connectors/$NAME/resume"
  wait_for "$NAME" 'RUNNING RUNNING' 120
  sleep 12
  say "events in the topics"
  topic_counts
  ops dbserver1.inventory.customers; ops dbserver1.inventory.orders
  say "rows in the source"
  echo "  customers=$(val source 'SELECT COUNT(*) FROM inventory.customers') orders=$(val source 'SELECT COUNT(*) FROM inventory.orders')"
  ;;
quiet-debezium)
  flavor
  if [[ "$LEGACY" == 1 ]]; then echo "  needs Kafka Connect 3.5 or later (the offsets endpoint)"; exit 1; fi
  say "the connector is running; its stored offset (Kafka Connect commits offsets every 60 seconds by default)"
  for _ in $(seq 1 45); do
    curl -s "$CONNECT/connectors/$NAME/offsets" | grep -q '"file"' && break; sleep 2
  done
  state "$NAME" | sed 's/^/  /'
  curl -s "$CONNECT/connectors/$NAME/offsets" | sed 's/^/  /'; echo
  say "writes go only to a database the connector does not capture, the log rotates and expires"
  noise
  say "the connector is still running, and its stored offset has not moved"
  state "$NAME" | sed 's/^/  /'
  curl -s "$CONNECT/connectors/$NAME/offsets" | sed 's/^/  /'; echo
  T0="$(now)"
  say "restart the task, as a deploy or a crash would"
  curl -s -o /dev/null -w "  POST restart: %{http_code}\n" -X POST "$CONNECT/connectors/$NAME/restart?includeTasks=true"
  wait_for "$NAME" 'FAILED' "${FAIL_WAIT:-45}" || echo "  the task did not fail"
  say "task trace"
  cause "$NAME"
  say "Kafka Connect log"
  connect_log "$T0" 'no longer available|Connector requires binlog file|purged|recorded offset|Task threw an uncaught'
  ;;
heartbeat-debezium)
  flavor
  if [[ "$LEGACY" == 1 ]]; then echo "  needs Kafka Connect 3.5 or later (the offsets endpoint)"; exit 1; fi
  say "set heartbeat.interval.ms to 2000"
  put_config "$NAME" "$(config initial | python3 -c 'import sys,json; c=json.load(sys.stdin); c["heartbeat.interval.ms"]="2000"; print(json.dumps(c))')"
  wait_for "$NAME" 'RUNNING RUNNING' 120
  sleep 5
  say "stored offset and topic counts before"
  curl -s "$CONNECT/connectors/$NAME/offsets" | sed 's/^/  /'; echo
  topic_counts
  say "the same writes to the database the connector does not capture, the same rotation and expiry"
  noise
  say "70 seconds later (Kafka Connect commits offsets every 60 seconds by default): the stored offset has moved"
  sleep 70
  curl -s "$CONNECT/connectors/$NAME/offsets" | sed 's/^/  /'; echo
  T0="$(now)"
  say "restart the task"
  curl -s -o /dev/null -w "  POST restart: %{http_code}\n" -X POST "$CONNECT/connectors/$NAME/restart?includeTasks=true"
  sleep 10
  wait_for "$NAME" 'RUNNING RUNNING' 60
  say "Kafka Connect log (no line about a lost position)"
  connect_log "$T0" 'no longer available|Connector requires binlog file|has the binlog file|Snapshot|Starting streaming|Task threw an uncaught' 
  say "topic counts after: no new snapshot"
  topic_counts
  kafka kafka-get-offsets.sh --bootstrap-server kafka:9092 --topic-partitions "__debezium-heartbeat.dbserver1:0" | sed 's/^/  /'
  ;;
down)
  COMPOSE_PROFILES=replication,debezium docker compose down -v
  ;;
*)
  sed -n '2,32p' "$0"; exit 1
  ;;
esac
