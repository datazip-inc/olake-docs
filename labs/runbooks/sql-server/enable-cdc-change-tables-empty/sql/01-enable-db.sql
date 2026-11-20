-- Before: is CDC on for this database, and who owns it?
SELECT name, is_cdc_enabled, SUSER_SNAME(owner_sid) AS owner FROM sys.databases WHERE name = N'cdclab';
GO
-- A table cannot be enabled before its database.
EXEC sys.sp_cdc_enable_table @source_schema = N'dbo', @source_name = N'orders', @role_name = NULL;
GO
-- Enable CDC for the database. The caller must be a member of the sysadmin server role.
EXEC sys.sp_cdc_enable_db;
GO
SELECT name, is_cdc_enabled FROM sys.databases WHERE name = N'cdclab';
GO
-- What the call created: the cdc user, the cdc schema and the metadata tables.
SELECT name, type_desc FROM sys.database_principals WHERE name = N'cdc';
SELECT name AS schema_name FROM sys.schemas WHERE name = N'cdc';
SELECT name AS cdc_table FROM sys.tables WHERE schema_id = SCHEMA_ID(N'cdc') ORDER BY name;
GO
-- No table is tracked yet, and no Agent job exists yet.
SELECT COUNT(*) AS capture_instances FROM cdc.change_tables;
SELECT COUNT(*) AS cdc_agent_jobs FROM msdb.dbo.sysjobs WHERE name LIKE N'cdc.cdclab%';
GO
-- The job settings table in msdb is created with the first job.
SELECT COUNT(*) AS cdc_jobs FROM msdb.dbo.cdc_jobs WHERE database_id = DB_ID();
GO
