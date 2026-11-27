#!/usr/bin/env bash
# Lab: Iceberg snapshot expiry and orphan-file removal, and what each leaves in storage.
#
#   ./run.sh up        start MinIO, the REST catalog fixture and an idle Spark container
#   ./run.sh expire    expire_snapshots on appends, with table properties, with retain_last, with a tag,
#                      after a DELETE (copy-on-write and merge-on-read)
#   ./run.sh gc        gc.enabled = false
#   ./run.sh metadata  .metadata.json files: expiry, write.metadata.delete-after-commit.enabled and
#                      write.metadata.previous-versions-max, and the untracked files orphan removal finds
#   ./run.sh orphans   remove_orphan_files: the default listing, prefix_listing, the 24-hour guard, the
#                      action behind it, the same with the Hadoop S3A file system, and which prefix
#                      arguments the procedure accepts
#   ./run.sh all       every step from expire to orphans, in order
#   ./run.sh down      remove the containers and the Ivy cache volume
#
# LINE picks the versions (default 3.5):
#   LINE=3.5  apache/spark 3.5.6 (Scala 2.12, Java 17) with Iceberg 1.12.0, hadoop-aws 3.3.4
#   LINE=4.0  apache/spark 4.0.5 (Scala 2.13, Java 17) with Iceberg 1.12.0, hadoop-aws 3.4.1
#   LINE=3.3  apache/spark 3.3.3 (Scala 2.12, Java 11) with Iceberg 1.4.3, hadoop-aws 3.3.2
# hadoop-aws matches the Hadoop client jars in each image. It is added only to the sessions marked
# "s3a" below, so every other session lists through the table's own S3FileIO.
# Each part writes <part>.txt (statements and results) and <part>.stderr.txt (the Spark log) to
# logs/spark-<version>-iceberg-<version>/. The storage-*.txt files are object counts and sizes taken
# from MinIO with mc after the part.
set -euo pipefail
cd "$(dirname "$0")"

LINE="${LINE:-3.5}"
case "$LINE" in
  3.5) SPARK_IMAGE=apache/spark:3.5.6-scala2.12-java17-python3-ubuntu; SPARK=3.5.6; SCALA=2.12; ICEBERG=1.12.0; HADOOP=3.3.4 ;;
  4.0) SPARK_IMAGE=apache/spark:4.0.5-scala2.13-java17-python3-ubuntu; SPARK=4.0.5; SCALA=2.13; ICEBERG=1.12.0; HADOOP=3.4.1 ;;
  3.3) SPARK_IMAGE=apache/spark:3.3.3-scala2.12-java11-python3-ubuntu; SPARK=3.3.3; SCALA=2.12; ICEBERG=1.4.3; HADOOP=3.3.2 ;;
  *) echo "LINE must be 3.5, 4.0 or 3.3" >&2; exit 1 ;;
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
  --conf spark.sql.session.timeZone=UTC
)
# The Hadoop S3A file system for s3:// paths, the way the orphan-file listing reaches them. minio:// is
# the same bucket under a second scheme name, used once to show a scheme mismatch.
S3A=(
  --conf spark.hadoop.fs.s3.impl=org.apache.hadoop.fs.s3a.S3AFileSystem
  --conf spark.hadoop.fs.minio.impl=org.apache.hadoop.fs.s3a.S3AFileSystem
  --conf spark.hadoop.fs.s3a.endpoint=http://minio:9000
  --conf spark.hadoop.fs.s3a.endpoint.region=us-east-1
  --conf spark.hadoop.fs.s3a.path.style.access=true
  --conf spark.hadoop.fs.s3a.connection.ssl.enabled=false
  --conf spark.hadoop.fs.s3a.access.key=admin
  --conf spark.hadoop.fs.s3a.secret.key=password
)

alive() { # refuse to run a step, and overwrite its logs, when part of the stack is down
  local up
  up="$(docker compose ps --status running --services 2>/dev/null | sort | tr '\n' ' ')"
  if [[ "$up" != "minio rest spark " ]]; then
    echo "  the stack is not fully running (running: ${up:-none}); run ./run.sh up first" >&2
    exit 1
  fi
}

part() { # <part name> [s3a]: one Spark session running one part of maintenance.py
  alive
  mkdir -p "$LOGS"
  local packages="$PACKAGES" extra=()
  if [[ "${2:-}" == s3a ]]; then
    packages="$PACKAGES,org.apache.hadoop:hadoop-aws:$HADOOP"
    extra=("${S3A[@]}")
  fi
  echo "  $1${2:+ ($2)}"
  docker compose exec -T -e SPARK_CONF_DIR=/lab/conf -e PREFIX_LISTING="${PREFIX_LISTING:-}" spark \
    /opt/spark/bin/spark-submit --driver-memory 1536m --conf spark.jars.ivy=/ivy \
    --packages "$packages" "${CONF[@]}" ${extra[@]+"${extra[@]}"} /lab/maintenance.py "$1" \
    > "$LOGS/$1.txt" 2> "$LOGS/$1.stderr.txt" || true
  grep -E '^(===|ERROR|Caused by|---)' "$LOGS/$1.txt" | cut -c1-200 | sed 's/^/    /' || true
}

storage() { # <table> <log name>: object counts and sizes from MinIO
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
  expire)
    part expire-appends
    storage appends storage-appends
    part expire-properties
    storage props storage-props
    part expire-retain-last
    storage retain storage-retain
    part expire-tag
    storage tagged storage-tagged
    part expire-deletes
    storage cow storage-cow
    storage mor storage-mor
    ;;
  gc)
    part gc-disabled
    storage nogc storage-nogc
    ;;
  metadata)
    part metadata
    storage meta storage-meta
    storage meta_untracked storage-meta-untracked-before-orphan-removal
    part metadata-orphans s3a
    storage meta_untracked storage-meta-untracked-after-orphan-removal
    ;;
  orphans)
    part orphans-setup
    storage orphans storage-orphans-1-setup
    part orphans
    storage orphans storage-orphans-2-after-orphans
    part orphans-s3a s3a
    storage orphans storage-orphans-3-after-orphans-s3a
    part orphans-args s3a
    ;;
  down)
    docker compose down -v
    ;;
  *)
    sed -n '2,25p' "$0"; exit 1
    ;;
  esac
}

if [[ "${1:-}" == all ]]; then
  for s in expire gc metadata orphans; do
    echo "== $s"; step "$s"
  done
else
  step "${1:-}"
fi
