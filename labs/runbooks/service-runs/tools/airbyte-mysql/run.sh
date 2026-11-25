#!/usr/bin/env bash
# Service test: the Airbyte MySQL source connector and a binary log position that was purged.
#
# The connector image is run directly with the Airbyte protocol commands. This is not Airbyte Cloud
# and not the Airbyte platform: there is no scheduler and no destination. A "sync" here is one
# `read`, and the state it prints is handed to the next `read`, as the platform would do.
#
#   ./run.sh up          MySQL 8.4.13 with the binary log on
#   ./run.sh spec        the CDC options the connector has
#   ./run.sh strings     which of the log lines in question exist in the connector's jar files
#   ./run.sh check       the connection check
#   ./run.sh discover    the streams, and the catalog for the syncs
#   ./run.sh sync1       first sync: 4 customers and 4 orders
#   ./run.sh sync2       one insert, then a second sync: the position in the state moves
#   ./run.sh outage      no sync runs: 3 customers added, 1 order changed, 1 deleted, the log purged
#   ./run.sh fail        a sync with the saved state and the default setting
#   ./run.sh resync      the same sync with "Re-sync data"
#   ./run.sh after       one more insert and a sync with the state the re-sync returned
#   ./run.sh all         every step in order, each captured under logs/<mode>/
#   ./run.sh down        remove everything
#
#   GTID=ON ./run.sh all     the same with gtid_mode=ON
set -euo pipefail
cd "$(dirname "$0")"

export GTID="${GTID:-OFF}"
IMAGE="${IMAGE:-airbyte/source-mysql:3.53.10}"
NET=rbt-abt-mysql_default
MODE="gtid-$(tr '[:upper:]' '[:lower:]' <<<"$GTID")"

dc() { docker compose "$@"; }
# sql STATEMENTS: print the statements, then the result or the error. Never stops the script.
sql() { printf '%s\n' "$1"; dc exec -T source mysql -uroot -prootpw --table -e "$1" 2>&1 | grep -v 'Using a password' || true; }
val() { dc exec -T source mysql -uroot -prootpw -N -B -e "$1" 2>/dev/null || true; }
say() { printf '\n## %s\n' "$*"; }
stamp() { date -u '+%Y-%m-%d %H:%M:%S UTC'; }
ab() { local raw=$1; shift; python3 ab.py --image "$IMAGE" --network "$NET" --work work --raw "logs/$MODE/raw/$raw.jsonl.gz" "$@"; }
binlogs() { sql "SHOW BINARY LOGS; SHOW BINARY LOG STATUS;"; }
counts() { sql "SELECT (SELECT COUNT(*) FROM inventory.customers) AS customers, (SELECT COUNT(*) FROM inventory.orders) AS orders;"; }
# sync RAWNAME CONFIG STATE_IN STATE_OUT
sync() {
  local raw=$1 config=$2 in=$3 out=$4 args
  args=(read --config "/work/$config" --catalog /work/catalog.json)
  if [[ -n "$in" ]]; then args+=(--state "/work/$in"); echo "state handed to the connector: $(python3 ab.py --print-state "work/$in")"; else echo "no state is handed to the connector"; fi
  echo "started $(stamp)"
  ab "$raw" ${out:+--state-out "work/$out"} -- "${args[@]}" || true
  echo "ended $(stamp)"
}
write_config() {   # write_config FILE BEHAVIOUR ("" leaves the option out)
  python3 - "$@" <<'EOF'
import json, sys
f, behaviour = sys.argv[1:3]
rm = {"method": "CDC"}
if behaviour:
    rm["invalid_cdc_cursor_position_behavior"] = behaviour
json.dump({"host": "source", "port": 3306, "database": "inventory", "username": "airbyte", "password": "labpw",
           "ssl_mode": {"mode": "preferred"}, "tunnel_method": {"tunnel_method": "NO_TUNNEL"},
           "replication_method": rm}, open(f, "w"), indent=2)
EOF
}

case "${1:-}" in
up)
  mkdir -p work "logs/$MODE/raw"
  dc up -d --wait
  say "the server"
  sql "SELECT VERSION() AS version, @@gtid_mode AS gtid_mode, @@binlog_format AS binlog_format, @@binlog_row_image AS binlog_row_image, @@binlog_expire_logs_seconds AS binlog_expire_logs_seconds;"
  binlogs
  say "the connector image"
  docker inspect "$IMAGE" --format 'image {{index .RepoDigests 0}}  version label {{index .Config.Labels "io.airbyte.version"}}'
  write_config work/config.json ""
  write_config work/config-resync.json "Re-sync data"
  say "the configuration handed to the connector"
  sed 's/"password": "[^"]*"/"password": "(lab password)"/' work/config.json
  ;;

spec)
  say "the CDC options in the connector's specification"
  docker run --rm --memory 1g "$IMAGE" spec 2>/dev/null > work/spec.raw
  python3 - <<'EOF'
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
print("invalid_cdc_cursor_position_behavior:", cdc["properties"]["invalid_cdc_cursor_position_behavior"]["description"])
EOF
  ;;

strings)
  say "log lines searched for in the jar files of the connector image"
  mkdir -p work/jars
  cid="$(docker create "$IMAGE")"; docker cp "$cid":/airbyte/lib work/jars/ > /dev/null; docker rm "$cid" > /dev/null
  echo "jar files: $(ls work/jars/lib | wc -l | tr -d ' ')"
  ls work/jars/lib | grep -E '^debezium-|^mysql-|^bulk-cdk-toolkit-extract-cdc|connectors-source-mysql'
  python3 -I - work/jars/lib "going to trigger a sync from scratch" "Saved offset no longer present on the server" "please reset the connection" "Triggering reset" "Incumbent CDC state is invalid" <<'EOF2'
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
    print("%-48r %s" % (n, "; ".join(hits.get(n, ["in no class of any jar"]))))
EOF2
  rm -rf work/jars
  ;;

check)
  say "connection check"
  ab 00-check --quiet-logs -- check --config /work/config.json
  ;;

discover)
  say "discover, and the catalog for the syncs: customers and orders, incremental"
  ab 00-discover --quiet-logs --catalog-out work/catalog.json --streams customers,orders -- discover --config /work/config.json
  ;;

sync1)
  say "first sync, without state"
  sync 01-sync1 config.json "" state1.json
  ;;

sync2)
  say "one insert, then a second sync with the state of the first"
  sql "INSERT INTO inventory.orders (customer_id, quantity) VALUES (1, 5);"
  binlogs
  sync 02-sync2 config.json state1.json state2.json
  ;;

outage)
  say "no sync runs: 3 customers added, 1 order changed, 1 order deleted"
  sql "INSERT INTO inventory.customers (first_name, last_name, email) VALUES ('Jon', 'Doe', 'jon@example.com'), ('Mia', 'Wong', 'mia@example.com'), ('Raj', 'Patel', 'raj@example.com');"
  sql "UPDATE inventory.orders SET quantity = 9 WHERE id = 2;"
  sql "DELETE FROM inventory.orders WHERE id = 4;"
  say "the binary log is rotated twice and every file before the newest one is purged"
  sql "INSERT INTO noise.ticks () VALUES (),(),(); FLUSH BINARY LOGS; INSERT INTO noise.ticks () VALUES (),(),(); FLUSH BINARY LOGS;"
  binlogs
  newest="$(val "SHOW BINARY LOG STATUS" | awk '{print $1}')"
  sql "PURGE BINARY LOGS TO '$newest';"
  binlogs
  sql "SELECT @@GLOBAL.gtid_purged AS gtid_purged, @@GLOBAL.gtid_executed AS gtid_executed;"
  counts
  ;;

fail)
  say "a sync with the state saved before the purge, and the default setting"
  sync 03-fail config.json state2.json state-fail.json
  say "the same sync again"
  sync 03-fail-again config.json state2.json ""
  ;;

resync)
  say "the same sync with invalid_cdc_cursor_position_behavior = Re-sync data"
  grep -n invalid_cdc work/config-resync.json
  sync 04-resync config-resync.json state2.json state4.json
  counts
  ;;

after)
  say "one more insert and a sync with the state the re-sync returned"
  sql "INSERT INTO inventory.orders (customer_id, quantity) VALUES (3, 7);"
  if [[ -s work/state4.json ]]; then sync 05-after config.json state4.json state5.json; else echo "(the re-sync returned no state)"; fi
  ;;

all)
  mkdir -p "logs/$MODE/raw"
  i=0
  step() { i=$((i + 1)); local name; name="$(printf '%02d-%s' "$i" "$1")"; echo "== $MODE/$name"; "$0" "$1" > "logs/$MODE/$name.txt" 2>&1 || true; tail -n 2 "logs/$MODE/$name.txt" | cut -c1-200; }
  for s in up spec strings check discover sync1 sync2 outage fail resync after; do step "$s"; done
  ;;

down)
  dc down -v --remove-orphans
  rm -rf work
  ;;

*)
  sed -n '2,23p' "$0"; exit 1 ;;
esac
