#!/bin/sh
# Counts and sizes the objects of one table in the bucket. Runs in the mc container: sh /lab/storage.sh <table>
t="$1"
base="local/warehouse/db/$t"
mc alias set local http://minio:9000 admin password >/dev/null
n() { mc find "$base/$1" --name "$2" 2>/dev/null | wc -l | tr -d ' '; }
# The image has no sed, awk or grep, so the size is taken out of the JSON with tr and the shell.
bytes() {
  mc du --json "$base/$1" 2>/dev/null | tr ',' '\n' | while IFS= read -r l; do
    case "$l" in '"size":'*) echo "${l#\"size\":}" ;; esac
  done
}
echo "objects of db.$t in s3://warehouse/db/$t/, listed with mc"
echo "  data/: $(n data '*') objects, $(bytes data) bytes (*-deletes.parquet: $(n data '*-deletes.parquet'), orphan-*: $(n data 'orphan-*'))"
echo "  metadata/: $(n metadata '*') objects, $(bytes metadata) bytes (*.metadata.json: $(n metadata '*.metadata.json'), snap-*.avro: $(n metadata 'snap-*.avro'), *-m*.avro: $(n metadata '*-m*.avro'))"
