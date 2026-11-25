-- What is left after the automatic clean-up.
SELECT COUNT(*) AS rows_in_change_table FROM cdc.dbo_orders_CT;
SELECT sys.fn_cdc_get_min_lsn(N'dbo_orders') AS min_lsn, sys.fn_cdc_get_max_lsn() AS max_lsn, SYSUTCDATETIME() AS now_utc;
GO
SELECT MIN(tran_end_time) AS oldest_mapping, MAX(tran_end_time) AS newest_mapping, COUNT(*) AS mappings FROM cdc.lsn_time_mapping;
GO
-- The reader comes back and asks for everything after its saved position.
DECLARE @saved BINARY(10) = (SELECT last_lsn FROM dbo.reader_position WHERE reader = N'lab');
DECLARE @from BINARY(10) = sys.fn_cdc_increment_lsn(@saved), @to BINARY(10) = sys.fn_cdc_get_max_lsn();
SELECT @from AS from_lsn, sys.fn_cdc_get_min_lsn(N'dbo_orders') AS min_lsn;
SELECT COUNT(*) FROM cdc.fn_cdc_get_all_changes_dbo_orders(@from, @to, N'all');
GO
-- Recovery: read the source table again, then carry on from the current maximum.
DECLARE @max BINARY(10) = sys.fn_cdc_get_max_lsn();
SELECT COUNT(*) AS rows_reloaded_from_source FROM dbo.orders;
UPDATE dbo.reader_position SET last_lsn = @max, saved_at = SYSUTCDATETIME() WHERE reader = N'lab';
GO
INSERT INTO dbo.orders (customer_id, quantity) VALUES (4, 13);
GO
WAITFOR DELAY '00:00:40';
GO
DECLARE @saved BINARY(10) = (SELECT last_lsn FROM dbo.reader_position WHERE reader = N'lab');
DECLARE @from BINARY(10) = sys.fn_cdc_increment_lsn(@saved), @to BINARY(10) = sys.fn_cdc_get_max_lsn();
SELECT __$operation, id, customer_id, quantity FROM cdc.fn_cdc_get_all_changes_dbo_orders(@from, @to, N'all');
GO
-- Back to seven days.
EXEC sys.sp_cdc_change_job @job_type = N'cleanup', @retention = 10080;
GO
