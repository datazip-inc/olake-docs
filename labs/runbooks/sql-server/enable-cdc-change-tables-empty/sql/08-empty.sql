-- Changes made after the table was enabled.
INSERT INTO dbo.orders (customer_id, quantity) VALUES (1, 5), (2, 6);
UPDATE dbo.orders SET quantity = quantity + 10 WHERE id = 1;
DELETE FROM dbo.orders WHERE id = 4;
GO
-- Three polling intervals of the capture job.
WAITFOR DELAY '00:00:15';
GO
SELECT COUNT(*) AS rows_in_change_table FROM cdc.dbo_orders_CT;
SELECT sys.fn_cdc_get_max_lsn() AS max_lsn;
SELECT COUNT(*) AS log_scan_sessions FROM sys.dm_cdc_log_scan_sessions;
SELECT COUNT(*) AS cdc_errors FROM sys.dm_cdc_errors;
GO
-- Is SQL Server Agent running? It keeps sessions open when it is.
SELECT COUNT(*) AS agent_sessions FROM sys.dm_exec_sessions WHERE program_name LIKE N'SQLAgent%';
SELECT name, value_in_use FROM sys.configurations WHERE name = N'Agent XPs';
GO
SELECT servicename, status_desc, startup_type_desc FROM sys.dm_server_services;
GO
-- The jobs exist. Have they ever run?
SELECT j.name AS agent_job, j.enabled, a.start_execution_date, a.stop_execution_date
FROM msdb.dbo.sysjobs j LEFT JOIN msdb.dbo.sysjobactivity a ON a.job_id = j.job_id
WHERE j.name LIKE N'cdc.cdclab%' ORDER BY j.name;
GO
-- Starting the capture job by hand needs the Agent too.
EXEC sys.sp_cdc_start_job @job_type = N'capture';
GO
-- The log cannot be truncated past changes that capture has not read.
CHECKPOINT;
GO
SELECT name, recovery_model_desc, log_reuse_wait_desc FROM sys.databases WHERE name = N'cdclab';
GO
-- One scan by hand shows the changes were in the log all along.
EXEC sys.sp_cdc_scan @maxtrans = 500, @maxscans = 10, @continuous = 0;
GO
SELECT COUNT(*) AS rows_in_change_table FROM cdc.dbo_orders_CT;
SELECT sys.fn_cdc_get_max_lsn() AS max_lsn;
GO
-- A second batch of changes: nothing scans the log again.
INSERT INTO dbo.orders (customer_id, quantity) VALUES (3, 7);
GO
WAITFOR DELAY '00:00:15';
GO
SELECT COUNT(*) AS rows_in_change_table FROM cdc.dbo_orders_CT;
GO
