-- What the user of the connector page can read.
USE cdclab;
GO
SELECT SUSER_SNAME() AS login_name, USER_NAME() AS database_user;
GO
SELECT capture_instance FROM cdc.change_tables ORDER BY capture_instance;
GO
SELECT COUNT(*) AS rows_in_change_table FROM cdc.dbo_orders_CT;
GO
SELECT sys.fn_cdc_get_max_lsn() AS max_lsn;
GO
SELECT job_type, pollinginterval, retention FROM msdb.dbo.cdc_jobs WHERE database_id = DB_ID() ORDER BY job_type;
GO
SELECT TOP 1 session_id, scan_phase, end_time FROM sys.dm_cdc_log_scan_sessions ORDER BY session_id DESC;
GO
SELECT is_cdc_enabled FROM sys.databases WHERE name = N'cdclab';
GO
