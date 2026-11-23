#!/bin/bash
# Azure Database for PostgreSQL flexible server: the prerequisites of logical replication, one at a time.
# Backs the "Managed services" section of docs/runbooks/postgres/enable-logical-replication.mdx
# and checks docs/connectors/postgres/setup/azure.mdx against the live service.
#
#   ./run.sh defaults      settings and roles of a new server
#   ./run.sh wal-level     a logical slot while wal_level = replica, and the self-hosted fix
#   ./run.sh enable        server parameter wal_level = logical, restart, check
#   ./run.sh role          a role without REPLICATION, ALTER ROLE ... REPLICATION, azure_pg_admin
#   ./run.sh publication   the publication and slot statements of the OLake Azure guide
#   ./run.sh plugins       pgoutput, test_decoding, wal2json, decoderbufs, pglogical
#   ./run.sh timeout       wal_sender_timeout = 0 as a server parameter
set -u
HERE=$(cd "$(dirname "$0")" && pwd); . "$HERE/../env.sh"
C=${RB_CLIENT:-rbt-cld-pg}; LOG="$HERE/logs"; mkdir -p "$LOG"
H="$AZ_PG.postgres.database.azure.com"; RB_MASTER=$AZ_ADMIN
azp()  { az postgres flexible-server "$@" --subscription "$AZ_SUB" -g "$AZ_RG"; }
stamp() { date -u '+%F %T UTC'; }
client_up() {
  docker inspect "$C" >/dev/null 2>&1 || docker run -d --name "$C" --memory 256m -e PGSSLMODE=require -e PGCONNECT_TIMEOUT=15 --entrypoint sleep postgres:18.7 infinity >/dev/null
  ( set -a; . "$RB_SECRETS"; set +a; printf '*:*:*:postgres:%s\n*:*:*:rbadmin:%s\n*:*:*:cdc_user:%s\n' "$DBPASS" "$DBPASS" "$CDCPASS" ) | docker exec -i "$C" sh -c 'umask 077; cat > /root/.pgpass; chmod 600 /root/.pgpass'
}
client_up
# stderr is merged inside the container, so that an error stays next to its statement
sql()  { docker exec -i "$C" env -u PGPASSWORD -u PGUSER sh -c 'exec psql -h "$1" -U "$2" -d "$3" -X -a -q 2>&1' sh "$H" "$1" "$2"; }   # statements echoed
sqlq() { docker exec -i "$C" env -u PGPASSWORD -u PGUSER sh -c 'exec psql -h "$1" -U "$2" -d "$3" -X -q 2>&1' sh "$H" "$1" "$2"; }      # not echoed
repl() { echo "psql \"dbname=$2 user=$1 replication=database\" -c \"$3\""; docker exec -i "$C" env -u PGPASSWORD -u PGUSER sh -c 'exec psql "host=$1 dbname=$3 user=$2 replication=database" -X -q -c "$4" 2>&1' sh "$H" "$1" "$2" "$3"; }
cap()  { sed -E "s/$AZ_PG/<server>/g; s/host \"[0-9.]+\"/host \"<client-ip>\"/g; s/\(([0-9]{1,3}\.){3}[0-9]{1,3}\), port/(<ip>), port/g" | tee "$LOG/$1"; }
head_() { echo "# $1"; echo "# $(stamp), server <server>, $(azp show -n "$AZ_PG" --query '[version, minorVersion, sku.name, sku.tier, location]' -o tsv | tr '\t\n' '  ')"; echo; }
param() { azp parameter show -s "$AZ_PG" --name "$1" --query '{value:value, default:defaultValue, allowed:allowedValues, dynamic:isDynamicConfig, pendingRestart:isConfigPendingRestart, readOnly:isReadOnly}' -o json 2>&1 | tr -d '\n' | sed -E 's/  +/ /g'; echo; }

case "${1:-}" in
defaults)
  { head_ "A new server: settings and roles before anything is changed"
    echo "CREATE DATABASE appdb;" | sqlq "$RB_MASTER" postgres
    sql "$RB_MASTER" appdb <<'SQL'
SELECT version();
SELECT name, setting, unit, context FROM pg_settings
WHERE name IN ('wal_level','max_replication_slots','max_wal_senders','max_connections','wal_sender_timeout','max_slot_wal_keep_size',
               'idle_replication_slot_timeout','output_plugin_libraries','max_wal_size','wal_keep_size','archive_timeout','require_secure_transport','shared_preload_libraries') ORDER BY name;
SELECT rolname, rolsuper, rolreplication, rolcreaterole FROM pg_roles WHERE rolname IN (current_user, 'azure_pg_admin', 'azuresu', 'replication') ORDER BY 1;
SELECT r.rolname AS admin_is_member_of FROM pg_auth_members m JOIN pg_roles r ON r.oid = m.roleid JOIN pg_roles u ON u.oid = m.member WHERE u.rolname = current_user ORDER BY 1;
SELECT slot_name, plugin, slot_type, active FROM pg_replication_slots;
SQL
    echo; echo "# the server parameters the OLake guide names, as Azure reports them"
    for p in wal_level max_replication_slots max_wal_senders wal_sender_timeout max_slot_wal_keep_size; do printf '%s: ' $p; param $p; done
    echo; echo "# backups: $(azp show -n "$AZ_PG" --query 'backup.backupRetentionDays' -o tsv) days (the lowest value Azure accepts is 7)"
  } | cap 01-defaults.txt ;;

wal-level)
  { head_ "A logical slot while wal_level = replica"
    sql "$RB_MASTER" appdb <<'SQL'
CREATE TABLE IF NOT EXISTS orders (id int PRIMARY KEY, customer text, quantity int);
CREATE TABLE IF NOT EXISTS events_nopk (device_id int, reading numeric);
INSERT INTO orders VALUES (1, 'a', 1), (2, 'b', 2) ON CONFLICT DO NOTHING;
SHOW wal_level;
SELECT * FROM pg_create_logical_replication_slot('e1_slot', 'pgoutput');
-- the self-hosted fix
ALTER SYSTEM SET wal_level = logical;
SET wal_level = logical;
-- a publication can be created all the same
CREATE PUBLICATION e1_pub FOR TABLE orders;
DROP PUBLICATION e1_pub;
SQL
    echo; echo "# a replication connection for the admin user in the same state"
    repl "$RB_MASTER" appdb "IDENTIFY_SYSTEM;"
    repl "$RB_MASTER" appdb "CREATE_REPLICATION_SLOT e1_repl_slot LOGICAL pgoutput;"
  } | cap 02-wal-level.txt ;;

enable)
  { head_ "Server parameter wal_level = logical, then a restart"
    printf 'before: '; param wal_level
    echo "\$ az postgres flexible-server parameter set -g $AZ_RG -s <server> --name wal_level --value logical"; t0=$(date +%s)
    azp parameter set -s "$AZ_PG" --name wal_level --value logical --query '{value:value, pendingRestart:isConfigPendingRestart}' -o json 2>&1 | tr -d '\n'; echo "   [$(( $(date +%s) - t0 )) s]"
    printf 'after the set: '; param wal_level
    sql "$RB_MASTER" appdb <<'SQL'
SELECT name, setting, pending_restart FROM pg_settings WHERE name IN ('wal_level','max_replication_slots','max_wal_senders') ORDER BY name;
SELECT * FROM pg_create_logical_replication_slot('e1_slot', 'pgoutput');
SQL
    echo; echo "\$ az postgres flexible-server restart -g $AZ_RG -n <server>"; t0=$(date +%s)
    azp restart -n "$AZ_PG" -o none 2>&1 | tail -1
    for i in $(seq 1 40); do [ "$(echo 'SELECT 1' | docker exec -i "$C" env -u PGPASSWORD -u PGUSER psql -h "$H" -U "$RB_MASTER" -d appdb -X -q -At 2>/dev/null)" = "1" ] && break; sleep 5; done
    echo "$(stamp)  answers again $(( $(date +%s) - t0 )) s after the restart call"
    printf 'after the restart: '; param wal_level
    sql "$RB_MASTER" appdb <<'SQL'
SHOW wal_level;
SELECT name, setting, pending_restart FROM pg_settings WHERE name IN ('max_replication_slots','max_wal_senders','wal_sender_timeout') ORDER BY name;
SELECT * FROM pg_create_logical_replication_slot('e1_slot', 'pgoutput');
SELECT pg_drop_replication_slot('e1_slot');
SQL
  } | cap 03-enable.txt ;;

role)
  { head_ "A role without the REPLICATION attribute"
    ( set -a; . "$RB_SECRETS"; set +a; printf "DROP ROLE IF EXISTS cdc_user;\nCREATE ROLE cdc_user WITH LOGIN PASSWORD '%s';\n" "$CDCPASS" ) | sqlq "$RB_MASTER" appdb
    echo "CREATE ROLE cdc_user WITH LOGIN PASSWORD '...';   -- run as the admin user, password not shown"
    sql "$RB_MASTER" appdb <<'SQL'
SELECT rolname, rolsuper, rolreplication FROM pg_roles WHERE rolname IN ('cdc_user', current_user) ORDER BY 1;
SQL
    echo; echo "# as cdc_user"
    sql cdc_user appdb <<'SQL'
SELECT * FROM pg_create_logical_replication_slot('e3_slot', 'pgoutput');
SELECT * FROM orders;
SQL
    repl cdc_user appdb "IDENTIFY_SYSTEM;"
    echo; echo "# as the admin user: the statement Microsoft documents, on itself and on the new role"
    sql "$RB_MASTER" appdb <<'SQL'
ALTER ROLE rbadmin WITH REPLICATION;
ALTER ROLE cdc_user WITH REPLICATION;
SELECT rolname, rolsuper, rolreplication FROM pg_roles WHERE rolname IN ('cdc_user', current_user) ORDER BY 1;
GRANT USAGE ON SCHEMA public TO cdc_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cdc_user;
SELECT r.rolname AS cdc_user_is_member_of FROM pg_auth_members m JOIN pg_roles r ON r.oid = m.roleid JOIN pg_roles u ON u.oid = m.member WHERE u.rolname = 'cdc_user';
SQL
    echo; echo "# as cdc_user again: REPLICATION, USAGE and SELECT, and no membership in azure_pg_admin"
    sql cdc_user appdb <<'SQL'
SELECT * FROM pg_create_logical_replication_slot('e3_slot', 'pgoutput');
SELECT * FROM orders;
SELECT slot_name, plugin, slot_type, database, active FROM pg_replication_slots;
SQL
    repl cdc_user appdb "IDENTIFY_SYSTEM;"
    sql cdc_user appdb <<'SQL'
SELECT pg_drop_replication_slot('e3_slot');
SQL
    echo; echo "# the grant of the OLake guide"
    sql "$RB_MASTER" appdb <<'SQL'
GRANT azure_pg_admin TO cdc_user;
REVOKE azure_pg_admin FROM cdc_user;
SQL
  } | cap 04-role.txt ;;

publication)
  { head_ "The publication, slot and test statements of docs/connectors/postgres/setup/azure.mdx"
    echo "# as the admin user (member of azure_pg_admin)"
    sql "$RB_MASTER" appdb <<'SQL'
CREATE PUBLICATION olake_publication FOR ALL TABLES;
SELECT pubname, puballtables, pubviaroot FROM pg_publication;
ALTER PUBLICATION olake_publication SET (publish_via_partition_root = true);
DROP PUBLICATION olake_publication;
CREATE PUBLICATION olake_publication FOR TABLES IN SCHEMA public;
DROP PUBLICATION olake_publication;
CREATE PUBLICATION olake_publication FOR TABLE public.orders;
SELECT pg_create_logical_replication_slot('olake_slot', 'pgoutput');
INSERT INTO orders VALUES (3, 'c', 3);
SELECT lsn, xid, chr(get_byte(data, 0)) AS message FROM pg_logical_slot_peek_binary_changes('olake_slot', NULL, NULL, 'proto_version', '1', 'publication_names', 'olake_publication');
ALTER PUBLICATION olake_publication ADD TABLE events_nopk;
INSERT INTO events_nopk VALUES (1, 20.5);
UPDATE events_nopk SET reading = 22.0 WHERE device_id = 1;
ALTER PUBLICATION olake_publication DROP TABLE events_nopk;
SQL
    echo; echo "# as cdc_user (REPLICATION attribute, USAGE and SELECT only)"
    sql cdc_user appdb <<'SQL'
SELECT count(*) AS messages FROM pg_logical_slot_peek_binary_changes('olake_slot', NULL, NULL, 'proto_version', '1', 'publication_names', 'olake_publication');
CREATE PUBLICATION cdc_user_pub FOR TABLE public.orders;
SQL
    sql "$RB_MASTER" appdb <<'SQL'
SELECT pg_drop_replication_slot('olake_slot');
DROP PUBLICATION olake_publication;
SQL
  } | cap 05-publication.txt ;;

plugins)
  { head_ "Output plugins"
    sql "$RB_MASTER" appdb <<'SQL'
SHOW output_plugin_libraries;
SELECT * FROM pg_create_logical_replication_slot('s_pgoutput', 'pgoutput');
SELECT * FROM pg_create_logical_replication_slot('s_test_decoding', 'test_decoding');
SELECT * FROM pg_create_logical_replication_slot('s_wal2json', 'wal2json');
SELECT * FROM pg_create_logical_replication_slot('s_decoderbufs', 'decoderbufs');
SELECT * FROM pg_create_logical_replication_slot('s_pglogical', 'pglogical_output');
SELECT slot_name, plugin FROM pg_replication_slots ORDER BY 1;
SELECT pg_drop_replication_slot(slot_name) FROM pg_replication_slots WHERE slot_name LIKE 's\_%';
SQL
    printf 'server parameter output_plugin_libraries: '; param output_plugin_libraries
  } | cap 06-plugins.txt ;;

wal-level-repl)
  { head_ "wal_level = replica again, and a role that has the REPLICATION attribute"
    restart_wait() { local t0; t0=$(date +%s); azp restart -n "$AZ_PG" -o none 2>&1 | tail -1; for i in $(seq 1 60); do [ "$(echo 'SELECT 1' | docker exec -i "$C" env -u PGPASSWORD -u PGUSER psql -h "$H" -U "$RB_MASTER" -d appdb -X -q -At 2>/dev/null)" = "1" ] && break; sleep 5; done; echo "$(stamp)  answers again $(( $(date +%s) - t0 )) s after the restart call"; }
    echo "\$ az postgres flexible-server parameter set ... --name wal_level --value replica; az postgres flexible-server restart ..."
    azp parameter set -s "$AZ_PG" --name wal_level --value replica --query '{value:value, pendingRestart:isConfigPendingRestart}' -o json 2>&1 | tr -d '\n'; echo; restart_wait
    sql cdc_user appdb <<'SQL'
SHOW wal_level;
SELECT rolname, rolreplication FROM pg_roles WHERE rolname = current_user;
SELECT * FROM pg_create_logical_replication_slot('e1_slot', 'pgoutput');
SQL
    repl cdc_user appdb "IDENTIFY_SYSTEM;"
    repl cdc_user appdb "CREATE_REPLICATION_SLOT e1_repl_slot LOGICAL pgoutput;"
    echo; echo "\$ az postgres flexible-server parameter set ... --name wal_level --value logical; az postgres flexible-server restart ..."
    azp parameter set -s "$AZ_PG" --name wal_level --value logical --query '{value:value, pendingRestart:isConfigPendingRestart}' -o json 2>&1 | tr -d '\n'; echo; restart_wait
    sql cdc_user appdb <<'SQL'
SHOW wal_level;
SELECT * FROM pg_create_logical_replication_slot('e1_slot', 'pgoutput');
SELECT pg_drop_replication_slot('e1_slot');
SQL
    echo; echo "# other settings of this server that matter for a slot"
    sql "$RB_MASTER" appdb <<'SQL'
SELECT name, setting, unit FROM pg_settings WHERE name IN ('wal_segment_size', 'archive_timeout', 'wal_keep_size', 'max_slot_wal_keep_size', 'max_wal_size') ORDER BY 1;
SQL
    echo "\$ az postgres flexible-server parameter set ... --name max_slot_wal_keep_size --value 1024"
    azp parameter set -s "$AZ_PG" --name max_slot_wal_keep_size --value 1024 -o none 2>&1 | grep -vE '^WARNING' | tr -d '\n' | cut -c1-400; echo
  } | cap 02b-wal-level-with-replication-role.txt ;;

timeout)
  { head_ "wal_sender_timeout = 0, as the OLake Azure guide recommends"
    printf 'before: '; param wal_sender_timeout
    echo "\$ az postgres flexible-server parameter set -g $AZ_RG -s <server> --name wal_sender_timeout --value 0"
    azp parameter set -s "$AZ_PG" --name wal_sender_timeout --value 0 --query '{value:value, pendingRestart:isConfigPendingRestart}' -o json 2>&1 | tr -d '\n'; echo
    sleep 15; sql "$RB_MASTER" appdb <<'SQL'
SHOW wal_sender_timeout;
SQL
    azp parameter set -s "$AZ_PG" --name wal_sender_timeout --value 60000 -o none 2>&1 | tail -1
  } | cap 07-timeout.txt ;;
*) sed -n '2,13p' "$0" ;;
esac
