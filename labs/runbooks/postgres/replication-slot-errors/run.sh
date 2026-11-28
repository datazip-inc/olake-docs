#!/usr/bin/env bash
# Lab: PostgreSQL replication slot errors. A slot that does not exist, a slot name that is taken, a slot
# that another session holds, and a slot that has been invalidated, with the fix for each.
# The consumers are pg_recvlogical and pg_receivewal, the clients that ship with PostgreSQL, and a
# subscription, PostgreSQL's own logical replication. The standby steps add a second server.
#
#   ./run.sh up              start PostgreSQL (wal_level = logical) with three databases and a publication
#   ./run.sh missing         replication slot "x" does not exist: SQL functions, streaming, a physical slot, another database
#   ./run.sh recreate        the fix: create the slot again; a consumer that resumes at its saved position skips what was written in between
#   ./run.sh exists          replication slot "x" already exists: a second create, another database, a physical slot, --if-not-exists
#   ./run.sh active          replication slot "x" is active for PID n: a second consumer, a frozen one, wal_sender_timeout
#   ./run.sh subscription    the same errors through CREATE SUBSCRIPTION, DROP SUBSCRIPTION and the apply worker
#   ./run.sh invalidated     a slot invalidated by max_slot_wal_keep_size, and what its readers get
#   ./run.sh standby         a standby whose primary_slot_name does not exist on the primary
#   ./run.sh promote         a logical slot after its standby is promoted
#   ./run.sh failover-slots  PostgreSQL 17 and later: a failover slot synchronized to the standby, then promoted
#   ./run.sh all             every step above in order, each captured under logs/postgres-<version>/
#   ./run.sh down            remove everything
#
# Another version:  PG_VERSION=13.23 ./run.sh all
set -euo pipefail
cd "$(dirname "$0")"

export PG_VERSION="${PG_VERSION:-19.0}"
SVC=pg

dc() { docker compose --profile standby "$@"; }
# Run a command in the container with its two output streams merged there, so lines keep their order.
inside() { dc exec -T "$SVC" bash -c 'exec "$@" 2>&1' bash "$@"; }
# q DATABASE SQL: print the statement, then its result or its error. Never stops the script.
q() { printf '%s\n' "$2"; inside timeout 150 psql -X -U postgres -d "$1" -c "$2" || true; }
# val DATABASE SQL: one bare value, for the script itself.
val() { dc exec -T "$SVC" timeout 60 psql -X -U postgres -d "$1" -At -c "$2" 2>/dev/null || true; }
# The same two on the standby.
qs() { printf '%s    -- on the standby\n' "$2"; SVC=standby inside timeout 150 psql -X -U postgres -d "$1" -c "$2" || true; }
vals() { SVC=standby val "$@"; }
say() { printf '\n## %s\n' "$*"; }
pgnum() { val postgres "SHOW server_version_num"; }
reload() { q postgres "SELECT pg_reload_conf();"; sleep 1; }

# slots [standby]: the slots of the primary, or of the standby, with the columns this version has.
slots() {
  local n cols
  n="$(pgnum)"
  cols="slot_name, slot_type, plugin, database, active, active_pid, confirmed_flush_lsn"
  if (( n >= 130000 )); then cols="$cols, wal_status"; fi
  if (( n >= 170000 )); then cols="$cols, invalidation_reason, failover, synced"; fi
  if [[ "${1:-}" == standby ]]; then
    qs postgres "SELECT $cols, temporary FROM pg_replication_slots ORDER BY slot_name;"
  else
    q postgres "SELECT $cols FROM pg_replication_slots ORDER BY slot_name;"
  fi
}
# Which session holds each slot, and how long ago its client last answered.
HOLDER="SELECT s.slot_name, s.active_pid, a.application_name, a.backend_type,
       date_trunc('second', now() - r.reply_time) AS since_last_reply
FROM pg_replication_slots s
LEFT JOIN pg_stat_activity a ON a.pid = s.active_pid
LEFT JOIN pg_stat_replication r ON r.pid = s.active_pid
ORDER BY s.slot_name;"

# Server log lines that match a pattern, written since this step began or since the previous call
# for the same service. A DETAIL, HINT, CONTEXT or STATEMENT line that follows a matching line from
# the same process is printed with it.
STEP_START="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
SEEN_pg=0
SEEN_standby=0
serverlog() { # SERVICE PATTERN [bare]: bare leaves out the DETAIL, HINT, CONTEXT and STATEMENT lines
  local all out var="SEEN_$1"
  all="$(dc logs --no-log-prefix --since "$STEP_START" "$1" 2>&1)"
  echo "--- server log of $1"
  out="$(tail -n +"$(( ${!var} + 1 ))" <<<"$all" | awk -v pat="$2" -v bare="${3:-}" '
    { pid = ""; if (match($0, /\[[0-9]+\]/)) pid = substr($0, RSTART, RLENGTH) }
    $0 ~ pat { print; keep = pid; next }
    bare == "" && keep != "" && pid == keep && $0 ~ /(DETAIL|HINT|CONTEXT|STATEMENT):  / { print; next }
    { keep = "" }')"
  printf '%s\n' "${out:-(no matching line)}"
  printf -v "$var" '%s' "$(wc -l <<<"$all" | tr -d ' ')"
  echo "---"
}
# wait_sql DATABASE SQL SECONDS [standby]: poll until the statement returns t.
wait_sql() {
  local i v
  for i in $(seq 1 "$3"); do
    if [[ "${4:-}" == standby ]]; then v="$(vals "$1" "$2")"; else v="$(val "$1" "$2")"; fi
    if [[ "$v" == t ]]; then return 0; fi
    sleep 1
  done
  echo "(gave up after $3 s waiting for: $2)"
}

STREAM_OPTS="-o proto_version=1 -o publication_names=cdc_pub"
# consumer NAME SLOT: pg_recvlogical in the background. It reads the slot over the replication
# protocol, as a change data capture (CDC) tool does, and retries every 5 seconds after an error.
# Its application_name is NAME, its output goes to /tmp/NAME.log and its process ID to /tmp/NAME.pid.
consumer() {
  echo "\$ pg_recvlogical -d \"dbname=appdb application_name=$1\" --slot $2 --start $STREAM_OPTS -f /dev/null &"
  dc exec -T -d "$SVC" bash -c 'echo $$ > "/tmp/$0.pid"; : > "/tmp/$0.log"; exec pg_recvlogical -U postgres -d "dbname=appdb application_name=$0" --slot "$1" --start -o proto_version=1 -o publication_names=cdc_pub -f /dev/null >> "/tmp/$0.log" 2>&1' "$1" "$2"
  sleep 2
}
consumer_log() { # NAME [counted]: what the consumer printed since the last call. counted prints
  # each distinct line once, with the number of times it came.
  echo "--- output of $1"
  if [[ "${2:-}" == counted ]]; then
    dc exec -T "$SVC" bash -c 'cat "/tmp/$0.log" 2>/dev/null; : > "/tmp/$0.log"' "$1" | counted || true
  else
    dc exec -T "$SVC" bash -c 'cat "/tmp/$0.log" 2>/dev/null; : > "/tmp/$0.log"' "$1" || true
  fi
  echo "---"
}
# counted: each distinct line of stdin once, in order, with the number of times it came.
counted() {
  awk '{ n[$0]++; if (n[$0] == 1) order[++k] = $0 }
    END { for (i = 1; i <= k; i++) printf "%s%s\n", order[i], (n[order[i]] > 1 ? "    (" n[order[i]] " times)" : "") }'
}
consumer_signal() { # SIGNAL NAME
  echo "\$ kill -$1 <pid of $2>"
  dc exec -T "$SVC" bash -c 'kill "-$0" "$(cat "/tmp/$1.pid")"' "$1" "$2" 2>/dev/null || true
}
# holder_is NAME: true when the session that holds cdc_slot has that application_name.
holder_is() {
  [[ "$(val postgres "SELECT a.application_name FROM pg_replication_slots s JOIN pg_stat_activity a ON a.pid = s.active_pid WHERE s.slot_name = 'cdc_slot'")" == "$1" ]]
}
# stream DATABASE SLOT: one pg_recvlogical run that stops at the first error.
stream() {
  echo "\$ pg_recvlogical -d $1 --slot $2 --start $STREAM_OPTS -f /dev/null --no-loop"
  inside timeout 30 pg_recvlogical -U postgres -d "$1" --slot "$2" --start -o proto_version=1 -o publication_names=cdc_pub -f /dev/null --no-loop || true
}
# read_all SLOT [standby]: read every change in a pgoutput slot of appdb and confirm it. The
# messages are printed by pgoutput.py, an error as it came.
read_all() {
  local out sql="SELECT encode(data, 'hex') FROM pg_logical_slot_get_binary_changes('$1', NULL, NULL, 'proto_version', '1', 'publication_names', 'cdc_pub');"
  if [[ "${2:-}" == standby ]]; then
    printf '%s    -- on the standby, printed by pgoutput.py\n' "$sql"
    out="$(SVC=standby inside timeout 60 psql -X -U postgres -d appdb -At -c "$sql" || true)"
  else
    printf '%s    -- printed by pgoutput.py\n' "$sql"
    out="$(inside timeout 60 psql -X -U postgres -d appdb -At -c "$sql" || true)"
  fi
  if grep -q -E '^(ERROR|FATAL|DETAIL|HINT|psql)' <<<"$out"; then printf '%s\n' "$out"; else printf '%s\n' "$out" | python3 -I pgoutput.py; fi
}
# Stop every consumer, remove the subscriptions without touching the slots, then drop every slot.
drop_all() {
  dc exec -T "$SVC" bash -c 'for p in /proc/[0-9]*; do if [ "$(cat "$p/comm" 2>/dev/null)" = pg_recvlogical ]; then kill -CONT "${p#/proc/}"; kill -TERM "${p#/proc/}"; fi; done' 2>/dev/null || true
  local db s attempt
  for db in subdb otherdb; do
    for s in $(val "$db" "SELECT subname FROM pg_subscription WHERE subdbid = (SELECT oid FROM pg_database WHERE datname = current_database())"); do
      val "$db" "ALTER SUBSCRIPTION $s DISABLE" >/dev/null
      val "$db" "ALTER SUBSCRIPTION $s SET (slot_name = NONE)" >/dev/null
      val "$db" "DROP SUBSCRIPTION $s" >/dev/null
    done
  done
  sleep 1
  for s in $(val postgres "SELECT slot_name FROM pg_replication_slots"); do
    for attempt in 1 2 3 4 5; do
      val postgres "SELECT pg_terminate_backend(active_pid) FROM pg_replication_slots WHERE slot_name = '$s' AND active" >/dev/null
      sleep 0.5
      val postgres "SELECT pg_drop_replication_slot('$s')" >/dev/null
      [[ -z "$(val postgres "SELECT 1 FROM pg_replication_slots WHERE slot_name = '$s'")" ]] && break
    done
  done
}

# ---- standby
standby_remove() { dc rm -sf standby >/dev/null 2>&1 || true; }
# standby_create [SETTING ...]: a new standby cloned from the primary, with these lines added to its
# postgresql.auto.conf, then started.
standby_create() {
  local line i
  standby_remove
  dc up -d standby >/dev/null 2>&1
  sleep 2
  echo "\$ pg_basebackup -h pg -U postgres -D /standby/data -X stream -R -c fast    (on the standby)"
  dc exec -T -u postgres standby bash -c 'pg_basebackup -h pg -U postgres -D /standby/data -X stream -R -c fast 2>&1' || true
  for line in "$@"; do
    echo "\$ echo \"$line\" >> postgresql.auto.conf    (on the standby)"
    dc exec -T -u postgres standby bash -c 'echo "$0" >> /standby/data/postgresql.auto.conf' "$line"
  done
  dc exec -T standby touch /tmp/start-postgres
  for i in $(seq 1 60); do
    if dc exec -T standby pg_isready -q -U postgres >/dev/null 2>&1; then break; fi
    sleep 1
  done
  qs postgres "SELECT pg_is_in_recovery();"
}
# Wait until the standby has replayed everything the primary has written so far.
standby_caught_up() {
  local lsn i
  lsn="$(val postgres "SELECT pg_current_wal_lsn()")"
  for i in $(seq 1 60); do
    if [[ "$(vals postgres "SELECT pg_last_wal_replay_lsn() >= '$lsn'")" == t ]]; then return 0; fi
    sleep 1
  done
  echo "(the standby did not replay up to $lsn within 60 s)"
}
# sync_wait N: wait until the standby holds N synchronized slots that are no longer temporary. In the
# meantime the primary logs a snapshot of running transactions and the slots confirm what they hold,
# so that their positions move past the start of the standby.
sync_wait() {
  local i
  for i in $(seq 1 24); do
    if [[ "$(vals postgres "SELECT count(*) FROM pg_replication_slots WHERE synced AND NOT temporary")" == "$1" ]]; then
      echo "(the standby held $1 synchronized slots after about $(( (i - 1) * 5 )) s)"
      return 0
    fi
    val postgres "SELECT pg_log_standby_snapshot()" >/dev/null
    for s in cdc_slot tool_slot; do
      val appdb "SELECT count(*) FROM pg_logical_slot_get_binary_changes('$s', NULL, NULL, 'proto_version', '1', 'publication_names', 'cdc_pub')" >/dev/null
    done
    sleep 5
  done
  echo "(the standby did not hold $1 synchronized slots after 120 s)"
}

case "${1:-}" in
up)
  dc up -d --wait --quiet-pull pg >/dev/null 2>&1 || { dc logs pg | tail -20; exit 1; }
  q postgres "SELECT version();"
  q postgres "SELECT name, setting, unit FROM pg_settings WHERE name IN ('wal_level', 'max_replication_slots', 'max_wal_senders', 'wal_sender_timeout') ORDER BY name;"
  q appdb "SELECT pubname, schemaname, tablename FROM pg_publication_tables;"
  ;;
missing)
  drop_all
  slots
  say "SQL functions on a slot that does not exist"
  q appdb "SELECT pg_drop_replication_slot('cdc_slot');"
  q appdb "SELECT count(*) FROM pg_logical_slot_get_binary_changes('cdc_slot', NULL, NULL, 'proto_version', '1', 'publication_names', 'cdc_pub');"
  q appdb "SELECT * FROM pg_replication_slot_advance('cdc_slot', pg_current_wal_lsn());"
  say "A consumer that streams the slot, as a CDC tool does"
  stream appdb cdc_slot
  say "A physical slot, read by pg_receivewal as a standby would read it"
  echo '$ pg_receivewal -D /tmp/wal -S standby_slot --no-loop'
  inside bash -c 'mkdir -p /tmp/wal && timeout 20 pg_receivewal -U postgres -D /tmp/wal -S standby_slot --no-loop' || true
  serverlog pg 'ERROR:  '
  say "The slot exists, in another database. A logical slot belongs to the database it was created in."
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  slots
  q otherdb "SELECT count(*) FROM pg_logical_slot_get_binary_changes('cdc_slot', NULL, NULL, 'proto_version', '1', 'publication_names', 'cdc_pub');"
  stream otherdb cdc_slot
  serverlog pg 'ERROR:  '
  say "The fix: read the slot from the database it was created in"
  q appdb "INSERT INTO orders VALUES (11, 'read from appdb');"
  read_all cdc_slot
  drop_all
  q appdb "DELETE FROM orders WHERE id > 10;"
  ;;
recreate)
  drop_all
  say "A slot with the test_decoding plugin, so that the rows it sends can be read here. A consumer reads it and keeps the position it reached, as a CDC tool keeps its offset."
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'test_decoding');"
  q appdb "INSERT INTO orders VALUES (101, 'before the drop');"
  end="$(val appdb "SELECT pg_current_wal_lsn()")"
  echo "\$ pg_recvlogical -d appdb --slot cdc_slot --start --endpos $end -f -"
  inside timeout 30 pg_recvlogical -U postgres -d appdb --slot cdc_slot --start --endpos "$end" -f - || true
  saved="$(val appdb "SELECT confirmed_flush_lsn FROM pg_replication_slots WHERE slot_name = 'cdc_slot'")"
  echo "position the consumer keeps: $saved"
  say "The slot is dropped, and two rows are written while there is no slot."
  q appdb "SELECT pg_drop_replication_slot('cdc_slot');"
  q appdb "INSERT INTO orders VALUES (102, 'while there was no slot'), (103, 'while there was no slot');"
  say "The fix: create the slot again. It starts at the current position."
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'test_decoding');"
  q appdb "INSERT INTO orders VALUES (104, 'after the new slot');"
  slots
  say "The consumer comes back and asks for its saved position."
  end="$(val appdb "SELECT pg_current_wal_lsn()")"
  echo "\$ pg_recvlogical -d appdb --slot cdc_slot --start --startpos $saved --endpos $end -f -"
  inside timeout 30 pg_recvlogical -U postgres -d appdb --slot cdc_slot --start --startpos "$saved" --endpos "$end" -f - || true
  serverlog pg 'already been streamed|forwarding'
  if (( $(pgnum) < 150000 )); then
    say "Before PostgreSQL 15 the server writes this message at the DEBUG1 level only. The same request again, with log_min_messages = debug1:"
    q postgres "ALTER SYSTEM SET log_min_messages = debug1;"
    reload
    end="$(val appdb "SELECT pg_current_wal_lsn()")"
    echo "\$ pg_recvlogical -d appdb --slot cdc_slot --start --startpos $saved --endpos $end -f -"
    inside timeout 30 pg_recvlogical -U postgres -d appdb --slot cdc_slot --start --startpos "$saved" --endpos "$end" -f - || true
    serverlog pg 'forwarding'
    q postgres "ALTER SYSTEM RESET log_min_messages;"
    reload
  fi
  say "The table holds all four rows."
  q appdb "SELECT id, status FROM orders WHERE id > 100 ORDER BY id;"
  drop_all
  q appdb "DELETE FROM orders WHERE id > 100;"
  ;;
exists)
  drop_all
  say "A second slot with a name that is taken"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  say "The same name from another database, and for a physical slot"
  q otherdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  q postgres "SELECT * FROM pg_create_physical_replication_slot('cdc_slot');"
  say "Over the replication protocol, as a CDC tool creates its slot"
  echo '$ pg_recvlogical -d otherdb --slot cdc_slot --create-slot -P pgoutput'
  inside pg_recvlogical -U postgres -d otherdb --slot cdc_slot --create-slot -P pgoutput || true
  serverlog pg 'ERROR:  '
  say "Who holds the name"
  slots
  say "Fix 1: a script that may run twice keeps the slot that is there"
  echo '$ pg_recvlogical -d appdb --slot cdc_slot --create-slot -P pgoutput --if-not-exists; echo "exit status $?"'
  inside bash -c 'pg_recvlogical -U postgres -d appdb --slot cdc_slot --create-slot -P pgoutput --if-not-exists; echo "exit status $?"' || true
  say "Fix 2: a second consumer gets a name of its own"
  q otherdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot_otherdb', 'pgoutput');"
  slots
  drop_all
  ;;
active)
  drop_all
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  q postgres "SHOW wal_sender_timeout;"
  say "Consumer A streams the slot."
  consumer consumer_a cdc_slot
  wait_sql postgres "SELECT active FROM pg_replication_slots WHERE slot_name = 'cdc_slot'" 15
  say "Who holds the slot"
  q postgres "$HOLDER"
  say "SQL functions on the slot while A holds it"
  q appdb "SELECT count(*) FROM pg_logical_slot_peek_binary_changes('cdc_slot', NULL, NULL, 'proto_version', '1', 'publication_names', 'cdc_pub');"
  q appdb "SELECT * FROM pg_replication_slot_advance('cdc_slot', pg_current_wal_lsn());"
  q appdb "SELECT pg_drop_replication_slot('cdc_slot');"
  say "A second consumer, B, on the same slot, as a second connector with the same slot name would be"
  echo "\$ pg_recvlogical -d \"dbname=appdb application_name=consumer_b\" --slot cdc_slot --start $STREAM_OPTS -f /dev/null --no-loop"
  inside timeout 30 pg_recvlogical -U postgres -d "dbname=appdb application_name=consumer_b" --slot cdc_slot --start -o proto_version=1 -o publication_names=cdc_pub -f /dev/null --no-loop || true
  serverlog pg 'ERROR:  '
  say "A stops answering and keeps its connection open (SIGSTOP), as a hung client does. B starts again and retries every 5 seconds."
  consumer_signal STOP consumer_a
  t0="$(date +%s)"
  consumer consumer_b cdc_slot
  sleep 10
  q postgres "$HOLDER"
  for _ in $(seq 1 150); do holder_is consumer_b && break; sleep 1; done
  echo "B holds the slot $(( $(date +%s) - t0 )) s after A was frozen"
  q postgres "$HOLDER"
  serverlog pg 'replication timeout|is active for PID' bare
  consumer_log consumer_b counted
  say "A is resumed. The server has closed its connection, and now A gets the error."
  consumer_signal CONT consumer_a
  sleep 8
  consumer_log consumer_a
  consumer_signal TERM consumer_a
  say "The fix without waiting for the timeout: stop the old client, then end its session. Here B is frozen and C waits for the slot."
  consumer_signal STOP consumer_b
  consumer consumer_c cdc_slot
  sleep 3
  q postgres "$HOLDER"
  t0="$(date +%s)"
  q postgres "SELECT pg_terminate_backend(active_pid) FROM pg_replication_slots WHERE slot_name = 'cdc_slot';"
  for _ in $(seq 1 30); do holder_is consumer_c && break; sleep 1; done
  echo "C holds the slot $(( $(date +%s) - t0 )) s after the session of B was ended"
  q postgres "$HOLDER"
  consumer_log consumer_c
  say "With wal_sender_timeout = 0 the server keeps the session of a client that hangs. C is frozen, and D waits 90 seconds for the slot."
  q postgres "ALTER SYSTEM SET wal_sender_timeout = 0;"
  reload
  consumer_signal STOP consumer_c
  consumer consumer_d cdc_slot
  sleep 90
  q postgres "$HOLDER"
  serverlog pg 'replication timeout' bare
  consumer_log consumer_d counted
  q postgres "ALTER SYSTEM RESET wal_sender_timeout;"
  reload
  drop_all
  ;;
subscription)
  drop_all
  CONN="host=localhost dbname=appdb user=postgres"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  say "CREATE SUBSCRIPTION with a slot name that is taken on the publisher. The publisher is appdb on the same server."
  q subdb "CREATE SUBSCRIPTION sub_orders CONNECTION '$CONN' PUBLICATION cdc_pub WITH (slot_name = 'cdc_slot', copy_data = false);"
  say "The fix: use the slot that is there"
  q subdb "CREATE SUBSCRIPTION sub_orders CONNECTION '$CONN' PUBLICATION cdc_pub WITH (slot_name = 'cdc_slot', create_slot = false, copy_data = false);"
  wait_sql postgres "SELECT active FROM pg_replication_slots WHERE slot_name = 'cdc_slot'" 30
  q appdb "INSERT INTO orders VALUES (201, 'through the subscription');"
  wait_sql subdb "SELECT count(*) = 1 FROM orders WHERE id = 201" 30
  q subdb "SELECT id, status FROM orders WHERE id > 200;"
  q postgres "$HOLDER"
  say "A second subscription on the same slot, in another database"
  q otherdb "CREATE SUBSCRIPTION sub_copy CONNECTION '$CONN' PUBLICATION cdc_pub WITH (slot_name = 'cdc_slot', create_slot = false, copy_data = false);"
  sleep 12
  serverlog pg 'is active for PID|could not start WAL streaming|exited with exit code'
  say "It is detached from the slot before it is dropped"
  q otherdb "ALTER SUBSCRIPTION sub_copy DISABLE;"
  q otherdb "ALTER SUBSCRIPTION sub_copy SET (slot_name = NONE);"
  q otherdb "DROP SUBSCRIPTION sub_copy;"
  slots
  say "The slot is dropped on the publisher while the subscription is disabled. Then the subscription is enabled again."
  q subdb "ALTER SUBSCRIPTION sub_orders DISABLE;"
  wait_sql postgres "SELECT NOT active FROM pg_replication_slots WHERE slot_name = 'cdc_slot'" 30
  q appdb "SELECT pg_drop_replication_slot('cdc_slot');"
  q subdb "ALTER SUBSCRIPTION sub_orders ENABLE;"
  sleep 12
  serverlog pg 'does not exist|could not start WAL streaming|exited with exit code'
  say "DROP SUBSCRIPTION also drops the slot on the publisher, and that slot is gone"
  q subdb "DROP SUBSCRIPTION sub_orders;"
  say "The fix: detach the subscription from the slot, then drop it"
  q subdb "ALTER SUBSCRIPTION sub_orders DISABLE;"
  q subdb "ALTER SUBSCRIPTION sub_orders SET (slot_name = NONE);"
  q subdb "DROP SUBSCRIPTION sub_orders;"
  q subdb "SELECT count(*) AS subscriptions FROM pg_subscription;"
  drop_all
  for db in appdb subdb; do val "$db" "DELETE FROM orders WHERE id > 100" >/dev/null; done
  ;;
invalidated)
  drop_all
  say "A cap on the WAL that a slot may hold, and a slot that nobody reads"
  q postgres "ALTER SYSTEM SET max_slot_wal_keep_size = '32MB';"
  reload
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  say "80 MB of writes, then a checkpoint"
  q appdb "CALL write_wal(80);"
  q postgres "CHECKPOINT;"
  slots
  serverlog pg 'invalidating'
  say "What its readers get"
  q appdb "SELECT count(*) FROM pg_logical_slot_get_binary_changes('cdc_slot', NULL, NULL, 'proto_version', '1', 'publication_names', 'cdc_pub');"
  stream appdb cdc_slot
  q appdb "SELECT * FROM pg_replication_slot_advance('cdc_slot', pg_current_wal_lsn());"
  say "The fix: drop the slot and create it again. The new slot has none of the changes written before it."
  q appdb "SELECT pg_drop_replication_slot('cdc_slot');"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  q appdb "INSERT INTO orders VALUES (501, 'after the new slot');"
  read_all cdc_slot
  slots
  q postgres "ALTER SYSTEM RESET max_slot_wal_keep_size;"
  reload
  drop_all
  q appdb "DELETE FROM orders WHERE id > 100;"
  ;;
standby)
  drop_all
  say "A standby cloned from the primary and set to stream through the physical slot standby_slot, which the primary does not have"
  slots
  standby_create "wal_level = logical" "primary_slot_name = 'standby_slot'"
  sleep 6
  qs postgres "SELECT status, slot_name FROM pg_stat_wal_receiver;"
  serverlog standby 'replication slot|WAL streaming|started streaming'
  serverlog pg 'ERROR:  '
  say "The fix: create the physical slot on the primary"
  q postgres "SELECT * FROM pg_create_physical_replication_slot('standby_slot');"
  wait_sql postgres "SELECT active FROM pg_replication_slots WHERE slot_name = 'standby_slot'" 30
  serverlog standby 'replication slot|WAL streaming|started streaming'
  qs postgres "SELECT status, slot_name FROM pg_stat_wal_receiver;"
  slots
  standby_remove
  drop_all
  ;;
promote)
  drop_all
  say "A standby that streams through its physical slot"
  q postgres "SELECT * FROM pg_create_physical_replication_slot('standby_slot');"
  standby_create "wal_level = logical" "primary_slot_name = 'standby_slot'"
  wait_sql postgres "SELECT active FROM pg_replication_slots WHERE slot_name = 'standby_slot'" 30
  say "A CDC slot on the primary. Its consumer reads one change and confirms it."
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  q appdb "INSERT INTO orders VALUES (301, 'before the promotion');"
  read_all cdc_slot
  slots
  say "The standby has the row and no copy of the slot"
  standby_caught_up
  qs appdb "SELECT id, status FROM orders WHERE id > 300;"
  slots standby
  say "The standby is promoted, as in a failover"
  qs postgres "SELECT pg_promote();"
  qs postgres "SELECT pg_is_in_recovery();"
  say "The consumer connects to the new primary"
  SVC=standby stream appdb cdc_slot
  read_all cdc_slot standby
  serverlog standby 'ERROR:  '
  say "The fix: create the slot on the new primary. It starts at the current position."
  qs appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  slots standby
  standby_remove
  drop_all
  q appdb "DELETE FROM orders WHERE id > 100;"
  ;;
failover-slots)
  drop_all
  if (( $(pgnum) < 170000 )); then
    say "PostgreSQL $PG_VERSION: a slot with failover = true, and the standby setting that synchronizes slots"
    q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput', false, false, true);"
    q postgres "SHOW sync_replication_slots;"
    exit 0
  fi
  say "On the primary: the physical slot of the standby, a CDC slot created with failover = true, and one created without it"
  q postgres "SELECT * FROM pg_create_physical_replication_slot('standby_slot');"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput', false, false, true);"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('tool_slot', 'pgoutput');"
  say "A slot that exists already is switched over the replication protocol"
  echo "\$ psql \"dbname=appdb replication=database\" -c 'ALTER_REPLICATION_SLOT tool_slot (FAILOVER true)'"
  inside psql -X "dbname=appdb user=postgres replication=database" -c "ALTER_REPLICATION_SLOT tool_slot (FAILOVER true)" || true
  q postgres "ALTER SYSTEM SET synchronized_standby_slots = 'standby_slot';"
  reload
  slots
  say "A standby with the settings that slot synchronization needs"
  standby_create "wal_level = logical" "primary_slot_name = 'standby_slot'" "hot_standby_feedback = on" "sync_replication_slots = on" "primary_conninfo = 'host=pg user=postgres password=labpw dbname=appdb'"
  wait_sql postgres "SELECT active FROM pg_replication_slots WHERE slot_name = 'standby_slot'" 30
  say "The consumer reads one change on the primary and confirms it"
  q appdb "INSERT INTO orders VALUES (401, 'read before the promotion');"
  read_all cdc_slot
  say "Waiting for the standby to hold synchronized copies of the two slots"
  sync_wait 2
  slots standby
  serverlog standby 'slot'
  say "On the standby the copy can be neither read nor dropped"
  qs appdb "SELECT count(*) FROM pg_logical_slot_get_binary_changes('cdc_slot', NULL, NULL, 'proto_version', '1', 'publication_names', 'cdc_pub');"
  qs appdb "SELECT pg_drop_replication_slot('cdc_slot');"
  say "Two more changes on the primary, not read yet. Then the standby is promoted."
  q appdb "INSERT INTO orders VALUES (402, 'read after the promotion'), (403, 'read after the promotion');"
  standby_caught_up
  qs postgres "SELECT pg_promote();"
  slots standby
  say "The consumer reads the slot on the new primary. The new primary was cloned with the primary's synchronized_standby_slots, and has no slot of that name."
  qs postgres "SHOW synchronized_standby_slots;"
  sql="SELECT encode(data, 'hex') FROM pg_logical_slot_get_binary_changes('cdc_slot', NULL, NULL, 'proto_version', '1', 'publication_names', 'cdc_pub');"
  printf '%s    -- on the standby, stopped after 10 s\n' "$sql"
  out="$(SVC=standby inside timeout 10 psql -X -U postgres -d appdb -At -c "$sql" || true)"
  counted <<<"$out"
  grep -q -E '^[0-9a-f]+$' <<<"$out" || echo "(no change returned within 10 s)"
  say "The fix on the new primary: reset the setting, or name the slot of a standby that the new primary has"
  qs postgres "ALTER SYSTEM RESET synchronized_standby_slots;"
  qs postgres "SELECT pg_reload_conf();"
  read_all cdc_slot standby
  say "synchronized_standby_slots is reset on the old primary before the standby is removed"
  q postgres "ALTER SYSTEM RESET synchronized_standby_slots;"
  reload
  standby_remove
  drop_all
  q appdb "DELETE FROM orders WHERE id > 100;"
  ;;
all)
  log="logs/postgres-$PG_VERSION"
  mkdir -p "$log"
  rm -f "$log"/*.txt
  n=0
  for step in up missing recreate exists active subscription invalidated standby promote failover-slots; do
    n=$((n + 1))
    file="$log/$(printf '%02d' "$n")-$step.txt"
    echo "== $step -> $file"
    { echo "# ./run.sh $step    PostgreSQL $PG_VERSION    $(date -u +%Y-%m-%dT%H:%M:%SZ)"; "$0" "$step"; } > "$file" 2>&1 < /dev/null || echo "   (step exited with an error, see the file)"
  done
  "$0" down
  ;;
down)
  dc down -v --remove-orphans
  ;;
*)
  sed -n '2,20p' "$0"
  exit 1
  ;;
esac
