-- The connector page enables tables with @role_name = 'my_role'. What that role does for the page's user.
EXEC msdb.dbo.rds_cdc_enable_db 'cdclab';
GO
USE cdclab;
GO
SELECT name FROM sys.database_principals WHERE name = N'my_role';
GO
EXEC sys.sp_cdc_enable_table
    @source_schema = 'dbo',
    @source_name = 'orders',
    @role_name = 'my_role',
    @capture_instance = 'dbo_orders';
GO
SELECT name, type_desc FROM sys.database_principals WHERE name = N'my_role';
GO
INSERT INTO dbo.orders (customer_id, quantity) VALUES (1, 40);
GO
WAITFOR DELAY '00:00:08';
GO
