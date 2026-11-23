-- Remove the login and users of a first attempt, so that the block of the connector page runs from a clean state.
USE cdclab;
GO
DROP USER IF EXISTS olake_user;
GO
USE msdb;
GO
DROP USER IF EXISTS olake_user;
GO
USE master;
GO
DROP LOGIN olake_user;
GO
