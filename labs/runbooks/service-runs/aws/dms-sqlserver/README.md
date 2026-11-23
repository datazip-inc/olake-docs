# Run: AWS DMS on an RDS for SQL Server source, a new column, and the capture job

Backs the AWS Database Migration Service (DMS) part of `docs/runbooks/sql-server/enable-cdc-change-tables-empty.mdx`.

Author: Shubham. Run on 2026-11-23, in AWS region ap-south-1.

## What was run

| Part | Version and size |
| --- | --- |
| DMS replication instance | `dms.t3.small`, engine 3.6.1 |
| Source | Amazon RDS for SQL Server, Standard Edition, 16.0.4305.5 (SQL Server 2022 RTM-CU27-GDR), `db.t3.xlarge`, automated backups 1 day, database `dmslab` in the `FULL` recovery model |
| Source set-up | As the AWS documentation for an RDS source prescribes: `exec msdb.dbo.rds_cdc_enable_db 'dmslab'`, then `sys.sp_cdc_enable_table` with `@role_name = NULL, @supports_net_changes = 1` for the table. The capture job keeps its default polling interval of 5 seconds, which is what AWS asks for from DMS 3.5.3 on. The endpoint connects as the RDS master user |
| Target | Aurora MySQL 3.14.0, schema `dms_from_mssql` |
| Task | `full-load-and-cdc`, table `dbo.orders`, task logging on, every other setting default |

## Steps

```bash
../sqlserver-rds/run.sh sql/00-init-dmslab.sql        # the source database with CDC on
./setup.sh                                            # the source endpoint
# the task is created and started with the AWS CLI, see logs/02-endpoint-and-task.txt
../sqlserver-rds/run.sh "$PWD/sql/01-change.sql"      # an insert, an update, a delete
../sqlserver-rds/run.sh "$PWD/sql/02-add-column.sql"  # ALTER TABLE ... ADD, rows with the new column
../sqlserver-rds/run.sh "$PWD/sql/03-second-capture-instance.sql"
../sqlserver-rds/run.sh "$PWD/sql/04-table-without-ms-cdc.sql"
../sqlserver-rds/run.sh "$PWD/sql/05-change-table-without-ms-cdc.sql"
./tlog-wait.sh 9 7      # the capture job stopped, a few writes
./tlog-wait2.sh 12 8    # the capture job stopped, 60,000 rows
```

## What the run showed

Times are UTC.

| Step | Result |
| --- | --- |
| Start | Full load of 4 rows, `running` at 09:25:14. The task log says `MS-CDC is enabled on database 'dmslab'`, `Access to TLOG is permitted.`, `Source database is RDS SQL Server. TLog backups are accessible.` and `TLOG access mode is 'PreferTlog'` |
| An insert, an update and a delete at 09:25:57 | All three were in the target at 09:26:10 |
| `ALTER TABLE dbo.orders ADD note NVARCHAR(50) NULL`, run between 09:26:19 and 09:26:21 | The task log at 09:26:21 has the `Alter table` line quoted below: DMS applied the same change to the target. The table statistics count 1 DDL |
| A row inserted with a note, and a note set on an old row, both before any new capture instance | Both notes were in the target at 09:26:44. On the source, the capture instance `dbo_orders` still had its four columns and the change table had the insert without the note |
| A second capture instance, `dbo_orders_v2`, then one more row with a note | The row and its note arrived, as before. Nothing in the task log |
| A second table, `dbo.items`, with a primary key and without `sys.sp_cdc_enable_table`, added to the task | Its 2 rows were loaded. Afterwards an insert and a delete arrived, and an update did not: the target kept the old value. The task stayed `running`. The task log has one warning, quoted below. Table statistics: 1 insert, 0 updates, 1 delete |
| What DMS adds to the source database | The tables `dbo.awsdms_truncation_safeguard` and `dbo.systranschemas`, and two sessions of the program `repctl` that each hold a transaction open, named after the task. A `SELECT` on the first table waited on their lock |
| The capture job stopped for 9 minutes, 200 rows a minute | The change table stayed at 2 rows. The target had every row of the source at each check, 207 to 1807. `log_reuse_wait_desc` stayed `NOTHING`: the log was 8 MB and under 20% used |
| The capture job stopped at 09:41:02, 60,000 rows written | The log grew from 8 MB to 72 MB, all 5 virtual log files active. The target had all 62,007 rows at 09:42:13. `log_reuse_wait_desc` was `LOG_BACKUP` until the log backup of 09:43:01, `ACTIVE_TRANSACTION` after it, and `REPLICATION` after the log backup of 09:48:01, for the four checks until 09:51:53. The change table stayed at 2,002 rows |
| The capture job started at 09:52:50 | 62,002 rows in the change table 4 seconds later. After the log backup of 09:53:01: `log_reuse_wait_desc` `NOTHING`, 1 of 6 virtual log files active |

The line for the new column:

```text
[TARGET_APPLY    ]I:  Alter table. Action: 3, statement: ALTER TABLE `dms_from_mssql`.`orders` ADD COLUMN `note` VARCHAR(50) CHARACTER SET utf16  (odbc_endpoint_imp.c:7394)
```

The warning for the table without MS-CDC:

```text
[SOURCE_CAPTURE  ]W:  MS-REPLICATION is not enabled for table '[dbo].[items]'. Therefore, UPDATE changes to it will not be captured. If you want UPDATE changes to be captured, either define a Primary Key for the table (if missing) or enable Microsoft CDC instead.  (sqlserver_log_utils.c:1312)
```

## Files

- `setup.sh`, `table-mappings.json`, `table-mappings-all.json`, `task-settings.json`: the endpoint and the task.
- `sql/`: the statements of each step. `tlog-wait.sh` and `tlog-wait2.sh`: the two checks of the transaction log.
- `logs/01` to `logs/11`: the output of every step. `06-task-log.txt` is the whole task log.
