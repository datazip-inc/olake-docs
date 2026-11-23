EXEC sys.sp_cdc_disable_table @source_schema = N'dbo', @source_name = N'audit_notes', @capture_instance = N'all';
GO
SELECT s.name + N'.' + t.name AS table_name, t.is_tracked_by_cdc
FROM sys.tables t JOIN sys.schemas s ON s.schema_id = t.schema_id
WHERE s.name = N'dbo' AND t.is_ms_shipped = 0 ORDER BY t.name;
GO
EXEC sys.sp_cdc_disable_db;
GO
SELECT name, is_cdc_enabled FROM sys.databases WHERE name = DB_NAME();
SELECT COUNT(*) AS cdc_schema FROM sys.schemas WHERE name = N'cdc';
GO
