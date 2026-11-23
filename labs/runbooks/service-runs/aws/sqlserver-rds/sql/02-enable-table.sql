USE cdclab;
GO
-- One capture instance per table. With no @capture_instance the name is <schema>_<table>.
EXEC sys.sp_cdc_enable_table
  @source_schema = N'dbo', @source_name = N'orders',
  @role_name = NULL, @supports_net_changes = 1;
GO
EXEC sys.sp_cdc_enable_table
  @source_schema = N'dbo', @source_name = N'customers',
  @role_name = NULL, @supports_net_changes = 1;
GO
-- A table with no primary key: net changes need a key (the runbook's Msg 22939).
EXEC sys.sp_cdc_enable_table
  @source_schema = N'dbo', @source_name = N'audit_notes',
  @role_name = NULL, @supports_net_changes = 1;
GO
-- All changes do not.
EXEC sys.sp_cdc_enable_table
  @source_schema = N'dbo', @source_name = N'audit_notes',
  @role_name = NULL, @supports_net_changes = 0;
GO
SELECT s.name + N'.' + t.name AS table_name, t.is_tracked_by_cdc
FROM sys.tables t JOIN sys.schemas s ON s.schema_id = t.schema_id
WHERE s.name = N'dbo' AND t.is_ms_shipped = 0 ORDER BY t.name;
GO
SELECT capture_instance,
       OBJECT_SCHEMA_NAME(source_object_id) + N'.' + OBJECT_NAME(source_object_id) AS source_table,
       supports_net_changes, start_lsn
FROM cdc.change_tables ORDER BY capture_instance;
GO
-- The job defaults, against the table in the runbook.
EXEC sys.sp_cdc_help_jobs;
GO
SELECT job_type, maxtrans, maxscans, continuous, pollinginterval, retention, threshold
FROM msdb.dbo.cdc_jobs WHERE database_id = DB_ID() ORDER BY job_type;
GO
SELECT name AS agent_job, enabled FROM msdb.dbo.sysjobs WHERE name LIKE N'cdc.cdclab%' ORDER BY name;
GO
