-- The permissions block of the OLake SQL Server connector page (tab "SQL Server 2022 or later"),
-- run as the RDS master user. The password is taken from the client's environment.
USE master;
GO
CREATE LOGIN olake_user WITH PASSWORD = '$(OLAKEPW)';
GO
CREATE USER olake_user FOR LOGIN olake_user;
GO
USE cdclab;
GO
CREATE USER olake_user FOR LOGIN olake_user;
GO
GRANT SELECT ON SCHEMA :: dbo TO olake_user;
GO
GRANT SELECT ON SCHEMA :: cdc TO olake_user;
GO
GRANT VIEW DATABASE PERFORMANCE STATE TO olake_user;
GO
GRANT VIEW DATABASE STATE TO olake_user;
GO
USE msdb;
GO
CREATE USER olake_user FOR LOGIN olake_user;
GO
GRANT SELECT ON dbo.cdc_jobs TO olake_user;
GO
USE cdclab;
GO
-- The automatic capture instance management needs db_owner.
ALTER ROLE db_owner ADD MEMBER olake_user;
GO
ALTER ROLE db_owner DROP MEMBER olake_user;
GO
