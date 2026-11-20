-- SQL Server Agent is running now.
SELECT servicename, status_desc, startup_type_desc FROM sys.dm_server_services;
GO
SELECT COUNT(*) AS agent_sessions FROM sys.dm_exec_sessions WHERE program_name LIKE N'SQLAgent%';
SELECT name, value_in_use FROM sys.configurations WHERE name = N'Agent XPs';
GO
SELECT j.name AS agent_job, a.start_execution_date, a.stop_execution_date
FROM msdb.dbo.sysjobs j LEFT JOIN msdb.dbo.sysjobactivity a ON a.job_id = j.job_id
WHERE j.name LIKE N'cdc.cdclab%' AND a.session_id = (SELECT MAX(session_id) FROM msdb.dbo.syssessions)
ORDER BY j.name;
GO
-- The row written while nothing was scanning the log has been captured.
SELECT COUNT(*) AS rows_in_change_table FROM cdc.dbo_orders_CT;
GO
SELECT __$start_lsn, __$operation, id, customer_id, quantity
FROM cdc.dbo_orders_CT ORDER BY __$start_lsn, __$seqval, __$operation;
GO
-- A new change arrives within one polling interval, with no manual step.
INSERT INTO dbo.orders (customer_id, quantity) VALUES (4, 8);
GO
WAITFOR DELAY '00:00:10';
GO
SELECT COUNT(*) AS rows_in_change_table FROM cdc.dbo_orders_CT;
SELECT sys.fn_cdc_get_max_lsn() AS max_lsn;
GO
SELECT TOP (3) session_id, start_time, end_time, tran_count, command_count, latency
FROM sys.dm_cdc_log_scan_sessions ORDER BY session_id DESC;
GO
CHECKPOINT;
GO
SELECT name, log_reuse_wait_desc FROM sys.databases WHERE name = N'cdclab';
GO
