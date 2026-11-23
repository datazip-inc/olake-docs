#!/usr/bin/env bash
# Lab: Iceberg compaction with rewrite_data_files, and why it rewrites nothing.
#
#   ./run.sh up           start MinIO, the REST catalog fixture and an idle Spark container
#   ./run.sh small-files  30 small commits; compaction; what is left in storage and in the manifests;
#                         rewrite_manifests and expire_snapshots
#   ./run.sh thresholds   min-input-files, partitions, a where filter, files near the target size,
#                         rewrite-all
#   ./run.sh deletes      delete files: delete-file-threshold, remove-dangling-deletes,
#                         delete-ratio-threshold
#   ./run.sh sort         sort and z-order strategies
#   ./run.sh clustered    unsorted rows into a partitioned table: distribution mode and fanout writers
#   ./run.sh clustered-old  the same on Iceberg 1.1.0 (LINE=3.3 only, local Hadoop catalog)
#   ./run.sh concurrent   compaction while a second writer commits: an append, a delete, and the
#                         delete again with partial-progress.enabled
#   ./run.sh all          every step from small-files to concurrent, in order (clustered before concurrent)
#   ./run.sh down         remove the containers and the Ivy cache volume
#
# LINE picks the versions (default 3.5):
#   LINE=3.5  apache/spark 3.5.6 (Scala 2.12, Java 17) with Iceberg 1.12.0
#   LINE=3.3  apache/spark 3.3.3 (Scala 2.12, Java 11) with Iceberg 1.4.3
# Each part writes <part>.txt (statements and results) and <part>.stderr.txt (the Spark log, with
# Iceberg's rewrite and commit lines) to logs/spark-<version>-iceberg-<version>/. The storage-*.txt
# files are object counts taken from MinIO with mc.
set -euo pipefail
cd "$(dirname "$0")"

LINE="${LINE:-3.5}"
case "$LINE" in
  3.5) SPARK_IMAGE=apache/spark:3.5.6-scala2.12-java17-python3-ubuntu; SPARK=3.5.6; SCALA=2.12; ICEBERG=1.12.0 ;;
  3.3) SPARK_IMAGE=apache/spark:3.3.3-scala2.12-java11-python3-ubuntu; SPARK=3.3.3; SCALA=2.12; ICEBERG=1.4.3 ;;
  *) echo "LINE must be 3.5 or 3.3" >&2; exit 1 ;;
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

alive() { # refuse to run a step, and overwrite its logs, when part of the stack is down
  local up
  up="$(docker compose ps --status running --services 2>/dev/null | sort | tr '\n' ' ')"
  if [[ "$up" != "minio rest spark " ]]; then
    echo "  the stack is not fully running (running: ${up:-none}); run ./run.sh up first" >&2
    exit 1
  fi
}

part() { # <part name>: one Spark session running one part of compaction.py
  alive
  mkdir -p "$LOGS"
  echo "  $1"
  docker compose exec -T -e SPARK_CONF_DIR=/lab/conf spark \
    /opt/spark/bin/spark-submit --driver-memory 1536m --conf spark.jars.ivy=/ivy \
    --packages "$PACKAGES" "${CONF[@]}" /lab/compaction.py "$1" \
    > "$LOGS/$1.txt" 2> "$LOGS/$1.stderr.txt" || true
  grep -E '^(===|ERROR|Caused by|  [0-9 ]+\.[0-9]s|---)' "$LOGS/$1.txt" | cut -c1-200 | sed 's/^/    /' || true
}

storage() { # <table> <log name>: object counts from MinIO
  alive
  docker compose run --rm -T --no-deps --entrypoint sh mc /lab/storage.sh "$1" 2>/dev/null \
    | tee "$LOGS/$2.txt" | sed 's/^/    /'
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
  small-files)
    part many-create
    storage many_commits storage-1-after-30-commits
    part many-compact
    storage many_commits storage-2-after-compaction
    part many-cleanup
    storage many_commits storage-3-after-expire
    ;;
  thresholds) part thresholds ;;
  deletes) part deletes ;;
  sort) part sort ;;
  clustered) part clustered ;;
  clustered-old)
    # The same writes on Iceberg 1.1.0, released before the Spark write defaults changed in 1.2.0.
    # 1.1.0 has no AWS bundle, so this step uses a local Hadoop catalog inside the Spark container.
    [[ "$LINE" == 3.3 ]] || { echo "clustered-old runs with LINE=3.3" >&2; exit 1; }
    alive
    mkdir -p logs/spark-3.3.3-iceberg-1.1.0
    echo "  clustered-old"
    docker compose exec -T -e SPARK_CONF_DIR=/lab/conf spark \
      /opt/spark/bin/spark-submit --driver-memory 1536m --conf spark.jars.ivy=/ivy \
      --packages org.apache.iceberg:iceberg-spark-runtime-3.3_2.12:1.1.0 \
      --conf spark.sql.extensions=org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions \
      --conf spark.sql.catalog.local=org.apache.iceberg.spark.SparkCatalog \
      --conf spark.sql.catalog.local.type=hadoop \
      --conf spark.sql.catalog.local.warehouse=file:///tmp/iceberg-warehouse \
      /lab/compaction.py clustered-old \
      > logs/spark-3.3.3-iceberg-1.1.0/clustered-old.txt 2> logs/spark-3.3.3-iceberg-1.1.0/clustered-old.stderr.txt || true
    grep -E '^(===|ERROR|Caused by)' logs/spark-3.3.3-iceberg-1.1.0/clustered-old.txt | cut -c1-200 | sed 's/^/    /' || true
    ;;
  concurrent)
    part concurrent-setup
    part concurrent-append
    storage busy storage-4-before-failed-compaction
    part concurrent-delete
    storage busy storage-5-after-failed-compaction
    part concurrent-partial
    ;;
  down)
    docker compose down -v
    ;;
  *)
    sed -n '2,22p' "$0"; exit 1
    ;;
  esac
}

if [[ "${1:-}" == all ]]; then
  for s in small-files thresholds deletes sort clustered concurrent; do
    echo "== $s"; step "$s"
  done
else
  step "${1:-}"
fi
