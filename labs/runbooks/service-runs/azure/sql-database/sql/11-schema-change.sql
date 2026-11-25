-- The capture instance and the columns it captures.
SELECT ct.capture_instance, cc.column_name, cc.column_type
FROM cdc.change_tables ct JOIN cdc.captured_columns cc ON cc.object_id = ct.object_id
WHERE ct.source_object_id = OBJECT_ID(N'dbo.customers') ORDER BY ct.capture_instance, cc.column_ordinal;
GO
-- A column is added to the source table, and a row is written with it.
ALTER TABLE dbo.customers ADD note NVARCHAR(50) NULL;
GO
INSERT INTO dbo.customers (first_name, last_name, email, note) VALUES (N'Before', N'Instance', N'before@example.com', N'written before the new capture instance');
GO
WAITFOR DELAY '00:00:40';
GO
UPDATE dbo.customers SET note = N'only the note changes' WHERE id = 1;
GO
WAITFOR DELAY '00:00:40';
GO
SELECT __$operation, id, first_name FROM cdc.dbo_customers_CT WHERE id = 1;
GO
-- The change table did not get the column. The change is there, the note is not.
SELECT ct.capture_instance, cc.column_name
FROM cdc.change_tables ct JOIN cdc.captured_columns cc ON cc.object_id = ct.object_id
WHERE ct.source_object_id = OBJECT_ID(N'dbo.customers') ORDER BY ct.capture_instance, cc.column_ordinal;
GO
SELECT TOP (1) * FROM cdc.dbo_customers_CT ORDER BY __$start_lsn DESC;
GO
-- SQL Server recorded the DDL.
SELECT OBJECT_NAME(source_object_id) AS source_table, required_column_update, ddl_command, ddl_time
FROM cdc.ddl_history;
GO
-- A second capture instance picks up the table as it is now.
EXEC sys.sp_cdc_enable_table
  @source_schema = N'dbo', @source_name = N'customers',
  @role_name = NULL, @supports_net_changes = 1,
  @capture_instance = N'dbo_customers_v2';
GO
INSERT INTO dbo.customers (first_name, last_name, email, note) VALUES (N'After', N'Instance', N'after@example.com', N'written after the new capture instance');
GO
WAITFOR DELAY '00:00:40';
GO
SELECT capture_instance, start_lsn FROM cdc.change_tables
WHERE source_object_id = OBJECT_ID(N'dbo.customers') ORDER BY capture_instance;
GO
-- The old instance: both rows, no note. The new instance: only the row written after it existed.
SELECT __$operation, id, first_name FROM cdc.dbo_customers_CT WHERE id IN (SELECT id FROM dbo.customers WHERE note IS NOT NULL);
SELECT __$operation, id, first_name, note FROM cdc.dbo_customers_v2_CT;
GO
-- The source table has both notes.
SELECT id, first_name, note FROM dbo.customers WHERE note IS NOT NULL;
GO
-- A table can have two capture instances, not three.
EXEC sys.sp_cdc_enable_table
  @source_schema = N'dbo', @source_name = N'customers',
  @role_name = NULL, @capture_instance = N'dbo_customers_v3';
GO
-- Once every reader has moved to the new instance, drop the old one.
EXEC sys.sp_cdc_disable_table
  @source_schema = N'dbo', @source_name = N'customers', @capture_instance = N'dbo_customers';
GO
SELECT capture_instance FROM cdc.change_tables WHERE source_object_id = OBJECT_ID(N'dbo.customers');
GO
-- Other changes to the source table: a dropped column and a changed type.
ALTER TABLE dbo.customers DROP COLUMN note;
GO
ALTER TABLE dbo.customers ALTER COLUMN last_name NVARCHAR(200) NOT NULL;
GO
INSERT INTO dbo.customers (first_name, last_name, email) VALUES (N'Later', N'Row', N'later@example.com');
GO
WAITFOR DELAY '00:00:40';
GO
SELECT cc.column_name, cc.column_type
FROM cdc.change_tables ct JOIN cdc.captured_columns cc ON cc.object_id = ct.object_id
WHERE ct.capture_instance = N'dbo_customers_v2' ORDER BY cc.column_ordinal;
GO
SELECT c.name AS change_table_column, TYPE_NAME(c.user_type_id) AS type_name
FROM sys.columns c WHERE c.object_id = OBJECT_ID(N'cdc.dbo_customers_v2_CT') AND c.name NOT LIKE N'[_][_]$%' ORDER BY c.column_id;
GO
SELECT TOP (1) __$operation, id, last_name, note FROM cdc.dbo_customers_v2_CT ORDER BY __$start_lsn DESC;
GO
SELECT OBJECT_NAME(source_object_id) AS source_table, required_column_update, ddl_command
FROM cdc.ddl_history ORDER BY ddl_time;
GO
SELECT COUNT(*) AS cdc_errors FROM sys.dm_cdc_errors;
GO
