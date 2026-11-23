-- The lab database: one table with a primary key, CDC on the database and on the table.
CREATE DATABASE cdclab;
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
