USE dmslab;
GO
INSERT INTO dbo.items (id, label) VALUES (3, N'inserted during CDC');
UPDATE dbo.items SET label = N'updated during CDC' WHERE id = 1;
DELETE FROM dbo.items WHERE id = 2;
INSERT INTO dbo.orders (customer_id, quantity, note) VALUES (4, 30, N'orders still follows');
GO
SELECT id, label FROM dbo.items ORDER BY id;
GO
