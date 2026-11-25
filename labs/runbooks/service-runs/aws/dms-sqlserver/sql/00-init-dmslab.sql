-- The source database of the DMS run: one table with a primary key, CDC on as the AWS documentation
-- for an RDS for SQL Server source prescribes.
CREATE DATABASE dmslab;
GO
USE dmslab;
GO
CREATE TABLE dbo.orders (
  id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  customer_id INT NOT NULL,
  quantity INT NOT NULL,
  placed_at DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME()
);
INSERT INTO dbo.orders (customer_id, quantity) VALUES (1, 1), (2, 2), (3, 2), (4, 1);
GO
SELECT name, recovery_model_desc, is_cdc_enabled FROM sys.databases WHERE name = N'dmslab';
GO
exec msdb.dbo.rds_cdc_enable_db 'dmslab'
GO
exec sys.sp_cdc_enable_table @source_schema = N'dbo', @source_name = N'orders', @role_name = NULL, @supports_net_changes = 1
GO
EXEC sys.sp_cdc_help_jobs;
GO
SELECT name, recovery_model_desc, is_cdc_enabled, log_reuse_wait_desc FROM sys.databases WHERE name = N'dmslab';
GO
SELECT capture_instance, start_lsn FROM cdc.change_tables;
GO
