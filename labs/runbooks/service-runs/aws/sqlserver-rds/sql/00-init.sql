-- The lab database of the local run: two tables with a primary key and one without.
SELECT @@VERSION AS version;
GO
SELECT SERVERPROPERTY('Edition') AS edition, SERVERPROPERTY('ProductVersion') AS product_version, SERVERPROPERTY('ProductLevel') AS product_level, SERVERPROPERTY('ProductUpdateLevel') AS update_level;
GO
SELECT SUSER_SNAME() AS login_name, IS_SRVROLEMEMBER('sysadmin') AS is_sysadmin, IS_SRVROLEMEMBER('processadmin') AS is_processadmin, IS_SRVROLEMEMBER('setupadmin') AS is_setupadmin;
GO
CREATE DATABASE cdclab;
GO
USE cdclab;
GO
CREATE TABLE dbo.customers (
  id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  first_name NVARCHAR(100) NOT NULL,
  last_name NVARCHAR(100) NOT NULL,
  email NVARCHAR(255) NOT NULL UNIQUE
);
CREATE TABLE dbo.orders (
  id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES dbo.customers (id),
  quantity INT NOT NULL,
  placed_at DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME()
);
CREATE TABLE dbo.audit_notes (
  noted_at DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
  note NVARCHAR(200) NOT NULL
);
INSERT INTO dbo.customers (first_name, last_name, email) VALUES
  (N'Sally', N'Thomas', N'sally.thomas@example.com'),
  (N'George', N'Bailey', N'gbailey@example.com'),
  (N'Edward', N'Walker', N'ed@example.com'),
  (N'Anne', N'Kretchmar', N'annek@example.com');
INSERT INTO dbo.orders (customer_id, quantity) VALUES (1, 1), (2, 2), (3, 2), (4, 1);
CREATE TABLE dbo.reader_position (
  reader SYSNAME NOT NULL PRIMARY KEY,
  last_lsn BINARY(10) NOT NULL,
  saved_at DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME()
);
GO
SELECT name, is_cdc_enabled, SUSER_SNAME(owner_sid) AS owner, recovery_model_desc, log_reuse_wait_desc FROM sys.databases WHERE name = N'cdclab';
GO
SELECT IS_MEMBER('db_owner') AS is_db_owner, USER_NAME() AS database_user;
GO
