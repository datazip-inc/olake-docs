-- The lab database: one captured table.
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
