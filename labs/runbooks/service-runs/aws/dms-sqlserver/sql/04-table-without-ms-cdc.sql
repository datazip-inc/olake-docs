USE dmslab;
GO
-- A second table with a primary key, on which sys.sp_cdc_enable_table is not run.
CREATE TABLE dbo.items (id INT NOT NULL PRIMARY KEY, label NVARCHAR(50) NOT NULL);
INSERT INTO dbo.items (id, label) VALUES (1, N'loaded by the full load'), (2, N'loaded by the full load');
GO
SELECT s.name + N'.' + t.name AS table_name, t.is_tracked_by_cdc FROM sys.tables t JOIN sys.schemas s ON s.schema_id = t.schema_id WHERE s.name = N'dbo' ORDER BY t.name;
GO
