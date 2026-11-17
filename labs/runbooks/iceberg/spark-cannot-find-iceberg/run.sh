#!/usr/bin/env bash
# Lab: a Spark session that cannot find Iceberg.
#
#   ./run.sh up               start MinIO, the REST catalog fixture and an idle Spark container
#   ./run.sh working          the full configuration on the command line: create a table, run MERGE,
#                             UPDATE, DELETE and CALL, print what the session loaded
#   ./run.sh no-jar           catalog and extensions configured, no Iceberg runtime jar
#   ./run.sh wrong-jar        runtime jars built for another Spark minor version or Scala version
#   ./run.sh no-extensions    runtime jar and catalog, no spark.sql.extensions (or a misspelled one)
#   ./run.sh typo             a catalog name the session does not have, a misspelled class, no type,
#                             a misspelled spark.sql.defaultCatalog
#   ./run.sh session-catalog  Iceberg in spark_catalog: built-in, SparkSessionCatalog, wrong name
#   ./run.sh defaults-file    the working configuration read from conf/spark-<minor>/spark-defaults.conf
#   ./run.sh all              every step from working to defaults-file, in order
#   ./run.sh down             remove the containers and the Ivy cache volume
#
# LINE picks the Spark and Iceberg versions (default 3.5):
#   LINE=3.5  apache/spark 3.5.6 (Scala 2.12, Java 17) with Iceberg 1.12.0
#   LINE=3.3  apache/spark 3.3.3 (Scala 2.12, Java 11) with Iceberg 1.4.3
#   LINE=4.0  apache/spark 4.0.5 (Scala 2.13, Java 17) with Iceberg 1.12.0
# Each step writes <step>.txt (what each statement returned or raised) and <step>.stderr.txt (the
# Spark log, with Ivy's resolution report) to logs/spark-<version>-iceberg-<version>/.
set -euo pipefail
cd "$(dirname "$0")"

LINE="${LINE:-3.5}"
case "$LINE" in
  3.5) SPARK_IMAGE=apache/spark:3.5.6-scala2.12-java17-python3-ubuntu; SPARK=3.5.6; SCALA=2.12; ICEBERG=1.12.0 ;;
  3.3) SPARK_IMAGE=apache/spark:3.3.3-scala2.12-java11-python3-ubuntu; SPARK=3.3.3; SCALA=2.12; ICEBERG=1.4.3 ;;
  4.0) SPARK_IMAGE=apache/spark:4.0.5-scala2.13-java17-python3-ubuntu; SPARK=4.0.5; SCALA=2.13; ICEBERG=1.12.0 ;;
  *) echo "LINE must be 3.5, 3.3 or 4.0" >&2; exit 1 ;;
esac
export SPARK_IMAGE
MINOR="${SPARK%.*}"
LOGS="logs/spark-$SPARK-iceberg-$ICEBERG"

pkgs() { # <spark minor>_<scala> <iceberg version>: the runtime jar and the AWS bundle of that version
  echo "org.apache.iceberg:iceberg-spark-runtime-$1:$2,org.apache.iceberg:iceberg-aws-bundle:$2"
}
PACKAGES="$(pkgs "${MINOR}_$SCALA" "$ICEBERG")"
REST=(
  type=rest
  uri=http://rest:8181
  io-impl=org.apache.iceberg.aws.s3.S3FileIO
  s3.endpoint=http://minio:9000
  s3.path-style-access=true
)
catalog() { # <catalog name> <class> [property to leave out]: the --conf options of one catalog
  echo "--conf spark.sql.catalog.$1=$2"
  for p in "${REST[@]}"; do [[ "${3:-}" == "${p%%=*}" ]] || echo "--conf spark.sql.catalog.$1.$p"; done
}
DEMO="$(catalog demo org.apache.iceberg.spark.SparkCatalog)"
EXT="--conf spark.sql.extensions=org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions"

alive() { # refuse to run a step, and overwrite its logs, when part of the stack is down
  local up
  up="$(docker compose ps --status running --services 2>/dev/null | sort | tr '\n' ' ')"
  if [[ "$up" != "minio rest spark " ]]; then
    echo "  the stack is not fully running (running: ${up:-none}); run ./run.sh up first" >&2
    exit 1
  fi
}

submit() { # <step name> <probe case> [spark-submit options]: one Spark session
  local name="$1" case="$2"; shift 2
  alive
  mkdir -p "$LOGS"
  echo "  $name"
  # shellcheck disable=SC2068
  docker compose exec -T -e SPARK_CONF_DIR="${CONF_DIR:-/lab/conf/base}" spark \
    /opt/spark/bin/spark-submit --driver-memory 1536m --conf spark.jars.ivy=/ivy $@ /lab/probe.py "$case" \
    > "$LOGS/$name.txt" 2> "$LOGS/$name.stderr.txt" || true
  grep -E '^(===|OK|ERROR|Caused by|\[|[A-Za-z.]+Exception)' "$LOGS/$name.txt" | cut -c1-220 | sed 's/^/    /' || true
}

step() {
  case "$1" in
  up)
    docker compose up -d
    docker compose exec -T spark python3 -c '
import time, urllib.request
for _ in range(60):
    try:
        print("  REST catalog:", urllib.request.urlopen("http://rest:8181/v1/config").read().decode()); break
    except Exception:
        time.sleep(2)
else:
    raise SystemExit("REST catalog did not answer")'
    mkdir -p "$LOGS"
    docker compose images > "$LOGS/00-images.txt"
    docker compose exec -T spark /opt/spark/bin/spark-submit --version > "$LOGS/00-spark-version.txt" 2>&1 || true
    grep -E 'version [0-9]' "$LOGS/00-spark-version.txt" | sed 's/^/  /'
    ;;
  working)
    submit 01-working working --packages "$PACKAGES" $DEMO $EXT
    ;;
  no-jar)
    # The catalog and the extensions are configured, the jars are not.
    submit 02-no-jar-catalog reads $DEMO $EXT
    # Nothing Iceberg in the session at all.
    submit 02-no-jar-nothing reads
    ;;
  wrong-jar)
    case "$LINE" in
      3.5) submit 03-wrong-scala-3.5_2.13 wrong-jar --packages "$(pkgs 3.5_2.13 1.12.0)" $DEMO $EXT
           submit 03-wrong-minor-3.4_2.12 wrong-jar --packages "$(pkgs 3.4_2.12 1.11.0)" $DEMO $EXT ;;
      3.3) submit 03-wrong-scala-3.3_2.13 wrong-jar --packages "$(pkgs 3.3_2.13 1.4.3)" $DEMO $EXT
           submit 03-wrong-minor-3.5_2.12 wrong-jar --packages "$(pkgs 3.5_2.12 1.4.3)" $DEMO $EXT ;;
      4.0) submit 03-wrong-minor-3.5_2.13 wrong-jar --packages "$(pkgs 3.5_2.13 1.12.0)" $DEMO $EXT
           submit 03-wrong-minor-4.1_2.13 wrong-jar --packages "$(pkgs 4.1_2.13 1.12.0)" $DEMO $EXT ;;
    esac
    ;;
  no-extensions)
    submit 04-no-extensions no-extensions --packages "$PACKAGES" $DEMO
    submit 04-misspelled-extensions no-extensions --packages "$PACKAGES" $DEMO \
      --conf spark.sql.extensions=org.apache.iceberg.spark.extensions.IcebergSparkSessionExtension
    ;;
  typo)
    submit 05-typo-catalog-name typo --packages "$PACKAGES" $DEMO $EXT
    submit 05-typo-class reads --packages "$PACKAGES" $EXT \
      "$(catalog demo org.apache.iceberg.spark.SparkCatlog)"
    submit 05-no-type reads --packages "$PACKAGES" $EXT \
      "$(catalog demo org.apache.iceberg.spark.SparkCatalog type)"
    submit 05-typo-default-catalog default-catalog --packages "$PACKAGES" $DEMO $EXT \
      --conf spark.sql.defaultCatalog=dmeo
    ;;
  session-catalog)
    submit 06-session-builtin session-builtin --packages "$PACKAGES" $DEMO $EXT
    submit 06-session-iceberg session-iceberg --packages "$PACKAGES" $EXT \
      "$(catalog spark_catalog org.apache.iceberg.spark.SparkSessionCatalog)"
    submit 06-session-misnamed session-misnamed --packages "$PACKAGES" $EXT \
      "$(catalog demo org.apache.iceberg.spark.SparkSessionCatalog)"
    ;;
  defaults-file)
    # No --packages and no --conf: everything comes from spark-defaults.conf in SPARK_CONF_DIR.
    CONF_DIR="/lab/conf/spark-$MINOR" submit 07-defaults-file working
    ;;
  down)
    docker compose down -v
    ;;
  *)
    sed -n '2,24p' "$0"; exit 1
    ;;
  esac
}

if [[ "${1:-}" == all ]]; then
  for s in working no-jar wrong-jar no-extensions typo session-catalog defaults-file; do
    echo "== $s"; step "$s"
  done
else
  step "${1:-}"
fi
