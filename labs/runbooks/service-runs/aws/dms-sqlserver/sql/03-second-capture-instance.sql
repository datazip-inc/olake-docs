USE dmslab;
GO
-- The fix of the runbook page: a second capture instance that has the new column.
EXEC sys.sp_cdc_enable_table @source_schema = N'dbo', @source_name = N'orders', @role_name = NULL, @supports_net_changes = 1, @capture_instance = N'dbo_orders_v2';
GO
INSERT INTO dbo.orders (customer_id, quantity, note) VALUES (3, 21, N'written after the new capture instance');
GO
WAITFOR DELAY '00:00:10';
GO
SELECT capture_instance, start_lsn FROM cdc.change_tables ORDER BY capture_instance;
GO
SELECT __$operation, id, quantity, note FROM cdc.dbo_orders_v2_CT;
GO
SELECT id, customer_id, quantity, note FROM dbo.orders ORDER BY id;
GO
