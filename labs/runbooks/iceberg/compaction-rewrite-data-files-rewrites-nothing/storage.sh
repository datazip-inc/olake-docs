#!/bin/sh
# Counts the objects one table has in the bucket. Runs in the mc container: sh /lab/storage.sh <table>
t="$1"
base="local/warehouse/db/$t"
mc alias set local http://minio:9000 admin password >/dev/null
n() { mc find "$base/$1" --name "$2" 2>/dev/null | wc -l | tr -d ' '; }
echo "objects of db.$t in s3://warehouse/db/$t/"
echo "  data/*.parquet: $(n data '*.parquet') (of which position delete files *-deletes.parquet: $(n data '*-deletes.parquet'))"
echo "  metadata/*.metadata.json: $(n metadata '*.metadata.json')"
echo "  metadata/snap-*.avro (manifest lists): $(n metadata 'snap-*.avro')"
echo "  metadata/*-m*.avro (manifests): $(n metadata '*-m*.avro')"
echo "  mc du data/: $(mc du "$base/data" | tr '\t' ' ')"
