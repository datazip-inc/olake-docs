-- Enabling the database needs sysadmin. Enabling a table needs db_owner.
USE master;
GO
CREATE DATABASE lab_perm;
CREATE LOGIN lab_owner_login WITH PASSWORD = N'Lab_Passw0rd_2026', CHECK_POLICY = OFF;
CREATE LOGIN lab_reader_login WITH PASSWORD = N'Lab_Passw0rd_2026', CHECK_POLICY = OFF;
GO
USE lab_perm;
GO
CREATE TABLE dbo.t (id INT NOT NULL PRIMARY KEY);
CREATE USER lab_owner_user FOR LOGIN lab_owner_login;
ALTER ROLE db_owner ADD MEMBER lab_owner_user;
CREATE USER lab_reader_user FOR LOGIN lab_reader_login;
ALTER ROLE db_datareader ADD MEMBER lab_reader_user;
GO
-- A member of db_owner who is not sysadmin tries to enable the database.
EXECUTE AS LOGIN = N'lab_owner_login';
EXEC sys.sp_cdc_enable_db;
REVERT;
GO
-- Fix: a sysadmin enables the database.
EXEC sys.sp_cdc_enable_db;
GO
-- A user who is not in db_owner tries to enable a table.
EXECUTE AS LOGIN = N'lab_reader_login';
EXEC sys.sp_cdc_enable_table @source_schema = N'dbo', @source_name = N't', @role_name = NULL;
REVERT;
GO
-- Fix: db_owner is enough for the table.
EXECUTE AS LOGIN = N'lab_owner_login';
EXEC sys.sp_cdc_enable_table @source_schema = N'dbo', @source_name = N't', @role_name = NULL;
REVERT;
GO
SELECT name, is_tracked_by_cdc FROM sys.tables WHERE name = N't';
GO
EXEC sys.sp_cdc_disable_db;
GO
USE master;
GO
DROP DATABASE lab_perm;
DROP LOGIN lab_owner_login;
DROP LOGIN lab_reader_login;
GO
