# Lab: enable SQL Server CDC, and change tables that stay empty

Backs the runbook at `docs/runbooks/sql-server/enable-cdc-change-tables-empty.mdx`.

Change data capture (CDC) on SQL Server is two stored procedure calls and one service. The calls succeed without the service, SQL Server Agent, and the change tables then stay empty. This lab enables CDC with the Agent off, shows what that looks like, starts the Agent, and then walks through the jobs, retention, the log sequence number (LSN) range error and a schema change.

## What you need

Docker with Compose and about 2 GB of free memory. The container has a 2 GB memory limit. No port is published: every step runs `sqlcmd` inside the container.

The SQL Server image exists only for x86-64. On Apple silicon it runs emulated and needs Rosetta enabled in Docker Desktop.

## Run it

```bash
./run.sh up             # SQL Server 2022 with the Agent off; creates the cdclab database
./run.sh enable-db      # sys.sp_cdc_enable_db, and a table enabled too early
./run.sh enable-fails   # six ways enabling fails or is suspected to fail, each with its fix
./run.sh enable-table   # sys.sp_cdc_enable_table with the Agent off
./run.sh empty          # rows are written, the change table stays empty
./run.sh fix-agent      # the container is created again with the Agent on
./run.sh jobs           # capture and clean-up jobs, retention, a stopped capture job
./run.sh lsn-range      # Msg 313 from cdc.fn_cdc_get_all_changes_..., six ways
./run.sh cleanup        # clean-up moves the range past a reader's saved position
./run.sh schema-change  # a new column and a second capture instance
./run.sh disable        # sys.sp_cdc_disable_table and sys.sp_cdc_disable_db
./run.sh down
```

SQL Server 2019, set for every step of a run:

```bash
export MSSQL_IMAGE=mcr.microsoft.com/mssql/server:2019-CU32-GDR13-ubuntu-20.04
```

## What the runs showed

Run on 2026-11-16 on an Apple silicon machine, both images emulated.

| Step | SQL Server 2022 (RTM-CU27-GDR), 16.0.4305.5 | SQL Server 2019 (RTM-CU32-GDR), 15.0.4510.2 |
| --- | --- | --- |
| `up` | Developer Edition on Linux, Ubuntu 22.04.5. Starts with `MSSQL_AGENT_ENABLED=false` | Developer Edition on Linux, Ubuntu 20.04.6. Same |
| `enable-db` | A table before its database: `Msg 22901`. `sys.sp_cdc_enable_db` then creates the `cdc` user, the `cdc` schema and 5 metadata tables. `msdb.dbo.cdc_jobs` does not exist yet (`Msg 208`) | Same |
| `enable-fails`: not sysadmin | `Msg 22902 ... Sysadmin privileges are required.` For a table, a user outside `db_owner` gets `Msg 22904 ... DBO privileges are required.` | Same |
| `enable-fails`: a `cdc` schema exists | `Msg 22906`. Works after `DROP SCHEMA cdc` | Same |
| `enable-fails`: a DDL trigger writes to `master` | `Msg 22830 ... 'create user cdc'. The error returned was 229`. Works with the trigger disabled | Same |
| `enable-fails`: the owner's login is gone after a restore | `Msg 22830 ... 'SetCDCTracked(Value = 1)'. The error returned was 15517`. Works after `ALTER AUTHORIZATION ON DATABASE::lab_owner TO sa` | Same |
| `enable-fails`: error 15404 | Not reproduced. `CREATE LOGIN [CORP\dbadmin] FROM WINDOWS` fails with `Msg 15401`, and a database owned by `NT AUTHORITY\NETWORK SERVICE` enables without error | Same |
| `enable-table` | Succeeds with the Agent off and prints `SQLServerAgent is not currently running so it cannot be notified of this action.` four times. Creates jobs `cdc.cdclab_capture` and `cdc.cdclab_cleanup`. A table with no primary key and `@supports_net_changes = 1`: `Msg 22939` | Same, without the line `Update mask evaluation will be disabled in net_changes_function because the CLR configuration option is disabled.` that 2022 prints |
| `empty` | After 4 changed rows and 15 seconds: 0 rows in `cdc.dbo_orders_CT`, `sys.fn_cdc_get_max_lsn()` is NULL, the Agent is `Stopped`, `log_reuse_wait_desc` is `REPLICATION`. One manual `sys.sp_cdc_scan` captures 5 rows. A later insert is not captured | Same. `sys.dm_server_services` also lists a row `SQL Server (MSSQLSERVER)`, `Stopped`, `Disabled` |
| `fix-agent` | Agent `Running`, 4 Agent sessions. The row written while nothing scanned the log is captured (6 rows), and a new insert arrives within 10 seconds (7 rows). `log_reuse_wait_desc` is `NOTHING` | Same |
| `jobs` | Capture: `maxtrans` 500, `maxscans` 10, `continuous` 1, `pollinginterval` 5. Clean-up: `retention` 4320, `threshold` 5000, daily at 02:00. Retention changed to 10080. Stopping the idle clean-up job is refused. A stopped capture job: 7 rows stay 7 for 12 seconds, then 8 after it is started | Same |
| `lsn-range` | `Msg 313, Level 16, State 3` for a low end below the minimum, a high end above the maximum, a NULL end, a low end above the high end, and an unknown row filter. A wrong capture instance name returns `0x00000000000000000000` | Same |
| `cleanup` | With retention 1 minute and a change 70 seconds after the previous ones, the clean-up job leaves 3 of 11 rows and moves the minimum LSN. The reader's saved position is now below it: `Msg 313`. After a reload of the 10 source rows, the next change is read | Same |
| `schema-change` | A new column is not in the change table. A second capture instance has it, from its own start on. A third instance: `Msg 22962`. A dropped column stays in the change table as NULL, and a changed type is carried over | Same |
| `disable` | `is_cdc_enabled` 0, no `cdc` schema, no CDC jobs | Same |

Two differences between the versions have nothing to do with CDC. Error messages name the same procedures with different line numbers, and after the container was created again SQL Server 2022 skipped ahead in the identity column of `dbo.orders`: the same later order has id 1011 on 2022 and id 12 on 2019.

## Files

- `docker-compose.yml`: one SQL Server container with a data volume, so that it can be created again with the Agent on. `AGENT=true` or `false` sets `MSSQL_AGENT_ENABLED`.
- `sql/init.sql`: the `cdclab` database with three tables and a table for a reader's saved position.
- `sql/01` to `sql/14`: the statements of each step, in the order the steps run them.
- `run.sh`: every step above. Each batch runs in its own `sqlcmd` session, because `sqlcmd` 18.7 answers `SqlState 24000, Invalid cursor state` to everything that follows a failed procedure call in a session that has already returned a result set.
- `logs/`: the output of every step, one folder per version.
