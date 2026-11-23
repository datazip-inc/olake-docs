-- The lab database: one table with a primary key, CDC on the database and on the table, and the
-- login the connector uses, with the grants the Airbyte SQL Server set-up guide lists.
CREATE DATABASE cdclab;
GO
ALTER DATABASE cdclab SET ALLOW_SNAPSHOT_ISOLATION ON;
GO
USE cdclab;
GO
CREATE TABLE dbo.orders (
  id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  customer_id INT NOT NULL,
  quantity INT NOT NULL,
  placed_at DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME()
);
INSERT INTO dbo.orders (customer_id, quantity) VALUES (1, 1), (2, 2), (3, 2), (4, 1);
GO
EXEC sys.sp_cdc_enable_db;
GO
EXEC sys.sp_cdc_enable_table @source_schema = N'dbo', @source_name = N'orders', @role_name = NULL;
GO
CREATE LOGIN airbyte WITH PASSWORD = 'Lab_Passw0rd_2026';
GO
CREATE USER airbyte FOR LOGIN airbyte;
ALTER ROLE db_datareader ADD MEMBER airbyte;
GRANT SELECT ON SCHEMA :: [cdc] TO airbyte;
GO
USE master;
GO
GRANT VIEW SERVER STATE TO airbyte;
GO
