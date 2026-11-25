#!/bin/bash
# With the capture job of dmslab stopped, does the transaction log wait for it, and does DMS still deliver?
# Stops the capture job, writes rows once a minute, prints log_reuse_wait_desc and the log space used,
# then starts the job again and keeps printing.
set -u
HERE=$(cd "$(dirname "$0")/.." && pwd); source "$HERE/env.sh"; source "$HERE/lib.sh"; source "$HERE/mysql-common.sh"
q() { docker exec -i rbt-awsm-sqlcmd /opt/mssql-tools18/bin/sqlcmd -S "$RB_MSSQL_HOST,1433" -U "$RB_MASTER" -C -I -d dmslab -W -h -1 -s '|' -Q "SET NOCOUNT ON; $1" 2>&1 | tr -d '\r' | grep -v '^$' | sed -E 's/EC2AMAZ-[A-Z0-9]+/<host>/g'; }
line() {
  q "INSERT INTO dbo.orders (customer_id, quantity, note) SELECT TOP 200 1, 1, REPLICATE(N'x', 50) FROM sys.all_objects;" >/dev/null
  local src tgt st
  src=$(q "SELECT COUNT(*) FROM dbo.orders")
  st=$(q "SELECT d.log_reuse_wait_desc, CAST(ls.used_log_space_in_percent AS DECIMAL(5,1)), CAST(ls.total_log_size_in_bytes/1048576.0 AS DECIMAL(8,1)), (SELECT COUNT(*) FROM cdc.dbo_orders_v2_CT), CONVERT(VARCHAR(8), (SELECT MAX(backup_finish_date) FROM msdb.dbo.backupset WHERE database_name = N'dmslab' AND type = 'L'), 108) FROM sys.databases d CROSS JOIN sys.dm_db_log_space_usage ls WHERE d.name = N'dmslab'")
  sleep 8
  tgt=$(sql_val "$RB_AMYSQL_HOST" "SELECT COUNT(*) FROM dms_from_mssql.orders" 2>&1 | tail -1)
  echo "$(stamp) $1 | log_reuse_wait, log used %, log size MB, rows in change table v2, last log backup: $st | source rows $src, target rows $tgt"
}
echo "=== $(stamp) stop the capture job of dmslab"; q "EXEC sys.sp_cdc_stop_job @job_type = N'capture'"
for i in $(seq 1 "${1:-9}"); do line "capture stopped, minute $i"; sleep 50; done
echo "=== $(stamp) start the capture job again"; q "EXEC sys.sp_cdc_start_job @job_type = N'capture'"
for i in $(seq 1 "${2:-7}"); do line "capture running, minute $i"; sleep 50; done
echo "=== $(stamp) done"
