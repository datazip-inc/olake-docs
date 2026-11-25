SELECT COUNT(*) AS rows_in_change_table FROM cdc.dbo_orders_CT;
SELECT sys.fn_cdc_get_max_lsn() AS max_lsn;
GO
SELECT TOP (6) session_id, start_time, end_time, duration, scan_phase, error_count, tran_count, command_count, empty_scan_count
FROM sys.dm_cdc_log_scan_sessions ORDER BY session_id DESC;
GO
SELECT COUNT(*) AS cdc_errors FROM sys.dm_cdc_errors;
SELECT name, log_reuse_wait_desc FROM sys.databases WHERE name = DB_NAME();
GO
