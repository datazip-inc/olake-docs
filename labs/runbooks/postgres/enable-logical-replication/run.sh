#!/usr/bin/env bash
# Lab: turn on logical replication for change data capture (CDC) on a self-hosted PostgreSQL.
# Each step leaves one prerequisite out, shows the error, then applies the fix.
#
#   ./run.sh up            start PostgreSQL with its defaults (wal_level = replica)
#   ./run.sh wal-level     logical decoding without wal_level = logical; the fix needs a restart
#   ./run.sh limits        max_replication_slots and max_wal_senders: "all replication slots are in use"
#   ./run.sh role          a role without REPLICATION, table privileges, and pg_hba.conf
#   ./run.sh publication   create and check a publication; publication "x" does not exist
#   ./run.sh identity      UPDATE and DELETE on a published table without a key; REPLICA IDENTITY
#   ./run.sh verify        the whole chain as the capture role, then clean up
#   ./run.sh plugin        pgoutput is built in; wal2json and decoderbufs have to be installed and allowed
#   ./run.sh all           every step in order, each captured under logs/postgres-<version>/
#   ./run.sh down          remove everything
#
# The plugin step comes last: it installs packages from apt.postgresql.org, and on an image that is
# not on the newest minor release that also replaces the server binaries.
#
# Another version:  PG_VERSION=13.23 ./run.sh all
set -euo pipefail
cd "$(dirname "$0")"

export PG_VERSION="${PG_VERSION:-18.7}"
SVC=pg

dc() { docker compose "$@"; }
# Run a command in the container with its two output streams merged there, so lines keep their order.
inside() { dc exec -T "$SVC" bash -c 'exec "$@" 2>&1' bash "$@"; }
# q DATABASE SQL: run as the superuser. Print the statement, then its result or its error.
q() { printf '%s\n' "$2"; inside timeout 150 psql -X -U postgres -d "$1" -c "$2" || true; }
# qu ROLE DATABASE SQL: the same as another role.
qu() { printf '%s    -- as %s\n' "$3" "$1"; inside timeout 150 psql -X -U "$1" -d "$2" -c "$3" || true; }
# val DATABASE SQL: one bare value, for the script itself.
val() { dc exec -T "$SVC" timeout 60 psql -X -U postgres -d "$1" -At -c "$2" 2>/dev/null || true; }
say() { printf '\n## %s\n' "$*"; }
pgnum() { val postgres "SHOW server_version_num"; }
has_setting() { [[ "$(val postgres "SELECT count(*) FROM pg_settings WHERE name = '$1'")" == 1 ]]; }

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
restart() {
  echo '$ docker compose restart pg'
  dc restart pg >/dev/null 2>&1
  local i
  for i in $(seq 1 60); do
    if dc exec -T "$SVC" pg_isready -h 127.0.0.1 -U postgres >/dev/null 2>&1; then return 0; fi
    sleep 1
  done
  echo "(the server did not come back within 60 s)"
  dc logs --no-log-prefix --since "$STEP_START" "$SVC" 2>&1 | tail -15
}
reload() { q postgres "SELECT pg_reload_conf();"; sleep 1; }
drop_all_slots() {
  signal TERM pg_recvlogical >/dev/null 2>&1 || true
  sleep 1
  local s
  for s in $(val postgres "SELECT slot_name FROM pg_replication_slots"); do
    val postgres "SELECT pg_drop_replication_slot('$s')" >/dev/null
  done
}
# signal NAME PROCESS: send a signal to every process with that name inside the container.
signal() {
  dc exec -T "$SVC" bash -c 'for p in /proc/[0-9]*; do if [ "$(cat "$p/comm" 2>/dev/null)" = "$1" ]; then kill "-$0" "${p#/proc/}"; fi; done' "$1" "$2" || true
}
peek() { # slot, publication: the pgoutput messages waiting in a slot, one letter each
  echo "pg_logical_slot_peek_binary_changes('$1', NULL, NULL, 'proto_version', '1', 'publication_names', '$2')"
}
SLOTS="SELECT slot_name, plugin, slot_type, database, active FROM pg_replication_slots ORDER BY slot_name;"

case "${1:-}" in
up)
  dc up -d --wait --quiet-pull pg >/dev/null 2>&1 || { dc logs pg | tail -20; exit 1; }
  q postgres "SELECT version();"
  q postgres "SELECT name, setting, source, context FROM pg_settings
WHERE name IN ('wal_level', 'effective_wal_level', 'max_replication_slots', 'max_wal_senders', 'wal_sender_timeout',
               'output_plugin_libraries')
ORDER BY name;"
  ;;
wal-level)
  say "The default"
  q appdb "SHOW wal_level;"
  say "Ask for logical decoding, from SQL and over the replication protocol"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  echo '$ pg_recvlogical -d appdb --slot cdc_slot_2 --create-slot -P pgoutput'
  inside pg_recvlogical -U postgres -d appdb --slot cdc_slot_2 --create-slot -P pgoutput || true
  q postgres "$SLOTS"
  if has_setting effective_wal_level; then q postgres "SHOW effective_wal_level;"; fi
  serverlog 'ERROR:|HINT:|DETAIL:'
  drop_all_slots
  if has_setting effective_wal_level; then q postgres "SHOW effective_wal_level;"; fi
  say "A publication can be created at this level. Some versions answer with a warning."
  q appdb "CREATE PUBLICATION early_pub FOR TABLE orders;"
  q appdb "DROP PUBLICATION early_pub;"
  say "Change the setting and reload: it does not take effect."
  q postgres "ALTER SYSTEM SET wal_level = logical;"
  reload
  q postgres "SHOW wal_level;"
  q postgres "SELECT name, setting, context, pending_restart FROM pg_settings WHERE name = 'wal_level';"
  q postgres "SET wal_level = logical;"
  serverlog 'wal_level|cannot be changed'
  say "Restart the server."
  restart
  q postgres "SHOW wal_level;"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  q appdb "SELECT pg_drop_replication_slot('cdc_slot');"
  if has_setting effective_wal_level; then
    say "This version has effective_wal_level. The same request with wal_level = minimal:"
    q postgres "ALTER SYSTEM SET wal_level = minimal;"
    q postgres "ALTER SYSTEM SET max_wal_senders = 0;"
    restart
    q postgres "SELECT name, setting FROM pg_settings WHERE name IN ('wal_level', 'effective_wal_level', 'max_wal_senders') ORDER BY name;"
    q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
    q postgres "ALTER SYSTEM SET wal_level = logical;"
    q postgres "ALTER SYSTEM RESET max_wal_senders;"
    restart
    q postgres "SELECT name, setting FROM pg_settings WHERE name IN ('wal_level', 'effective_wal_level', 'max_wal_senders') ORDER BY name;"
  fi
  ;;
limits)
  drop_all_slots
  q postgres "SELECT name, setting, context FROM pg_settings WHERE name IN ('max_replication_slots', 'max_wal_senders') ORDER BY name;"
  say "Lower both limits to 2, to reach them with three requests. Both need a restart."
  q postgres "ALTER SYSTEM SET max_replication_slots = 2;"
  q postgres "ALTER SYSTEM SET max_wal_senders = 2;"
  restart
  q postgres "SELECT name, setting FROM pg_settings WHERE name IN ('max_replication_slots', 'max_wal_senders') ORDER BY name;"
  say "Slots: the third one is refused."
  q appdb "SELECT * FROM pg_create_logical_replication_slot('slot_1', 'pgoutput');"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('slot_2', 'pgoutput');"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('slot_3', 'pgoutput');"
  q postgres "$SLOTS"
  say "Senders: two replication connections are open (each sleeps 12 s). The third one is refused."
  echo '$ psql "dbname=appdb replication=database" -c "SELECT pg_sleep(12)" &    (twice)'
  dc exec -T -d "$SVC" psql -X -U postgres "dbname=appdb replication=database" -c "SELECT pg_sleep(12)"
  dc exec -T -d "$SVC" psql -X -U postgres "dbname=appdb replication=database" -c "SELECT pg_sleep(12)"
  sleep 2
  q postgres "SELECT pid, backend_type, state FROM pg_stat_activity WHERE backend_type = 'walsender' ORDER BY pid;"
  echo '$ psql "dbname=appdb replication=database" -c "IDENTIFY_SYSTEM"'
  inside psql -X -U postgres "dbname=appdb replication=database" -c "IDENTIFY_SYSTEM" || true
  serverlog 'FATAL|all replication slots|HINT'
  sleep 12
  say "Fix: drop slots that nothing uses, or raise the limits and restart."
  q appdb "SELECT pg_drop_replication_slot('slot_1');"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('slot_3', 'pgoutput');"
  q postgres "ALTER SYSTEM RESET max_replication_slots;"
  q postgres "ALTER SYSTEM RESET max_wal_senders;"
  restart
  q postgres "SELECT name, setting FROM pg_settings WHERE name IN ('max_replication_slots', 'max_wal_senders') ORDER BY name;"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('slot_4', 'pgoutput');"
  drop_all_slots
  ;;
role)
  drop_all_slots
  say "A login role without the REPLICATION attribute"
  q appdb "CREATE ROLE cdc_user LOGIN PASSWORD 'cdcpw';"
  q appdb "SELECT rolname, rolsuper, rolreplication FROM pg_roles WHERE rolname = 'cdc_user';"
  qu cdc_user appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  echo '$ psql "dbname=appdb user=cdc_user replication=database" -c "IDENTIFY_SYSTEM"'
  inside psql -X "dbname=appdb user=cdc_user replication=database" -c "IDENTIFY_SYSTEM" || true
  say "Fix: give the role the attribute."
  q appdb "ALTER ROLE cdc_user REPLICATION;"
  q appdb "SELECT rolname, rolsuper, rolreplication FROM pg_roles WHERE rolname = 'cdc_user';"
  qu cdc_user appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  echo '$ psql "dbname=appdb user=cdc_user replication=database" -c "IDENTIFY_SYSTEM"'
  inside psql -X "dbname=appdb user=cdc_user replication=database" -c "IDENTIFY_SYSTEM" || true
  say "The attribute lets the role use slots. Reading tables for the first copy is a separate privilege."
  qu cdc_user appdb "SELECT count(*) FROM orders;"
  q appdb "GRANT USAGE ON SCHEMA public TO cdc_user;"
  q appdb "GRANT SELECT ON ALL TABLES IN SCHEMA public TO cdc_user;"
  q appdb "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO cdc_user;"
  qu cdc_user appdb "SELECT count(*) FROM orders;"
  say "pg_hba.conf: which rows match a connection from another host"
  q postgres "SELECT line_number, type, database, user_name, address, auth_method FROM pg_hba_file_rules ORDER BY line_number;"
  ip="$(dc exec -T "$SVC" hostname -i | tr -d '\r' | awk '{print $1}')"
  echo "\$ psql \"host=$ip dbname=appdb user=cdc_user replication=database\" -c \"IDENTIFY_SYSTEM\"    (a logical replication connection)"
  inside env PGPASSWORD=cdcpw psql -X "host=$ip dbname=appdb user=cdc_user replication=database" -c "IDENTIFY_SYSTEM" || true
  echo "\$ psql \"host=$ip dbname=appdb user=cdc_user replication=true\" -c \"IDENTIFY_SYSTEM\"    (a physical replication connection)"
  inside env PGPASSWORD=cdcpw psql -X "host=$ip dbname=appdb user=cdc_user replication=true" -c "IDENTIFY_SYSTEM" || true
  serverlog 'FATAL:|ERROR:|DETAIL:  Only roles'
  q appdb "SELECT pg_drop_replication_slot('cdc_slot');"
  ;;
publication)
  drop_all_slots
  say "The capture role tries to create the publication itself."
  qu cdc_user appdb "CREATE PUBLICATION cdc_pub FOR TABLE orders;"
  q appdb "GRANT CREATE ON DATABASE appdb TO cdc_user;"
  qu cdc_user appdb "CREATE PUBLICATION cdc_pub FOR ALL TABLES;"
  qu cdc_user appdb "CREATE PUBLICATION cdc_pub FOR TABLE orders;"
  q appdb "REVOKE CREATE ON DATABASE appdb FROM cdc_user;"
  say "An administrator creates it, and checks it."
  q appdb "CREATE PUBLICATION cdc_pub FOR TABLE orders, documents;"
  q appdb "SELECT pubname, puballtables, pubinsert, pubupdate, pubdelete, pubtruncate FROM pg_publication;"
  q appdb "SELECT pubname, schemaname, tablename FROM pg_publication_tables WHERE pubname = 'cdc_pub' ORDER BY tablename;"
  say "Syntax that depends on the version"
  q appdb "CREATE PUBLICATION schema_pub FOR TABLES IN SCHEMA public;"
  q appdb "DROP PUBLICATION IF EXISTS schema_pub;"
  q appdb "CREATE PUBLICATION root_pub FOR TABLE orders WITH (publish_via_partition_root = true);"
  q appdb "DROP PUBLICATION IF EXISTS root_pub;"
  say "A slot, one change, and a consumer that asks for a publication name that does not exist"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  q appdb "INSERT INTO orders (customer_id, status) VALUES (10, 'new');"
  q appdb "SELECT count(*) FROM $(peek cdc_slot cdc_publication);"
  q appdb "SELECT count(*) FROM $(peek cdc_slot cdc_pub);"
  serverlog 'ERROR:|WARNING:|HINT:|CONTEXT:|DETAIL:  The publication'
  say "Over the replication protocol the consumer connects without an error. It fails at the first change."
  q appdb "SELECT * FROM pg_create_logical_replication_slot('typo_slot', 'pgoutput');"
  echo '$ pg_recvlogical -d appdb --slot typo_slot --start -o proto_version=1 -o publication_names=cdc_publication -f /dev/null --no-loop &'
  dc exec -T -d "$SVC" bash -c ": > /tmp/consumer.log; pg_recvlogical -U postgres -d appdb --slot typo_slot --start -o proto_version=1 -o publication_names=cdc_publication -f /dev/null --no-loop >> /tmp/consumer.log 2>&1"
  sleep 3
  q postgres "$SLOTS"
  q appdb "INSERT INTO orders (customer_id, status) VALUES (11, 'new');"
  sleep 3
  echo "--- consumer output"
  dc exec -T "$SVC" cat /tmp/consumer.log || true
  echo "---"
  q postgres "$SLOTS"
  say "A slot that is older than its publication"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('early_slot', 'pgoutput');"
  q appdb "INSERT INTO orders (customer_id, status) VALUES (12, 'new');"
  q appdb "CREATE PUBLICATION late_pub FOR TABLE orders;"
  q appdb "SELECT pubname FROM pg_publication ORDER BY pubname;"
  q appdb "SELECT count(*) FROM $(peek early_slot late_pub);"
  q appdb "INSERT INTO orders (customer_id, status) VALUES (13, 'new');"
  q appdb "SELECT count(*) FROM $(peek early_slot late_pub);"
  serverlog 'ERROR:|WARNING:|HINT:|CONTEXT:|DETAIL:  The publication'
  say "Fix: the publication first, then the slot."
  q appdb "SELECT pg_drop_replication_slot('early_slot');"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('early_slot', 'pgoutput');"
  q appdb "INSERT INTO orders (customer_id, status) VALUES (14, 'new');"
  q appdb "SELECT lsn, xid, chr(get_byte(data, 0)) AS message FROM $(peek early_slot late_pub);"
  drop_all_slots
  q appdb "DROP PUBLICATION late_pub;"
  ;;
plugin)
  drop_all_slots
  major="$(val postgres "SELECT current_setting('server_version_num')::int / 10000")"
  libdir="$(val postgres "SELECT setting FROM pg_config WHERE name = 'PKGLIBDIR'")"
  listing="ls $libdir | grep -E 'pgoutput|test_decoding|wal2json|decoderbufs'"
  say "The output plugins that ship with PostgreSQL"
  echo "\$ $listing"
  dc exec -T "$SVC" bash -c "$listing" || true
  q postgres "SHOW output_plugin_libraries;"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('s_pgoutput', 'pgoutput');"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('s_test_decoding', 'test_decoding');"
  say "Plugins that are not part of PostgreSQL"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('s_wal2json', 'wal2json');"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('s_decoderbufs', 'decoderbufs');"
  serverlog 'ERROR:|DETAIL:  The configuration|HINT:'
  if has_setting output_plugin_libraries; then
    say "This version only loads the plugins named in output_plugin_libraries. First the list as one quoted string:"
    q postgres "ALTER SYSTEM SET output_plugin_libraries = 'pgoutput, test_decoding, wal2json, decoderbufs';"
    reload
    q postgres "SHOW output_plugin_libraries;"
    q appdb "SELECT * FROM pg_create_logical_replication_slot('s_wal2json', 'wal2json');"
    q appdb "SELECT * FROM pg_create_logical_replication_slot('s_pgoutput_2', 'pgoutput');"
    serverlog 'ERROR:|DETAIL:  The configuration|HINT:'
    say "With ALTER SYSTEM each name is its own value. Now the plugins are allowed, and still not installed."
    q postgres "ALTER SYSTEM SET output_plugin_libraries = pgoutput, test_decoding, wal2json, decoderbufs;"
    reload
    q postgres "SHOW output_plugin_libraries;"
    q appdb "SELECT * FROM pg_create_logical_replication_slot('s_pgoutput_2', 'pgoutput');"
    q appdb "SELECT * FROM pg_create_logical_replication_slot('s_wal2json', 'wal2json');"
    q appdb "SELECT * FROM pg_create_logical_replication_slot('s_decoderbufs', 'decoderbufs');"
  fi
  for plugin in wal2json decoderbufs; do
    say "Install $plugin from the PostgreSQL apt repository (this image is Debian). No restart."
    echo "\$ apt-get update && apt-get install -y postgresql-$major-$plugin"
    dc exec -T -u root "$SVC" bash -c "apt-get update -qq 2>&1 | tail -3; DEBIAN_FRONTEND=noninteractive apt-get install -y -qq --no-install-recommends postgresql-$major-$plugin 2>&1 | grep -a -E '^E:|Unable|Setting up postgresql' ; dpkg-query -W -f='installed: \${Package} \${Version}\n' postgresql-$major-$plugin 2>&1" || true
    echo "\$ $listing"
    dc exec -T "$SVC" bash -c "$listing" || true
    q appdb "SELECT * FROM pg_create_logical_replication_slot('s_$plugin', '$plugin');"
  done
  running="$(val postgres "SHOW server_version" | awk '{print $1}')"
  packaged="$(dc exec -T "$SVC" dpkg-query -W -f='${Version}' "postgresql-$major" 2>/dev/null | tr -d '\r' || true)"
  echo "server running: $running    server package on disk: postgresql-$major $packaged"
  if [[ "$packaged" != "$running"-* && "$packaged" != "${running/rc/~rc}"-* ]]; then
    say "The package manager replaced the server files under the running server. Libraries are loaded again after a restart."
    q appdb "SELECT * FROM pg_create_logical_replication_slot('s_test_decoding_2', 'test_decoding');"
    restart
    q postgres "SELECT version();"
    q appdb "SELECT * FROM pg_create_logical_replication_slot('s_wal2json', 'wal2json');"
    q appdb "SELECT * FROM pg_create_logical_replication_slot('s_decoderbufs', 'decoderbufs');"
  fi
  q postgres "$SLOTS"
  say "One change, read through each plugin that has a slot"
  q appdb "UPDATE orders SET status = 'paid' WHERE id = 1;"
  q appdb "SELECT data FROM pg_logical_slot_peek_changes('s_test_decoding', NULL, NULL);"
  q appdb "SELECT data FROM pg_logical_slot_peek_changes('s_wal2json', NULL, NULL);"
  q appdb "SELECT lsn, xid, chr(get_byte(data, 0)) AS message FROM $(peek s_pgoutput cdc_pub);"
  q appdb "SELECT count(*) AS messages, sum(length(data)) AS bytes FROM pg_logical_slot_peek_binary_changes('s_decoderbufs', NULL, NULL);"
  drop_all_slots
  if has_setting output_plugin_libraries; then
    q postgres "ALTER SYSTEM RESET output_plugin_libraries;"
    reload
    q postgres "SHOW output_plugin_libraries;"
  fi
  ;;
identity)
  drop_all_slots
  say "A table without a primary key joins the publication. Nothing complains."
  q appdb "ALTER PUBLICATION cdc_pub ADD TABLE events_nopk;"
  q appdb "SELECT c.relname, CASE c.relreplident WHEN 'd' THEN 'default' WHEN 'n' THEN 'nothing' WHEN 'f' THEN 'full' WHEN 'i' THEN 'index' END AS replica_identity,
       EXISTS (SELECT 1 FROM pg_index i WHERE i.indrelid = c.oid AND i.indisprimary) AS has_primary_key
FROM pg_class c WHERE c.relname IN ('orders', 'events_nopk', 'documents') ORDER BY c.relname;"
  say "Inserts work. Updates and deletes on that table now fail for every session."
  q appdb "INSERT INTO events_nopk VALUES (3, 19.0, 'third');"
  q appdb "UPDATE events_nopk SET reading = 22.0 WHERE device_id = 1;"
  q appdb "DELETE FROM events_nopk WHERE device_id = 2;"
  say "Fix 1: REPLICA IDENTITY FULL"
  q appdb "ALTER TABLE events_nopk REPLICA IDENTITY FULL;"
  q appdb "UPDATE events_nopk SET reading = 22.0 WHERE device_id = 1;"
  q appdb "DELETE FROM events_nopk WHERE device_id = 2;"
  say "Fix 2: a primary key, with the default identity"
  q appdb "ALTER TABLE events_nopk REPLICA IDENTITY DEFAULT;"
  q appdb "UPDATE events_nopk SET reading = 23.0 WHERE device_id = 1;"
  q appdb "ALTER TABLE events_nopk ADD PRIMARY KEY (device_id);"
  q appdb "UPDATE events_nopk SET reading = 23.0 WHERE device_id = 1;"
  say "Fix 3: a unique index on NOT NULL columns, named as the replica identity"
  q appdb "ALTER TABLE events_nopk DROP CONSTRAINT events_nopk_pkey;"
  q appdb "UPDATE events_nopk SET reading = 24.0 WHERE device_id = 1;"
  q appdb "CREATE UNIQUE INDEX events_nopk_device ON events_nopk (device_id);"
  q appdb "ALTER TABLE events_nopk REPLICA IDENTITY USING INDEX events_nopk_device;"
  q appdb "UPDATE events_nopk SET reading = 24.0 WHERE device_id = 1;"
  say "What a consumer receives. The test_decoding plugin is used here because its output is text."
  q appdb "SELECT * FROM pg_create_logical_replication_slot('peek_slot', 'test_decoding');"
  q appdb "UPDATE orders SET status = 'paid' WHERE id = 1;"
  q appdb "DELETE FROM orders WHERE id = 2;"
  q appdb "SELECT data FROM pg_logical_slot_get_changes('peek_slot', NULL, NULL);"
  q appdb "ALTER TABLE orders REPLICA IDENTITY FULL;"
  q appdb "UPDATE orders SET status = 'shipped' WHERE id = 1;"
  q appdb "DELETE FROM orders WHERE id = 3;"
  q appdb "SELECT data FROM pg_logical_slot_get_changes('peek_slot', NULL, NULL);"
  say "A large value that an UPDATE does not touch is left out of the change."
  q appdb "SELECT id, title, length(body) AS body_chars, pg_column_size(body) AS stored_bytes FROM documents;"
  q appdb "UPDATE documents SET title = 'second title' WHERE id = 1;"
  q appdb "SELECT left(data, 150) AS data FROM pg_logical_slot_get_changes('peek_slot', NULL, NULL);"
  q appdb "ALTER TABLE documents REPLICA IDENTITY FULL;"
  q appdb "UPDATE documents SET title = 'third title' WHERE id = 1;"
  q appdb "SELECT CASE WHEN length(data) > 240 THEN left(data, 110) || ' ... ' || right(data, 100) ELSE data END AS data, length(data) AS chars
FROM pg_logical_slot_get_changes('peek_slot', NULL, NULL);"
  q appdb "SELECT pg_drop_replication_slot('peek_slot');"
  ;;
verify)
  drop_all_slots
  say "Every prerequisite at once"
  q appdb "SELECT current_setting('wal_level') AS wal_level,
       (SELECT rolreplication FROM pg_roles WHERE rolname = 'cdc_user') AS role_can_replicate,
       (SELECT count(*) FROM pg_publication_tables WHERE pubname = 'cdc_pub') AS published_tables,
       current_setting('max_replication_slots') AS max_replication_slots,
       current_setting('max_wal_senders') AS max_wal_senders;"
  say "The capture role creates its slot, three changes are made, and the role reads them."
  qu cdc_user appdb "SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');"
  q appdb "INSERT INTO orders (customer_id, status) VALUES (20, 'new');"
  q appdb "UPDATE orders SET status = 'paid' WHERE customer_id = 20;"
  q appdb "DELETE FROM orders WHERE customer_id = 20;"
  qu cdc_user appdb "SELECT lsn, xid, chr(get_byte(data, 0)) AS message FROM $(peek cdc_slot cdc_pub);"
  say "Clean up. A slot that is left behind keeps WAL."
  qu cdc_user appdb "SELECT pg_drop_replication_slot('cdc_slot');"
  q postgres "$SLOTS"
  ;;
all)
  log="logs/postgres-$PG_VERSION"
  mkdir -p "$log"
  rm -f "$log"/*.txt
  n=0
  for step in up wal-level limits role publication identity verify plugin; do
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
  sed -n '2,19p' "$0"
  exit 1
  ;;
esac
