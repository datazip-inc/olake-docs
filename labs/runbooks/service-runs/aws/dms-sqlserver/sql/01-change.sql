USE dmslab;
GO
INSERT INTO dbo.orders (customer_id, quantity) VALUES (1, 5);
UPDATE dbo.orders SET quantity = 11 WHERE id = 1;
DELETE FROM dbo.orders WHERE id = 4;
GO
SELECT id, customer_id, quantity FROM dbo.orders ORDER BY id;
GO
