#!/usr/bin/env bash
# Lab: which engine reads which Iceberg delete format, on format version 2 and 3 tables.
#
#   ./run.sh up                 start MinIO and the Iceberg REST catalog fixture
#   ./run.sh write <engine>     that engine writes its tables (tables.txt lists every table and its writer)
#   ./run.sh errors             Spark 3.5.6: format version downgrades, merge-on-read on a v1 table, and a
#                               position delete file on a v3 table
#   ./run.sh read <engine> [<label>]
#                               that engine reads every table in tables.txt and compares the rows with the
#                               rows the lab's changes leave; one RESULT line per table
#   ./run.sh read-no-vectorization <engine>
#                               the same read with spark.sql.iceberg.vectorization.enabled=false (Spark only)
#   ./run.sh diagnose           PyIceberg: the Parquet encodings of the files of t_v2_pos and s35_v2_pos, and a
#                               PyArrow read of each position delete file
#   ./run.sh fix                Spark 3.5.6: rewrite_data_files on three equality delete tables, and
#                               rewrite_position_delete_files on t_v2_pos and s35_v2to3; then Trino 484:
#                               optimize on s33_v2_eq (trino-fix.sql)
#   ./run.sh copy-v2            Spark 3.5.6: a format version 2 copy of s35_v3_dv (CREATE TABLE ... AS SELECT),
#                               then Spark 3.3.3 with Iceberg 1.4.3 reads the copy
#   ./run.sh all                up, then every write step, errors, every read step, read-no-vectorization
#                               spark-3.3, diagnose, fix, the reads of PyIceberg, Spark 3.5.6 and Trino again
#                               with the label after-fix, and copy-v2, in this order
#   ./run.sh down               remove the containers and the volumes
#
# <engine> is one of:
#   spark-3.5   apache/spark 3.5.6 (Scala 2.12, Java 17) with Iceberg 1.12.0
#   spark-4.0   apache/spark 4.0.5 (Scala 2.13, Java 17) with Iceberg 1.12.0
#   spark-3.3   apache/spark 3.3.3 (Scala 2.12, Java 11) with Iceberg 1.4.3
#   pyiceberg   PyIceberg 0.12.0; read runs twice, without and with pyiceberg-core 0.10.1
#   trino       Trino 484
# Only one engine runs at a time: each step starts its engine and stops it when it is done.
set -euo pipefail
cd "$(dirname "$0")"

EXPECTED="1:r1,2:r2,4:r4,5:u5,6:r6,7:r7,9:r9,10:m10,11:m11"

spark_line() { # <engine>: sets SVC SPARK SCALA ICEBERG PREFIX LOGS
  case "$1" in
    spark-3.5) SVC=spark35; SPARK=3.5.6; SCALA=2.12; ICEBERG=1.12.0; PREFIX=s35 ;;
    spark-4.0) SVC=spark40; SPARK=4.0.5; SCALA=2.13; ICEBERG=1.12.0; PREFIX=s40 ;;
    spark-3.3) SVC=spark33; SPARK=3.3.3; SCALA=2.12; ICEBERG=1.4.3; PREFIX=s33 ;;
    *) echo "engine must be spark-3.5, spark-4.0, spark-3.3, pyiceberg or trino" >&2; exit 1 ;;
  esac
  LOGS="logs/spark-$SPARK-iceberg-$ICEBERG"
}
CONF=(
  --conf spark.sql.extensions=org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions
  --conf spark.sql.catalog.demo=org.apache.iceberg.spark.SparkCatalog
  --conf spark.sql.catalog.demo.type=rest
  --conf spark.sql.catalog.demo.uri=http://rest:8181
  --conf spark.sql.catalog.demo.io-impl=org.apache.iceberg.aws.s3.S3FileIO
  --conf spark.sql.catalog.demo.s3.endpoint=http://minio:9000
  --conf spark.sql.catalog.demo.s3.path-style-access=true
  --conf spark.sql.session.timeZone=UTC
  --conf spark.default.parallelism=1
)
EXTRA=() # more --conf arguments for the next spark-submit

running() { docker compose ps --status running --services 2>/dev/null | sort | tr '\n' ' '; }
need() { # <services, sorted, space separated>: refuse to run when the stack is not in that state
  local up; up="$(running)"
  if [[ "$up" != "$1 " ]]; then
    echo "  expected running: $1; running: ${up:-none}. Run ./run.sh up first" >&2
    exit 1
  fi
}

spark() { # <engine> <log name> <deletes.py arguments...>: one spark-submit in a new container
  spark_line "$1"
  local log="$2"; shift 2
  docker compose --profile trino stop trino > /dev/null 2>&1 || true
  need "minio rest"
  mkdir -p "$LOGS"
  docker compose --profile spark run --rm -T --no-deps -e SPARK_CONF_DIR=/lab/conf "$SVC" \
    /opt/spark/bin/spark-submit --driver-memory 1536m --conf spark.jars.ivy=/ivy \
    --packages "org.apache.iceberg:iceberg-spark-runtime-${SPARK%.*}_$SCALA:$ICEBERG,org.apache.iceberg:iceberg-aws-bundle:$ICEBERG" \
    "${CONF[@]}" ${EXTRA[@]+"${EXTRA[@]}"} /lab/deletes.py "$@" > "$LOGS/$log.txt" 2> "$LOGS/$log.stderr.txt" || true
  grep -E '^(########|=== |OK|ERROR|RESULT)' "$LOGS/$log.txt" | cut -c1-220 | sed 's/^/  /' || true
}

PY_PLAIN="'pyiceberg[pyarrow]==0.12.0' 'pyarrow==26.0.1'"
PY_CORE="'pyiceberg[pyarrow,pyiceberg-core]==0.12.0' 'pyarrow==26.0.1' 'pyiceberg-core==0.10.1'"
pyiceberg() { # <log name> <packages> <pyiceberg_cases.py arguments...>
  local log="$1" pkgs="$2"; shift 2
  docker compose --profile trino stop trino > /dev/null 2>&1 || true
  need "minio rest"
  mkdir -p logs/pyiceberg
  docker compose --profile pyiceberg run --rm -T --no-deps pyiceberg sh -c \
    "pip install --quiet --disable-pip-version-check --root-user-action=ignore $pkgs && python /lab/pyiceberg_cases.py $*" \
    > "logs/pyiceberg/$log.txt" 2> "logs/pyiceberg/$log.stderr.txt" || true
  grep -E '^(########|=== |OK|ERROR|WARNING|RESULT)' "logs/pyiceberg/$log.txt" | cut -c1-220 | sed 's/^/  /' || true
}

trino_up() {
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
}
trino_q() { # <statement> [<output format>]
  docker compose exec -T trino trino --output-format "${2:-ALIGNED}" --execute "$1" < /dev/null 2>&1 || true
}
trino_debug() { # <statement>: the exception chain and the Iceberg connector frames of a failure
  docker compose exec -T trino trino --debug --execute "$1" < /dev/null 2>&1 \
    | grep -E '^(Query|[a-zA-Z.]+(Exception|Error)|Caused by|	at io\.trino\.plugin\.iceberg)' | head -14 || true
}
trino_sql() { # <sql file> <log>: each statement in turn, with what it returned
  local sql="$1" log="$2" out
  : > "$log"
  grep -v '^--' "$sql" | while IFS= read -r stmt; do
    [[ -z "$stmt" ]] && continue
    if [[ "$stmt" == DEBUG\ * ]]; then
      stmt="${stmt#DEBUG }"
      out="$(docker compose exec -T trino trino --debug --output-format ALIGNED --execute "$stmt" < /dev/null 2>&1 || true)"
      {
        echo; echo "=== $stmt"
        if grep -q '^Query .* failed' <<< "$out"; then
          grep -E '^(Query|[a-zA-Z.]+(Exception|Error)|Caused by|	at io\.trino\.plugin\.iceberg)' <<< "$out" | head -14 || true
        else
          echo "$out"
        fi
      } >> "$log"
      continue
    fi
    { echo; echo "=== $stmt"; trino_q "$stmt"; } >> "$log"
  done
  grep -E '^(===|Query .* failed)' "$log" | cut -c1-220 | sed 's/^/  /'
}
trino_read() { # <label>: every table in tables.txt, with a RESULT line per table
  local label="$1" log="logs/trino-484/$1.txt" t fv rows count verdict results=()
  : > "$log"
  while IFS= read -r t; do
    [[ -z "$t" || "$t" == \#* ]] && continue
    fv="$(trino_q "SHOW CREATE TABLE iceberg.db.$t" TSV | grep -o 'format_version = [0-9]*' || true)"
    rows="$(trino_q "SELECT array_join(array_agg(CAST(id AS varchar) || ':' || v ORDER BY id), ',') FROM iceberg.db.$t" TSV)"
    count="$(trino_q "SELECT count(*) FROM iceberg.db.$t" TSV)"
    if [[ "$rows" == *"failed:"* ]]; then
      verdict="ERROR ${rows#*failed: }"
    elif [[ "$rows" == "$EXPECTED" && "$count" == 9 ]]; then
      verdict="correct, 9 rows"
    else
      verdict="WRONG, rows $rows, count(*) $count"
    fi
    {
      echo; echo "=== read iceberg.db.$t"
      echo "${fv:-format_version not shown}"
      echo "files (content, file_format, files, records):"
      trino_q "SELECT content, file_format, count(*), sum(record_count) FROM iceberg.db.\"$t\$files\" GROUP BY content, file_format ORDER BY content, file_format" TSV | sed 's/^/  /'
      echo "rows: $rows"
      echo "count(*): $count"
      if [[ "$verdict" == ERROR* ]]; then
        trino_debug "SELECT * FROM iceberg.db.$t"
      fi
    } >> "$log"
    results+=("RESULT trino-484 $t: ${verdict:0:300}")
  done < tables.txt
  { echo; echo "######## results"; printf '%s\n' "${results[@]}"; } >> "$log"
  printf '  %s\n' "${results[@]}"
}

step() {
  case "$1" in
  up)
    docker compose up -d
    need "minio rest"
    for _ in $(seq 1 60); do
      if docker compose exec -T minio curl -sf http://rest:8181/v1/config > /dev/null 2>&1; then echo "  REST catalog answers"; break; fi
      sleep 2
    done
    mkdir -p logs
    # shellcheck disable=SC2046 # one argument per image
    docker image inspect --format '{{index .RepoTags 0}} {{.Id}}' \
      $(docker compose --profile spark --profile pyiceberg --profile trino config --images | sort) > logs/00-images.txt
    ;;
  write)
    case "${2:-}" in
      pyiceberg) pyiceberg write-pyiceberg-0.12.0 "$PY_PLAIN" write ;;
      trino) trino_up; trino_sql trino-write.sql logs/trino-484/write.txt; docker compose --profile trino stop trino > /dev/null ;;
      *) spark_line "${2:-}"; spark "$2" write write "$PREFIX" ;;
    esac
    ;;
  errors)
    spark spark-3.5 errors errors
    ;;
  read)
    local label="${3:-read}"
    case "${2:-}" in
      pyiceberg)
        pyiceberg "$label-pyiceberg-0.12.0" "$PY_PLAIN" read pyiceberg-0.12.0
        pyiceberg "$label-pyiceberg-0.12.0-with-pyiceberg-core" "$PY_CORE" read pyiceberg-0.12.0-with-core
        ;;
      trino) trino_up; trino_read "$label"; docker compose --profile trino stop trino > /dev/null ;;
      *) spark_line "${2:-}"; spark "$2" "$label" read "spark-$SPARK-iceberg-$ICEBERG" ;;
    esac
    ;;
  read-no-vectorization)
    spark_line "${2:-}"
    EXTRA=(--conf spark.sql.iceberg.vectorization.enabled=false)
    spark "$2" read-no-vectorization read "spark-$SPARK-iceberg-$ICEBERG-no-vectorization"
    EXTRA=()
    ;;
  diagnose)
    pyiceberg encodings-pyiceberg-0.12.0 "$PY_PLAIN" encodings t_v2_pos s35_v2_pos
    ;;
  fix)
    spark spark-3.5 fix fix
    trino_up; trino_sql trino-fix.sql logs/trino-484/fix.txt; docker compose --profile trino stop trino > /dev/null
    ;;
  copy-v2)
    spark spark-3.5 copy-v2 copy-v2
    spark spark-3.3 read-copy-v2 read spark-3.3.3-iceberg-1.4.3 s35_v3_dv_v2copy
    ;;
  down)
    docker compose --profile spark --profile pyiceberg --profile trino down -v
    ;;
  *)
    sed -n '2,31p' "$0"; exit 1
    ;;
  esac
}

if [[ "${1:-}" == all ]]; then
  for s in up "write spark-3.5" "write spark-4.0" "write spark-3.3" "write pyiceberg" "write trino" errors \
           "read spark-3.5" "read spark-4.0" "read spark-3.3" "read pyiceberg" "read trino" \
           "read-no-vectorization spark-3.3" diagnose fix "read pyiceberg after-fix" "read spark-3.5 after-fix" \
           "read trino after-fix" copy-v2; do
    echo "== $s"
    # shellcheck disable=SC2086 # a step and its argument
    step $s
  done
else
  step "${1:-}" "${2:-}" "${3:-}"
fi
