#!/bin/bash
# Google Cloud SQL for PostgreSQL: the prerequisites of logical replication, one at a time.
# Backs the "Managed services" section of docs/runbooks/postgres/enable-logical-replication.mdx
# and checks docs/connectors/postgres/setup/gcp.mdx against the live service.
#
#   ./run.sh create        the smallest instance (db-f1-micro, 10 GB), reachable from this machine only
#   ./run.sh defaults      settings and roles of a new instance
#   ./run.sh wal-level     a logical slot while cloudsql.logical_decoding is off, and the self-hosted fix
#   ./run.sh enable        the flag cloudsql.logical_decoding = on, the restart, the check
#   ./run.sh role          a role without REPLICATION, then ALTER USER ... WITH REPLICATION
#   ./run.sh limits        max_replication_slots and max_wal_senders: the defaults, the errors, raising them
#   ./run.sh plugins       pgoutput, test_decoding, wal2json, decoderbufs
#   ./run.sh publication   the publication and slot statements of the OLake Cloud SQL guide
#   ./run.sh delete        delete the instance
set -u
HERE=$(cd "$(dirname "$0")" && pwd); LOG="$HERE/logs"; mkdir -p "$LOG"
PROJECT=${RB_GCP_PROJECT:?set RB_GCP_PROJECT to the Google Cloud project to use}; REGION=${RB_GCP_REGION:-asia-south1}; INST=${RB_GCP_INSTANCE:-rbtest-pg}; PGVER=${RB_GCP_PGVER:-POSTGRES_17}
SECRETS="${RB_SECRETS:-$HOME/.config/runbook-service-tests/secrets.env}"   # private file with DBPASS and CDCPASS
C=rbt-cld-pg
gc()    { gcloud --project "$PROJECT" --quiet "$@"; }
stamp() { date -u '+%F %T UTC'; }
ipaddr() { gc sql instances describe "$INST" --format='value(ipAddresses[0].ipAddress)' 2>/dev/null; }
client_up() {  # a psql container with a private password file; no password on any command line
  docker inspect "$C" >/dev/null 2>&1 || docker run -d --name "$C" --memory 256m -e PGSSLMODE=require -e PGCONNECT_TIMEOUT=15 --entrypoint sleep postgres:18.7 infinity >/dev/null
  ( set -a; . "$SECRETS"; set +a; printf '*:*:*:postgres:%s\n*:*:*:rbadmin:%s\n*:*:*:cdc_user:%s\n' "$DBPASS" "$DBPASS" "$CDCPASS" ) | docker exec -i "$C" sh -c 'umask 077; cat > /root/.pgpass; chmod 600 /root/.pgpass'
}
H=$(ipaddr)
sql()  { docker exec -i "$C" sh -c 'exec psql -h "$1" -U "$2" -d "$3" -X -a -q 2>&1' sh "$H" "$1" "$2"; }
sqlq() { docker exec -i "$C" sh -c 'exec psql -h "$1" -U "$2" -d "$3" -X -q 2>&1' sh "$H" "$1" "$2"; }
one()  { docker exec -i "$C" sh -c 'exec psql -h "$1" -U postgres -d appdb -X -q -At -c "$2" 2>&1' sh "$H" "$1"; }
repl() { echo "psql \"dbname=$2 user=$1 replication=database\" -c \"$3\""; docker exec -i "$C" sh -c 'exec psql "host=$1 dbname=$3 user=$2 replication=database" -X -q -c "$4" 2>&1' sh "$H" "$1" "$2" "$3"; }
cap()  { sed -E "s/\b$H\b/<instance-ip>/g" | tee "$LOG/$1"; }
head_() { echo "# $1"; echo "# $(stamp), instance $INST, $(gc sql instances describe "$INST" --format='value(databaseVersion,databaseInstalledVersion,settings.tier,settings.edition,region)' | tr '\t' ' ')"; echo; }
wait_runnable() { local i; for i in $(seq 1 90); do [ "$(gc sql instances describe "$INST" --format='value(state)')" = "RUNNABLE" ] && [ -z "$(gc sql operations list --instance "$INST" --filter='status!=DONE' --format='value(name)' 2>/dev/null)" ] && return 0; sleep 10; done; return 1; }
flags() { gc sql instances describe "$INST" --format='value(settings.databaseFlags)'; }

case "${1:-}" in
create)
  { echo "# Create the instance"; echo "# $(stamp), project $PROJECT, region $REGION"; echo
    echo "Cloud SQL Admin API enabled in the project: $(gc services list --enabled --filter='config.name=sqladmin.googleapis.com' --format='value(config.name)' | grep -c sqladmin)"
    MYIP=$(curl -s -m 8 https://checkip.amazonaws.com | tr -d '\n'); t0=$(date +%s)
    echo "\$ gcloud sql instances create $INST --database-version=$PGVER --edition=enterprise --tier=db-f1-micro --region=$REGION --storage-type=HDD --storage-size=10 --no-backup --availability-type=zonal --assign-ip --authorized-networks=<client-ip>/32"
    gc sql instances create "$INST" --database-version="$PGVER" --edition=enterprise --tier=db-f1-micro --region="$REGION" --storage-type=HDD --storage-size=10 --no-backup --availability-type=zonal --assign-ip --authorized-networks="$MYIP/32" --no-deletion-protection 2>&1 | tail -4
    gc sql instances patch "$INST" --update-labels=project=runbook-service-tests,owner=shubham,delete-after=2026-11-24 2>&1 | tail -1
    wait_runnable; echo "$(stamp)  state $(gc sql instances describe "$INST" --format='value(state)') after $(( $(date +%s) - t0 )) s"
    # the password of the built-in postgres user, set through the API from the private file
    ( set -a; . "$SECRETS"; set +a; TOKEN=$(gcloud auth print-access-token) PROJECT=$PROJECT INST=$INST python3 - <<'PY'
import json, os, urllib.request
url = f"https://sqladmin.googleapis.com/v1/projects/{os.environ['PROJECT']}/instances/{os.environ['INST']}/users?name=postgres"
req = urllib.request.Request(url, method="PUT", data=json.dumps({"name": "postgres", "password": os.environ["DBPASS"]}).encode(),
                             headers={"Authorization": "Bearer " + os.environ["TOKEN"], "Content-Type": "application/json"})
print("set the postgres password:", json.load(urllib.request.urlopen(req)).get("status"))
PY
    )
    wait_runnable; gc sql databases create appdb --instance "$INST" 2>&1 | tail -1
    gc sql instances describe "$INST" --format='yaml(databaseVersion,databaseInstalledVersion,settings.tier,settings.edition,settings.dataDiskSizeGb,settings.dataDiskType,settings.ipConfiguration.sslMode,settings.ipConfiguration.requireSsl,settings.databaseFlags,settings.userLabels)'
  } 2>&1 | sed -E 's/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\/32/<client-ip>\/32/g' | tee "$LOG/00-create.txt"
  client_up ;;

defaults)
  client_up
  { head_ "A new instance: settings and roles before anything is changed"
    sql postgres appdb <<'SQL'
SELECT version();
SELECT name, setting, unit, context FROM pg_settings
WHERE name IN ('cloudsql.logical_decoding','wal_level','max_replication_slots','max_wal_senders','max_connections',
               'wal_sender_timeout','max_slot_wal_keep_size','idle_replication_slot_timeout','output_plugin_libraries',
               'max_wal_size','wal_keep_size','archive_timeout','ssl','shared_preload_libraries') ORDER BY name;
SELECT rolname, rolsuper, rolreplication, rolcreaterole FROM pg_roles WHERE rolname IN (current_user, 'cloudsqlsuperuser', 'cloudsqladmin', 'cloudsqlreplica') ORDER BY 1;
SELECT r.rolname AS postgres_is_member_of FROM pg_auth_members m JOIN pg_roles r ON r.oid = m.roleid JOIN pg_roles u ON u.oid = m.member WHERE u.rolname = current_user ORDER BY 1;
SELECT slot_name FROM pg_replication_slots;
SQL
    echo; echo "# a connection without TLS (the OLake guide says Cloud SQL enforces SSL by default)"
    docker exec -i "$C" sh -c 'PGSSLMODE=disable psql -h "$1" -U postgres -d appdb -X -q -At -c "SELECT ssl FROM pg_stat_ssl WHERE pid = pg_backend_pid()" 2>&1' sh "$H"
    echo "sslMode of the instance: $(gc sql instances describe "$INST" --format='value(settings.ipConfiguration.sslMode)')"
    echo; echo "# flags with replication, wal, logical or plugin in the name that this version accepts"
    gc sql flags list --database-version="$PGVER" --format='table(name,type,minValue,maxValue,requiresRestart)' 2>/dev/null | grep -iE 'NAME|replication|wal_|logical|plugin|slot'
  } | cap 01-defaults.txt ;;

wal-level)
  client_up
  { head_ "A logical slot while cloudsql.logical_decoding is off"
    sql postgres appdb <<'SQL'
CREATE TABLE IF NOT EXISTS orders (id int PRIMARY KEY, customer text, quantity int);
CREATE TABLE IF NOT EXISTS events_nopk (device_id int, reading numeric);
INSERT INTO orders VALUES (1, 'a', 1), (2, 'b', 2) ON CONFLICT DO NOTHING;
SHOW cloudsql.logical_decoding;
SHOW wal_level;
SELECT * FROM pg_create_logical_replication_slot('e1_slot', 'pgoutput');
-- the self-hosted fix
ALTER SYSTEM SET wal_level = logical;
SET wal_level = logical;
-- a publication can be created all the same
CREATE PUBLICATION e1_pub FOR TABLE orders;
DROP PUBLICATION e1_pub;
SQL
    echo; echo "# a replication connection in the same state"
    repl postgres appdb "IDENTIFY_SYSTEM;"
  } | cap 02-wal-level.txt ;;

enable)
  client_up
  { head_ "The flag cloudsql.logical_decoding = on"
    echo "flags before: $(flags)"
    echo "\$ gcloud sql instances patch $INST --database-flags=cloudsql.logical_decoding=on"; t0=$(date +%s)
    gc sql instances patch "$INST" --database-flags=cloudsql.logical_decoding=on 2>&1 | tail -3
    wait_runnable; echo "$(stamp)  state RUNNABLE again after $(( $(date +%s) - t0 )) s"
    echo "operations: "; gc sql operations list --instance "$INST" --limit 3 --format='table(operationType,status,startTime,endTime)'
    echo "flags after: $(flags)"
    for i in 1 2 3 4 5 6; do [ "$(one 'SELECT 1' | tail -1)" = "1" ] && break; sleep 10; done
    sql postgres appdb <<'SQL'
SHOW cloudsql.logical_decoding;
SHOW wal_level;
SELECT name, setting FROM pg_settings WHERE name IN ('max_replication_slots','max_wal_senders','wal_sender_timeout') ORDER BY name;
SELECT * FROM pg_create_logical_replication_slot('e1_slot', 'pgoutput');
SELECT pg_drop_replication_slot('e1_slot');
SQL
  } | cap 03-enable.txt ;;

role)
  client_up
  { head_ "A role without the REPLICATION attribute"
    ( set -a; . "$SECRETS"; set +a; printf "DROP ROLE IF EXISTS cdc_user;\nCREATE USER cdc_user WITH PASSWORD '%s';\n" "$CDCPASS" ) | sqlq postgres appdb
    echo "CREATE USER cdc_user WITH PASSWORD '...';   -- run as postgres, password not shown"
    sql postgres appdb <<'SQL'
SELECT rolname, rolsuper, rolreplication FROM pg_roles WHERE rolname IN ('cdc_user', 'postgres') ORDER BY 1;
SQL
    echo; echo "# as cdc_user"
    sql cdc_user appdb <<'SQL'
SELECT * FROM pg_create_logical_replication_slot('e3_slot', 'pgoutput');
SELECT * FROM orders;
SQL
    repl cdc_user appdb "IDENTIFY_SYSTEM;"
    echo; echo "# as postgres: the statement Google documents"
    sql postgres appdb <<'SQL'
ALTER USER cdc_user WITH REPLICATION;
SELECT rolname, rolsuper, rolreplication FROM pg_roles WHERE rolname = 'cdc_user';
GRANT USAGE ON SCHEMA public TO cdc_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cdc_user;
SQL
    echo; echo "# as cdc_user again"
    sql cdc_user appdb <<'SQL'
SELECT * FROM pg_create_logical_replication_slot('e3_slot', 'pgoutput');
SELECT * FROM orders;
SELECT slot_name, plugin, slot_type, database, active FROM pg_replication_slots;
SELECT pg_drop_replication_slot('e3_slot');
SQL
    repl cdc_user appdb "IDENTIFY_SYSTEM;"
  } | cap 04-role.txt ;;

limits)
  client_up
  { head_ "max_replication_slots and max_wal_senders"
    sql postgres appdb <<'SQL'
SELECT name, setting FROM pg_settings WHERE name IN ('max_replication_slots','max_wal_senders') ORDER BY name;
SQL
    N=$(one "SHOW max_replication_slots" | tail -1); echo "# create slots until the server refuses (max_replication_slots = $N)"
    for i in $(seq 1 $(( N + 1 ))); do printf 'slot %2s: ' "$i"; one "SELECT slot_name FROM pg_create_logical_replication_slot('lim_$i', 'pgoutput')" | tr '\n' ' '; echo; done
    echo; echo "# one streaming connection per slot, then one more connection (max_wal_senders = $(one 'SHOW max_wal_senders' | tail -1))"
    one "CREATE PUBLICATION lim_pub FOR TABLE orders" >/dev/null
    for i in $(seq 1 "$N"); do docker exec -d "$C" sh -c 'pg_recvlogical -h "$1" -U postgres -d appdb -S "lim_$2" -o proto_version=1 -o publication_names=lim_pub --start -f /dev/null >/tmp/recv_$2.log 2>&1' sh "$H" "$i"; done
    sleep 20
    sql postgres appdb <<'SQL'
SELECT count(*) AS wal_senders FROM pg_stat_replication;
SELECT count(*) FILTER (WHERE active) AS active_slots, count(*) AS slots FROM pg_replication_slots;
SQL
    repl postgres appdb "IDENTIFY_SYSTEM;"
    echo "# the receivers that did not get a connection say:"; docker exec "$C" sh -c 'cat /tmp/recv_*.log 2>/dev/null | sort | uniq -c | head -5'
    docker exec "$C" sh -c 'pkill pg_recvlogical; sleep 3; true'
    echo; echo "# free one slot and ask again"
    sql postgres appdb <<'SQL'
SELECT pg_drop_replication_slot('lim_1');
SELECT slot_name FROM pg_create_logical_replication_slot('lim_again', 'pgoutput');
SQL
    one "SELECT count(pg_drop_replication_slot(slot_name)) FROM pg_replication_slots WHERE slot_name LIKE 'lim%'" >/dev/null; one "DROP PUBLICATION lim_pub" >/dev/null
    echo; echo "# raise both limits with flags"
    echo "\$ gcloud sql instances patch $INST --database-flags=cloudsql.logical_decoding=on,max_replication_slots=100000,max_wal_senders=100000"
    gc sql instances patch "$INST" --database-flags=cloudsql.logical_decoding=on,max_replication_slots=100000,max_wal_senders=100000 2>&1 | tail -4
    wait_runnable
    echo "\$ gcloud sql instances patch $INST --database-flags=cloudsql.logical_decoding=on,max_replication_slots=12,max_wal_senders=12"; t0=$(date +%s)
    gc sql instances patch "$INST" --database-flags=cloudsql.logical_decoding=on,max_replication_slots=12,max_wal_senders=12 2>&1 | tail -4
    wait_runnable; echo "$(stamp)  state RUNNABLE again after $(( $(date +%s) - t0 )) s"
    for i in 1 2 3 4 5 6; do [ "$(one 'SELECT 1' | tail -1)" = "1" ] && break; sleep 10; done
    sql postgres appdb <<'SQL'
SELECT name, setting FROM pg_settings WHERE name IN ('max_replication_slots','max_wal_senders','wal_level') ORDER BY name;
SQL
  } | cap 05-limits.txt ;;

plugins)
  client_up
  { head_ "Output plugins"
    sql postgres appdb <<'SQL'
SHOW output_plugin_libraries;
SELECT * FROM pg_create_logical_replication_slot('s_pgoutput', 'pgoutput');
SELECT * FROM pg_create_logical_replication_slot('s_test_decoding', 'test_decoding');
SELECT * FROM pg_create_logical_replication_slot('s_wal2json', 'wal2json');
SELECT * FROM pg_create_logical_replication_slot('s_decoderbufs', 'decoderbufs');
SELECT * FROM pg_create_logical_replication_slot('s_pglogical', 'pglogical_output');
SELECT slot_name, plugin FROM pg_replication_slots ORDER BY 1;
SELECT pg_drop_replication_slot(slot_name) FROM pg_replication_slots WHERE slot_name LIKE 's\_%';
ALTER SYSTEM SET output_plugin_libraries = pgoutput, test_decoding, wal2json, decoderbufs;
SQL
    echo; echo "# is there a flag for the list?"
    echo "\$ gcloud sql instances patch $INST --database-flags=...,output_plugin_libraries=..."
    gc sql instances patch "$INST" --database-flags="$(flags | tr ';' ',' | sed -E "s/\{'name': '([^']+)', 'value': '([^']+)'\}/\1=\2/g; s/ //g"),output_plugin_libraries=pgoutput" 2>&1 | tail -3
  } | cap 06-plugins.txt ;;

publication)
  client_up
  { head_ "The publication, slot and test statements of docs/connectors/postgres/setup/gcp.mdx"
    echo "# as postgres (member of cloudsqlsuperuser)"
    sql postgres appdb <<'SQL'
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
SQL
    sql postgres appdb <<'SQL'
SELECT pg_drop_replication_slot('olake_slot');
DROP PUBLICATION olake_publication;
SHOW statement_timeout;
SQL
  } | cap 07-publication.txt ;;

grant-postgres)
  client_up
  { head_ "The built-in postgres user has no REPLICATION attribute. It gives the attribute to itself."
    sql postgres appdb <<'SQL'
SELECT rolname, rolsuper, rolreplication FROM pg_roles WHERE rolname = 'postgres';
SELECT * FROM pg_create_logical_replication_slot('p_slot', 'pgoutput');
ALTER USER postgres WITH REPLICATION;
SELECT rolname, rolsuper, rolreplication FROM pg_roles WHERE rolname = 'postgres';
SQL
    echo "# a new session"
    sql postgres appdb <<'SQL'
SELECT * FROM pg_create_logical_replication_slot('p_slot', 'pgoutput');
SELECT pg_drop_replication_slot('p_slot');
SQL
    repl postgres appdb "IDENTIFY_SYSTEM;"
  } | cap 04b-grant-postgres.txt ;;

wal-level-repl)
  client_up
  { head_ "The flag off again, and a role that has the REPLICATION attribute"
    echo "\$ gcloud sql instances patch $INST --clear-database-flags"; t0=$(date +%s)
    gc sql instances patch "$INST" --clear-database-flags 2>&1 | tail -2
    wait_runnable; echo "$(stamp)  state RUNNABLE again after $(( $(date +%s) - t0 )) s; flags: $(flags)"
    for i in 1 2 3 4 5 6; do [ "$(one 'SELECT 1' | tail -1)" = "1" ] && break; sleep 10; done
    sql cdc_user appdb <<'SQL'
SHOW cloudsql.logical_decoding;
SHOW wal_level;
SELECT * FROM pg_create_logical_replication_slot('e1_slot', 'pgoutput');
SQL
    repl cdc_user appdb "IDENTIFY_SYSTEM;"
    repl cdc_user appdb "CREATE_REPLICATION_SLOT e1_repl_slot LOGICAL pgoutput;"
    echo; echo "\$ gcloud sql instances patch $INST --database-flags=cloudsql.logical_decoding=on"; t0=$(date +%s)
    gc sql instances patch "$INST" --database-flags=cloudsql.logical_decoding=on 2>&1 | tail -2
    wait_runnable; echo "$(stamp)  state RUNNABLE again after $(( $(date +%s) - t0 )) s; flags: $(flags)"
    for i in 1 2 3 4 5 6; do [ "$(one 'SELECT 1' | tail -1)" = "1" ] && break; sleep 10; done
    sql cdc_user appdb <<'SQL'
SHOW wal_level;
SELECT * FROM pg_create_logical_replication_slot('e1_slot', 'pgoutput');
SELECT pg_drop_replication_slot('e1_slot');
SQL
  } | cap 02b-wal-level-with-replication-role.txt ;;

delete)
  { echo "# $(stamp)  delete the instance"; gc sql instances delete "$INST" 2>&1 | tail -2; docker rm -f "$C" >/dev/null 2>&1; gc sql instances list --format='value(name,state)' | grep -c "^$INST" ; } | tee "$LOG/99-delete.txt" ;;
*) sed -n '2,15p' "$0" ;;
esac
