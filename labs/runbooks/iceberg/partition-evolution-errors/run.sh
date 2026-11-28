#!/usr/bin/env bash
# Lab: Iceberg partition specs and partition evolution in Spark, PyIceberg and Trino.
#
#   ./run.sh up           start MinIO, the REST catalog fixture and an idle Spark container
#   ./run.sh noext        a Spark session without the Iceberg SQL extensions: CREATE TABLE ... PARTITIONED BY,
#                         then ADD, DROP and REPLACE PARTITION FIELD
#   ./run.sh spark        the Spark cases in one session with the extensions: specs CREATE TABLE refuses,
#                         ADD, DROP and REPLACE PARTITION FIELD, files under an old spec and the filters that
#                         prune them, saveAsTable overwrite with another partition column, and DROP COLUMN
#                         of a partition source column (REST and Hadoop catalogs)
#   ./run.sh replace-fix  ways round the failed overwrite of the replace case: format version 1 to 2 first,
#                         or drop the table and create it again
#   ./run.sh pyiceberg    stop Spark, then the PyIceberg cases with PyIceberg 0.12.0, without and with pyiceberg-core
#   ./run.sh trino [<sql file>]
#                         stop Spark, start Trino 484 on the same catalog, run trino.sql (or the file given)
#   ./run.sh old-read <label>
#                         stop Spark and Trino, then read the tables with Spark 3.3.3 and Iceberg 1.4.3
#   ./run.sh clean-specs  start Spark again: rewrite the DROP COLUMN tables into the current spec, then
#                         expire snapshots with clean_expired_metadata, before and after one more commit
#   ./run.sh clean-v1     the same for the format version 1 table, after moving it to version 2 and
#                         dropping its void partition field
#   ./run.sh all          on LINE=3.5 every step from noext to the second trino run, in order; on the
#                         other lines noext, spark and replace-fix
#   ./run.sh down         remove the containers and the Ivy cache volume
#
# LINE picks the Spark and Iceberg versions (default 3.5):
#   LINE=3.5  apache/spark 3.5.6 (Scala 2.12, Java 17) with Iceberg 1.12.0
#   LINE=4.0  apache/spark 4.0.5 (Scala 2.13, Java 17) with Iceberg 1.12.0
#   LINE=3.3  apache/spark 3.3.3 (Scala 2.12, Java 11) with Iceberg 1.4.3
# pyiceberg, trino, old-read, clean-specs and clean-v1 use the tables the spark step created in the same stack.
# The read-me runs them on LINE=3.5, with old-read before clean-specs, after it and after clean-v1.
set -euo pipefail
cd "$(dirname "$0")"

LINE="${LINE:-3.5}"
case "$LINE" in
  3.5) SPARK_IMAGE=apache/spark:3.5.6-scala2.12-java17-python3-ubuntu; SPARK=3.5.6; SCALA=2.12; ICEBERG=1.12.0 ;;
  4.0) SPARK_IMAGE=apache/spark:4.0.5-scala2.13-java17-python3-ubuntu; SPARK=4.0.5; SCALA=2.13; ICEBERG=1.12.0 ;;
  3.3) SPARK_IMAGE=apache/spark:3.3.3-scala2.12-java11-python3-ubuntu; SPARK=3.3.3; SCALA=2.12; ICEBERG=1.4.3 ;;
  *) echo "LINE must be 3.5, 4.0 or 3.3" >&2; exit 1 ;;
esac
export SPARK_IMAGE
LOGS="logs/spark-$SPARK-iceberg-$ICEBERG"
packages() { # <spark version> <scala version> <iceberg version>
  echo "org.apache.iceberg:iceberg-spark-runtime-${1%.*}_$2:$3,org.apache.iceberg:iceberg-aws-bundle:$3"
}
EXTENSIONS=(--conf spark.sql.extensions=org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions)
CONF=(
  --conf spark.sql.catalog.demo=org.apache.iceberg.spark.SparkCatalog
  --conf spark.sql.catalog.demo.type=rest
  --conf spark.sql.catalog.demo.uri=http://rest:8181
  --conf spark.sql.catalog.demo.io-impl=org.apache.iceberg.aws.s3.S3FileIO
  --conf spark.sql.catalog.demo.s3.endpoint=http://minio:9000
  --conf spark.sql.catalog.demo.s3.path-style-access=true
  --conf spark.sql.catalog.local=org.apache.iceberg.spark.SparkCatalog
  --conf spark.sql.catalog.local.type=hadoop
  --conf spark.sql.catalog.local.warehouse=/tmp/hadoop-warehouse
  --conf spark.sql.session.timeZone=UTC
)

running() { docker compose ps --status running --services 2>/dev/null | sort | tr '\n' ' '; }
need() { # <services, sorted, space separated>: refuse to run when the stack is not in that state
  local up; up="$(running)"
  if [[ "$up" != "$1 " ]]; then
    echo "  expected running: $1; running: ${up:-none}. Run ./run.sh up (and the spark step) first" >&2
    exit 1
  fi
}

session() { # <log name> <extensions: yes|no> <case> [<case> ...]: one spark-submit in the spark container
  local log="$1" ext="$2"; shift 2
  local extra=()
  [[ "$ext" == yes ]] && extra=("${EXTENSIONS[@]}")
  need "minio rest spark"
  mkdir -p "$LOGS"
  docker compose exec -T -e SPARK_CONF_DIR=/lab/conf spark \
    /opt/spark/bin/spark-submit --driver-memory 1536m --conf spark.jars.ivy=/ivy \
    --packages "$(packages "$SPARK" "$SCALA" "$ICEBERG")" ${extra[@]+"${extra[@]}"} "${CONF[@]}" /lab/partitions.py "$@" \
    > "$LOGS/$log.txt" 2> "$LOGS/$log.stderr.txt" || true
  grep -E '^(########|===|OK|ERROR|---)' "$LOGS/$log.txt" | cut -c1-200 | sed 's/^/  /' || true
}

step() {
  case "$1" in
  up)
    docker compose up -d
    docker compose exec -T spark python3 -c '
import time, urllib.request
for _ in range(60):
    try:
        urllib.request.urlopen("http://rest:8181/v1/config"); print("  REST catalog answers"); break
    except Exception:
        time.sleep(2)
else:
    raise SystemExit("REST catalog did not answer")'
    mkdir -p "$LOGS"
    docker compose images > "$LOGS/00-images.txt"
    ;;
  noext)
    session noext no noext
    ;;
  spark)
    session spark yes create evolve prune replace dropcol
    ;;
  replace-fix)
    session replace-fix yes replace-fix
    ;;
  pyiceberg)
    docker compose stop spark
    need "minio rest"
    mkdir -p logs/pyiceberg
    # Once with the pyarrow extra only, once with pyiceberg-core as well.
    for run in "pyiceberg-0.12.0|'pyiceberg[pyarrow]==0.12.0' 'pyarrow==26.0.1'" \
               "pyiceberg-0.12.0-with-pyiceberg-core|'pyiceberg[pyarrow,pyiceberg-core]==0.12.0' 'pyarrow==26.0.1' 'pyiceberg-core==0.10.1'"; do
      log="${run%%|*}"; pkgs="${run#*|}"
      echo "  $log"
      docker compose --profile pyiceberg run --rm -T --no-deps pyiceberg sh -c \
        "pip install --quiet --disable-pip-version-check --root-user-action=ignore $pkgs && python /lab/pyiceberg_cases.py" \
        > "logs/pyiceberg/$log.txt" 2> "logs/pyiceberg/$log.stderr.txt" || true
      grep -E '^(#|===|OK|ERROR)' "logs/pyiceberg/$log.txt" | cut -c1-200 | sed 's/^/    /' || true
    done
    ;;
  trino)
    local sql="${2:-trino.sql}" log
    log="logs/trino-484/$(basename "$sql" .sql).txt"
    docker compose stop spark
    docker compose --profile trino up -d --no-deps trino
    need "minio rest trino"
    mkdir -p logs/trino-484
    for _ in $(seq 1 60); do
      if docker compose exec -T trino trino --execute 'SELECT 1' > /dev/null 2>&1; then break; fi
      sleep 3
    done
    {
      docker compose exec -T trino trino --version
      docker compose exec -T trino trino --execute 'SELECT node_version FROM system.runtime.nodes'
    } > logs/trino-484/00-version.txt 2>&1 || true
    : > "$log"
    grep -v '^--' "$sql" | while IFS= read -r stmt; do
      [[ -z "$stmt" ]] && continue
      if [[ "$stmt" == DEBUG\ * ]]; then
        # --debug prints the whole stack of a failure: keep the exception chain and the Iceberg frames.
        stmt="${stmt#DEBUG }"
        out="$(docker compose exec -T trino trino --debug --output-format ALIGNED --execute "$stmt" < /dev/null 2>&1 || true)"
        {
          echo; echo "=== $stmt"
          if grep -q '^Query .* failed' <<< "$out"; then
            grep -E '^(Query|[a-zA-Z.]+(Exception|Error)|Caused by|	at io\.trino\.plugin\.iceberg)' <<< "$out" | head -12 || true
          else
            echo "$out"
          fi
        } >> "$log"
        continue
      fi
      {
        echo; echo "=== $stmt"
        docker compose exec -T trino trino --output-format ALIGNED --execute "$stmt" < /dev/null 2>&1 || true
      } >> "$log"
    done
    grep -E '^(===|Query .* failed)' "$log" | cut -c1-220 | sed 's/^/  /'
    ;;
  old-read)
    [[ "$LINE" == 3.3 ]] && { echo "  old-read reads tables a newer line wrote; run it on LINE=3.5 or 4.0" >&2; exit 1; }
    local label="${2:-before}"
    docker compose stop spark
    docker compose --profile trino stop trino 2>/dev/null || true
    need "minio rest"
    mkdir -p logs/old-read
    docker compose --profile old run --rm -T --no-deps -e SPARK_CONF_DIR=/lab/conf spark-old \
      /opt/spark/bin/spark-submit --driver-memory 1536m --conf spark.jars.ivy=/ivy \
      --packages "$(packages 3.3.3 2.12 1.4.3)" "${EXTENSIONS[@]}" "${CONF[@]}" /lab/partitions.py old-read \
      > "logs/old-read/spark-3.3.3-iceberg-1.4.3-$label.txt" 2> "logs/old-read/spark-3.3.3-iceberg-1.4.3-$label.stderr.txt" || true
    grep -E '^(#|===|OK|ERROR)' "logs/old-read/spark-3.3.3-iceberg-1.4.3-$label.txt" | cut -c1-200 | sed 's/^/  /' || true
    ;;
  clean-specs|clean-v1)
    docker compose --profile trino stop trino 2>/dev/null || true
    docker compose start spark
    session "$1" yes "$1"
    ;;
  down)
    docker compose --profile pyiceberg --profile trino --profile old down -v
    ;;
  *)
    sed -n '2,31p' "$0"; exit 1
    ;;
  esac
}

if [[ "${1:-}" == all ]]; then
  if [[ "$LINE" == 3.5 ]]; then
    steps=(noext spark replace-fix pyiceberg trino "old-read before" clean-specs "old-read after-clean-specs"
      clean-v1 "old-read after-clean-v1" "trino trino-after.sql")
  else
    steps=(noext spark replace-fix)
  fi
  for s in "${steps[@]}"; do
    echo "== $s"
    # shellcheck disable=SC2086 # a step and its argument
    step $s
  done
else
  step "${1:-}" "${2:-}"
fi
