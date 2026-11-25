USE cdclab;
GO
SELECT IS_MEMBER('my_role') AS member_of_my_role, IS_MEMBER('db_owner') AS member_of_db_owner;
GO
SELECT COUNT(*) AS rows_read_from_change_table FROM cdc.dbo_orders_CT;
GO
DECLARE @from BINARY(10) = sys.fn_cdc_get_min_lsn(N'dbo_orders'), @to BINARY(10) = sys.fn_cdc_get_max_lsn();
SELECT @from AS min_lsn, @to AS max_lsn;
SELECT COUNT(*) AS rows_read_through_function FROM cdc.fn_cdc_get_all_changes_dbo_orders(@from, @to, N'all');
GO
