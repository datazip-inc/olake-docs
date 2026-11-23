USE cdclab;
GO
-- Can the master user see SQL Server Agent, and is it running?
SELECT servicename, status_desc, startup_type_desc FROM sys.dm_server_services;
GO
SELECT COUNT(*) AS agent_sessions FROM sys.dm_exec_sessions WHERE program_name LIKE N'SQLAgent%';
GO
SELECT name, value_in_use FROM sys.configurations WHERE name = N'Agent XPs';
GO
EXEC master.dbo.xp_servicecontrol N'QUERYSTATE', N'SQLSERVERAGENT';
GO
-- Have the jobs run?
SELECT j.name AS agent_job, j.enabled, a.start_execution_date, a.stop_execution_date
FROM msdb.dbo.sysjobs j LEFT JOIN msdb.dbo.sysjobactivity a ON a.job_id = j.job_id
WHERE j.name LIKE N'cdc.cdclab%' ORDER BY j.name;
GO
-- Can the master user stop the Agent?
EXEC master.dbo.xp_servicecontrol N'STOP', N'SQLSERVERAGENT';
GO
-- How soon is a changed row in the change table? One insert, then a look every second.
DECLARE @before INT = (SELECT COUNT(*) FROM cdc.dbo_orders_CT), @t0 DATETIME2(3) = SYSUTCDATETIME(), @i INT = 0, @now INT;
INSERT INTO dbo.orders (customer_id, quantity) VALUES (1, 5);
WHILE @i < 30
BEGIN
  SET @now = (SELECT COUNT(*) FROM cdc.dbo_orders_CT);
  IF @now > @before BREAK;
  WAITFOR DELAY '00:00:01'; SET @i += 1;
END
SELECT @before AS rows_before, @now AS rows_after, DATEDIFF(MILLISECOND, @t0, SYSUTCDATETIME()) AS waited_ms;
GO
INSERT INTO dbo.orders (customer_id, quantity) VALUES (2, 6);
UPDATE dbo.orders SET quantity = quantity + 10 WHERE id = 1;
DELETE FROM dbo.orders WHERE id = 4;
GO
WAITFOR DELAY '00:00:12';
GO
SELECT COUNT(*) AS rows_in_change_table FROM cdc.dbo_orders_CT;
SELECT sys.fn_cdc_get_max_lsn() AS max_lsn;
GO
SELECT TOP 3 session_id, start_time, end_time, duration, scan_phase, tran_count, command_count, empty_scan_count FROM sys.dm_cdc_log_scan_sessions ORDER BY session_id DESC;
GO
SELECT COUNT(*) AS cdc_errors FROM sys.dm_cdc_errors;
GO
SELECT name, recovery_model_desc, log_reuse_wait_desc FROM sys.databases WHERE name = N'cdclab';
GO
