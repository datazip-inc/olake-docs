#!/bin/bash
# Azure SQL Database: enable CDC, the scheduler that replaces SQL Server Agent, clean-up, and a new column.
# Backs the "Managed services and other tools" section of docs/runbooks/sql-server/enable-cdc-change-tables-empty.mdx.
# The statements are the ones of labs/runbooks/sql-server/enable-cdc-change-tables-empty, adapted where Azure SQL Database differs.
#
#   ./run.sh setup           the lab tables in the database cdclab (created at the S0 service objective)
#   ./run.sh s0              sys.sp_cdc_enable_db at S0
#   ./run.sh scale           S0 to S3, the lowest DTU objective that offers CDC
#   ./run.sh enable          sys.sp_cdc_enable_db and sys.sp_cdc_enable_table
#   ./run.sh capture         no Agent to look at; how soon a change is in the change table
#   ./run.sh jobs            sp_cdc_help_jobs, stopping and starting, sp_cdc_scan, retention
#   ./run.sh lsn-range       Msg 313 from cdc.fn_cdc_get_all_changes_..., six ways
#   ./run.sh cleanup-start   a reader saves its position; retention is set to one minute
#   ./run.sh cleanup-wait    one change every five minutes until the automatic clean-up has moved the minimum LSN
#   ./run.sh cleanup-check   the reader comes back: Msg 313, and the recovery
#   ./run.sh cleanup-by-hand the same with sys.sp_cdc_cleanup_change_table, without waiting
#   ./run.sh schema-change   a new column and a second capture instance, on dbo.customers
#   ./run.sh disable         sys.sp_cdc_disable_table and sys.sp_cdc_disable_db
set -u
HERE=$(cd "$(dirname "$0")" && pwd); . "$HERE/../env.sh"; LOG="$HERE/logs"; mkdir -p "$LOG"
C=rbt-cld-sqlcmd; HOST="tcp:$AZ_SQL.database.windows.net,1433"
stamp() { date -u '+%F %T UTC'; }
say() { printf '\n## %s\n' "$*"; }
cap() { sed -E "s/$AZ_SQL/<server>/g" | tee "$LOG/$1"; }
q() { docker exec "$C" /opt/mssql-tools18/bin/sqlcmd -S "$HOST" -d cdclab -U "$AZ_ADMIN" -N -l 30 -I -W -s '|' -w 600 -Q "$1" < /dev/null 2>&1 | tr -d '\r'; }
run_sql() { # file under sql/: prints each batch (the text between two GO lines), then its results and messages.
  # Every batch runs in its own sqlcmd session, as in the lab, because a failed procedure call spoils the rest of a session.
  local batch="" code line
  while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ "$line" != "GO" ]]; then batch+="$line"$'\n'; continue; fi
    code="$(printf '%s' "$batch" | grep -v -E '^[[:space:]]*(--|$)' || true)"
    if [[ -n "$code" ]]; then printf '%s' "$batch"; q "$batch" || true; echo; fi
    batch=""
  done < "$HERE/sql/$1"
}
head_() { echo "# $1"; echo "# $(stamp), Azure SQL Database, $(q "SET NOCOUNT ON; SELECT CAST(SERVERPROPERTY('ProductVersion') AS varchar(20)) + ', objective ' + CAST(DATABASEPROPERTYEX(DB_NAME(), 'ServiceObjective') AS varchar(10)) + ', ' + CAST(DATABASEPROPERTYEX(DB_NAME(), 'Edition') AS varchar(20))" | sed -n 3p)"; }

case "${1:-}" in
setup)   { head_ "The lab tables"; q "SET NOCOUNT ON; SELECT @@VERSION AS version"; docker exec -i "$C" /opt/mssql-tools18/bin/sqlcmd -S "$HOST" -d cdclab -U "$AZ_ADMIN" -N -l 30 -I -i /dev/stdin < "$HERE/sql/00-init.sql" 2>&1 | tr -d '\r'; q "SET NOCOUNT ON; SELECT name, recovery_model_desc, is_cdc_enabled FROM sys.databases WHERE name = DB_NAME(); SELECT (SELECT COUNT(*) FROM dbo.customers) AS customers, (SELECT COUNT(*) FROM dbo.orders) AS orders;"; } | cap 01-setup.txt ;;
s0)      { head_ "CDC at the S0 service objective"; run_sql 01-s0.sql; } | cap 02-s0.txt ;;
scale)   { head_ "S0 to S3"; echo "\$ az sql db update -g $AZ_RG -s <server> -n cdclab --service-objective S3"; t0=$(date +%s)
           az sql db update --subscription "$AZ_SUB" -g "$AZ_RG" -s "$AZ_SQL" -n cdclab --service-objective S3 --query '{objective:currentServiceObjectiveName, status:status}' -o json 2>&1 | tr -d '\n'; echo "   [$(( $(date +%s) - t0 )) s]"
           q "SET NOCOUNT ON; SELECT DATABASEPROPERTYEX(DB_NAME(), 'ServiceObjective') AS objective"; } | cap 03-scale.txt ;;
enable)  { head_ "Enable CDC for the database and the tables"; run_sql 02-enable-db.sql; run_sql 03-enable-table.sql; } | cap 04-enable.txt ;;
capture) { head_ "No Agent, and how soon a change is captured"; run_sql 04-agent.sql
           say "rows in cdc.dbo_orders_CT, every 5 seconds"
           for i in $(seq 1 16); do echo "$(stamp)  $(q "SET NOCOUNT ON; SELECT CAST(COUNT(*) AS varchar(10)) + ' rows, max LSN ' + ISNULL(CONVERT(varchar(30), sys.fn_cdc_get_max_lsn(), 1), 'NULL') FROM cdc.dbo_orders_CT" | sed -n 3p)"; sleep 5; done
           run_sql 05-after-capture.sql; } | cap 05-capture.txt ;;
jobs)    { head_ "The capture and clean-up jobs"; run_sql 06-jobs.sql; } | cap 06-jobs.txt ;;
lsn-range) { head_ "Msg 313"; run_sql 07-lsn-range.sql; } | cap 07-lsn-range.txt ;;
cleanup-start) { head_ "A reader's saved position, and a retention of one minute"; run_sql 08-cleanup-start.sql; } | cap 08-cleanup-start.txt ;;
cleanup-wait) { head_ "Waiting for the automatic clean-up: one change every five minutes"
           first=$(q "SET NOCOUNT ON; SELECT CONVERT(varchar(30), sys.fn_cdc_get_min_lsn(N'dbo_orders'), 1)" | sed -n 3p); echo "minimum LSN at the start: $first"
           for i in $(seq 1 "${2:-20}"); do
             q "SET NOCOUNT ON; INSERT INTO dbo.orders (customer_id, quantity) VALUES (3, 100 + $i);" >/dev/null; sleep 45
             now=$(q "SET NOCOUNT ON; SELECT CONVERT(varchar(30), sys.fn_cdc_get_min_lsn(N'dbo_orders'), 1) + ' | ' + CAST((SELECT COUNT(*) FROM cdc.dbo_orders_CT) AS varchar(10)) + ' rows | oldest mapping ' + CONVERT(varchar(19), (SELECT MIN(tran_end_time) FROM cdc.lsn_time_mapping), 120)" | sed -n 3p)
             echo "$(stamp)  min LSN $now"
             case "$now" in "$first"*) ;; *) echo "the minimum LSN has moved"; break ;; esac
             sleep 255
           done; } | cap 09-cleanup-wait.txt ;;
cleanup-check) { head_ "The reader comes back after the clean-up"; run_sql 09-cleanup-check.sql; } | cap 10-cleanup-check.txt ;;
cleanup-by-hand) { head_ "Clean-up by hand on another capture instance"; run_sql 10-cleanup-by-hand.sql; } | cap 11-cleanup-by-hand.txt ;;
schema-change) { head_ "A new column on dbo.customers"; run_sql 11-schema-change.sql; } | cap 12-schema-change.txt ;;
disable) { head_ "Disable CDC"; run_sql 12-disable.sql; } | cap 13-disable.txt ;;
*) sed -n '2,19p' "$0" ;;
esac
