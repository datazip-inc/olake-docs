#!/usr/bin/env bash
# Service test: the Airbyte SQL Server source connector and a column added to a CDC-enabled table.
#
# The connector image is run directly with the Airbyte protocol commands. This is not Airbyte Cloud
# and not the Airbyte platform: there is no scheduler and no destination. A "sync" here is one
# `read`, and the state it prints is handed to the next `read`, as the platform would do.
#
#   ./run.sh up           SQL Server 2022 with the Agent on, CDC on dbo.orders
#   ./run.sh spec         the CDC options the connector has
#   ./run.sh check        the connection check
#   ./run.sh discover     the stream, and the catalog for the syncs
#   ./run.sh sync1        first sync: the 4 rows of orders
#   ./run.sh sync2        one insert, then a second sync: the change arrives through CDC
#   ./run.sh add-column   ALTER TABLE ... ADD note, two inserts and one update with a value in it
#   ./run.sh sync3        discover again, then a sync: what the records carry for the new column
#   ./run.sh reenable     one more insert, then CDC is disabled and enabled on the table, as Airbyte documents
#   ./run.sh sync4        a sync with the state saved before that
#   ./run.sh sync5        the next sync
#   ./run.sh resync       what "Re-sync data" does with the same saved state
#   ./run.sh after        one more insert and a sync: the new column now arrives through CDC
#   ./run.sh all          every step in order, each captured under logs/
#   ./run.sh down         remove everything
set -euo pipefail
cd "$(dirname "$0")"

IMAGE="${IMAGE:-airbyte/source-mssql:5.1.5}"
NET=rbt-abt-mssql_default
PW=Lab_Passw0rd_2026
SQLCMD=/opt/mssql-tools18/bin/sqlcmd

dc() { docker compose "$@"; }
say() { printf '\n## %s\n' "$*"; }
stamp() { date -u '+%Y-%m-%d %H:%M:%S UTC'; }
# q STATEMENTS: print the batch, then its results and messages. Never stops the script.
q() { printf '%s\n' "$1"; dc exec -T mssql "$SQLCMD" -S localhost -U sa -P "$PW" -C -I -d "${DB:-cdclab}" -W -s '|' -w 600 -Q "SET NOCOUNT ON; $1" < /dev/null 2>&1 | tr -d '\r' || true; echo; }
ab() { local raw=$1; shift; python3 ab.py --image "$IMAGE" --network "$NET" --work work --raw "logs/raw/$raw.jsonl.gz" "$@"; }
table() { q "SELECT * FROM dbo.orders ORDER BY id;"; }
instances() {
  q "SELECT capture_instance, start_lsn, create_date, supports_net_changes FROM cdc.change_tables ORDER BY create_date;"
  q "SELECT ct.capture_instance, cc.column_name, cc.column_ordinal FROM cdc.captured_columns cc JOIN cdc.change_tables ct ON ct.object_id = cc.object_id ORDER BY ct.capture_instance, cc.column_ordinal;"
  q "SELECT sys.fn_cdc_get_min_lsn(N'dbo_orders') AS min_lsn_dbo_orders, sys.fn_cdc_get_max_lsn() AS max_lsn;"
}
# sync RAWNAME CONFIG CATALOG STATE_IN STATE_OUT
sync() {
  local raw=$1 config=$2 catalog=$3 in=$4 out=$5 args
  args=(read --config "/work/$config" --catalog "/work/$catalog")
  if [[ -n "$in" ]]; then args+=(--state "/work/$in"); echo "state handed to the connector: $(python3 ab.py --print-state "work/$in")"; else echo "no state is handed to the connector"; fi
  echo "started $(stamp)"
  ab "$raw" --show 12 ${out:+--state-out "work/$out"} -- "${args[@]}" || true
  echo "ended $(stamp)"
}
write_config() {   # write_config FILE BEHAVIOUR ("" leaves the option out)
  python3 - "$@" <<'EOF'
import json, sys
f, behaviour = sys.argv[1:3]
rm = {"method": "CDC", "initial_waiting_seconds": 120}
if behaviour:
    rm["invalid_cdc_cursor_position_behavior"] = behaviour
json.dump({"host": "mssql", "port": 1433, "database": "cdclab", "username": "airbyte", "password": "Lab_Passw0rd_2026",
           "schemas": ["dbo"], "ssl_mode": {"mode": "unencrypted"}, "tunnel_method": {"tunnel_method": "NO_TUNNEL"},
           "replication_method": rm}, open(f, "w"), indent=2)
EOF
}

case "${1:-}" in
up)
  mkdir -p work logs/raw
  dc up -d --wait
  say "version"
  DB=master q "SELECT SERVERPROPERTY('ProductVersion') AS product_version, SERVERPROPERTY('ProductUpdateLevel') AS update_level, SERVERPROPERTY('Edition') AS edition;"
  say "the lab database, CDC on dbo.orders, and the connector's login"
  dc exec -T mssql "$SQLCMD" -S localhost -U sa -P "$PW" -C -I -d master -i /dev/stdin < sql/init.sql 2>&1 | tr -d '\r' || true
  sleep 8
  DB=master q "SELECT servicename, status_desc FROM sys.dm_server_services;"
  q "SELECT name, is_cdc_enabled, snapshot_isolation_state_desc FROM sys.databases WHERE name = N'cdclab';"
  instances
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
EOF
  ;;

check)
  say "connection check"
  ab 00-check --quiet-logs -- check --config /work/config.json
  ;;

discover)
  say "discover, and the catalog for the syncs: orders, incremental"
  ab 00-discover --quiet-logs --catalog-out work/catalog.json --streams orders -- discover --config /work/config.json
  ;;

sync1)
  say "first sync, without state"
  sync 01-sync1 config.json catalog.json "" state1.json
  ;;

sync2)
  say "one insert, then a second sync with the state of the first"
  q "INSERT INTO dbo.orders (customer_id, quantity) VALUES (1, 5);"
  sleep 8
  q "SELECT COUNT(*) AS rows_in_change_table FROM cdc.dbo_orders_CT;"
  sync 02-sync2 config.json catalog.json state1.json state2.json
  ;;

add-column)
  say "a new column on the source table, then two inserts and one update with a value in it"
  q "ALTER TABLE dbo.orders ADD note NVARCHAR(100) NULL;"
  q "INSERT INTO dbo.orders (customer_id, quantity, note) VALUES (2, 6, N'first note'), (3, 7, N'second note');"
  q "UPDATE dbo.orders SET note = N'note on an old row' WHERE id = 1;"
  sleep 8
  table
  say "what CDC has: the capture instance still has the columns it was created with"
  instances
  q "SELECT __\$operation AS op, id, customer_id, quantity FROM cdc.dbo_orders_CT ORDER BY __\$start_lsn, __\$seqval, __\$operation;"
  q "SELECT source_object_id, ddl_command, ddl_time FROM cdc.ddl_history;"
  ;;

sync3)
  say "discover again: does the stream list the new column?"
  ab 03-discover --quiet-logs --catalog-out work/catalog2.json --streams orders -- discover --config /work/config.json
  say "a sync with the new catalog and the state of sync 2"
  sync 03-sync3 config.json catalog2.json state2.json state3.json
  ;;

reenable)
  say "one more insert, which no sync has read yet"
  q "INSERT INTO dbo.orders (customer_id, quantity, note) VALUES (4, 8, N'written before the re-enable');"
  sleep 8
  q "SELECT COUNT(*) AS rows_in_change_table FROM cdc.dbo_orders_CT;"
  say "CDC is disabled and enabled on the table, with the two calls from Airbyte's troubleshooting page"
  q "EXEC sys.sp_cdc_disable_table @source_schema = N'dbo', @source_name = N'orders', @capture_instance = N'dbo_orders';"
  q "EXEC sys.sp_cdc_enable_table @source_schema = N'dbo', @source_name = N'orders', @role_name = NULL;"
  q "EXEC sys.sp_cdc_get_captured_columns @capture_instance = N'dbo_orders';"
  instances
  say "one insert after the re-enable"
  q "INSERT INTO dbo.orders (customer_id, quantity, note) VALUES (1, 9, N'written after the re-enable');"
  sleep 8
  q "SELECT __\$operation AS op, id, customer_id, quantity, note FROM cdc.dbo_orders_CT ORDER BY __\$start_lsn, __\$seqval, __\$operation;"
  table
  ;;

sync4)
  say "a sync with the state saved before the re-enable, and the default setting"
  sync 04-sync4 config.json catalog2.json state3.json state4.json
  ;;

sync5)
  say "the next sync, with the state that sync returned"
  q "INSERT INTO dbo.orders (customer_id, quantity, note) VALUES (2, 10, N'written before sync 5');"
  sleep 8
  if [[ -s work/state4.json ]]; then sync 05-sync5 config.json catalog2.json state4.json state5.json; else echo "(sync 4 returned no state)"; fi
  ;;

resync)
  say "the state saved before the re-enable again, with invalid_cdc_cursor_position_behavior = Re-sync data"
  sync 06-resync config-resync.json catalog2.json state3.json state6.json
  if [[ -s work/state6.json ]]; then
    say "the sync after it, with the state it returned"
    sync 06-resync-next config-resync.json catalog2.json state6.json state7.json
  fi
  ;;

after)
  say "one insert with a value in the new column, then a sync with the state of the full read"
  q "INSERT INTO dbo.orders (customer_id, quantity, note) VALUES (3, 11, N'written after the full read');"
  sleep 8
  q "SELECT __\$operation AS op, id, customer_id, quantity, note FROM cdc.dbo_orders_CT ORDER BY __\$start_lsn, __\$seqval, __\$operation;"
  if [[ -s work/state7.json ]]; then sync 07-after config-resync.json catalog2.json state7.json state8.json; else echo "(no state from the full read)"; fi
  ;;

all)
  mkdir -p logs/raw
  i=0
  step() { i=$((i + 1)); local name; name="$(printf '%02d-%s' "$i" "$1")"; echo "== $name $(date -u +%H:%M:%S)"; "$0" "$1" > "logs/$name.txt" 2>&1 || true; }
  for s in up spec check discover sync1 sync2 add-column sync3 reenable sync4 sync5 resync after; do step "$s"; done
  ;;

down)
  dc down -v --remove-orphans
  rm -rf work
  ;;

*)
  sed -n '2,22p' "$0"; exit 1 ;;
esac
