-- The database is at the S0 service objective.
SELECT DATABASEPROPERTYEX(DB_NAME(), 'ServiceObjective') AS objective, DATABASEPROPERTYEX(DB_NAME(), 'Edition') AS edition;
GO
EXEC sys.sp_cdc_enable_db;
GO
SELECT name, is_cdc_enabled FROM sys.databases WHERE name = DB_NAME();
GO
