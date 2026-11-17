-- A schema or a user named cdc already exists in the database.
USE master;
GO
CREATE DATABASE lab_schema;
GO
USE lab_schema;
GO
CREATE SCHEMA cdc;
GO
EXEC sys.sp_cdc_enable_db;
GO
SELECT name, is_cdc_enabled FROM sys.databases WHERE name = N'lab_schema';
GO
-- Fix: drop (or rename the objects out of) the schema, then enable.
DROP SCHEMA cdc;
GO
EXEC sys.sp_cdc_enable_db;
GO
SELECT name, is_cdc_enabled FROM sys.databases WHERE name = N'lab_schema';
GO
EXEC sys.sp_cdc_disable_db;
GO
USE master;
GO
DROP DATABASE lab_schema;
GO
