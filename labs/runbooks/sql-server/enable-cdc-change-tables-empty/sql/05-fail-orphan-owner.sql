-- A database whose owner no longer maps to a login, as after a restore on another server.
USE master;
GO
CREATE LOGIN lab_gone WITH PASSWORD = N'Lab_Passw0rd_2026', CHECK_POLICY = OFF;
CREATE DATABASE lab_owner;
GO
ALTER AUTHORIZATION ON DATABASE::lab_owner TO lab_gone;
GO
BACKUP DATABASE lab_owner TO DISK = N'/var/opt/mssql/data/lab_owner.bak' WITH INIT;
GO
DROP DATABASE lab_owner;
DROP LOGIN lab_gone;
GO
RESTORE DATABASE lab_owner FROM DISK = N'/var/opt/mssql/data/lab_owner.bak';
GO
-- The owner recorded in master, and the login behind dbo inside the database.
SELECT name, SUSER_SNAME(owner_sid) AS owner_in_master FROM sys.databases WHERE name = N'lab_owner';
GO
USE lab_owner;
GO
SELECT name, SUSER_SNAME(sid) AS login_behind_dbo FROM sys.database_principals WHERE name = N'dbo';
GO
EXEC sys.sp_cdc_enable_db;
GO
SELECT name, is_cdc_enabled FROM sys.databases WHERE name = N'lab_owner';
GO
-- Fix: give the database an owner that exists, then enable.
ALTER AUTHORIZATION ON DATABASE::lab_owner TO sa;
GO
SELECT name, SUSER_SNAME(sid) AS login_behind_dbo FROM sys.database_principals WHERE name = N'dbo';
GO
EXEC sys.sp_cdc_enable_db;
GO
SELECT name, is_cdc_enabled FROM sys.databases WHERE name = N'lab_owner';
GO
EXEC sys.sp_cdc_disable_db;
GO
USE master;
GO
DROP DATABASE lab_owner;
GO
