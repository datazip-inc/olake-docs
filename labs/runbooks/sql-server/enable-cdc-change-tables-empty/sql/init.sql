-- The lab database: two tables with a primary key and one without.
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
-- Where the lab's own reader keeps the last position it processed, as any CDC reader does.
CREATE TABLE dbo.reader_position (
  reader SYSNAME NOT NULL PRIMARY KEY,
  last_lsn BINARY(10) NOT NULL,
  saved_at DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME()
);
GO
