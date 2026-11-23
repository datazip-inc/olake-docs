#!/usr/bin/env bash
# What a Debezium PostgreSQL connector does to its replication slot.
#
#   ./run.sh up             PostgreSQL, Kafka and Kafka Connect with the Debezium connector
#   ./run.sh no-consumer    the slot while the connector runs, is paused, stopped, deleted, and while
#                           the Connect worker is down; the catch-up after each
#   ./run.sh not-confirming a connected connector that stops confirming: the worker frozen, then Kafka
#                           unreachable, each with wal_sender_timeout at 60 s and at 0
#   ./run.sh idle-database  the connector captures a database nobody writes to while another one is
#                           busy; heartbeat settings and lsn.flush.mode
#   ./run.sh properties     the connector's own description of lsn.flush.mode and the heartbeat settings
#   ./run.sh left-behind    what is left on the server after a stop, a delete and a worker shutdown,
#                           a slot dropped by hand, and what slot.drop.on.stop=true changes
#   ./run.sh down           remove everything
#
# The steps are independent: each one starts from a server with no slot and no connector.
#
#   OFFSET_FLUSH_MS=10000 ./run.sh up     commit offsets every 10 s (the default is 60 s)
#   PG_VERSION=14.25 ./run.sh up          another PostgreSQL version (default 18.7)
#   DEBEZIUM_IMAGE=quay.io/debezium/connect:3.0.8.Final ./run.sh up
set -euo pipefail
cd "$(dirname "$0")"

export PG_VERSION="${PG_VERSION:-18.7}"
export DEBEZIUM_IMAGE="${DEBEZIUM_IMAGE:-quay.io/debezium/connect:3.7.1.Final}"
export CONNECT_PORT="${CONNECT_PORT:-18301}"
export OFFSET_FLUSH_MS="${OFFSET_FLUSH_MS:-60000}"
CONNECT="http://localhost:$CONNECT_PORT"

dc() { docker compose "$@"; }
# Run a command in the PostgreSQL container with its two output streams merged there.
inside() { dc exec -T pg bash -c 'exec "$@" 2>&1' bash "$@"; }
# q DATABASE SQL: print the statement, then its result or its error. Never stops the script.
q() { printf '%s\n' "$2"; inside timeout 300 psql -X -U postgres -d "$1" -c "$2" || true; }
# val DATABASE SQL: one bare value, for the script itself.
val() { dc exec -T pg timeout 300 psql -X -U postgres -d "$1" -At -c "$2" 2>/dev/null || true; }
say() { printf '\n## %s\n' "$*"; }
now() { date -u +%H:%M:%S; }

# The query from the page's short answer.
slots() {
  q postgres "SELECT slot_name, slot_type, database, active, active_pid, restart_lsn, confirmed_flush_lsn,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS retained_wal,
       wal_status, pg_size_pretty(safe_wal_size) AS safe_wal_size
FROM pg_replication_slots ORDER BY slot_name;"
}
senders() {
  q postgres "SELECT s.slot_name, r.pid, r.application_name, r.state, r.sent_lsn, r.flush_lsn, r.reply_time
FROM pg_replication_slots s LEFT JOIN pg_stat_replication r ON r.pid = s.active_pid ORDER BY s.slot_name;"
}
walsize() { q postgres "SELECT count(*) AS wal_files, pg_size_pretty(sum(size)) AS pg_wal_size FROM pg_ls_waldir();"; }
publications() { q "$1" "SELECT pubname, puballtables FROM pg_publication ORDER BY pubname;"; }
# line SLOT: the slot, its WAL sender and pg_wal on one line, for timelines.
line() {
  local out
  out="$(val postgres "SELECT format('active %s, confirmed_flush_lsn %s, restart_lsn %s, retained %s, sender %s, pg_wal %s',
    s.active, s.confirmed_flush_lsn, s.restart_lsn,
    pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), s.restart_lsn)),
    coalesce((SELECT format('%s (flush_lsn %s, reply %s)', r.state, r.flush_lsn, to_char(r.reply_time AT TIME ZONE 'UTC', 'HH24:MI:SS'))
              FROM pg_stat_replication r WHERE r.pid = s.active_pid), 'none'),
    (SELECT pg_size_pretty(sum(size)) FROM pg_ls_waldir()))
  FROM pg_replication_slots s WHERE s.slot_name = '$1'")"
  echo "$(now)  ${out:-no slot named $1}"
}
write() { # megabytes, and "false" to write no row for the captured table
  echo "\$ CALL write_wal($1${2:+, $2});   -- in appdb"
  val appdb "CALL write_wal($1${2:+, $2})" > /dev/null
}

# Server log lines written since this step began (or since the previous call) that match a pattern.
STEP_START="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
LOG_SEEN=0
serverlog() {
  local all
  all="$(dc logs --no-log-prefix --since "$STEP_START" pg 2>&1)"
  echo "--- PostgreSQL log"
  tail -n +"$((LOG_SEEN + 1))" <<<"$all" | grep -a -E "$1" || echo "(no matching line)"
  LOG_SEEN="$(wc -l <<<"$all" | tr -d ' ')"
  echo "---"
}
# Kafka Connect log lines written since the last mark that match a pattern, without stack frames.
MARK=0
connect_all() { dc logs --no-color --no-log-prefix connect 2>/dev/null; }
mark() { MARK="$(connect_all | wc -l | tr -d ' ')"; }
connectlog() { # pattern, most lines to print
  echo "--- Kafka Connect log"
  connect_all | tail -n +"$((MARK + 1))" | grep -a -E "$1" | grep -v -E '^\s+at |^\s+\.\.\. ' | cut -c1-420 | head -n "${2:-12}" || true
  echo "---"
}

# Kafka Connect REST helpers.
rest() { curl -s -o /dev/null -w "\$ $1 $2  ->  HTTP %{http_code}\n" -X "$1" "$CONNECT$2"; }
put() { # connector name, configuration as JSON
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
wait_for() { # connector name, pattern, seconds
  local s=""
  for _ in $(seq 1 "$3"); do
    s="$(state "$1")"
    if [[ "$s" =~ $2 ]]; then echo "$(now)  $1: $s"; return 0; fi
    sleep 1
  done
  echo "$(now)  $1: $s (gave up waiting for /$2/)"
}
trace() { # connector name: the exception lines of a failed task, without stack frames
  curl -s -m 5 "$CONNECT/connectors/$1/status" |
    python3 -c 'import sys,json
for t in json.load(sys.stdin).get("tasks",[]):
    for l in t.get("trace","").splitlines():
        if not l.startswith("\tat ") and not l.startswith("\t..."): print("  "+l[:400])' 2>/dev/null || true
}
failure() { # the exception of a task that failed since the last mark, shortened in the middle
  connect_all | tail -n +"$((MARK + 1))" | { grep -a -E '^io\.debezium\.DebeziumException: ' || true; } | tail -1 |
    python3 -c 'import sys
l = sys.stdin.read().strip()
if l: print("  " + (l if len(l) < 420 else l[:150] + " [...] " + l[-150:]))'
}
kafka() { dc exec -T -e KAFKA_HEAP_OPTS=-Xmx128m kafka /opt/kafka/bin/"$@" 2>/dev/null; }
events() { # topic: the number of events in it
  local n
  n="$(kafka kafka-get-offsets.sh --bootstrap-server kafka:9092 --topic "$1" | awk -F: '{s+=$3; f=1} END {if (f) print s+0}' || true)"
  if [[ -n "$n" ]]; then echo "$(now)  topic $1 holds $n events"; else echo "$(now)  topic $1 does not exist"; fi
}
offsets() { printf '%s  GET /connectors/%s/offsets: ' "$(now)" "$1"; curl -s -m 5 "$CONNECT/connectors/$1/offsets" | cut -c1-400; echo; }

# cfg BASE [key=value ...]: a connector configuration as JSON. BASE is "app" or "quiet".
cfg() {
  python3 - "$@" <<'PY'
import json, sys
c = {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "tasks.max": "1",
    "database.hostname": "pg",
    "database.port": "5432",
    "database.user": "postgres",
    "database.password": "labpw",
    "plugin.name": "pgoutput",
    "publication.autocreate.mode": "disabled",
}
if sys.argv[1] == "app":
    c.update({"database.dbname": "appdb", "topic.prefix": "app", "slot.name": "dbz_app",
              "publication.name": "cdc_pub", "table.include.list": "public.notes"})
else:
    c.update({"database.dbname": "quietdb", "topic.prefix": "quiet", "slot.name": "dbz_quiet",
              "publication.name": "quiet_pub", "table.include.list": "public.customers"})
for pair in sys.argv[2:]:
    key, value = pair.split("=", 1)
    c[key] = value
print(json.dumps(c))
PY
}
show_cfg() { # the settings of a configuration that differ from the plain connection settings
  python3 -c 'import sys,json
c = json.loads(sys.argv[1])
skip = ("connector.class","tasks.max","database.hostname","database.port","database.user","database.password")
print("  " + ", ".join("%s=%s" % (k, v) for k, v in c.items() if k not in skip))' "$1"
}

# watch SLOT SECONDS EVERY: one line per interval.
watch() {
  local end=$(( $(date +%s) + $2 ))
  while (( $(date +%s) < end )); do line "$1"; sleep "$3"; done
  line "$1"
}
# confirmed SLOT TARGET_LSN SECONDS: one line every 5 s until the slot has confirmed up to 4 MB short
# of the target, which is the server position taken after the last write.
confirmed() {
  local i
  for i in $(seq 1 $(( $3 / 5 ))); do
    line "$1"
    if [[ "$(val postgres "SELECT pg_wal_lsn_diff('$2', confirmed_flush_lsn) < 4 * 1024 * 1024 FROM pg_replication_slots WHERE slot_name = '$1'")" == t ]]; then
      echo "$(now)  the slot has confirmed the backlog"
      return 0
    fi
    sleep 5
  done
  echo "$(now)  (gave up after $3 s: the slot has not confirmed the backlog)"
}
# settle SLOT: writes go on at about 1.6 MB per round and a checkpoint runs every 12 seconds, until
# pg_wal is back under 100 MB (at most 14 rounds). One line per round.
settle() {
  local i size
  for i in $(seq 1 14); do
    val appdb "CALL write_wal(1)" > /dev/null
    val postgres "CHECKPOINT" > /dev/null
    echo "$(now)  after checkpoint $i: $(val postgres "SELECT format('confirmed_flush_lsn %s, restart_lsn %s, retained by the slot %s, pg_wal %s in %s files', s.confirmed_flush_lsn, s.restart_lsn, pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), s.restart_lsn)), (SELECT pg_size_pretty(sum(size)) FROM pg_ls_waldir()), (SELECT count(*) FROM pg_ls_waldir())) FROM pg_replication_slots s WHERE s.slot_name = '$1'")"
    size="$(val postgres "SELECT (sum(size) / 1048576)::int FROM pg_ls_waldir()")"
    if (( ${size:-999} < 100 )); then return 0; fi
    sleep 12
  done
}
# clean: no connector, no stored offsets, no slot, no topic, pg_wal back near max_wal_size.
# Deleting a connector keeps its offsets in Kafka Connect, so they are reset first, which Kafka
# Connect allows only while the connector is STOPPED.
clean() {
  local c s t
  for c in $(curl -s -m 5 "$CONNECT/connectors" | python3 -c 'import sys,json; print(" ".join(json.load(sys.stdin)))' 2>/dev/null); do
    curl -s -o /dev/null -X PUT "$CONNECT/connectors/$c/stop"
    for _ in $(seq 1 30); do
      [[ "$(state "$c")" == "connector=STOPPED tasks=[]" ]] && break
      sleep 1
    done
    curl -s -o /dev/null -X DELETE "$CONNECT/connectors/$c/offsets"
    curl -s -o /dev/null -X DELETE "$CONNECT/connectors/$c"
  done
  for _ in $(seq 1 30); do
    [[ "$(val postgres "SELECT count(*) FROM pg_replication_slots WHERE active")" == 0 ]] && break
    sleep 1
  done
  for s in $(val postgres "SELECT slot_name FROM pg_replication_slots"); do
    val postgres "SELECT pg_drop_replication_slot('$s')" > /dev/null
  done
  for t in app.public.notes quiet.public.customers __debezium-heartbeat.app __debezium-heartbeat.quiet; do
    kafka kafka-topics.sh --bootstrap-server kafka:9092 --delete --topic "$t" > /dev/null 2>&1 || true
  done
  val appdb "TRUNCATE notes" > /dev/null
  val postgres "CHECKPOINT" > /dev/null; val appdb "CALL write_wal(1, false)" > /dev/null; val postgres "CHECKPOINT" > /dev/null
}
pause_container() { echo "\$ docker pause <$1 container>"; docker pause "$(dc ps -q "$1")" > /dev/null; }
unpause_container() { echo "\$ docker unpause <$1 container>"; docker unpause "$(dc ps -q "$1")" > /dev/null; }
wait_connect() {
  for _ in $(seq 1 120); do
    if curl -s -m 3 -o /dev/null "$CONNECT/connectors"; then return 0; fi
    sleep 1
  done
  echo "(Kafka Connect did not answer)"
}

# idle LABEL [key=value ...]: a connector on quietdb with these settings, then 128 MB written to appdb.
idle() {
  local label="$1" i; shift
  clean
  say "$label"
  CFG="$(cfg quiet "$@")"; show_cfg "$CFG"
  mark
  put quiet "$CFG"
  wait_for quiet 'connector=RUNNING tasks=\[RUNNING\]' 90
  sleep 5
  line dbz_quiet
  write 128 false
  val postgres "CHECKPOINT" > /dev/null
  echo "60 s with no change in quietdb, one line every 20 s:"
  watch dbz_quiet 60 20
  echo "three more checkpoints, 12 s apart, each after 1.6 MB written to appdb:"
  for i in 1 2 3; do
    val appdb "CALL write_wal(1, false)" > /dev/null; val postgres "CHECKPOINT" > /dev/null
    line dbz_quiet
    sleep 12
  done
  slots
  walsize
  q quietdb "SELECT id, to_char(ts AT TIME ZONE 'UTC', 'HH24:MI:SS') AS heartbeat_written_utc, to_char(now() AT TIME ZONE 'UTC', 'HH24:MI:SS') AS now_utc FROM heartbeat;"
  events quiet.public.customers
  events __debezium-heartbeat.quiet
  offsets quiet
  connectlog '(lsn\.flush|flush mode|LSN flush|[Hh]eartbeat (action|query)|heartbeat\.action)' 6
}
# What this connector version says about a few properties (the validation endpoint of Kafka Connect).
# Call it when no connector holds the slot, or the slot name is reported as an error.
known() {
  echo "\$ PUT /connector-plugins/PostgresConnector/config/validate   (the quiet configuration with lsn.flush.mode=connector_and_driver)"
  curl -s -X PUT -H 'Content-Type: application/json' --data "$(cfg quiet lsn.flush.mode=connector_and_driver name=check)" "$CONNECT/connector-plugins/PostgresConnector/config/validate" |
    python3 -c 'import sys,json
d = json.load(sys.stdin)
configs = d.get("configs", [])
print("  error_count=%s, properties defined by the connector: %d" % (d.get("error_count"), len(configs)))
for c in configs:
    if c["value"].get("errors"): print("  error on %s: %s" % (c["value"]["name"], c["value"]["errors"]))
for n in ("lsn.flush.mode", "flush.lsn.source", "heartbeat.interval.ms", "heartbeat.action.query", "slot.drop.on.stop"):
    hit = [c for c in configs if c["value"]["name"] == n]
    if not hit:
        print("  %s: not a property of this connector version" % n); continue
    df, v = hit[0].get("definition", {}), hit[0]["value"]
    print("  %s: default=%s, value=%s, errors=%s" % (n, df.get("default_value"), v.get("value"), v.get("errors")))
    print("      documentation: %s" % " ".join((df.get("documentation") or "").split())[:700])'
}

case "${1:-}" in
up)
  dc up -d --wait
  wait_connect
  say "versions"
  q postgres "SELECT version();"
  echo "\$ GET /"
  curl -s "$CONNECT/"; echo
  echo "\$ GET /connector-plugins (PostgreSQL)"
  curl -s "$CONNECT/connector-plugins" | python3 -c 'import sys,json
for p in json.load(sys.stdin):
    if "postgresql" in p["class"]: print("  %s %s" % (p["class"], p["version"]))'
  dc exec -T kafka bash -c 'ls /opt/kafka/libs | grep -E "^kafka-server-[0-9]" | head -1' | sed 's/^/  broker: /'
  say "settings"
  q postgres "SELECT name, setting, unit FROM pg_settings WHERE name IN ('wal_level', 'max_wal_size', 'min_wal_size', 'wal_sender_timeout', 'max_slot_wal_keep_size', 'checkpoint_timeout') ORDER BY name;"
  echo "Kafka Connect worker:"
  connect_all | grep -a -E '^\s*offset\.flush\.(interval|timeout)\.ms = ' | sort -u | sed -E 's/^[[:space:]]*/  /'
  ;;

no-consumer)
  clean
  say "the connector is registered and streams from appdb"
  CFG="$(cfg app)"; show_cfg "$CFG"
  put app "$CFG"
  wait_for app 'connector=RUNNING tasks=\[RUNNING\]' 90
  sleep 5
  slots

  say "state 1: the connector is RUNNING while 128 MB are written"
  write 128
  TARGET="$(val postgres "SELECT pg_current_wal_lsn()")"
  echo "server position after the writes: $TARGET"
  events app.public.notes
  line dbz_app
  senders
  echo "one line every 5 s until the connector has confirmed:"
  confirmed dbz_app "$TARGET" 150
  settle dbz_app
  slots

  say "state 2: PAUSED (PUT /connectors/app/pause), then 128 MB are written"
  rest PUT /connectors/app/pause
  wait_for app 'connector=PAUSED tasks=\[PAUSED\]' 30
  write 128
  TARGET="$(val postgres "SELECT pg_current_wal_lsn()")"
  val postgres "CHECKPOINT" > /dev/null
  slots
  senders
  echo "90 more seconds in this state, one line every 30 s:"
  watch dbz_app 90 30
  walsize
  events app.public.notes
  echo "resume:"
  rest PUT /connectors/app/resume
  wait_for app 'connector=RUNNING tasks=\[RUNNING\]' 30
  confirmed dbz_app "$TARGET" 150
  settle dbz_app
  events app.public.notes

  say "state 3: STOPPED (PUT /connectors/app/stop), then 128 MB are written"
  rest PUT /connectors/app/stop
  wait_for app 'connector=STOPPED' 30
  sleep 3
  write 128
  TARGET="$(val postgres "SELECT pg_current_wal_lsn()")"
  val postgres "CHECKPOINT" > /dev/null
  slots
  senders
  walsize
  echo "resume:"
  rest PUT /connectors/app/resume
  wait_for app 'connector=RUNNING tasks=\[RUNNING\]' 30
  confirmed dbz_app "$TARGET" 150
  settle dbz_app
  events app.public.notes

  say "state 4: deleted (DELETE /connectors/app), then 128 MB are written"
  rest DELETE /connectors/app
  sleep 5
  show_state app
  write 128
  TARGET="$(val postgres "SELECT pg_current_wal_lsn()")"
  val postgres "CHECKPOINT" > /dev/null
  slots
  senders
  walsize
  echo "the same connector is created again:"
  put app "$CFG"
  wait_for app 'connector=RUNNING tasks=\[RUNNING\]' 60
  confirmed dbz_app "$TARGET" 150
  settle dbz_app
  events app.public.notes

  say "state 5: the Kafka Connect worker is shut down (docker compose stop connect), then 128 MB are written"
  dc stop connect 2>&1 | grep -v -E '^\s*$' || true
  write 128
  TARGET="$(val postgres "SELECT pg_current_wal_lsn()")"
  val postgres "CHECKPOINT" > /dev/null
  slots
  senders
  walsize
  echo "the worker is started again:"
  dc start connect 2>&1 | grep -v -E '^\s*$' || true
  wait_connect
  wait_for app 'connector=RUNNING tasks=\[RUNNING\]' 120
  confirmed dbz_app "$TARGET" 150
  settle dbz_app
  events app.public.notes
  q appdb "SELECT count(*) AS rows_in_notes FROM notes;"
  ;;

not-confirming)
  WALSENDERS="SELECT pid, application_name, state, wait_event_type, wait_event FROM pg_stat_activity WHERE backend_type = 'walsender';"
  for TIMEOUT in 60s 0; do
    for MODE in worker-frozen kafka-unreachable; do
      clean
      say "wal_sender_timeout = $TIMEOUT, $MODE"
      q postgres "ALTER SYSTEM SET wal_sender_timeout = '$TIMEOUT';"
      val postgres "SELECT pg_reload_conf()" > /dev/null; sleep 1
      q postgres "SHOW wal_sender_timeout;"
      put app "$(cfg app)"
      wait_for app 'connector=RUNNING tasks=\[RUNNING\]' 90
      write 16
      TARGET="$(val postgres "SELECT pg_current_wal_lsn()")"
      confirmed dbz_app "$TARGET" $(( OFFSET_FLUSH_MS / 1000 + 30 ))
      STEP_START="$(date -u +%Y-%m-%dT%H:%M:%SZ)"; LOG_SEEN=0; mark
      if [[ "$MODE" == worker-frozen ]]; then pause_container connect; else pause_container kafka; fi
      T0="$(date +%s)"
      echo "16 MB are written every 20 s for 3 minutes. One line after each write:"
      for _ in $(seq 1 9); do
        val appdb "CALL write_wal(16)" > /dev/null
        printf '+%3ds  ' "$(( $(date +%s) - T0 ))"; line dbz_app
        sleep 17
      done
      slots
      senders
      q postgres "$WALSENDERS"
      walsize
      if [[ "$MODE" == kafka-unreachable ]]; then show_state app; fi
      serverlog 'walsender|replication timeout|terminating|unexpected EOF|could not (send|receive)|released logical'
      TARGET="$(val postgres "SELECT pg_current_wal_lsn()")"
      if [[ "$MODE" == worker-frozen ]]; then unpause_container connect; else unpause_container kafka; fi
      echo "after the unfreeze, one line every 5 s until the connector has confirmed:"
      confirmed dbz_app "$TARGET" 150
      show_state app
      trace app
      connectlog ' (ERROR|WARN) .*(postgres|Postgres|PSQL|replication|slot|flush|offset|Retry|retry|restart|coordinator|Rebalanc|producer|disconnect)' 14
      serverlog 'walsender|replication timeout|terminating|unexpected EOF|could not (send|receive)|released logical'
      settle dbz_app
      events app.public.notes
      q appdb "SELECT count(*) AS rows_in_notes FROM notes;"
    done
  done
  q postgres "ALTER SYSTEM RESET wal_sender_timeout;"
  val postgres "SELECT pg_reload_conf()" > /dev/null
  clean
  ;;

idle-database)
  idle "defaults: no heartbeat"
  idle "heartbeat.interval.ms alone" heartbeat.interval.ms=5000
  idle "heartbeat.interval.ms and heartbeat.action.query, the heartbeat table in the publication" \
    heartbeat.interval.ms=5000 "heartbeat.action.query=UPDATE public.heartbeat SET ts = now() WHERE id = 1" publication.name=quiet_hb_pub
  idle "heartbeat.interval.ms and heartbeat.action.query, the heartbeat table not in the publication" \
    heartbeat.interval.ms=5000 "heartbeat.action.query=UPDATE public.heartbeat SET ts = now() WHERE id = 1" publication.name=quiet_pub
  idle "lsn.flush.mode=connector_and_driver, no heartbeat" lsn.flush.mode=connector_and_driver
  clean
  say "what this Debezium version says about the properties"
  known
  ;;

idle-flush-mode) # the lsn.flush.mode run alone, for another Debezium version
  idle "lsn.flush.mode=connector_and_driver, no heartbeat" lsn.flush.mode=connector_and_driver
  clean
  say "what this Debezium version says about the properties"
  known
  ;;

idle-heartbeat-outside) # the heartbeat table outside the publication alone, for another PostgreSQL version
  idle "defaults: no heartbeat"
  idle "heartbeat.interval.ms and heartbeat.action.query, the heartbeat table not in the publication" \
    heartbeat.interval.ms=5000 "heartbeat.action.query=UPDATE public.heartbeat SET ts = now() WHERE id = 1" publication.name=quiet_pub
  clean
  ;;

properties) # what the connector itself says about the properties used in these runs
  clean
  say "what this Debezium version says about the properties"
  known
  ;;

left-behind)
  clean
  LEFT="SELECT slot_name, plugin, database, active FROM pg_replication_slots ORDER BY slot_name;"
  say "default settings, with a publication that Debezium creates itself"
  CFG="$(cfg app slot.name=dbz_owned publication.name=dbz_owned_pub publication.autocreate.mode=filtered)"; show_cfg "$CFG"
  put owned "$CFG"
  wait_for owned 'connector=RUNNING tasks=\[RUNNING\]' 90
  sleep 5
  q postgres "$LEFT"; publications appdb
  echo; echo "after PUT /connectors/owned/stop:"
  rest PUT /connectors/owned/stop; wait_for owned 'connector=STOPPED tasks=\[\]' 30; sleep 3
  q postgres "$LEFT"; publications appdb
  echo; echo "after DELETE /connectors/owned:"
  rest DELETE /connectors/owned; sleep 8; show_state owned
  q postgres "$LEFT"; publications appdb
  echo; echo "created again, then the worker is shut down (docker compose stop connect):"
  put owned "$CFG"; wait_for owned 'connector=RUNNING tasks=\[RUNNING\]' 90; sleep 5
  dc stop connect 2>&1 | grep -v -E '^\s*$' || true
  q postgres "$LEFT"; publications appdb
  dc start connect 2>&1 | grep -v -E '^\s*$' || true
  wait_connect; wait_for owned 'connector=RUNNING tasks=\[RUNNING\]' 120
  echo; echo "retiring the connector for good: stop it, reset its offsets, delete it, then drop what it left on the server:"
  rest PUT /connectors/owned/stop; wait_for owned 'connector=STOPPED tasks=\[\]' 30
  rest DELETE /connectors/owned/offsets
  rest DELETE /connectors/owned
  sleep 3
  q postgres "SELECT pg_drop_replication_slot('dbz_owned');"
  q appdb "DROP PUBLICATION dbz_owned_pub;"
  q postgres "$LEFT"; publications appdb

  clean
  say "the slot is dropped by hand while the connector is stopped, then the connector is resumed"
  mark
  put app "$(cfg app)"
  wait_for app 'connector=RUNNING tasks=\[RUNNING\]' 90
  write 8
  TARGET="$(val postgres "SELECT pg_current_wal_lsn()")"
  confirmed dbz_app "$TARGET" $(( OFFSET_FLUSH_MS / 1000 + 30 ))
  rest PUT /connectors/app/stop; wait_for app 'connector=STOPPED tasks=\[\]' 30; sleep 2
  q postgres "SELECT pg_drop_replication_slot('dbz_app');"
  q appdb "INSERT INTO notes (body) VALUES ('written while the slot was gone');"
  mark
  rest PUT /connectors/app/resume
  wait_for app 'tasks=\[(RUNNING|FAILED)\]' 60
  sleep 10
  show_state app
  failure
  connectlog '(Last recorded offset|offset mismatch|Slot recreation|Creating replication slot|no longer available on the server\.)' 6
  q postgres "$LEFT"

  for ACTION in pause stop delete restart worker-shutdown worker-killed; do
    clean
    say "slot.drop.on.stop=true, then: $ACTION"
    put app "$(cfg app slot.drop.on.stop=true)"
    wait_for app 'connector=RUNNING tasks=\[RUNNING\]' 90
    write 8
    TARGET="$(val postgres "SELECT pg_current_wal_lsn()")"
    confirmed dbz_app "$TARGET" $(( OFFSET_FLUSH_MS / 1000 + 30 ))
    events app.public.notes
    mark
    case "$ACTION" in
      pause) rest PUT /connectors/app/pause; wait_for app 'connector=PAUSED tasks=\[PAUSED\]' 30 ;;
      stop) rest PUT /connectors/app/stop; wait_for app 'connector=STOPPED tasks=\[\]' 30 ;;
      delete) rest DELETE /connectors/app ;;
      restart) rest POST "/connectors/app/restart?includeTasks=true" ;;
      worker-shutdown) dc stop connect 2>&1 | grep -v -E '^\s*$' || true ;;
      worker-killed) echo "\$ docker kill <connect container>"; docker kill "$(dc ps -q connect)" > /dev/null ;;
    esac
    sleep 8
    q postgres "$LEFT"
    echo "three rows are written to notes now:"
    q appdb "INSERT INTO notes (body) VALUES ('written after $ACTION 1'), ('written after $ACTION 2'), ('written after $ACTION 3');"
    case "$ACTION" in
      pause|stop) rest PUT /connectors/app/resume ;;
      delete) put app "$(cfg app slot.drop.on.stop=true)" ;;
      restart) : ;;
      worker-shutdown|worker-killed) dc start connect 2>&1 | grep -v -E '^\s*$' || true; wait_connect ;;
    esac
    wait_for app 'tasks=\[(RUNNING|FAILED)\]' 120
    sleep $(( OFFSET_FLUSH_MS / 1000 + 8 ))
    show_state app
    failure
    q postgres "$LEFT"
    events app.public.notes
    echo "rows in notes: $(val appdb "SELECT count(*) FROM notes")"
    connectlog '(slot.drop.on.stop|[Dd]ropp(ed|ing) (the )?(replication )?slot|Last recorded offset|Creating replication slot|Slot recreation)' 6
  done
  clean
  ;;

down)
  dc down -v
  ;;

*)
  sed -n '2,20p' "$0"
  ;;
esac
