#!/usr/bin/env bash
# Lab: Kafka Connect cannot find a connector class.
#
#   ./run.sh fetch        download the plugin archives and lay out ./work
#   ./run.sh up           start Kafka, PostgreSQL and a Kafka Connect worker that has no plugin.path
#   ./run.sh missing      create the connector: "Failed to find any class that implements Connector"
#   ./run.sh wrong-level  plugin.path points at the folder that holds the jars
#   ./run.sh half         a plugin folder with one jar missing, two variants
#   ./run.sh fixed        plugin.path points at the parent of the plugin folder: the connector runs
#   ./run.sh typo         a wrong class name while the plugin is installed
#   ./run.sh lost         the plugin goes missing under a connector that already exists
#   ./run.sh no-restart   copy the plugin back while the worker runs, then restart
#   ./run.sh hub          Confluent Hub: the archive layout, then the confluent-hub client
#   ./run.sh converter    a converter class that is not installed, then installed from Confluent Hub
#   ./run.sh discovery    plugin.discovery=service_load with a plugin that has no manifest
#   ./run.sh other-java   a plugin built for a newer Java than the worker runs (old worker only)
#   ./run.sh class-version  the class file version of the plug-in jars (needs no containers)
#   ./run.sh all          every step above that applies to this worker, in this order
#   ./run.sh down         remove the containers (./work stays; delete it by hand)
#
# Old worker, Kafka Connect 3.2.0 on Java 11 (amd64 image, slow to start on Apple silicon):
#   export LEGACY=1 CONNECT_IMAGE=quay.io/debezium/connect:1.9 KAFKA_DIR=/kafka POSTGRES_IMAGE=postgres:13
#   export CONNECT_LOG4J_OPTS=-Dlog4j.configuration=file:/kafka/config.orig/connect-log4j.properties
#   ./run.sh fetch && ./run.sh up && ./run.sh all && ./run.sh down
#
# Set LOG_DIR=logs/<folder> to keep the responses and log lines of a run.
set -eu
cd "$(dirname "$0")"

CONNECT="http://localhost:${CONNECT_PORT:-18083}"
LEGACY="${LEGACY:-0}"
LOG_DIR="${LOG_DIR:-}"
KAFKA_DIR="${KAFKA_DIR:-/opt/kafka}"
CLASS=io.debezium.connector.postgresql.PostgresConnector
MAVEN=https://repo1.maven.org/maven2/io/debezium/debezium-connector-postgres
HUB=https://hub-downloads.confluent.io/api/plugins
if [[ "$LEGACY" == 1 ]]; then
  DBZ="${DBZ:-1.9.7.Final}"; OTHER_DBZ="${OTHER_DBZ:-3.7.1.Final}"
  HUB_DBZ="${HUB_DBZ:-2.5.4-3}"; HUB_AVRO=""
else
  DBZ="${DBZ:-3.7.1.Final}"; OTHER_DBZ="${OTHER_DBZ:-1.9.7.Final}"
  HUB_DBZ="${HUB_DBZ:-3.2.6-4}"; HUB_AVRO="${HUB_AVRO:-8.4.1}"
fi
MARK=0

step() { printf '\n== %s\n' "$*"; }
save() { # file name: copy stdin to the terminal and, when LOG_DIR is set, to a file
  if [[ -n "$LOG_DIR" ]]; then mkdir -p "$LOG_DIR"; tee "$LOG_DIR/$1" | cut -c1-900; else cut -c1-900; fi
}
connect_log() { docker compose logs --no-color --no-log-prefix connect 2>/dev/null; }
mark() { MARK=$(connect_log | wc -l | tr -d ' '); }
since_mark() { connect_log | tail -n +"$((MARK + 1))"; }
wait_rest() { curl -sf --retry 150 --retry-delay 2 --retry-all-errors -o /dev/null "$CONNECT/connector-plugins"; }

# The worker configuration. The first argument is the value of plugin.path ("" leaves the
# property out, as the connect-distributed.properties that ships with Kafka does); further
# arguments are extra lines.
worker_props() {
  mkdir -p work
  {
    cat <<EOF
bootstrap.servers=kafka:9092
group.id=lab-plugins
key.converter=org.apache.kafka.connect.json.JsonConverter
value.converter=org.apache.kafka.connect.json.JsonConverter
config.storage.topic=lab_plugins_configs
offset.storage.topic=lab_plugins_offsets
status.storage.topic=lab_plugins_statuses
config.storage.replication.factor=1
offset.storage.replication.factor=1
status.storage.replication.factor=1
offset.flush.interval.ms=10000
listeners=http://0.0.0.0:8083
EOF
    [[ -n "$1" ]] && echo "plugin.path=$1"
    shift
    for line in "$@"; do echo "$line"; done
  } > work/worker.properties
  if grep -qE '^plugin\.path=' work/worker.properties; then
    echo "  worker: $(grep -E '^plugin\.(path|discovery)=' work/worker.properties | tr '\n' ' ')"
  else
    echo "  worker: plugin.path is not set"
  fi
}
restart_worker() { mark; docker compose restart connect > /dev/null 2>&1; wait_rest; }
plugins() { # the connector plugins the worker loaded, one per line
  curl -s "$CONNECT/connector-plugins" |
    python3 -c 'import sys,json
for p in json.load(sys.stdin): print("  %-62s %-7s %s" % (p["class"], p.get("type",""), p.get("version","")))'
}
listed() { # class name: is it in GET /connector-plugins?connectorsOnly=false
  if curl -s "$CONNECT/connector-plugins?connectorsOnly=false" | grep -q "\"$1\""; then echo "  $1: listed"; else echo "  $1: NOT listed"; fi
}
connector_json() { # connector name, connector.class, key=value ...
  python3 - "$@" <<'PY'
import json, sys
name, klass, extra = sys.argv[1], sys.argv[2], sys.argv[3:]
c = {
    "connector.class": klass, "tasks.max": "1",
    "database.hostname": "postgres", "database.port": "5432",
    "database.user": "postgres", "database.password": "postgrespw",
    "database.dbname": "inventory", "plugin.name": "pgoutput",
    "topic.prefix": "lab", "database.server.name": "lab",
    "table.include.list": "public.customers",
}
for kv in extra:
    k, _, v = kv.partition("=")
    c[k] = v
print(json.dumps({"name": name, "config": c}))
PY
}
create() { # connector name, connector.class, key=value ...: POST it and print the answer
  local out code
  out="$(curl -s -w '\n%{http_code}' -X POST -H 'Content-Type: application/json' --data "$(connector_json "$@")" "$CONNECT/connectors")"
  code="${out##*$'\n'}"
  echo "POST /connectors with connector.class=$2: HTTP $code"
  echo "${out%$'\n'*}"
}
state() {
  curl -s "$CONNECT/connectors/$1/status" |
    python3 -c 'import sys,json; d=json.load(sys.stdin); print("  connector=%s tasks=[%s]" % (d["connector"]["state"], ",".join(t["state"] for t in d.get("tasks",[]))))' 2>/dev/null || true
}
wait_running() { # connector name, seconds
  for _ in $(seq 1 "$2"); do
    if [[ "$(state "$1")" == *"tasks=[RUNNING]"* ]]; then break; fi
    sleep 1
  done
  state "$1"
}
trace() { # connector name: the exception lines of a failed task, without stack frames
  curl -s "$CONNECT/connectors/$1/status" | python3 -c 'import sys,json
for t in json.load(sys.stdin).get("tasks",[]):
    for l in t.get("trace","").splitlines():
        if not l.startswith("\tat ") and not l.startswith("\t..."): print("  "+l[:400])' 2>/dev/null || true
}
remove() { curl -s -o /dev/null -X DELETE "$CONNECT/connectors/$1"; sleep 3; }
scan_log() { # what the worker said about plugins since the last restart
  since_mark | grep -E "$1" | grep -vE '^\s+at ' | cut -c1-700 | head -"${2:-6}"
}
problems() { # every WARN and ERROR line since the last restart, without two lines every start-up has
  local out
  out="$(since_mark | grep -E '\] (WARN|ERROR) ' | grep -vE "isn't a known config|were supplied but are not used yet|ServiceLoader manifests" | cut -c1-330 | head -8)"
  if [[ -n "$out" ]]; then echo "$out"; else echo "  (no WARN or ERROR line in the worker log since the restart)"; fi
}
download() { # url, file under work/downloads
  mkdir -p work/downloads
  if [[ ! -s "work/downloads/$2" ]]; then
    printf '  GET %s: ' "$1"
    curl -s -L --retry 4 --retry-delay 3 --retry-all-errors --max-time 300 -o "work/downloads/$2" -w '%{http_code}\n' "$1" ||
      { rm -f "work/downloads/$2"; echo "download failed"; return 1; }
  fi
}
unpack_debezium() { # version, target folder: the archive unpacks to <target>/debezium-connector-postgres
  download "$MAVEN/$1/debezium-connector-postgres-$1-plugin.tar.gz" "debezium-connector-postgres-$1-plugin.tar.gz"
  rm -rf "work/$2"; mkdir -p "work/$2"
  tar -xzf "work/downloads/debezium-connector-postgres-$1-plugin.tar.gz" -C "work/$2"
}

fetch() {
  step "Debezium PostgreSQL plugin $DBZ from Maven Central, unpacked as the archive ships it"
  unpack_debezium "$DBZ" plugins
  ls work/plugins/debezium-connector-postgres | grep '\.jar$' | sed 's/^/  work\/plugins\/debezium-connector-postgres\//' | save 00-plugin-layout.txt

  step "Two half-installed copies"
  unpack_debezium "$DBZ" half-core
  rm -f work/half-core/debezium-connector-postgres/debezium-core-*.jar work/half-core/debezium-connector-postgres/debezium-connector-common-*.jar
  unpack_debezium "$DBZ" half-driver
  rm -f work/half-driver/debezium-connector-postgres/postgresql-*.jar
  echo "  half-core: without $(cd work/plugins/debezium-connector-postgres && ls debezium-core-*.jar debezium-connector-common-*.jar 2>/dev/null | tr '\n' ' ')"
  echo "  half-driver: without $(cd work/plugins/debezium-connector-postgres && ls postgresql-*.jar)"

  step "The plugin of the other Debezium generation, $OTHER_DBZ"
  unpack_debezium "$OTHER_DBZ" other-version
  rm -rf work/late work/hub-zip work/hub-components work/hub-client work/with-converter
  mkdir -p work/late work/hub-zip work/hub-components work/hub-client

  step "Confluent Hub: the connector archive, the Avro converter archive and the client"
  download "$HUB/debezium/debezium-connector-postgresql/versions/$HUB_DBZ/debezium-debezium-connector-postgresql-$HUB_DBZ.zip" "debezium-debezium-connector-postgresql-$HUB_DBZ.zip"
  # The converter step is skipped on the old worker, whose image already carries an Avro converter.
  [[ "$LEGACY" == 1 ]] || download "$HUB/confluentinc/kafka-connect-avro-converter/versions/$HUB_AVRO/confluentinc-kafka-connect-avro-converter-$HUB_AVRO.zip" "confluentinc-kafka-connect-avro-converter-$HUB_AVRO.zip"
  download "https://client.hub.confluent.io/confluent-hub-client-latest.tar.gz" confluent-hub-client-latest.tar.gz
  tar -xzf work/downloads/confluent-hub-client-latest.tar.gz -C work/hub-client
  (cd work/downloads && ls -l | awk 'NR>1 {print "  " $5 " bytes  " $NF}')
  worker_props ""
}

missing() {
  step "No plugin.path: what the worker loaded"
  worker_props ""; restart_worker
  plugins | save 01-missing-plugins.txt
  step "Create the connector"
  create inventory-connector "$CLASS" | save 01-missing-create.txt
  { since_mark | grep -E 'Failed to find any class' | head -1 | cut -c1-400; echo "  lines in the worker log with this message: $(since_mark | grep -c 'Failed to find any class' || true)"; } | save 01-missing-log.txt
}

wrong_level() {
  step "plugin.path points at the folder that holds the jars"
  worker_props /lab/plugins/debezium-connector-postgres; restart_worker
  listed "$CLASS" | save 02-wrong-level-listed.txt
  scan_log 'debezium-connector-postgres-[0-9A-Za-z.]+\.jar|NoClassDefFoundError|ClassNotFoundException|Failed to discover|Skipping' 8 | save 02-wrong-level-log.txt || true
  problems | save 02-wrong-level-warnings.txt
  create inventory-connector "$CLASS" | save 02-wrong-level-create.txt
}

half() {
  step "Half-installed 1: a Debezium jar the connector class extends is missing"
  worker_props /lab/half-core; restart_worker
  listed "$CLASS" | save 03-half-core-listed.txt
  problems | save 03-half-core-warnings.txt
  create inventory-connector "$CLASS" | save 03-half-core-create.txt

  step "Half-installed 2: the JDBC driver jar is missing"
  worker_props /lab/half-driver; restart_worker
  listed "$CLASS" | save 03-half-driver-listed.txt
  problems | save 03-half-driver-warnings.txt
  create inventory-connector "$CLASS" | save 03-half-driver-create.txt
  sleep 8
  { state inventory-connector; trace inventory-connector
    since_mark | grep -E 'NoClassDefFoundError|ClassNotFoundException' | grep -vE '^\s+at ' | sort | uniq -c | sort -rn | cut -c1-400 | head -4; } | save 03-half-driver-after-create.txt
  remove inventory-connector
}

fixed() {
  step "plugin.path points at the parent of the plugin folder"
  worker_props /lab/plugins; restart_worker
  plugins | save 04-fixed-plugins.txt
  scan_log 'Loading plugin from: /lab|Registered loader: PluginClassLoader|Added plugin .io.debezium.connector.postgresql.PostgresConnector' 8 |
    awk '{k=$0; sub(/^\[[^]]*\] /,"",k)} !seen[k]++' | save 04-fixed-log.txt || true
  create inventory-connector "$CLASS" | save 04-fixed-create.txt
  wait_running inventory-connector 90 | save 04-fixed-state.txt
}

typo() {
  step "The plugin is installed and the class name is wrong"
  create typo-connector io.debezium.connector.postgres.PostgresConnector | save 05-typo-create.txt
  step "The short name of the class"
  create alias-connector PostgresConnector slot.name=alias_slot topic.prefix=alias database.server.name=alias | cut -c1-300 | save 05-alias-create.txt
  { wait_running alias-connector 45; trace alias-connector; } | save 05-alias-state.txt
  remove alias-connector
}

lost() {
  step "The plugin disappears from plugin.path under a connector that exists"
  rm -rf work/late; mkdir -p work/late
  worker_props /lab/late; restart_worker
  sleep 10
  curl -s "$CONNECT/connectors/inventory-connector/status" | python3 -m json.tool | save 06-lost-status.json
  scan_log 'Failed to find any class|Failed to start connector|Couldn.t instantiate' 3 | save 06-lost-log.txt || true
}

no_restart() {
  step "An empty folder on plugin.path"
  listed "$CLASS"
  step "Copy the plugin in while the worker runs, wait 30 seconds"
  cp -R work/plugins/debezium-connector-postgres work/late/
  sleep 30
  listed "$CLASS" | save 07-no-restart-before.txt
  step "Restart the worker"
  restart_worker
  listed "$CLASS" | save 07-no-restart-after.txt
  sleep 10; state inventory-connector | save 07-no-restart-connector-state.txt
}

hub() {
  local dir="debezium-debezium-connector-postgresql-$HUB_DBZ"
  remove inventory-connector
  step "Confluent Hub archive $HUB_DBZ, unzipped under plugin.path"
  rm -rf work/hub-zip; mkdir -p work/hub-zip
  unzip -q "work/downloads/$dir.zip" -d work/hub-zip
  (cd work/hub-zip && find . -maxdepth 2 | sort | sed 's/^/  /' | head -12) | save 08-hub-zip-layout.txt
  worker_props /lab/hub-zip; restart_worker
  plugins | grep -i debezium | save 08-hub-zip-plugins.txt || echo "  no Debezium plugin listed" | save 08-hub-zip-plugins.txt
  scan_log 'UnsupportedClassVersionError|NoClassDefFoundError|Failed to discover' 3 || true

  step "The same archive with plugin.path set to its lib folder"
  worker_props "/lab/hub-zip/$dir/lib"; restart_worker
  listed "$CLASS" | save 08-hub-zip-lib-listed.txt

  step "The confluent-hub client, on a worker file that has no plugin.path"
  rm -rf work/hub-components; mkdir -p work/hub-components
  worker_props ""
  docker compose exec -T connect /lab/hub-client/bin/confluent-hub install --no-prompt \
    --component-dir /lab/hub-components --worker-configs /lab/worker.properties \
    "debezium/debezium-connector-postgresql:$HUB_DBZ" 2>&1 | sed 's/^/  /' | save 08-hub-client-output.txt
  echo "  worker file now: $(grep -E '^plugin\.path' work/worker.properties || echo 'no plugin.path line')" | save 08-hub-client-worker-file.txt
  ls work/hub-components | sed 's/^/  work\/hub-components\//'
  restart_worker
  plugins | grep -i debezium | save 08-hub-client-plugins.txt || echo "  no Debezium plugin listed" | save 08-hub-client-plugins.txt
}

converter() {
  local dir="confluentinc-kafka-connect-avro-converter-$HUB_AVRO"
  step "A converter class that the worker does not have"
  rm -rf work/with-converter; mkdir -p work/with-converter
  cp -R work/plugins/debezium-connector-postgres work/with-converter/
  worker_props /lab/with-converter; restart_worker
  listed io.confluent.connect.avro.AvroConverter | save 09-converter-before-listed.txt
  create avro-connector "$CLASS" value.converter=io.confluent.connect.avro.AvroConverter value.converter.schema.registry.url=http://schema-registry:8081 | save 09-converter-before-create.txt

  step "Install the converter archive from Confluent Hub next to the connector, restart"
  unzip -q "work/downloads/$dir.zip" -d work/with-converter
  ls work/with-converter | sed 's/^/  work\/with-converter\//'
  restart_worker
  listed io.confluent.connect.avro.AvroConverter | save 09-converter-after-listed.txt
  curl -s -X PUT -H 'Content-Type: application/json' \
    --data "$(connector_json avro-connector "$CLASS" name=avro-connector value.converter=io.confluent.connect.avro.AvroConverter value.converter.schema.registry.url=http://schema-registry:8081 | python3 -c 'import sys,json; print(json.dumps(json.load(sys.stdin)["config"]))')" \
    "$CONNECT/connector-plugins/PostgresConnector/config/validate" |
    python3 -c 'import sys,json
d = json.load(sys.stdin)
print("  validate: error_count=%s" % d.get("error_count"))
for c in d.get("configs", []):
    if c["value"].get("errors"): print("  %s: %s" % (c["value"]["name"], c["value"]["errors"]))' | save 09-converter-after-validate.txt
}

discovery() {
  if [[ "$LEGACY" == 1 ]]; then
    step "plugin.discovery on a worker older than Kafka Connect 3.6"
    worker_props /lab/plugins plugin.discovery=service_load; restart_worker
    listed "$CLASS" | save 10-discovery-old-worker-listed.txt
    scan_log 'plugin.discovery' 2 | save 10-discovery-old-worker-log.txt || true
    return 0
  fi
  step "A plugin without ServiceLoader manifests (Debezium $OTHER_DBZ), default plugin.discovery"
  unpack_debezium "$OTHER_DBZ" other-version
  worker_props /lab/other-version; restart_worker
  since_mark | grep -E '^\s+plugin.discovery = ' | head -1 | sed 's/^\s*/  /'
  listed "$CLASS" | save 10-discovery-default-listed.txt
  since_mark | grep -A14 'missing ServiceLoader manifests' | grep -E 'ServiceLoader manifests|PostgresConnector|^\]|Read the documentation' | cut -c1-700 | head -4 | save 10-discovery-default-log.txt || true

  step "The same plugin with plugin.discovery=service_load"
  worker_props /lab/other-version plugin.discovery=service_load; restart_worker
  listed "$CLASS" | save 10-discovery-service-load-listed.txt
  create inventory-connector "$CLASS" | cut -c1-330 | save 10-discovery-service-load-create.txt

  step "connect-plugin-path.sh list"
  docker compose exec -T connect "$KAFKA_DIR/bin/connect-plugin-path.sh" list --plugin-path /lab/other-version 2>/dev/null | grep -vE '^\s*$' | cut -c1-260 | sed 's/^/  /' | save 10-discovery-list-before.txt

  step "Fix: connect-plugin-path.sh sync-manifests, restart"
  docker compose exec -T connect "$KAFKA_DIR/bin/connect-plugin-path.sh" sync-manifests --plugin-path /lab/other-version 2>/dev/null | grep -vE '^\s*$' | cut -c1-260 | tail -6 | sed 's/^/  /' | save 10-discovery-sync.txt
  restart_worker
  listed "$CLASS" | save 10-discovery-after-sync-listed.txt
  plugins | grep -i debezium || true
}

other_java() {
  if [[ "$LEGACY" != 1 ]]; then echo "  (skipped: needs a worker on a Java older than the plugin was built for)"; return 0; fi
  step "A plugin built for a newer Java (Debezium $OTHER_DBZ) on this worker"
  docker compose exec -T connect java -version 2>&1 | head -1 | sed 's/^/  /'
  worker_props /lab/other-version; restart_worker
  listed "$CLASS" | save 11-other-java-listed.txt
  problems | save 11-other-java-warnings.txt
  create inventory-connector "$CLASS" | cut -c1-330 | save 11-other-java-create.txt
}

class_version() {
  step "Class file version of the connector class in each plug-in archive (61 is Java 17, 55 is Java 11, 52 is Java 8)"
  local v tmp
  tmp="$(mktemp)"
  for v in "$DBZ" "$OTHER_DBZ"; do
    tar -xzOf "work/downloads/debezium-connector-postgres-$v-plugin.tar.gz" "debezium-connector-postgres/debezium-connector-postgres-$v.jar" > "$tmp"
    echo "  debezium-connector-postgres-$v.jar PostgresConnector.class starts with $(unzip -p "$tmp" io/debezium/connector/postgresql/PostgresConnector.class | head -c 8 | xxd -p)"
  done | sort | save 12-class-version.txt
  rm -f "$tmp"
}

case "${1:-}" in
fetch) fetch ;;
up)
  [[ -f work/worker.properties ]] || { echo "run ./run.sh fetch first"; exit 1; }
  docker compose up -d --wait kafka postgres
  docker compose up -d connect
  wait_rest
  curl -s "$CONNECT/"; echo
  ;;
missing) missing ;;
wrong-level) wrong_level ;;
half) half ;;
fixed) fixed ;;
typo) typo ;;
lost) lost ;;
no-restart) no_restart ;;
hub) hub ;;
converter) converter ;;
discovery) discovery ;;
other-java) other_java ;;
class-version) class_version ;;
all)
  missing; wrong_level; half; fixed; typo; lost; no_restart; hub
  [[ "$LEGACY" == 1 ]] || converter
  discovery; other_java
  ;;
down)
  docker compose down -v
  ;;
*)
  sed -n '2,26p' "$0"; exit 1
  ;;
esac
