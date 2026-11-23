-- The reader saved its position in the previous step.
SELECT reader, last_lsn, saved_at FROM dbo.reader_position;
GO
-- Two changes arrive while the reader is away.
INSERT INTO dbo.orders (customer_id, quantity) VALUES (2, 11);
GO
UPDATE dbo.orders SET quantity = quantity + 1 WHERE id = 2;
GO
WAITFOR DELAY '00:00:40';
GO
SELECT COUNT(*) AS rows_in_change_table FROM cdc.dbo_orders_CT;
SELECT sys.fn_cdc_get_min_lsn(N'dbo_orders') AS min_lsn, sys.fn_cdc_get_max_lsn() AS max_lsn, SYSUTCDATETIME() AS now_utc;
GO
-- Retention of one minute instead of days. Azure runs the clean-up by itself; this run waits for it.
EXEC sys.sp_cdc_change_job @job_type = N'cleanup', @retention = 1;
GO
EXEC sys.sp_cdc_help_jobs;
GO
