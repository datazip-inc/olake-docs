#!/usr/bin/env bash
# Lab: REPLICA IDENTITY, large (TOAST) values and what a change data capture (CDC) reader receives.
# The PostgreSQL steps read the changes straight from a pgoutput slot, the plugin built into PostgreSQL.
# The Debezium steps show what a Debezium PostgreSQL connector writes for the same changes.
#
#   ./run.sh up              start PostgreSQL (wal_level = logical) with the tables and the publication
#   ./run.sh storage         which values are stored out of line
#   ./run.sh confirm         the queries that find published tables, their identity and their large columns
#   ./run.sh default         REPLICA IDENTITY DEFAULT: an UPDATE that leaves large values alone, a DELETE
#   ./run.sh full            REPLICA IDENTITY FULL: the same changes
#   ./run.sh index           REPLICA IDENTITY USING INDEX: the same changes
#   ./run.sh nothing         REPLICA IDENTITY NOTHING on a table with a primary key
#   ./run.sh partitions      REPLICA IDENTITY FULL on a partitioned table
#   ./run.sh lock            the lock ALTER TABLE ... REPLICA IDENTITY takes, and how long it waits
#   ./run.sh wal             the WAL an UPDATE writes under DEFAULT and under FULL
#   ./run.sh consumer        what a consumer can do with the placeholder: write it, or keep the stored value
#   ./run.sh all             every step above in order, each captured under logs/postgres-<version>/
#
#   ./run.sh dbz-up          start Kafka and Kafka Connect, register a Debezium connector, read the snapshot
#   ./run.sh dbz-default     the same changes through Debezium, REPLICA IDENTITY DEFAULT
#   ./run.sh dbz-full        the same changes through Debezium, REPLICA IDENTITY FULL
#   ./run.sh dbz-placeholder unavailable.value.placeholder and toasted.value.placeholder
#   ./run.sh dbz-autoset     replica.identity.autoset.values
#   ./run.sh dbz-all         the Debezium steps in order, captured under logs/debezium-<version>-postgres-<version>/
#
#   ./run.sh down            remove everything
#
# Other versions:
#   PG_VERSION=13.23 ./run.sh all
#   PG_VERSION=13.23 DEBEZIUM_IMAGE=quay.io/debezium/connect:1.9.7.Final ./run.sh dbz-all
set -euo pipefail
cd "$(dirname "$0")"

export PG_VERSION="${PG_VERSION:-19.0}"
export DEBEZIUM_IMAGE="${DEBEZIUM_IMAGE:-quay.io/debezium/connect:3.7.1.Final}"
DBZ_VERSION="${DEBEZIUM_IMAGE##*:}"
DBZ_VERSION="${DBZ_VERSION%.Final}"
CONNECT="http://localhost:${CONNECT_PORT:-18314}"
SVC=pg

dc() { docker compose "$@"; }
# Run a command in the container with its two output streams merged there, so lines keep their order.
inside() { dc exec -T "$SVC" bash -c 'exec "$@" 2>&1' bash "$@"; }
# q DATABASE SQL: print the statement, then its result or its error.
q() { printf '%s\n' "$2"; inside timeout 150 psql -X -U postgres -d "$1" -c "$2" || true; }
# script DATABASE: run the SQL on stdin in one session. psql echoes each statement before its result.
script() { dc exec -T "$SVC" bash -c 'exec psql -X -e -U postgres -d "$0" 2>&1' "$1" || true; }
# qu ROLE DATABASE SQL: the same as another role.
qu() { printf '%s    -- as %s\n' "$3" "$1"; inside timeout 150 psql -X -U "$1" -d "$2" -c "$3" || true; }
# val DATABASE SQL: bare values, for the script itself.
val() { dc exec -T "$SVC" timeout 60 psql -X -U postgres -d "$1" -At -c "$2" 2>/dev/null || true; }
say() { printf '\n## %s\n' "$*"; }
pgnum() { val postgres "SHOW server_version_num"; }
has_setting() { [[ "$(val postgres "SELECT count(*) FROM pg_settings WHERE name = '$1'")" == 1 ]]; }

IDENTITY="SELECT c.relname, CASE c.relreplident WHEN 'd' THEN 'default' WHEN 'n' THEN 'nothing' WHEN 'f' THEN 'full' WHEN 'i' THEN 'index' END AS replica_identity
FROM pg_class c WHERE c.relname = 'documents';"

# changes SLOT: the pgoutput messages in a slot, consumed and printed by pgoutput.py.
changes() {
  echo "SELECT encode(data, 'hex') FROM pg_logical_slot_get_binary_changes('$1', NULL, NULL, 'proto_version', '1', 'publication_names', 'cdc_pub');    -- printed by pgoutput.py"
  val appdb "SELECT encode(data, 'hex') FROM pg_logical_slot_get_binary_changes('$1', NULL, NULL, 'proto_version', '1', 'publication_names', 'cdc_pub');" | python3 -I pgoutput.py
}
# textual SLOT: the test_decoding output of a slot. A quoted value longer than 40 characters is cut
# to its first 30 and three dots; chars is the length of the whole line before the cut.
textual() {
  q appdb "SELECT regexp_replace(data, ':''([^'']{30})[^'']{11,}''', ':''\1...''', 'g') AS data, length(data) AS chars
FROM pg_logical_slot_get_changes('$1', NULL, NULL) WHERE data NOT LIKE 'BEGIN%' AND data NOT LIKE 'COMMIT%';"
}
slots() {
  q appdb "SELECT * FROM pg_create_logical_replication_slot('pgo_slot', 'pgoutput');"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('td_slot', 'test_decoding');"
}
drop_slots() {
  local s
  for s in $(val postgres "SELECT slot_name FROM pg_replication_slots WHERE slot_name IN ('pgo_slot', 'td_slot')"); do
    val postgres "SELECT pg_drop_replication_slot('$s')" >/dev/null
  done
}
# The changes made in each identity step: an UPDATE of a small column, an UPDATE of a large one, a DELETE.
three_changes() {
  q appdb "UPDATE documents SET title = '$1 title' WHERE id = 1;"
  q appdb "UPDATE documents SET body = body || 'x' WHERE id = 1;"
  q appdb "DELETE FROM documents WHERE id = 2;"
}
restore_documents() {
  val appdb "DELETE FROM documents WHERE id = 2;
INSERT INTO documents
SELECT d, 'title ' || d,
       (SELECT string_agg(md5(d::text || g::text), '') FROM generate_series(1, 1000) g),
       (SELECT decode(string_agg(md5(d::text || g::text || 'b'), ''), 'hex') FROM generate_series(1, 1000) g),
       (SELECT jsonb_build_object('doc', d, 'text', string_agg(md5(d::text || g::text || 'j'), '')) FROM generate_series(1, 1000) g),
       (SELECT array_agg(md5(d::text || g::text || 't')) FROM generate_series(1, 1000) g),
       repeat('s', 100000)
FROM generate_series(2, 2) d;" >/dev/null
}

# ---- Debezium helpers
kafka() { dc exec -T -e KAFKA_HEAP_OPTS=-Xmx128m kafka /opt/kafka/bin/"$@" 2>/dev/null; }
connect_log() { dc logs --no-color --no-log-prefix connect 2>/dev/null; }
MARK=0
mark() { MARK=$(connect_log | wc -l | tr -d ' '); }
since_mark() { connect_log | tail -n +"$((MARK + 1))"; }
wait_log() { # pattern, seconds: wait for a connector log line written after the last mark
  local _
  for _ in $(seq 1 "$2"); do
    if [[ "$(since_mark | grep -cE "$1")" -gt 0 ]]; then return 0; fi
    sleep 1
  done
  echo "  (no log line matched /$1/ in $2 s)"
}
# wait_task SECONDS: wait until a task started after the last mark has begun streaming.
wait_task() {
  local _
  for _ in $(seq 1 "$1"); do
    if since_mark | awk '/Starting PostgresConnectorTask with configuration/ { s = 1 } s && /Searching for WAL resume position|Processing messages/ { f = 1 } END { exit !f }'; then
      return 0
    fi
    sleep 1
  done
  echo "  (no task started streaming in $1 s)"
}
state() {
  curl -s "$CONNECT/connectors/docs/status" |
    python3 -I -c 'import sys,json; d=json.load(sys.stdin); print("connector=%s tasks=[%s]" % (d["connector"]["state"], ",".join(t["state"] for t in d.get("tasks",[]))))' 2>/dev/null || echo "(no status)"
}
legacy() { [[ "$DBZ_VERSION" == 1.* ]]; }
# Seconds to let the connector settle. The 1.9 image is built for x86 and runs under emulation on Apple silicon.
SETTLE="${SETTLE:-$(legacy && echo 20 || echo 8)}"
# config [EXTRA_JSON]: the connector configuration, with optional extra properties.
config() {
  local naming
  if legacy; then naming='"database.server.name": "lab"'; else naming='"topic.prefix": "lab"'; fi
  cat <<EOF
{
  "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
  "database.hostname": "pg", "database.port": "5432", "database.user": "postgres", "database.password": "labpw",
  "database.dbname": "appdb", $naming,
  "plugin.name": "pgoutput", "slot.name": "dbz_slot", "publication.name": "cdc_pub", "publication.autocreate.mode": "disabled",
  "table.include.list": "public.documents", "snapshot.mode": "initial",
  "key.converter": "org.apache.kafka.connect.json.JsonConverter", "key.converter.schemas.enable": "false",
  "value.converter": "org.apache.kafka.connect.json.JsonConverter", "value.converter.schemas.enable": "false"${1:+, $1}
}
EOF
}
# put_config [EXTRA_JSON]: replace the configuration and wait for the restarted task.
put_config() {
  echo "\$ curl -X PUT $CONNECT/connectors/docs/config    (extra properties: ${1:-none})"
  mark
  curl -s -o /dev/null -w "HTTP %{http_code}\n" -X PUT -H 'Content-Type: application/json' --data "$(config "${1:-}")" "$CONNECT/connectors/docs/config"
  wait_task 240
  sleep "$SETTLE"
  state
}
# events LABEL: the events the connector wrote since the last read, printed by events.py.
events() {
  echo "\$ kafka-console-consumer.sh --topic lab.public.documents --group lab-reader    -- printed by events.py"
  sleep "$SETTLE"
  kafka kafka-console-consumer.sh --bootstrap-server kafka:9092 --topic lab.public.documents --group lab-reader \
    --consumer-property auto.offset.reset=earliest --timeout-ms 15000 |
    python3 -I events.py ${LOG:+--raw "$LOG/events-raw.jsonl"} || true
}
started_with() { # the lines of the task start since the last mark that name these properties
  echo "--- connector log: configuration at task start"
  since_mark | grep -E "[[:space:]]($1) = " | sed -E "s/.*[[:space:]](($1) = [^[:space:]]*).*/    \1/" | sort -u | grep . || echo "(no line)"
  echo "---"
}

case "${1:-}" in
up)
  dc up -d --wait --quiet-pull pg >/dev/null 2>&1 || { dc logs pg | tail -20; exit 1; }
  q postgres "SELECT version();"
  q postgres "SHOW wal_level;"
  q appdb "SELECT pubname, schemaname, tablename FROM pg_publication_tables ORDER BY tablename;"
  ;;
storage)
  say "The two rows of documents: four columns built from md5 output, and summary, 100,000 characters of one letter"
  q appdb "SELECT id, length(body) AS body_chars, pg_column_size(body) AS body_stored,
       length(attachment) AS attachment_bytes, pg_column_size(attachment) AS attachment_stored,
       pg_column_size(meta) AS meta_stored, pg_column_size(tags) AS tags_stored,
       length(summary) AS summary_chars, pg_column_size(summary) AS summary_stored
FROM documents ORDER BY id;"
  if has_setting default_toast_compression; then q postgres "SHOW default_toast_compression;"; fi
  say "The table's TOAST table, where values stored out of line are kept in chunks"
  q appdb "SELECT c.relname, t.relname AS toast_table FROM pg_class c JOIN pg_class t ON t.oid = c.reltoastrelid WHERE c.relname = 'documents';"
  toast="$(val appdb "SELECT t.relname FROM pg_class c JOIN pg_class t ON t.oid = c.reltoastrelid WHERE c.relname = 'documents'")"
  q appdb "SELECT count(DISTINCT chunk_id) AS values_out_of_line, count(*) AS chunks FROM pg_toast.$toast;"
  if [[ "$(pgnum)" -ge 170000 ]]; then
    say "PostgreSQL 17 and later: is each value stored out of line?"
    q appdb "SELECT id, pg_column_toast_chunk_id(body) IS NOT NULL AS body_out_of_line, pg_column_toast_chunk_id(attachment) IS NOT NULL AS attachment_out_of_line,
       pg_column_toast_chunk_id(meta) IS NOT NULL AS meta_out_of_line, pg_column_toast_chunk_id(tags) IS NOT NULL AS tags_out_of_line,
       pg_column_toast_chunk_id(summary) IS NOT NULL AS summary_out_of_line
FROM documents ORDER BY id;"
  fi
  ;;
confirm)
  say "Published tables, their replica identity, and whether they have a primary key"
  q appdb "SELECT p.pubname, c.oid::regclass AS table_name,
       CASE c.relreplident WHEN 'd' THEN 'default' WHEN 'n' THEN 'nothing' WHEN 'f' THEN 'full' WHEN 'i' THEN 'index' END AS replica_identity,
       EXISTS (SELECT 1 FROM pg_index i WHERE i.indrelid = c.oid AND i.indisprimary) AS has_primary_key
FROM pg_publication_tables p
JOIN pg_class c ON c.oid = format('%I.%I', p.schemaname, p.tablename)::regclass
ORDER BY p.pubname, table_name;"
  say "Columns of those tables whose values PostgreSQL may store out of line (every storage mode except p, plain)"
  q appdb "SELECT a.attrelid::regclass AS table_name, a.attname, a.atttypid::regtype AS type, a.attstorage
FROM pg_attribute a
WHERE a.attrelid IN (SELECT format('%I.%I', schemaname, tablename)::regclass FROM pg_publication_tables WHERE pubname = 'cdc_pub')
  AND a.attnum > 0 AND NOT a.attisdropped AND a.attstorage <> 'p'
ORDER BY 1, a.attnum;"
  ;;
default)
  drop_slots
  q appdb "$IDENTITY"
  slots
  say "An INSERT, then the three changes"
  q appdb "INSERT INTO documents SELECT 3, 'title 3', body, attachment, meta, tags, summary FROM documents WHERE id = 1;"
  three_changes second
  say "What pgoutput sent"
  changes pgo_slot
  say "What test_decoding sent for the same changes"
  textual td_slot
  drop_slots
  q appdb "DELETE FROM documents WHERE id = 3;"
  restore_documents
  ;;
full)
  drop_slots
  q appdb "ALTER TABLE documents REPLICA IDENTITY FULL;"
  q appdb "$IDENTITY"
  slots
  three_changes third
  say "What pgoutput sent"
  changes pgo_slot
  say "What test_decoding sent for the same changes"
  textual td_slot
  drop_slots
  q appdb "ALTER TABLE documents REPLICA IDENTITY DEFAULT;"
  restore_documents
  ;;
index)
  drop_slots
  say "A unique index on a NOT NULL column, named as the replica identity"
  q appdb "CREATE UNIQUE INDEX documents_title_key ON documents (title);"
  q appdb "ALTER TABLE documents REPLICA IDENTITY USING INDEX documents_title_key;"
  q appdb "$IDENTITY"
  slots
  three_changes fourth
  say "What pgoutput sent"
  changes pgo_slot
  drop_slots
  q appdb "ALTER TABLE documents REPLICA IDENTITY DEFAULT;"
  q appdb "DROP INDEX documents_title_key;"
  restore_documents
  ;;
nothing)
  say "REPLICA IDENTITY NOTHING on a table that has a primary key and is in a publication"
  q appdb "ALTER TABLE documents REPLICA IDENTITY NOTHING;"
  q appdb "$IDENTITY"
  q appdb "INSERT INTO documents (id, title) VALUES (4, 'title 4');"
  q appdb "UPDATE documents SET title = 'fifth title' WHERE id = 1;"
  q appdb "DELETE FROM documents WHERE id = 4;"
  say "Back to DEFAULT, which uses the primary key"
  q appdb "ALTER TABLE documents REPLICA IDENTITY DEFAULT;"
  q appdb "UPDATE documents SET title = 'fifth title' WHERE id = 1;"
  q appdb "DELETE FROM documents WHERE id = 4;"
  ;;
partitions)
  drop_slots
  PARTS="SELECT c.relname, c.relkind, CASE c.relreplident WHEN 'd' THEN 'default' WHEN 'n' THEN 'nothing' WHEN 'f' THEN 'full' WHEN 'i' THEN 'index' END AS replica_identity
FROM pg_class c WHERE c.relname LIKE 'measurements%' AND c.relkind IN ('r', 'p') ORDER BY c.relname;"
  say "Set FULL on the partitioned table"
  q appdb "ALTER TABLE measurements REPLICA IDENTITY FULL;"
  q appdb "$PARTS"
  say "A partition created afterwards"
  q appdb "CREATE TABLE measurements_apac PARTITION OF measurements FOR VALUES IN ('apac');"
  q appdb "$PARTS"
  say "An UPDATE and a DELETE in a partition"
  q appdb "SELECT * FROM pg_create_logical_replication_slot('pgo_slot', 'pgoutput');"
  q appdb "UPDATE measurements SET reading = 11 WHERE id = 1 AND region = 'eu';"
  q appdb "DELETE FROM measurements WHERE id = 2 AND region = 'us';"
  changes pgo_slot
  say "FULL on each partition"
  q appdb "ALTER TABLE measurements_eu REPLICA IDENTITY FULL;"
  q appdb "ALTER TABLE measurements_us REPLICA IDENTITY FULL;"
  q appdb "ALTER TABLE measurements_apac REPLICA IDENTITY FULL;"
  q appdb "$PARTS"
  q appdb "INSERT INTO measurements VALUES (2, 'us', 20);"
  q appdb "UPDATE measurements SET reading = 12 WHERE id = 1 AND region = 'eu';"
  q appdb "DELETE FROM measurements WHERE id = 2 AND region = 'us';"
  changes pgo_slot
  drop_slots
  ;;
lock)
  say "The lock the statement takes, seen from inside its own transaction, and whether it rewrites the table"
  script appdb <<'SQL'
SELECT pg_relation_filenode('orders') AS filenode_before;
BEGIN;
ALTER TABLE orders REPLICA IDENTITY FULL;
SELECT locktype, mode, granted FROM pg_locks WHERE relation = 'orders'::regclass AND pid = pg_backend_pid();
ROLLBACK;
\timing on
ALTER TABLE orders REPLICA IDENTITY FULL;
ALTER TABLE orders REPLICA IDENTITY DEFAULT;
\timing off
SELECT pg_relation_filenode('orders') AS filenode_after, count(*) AS order_rows FROM orders;
SQL
  say "A long read holds the table open. The ALTER, from another session, with lock_timeout = 2s:"
  echo '$ psql -c "BEGIN; SELECT count(*) FROM orders; SELECT pg_sleep(12); COMMIT;" &    (a long read)'
  dc exec -T -d "$SVC" psql -X -U postgres -d appdb -c "BEGIN; SELECT count(*) FROM orders; SELECT pg_sleep(12); COMMIT;"
  sleep 1
  script appdb <<'SQL'
SET lock_timeout = '2s';
ALTER TABLE orders REPLICA IDENTITY FULL;
SQL
  say "The ALTER again without lock_timeout, in the background, then a short read from a third session with lock_timeout = 2s"
  echo '$ psql -c "ALTER TABLE orders REPLICA IDENTITY FULL" &    (no lock_timeout)'
  dc exec -T -d "$SVC" psql -X -U postgres -d appdb -c "ALTER TABLE orders REPLICA IDENTITY FULL;"
  sleep 1
  script appdb <<'SQL'
SET lock_timeout = '2s';
SELECT count(*) FROM orders WHERE id = 1;
RESET lock_timeout;
SELECT pid, wait_event_type, wait_event, pg_blocking_pids(pid) AS blocked_by, left(query, 60) AS query
FROM pg_stat_activity WHERE datname = 'appdb' AND pid <> pg_backend_pid() AND state <> 'idle' ORDER BY backend_start;
SQL
  sleep 11
  q appdb "$IDENTITY"
  q appdb "SELECT relname, CASE relreplident WHEN 'd' THEN 'default' WHEN 'f' THEN 'full' END AS replica_identity FROM pg_class WHERE relname = 'orders';"
  q appdb "ALTER TABLE orders REPLICA IDENTITY DEFAULT;"
  say "A role that does not own the table, such as a capture role"
  q appdb "CREATE ROLE cdc_user LOGIN REPLICATION;"
  q appdb "GRANT SELECT ON ALL TABLES IN SCHEMA public TO cdc_user;"
  qu cdc_user appdb "ALTER TABLE documents REPLICA IDENTITY FULL;"
  q appdb "DROP OWNED BY cdc_user;"
  q appdb "DROP ROLE cdc_user;"
  ;;
wal)
  say "WAL written by one UPDATE of 10,000 small rows, and by one UPDATE of a small column in a row with large values."
  say "Each UPDATE runs twice and the second is measured, so pages written in full after a checkpoint do not count."
  script appdb <<'SQL'
CHECKPOINT;
ALTER TABLE orders REPLICA IDENTITY DEFAULT;
UPDATE orders SET status = 'warm' WHERE id <= 10000;
SELECT pg_current_wal_lsn() AS start_lsn \gset
UPDATE orders SET status = 'paid' WHERE id <= 10000;
SELECT 'orders, DEFAULT' AS change, pg_wal_lsn_diff(pg_current_wal_lsn(), :'start_lsn') AS wal_bytes;
ALTER TABLE orders REPLICA IDENTITY FULL;
UPDATE orders SET status = 'warm' WHERE id <= 10000;
SELECT pg_current_wal_lsn() AS start_lsn \gset
UPDATE orders SET status = 'paid' WHERE id <= 10000;
SELECT 'orders, FULL' AS change, pg_wal_lsn_diff(pg_current_wal_lsn(), :'start_lsn') AS wal_bytes;
ALTER TABLE orders REPLICA IDENTITY DEFAULT;
ALTER TABLE documents REPLICA IDENTITY DEFAULT;
UPDATE documents SET title = 'warm' WHERE id = 1;
SELECT pg_current_wal_lsn() AS start_lsn \gset
UPDATE documents SET title = 'measured' WHERE id = 1;
SELECT 'documents, DEFAULT' AS change, pg_wal_lsn_diff(pg_current_wal_lsn(), :'start_lsn') AS wal_bytes;
ALTER TABLE documents REPLICA IDENTITY FULL;
UPDATE documents SET title = 'warm' WHERE id = 1;
SELECT pg_current_wal_lsn() AS start_lsn \gset
UPDATE documents SET title = 'measured' WHERE id = 1;
SELECT 'documents, FULL' AS change, pg_wal_lsn_diff(pg_current_wal_lsn(), :'start_lsn') AS wal_bytes;
ALTER TABLE documents REPLICA IDENTITY DEFAULT;
SQL
  ;;
consumer)
  say "A jsonb column cannot store the text Debezium writes for an unchanged jsonb value"
  q appdb "SELECT '__debezium_unavailable_value'::jsonb;"
  say "A target table, and one UPDATE event as the Debezium runs delivered it: a new title, the placeholder for the four large values"
  script appdb <<'SQL'
CREATE TABLE documents_target (LIKE documents INCLUDING ALL);
INSERT INTO documents_target SELECT * FROM documents;
CREATE TABLE incoming (id bigint, title text, body text, attachment text, meta text, tags text[]);
INSERT INTO incoming VALUES (1, 'new title', '__debezium_unavailable_value',
  'X19kZWJleml1bV91bmF2YWlsYWJsZV92YWx1ZQ==', '__debezium_unavailable_value', '{__debezium_unavailable_value}');
SQL
  say "Applied as it arrived: the placeholder replaces the stored value"
  script appdb <<'SQL'
UPDATE documents_target t SET title = i.title, body = i.body, attachment = decode(i.attachment, 'base64'), tags = i.tags
FROM incoming i WHERE t.id = i.id;
SELECT id, title, left(body, 40) AS body, convert_from(attachment, 'UTF8') AS attachment, tags FROM documents_target WHERE id = 1;
SELECT count(*) AS rows_with_placeholder FROM documents_target WHERE body = '__debezium_unavailable_value';
SQL
  say "Applied with a rule that keeps the stored value when the placeholder arrives"
  script appdb <<'SQL'
TRUNCATE documents_target;
INSERT INTO documents_target SELECT * FROM documents;
UPDATE documents_target t SET
  title      = i.title,
  body       = CASE WHEN i.body = '__debezium_unavailable_value' THEN t.body ELSE i.body END,
  attachment = CASE WHEN i.attachment = 'X19kZWJleml1bV91bmF2YWlsYWJsZV92YWx1ZQ==' THEN t.attachment ELSE decode(i.attachment, 'base64') END,
  meta       = CASE WHEN i.meta = '__debezium_unavailable_value' THEN t.meta ELSE i.meta::jsonb END,
  tags       = CASE WHEN i.tags = '{__debezium_unavailable_value}' THEN t.tags ELSE i.tags END
FROM incoming i WHERE t.id = i.id;
SELECT t.id, t.title, t.body = d.body AS body_kept, t.attachment = d.attachment AS attachment_kept,
       t.meta = d.meta AS meta_kept, t.tags = d.tags AS tags_kept
FROM documents_target t JOIN documents d USING (id) WHERE t.id = 1;
DROP TABLE documents_target, incoming;
SQL
  ;;
all)
  log="logs/postgres-$PG_VERSION"
  mkdir -p "$log"
  rm -f "$log"/*.txt
  n=0
  for step in up storage confirm default full index nothing partitions lock wal consumer; do
    n=$((n + 1))
    file="$log/$(printf '%02d' "$n")-$step.txt"
    echo "== $step -> $file"
    { echo "# ./run.sh $step    PostgreSQL $PG_VERSION    $(date -u +%Y-%m-%dT%H:%M:%SZ)"; "$0" "$step"; } > "$file" 2>&1 < /dev/null || echo "   (step exited with an error, see the file)"
  done
  "$0" down
  ;;

# ---- Debezium
dbz-up)
  dc up -d --wait --quiet-pull pg kafka connect >/dev/null 2>&1 || { dc logs connect | tail -20; exit 1; }
  for _ in $(seq 1 300); do curl -sf "$CONNECT/connectors" >/dev/null && break; sleep 1; done
  q postgres "SELECT version();"
  echo "\$ curl $CONNECT/"
  curl -s "$CONNECT/"; echo
  echo "\$ curl -X POST $CONNECT/connectors    (connector docs, plugin.name = pgoutput, table.include.list = public.documents)"
  mark
  curl -s -o /dev/null -w "HTTP %{http_code}\n" -X POST -H 'Content-Type: application/json' \
    --data "{\"name\": \"docs\", \"config\": $(config)}" "$CONNECT/connectors"
  wait_log 'Searching for WAL resume position|streaming|Processing messages' 180
  sleep 5
  state
  echo "--- connector log: replica identity"
  since_mark | grep -E "REPLICA IDENTITY" | sed -E 's/^[0-9-]+ [0-9:,]+ //' | sort -u || echo "(no line)"
  echo "---"
  say "The snapshot reads the rows from the table, so every value is there."
  events
  ;;
dbz-default)
  q appdb "$IDENTITY"
  three_changes second
  events
  restore_documents
  events >/dev/null
  ;;
dbz-full)
  mark
  q appdb "ALTER TABLE documents REPLICA IDENTITY FULL;"
  q appdb "$IDENTITY"
  three_changes third
  events
  echo "--- connector log since the last mark: replica identity, warnings"
  since_mark | grep -E "REPLICA IDENTITY|WARN" | sed -E 's/^[0-9-]+ [0-9:,]+ //' | cut -c1-300 | sort -u | head -20 || echo "(no line)"
  echo "---"
  q appdb "ALTER TABLE documents REPLICA IDENTITY DEFAULT;"
  restore_documents
  events >/dev/null
  ;;
dbz-placeholder)
  say "unavailable.value.placeholder set to a value of our own"
  put_config '"unavailable.value.placeholder": "__lab_unavailable__"'
  started_with 'unavailable.value.placeholder|toasted.value.placeholder'
  q appdb "UPDATE documents SET title = 'sixth title' WHERE id = 1;"
  events
  say "toasted.value.placeholder, the older name, set instead"
  put_config '"toasted.value.placeholder": "__lab_toasted__"'
  started_with 'unavailable.value.placeholder|toasted.value.placeholder'
  q appdb "UPDATE documents SET title = 'seventh title' WHERE id = 1;"
  events
  say "Back to the defaults"
  put_config
  ;;
dbz-autoset)
  say "replica.identity.autoset.values asks the connector to set the identity when it starts."
  q appdb "$IDENTITY"
  put_config '"replica.identity.autoset.values": "public.documents:FULL"'
  started_with 'replica.identity.autoset.values'
  echo "--- connector log since the last mark: replica identity"
  since_mark | grep -E -i "replica identity" | sed -E 's/^[0-9-]+ [0-9:,]+ //' | cut -c1-300 | sort -u || echo "(no line)"
  echo "---"
  q appdb "$IDENTITY"
  q appdb "UPDATE documents SET title = 'eighth title' WHERE id = 1;"
  events
  q appdb "ALTER TABLE documents REPLICA IDENTITY DEFAULT;"
  ;;
dbz-all)
  LOG="logs/debezium-$DBZ_VERSION-postgres-$PG_VERSION"
  export LOG
  mkdir -p "$LOG"
  rm -f "$LOG"/*.txt "$LOG"/*.jsonl
  n=0
  for step in dbz-up dbz-default dbz-full dbz-placeholder dbz-autoset; do
    n=$((n + 1))
    file="$LOG/$(printf '%02d' "$n")-$step.txt"
    echo "== $step -> $file"
    { echo "# ./run.sh $step    Debezium $DBZ_VERSION, PostgreSQL $PG_VERSION    $(date -u +%Y-%m-%dT%H:%M:%SZ)"; "$0" "$step"; } > "$file" 2>&1 < /dev/null || echo "   (step exited with an error, see the file)"
  done
  connect_log | grep -E "Kafka Connect worker initialization|Kafka version|PostgresConnectorTask|REPLICA IDENTITY|ERROR|WARN" | cut -c1-400 > "$LOG/connect-log-excerpt.txt" || true
  "$0" down
  ;;
down)
  dc down -v --remove-orphans
  ;;
*)
  sed -n '2,31p' "$0"
  exit 1
  ;;
esac
