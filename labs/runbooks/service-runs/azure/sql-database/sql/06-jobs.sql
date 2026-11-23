-- The two jobs and their settings.
EXEC sys.sp_cdc_help_jobs;
GO
-- Stopping and starting the capture job, as on SQL Server.
EXEC sys.sp_cdc_stop_job @job_type = N'capture';
GO
DECLARE @before INT = (SELECT COUNT(*) FROM cdc.dbo_orders_CT);
INSERT INTO dbo.orders (customer_id, quantity) VALUES (1, 9);
WAITFOR DELAY '00:00:50';
SELECT @before AS rows_before, (SELECT COUNT(*) FROM cdc.dbo_orders_CT) AS rows_after_50_seconds;
GO
EXEC sys.sp_cdc_start_job @job_type = N'capture';
GO
-- One scan by hand.
EXEC sys.sp_cdc_scan @maxtrans = 500, @maxscans = 10, @continuous = 0;
GO
SELECT COUNT(*) AS rows_in_change_table FROM cdc.dbo_orders_CT;
GO
-- The capture settings of SQL Server.
EXEC sys.sp_cdc_change_job @job_type = N'capture', @pollinginterval = 5;
GO
-- Retention is in minutes. Change it from 3 days to 7 days.
EXEC sys.sp_cdc_change_job @job_type = N'cleanup', @retention = 10080;
GO
EXEC sys.sp_cdc_help_jobs;
GO
-- Running the clean-up job by hand.
EXEC sys.sp_cdc_start_job @job_type = N'cleanup';
GO
