#!/usr/bin/env bash
# Lab: Iceberg schema evolution errors in Spark, PyIceberg and Trino.
#
#   ./run.sh up          start MinIO, the REST catalog fixture and an idle Spark container
#   ./run.sh spark       every Spark case in one session: type changes, a missing column, an extra
#                        column (mergeSchema, write.spark.accept-any-schema), rename and reorder,
#                        nested fields, required columns, case sensitivity
#   ./run.sh pyiceberg   stop Spark, then the PyIceberg cases with PyIceberg 0.12.0 and 0.7.1
#   ./run.sh trino       stop Spark, start Trino 484 on the same catalog, run trino.sql
#   ./run.sh down        remove the containers and the Ivy cache volume
#
# LINE picks the Spark and Iceberg versions (default 3.5); pyiceberg and trino read tables the
# spark step created in the same stack, so run them after it:
#   LINE=3.5  apache/spark 3.5.6 (Scala 2.12, Java 17) with Iceberg 1.12.0
#   LINE=3.3  apache/spark 3.3.3 (Scala 2.12, Java 11) with Iceberg 1.4.3
#   LINE=4.0  apache/spark 4.0.5 (Scala 2.13, Java 17) with Iceberg 1.12.0
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
PACKAGES="org.apache.iceberg:iceberg-spark-runtime-${MINOR}_$SCALA:$ICEBERG,org.apache.iceberg:iceberg-aws-bundle:$ICEBERG"
CONF=(
  --conf spark.sql.extensions=org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions
  --conf spark.sql.catalog.demo=org.apache.iceberg.spark.SparkCatalog
  --conf spark.sql.catalog.demo.type=rest
  --conf spark.sql.catalog.demo.uri=http://rest:8181
  --conf spark.sql.catalog.demo.io-impl=org.apache.iceberg.aws.s3.S3FileIO
  --conf spark.sql.catalog.demo.s3.endpoint=http://minio:9000
  --conf spark.sql.catalog.demo.s3.path-style-access=true
)

running() { docker compose ps --status running --services 2>/dev/null | sort | tr '\n' ' '; }
need() { # <services, sorted, space separated>: refuse to run when the stack is not in that state
  local up; up="$(running)"
  if [[ "$up" != "$1 " ]]; then
    echo "  expected running: $1; running: ${up:-none}. Run ./run.sh up (and the spark step) first" >&2
    exit 1
  fi
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
  spark)
    need "minio rest spark"
    mkdir -p "$LOGS"
    docker compose exec -T -e SPARK_CONF_DIR=/lab/conf spark \
      /opt/spark/bin/spark-submit --driver-memory 1536m --conf spark.jars.ivy=/ivy \
      --packages "$PACKAGES" "${CONF[@]}" /lab/schema.py types missing extra rename nested required cast case case-fix \
      > "$LOGS/spark.txt" 2> "$LOGS/spark.stderr.txt" || true
    grep -E '^(########|===|OK|ERROR|\[)' "$LOGS/spark.txt" | cut -c1-200 | sed 's/^/  /' || true
    ;;
  pyiceberg)
    docker compose stop spark
    need "minio rest"
    mkdir -p logs/pyiceberg
    for v in 0.12.0 0.7.1; do
      echo "  PyIceberg $v"
      docker compose --profile pyiceberg run --rm -T --no-deps pyiceberg sh -c \
        "pip install --quiet --disable-pip-version-check --root-user-action=ignore 'pyiceberg[pyarrow]==$v' && python /lab/pyiceberg_cases.py" \
        > "logs/pyiceberg/pyiceberg-$v.txt" 2> "logs/pyiceberg/pyiceberg-$v.stderr.txt" || true
      grep -E '^(#|===|OK|ERROR)' "logs/pyiceberg/pyiceberg-$v.txt" | cut -c1-200 | sed 's/^/    /' || true
    done
    ;;
  trino)
    docker compose stop spark
    docker compose --profile trino up -d --no-deps trino
    need "minio rest trino"
    mkdir -p logs/trino-484
    for _ in $(seq 1 60); do
      if docker compose exec -T trino trino --execute 'SELECT 1' > /dev/null 2>&1; then break; fi
      sleep 3
    done
    docker compose exec -T trino trino --version > logs/trino-484/00-version.txt 2>&1 || true
    : > logs/trino-484/trino.txt
    grep -v '^--' trino.sql | while IFS= read -r stmt; do
      [[ -z "$stmt" ]] && continue
      {
        echo; echo "=== $stmt"
        docker compose exec -T trino trino --output-format ALIGNED --execute "$stmt" < /dev/null 2>&1 || true
      } >> logs/trino-484/trino.txt
    done
    grep -E '^(===|Query .* failed)' logs/trino-484/trino.txt | cut -c1-220 | sed 's/^/  /'
    ;;
  down)
    docker compose --profile pyiceberg --profile trino down -v
    ;;
  *)
    sed -n '2,17p' "$0"; exit 1
    ;;
  esac
}

step "${1:-}"
