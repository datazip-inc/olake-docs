#!/bin/bash
# Amazon Aurora PostgreSQL: the prerequisites of logical replication, one at a time.
# Backs the "Managed services" section of docs/runbooks/postgres/enable-logical-replication.mdx
# and checks docs/connectors/postgres/setup/aurora.mdx against the live service.
#
#   ./run.sh defaults      settings and roles of a new instance with the default parameter values
#   ./run.sh wal-level     a logical slot while rds.logical_replication = 0, and the self-hosted fix
#   ./run.sh enable        rds.logical_replication = 1 in the cluster parameter group, reboot of the writer, check
#   ./run.sh role          a role without rds_replication, ALTER ROLE ... REPLICATION, the grant
#   ./run.sh publication   the publication and slot statements of the OLake Aurora guide
#   ./run.sh plugins       pgoutput, test_decoding, wal2json, decoderbufs, pglogical
#   ./run.sh timeout       wal_sender_timeout = 0 through the cluster parameter group
set -u
HERE=$(cd "$(dirname "$0")" && pwd); . "$HERE/../env.sh"; . "$HERE/../lib.sh"
C=${RB_CLIENT:-rbt-awsp-pg}; LOG="$HERE/logs${RB_LOGSUB:+/$RB_LOGSUB}"; mkdir -p "$LOG"
CL=$RB_APG; ID=${RB_APG}-1; PGROUP=rbtest-apg17
H=$(rb_cluster_endpoint "$CL")

# stderr is merged inside the container, so that an error stays next to its statement
sql()  { docker exec -i "$C" env -u PGPASSWORD -u PGUSER sh -c 'exec psql -h "$1" -U "$2" -d "$3" -X -a -q 2>&1' sh "$H" "$1" "$2"; }   # statements echoed
sqlq() { docker exec -i "$C" env -u PGPASSWORD -u PGUSER sh -c 'exec psql -h "$1" -U "$2" -d "$3" -X -q 2>&1' sh "$H" "$1" "$2"; }      # not echoed
repl() { echo "psql \"dbname=$2 user=$1 replication=database\" -c \"$3\""; docker exec -i "$C" env -u PGPASSWORD -u PGUSER sh -c 'exec psql "host=$1 dbname=$3 user=$2 replication=database" -X -q -c "$4" 2>&1' sh "$H" "$1" "$2" "$3"; }
cap()  { tee "$LOG/$1"; }
head_() { echo "# $1"; echo "# $(stamp), cluster $CL, writer $ID, $(aws rds describe-db-instances --db-instance-identifier "$ID" --query 'DBInstances[0].[Engine,EngineVersion,DBInstanceClass]' --output text | tr '\t' ' ')"; echo; }

case "${1:-}" in
defaults)
  { head_ "A new instance: settings and roles before anything is changed"
    sql "$RB_MASTER" appdb <<'SQL'
SELECT version();
SELECT name, setting, unit, context FROM pg_settings
WHERE name IN ('rds.logical_replication','wal_level','max_replication_slots','max_wal_senders','max_connections',
               'wal_sender_timeout','max_slot_wal_keep_size','idle_replication_slot_timeout','output_plugin_libraries',
               'max_wal_size','rds.force_ssl','shared_preload_libraries') ORDER BY name;
SELECT rolname, rolsuper, rolreplication, rolcreaterole FROM pg_roles WHERE rolname IN (current_user, 'rds_superuser', 'rds_replication', 'rdsadmin') ORDER BY 1;
SELECT r.rolname AS master_user_is_member_of FROM pg_auth_members m JOIN pg_roles r ON r.oid = m.roleid JOIN pg_roles u ON u.oid = m.member WHERE u.rolname = current_user ORDER BY 1;
SELECT slot_name FROM pg_replication_slots;
SQL
    echo; echo "# backups: $(aws rds describe-db-clusters --db-cluster-identifier "$CL" --query 'DBClusters[0].BackupRetentionPeriod' --output text) days of automated backups (Aurora does not accept 0)"
  } | cap 01-defaults.txt ;;

wal-level)
  { head_ "A logical slot while rds.logical_replication = 0"
    sql "$RB_MASTER" appdb <<'SQL'
CREATE TABLE IF NOT EXISTS orders (id int PRIMARY KEY, customer text, quantity int);
CREATE TABLE IF NOT EXISTS events_nopk (device_id int, reading numeric);
INSERT INTO orders VALUES (1, 'a', 1), (2, 'b', 2) ON CONFLICT DO NOTHING;
SHOW rds.logical_replication;
SHOW wal_level;
SELECT * FROM pg_create_logical_replication_slot('e1_slot', 'pgoutput');
-- the self-hosted fix
ALTER SYSTEM SET wal_level = logical;
SET wal_level = logical;
-- a publication can be created all the same
CREATE PUBLICATION e1_pub FOR TABLE orders;
DROP PUBLICATION e1_pub;
SQL
    echo; echo "# a replication connection for the master user in the same state"
    repl "$RB_MASTER" appdb "IDENTIFY_SYSTEM;"
    repl "$RB_MASTER" appdb "CREATE_REPLICATION_SLOT e1_repl_slot LOGICAL pgoutput;"
  } | cap 02-wal-level.txt ;;

enable)
  { head_ "rds.logical_replication = 1 in the custom DB cluster parameter group, then a reboot of the writer"
    echo "\$ aws rds modify-db-cluster-parameter-group --db-cluster-parameter-group-name $PGROUP --parameters ParameterName=rds.logical_replication,ParameterValue=1,ApplyMethod=pending-reboot"
    aws rds modify-db-cluster-parameter-group --db-cluster-parameter-group-name "$PGROUP" --parameters "ParameterName=rds.logical_replication,ParameterValue=1,ApplyMethod=pending-reboot" --output text
    for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
      st=$(aws rds describe-db-clusters --db-cluster-identifier "$CL" --query 'DBClusters[0].DBClusterMembers[0].DBClusterParameterGroupStatus' --output text)
      echo "$(stamp)  cluster parameter group status on the writer: $st"; [ "$st" = "pending-reboot" ] && break; sleep 10
    done
    echo; echo "# before the reboot"
    sql "$RB_MASTER" appdb <<'SQL'
SELECT name, setting, pending_restart FROM pg_settings WHERE name IN ('rds.logical_replication','wal_level','max_replication_slots','max_wal_senders','max_connections') ORDER BY name;
SQL
    echo; echo "\$ aws rds reboot-db-instance --db-instance-identifier $ID"; t0=$(date +%s)
    aws rds reboot-db-instance --db-instance-identifier "$ID" --query 'DBInstance.DBInstanceStatus' --output text
    sleep 15; aws rds wait db-instance-available --db-instance-identifier "$ID"; echo "$(stamp)  available again after $(( $(date +%s) - t0 )) s"
    echo; echo "# after the reboot (the checks from the OLake Aurora guide, step 2, and from the AWS page)"
    sql "$RB_MASTER" appdb <<'SQL'
SHOW rds.logical_replication;
SHOW wal_level;
SELECT name, setting, pending_restart FROM pg_settings WHERE name IN ('max_replication_slots','max_wal_senders','max_connections','wal_sender_timeout') ORDER BY name;
SELECT * FROM pg_create_logical_replication_slot('e1_slot', 'pgoutput');
SELECT pg_drop_replication_slot('e1_slot');
SQL
  } | cap 03-enable.txt ;;

role)
  { head_ "A role without rds_replication"
    ( set -a; . "$RB_SECRETS"; set +a; printf "DROP ROLE IF EXISTS cdc_user;\nCREATE ROLE cdc_user LOGIN PASSWORD '%s';\n" "$CDCPASS" ) | sqlq "$RB_MASTER" appdb
    echo "CREATE ROLE cdc_user LOGIN PASSWORD '...';   -- run as the master user, password not shown"
    sql "$RB_MASTER" appdb <<'SQL'
GRANT CONNECT ON DATABASE appdb TO cdc_user;
SELECT rolname, rolsuper, rolreplication FROM pg_roles WHERE rolname = 'cdc_user';
SQL
    echo; echo "# as cdc_user"
    sql cdc_user appdb <<'SQL'
SELECT * FROM pg_create_logical_replication_slot('e3_slot', 'pgoutput');
SELECT * FROM orders;
SQL
    repl cdc_user appdb "IDENTIFY_SYSTEM;"
    echo; echo "# as the master user: the self-hosted fix, then the RDS one"
    sql "$RB_MASTER" appdb <<'SQL'
ALTER ROLE cdc_user REPLICATION;
ALTER ROLE cdc_user WITH REPLICATION;
GRANT rds_replication TO cdc_user;
SELECT rolname, rolsuper, rolreplication FROM pg_roles WHERE rolname = 'cdc_user';
GRANT USAGE ON SCHEMA public TO cdc_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cdc_user;
SQL
    echo; echo "# as cdc_user again"
    sql cdc_user appdb <<'SQL'
SELECT * FROM pg_create_logical_replication_slot('e3_slot', 'pgoutput');
SELECT * FROM orders;
SELECT slot_name, plugin, slot_type, database, active FROM pg_replication_slots;
SQL
    repl cdc_user appdb "IDENTIFY_SYSTEM;"
    echo; echo "# a role with rds_replication can drop the slot too"
    sql cdc_user appdb <<'SQL'
SELECT pg_drop_replication_slot('e3_slot');
SQL
  } | cap 04-role.txt ;;

publication)
  { head_ "The publication, slot and test statements of docs/connectors/postgres/setup/aurora.mdx"
    echo "# as the master user (member of rds_superuser)"
    sql "$RB_MASTER" appdb <<'SQL'
CREATE PUBLICATION olake_publication FOR ALL TABLES;
SELECT pubname, puballtables, pubviaroot FROM pg_publication;
ALTER PUBLICATION olake_publication SET (publish_via_partition_root = true);
DROP PUBLICATION olake_publication;
CREATE PUBLICATION olake_publication FOR TABLES IN SCHEMA public;
DROP PUBLICATION olake_publication;
CREATE PUBLICATION olake_publication FOR TABLE public.orders;
SELECT pg_create_logical_replication_slot('olake_slot', 'pgoutput');
CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, data TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
ALTER TABLE test_table REPLICA IDENTITY DEFAULT;
ALTER PUBLICATION olake_publication ADD TABLE test_table;
INSERT INTO test_table (data) VALUES ('PostgreSQL pgoutput CDC test - INSERT');
SELECT lsn, xid, chr(get_byte(data, 0)) AS message FROM pg_logical_slot_peek_binary_changes('olake_slot', NULL, NULL, 'proto_version', '1', 'publication_names', 'olake_publication');
-- a table without a key in the publication
ALTER PUBLICATION olake_publication ADD TABLE events_nopk;
INSERT INTO events_nopk VALUES (1, 20.5);
UPDATE events_nopk SET reading = 22.0 WHERE device_id = 1;
DELETE FROM events_nopk WHERE device_id = 1;
ALTER PUBLICATION olake_publication DROP TABLE events_nopk;
SQL
    echo; echo "# as cdc_user (rds_replication, USAGE and SELECT only)"
    sql cdc_user appdb <<'SQL'
CREATE PUBLICATION cdc_user_pub FOR ALL TABLES;
CREATE PUBLICATION cdc_user_pub FOR TABLE public.orders;
SELECT count(*) AS messages FROM pg_logical_slot_peek_binary_changes('olake_slot', NULL, NULL, 'proto_version', '1', 'publication_names', 'olake_publication');
SQL
    echo; echo "# clean up"
    sql "$RB_MASTER" appdb <<'SQL'
SELECT pg_drop_replication_slot('olake_slot');
DROP PUBLICATION olake_publication;
DROP TABLE test_table;
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
  } | cap 06-plugins.txt ;;

timeout)
  { head_ "wal_sender_timeout = 0, as the OLake Aurora guide recommends"
    sql "$RB_MASTER" appdb <<'SQL'
SHOW wal_sender_timeout;
ALTER SYSTEM SET wal_sender_timeout = 0;
SQL
    echo "\$ aws rds modify-db-cluster-parameter-group --db-cluster-parameter-group-name $PGROUP --parameters ParameterName=wal_sender_timeout,ParameterValue=0,ApplyMethod=immediate"
    aws rds modify-db-cluster-parameter-group --db-cluster-parameter-group-name "$PGROUP" --parameters "ParameterName=wal_sender_timeout,ParameterValue=0,ApplyMethod=immediate" --output text
    for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
      v=$(echo "SHOW wal_sender_timeout;" | docker exec -i "$C" env -u PGPASSWORD -u PGUSER psql -h "$H" -U "$RB_MASTER" -d appdb -X -q -At 2>&1)
      echo "$(stamp)  SHOW wal_sender_timeout -> $v"; [ "$v" = "0" ] && break; sleep 10
    done
  } | cap 07-timeout.txt ;;
*) sed -n '2,13p' "$0" ;;
esac
