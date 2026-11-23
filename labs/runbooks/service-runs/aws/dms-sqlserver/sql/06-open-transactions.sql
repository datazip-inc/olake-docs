USE dmslab;
GO
-- Which sessions hold a transaction open in this database, and what did they run last?
SELECT s.session_id, s.program_name, s.login_name, st.is_user_transaction, at.transaction_begin_time, at.name AS transaction_name
FROM sys.dm_tran_session_transactions st
JOIN sys.dm_tran_active_transactions at ON at.transaction_id = st.transaction_id
JOIN sys.dm_exec_sessions s ON s.session_id = st.session_id
WHERE s.database_id = DB_ID();
GO
SELECT name FROM sys.tables WHERE name LIKE N'awsdms%' OR name = N'systranschemas' ORDER BY name;
GO
SELECT * FROM dbo.awsdms_truncation_safeguard;
GO
