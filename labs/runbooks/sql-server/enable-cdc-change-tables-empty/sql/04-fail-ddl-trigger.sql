-- A database-level DDL trigger that writes to a table in master, as audit triggers often do.
USE master;
GO
CREATE DATABASE lab_trigger;
CREATE TABLE dbo.lab_ddl_audit (logged_at DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(), who SYSNAME NOT NULL);
GO
USE lab_trigger;
GO
CREATE TRIGGER lab_audit_ddl ON DATABASE FOR DDL_DATABASE_LEVEL_EVENTS AS
BEGIN
  INSERT INTO master.dbo.lab_ddl_audit (who) VALUES (USER_NAME());
END;
GO
EXEC sys.sp_cdc_enable_db;
GO
SELECT name, is_cdc_enabled FROM sys.databases WHERE name = N'lab_trigger';
GO
-- Fix: disable the trigger, enable CDC, enable the trigger again.
DISABLE TRIGGER lab_audit_ddl ON DATABASE;
GO
EXEC sys.sp_cdc_enable_db;
GO
ENABLE TRIGGER lab_audit_ddl ON DATABASE;
GO
SELECT name, is_cdc_enabled FROM sys.databases WHERE name = N'lab_trigger';
GO
DISABLE TRIGGER lab_audit_ddl ON DATABASE;
GO
EXEC sys.sp_cdc_disable_db;
GO
USE master;
GO
DROP DATABASE lab_trigger;
DROP TABLE dbo.lab_ddl_audit;
GO
