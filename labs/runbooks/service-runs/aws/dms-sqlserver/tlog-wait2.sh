#!/bin/bash
# The same question as tlog-wait.sh with enough writes to need log space again: the capture job is
# stopped, 60,000 rows are written, and the state is printed once a minute across two of the log
# backups that RDS takes every five minutes. Then the capture job is started and the same is printed.
set -u
HERE=$(cd "$(dirname "$0")/.." && pwd); source "$HERE/env.sh"; source "$HERE/lib.sh"; source "$HERE/mysql-common.sh"
q() { docker exec -i rbt-awsm-sqlcmd /opt/mssql-tools18/bin/sqlcmd -S "$RB_MSSQL_HOST,1433" -U "$RB_MASTER" -C -I -d dmslab -W -h -1 -s '|' -Q "SET NOCOUNT ON; $1" 2>&1 | tr -d '\r' | grep -v '^$' | sed -E 's/EC2AMAZ-[A-Z0-9]+/<host>/g'; }
line() {
  local st tgt
  st=$(q "SELECT d.log_reuse_wait_desc, CAST(ls.used_log_space_in_percent AS DECIMAL(5,1)), CAST(ls.total_log_size_in_bytes/1048576.0 AS DECIMAL(8,1)), (SELECT COUNT(*) FROM sys.dm_db_log_info(DB_ID()) WHERE vlf_active = 1), (SELECT COUNT(*) FROM sys.dm_db_log_info(DB_ID())), (SELECT COUNT(*) FROM cdc.dbo_orders_v2_CT), CONVERT(VARCHAR(8), (SELECT MAX(backup_finish_date) FROM msdb.dbo.backupset WHERE database_name = N'dmslab' AND type = 'L'), 108), (SELECT COUNT(*) FROM dbo.orders) FROM sys.databases d CROSS JOIN sys.dm_db_log_space_usage ls WHERE d.name = N'dmslab'")
  tgt=$(sql_val "$RB_AMYSQL_HOST" "SELECT COUNT(*) FROM dms_from_mssql.orders" 2>&1 | tail -1)
  echo "$(stamp) $1 | log_reuse_wait, log used %, log size MB, active VLFs, all VLFs, rows in change table v2, last log backup, source rows: $st | target rows $tgt"
}
line "before"
echo "=== $(stamp) stop the capture job of dmslab, then write 60,000 rows in 6 statements"; q "EXEC sys.sp_cdc_stop_job @job_type = N'capture'"
for b in 1 2 3 4 5 6; do q "INSERT INTO dbo.orders (customer_id, quantity, note) SELECT TOP 10000 1, 1, REPLICATE(N'x', 50) FROM sys.all_objects a CROSS JOIN sys.all_objects b;" >/dev/null; done
for i in $(seq 1 "${1:-12}"); do line "capture stopped, minute $i"; sleep 57; done
echo "=== $(stamp) start the capture job again"; q "EXEC sys.sp_cdc_start_job @job_type = N'capture'"
for i in $(seq 1 "${2:-8}"); do line "capture running, minute $i"; sleep 57; done
echo "=== $(stamp) done"
