USE dmslab;
GO
-- The capture instance and the columns it captures, before the change.
SELECT ct.capture_instance, cc.column_name FROM cdc.change_tables ct JOIN cdc.captured_columns cc ON cc.object_id = ct.object_id ORDER BY ct.capture_instance, cc.column_ordinal;
GO
-- A column is added to the source table. DDL and DML are kept in separate transactions.
ALTER TABLE dbo.orders ADD note NVARCHAR(50) NULL;
GO
INSERT INTO dbo.orders (customer_id, quantity, note) VALUES (2, 20, N'written before the new capture instance');
GO
UPDATE dbo.orders SET note = N'updated before the new capture instance' WHERE id = 2;
GO
WAITFOR DELAY '00:00:10';
GO
-- The change table did not get the column.
SELECT ct.capture_instance, cc.column_name FROM cdc.change_tables ct JOIN cdc.captured_columns cc ON cc.object_id = ct.object_id ORDER BY ct.capture_instance, cc.column_ordinal;
GO
SELECT TOP (2) * FROM cdc.dbo_orders_CT ORDER BY __$start_lsn DESC;
GO
SELECT OBJECT_NAME(source_object_id) AS source_table, required_column_update, ddl_command, ddl_time FROM cdc.ddl_history;
GO
SELECT id, customer_id, quantity, note FROM dbo.orders ORDER BY id;
GO
