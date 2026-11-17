#!/usr/bin/env bash
# Lab: a replication slot that nobody reads keeps the write-ahead log (WAL) until the disk is full.
#
#   ./run.sh up             start PostgreSQL with wal_level=logical and max_wal_size=64MB
#   ./run.sh baseline       no slot: 96 MB of writes, pg_wal stays near max_wal_size
#   ./run.sh stall          break it: a logical slot nobody reads, 256 MB of writes, pg_wal keeps it all
#   ./run.sh diagnose       the queries that identify the slot
#   ./run.sh catch-up       fix: the consumer reads and confirms, checkpoints remove the WAL
#   ./run.sh stalled        a connected consumer that stops confirming: active = t, WAL still kept
#   ./run.sh neighbour      a slot in an idle database keeps the WAL of a busy one; a heartbeat row frees it
#   ./run.sh long-xact      a healthy consumer and one transaction left open: restart_lsn cannot move
#   ./run.sh drop-active    pg_drop_replication_slot on an active slot, then the order that works
#   ./run.sh cap            max_slot_wal_keep_size: the slot is invalidated; what each consumer then gets
#   ./run.sh idle-timeout   idle_replication_slot_timeout (PostgreSQL 18 and later)
#   ./run.sh disk-full      break it for real: a 256 MB disk, the PANIC and the failed restart
#   ./run.sh disk-recover   fix: free space outside pg_wal, start PostgreSQL, remove the cause
#   ./run.sh disk-capped    prevent: the same disk and the same writes with max_slot_wal_keep_size set
#   ./run.sh all            every step in order, each captured under logs/postgres-<version>/
#   ./run.sh down           remove everything
#
# Another version:  PG_VERSION=13.23 ./run.sh all
set -euo pipefail
cd "$(dirname "$0")"

export PG_VERSION="${PG_VERSION:-18.7}"
SVC="${SVC:-pg}"

dc() { docker compose --profile disk-full "$@"; }
# Run a command in the container with its two output streams merged there, so lines keep their order.
inside() { dc exec -T "$SVC" bash -c 'exec "$@" 2>&1' bash "$@"; }
# q DATABASE SQL: print the statement, then its result or its error. Never stops the script.
q() { printf '%s\n' "$2"; inside timeout 150 psql -X -U postgres -d "$1" -c "$2" || true; }
# val DATABASE SQL: one bare value, for the script itself.
val() { dc exec -T "$SVC" timeout 60 psql -X -U postgres -d "$1" -At -c "$2" 2>/dev/null || true; }
say() { printf '\n## %s\n' "$*"; }
pgnum() { val postgres "SHOW server_version_num"; }

# The diagnostic query, with the columns this server version has.
slots() {
  local n cols
  n="$(pgnum)"
  cols="slot_name, slot_type, database, active, active_pid, restart_lsn, confirmed_flush_lsn,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS retained_wal"
  if (( n >= 130000 )); then cols="$cols,
       wal_status, pg_size_pretty(safe_wal_size) AS safe_wal_size"; fi
  if (( n >= 170000 )); then cols="$cols, invalidation_reason"; fi
  q postgres "SELECT $cols
FROM pg_replication_slots ORDER BY slot_name;"
}
senders() {
  q postgres "SELECT s.slot_name, r.pid, r.application_name, r.state, r.sent_lsn, r.flush_lsn, r.reply_time
FROM pg_replication_slots s LEFT JOIN pg_stat_replication r ON r.pid = s.active_pid ORDER BY s.slot_name;"
}
walsize() { q postgres "SELECT count(*) AS wal_files, pg_size_pretty(sum(size)) AS pg_wal_size FROM pg_ls_waldir();"; }
checkpoint() { q postgres "CHECKPOINT;"; }
reload() { q postgres "SELECT pg_reload_conf();"; sleep 1; }

# Server log lines that match a pattern and were written since this step began (or since the
# previous call in the same step).
STEP_START="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
LOG_SEEN=0
serverlog() {
  local all
  all="$(dc logs --no-log-prefix --since "$STEP_START" "$SVC" 2>&1)"
  echo "--- server log"
  tail -n +"$((LOG_SEEN + 1))" <<<"$all" | grep -a -E "$1" || echo "(no matching line)"
  LOG_SEEN="$(wc -l <<<"$all" | tr -d ' ')"
  echo "---"
}
# wait_sql DATABASE SQL SECONDS: poll until the statement returns t.
wait_sql() {
  local i
  for i in $(seq 1 "$3"); do
    if [[ "$(val "$1" "$2")" == t ]]; then return 0; fi
    sleep 1
  done
  echo "(gave up after $3 s waiting for: $2)"
}

# settle SLOT: after a consumer has confirmed. Writes go on at about 1 MB per round and a checkpoint
# runs every 12 seconds, until pg_wal is back near max_wal_size (at most 8 rounds). One line per round.
settle() {
  local i size
  for i in 1 2 3 4 5 6 7 8; do
    val appdb "CALL write_wal(1)" >/dev/null
    val postgres "CHECKPOINT" >/dev/null
    echo "after checkpoint $i: $(val postgres "SELECT format('restart_lsn %s, retained by the slot %s, pg_wal %s in %s files', s.restart_lsn, pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), s.restart_lsn)), (SELECT pg_size_pretty(sum(size)) FROM pg_ls_waldir()), (SELECT count(*) FROM pg_ls_waldir())) FROM pg_replication_slots s WHERE s.slot_name = '$1'")"
    size="$(val postgres "SELECT (sum(size) / 1048576)::int FROM pg_ls_waldir()")"
    if (( ${size:-999} <= 96 )); then return 0; fi
    sleep 12
  done
}

# The consumer is pg_recvlogical, the client that ships with PostgreSQL. It reads the slot over the
# replication protocol, as a change data capture (CDC) tool does, and throws the changes away.
consumer_start() { # database, slot, publication, extra options
  echo "\$ pg_recvlogical -d $1 --slot $2 --start -o proto_version=1 -o publication_names=$3 -f /dev/null -v ${4:-} &"
  dc exec -T -d "$SVC" bash -c ": > /tmp/consumer.log; pg_recvlogical -U postgres -d $1 --slot $2 --start -o proto_version=1 -o publication_names=$3 -f /dev/null -v ${4:-} >> /tmp/consumer.log 2>&1"
  sleep 2
}
# signal NAME PROCESS: send a signal to every process with that name inside the container.
signal() {
  echo "\$ kill -$1 <pid of $2>"
  dc exec -T "$SVC" bash -c 'for p in /proc/[0-9]*; do if [ "$(cat "$p/comm" 2>/dev/null)" = "$1" ]; then kill "-$0" "${p#/proc/}"; fi; done' "$1" "$2" || true
}
consumer_log() {
  echo "--- consumer output"
  dc exec -T "$SVC" bash -c 'cat /tmp/consumer.log 2>/dev/null; : > /tmp/consumer.log' || true
  echo "---"
}
caught_up() { # slot, target LSN: true once the consumer has confirmed up to the target
  echo "SELECT confirmed_flush_lsn >= '$2' FROM pg_replication_slots WHERE slot_name = '$1'"
}
drop_all_slots() {
  signal CONT pg_recvlogical >/dev/null 2>&1 || true
  signal TERM pg_recvlogical >/dev/null 2>&1 || true
  sleep 1
  local s
  for s in $(val postgres "SELECT slot_name FROM pg_replication_slots"); do
    val postgres "SELECT pg_drop_replication_slot('$s')" >/dev/null
  done
}

PEEK_CDC="pg_logical_slot_peek_binary_changes('cdc_slot', NULL, NULL, 'proto_version', '1', 'publication_names', 'cdc_pub')"
GET_CDC="pg_logical_slot_get_binary_changes('cdc_slot', NULL, NULL, 'proto_version', '1', 'publication_names', 'cdc_pub')"
PEEK_QUIET="pg_logical_slot_peek_binary_changes('quiet_slot', NULL, NULL, 'proto_version', '1', 'publication_names', 'quiet_pub')"
STREAM_CDC="pg_recvlogical -d appdb --slot cdc_slot --start -o proto_version=1 -o publication_names=cdc_pub -f /dev/null --no-loop"
BUSY="SELECT pid, backend_type, wait_event_type, wait_event FROM pg_stat_activity WHERE backend_type IN ('checkpointer', 'walsender') ORDER BY backend_type;"

# A stand-in for a consumer that confirms only the changes it has read: read without confirming
# (peek), then confirm the position of the last change, if there was one.
poll_quiet() {
  local last newest="max(lsn)"
  # max() over pg_lsn exists from PostgreSQL 13
  if (( $(pgnum) < 130000 )); then newest="(array_agg(lsn ORDER BY lsn DESC))[1]"; fi
  q quietdb "SELECT count(*) AS changes_read, $newest AS last_change_lsn FROM $PEEK_QUIET;"
  last="$(val quietdb "SELECT $newest FROM $PEEK_QUIET")"
  if [[ -n "$last" ]]; then
    q quietdb "SELECT * FROM pg_replication_slot_advance('quiet_slot', '$last');"
  else
    echo "(no change was read, so there is no position to confirm)"
  fi
}

case "${1:-}" in
up)
  dc up -d --wait --quiet-pull pg >/dev/null 2>&1 || { dc logs pg | tail -20; exit 1; }
  q postgres "SELECT version();"
  q postgres "SELECT name, setting, unit, source FROM pg_settings
WHERE name IN ('wal_level', 'max_wal_size', 'min_wal_size', 'wal_segment_size', 'max_slot_wal_keep_size', 'wal_keep_size',
               'wal_keep_segments', 'max_replication_slots', 'max_wal_senders', 'wal_sender_timeout', 'checkpoint_timeout',
               'idle_replication_slot_timeout')
ORDER BY name;"
  echo "pg_replication_slots columns: $(val postgres "SELECT string_agg(attname, ', ' ORDER BY attnum) FROM pg_attribute WHERE attrelid = 'pg_replication_slots'::regclass AND attnum > 0")"
  walsize
  ;;
baseline)
  say "No replication slot. Write 96 MB and checkpoint: the WAL is recycled."
  slots
  q appdb "CALL write_wal(96);"
  checkpoint
  walsize
  ;;
stall)
  say "Create a logical slot. No consumer connects to it."
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  say "Write 256 MB and checkpoint: nothing is removed."
  q appdb "CALL write_wal(256);"
  checkpoint
  walsize
  q postgres "SHOW max_wal_size;"
  slots
  ;;
diagnose)
  say "Which slot holds the WAL, and is anything connected to it?"
  slots
  senders
  say "Size of pg_wal, from SQL and on disk"
  walsize
  echo '$ du -sh $PGDATA/pg_wal'
  dc exec -T "$SVC" bash -c 'du -sh "$PGDATA/pg_wal"'
  say "Settings that decide how much WAL is kept (an error means this version does not have the setting)"
  q postgres "SHOW max_wal_size;"
  q postgres "SHOW max_slot_wal_keep_size;"
  q postgres "SHOW wal_keep_size;"
  q postgres "SHOW wal_keep_segments;"
  q postgres "SHOW idle_replication_slot_timeout;"
  ;;
catch-up)
  say "Start the consumer. It reads the backlog and confirms what it has received."
  target="$(val postgres 'SELECT pg_current_wal_lsn()')"
  echo "current WAL position: $target"
  consumer_start appdb cdc_slot cdc_pub
  wait_sql postgres "$(caught_up cdc_slot "$target")" 60
  slots
  senders
  say "The backlog is confirmed. restart_lsn and pg_wal follow over the next checkpoints, while writes go on at 1 MB per round."
  settle cdc_slot
  slots
  walsize
  consumer_log
  ;;
stalled)
  if [[ -z "$(val postgres "SELECT 1 FROM pg_replication_slots WHERE slot_name = 'cdc_slot' AND active")" ]]; then
    consumer_start appdb cdc_slot cdc_pub
  fi
  say "Freeze the consumer process. It stays connected and stops answering."
  signal STOP pg_recvlogical
  q appdb "CALL write_wal(96);"
  checkpoint
  slots
  senders
  walsize
  say "With the default wal_sender_timeout the server gives up on the connection."
  q postgres "SHOW wal_sender_timeout;"
  wait_sql postgres "SELECT NOT active FROM pg_replication_slots WHERE slot_name = 'cdc_slot'" 90
  serverlog 'replication timeout'
  slots
  say "Resume the consumer. It reconnects, reads the backlog and confirms."
  target="$(val postgres 'SELECT pg_current_wal_lsn()')"
  signal CONT pg_recvlogical
  wait_sql postgres "$(caught_up cdc_slot "$target")" 60
  settle cdc_slot
  slots
  walsize
  consumer_log
  say "Stop the consumer."
  signal TERM pg_recvlogical
  ;;
neighbour)
  drop_all_slots
  say "Only quietdb has a slot. Only appdb is written to."
  q quietdb "SELECT * FROM pg_create_logical_replication_slot('quiet_slot', 'pgoutput');"
  q appdb "CALL write_wal(128);"
  checkpoint
  slots
  walsize
  say "A consumer that confirms only the changes it has read finds nothing to confirm."
  poll_quiet
  checkpoint
  slots
  walsize
  say "One row changes in quietdb (a heartbeat). Now there is a position to confirm."
  q quietdb "UPDATE heartbeat SET ts = now() WHERE id = 1;"
  poll_quiet
  slots
  checkpoint
  walsize
  say "A second heartbeat moves restart_lsn the rest of the way."
  q quietdb "UPDATE heartbeat SET ts = now() WHERE id = 1;"
  poll_quiet
  slots
  checkpoint
  walsize
  say "pg_recvlogical on the same slot, and no change in quietdb at all."
  consumer_start quietdb quiet_slot quiet_pub
  q appdb "CALL write_wal(96);"
  slots
  say "It confirms the position the server reports in its keepalive messages."
  sleep 12
  slots
  settle quiet_slot
  slots
  walsize
  consumer_log
  signal TERM pg_recvlogical
  sleep 1
  q quietdb "SELECT pg_drop_replication_slot('quiet_slot');"
  ;;
long-xact)
  drop_all_slots
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  consumer_start appdb cdc_slot cdc_pub
  say "A session opens a transaction, writes one row and then does nothing for 60 seconds."
  echo "\$ (echo \"BEGIN; INSERT INTO notes (body) VALUES ('left open');\"; sleep 60; echo 'COMMIT;') | psql -d appdb &"
  dc exec -T -d "$SVC" bash -c "(echo \"BEGIN; INSERT INTO notes (body) VALUES ('left open');\"; sleep 60; echo 'COMMIT;') | psql -X -U postgres -d appdb > /tmp/longxact.log 2>&1"
  sleep 2
  say "Other sessions write 96 MB. The consumer is healthy and reports every 10 seconds."
  q appdb "CALL write_wal(96);"
  sleep 12
  checkpoint
  slots
  senders
  walsize
  say "What holds restart_lsn: the oldest transaction that is still open"
  q postgres "SELECT pid, datname, state, now() - xact_start AS open_for, backend_xid, left(query, 50) AS last_statement
FROM pg_stat_activity WHERE backend_xid IS NOT NULL ORDER BY xact_start;"
  say "The transaction ends. restart_lsn moves at the consumer's next reports."
  wait_sql postgres "SELECT count(*) = 0 FROM pg_stat_activity WHERE state = 'idle in transaction'" 75
  sleep 12
  settle cdc_slot
  slots
  walsize
  consumer_log
  say "Stop the consumer."
  signal TERM pg_recvlogical
  ;;
drop-active)
  drop_all_slots
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  say "A consumer is connected to the slot."
  consumer_start appdb cdc_slot cdc_pub
  slots
  say "Drop the slot while it is in use"
  q appdb "SELECT pg_drop_replication_slot('cdc_slot');"
  say "Ending the session is not enough: this consumer reconnects after 5 seconds."
  q appdb "SELECT pg_terminate_backend(active_pid) FROM pg_replication_slots WHERE slot_name = 'cdc_slot';"
  sleep 8
  slots
  consumer_log
  say "End the session and drop the slot at once. pg_terminate_backend only sends the signal, so the drop is repeated if the process is still there."
  terminate="SELECT pg_terminate_backend(active_pid) FROM pg_replication_slots WHERE slot_name = 'cdc_slot' AND active;"
  drop="SELECT pg_drop_replication_slot('cdc_slot');"
  for attempt in 1 2 3 4 5 6; do
    out="$(inside psql -X -U postgres -d appdb -c "$terminate" -c "$drop" || true)"
    printf 'attempt %s:\n%s\n%s\n%s\n' "$attempt" "$terminate" "$drop" "$out"
    if ! grep -q 'ERROR' <<<"$out"; then break; fi
    sleep 0.3
  done
  slots
  say "What the consumer gets on its next attempts"
  sleep 7
  consumer_log
  if (( $(pgnum) >= 140000 )); then
    say "PostgreSQL 14 and later: pg_terminate_backend can wait for the process to exit (here up to 5000 ms)."
    q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
    wait_sql postgres "SELECT active FROM pg_replication_slots WHERE slot_name = 'cdc_slot'" 15
    slots
    terminate="SELECT pg_terminate_backend(active_pid, 5000) FROM pg_replication_slots WHERE slot_name = 'cdc_slot' AND active;"
    printf '%s\n%s\n' "$terminate" "$drop"
    inside psql -X -U postgres -d appdb -c "$terminate" -c "$drop" || true
    slots
  fi
  say "Stop the consumer."
  signal TERM pg_recvlogical
  ;;
cap)
  say "The cap exists from PostgreSQL 13."
  q postgres "SHOW max_slot_wal_keep_size;"
  if (( $(pgnum) < 130000 )); then
    echo "(PostgreSQL $PG_VERSION has no max_slot_wal_keep_size: a slot keeps WAL without a limit)"
    exit 0
  fi
  drop_all_slots
  say "Cap what a slot may keep at 64 MB. max_wal_size goes to 1 GB so that no automatic checkpoint runs between the next queries."
  q postgres "ALTER SYSTEM SET max_slot_wal_keep_size = '64MB';"
  q postgres "ALTER SYSTEM SET max_wal_size = '1GB';"
  reload
  q postgres "SELECT name, setting, unit, context FROM pg_settings WHERE name IN ('max_slot_wal_keep_size', 'max_wal_size');"
  say "Two slots with no consumer: a logical one (a CDC tool) and a physical one (a standby or pg_receivewal)."
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  q postgres "SELECT * FROM pg_create_physical_replication_slot('standby_slot', true);"
  echo '$ timeout 3 pg_receivewal -D /tmp/walarchive -S standby_slot --no-loop    (streams for 3 s, then is stopped)'
  dc exec -T "$SVC" bash -c 'rm -rf /tmp/walarchive; mkdir -p /tmp/walarchive; timeout 3 pg_receivewal -U postgres -D /tmp/walarchive -S standby_slot --no-loop 2>&1; ls /tmp/walarchive' || true
  slots
  say "32 MB written: inside the cap."
  q appdb "CALL write_wal(32);"
  slots
  say "48 MB more, 80 MB in total: past the cap, nothing removed yet."
  q appdb "CALL write_wal(48);"
  slots
  walsize
  say "The next checkpoint removes the WAL and invalidates both slots."
  checkpoint
  slots
  walsize
  serverlog 'LOG:  (invalidating|terminating process)|DETAIL:  The slot|HINT:  You might need|FATAL:  terminating connection'
  say "What each consumer gets now"
  q appdb "SELECT count(*) FROM $GET_CDC;"
  echo "\$ $STREAM_CDC"
  inside pg_recvlogical -U postgres -d appdb --slot cdc_slot --start -o proto_version=1 -o publication_names=cdc_pub -f /dev/null --no-loop || true
  echo '$ pg_receivewal -D /tmp/walarchive -S standby_slot --no-loop    (resumes at its partial segment)'
  inside timeout 10 pg_receivewal -U postgres -D /tmp/walarchive -S standby_slot --no-loop || true
  q appdb "SELECT pg_replication_slot_advance('cdc_slot', pg_current_wal_lsn());"
  say "Raising the cap afterwards does not bring a slot back."
  q postgres "ALTER SYSTEM SET max_slot_wal_keep_size = '1GB';"
  reload
  slots
  q appdb "SELECT count(*) FROM $GET_CDC;"
  say "Recovery: drop the invalidated slot and create a new one. What was written in between is not in it."
  q appdb "SELECT count(*) AS rows_in_orders FROM orders;"
  q appdb "SELECT pg_drop_replication_slot('cdc_slot');"
  q postgres "SELECT pg_drop_replication_slot('standby_slot');"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  q appdb "SELECT count(*) AS changes_in_new_slot FROM $PEEK_CDC;"

  say "The same cap while a consumer is connected. It reads the changes and has not confirmed any (status interval 0)."
  q postgres "ALTER SYSTEM SET max_slot_wal_keep_size = '64MB';"
  reload
  consumer_start appdb cdc_slot cdc_pub "-s 0"
  q appdb "CALL write_wal(80);"
  slots
  checkpoint
  slots
  serverlog 'LOG:  (invalidating|terminating process)|DETAIL:  The slot|HINT:  You might need|FATAL:  terminating connection'
  say "The consumer loses its connection and tries again after 5 seconds."
  sleep 7
  consumer_log
  signal TERM pg_recvlogical
  sleep 1
  q appdb "SELECT pg_drop_replication_slot('cdc_slot');"

  say "The same again with a consumer that is frozen: it is connected and does not read."
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  consumer_start appdb cdc_slot cdc_pub
  signal STOP pg_recvlogical
  q appdb "CALL write_wal(80);"
  slots
  echo '$ timeout 20 psql -c "CHECKPOINT;"'
  inside timeout 20 psql -X -U postgres -c "CHECKPOINT;" || echo "(no answer after 20 s)"
  q postgres "$BUSY"
  slots
  serverlog 'LOG:  (invalidating|terminating process)|DETAIL:  The slot|HINT:  You might need|FATAL:  terminating connection'
  say "Resume the consumer: it reads, the connection ends and the checkpoint finishes."
  signal CONT pg_recvlogical
  sleep 6
  q postgres "$BUSY"
  slots
  serverlog 'LOG:  (invalidating|terminating process)|DETAIL:  The slot|HINT:  You might need|FATAL:  terminating connection'
  consumer_log
  signal TERM pg_recvlogical
  sleep 1
  q appdb "SELECT pg_drop_replication_slot('cdc_slot');"
  q postgres "ALTER SYSTEM RESET max_slot_wal_keep_size;"
  q postgres "ALTER SYSTEM SET max_wal_size = '64MB';"
  reload
  ;;
idle-timeout)
  say "idle_replication_slot_timeout exists from PostgreSQL 18."
  q postgres "SHOW idle_replication_slot_timeout;"
  if (( $(pgnum) < 180000 )); then
    echo "(PostgreSQL $PG_VERSION has no idle_replication_slot_timeout)"
    exit 0
  fi
  drop_all_slots
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  q postgres "ALTER SYSTEM SET idle_replication_slot_timeout = '20s';"
  reload
  q postgres "SELECT now(), slot_name, active, inactive_since, wal_status, invalidation_reason FROM pg_replication_slots;"
  say "Nothing connects for 25 seconds. The next checkpoint invalidates the slot."
  sleep 25
  q postgres "SELECT now(), slot_name, active, inactive_since, wal_status, invalidation_reason FROM pg_replication_slots;"
  checkpoint
  q postgres "SELECT now(), slot_name, active, inactive_since, wal_status, invalidation_reason FROM pg_replication_slots;"
  serverlog 'LOG:  invalidating|DETAIL:  The slot|HINT:  You might need'
  q appdb "SELECT count(*) FROM $GET_CDC;"
  q appdb "SELECT pg_drop_replication_slot('cdc_slot');"
  q postgres "ALTER SYSTEM RESET idle_replication_slot_timeout;"
  reload
  ;;
disk-full)
  SVC=pgfull
  dc up -d --wait --quiet-pull pgfull >/dev/null 2>&1 || { dc logs pgfull | tail -20; exit 1; }
  STEP_START="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  q postgres "SELECT version();"
  say "A 256 MB disk. 48 MB of it holds a file that has nothing to do with PostgreSQL."
  echo '$ dd if=/dev/zero of=/disk/old-backup.tar bs=1M count=48; df -h /disk'
  dc exec -T pgfull bash -c 'dd if=/dev/zero of=/disk/old-backup.tar bs=1M count=48 status=none; df -h /disk'
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  say "Write 24 MB at a time until something gives."
  for round in $(seq 1 12); do
    out="$(inside psql -X -U postgres -d appdb -c "CALL write_wal(24);" || true)"
    echo "round $round: CALL write_wal(24); -> $(head -3 <<<"$out" | tr '\n' ' ')"
    dc exec -T pgfull bash -c 'echo "  disk used/free: $(df -h /disk | tail -1 | tr -s " " | cut -d" " -f3,4)   pg_wal: $(du -sh /disk/pgdata/pg_wal | cut -f1)"'
    if [[ "$out" != CALL* ]]; then break; fi
  done
  if dc exec -T pgfull pg_isready -h 127.0.0.1 -U postgres >/dev/null 2>&1; then
    say "A data file could not grow, the statement failed and the server is still up. Keep writing WAL with records that need no data page."
    for round in $(seq 1 40); do
      out="$(inside psql -X -U postgres -d appdb -At -c "SELECT pg_logical_emit_message(false, 'lab', repeat('x', 1048576));" || true)"
      if [[ "$out" != [0-9A-F]*/* ]]; then
        echo "1 MB record $round: SELECT pg_logical_emit_message(false, 'lab', repeat('x', 1048576)); -> $(head -3 <<<"$out" | tr '\n' ' ')"
        break
      fi
    done
    dc exec -T pgfull bash -c 'echo "  disk used/free: $(df -h /disk | tail -1 | tr -s " " | cut -d" " -f3,4)   pg_wal: $(du -sh /disk/pgdata/pg_wal | cut -f1)"'
  fi
  sleep 4
  serverlog 'PANIC|FATAL:  could not|ERROR:  could not|No space left|Check free disk space|terminated by signal|terminating any other|reinitializing|not properly shut down|redo (starts|done)|startup process|shutting down due|is shut down|postgres exited'
  say "PostgreSQL is down and the disk is still full."
  echo '$ pg_isready -h 127.0.0.1'
  inside pg_isready -h 127.0.0.1 -U postgres || true
  echo '$ df -h /disk; du -sh /disk/pgdata/pg_wal /disk/old-backup.tar'
  dc exec -T pgfull bash -c 'df -h /disk; du -sh /disk/pgdata/pg_wal /disk/old-backup.tar'
  ;;
disk-recover)
  SVC=pgfull
  say "Nothing in pg_wal is touched. Space is freed elsewhere on the disk, then PostgreSQL is started."
  echo '$ rm /disk/old-backup.tar; df -h /disk'
  dc exec -T pgfull bash -c 'rm /disk/old-backup.tar; df -h /disk; touch /tmp/start-postgres'
  for i in $(seq 1 60); do
    if dc exec -T pgfull pg_isready -h 127.0.0.1 -U postgres >/dev/null 2>&1; then break; fi
    sleep 1
  done
  echo '$ pg_isready -h 127.0.0.1'
  inside pg_isready -h 127.0.0.1 -U postgres || true
  serverlog 'database system|redo (starts|done)|checkpoint (starting|complete)'
  say "The slot is still there and still holds the WAL."
  slots
  walsize
  say "Remove the cause. Here the slot is dropped, so its consumer needs a new snapshot."
  q appdb "SELECT pg_drop_replication_slot('cdc_slot');"
  checkpoint
  walsize
  echo '$ df -h /disk'
  dc exec -T pgfull bash -c 'df -h /disk'
  q appdb "INSERT INTO orders (customer_id, status) VALUES (1, 'after recovery') RETURNING id, status;"
  ;;
disk-capped)
  SVC=pgfull
  say "The same disk and the same writes, with a cap on what a slot may hold."
  q postgres "SHOW max_slot_wal_keep_size;"
  if (( $(pgnum) < 130000 )); then
    echo "(PostgreSQL $PG_VERSION has no max_slot_wal_keep_size)"
    exit 0
  fi
  q postgres "ALTER SYSTEM SET max_slot_wal_keep_size = '64MB';"
  reload
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  echo '$ df -h /disk'
  dc exec -T pgfull bash -c 'df -h /disk'
  say "Eight rounds of 24 MB: more than the free space on the disk."
  for round in $(seq 1 8); do
    out="$(inside timeout 150 psql -X -U postgres -d appdb -c "CALL write_wal(24);" || true)"
    echo "round $round: CALL write_wal(24); -> $(head -3 <<<"$out" | tr '\n' ' ')"
    dc exec -T pgfull bash -c 'echo "  disk used/free: $(df -h /disk | tail -1 | tr -s " " | cut -d" " -f3,4)   pg_wal: $(du -sh /disk/pgdata/pg_wal | cut -f1)"'
    if [[ "$out" != CALL* ]]; then break; fi
  done
  slots
  serverlog 'LOG:  (invalidating|terminating process)|DETAIL:  The slot|HINT:  You might need|PANIC|No space left'
  echo '$ pg_isready -h 127.0.0.1'
  inside pg_isready -h 127.0.0.1 -U postgres || true
  q appdb "SELECT count(*) FROM $GET_CDC;"
  q appdb "SELECT pg_drop_replication_slot('cdc_slot');"
  ;;
all)
  log="logs/postgres-$PG_VERSION"
  mkdir -p "$log"
  rm -f "$log"/*.txt
  n=0
  for step in up baseline stall diagnose catch-up stalled neighbour long-xact drop-active cap idle-timeout disk-full disk-recover disk-capped; do
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
  sed -n '2,21p' "$0"
  exit 1
  ;;
esac
