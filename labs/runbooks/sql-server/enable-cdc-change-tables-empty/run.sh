#!/usr/bin/env bash
# Lab: enabling change data capture (CDC) on SQL Server, and change tables that stay empty.
#
#   ./run.sh up             start SQL Server with the Agent off, create the lab database
#   ./run.sh enable-db      sys.sp_cdc_enable_db: before, the call, what it creates
#   ./run.sh enable-fails   ways enabling fails (permissions, a cdc schema, a DDL trigger, a lost owner), each with its fix
#   ./run.sh enable-table   sys.sp_cdc_enable_table with the Agent off, and how to verify it
#   ./run.sh empty          write rows: the change table stays empty; what to look at
#   ./run.sh fix-agent      start the Agent: the rows written before are captured
#   ./run.sh jobs           the capture and clean-up jobs, retention, a stopped capture job
#   ./run.sh lsn-range      Msg 313 from cdc.fn_cdc_get_all_changes_..., and the range check that avoids it
#   ./run.sh cleanup        clean-up moves the low end of the range past a reader's saved position
#   ./run.sh schema-change  a new column needs a second capture instance
#   ./run.sh disable        sys.sp_cdc_disable_table and sys.sp_cdc_disable_db
#   ./run.sh down           remove everything, the data volume included
#
# SQL Server 2019 instead of 2022 (set it for every step of a run):
#   MSSQL_IMAGE=mcr.microsoft.com/mssql/server:2019-CU32-GDR13-ubuntu-20.04 ./run.sh up
set -euo pipefail
cd "$(dirname "$0")"

PW=Lab_Passw0rd_2026
say() { printf '\n## %s\n' "$*"; }

sqlcmd_path() { # sqlcmd moved from /opt/mssql-tools to /opt/mssql-tools18 in newer images
  docker compose exec -T mssql /bin/bash -c 'S=/opt/mssql-tools18/bin/sqlcmd; [ -x $S ] || S=/opt/mssql-tools/bin/sqlcmd; echo $S' | tr -d '\r'
}
run_sql() { # file under sql/, starting database: prints each batch, then its results and messages
  # Every batch (the text between two GO lines) runs in its own sqlcmd session. sqlcmd 18.7 answers
  # "SqlState 24000, Invalid cursor state" to everything that follows a failed procedure call in a
  # session that has already returned a result set, and this lab fails procedure calls on purpose.
  # A batch that holds only "USE name;" switches the database for the batches after it.
  local db="${2:-cdclab}" batch="" code line
  while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ "$line" != "GO" ]]; then batch+="$line"$'\n'; continue; fi
    code="$(printf '%s' "$batch" | grep -v -E '^[[:space:]]*(--|$)' || true)"
    if [[ "$code" =~ ^USE[[:space:]]+([A-Za-z0-9_]+)\;$ ]]; then
      db="${BASH_REMATCH[1]}"
    elif [[ -n "$code" ]]; then
      printf '%s' "$batch"
      docker compose exec -T mssql "$SQLCMD" -S localhost -U sa -P "$PW" -C -I -d "$db" -W -s '|' -w 600 -Q "$batch" < /dev/null 2>&1 | tr -d '\r' || true
      echo
    fi
    batch=""
  done < "sql/$1"
}
query() { # database, statement: one result without echo
  docker compose exec -T mssql "$SQLCMD" -S localhost -U sa -P "$PW" -C -I -d "$1" -W -s '|' -w 600 -Q "$2" 2>&1 | tr -d '\r' || true
}
wait_sql() { # until the server answers and has finished recovering its databases
  for _ in $(seq 1 90); do
    if docker compose exec -T mssql "$SQLCMD" -S localhost -U sa -P "$PW" -C -Q "SET NOCOUNT ON; SELECT 1" > /dev/null 2>&1; then return 0; fi
    sleep 2
  done
  echo "  SQL Server did not answer"; return 1
}

case "${1:-}" in
up)
  AGENT=false docker compose up -d --wait
  SQLCMD="$(sqlcmd_path)"; wait_sql
  say "version"
  query master "SET NOCOUNT ON; SELECT @@VERSION AS version; SELECT SERVERPROPERTY('ProductVersion') AS product_version, SERVERPROPERTY('ProductUpdateLevel') AS update_level, SERVERPROPERTY('Edition') AS edition, @@SERVERNAME AS server_name;"
  echo "  sqlcmd: $SQLCMD"
  say "SQL Server Agent setting in this container"
  docker compose exec -T mssql /bin/bash -c 'echo "  MSSQL_AGENT_ENABLED=$MSSQL_AGENT_ENABLED"'
  say "create the lab database"
  docker compose exec -T mssql "$SQLCMD" -S localhost -U sa -P "$PW" -C -I -d master -i /dev/stdin < sql/init.sql 2>&1 | tr -d '\r' || true
  query cdclab "SET NOCOUNT ON; SELECT name, recovery_model_desc, is_cdc_enabled FROM sys.databases WHERE name = N'cdclab'; SELECT (SELECT COUNT(*) FROM dbo.customers) AS customers, (SELECT COUNT(*) FROM dbo.orders) AS orders;"
  ;;
enable-db)
  SQLCMD="$(sqlcmd_path)"; run_sql 01-enable-db.sql
  ;;
enable-fails)
  SQLCMD="$(sqlcmd_path)"
  for f in 02-fail-not-sysadmin.sql 03-fail-cdc-schema.sql 04-fail-ddl-trigger.sql 05-fail-orphan-owner.sql 06-fail-windows-owner.sql; do
    say "$f"; run_sql "$f" master
  done
  ;;
enable-table)
  SQLCMD="$(sqlcmd_path)"; run_sql 07-enable-table.sql
  ;;
empty)
  SQLCMD="$(sqlcmd_path)"; run_sql 08-empty.sql
  ;;
fix-agent)
  say "recreate the container over the same data volume with MSSQL_AGENT_ENABLED=true"
  AGENT=true docker compose up -d --wait
  SQLCMD="$(sqlcmd_path)"; wait_sql
  docker compose exec -T mssql /bin/bash -c 'echo "  MSSQL_AGENT_ENABLED=$MSSQL_AGENT_ENABLED"'
  sleep 25
  run_sql 09-after-agent.sql
  ;;
jobs)
  SQLCMD="$(sqlcmd_path)"; run_sql 10-jobs.sql
  ;;
lsn-range)
  SQLCMD="$(sqlcmd_path)"; run_sql 11-lsn-range.sql
  ;;
cleanup)
  SQLCMD="$(sqlcmd_path)"; run_sql 12-cleanup.sql
  ;;
schema-change)
  SQLCMD="$(sqlcmd_path)"; run_sql 13-schema-change.sql
  ;;
disable)
  SQLCMD="$(sqlcmd_path)"; run_sql 14-disable.sql
  ;;
down)
  docker compose down -v
  ;;
*)
  sed -n '2,18p' "$0"; exit 1
  ;;
esac
