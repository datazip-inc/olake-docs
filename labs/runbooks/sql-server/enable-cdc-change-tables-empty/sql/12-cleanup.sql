-- The reader saved its position in the previous step.
SELECT reader, last_lsn FROM dbo.reader_position;
GO
-- Two changes arrive while the reader is away.
INSERT INTO dbo.orders (customer_id, quantity) VALUES (2, 11);
GO
UPDATE dbo.orders SET quantity = quantity + 1 WHERE id = 2;
GO
WAITFOR DELAY '00:00:10';
GO
SELECT COUNT(*) AS rows_in_change_table FROM cdc.dbo_orders_CT;
SELECT sys.fn_cdc_get_min_lsn(N'dbo_orders') AS min_lsn, sys.fn_cdc_get_max_lsn() AS max_lsn;
GO
-- Retention of one minute instead of days, so that the lab does not have to wait.
EXEC sys.sp_cdc_change_job @job_type = N'cleanup', @retention = 1;
GO
-- More than a minute later, one more change.
WAITFOR DELAY '00:01:10';
GO
INSERT INTO dbo.orders (customer_id, quantity) VALUES (3, 12);
GO
WAITFOR DELAY '00:00:10';
GO
-- Run the clean-up job now instead of waiting for 02:00.
EXEC sys.sp_cdc_start_job @job_type = N'cleanup';
GO
WAITFOR DELAY '00:00:10';
GO
-- What is left. Retention counts back from the newest captured change, not from the clock.
SELECT start_lsn, tran_end_time FROM cdc.lsn_time_mapping ORDER BY start_lsn;
GO
SELECT COUNT(*) AS rows_in_change_table FROM cdc.dbo_orders_CT;
SELECT sys.fn_cdc_get_min_lsn(N'dbo_orders') AS min_lsn, sys.fn_cdc_get_max_lsn() AS max_lsn;
GO
-- The reader comes back and asks for everything after its saved position.
DECLARE @saved BINARY(10) = (SELECT last_lsn FROM dbo.reader_position WHERE reader = N'lab');
DECLARE @from BINARY(10) = sys.fn_cdc_increment_lsn(@saved), @to BINARY(10) = sys.fn_cdc_get_max_lsn();
SELECT @from AS from_lsn, sys.fn_cdc_get_min_lsn(N'dbo_orders') AS min_lsn;
SELECT COUNT(*) FROM cdc.fn_cdc_get_all_changes_dbo_orders(@from, @to, N'all');
GO
-- Recovery: changes between the saved position and the new minimum are gone from the change
-- table. Read the source table again, then carry on from the current maximum.
DECLARE @max BINARY(10) = sys.fn_cdc_get_max_lsn();
SELECT COUNT(*) AS rows_reloaded_from_source FROM dbo.orders;
UPDATE dbo.reader_position SET last_lsn = @max, saved_at = SYSUTCDATETIME() WHERE reader = N'lab';
GO
INSERT INTO dbo.orders (customer_id, quantity) VALUES (4, 13);
GO
WAITFOR DELAY '00:00:10';
GO
DECLARE @saved BINARY(10) = (SELECT last_lsn FROM dbo.reader_position WHERE reader = N'lab');
DECLARE @from BINARY(10) = sys.fn_cdc_increment_lsn(@saved), @to BINARY(10) = sys.fn_cdc_get_max_lsn();
SELECT __$operation, id, customer_id, quantity FROM cdc.fn_cdc_get_all_changes_dbo_orders(@from, @to, N'all');
GO
-- Back to seven days.
EXEC sys.sp_cdc_change_job @job_type = N'cleanup', @retention = 10080;
GO
