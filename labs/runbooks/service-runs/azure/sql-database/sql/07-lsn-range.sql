-- The valid range for a capture instance: from its minimum LSN to the database maximum LSN.
SELECT sys.fn_cdc_get_min_lsn(N'dbo_orders') AS min_lsn, sys.fn_cdc_get_max_lsn() AS max_lsn;
GO
-- Inside the range: works.
DECLARE @from BINARY(10) = sys.fn_cdc_get_min_lsn(N'dbo_orders'), @to BINARY(10) = sys.fn_cdc_get_max_lsn();
SELECT COUNT(*) AS changes_in_range FROM cdc.fn_cdc_get_all_changes_dbo_orders(@from, @to, N'all');
GO
-- 1. The low end is below the minimum (here: all zeros, which is also what an unknown name returns).
DECLARE @to BINARY(10) = sys.fn_cdc_get_max_lsn();
SELECT COUNT(*) FROM cdc.fn_cdc_get_all_changes_dbo_orders(0x00000000000000000000, @to, N'all');
GO
-- 2. The capture instance name is wrong: schema.table where schema_table is expected.
SELECT sys.fn_cdc_get_min_lsn(N'dbo.orders') AS min_lsn_for_wrong_name;
GO
-- 3. The high end is above the maximum.
DECLARE @from BINARY(10) = sys.fn_cdc_get_min_lsn(N'dbo_orders');
DECLARE @to BINARY(10) = sys.fn_cdc_increment_lsn(sys.fn_cdc_get_max_lsn());
SELECT COUNT(*) FROM cdc.fn_cdc_get_all_changes_dbo_orders(@from, @to, N'all');
GO
-- 4. An end is NULL, as when a time maps to no LSN.
DECLARE @from BINARY(10) = sys.fn_cdc_get_min_lsn(N'dbo_orders');
DECLARE @to BINARY(10) = sys.fn_cdc_map_time_to_lsn(N'largest less than or equal', '2000-01-01');
SELECT @to AS to_lsn_for_a_time_before_cdc;
SELECT COUNT(*) FROM cdc.fn_cdc_get_all_changes_dbo_orders(@from, @to, N'all');
GO
-- 5. The low end is above the high end.
DECLARE @from BINARY(10) = sys.fn_cdc_get_max_lsn(), @to BINARY(10) = sys.fn_cdc_get_min_lsn(N'dbo_orders');
SELECT COUNT(*) FROM cdc.fn_cdc_get_all_changes_dbo_orders(@from, @to, N'all');
GO
-- 6. The row filter option is not one the function knows.
DECLARE @from BINARY(10) = sys.fn_cdc_get_min_lsn(N'dbo_orders'), @to BINARY(10) = sys.fn_cdc_get_max_lsn();
SELECT COUNT(*) FROM cdc.fn_cdc_get_all_changes_dbo_orders(@from, @to, N'everything');
GO
-- The check a reader should make before every call. It then saves the high end as its position.
DECLARE @saved BINARY(10) = (SELECT last_lsn FROM dbo.reader_position WHERE reader = N'lab');
DECLARE @min BINARY(10) = sys.fn_cdc_get_min_lsn(N'dbo_orders'), @max BINARY(10) = sys.fn_cdc_get_max_lsn();
DECLARE @from BINARY(10) = CASE WHEN @saved IS NULL THEN @min ELSE sys.fn_cdc_increment_lsn(@saved) END;
IF @max IS NULL
  PRINT 'No maximum LSN yet: the capture job has never run.';
ELSE IF @from < @min
  PRINT 'The saved position is older than the minimum LSN: changes were cleaned up. Reload the table.';
ELSE IF @from > @max
  PRINT 'Nothing new since the saved position.';
ELSE
BEGIN
  SELECT COUNT(*) AS changes_read FROM cdc.fn_cdc_get_all_changes_dbo_orders(@from, @max, N'all');
  MERGE dbo.reader_position AS p USING (SELECT N'lab' AS reader) AS s ON p.reader = s.reader
  WHEN MATCHED THEN UPDATE SET last_lsn = @max, saved_at = SYSUTCDATETIME()
  WHEN NOT MATCHED THEN INSERT (reader, last_lsn) VALUES (N'lab', @max);
END;
GO
SELECT reader, last_lsn FROM dbo.reader_position;
GO
