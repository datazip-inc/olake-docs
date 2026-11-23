-- The two jobs and their settings.
EXEC sys.sp_cdc_help_jobs;
GO
-- When each job runs. freq_type 64 starts with SQL Server Agent, freq_type 4 is daily.
SELECT j.name AS agent_job, s.name AS schedule_name, s.freq_type, s.active_start_time
FROM msdb.dbo.sysjobs j
JOIN msdb.dbo.sysjobschedules js ON js.job_id = j.job_id
JOIN msdb.dbo.sysschedules s ON s.schedule_id = js.schedule_id
WHERE j.name LIKE N'cdc.cdclab%' ORDER BY j.name;
GO
-- Retention is in minutes. Change it from 3 days to 7 days.
EXEC sys.sp_cdc_change_job @job_type = N'cleanup', @retention = 10080;
GO
SELECT job_type, retention, threshold FROM msdb.dbo.cdc_jobs
WHERE database_id = DB_ID() AND job_type = N'cleanup';
GO
-- The clean-up job only runs on its schedule, so there is nothing to stop and restart.
EXEC sys.sp_cdc_stop_job @job_type = N'cleanup';
GO
-- A stopped capture job gives the same empty-table symptom while the Agent is running.
EXEC sys.sp_cdc_stop_job @job_type = N'capture';
GO
DECLARE @before INT = (SELECT COUNT(*) FROM cdc.dbo_orders_CT);
INSERT INTO dbo.orders (customer_id, quantity) VALUES (1, 9);
WAITFOR DELAY '00:00:12';
SELECT @before AS rows_before, (SELECT COUNT(*) FROM cdc.dbo_orders_CT) AS rows_after_12_seconds;
GO
SELECT j.name AS agent_job, a.start_execution_date, a.stop_execution_date
FROM msdb.dbo.sysjobs j JOIN msdb.dbo.sysjobactivity a ON a.job_id = j.job_id
WHERE j.name = N'cdc.cdclab_capture' AND a.session_id = (SELECT MAX(session_id) FROM msdb.dbo.syssessions);
GO
-- Fix: start it again. The change made while it was stopped is captured.
EXEC sys.sp_cdc_start_job @job_type = N'capture';
GO
WAITFOR DELAY '00:00:12';
GO
SELECT COUNT(*) AS rows_in_change_table FROM cdc.dbo_orders_CT;
GO
