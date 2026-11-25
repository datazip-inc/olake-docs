SELECT DATABASEPROPERTYEX(DB_NAME(), 'ServiceObjective') AS objective;
SELECT name, is_cdc_enabled FROM sys.databases WHERE name = DB_NAME();
GO
-- A table cannot be enabled before its database.
EXEC sys.sp_cdc_enable_table @source_schema = N'dbo', @source_name = N'orders', @role_name = NULL;
GO
-- Who is calling? A customer login on Azure SQL Database cannot be a sysadmin.
SELECT IS_SRVROLEMEMBER(N'sysadmin') AS is_sysadmin, IS_MEMBER(N'db_owner') AS is_db_owner, USER_NAME() AS user_name;
GO
EXEC sys.sp_cdc_enable_db;
GO
SELECT name, is_cdc_enabled FROM sys.databases WHERE name = DB_NAME();
GO
-- What the call created.
SELECT name, type_desc FROM sys.database_principals WHERE name = N'cdc';
SELECT name AS schema_name FROM sys.schemas WHERE name = N'cdc';
SELECT name AS cdc_table FROM sys.tables WHERE schema_id = SCHEMA_ID(N'cdc') ORDER BY name;
GO
