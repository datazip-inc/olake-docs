#!/usr/bin/env bash
# Service test: the Airbyte PostgreSQL source connector and a replication slot.
#
# The connector image is run directly with the Airbyte protocol commands. This is not Airbyte Cloud
# and not the Airbyte platform: there is no scheduler and no destination. A "sync" here is one
# `read`, and the state it prints is handed to the next `read`, as the platform would do.
#
# Series 1, server pg, database appdb: what the slot looks like between two syncs, and what the
# connector does when its saved position can no longer be used.
#   ./run.sh up          two PostgreSQL 18.7 servers, wal_level=logical, max_wal_size=64MB
#   ./run.sh spec        the CDC options the connector has
#   ./run.sh strings     which of the log lines in question exist in the connector's jar files
#   ./run.sh check       the connection check
#   ./run.sh discover    the streams, and the catalog for the syncs
#   ./run.sh sync1       first sync: the 4 rows of orders
#   ./run.sh between     no sync runs: 3 changes to orders, then 128 MB written to an unpublished table
#   ./run.sh sync2       second sync, with the slot watched while it runs
#   ./run.sh sync3       third sync, nothing new to read
#   ./run.sh tail        one more change to orders, behind the 128 MB
#   ./run.sh sync4       fourth sync: reads that change
#   ./run.sh sync5       fifth sync: the slot moves when it starts
#   ./run.sh settle      checkpoints until pg_wal is back near max_wal_size
#   ./run.sh lost        max_slot_wal_keep_size invalidates the slot between two syncs
#   ./run.sh recreated   the slot is dropped and created again between two syncs
#   ./run.sh ahead       the slot is moved past the saved position between two syncs
#   ./run.sh series1     all of the above in order, each captured under logs/ (prep runs the first five)
#
# Series 2, server pgq, database quietdb: a slot in a database that is not written to.
#   ./run.sh quiet-sync 1            first sync: the 3 rows of customers
#   ./run.sh quiet-busy              appdb writes 128 MB, quietdb nothing
#   ./run.sh quiet-sync 2            a sync with nothing to read (and 3: another one)
#   ./run.sh quiet-heartbeat         a heartbeat table in the publication and the heartbeat query
#   ./run.sh quiet-sync 4 hb         syncs with the heartbeat query (and 5), then quiet-settle
#   ./run.sh quiet-nopub             the heartbeat table taken out of the publication
#   ./run.sh quiet-sync 6 hb         syncs with the query and the table not published (and 7)
#   ./run.sh quiet-republish         the table back in the publication, then quiet-sync 8 hb, 9 hb and quiet-settle
#   ./run.sh series2     all of series 2 in order, each captured under logs/ (after prep)
#
#   ./run.sh down        remove everything
set -euo pipefail
cd "$(dirname "$0")"

IMAGE="${IMAGE:-airbyte/source-postgres:3.8.12}"
NET=rbt-abt-pg_default
SVC="${SVC:-pg}"

dc() { docker compose "$@"; }
inside() { dc exec -T "$SVC" bash -c 'exec "$@" 2>&1' bash "$@"; }
# q DATABASE SQL: print the statement, then its result or its error. Never stops the script.
q() { printf '%s\n' "$2"; inside timeout 300 psql -X -U postgres -d "$1" -c "$2" || true; }
val() { dc exec -T "$SVC" timeout 60 psql -X -U postgres -d "$1" -At -c "$2" 2>/dev/null || true; }
say() { printf '\n## %s\n' "$*"; }
stamp() { date -u '+%Y-%m-%d %H:%M:%S UTC'; }

slots() {
  q postgres "SELECT slot_name, database, active, restart_lsn, confirmed_flush_lsn,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS retained_wal,
       wal_status, pg_size_pretty(safe_wal_size) AS safe_wal_size, invalidation_reason
FROM pg_replication_slots WHERE slot_name = '$1';"
}
walsize() { q postgres "SELECT pg_current_wal_lsn() AS current_lsn, count(*) AS wal_files, pg_size_pretty(sum(size)) AS pg_wal_size FROM pg_ls_waldir();"; }
checkpoint() { q postgres "CHECKPOINT;"; }

# settle SLOT: a little WAL and a checkpoint, a few times over, until pg_wal is back near max_wal_size.
settle() {
  local i files
  for i in 1 2 3 4 5 6; do
    val appdb "CALL write_wal(1);" > /dev/null
    val postgres "CHECKPOINT;" > /dev/null
    files="$(val postgres "SELECT count(*) FROM pg_ls_waldir()")"
    echo "after checkpoint $i: $(val postgres "SELECT 'slot holds ' || pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) FROM pg_replication_slots WHERE slot_name = '$1'"), pg_wal $(val postgres "SELECT pg_size_pretty(sum(size)) FROM pg_ls_waldir()") in $files files"
    [[ "$files" -le 5 ]] && break
    sleep 2
  done
}

STEP_START="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
serverlog() {
  echo "--- server log"
  dc logs --no-log-prefix --since "$STEP_START" "$SVC" 2>&1 | grep -a -E "$1" || echo "(no matching line)"
  echo "---"
}

# ab RAWNAME [ab.py options] -- connector arguments
ab() {
  local raw=$1; shift
  python3 ab.py --image "$IMAGE" --network "$NET" --work work --raw "logs/raw/$raw.jsonl.gz" "$@"
}
# watch_slot SLOT FILE: one line per change of the slot, until the file FILE.stop exists.
watch_slot() {
  local slot=$1 out=$2 prev="" cur
  rm -f "$out" "$out.stop"
  while [[ ! -e "$out.stop" ]]; do
    cur="$(val postgres "SELECT active, coalesce(active_pid::text,'-'), restart_lsn, confirmed_flush_lsn FROM pg_replication_slots WHERE slot_name = '$slot'")"
    if [[ "$cur" != "$prev" ]]; then printf '%s  active|pid|restart_lsn|confirmed_flush_lsn = %s\n' "$(date -u +%H:%M:%S)" "$cur" >> "$out"; prev="$cur"; fi
    sleep 0.3
  done
}
# sync RAWNAME CONFIG CATALOG STATE_IN STATE_OUT SLOT: one read, with the slot watched while it runs.
sync() {
  local raw=$1 config=$2 catalog=$3 in=$4 out=$5 slot=$6 args
  args=(read --config "/work/$config" --catalog "/work/$catalog")
  if [[ -n "$in" ]]; then args+=(--state "/work/$in"); echo "state handed to the connector: $(python3 ab.py --print-state "work/$in")"; else echo "no state is handed to the connector"; fi
  echo "started $(stamp)"
  watch_slot "$slot" "work/$raw.slot" &
  local watcher=$!
  ab "$raw" ${out:+--state-out "work/$out"} -- "${args[@]}" || true
  touch "work/$raw.slot.stop"; wait "$watcher" 2>/dev/null || true
  echo "ended $(stamp)"
  echo "--- the slot while the sync ran"
  cat "work/$raw.slot"
  rm -f "work/$raw.slot" "work/$raw.slot.stop"
  echo "---"
}
write_config() {   # write_config FILE HOST DATABASE SLOT PUBLICATION [HEARTBEAT QUERY]
  python3 - "$@" <<'EOF'
import json, sys
f, host, db, slot, pub = sys.argv[1:6]
rm = {"method": "CDC", "replication_slot": slot, "publication": pub, "initial_waiting_seconds": 120}
if len(sys.argv) > 6:
    rm["heartbeat_action_query"] = sys.argv[6]
json.dump({"host": host, "port": 5432, "database": db, "schemas": ["public"], "username": "airbyte",
           "password": "labpw", "ssl_mode": {"mode": "disable"}, "tunnel_method": {"tunnel_method": "NO_TUNNEL"},
           "replication_method": rm}, open(f, "w"), indent=2)
EOF
}

case "${1:-}" in
up)
  mkdir -p work logs/raw
  dc up -d --wait
  for s in pg pgq; do SVC=$s; say "server $s"; q postgres "SELECT version();"; q postgres "SHOW wal_level;"; q postgres "SHOW max_wal_size;"; q postgres "SHOW wal_sender_timeout;"; done
  say "one slot per server, created by hand as the Airbyte set-up guide describes"
  SVC=pg;  q appdb "SELECT * FROM pg_create_logical_replication_slot('airbyte_slot', 'pgoutput');"
  SVC=pgq; q quietdb "SELECT * FROM pg_create_logical_replication_slot('airbyte_quiet_slot', 'pgoutput');"
  SVC=pg
  say "the connector image"
  docker inspect "$IMAGE" --format 'image {{index .RepoDigests 0}}  version label {{index .Config.Labels "io.airbyte.version"}}'
  write_config work/config-app.json pg appdb airbyte_slot airbyte_pub
  write_config work/config-quiet.json pgq quietdb airbyte_quiet_slot airbyte_quiet_pub
  say "the configuration handed to the connector (series 1)"
  sed 's/"password": "[^"]*"/"password": "(lab password)"/' work/config-app.json
  ;;

spec)
  say "the CDC options in the connector's specification"
  docker run --rm --memory 1g "$IMAGE" spec 2>/dev/null > work/spec.raw
  python3 - <<'EOF2'
import json
spec = None
for line in open("work/spec.raw"):
    try:
        m = json.loads(line)
    except ValueError:
        continue
    if m.get("type") == "SPEC":
        spec = m["spec"]
cs = spec["connectionSpecification"]
cdc = [o for o in cs["properties"]["replication_method"]["oneOf"] if "CDC" in json.dumps(o["properties"]["method"])][0]
for k, v in cdc["properties"].items():
    print("%s | title: %s | default: %r | allowed: %s | range: %s to %s" % (
        k, v.get("title"), v.get("default"), v.get("enum"), v.get("min", v.get("minimum")), v.get("max", v.get("maximum"))))
print()
print("lsn_commit_behaviour:", cdc["properties"]["lsn_commit_behaviour"]["description"])
print("heartbeat_action_query:", cdc["properties"]["heartbeat_action_query"]["description"])
print("initial_waiting_seconds:", cdc["properties"]["initial_waiting_seconds"]["description"])
print()
text = json.dumps(spec)
for word in ("invalid_cdc_cursor_position_behavior", "Fail sync", "Re-sync data"):
    print("the specification contains %r: %s" % (word, word in text))
EOF2
  ;;

strings)
  say "log lines searched for in the jar files of the connector image"
  rm -rf work/jars; mkdir -p work/jars
  cid="$(docker create "$IMAGE")"; docker cp "$cid":/airbyte/lib work/jars/ > /dev/null; docker rm "$cid" > /dev/null
  echo "jar files: $(ls work/jars/lib | wc -l | tr -d ' ')"
  ls work/jars/lib | grep -E '^debezium-|^postgresql-|^bulk-cdk-toolkit-extract-cdc|connectors-source-postgres'
  python3 -I - work/jars/lib "trigger sync from scratch" "Saved offset is before" "has advanced beyond the source" "is not valid: wal_status" "Heartbeat timeout: no progress" "indicating database is idle" <<'EOF2'
import os, sys, zipfile
root, needles = sys.argv[1], sys.argv[2:]
hits = {}
for f in sorted(os.listdir(root)):
    if not f.endswith(".jar"):
        continue
    z = zipfile.ZipFile(os.path.join(root, f))
    for name in z.namelist():
        if name.endswith(".class"):
            data = z.read(name)
            for n in needles:
                if n.encode() in data:
                    hits.setdefault(n, []).append("%s: %s" % (f, name))
for n in needles:
    print("%-36r %s" % (n, "; ".join(hits.get(n, ["in no class of any jar"]))))
EOF2
  rm -rf work/jars
  ;;

check)
  say "connection check"
  ab 00-check --quiet-logs -- check --config /work/config-app.json
  ;;

discover)
  say "discover, and the catalog for the syncs: orders, incremental"
  ab 00-discover --quiet-logs --catalog-out work/catalog-app.json --streams orders -- discover --config /work/config-app.json
  SVC=pgq
  say "discover on the quiet database: customers"
  ab 00-discover-quiet --quiet-logs --catalog-out work/catalog-quiet.json --streams customers -- discover --config /work/config-quiet.json
  ;;

sync1)
  say "the slot before the first sync"
  slots airbyte_slot; walsize
  say "first sync, without state"
  sync 01-sync1 config-app.json catalog-app.json "" state1.json airbyte_slot
  say "the slot after the first sync"
  slots airbyte_slot
  ;;

between)
  say "no sync is running: 3 changes to orders, then 128 MB written to a table that is not published"
  q appdb "INSERT INTO orders (customer_id, status) VALUES (5, 'new');"
  q appdb "UPDATE orders SET status = 'paid', updated_at = now() WHERE id = 1;"
  q appdb "DELETE FROM orders WHERE id = 4;"
  q appdb "CALL write_wal(128);"
  checkpoint
  slots airbyte_slot; walsize
  q postgres "SELECT count(*) AS wal_senders FROM pg_stat_replication;"
  ;;

sync2|sync3|sync4|sync5)
  n="${1#sync}"; prev=$((n - 1))
  say "sync $n, with the state of sync $prev"
  slots airbyte_slot
  sync "0$n-sync$n" config-app.json catalog-app.json "state$prev.json" "state$n.json" airbyte_slot
  say "the slot after sync $n, and after a checkpoint"
  slots airbyte_slot
  checkpoint
  slots airbyte_slot; walsize
  ;;

tail)
  say "one more change to orders, written after the 128 MB"
  q appdb "UPDATE orders SET status = 'shipped', updated_at = now() WHERE id = 2;"
  slots airbyte_slot
  ;;

lost)
  say "a cap of 64 MB on the slot, then one row, 160 MB of writes and a checkpoint while no sync runs"
  q postgres "ALTER SYSTEM SET max_slot_wal_keep_size = '64MB';"
  q postgres "SELECT pg_reload_conf();"; sleep 1
  q appdb "INSERT INTO orders (customer_id, status) VALUES (6, 'new');"
  q appdb "CALL write_wal(160);"
  checkpoint
  slots airbyte_slot
  serverlog 'invalidating|exceeds'
  say "a sync with the last good state"
  sync 06-lost config-app.json catalog-app.json state5.json "" airbyte_slot
  say "the same sync without any state, as after a reset of the connection"
  sync 06-lost-nostate config-app.json catalog-app.json "" "" airbyte_slot
  slots airbyte_slot
  ;;

recreated)
  say "the cap is removed, the lost slot is dropped and created again, and one more row is written"
  q postgres "ALTER SYSTEM RESET max_slot_wal_keep_size;"
  q postgres "SELECT pg_reload_conf();"; sleep 1
  q appdb "SELECT pg_drop_replication_slot('airbyte_slot');"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('airbyte_slot', 'pgoutput');"
  q appdb "INSERT INTO orders (customer_id, status) VALUES (7, 'new');"
  slots airbyte_slot
  q appdb "SELECT id, customer_id, status FROM orders ORDER BY id;"
  say "a sync with the state saved before the slot was lost"
  sync 07-recreated config-app.json catalog-app.json state5.json "" airbyte_slot
  say "the same sync without any state, as after a reset of the connection"
  sync 07-recreated-nostate config-app.json catalog-app.json "" state7.json airbyte_slot
  slots airbyte_slot
  ;;

ahead)
  say "the slot is moved past the saved position: 2 rows are written, then pg_replication_slot_advance"
  q appdb "INSERT INTO orders (customer_id, status) VALUES (8, 'new'), (9, 'new');"
  q appdb "SELECT pg_replication_slot_advance('airbyte_slot', pg_current_wal_lsn());"
  slots airbyte_slot
  say "a sync with the state saved before the slot was moved"
  sync 08-ahead config-app.json catalog-app.json state7.json "" airbyte_slot
  slots airbyte_slot
  ;;

settle)
  say "the slot is at the newest position: a little WAL and a checkpoint, until pg_wal is back near max_wal_size"
  slots airbyte_slot; walsize
  settle airbyte_slot
  ;;

quiet-republish)
  SVC=pgq
  say "the heartbeat table is put back into the publication"
  q quietdb "ALTER PUBLICATION airbyte_quiet_pub ADD TABLE airbyte_heartbeat;"
  q quietdb "SELECT pubname, tablename FROM pg_publication_tables ORDER BY 1, 2;"
  ;;

quiet-settle)
  SVC=pgq
  say "a little WAL and a checkpoint, until pg_wal is back near max_wal_size"
  slots airbyte_quiet_slot; walsize
  settle airbyte_quiet_slot
  ;;

prep)
  mkdir -p logs/raw
  i=0
  step() { i=$((i + 1)); local name; name="$(printf '%02d-%s' "$i" "$1")"; echo "== $name $(date -u +%H:%M:%S)"; "$0" "$@" > "logs/$name.txt" 2>&1 || true; }
  for s in up spec strings check discover; do step "$s"; done
  ;;

series1)
  [[ -n "${SKIP_PREP:-}" ]] || "$0" prep
  i=5
  step() { i=$((i + 1)); local name; name="$(printf '%02d-%s' "$i" "$1")"; echo "== $name $(date -u +%H:%M:%S)"; "$0" "$@" > "logs/$name.txt" 2>&1 || true; }
  for s in sync1 between sync2 sync3 tail sync4 sync5 settle lost recreated ahead; do step "$s"; done
  ;;

quiet-sync)
  SVC=pgq
  n="$2"; prev=$((n - 1)); config=config-quiet.json; [[ "${3:-}" == hb ]] && config=config-quiet-hb.json
  in="qstate$prev.json"; [[ "$n" == 1 ]] && in=""
  say "sync $n of quietdb${in:+, with the state of sync $prev}${3:+, with the heartbeat query}"
  slots airbyte_quiet_slot
  sync "2$n-quiet-sync$n" "$config" catalog-quiet.json "$in" "qstate$n.json" airbyte_quiet_slot
  say "the slot after the sync, and after a checkpoint"
  slots airbyte_quiet_slot
  checkpoint
  slots airbyte_quiet_slot; walsize
  if [[ "${3:-}" == hb ]]; then q quietdb "SELECT count(*) AS heartbeat_rows FROM airbyte_heartbeat;"; fi
  ;;

quiet-busy)
  SVC=pgq
  say "appdb writes 128 MB, quietdb nothing"
  q appdb "CALL write_wal(128);"
  checkpoint
  slots airbyte_quiet_slot; walsize
  ;;

quiet-heartbeat)
  SVC=pgq
  say "a heartbeat table in quietdb, added to the publication, and the connector's heartbeat query"
  q quietdb "CREATE TABLE airbyte_heartbeat (id serial PRIMARY KEY, text text);"
  q quietdb "GRANT INSERT, SELECT ON airbyte_heartbeat TO airbyte; GRANT USAGE ON SEQUENCE airbyte_heartbeat_id_seq TO airbyte;"
  q quietdb "ALTER PUBLICATION airbyte_quiet_pub ADD TABLE airbyte_heartbeat;"
  q quietdb "SELECT pubname, tablename FROM pg_publication_tables ORDER BY 1, 2;"
  write_config work/config-quiet-hb.json pgq quietdb airbyte_quiet_slot airbyte_quiet_pub "INSERT INTO airbyte_heartbeat (text) VALUES ('heartbeat')"
  grep heartbeat_action_query work/config-quiet-hb.json
  slots airbyte_quiet_slot
  ;;

quiet-nopub)
  SVC=pgq
  say "the heartbeat table is taken out of the publication; the heartbeat query stays in the configuration"
  q quietdb "ALTER PUBLICATION airbyte_quiet_pub DROP TABLE airbyte_heartbeat;"
  q quietdb "SELECT pubname, tablename FROM pg_publication_tables ORDER BY 1, 2;"
  ;;

series2)
  mkdir -p logs/raw
  i=20
  step() { i=$((i + 1)); local name; name="$(printf '%02d-%s' "$i" "$(tr ' ' '-' <<<"$*")")"; echo "== $name $(date -u +%H:%M:%S)"; "$0" "$@" > "logs/$name.txt" 2>&1 || true; }
  step quiet-sync 1; step quiet-busy; step quiet-sync 2; step quiet-sync 3
  step quiet-heartbeat; step quiet-sync 4 hb; step quiet-sync 5 hb; step quiet-settle
  step quiet-nopub; step quiet-busy; step quiet-sync 6 hb; step quiet-sync 7 hb
  step quiet-republish; step quiet-sync 8 hb; step quiet-sync 9 hb; step quiet-settle
  ;;

down)
  dc down -v --remove-orphans
  rm -rf work
  ;;

*)
  sed -n '2,40p' "$0"; exit 1 ;;
esac
