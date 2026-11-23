USE cdclab;
GO
-- A table cannot be enabled before its database (the runbook's Msg 22901).
EXEC sys.sp_cdc_enable_table @source_schema = N'dbo', @source_name = N'orders', @role_name = NULL;
GO
-- The standard procedure, as the RDS master user.
EXEC sys.sp_cdc_enable_db;
GO
SELECT name, is_cdc_enabled FROM sys.databases WHERE name = N'cdclab';
GO
-- The RDS procedure without an argument, as the OLake connector page and blog post write it.
EXEC msdb.dbo.rds_cdc_enable_db;
GO
-- The RDS procedure with the database name, as the AWS documentation writes it.
EXEC msdb.dbo.rds_cdc_enable_db 'cdclab';
GO
SELECT name, is_cdc_enabled FROM sys.databases WHERE name = N'cdclab';
GO
-- What the call created: the cdc user, the cdc schema and the metadata tables.
SELECT name, type_desc FROM sys.database_principals WHERE name = N'cdc';
SELECT name AS schema_name FROM sys.schemas WHERE name = N'cdc';
SELECT name AS cdc_table FROM sys.tables WHERE schema_id = SCHEMA_ID(N'cdc') ORDER BY name;
GO
-- No table is tracked yet. Do Agent jobs exist yet?
SELECT COUNT(*) AS capture_instances FROM cdc.change_tables;
GO
SELECT COUNT(*) AS cdc_agent_jobs FROM msdb.dbo.sysjobs WHERE name LIKE N'cdc.cdclab%';
GO
SELECT COUNT(*) AS cdc_jobs FROM msdb.dbo.cdc_jobs WHERE database_id = DB_ID();
GO
-- Calling it a second time.
EXEC msdb.dbo.rds_cdc_enable_db 'cdclab';
GO
