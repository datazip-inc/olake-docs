-- Error 15404 ("Could not obtain information about Windows NT group/user") needs a database
-- owned by a Windows account that the server cannot look up. This step shows why a Linux
-- container cannot produce it: the only Windows-type logins are built in, and they resolve.
USE master;
GO
SELECT name, type_desc FROM sys.server_principals WHERE type IN ('U', 'G') ORDER BY name;
GO
-- A login for a domain account cannot be created without a domain.
CREATE LOGIN [CORP\dbadmin] FROM WINDOWS;
GO
-- A database owned by a built-in Windows-type login enables without error.
CREATE DATABASE lab_win;
GO
ALTER AUTHORIZATION ON DATABASE::lab_win TO [NT AUTHORITY\NETWORK SERVICE];
GO
SELECT name, SUSER_SNAME(owner_sid) AS owner FROM sys.databases WHERE name = N'lab_win';
GO
USE lab_win;
GO
EXEC sys.sp_cdc_enable_db;
GO
SELECT name, is_cdc_enabled FROM sys.databases WHERE name = N'lab_win';
GO
EXEC sys.sp_cdc_disable_db;
GO
USE master;
GO
DROP DATABASE lab_win;
GO
