-- Is there a SQL Server Agent to look at?
SELECT servicename, status_desc, startup_type_desc FROM sys.dm_server_services;
GO
SELECT COUNT(*) AS agent_sessions FROM sys.dm_exec_sessions WHERE program_name LIKE N'SQLAgent%';
GO
SELECT name AS agent_job FROM msdb.dbo.sysjobs;
GO
-- Changes made after the table was enabled.
INSERT INTO dbo.orders (customer_id, quantity) VALUES (1, 5), (2, 6);
UPDATE dbo.orders SET quantity = quantity + 10 WHERE id = 1;
DELETE FROM dbo.orders WHERE id = 4;
SELECT SYSUTCDATETIME() AS changes_committed_at;
GO
