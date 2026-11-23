USE cdclab;
GO
-- Turn CDC off again: one table, then the whole database.
EXEC sys.sp_cdc_disable_table
  @source_schema = N'dbo', @source_name = N'customers', @capture_instance = N'all';
GO
SELECT s.name + N'.' + t.name AS table_name, t.is_tracked_by_cdc
FROM sys.tables t JOIN sys.schemas s ON s.schema_id = t.schema_id
WHERE s.name = N'dbo' AND t.is_ms_shipped = 0 ORDER BY t.name;
GO
-- The standard procedure, as the RDS master user.
EXEC sys.sp_cdc_disable_db;
GO
SELECT name, is_cdc_enabled FROM sys.databases WHERE name = N'cdclab';
GO
-- The RDS procedure.
EXEC msdb.dbo.rds_cdc_disable_db 'cdclab';
GO
SELECT name, is_cdc_enabled FROM sys.databases WHERE name = N'cdclab';
SELECT COUNT(*) AS cdc_schema FROM sys.schemas WHERE name = N'cdc';
GO
SELECT COUNT(*) AS cdc_agent_jobs FROM msdb.dbo.sysjobs WHERE name LIKE N'cdc.cdclab%';
GO
