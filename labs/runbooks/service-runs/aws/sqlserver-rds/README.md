# Run: SQL Server CDC on Amazon RDS for SQL Server

Backs the Amazon Relational Database Service (RDS) part of `docs/runbooks/sql-server/enable-cdc-change-tables-empty.mdx`. This run repeats the steps of the local lab (`labs/runbooks/sql-server/enable-cdc-change-tables-empty`) on RDS.

Author: Shubham. Run on 2026-11-23, in AWS region ap-south-1.

## What was run

| Part | Version and size |
| --- | --- |
| Instance | Amazon RDS for SQL Server, Standard Edition, engine `16.00.4305.5.v1`, license included, `db.t3.xlarge`, 20 GB gp3, single-AZ, automated backups 1 day, default parameter and option groups |
| `@@VERSION` | Microsoft SQL Server 2022 (RTM-CU27-GDR) (KB5126934) - 16.0.4305.5 (X64), Standard Edition (64-bit) on Windows Server 2019 Datacenter |
| Client | `sqlcmd` 18 from a local container |

The build is the one the local lab ran as its SQL Server 2022 (16.0.4305.5). There it was Developer Edition on Linux. Standard is the smallest edition on RDS that has CDC.

## Steps

```bash
./run.sh 00-init.sql            # version, roles of the master user, the cdclab database
./run.sh 01-enable-db.sql       # sys.sp_cdc_enable_db, then msdb.dbo.rds_cdc_enable_db
./run.sh 02-enable-table.sql    # sys.sp_cdc_enable_table, job defaults
./run.sh 03-agent.sql           # is the Agent visible, is it running, how soon a change is captured
./run.sh 04-stop-capture.sql    # the capture job stopped and started
./run.sh 05-lsn-range.sql       # the Msg 313 cases of the runbook
./run.sh 06-olake-docs-user.sql # the permission block of the OLake connector page
./run.sh 07-as-olake-user.sql cdclab olake_user
./run.sh 08-disable.sql         # sys.sp_cdc_disable_db, then msdb.dbo.rds_cdc_disable_db
./run.sh 09-role-name.sql       # @role_name = 'my_role', as the connector page writes it
```

`run.sh` prints each batch before its output and runs each batch in its own `sqlcmd` session, as the local lab does.

## What the run showed

| Step | Result on RDS | Local lab, SQL Server 2022 |
| --- | --- | --- |
| The master user | `IS_SRVROLEMEMBER('sysadmin')` is 0. Member of `processadmin` and `setupadmin`, and `db_owner` of the database it created. The database owner is `rdsa`, recovery model `FULL` | `sa`, sysadmin |
| A table before its database | `Msg 22901`, same text | Same |
| `EXEC sys.sp_cdc_enable_db` | `Msg 22902 ... Caller is not authorized to initiate the requested action. Sysadmin privileges are required.` | Succeeds for `sa` |
| `EXEC msdb.dbo.rds_cdc_enable_db;` with no argument | `Procedure or function 'rds_cdc_enable_db' expects parameter '@db_name', which was not supplied.` | Not applicable |
| `EXEC msdb.dbo.rds_cdc_enable_db 'cdclab';` | `CDC enabled on database cdclab`. `is_cdc_enabled` is 1, and the `cdc` user, the `cdc` schema and the same 5 metadata tables exist. A second call answers `CDC is already enabled on database.` | Not applicable |
| `sys.sp_cdc_enable_table` | Succeeds and prints `Job 'cdc.cdclab_capture' started successfully.` and `Job 'cdc.cdclab_cleanup' started successfully.` | With the Agent off it prints `SQLServerAgent is not currently running so it cannot be notified of this action.` |
| Net changes without a primary key | `Msg 22939`, same text | Same |
| Job defaults, `sys.sp_cdc_help_jobs` | Capture: `maxtrans` 500, `maxscans` 10, `continuous` 1, `pollinginterval` 5. Clean-up: `retention` 4320, `threshold` 5000 | Same |
| `SELECT ... FROM msdb.dbo.cdc_jobs` | Before the first job: `Msg 208`, as in the lab. After it: `Msg 229 ... The SELECT permission was denied on the object 'cdc_jobs', database 'msdb', schema 'dbo'.`, for the master user too | Readable |
| `msdb.dbo.sysjobs` | Lists `cdc.cdclab_capture` and `cdc.cdclab_cleanup`, both enabled | Same |
| Is the Agent visible | `sys.dm_server_services` lists `SQL Server Agent (MSSQLSERVER)`, `Running`, start-up type `Manual`. 4 Agent sessions, `Agent XPs` is 1 | `Stopped` until the container is created again with the Agent on |
| Can the master user stop the Agent | No. `xp_servicecontrol` with `QUERYSTATE` and with `STOP`: `Msg 229 ... The EXECUTE permission was denied on the object 'xp_servicecontrol'` | Not run |
| How soon a change is captured | An inserted row was in `cdc.dbo_orders_CT` 2005 ms later | Within 10 seconds |
| The capture job stopped | `sys.sp_cdc_stop_job` answers `Job 'cdc.cdclab_capture' stopped successfully.` Two inserts later the change table still had 5 rows after 15 seconds, and `sys.fn_cdc_get_max_lsn()` had not moved. `sys.dm_cdc_errors` was empty. One `sys.sp_cdc_scan` by hand captured them (7 rows). After `sys.sp_cdc_start_job` a new insert was captured (8 rows) | A stopped capture job: 7 rows stay 7 for 12 seconds, then 8 after it is started |
| `log_reuse_wait_desc` with the capture job stopped | `NOTHING` at the moment of the check, straight after a `CHECKPOINT`. See `../dms-sqlserver/` for the same question watched over several minutes | `REPLICATION` with the Agent off |
| `Msg 313` | The same five cases give `Msg 313, Level 16, State 3`. A wrong capture instance name returns `0x00000000000000000000` | Same |
| `EXEC sys.sp_cdc_disable_db` | `Msg 22902 ... Sysadmin privileges are required.` | Succeeds for `sa` |
| `EXEC msdb.dbo.rds_cdc_disable_db 'cdclab';` | `CDC disabled on database cdclab`. `is_cdc_enabled` 0, no `cdc` schema, no CDC jobs | Not applicable |

## Files

- `run.sh`: runs one file of `sql/` against the instance.
- `sql/`: the statements of each step.
- `logs/`: the output of every step. Host names in messages read `<host>`.
