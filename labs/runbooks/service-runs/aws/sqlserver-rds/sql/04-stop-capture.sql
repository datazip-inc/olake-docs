USE cdclab;
GO
-- The Agent cannot be stopped by the master user, but the capture job can. This is the nearest
-- thing to "the Agent is not running" that RDS allows.
EXEC sys.sp_cdc_stop_job @job_type = N'capture';
GO
SELECT COUNT(*) AS rows_in_change_table_before FROM cdc.dbo_orders_CT;
GO
INSERT INTO dbo.orders (customer_id, quantity) VALUES (3, 7), (4, 8);
GO
WAITFOR DELAY '00:00:15';
GO
SELECT COUNT(*) AS rows_in_change_table_15s_later FROM cdc.dbo_orders_CT;
SELECT sys.fn_cdc_get_max_lsn() AS max_lsn;
GO
SELECT j.name AS agent_job, a.start_execution_date, a.stop_execution_date
FROM msdb.dbo.sysjobs j LEFT JOIN msdb.dbo.sysjobactivity a ON a.job_id = j.job_id
WHERE j.name LIKE N'cdc.cdclab_capture%' ORDER BY a.start_execution_date DESC;
GO
CHECKPOINT;
GO
SELECT name, log_reuse_wait_desc FROM sys.databases WHERE name = N'cdclab';
GO
SELECT COUNT(*) AS cdc_errors FROM sys.dm_cdc_errors;
GO
-- One scan by hand, as on a self-hosted server.
EXEC sys.sp_cdc_scan @maxtrans = 500, @maxscans = 10, @continuous = 0;
GO
SELECT COUNT(*) AS rows_in_change_table_after_manual_scan FROM cdc.dbo_orders_CT;
GO
INSERT INTO dbo.orders (customer_id, quantity) VALUES (1, 9);
GO
EXEC sys.sp_cdc_start_job @job_type = N'capture';
GO
WAITFOR DELAY '00:00:12';
GO
SELECT COUNT(*) AS rows_in_change_table_after_start FROM cdc.dbo_orders_CT;
GO
SELECT name, log_reuse_wait_desc FROM sys.databases WHERE name = N'cdclab';
GO
