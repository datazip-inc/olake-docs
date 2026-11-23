# Run: change data capture on Azure SQL Database

Backs the Azure SQL Database part of `docs/runbooks/sql-server/enable-cdc-change-tables-empty.mdx`.

## What was run

- Run on 2026-11-23, 10:32 to 11:36 UTC, in Central India.
- Azure SQL Database, engine 12.0.2000.8 (`Microsoft SQL Azure (RTM)`, build of 9 October 2026), a single database `cdclab`, created at the S0 service objective and scaled to S3.
- Client: `sqlcmd` 18 from the `mcr.microsoft.com/mssql/server:2022-CU27-GDR1-ubuntu-22.04` image, as the server admin login, which is `dbo` in the database.
- The statements are the ones of `labs/runbooks/sql-server/enable-cdc-change-tables-empty`, adapted where Azure SQL Database differs. They are in `sql/`. As in the lab, every batch runs in its own `sqlcmd` session.

```bash
./run.sh setup            # the lab tables
./run.sh s0               # sys.sp_cdc_enable_db at S0
./run.sh scale            # S0 to S3
./run.sh enable           # sys.sp_cdc_enable_db and sys.sp_cdc_enable_table
./run.sh capture          # no Agent to look at; how soon a change is in the change table
./run.sh jobs             # sp_cdc_help_jobs, stopping and starting, sp_cdc_scan, retention
./run.sh lsn-range        # Msg 313, six ways
./run.sh cleanup-start    # a reader saves its position; retention is set to one minute
./run.sh cleanup-wait     # one change every five minutes until the automatic clean-up has run
./run.sh cleanup-check    # the reader comes back
./run.sh cleanup-by-hand  # the same with sys.sp_cdc_cleanup_change_table
./run.sh schema-change    # a new column and a second capture instance, on dbo.customers
./run.sh disable
```

## What the runs showed

| Step | What was asked | Result |
| --- | --- | --- |
| `s0` | `sys.sp_cdc_enable_db` at S0 | `Msg 22830 ... The error returned was 22871: 'Change Data Capture is not supported on Free, Basic or Standard tier Single Database (S0,S1,S2) and Database in Elastic pool with max eDTUs < 100 or max vCore < 1. Please upgrade to a higher Service Objective.'` |
| `scale` | `az sql db update --service-objective S3` | Online at S3 after 94 s |
| `enable` | A table before its database | `Msg 22901`, the same text as on SQL Server |
| | `sys.sp_cdc_enable_db` as a login that is `db_owner` and not `sysadmin` | Works. `is_cdc_enabled` is 1, and the `cdc` user, schema and five metadata tables exist |
| | `sys.sp_cdc_enable_table` for three tables | Works and prints nothing about SQL Server Agent. Net changes on a table without a key: `Msg 22939`, the same text |
| | `sys.sp_cdc_help_jobs` | Capture: `maxtrans` 10000, `maxscans` 100, `continuous` 0, `pollinginterval` 0. Clean-up: `retention` 4320, `threshold` 4999 |
| | Where the job settings are | `msdb.dbo.cdc_jobs`: `Msg 40515 ... Reference to database and/or server name ... is not supported`. The table is `cdc.cdc_jobs` in the database itself |
| `capture` | Is there an Agent | `sys.dm_server_services`: `Msg 208, Invalid object name`. No `SQLAgent` session. `msdb.dbo.sysjobs`: `Msg 40515` |
| | Four changed rows, committed at 10:35:01 | 5 rows in `cdc.dbo_orders_CT` at 10:35:06. `sys.dm_cdc_log_scan_sessions` shows scans starting at 10:34:55.930, 10:35:00.930 and 10:35:05.937, 5 s apart |
| | `log_reuse_wait_desc`, `sys.dm_cdc_errors` | `NOTHING`, 0 rows |
| `jobs` | `sys.sp_cdc_stop_job`, `sys.sp_cdc_start_job` | `Msg 2812 ... Could not find stored procedure`. A row written after the stop call was captured all the same |
| | `sys.sp_cdc_scan` by hand | Runs without a message |
| | `sys.sp_cdc_change_job` for the clean-up retention | Accepted: 10080, later 1 |
| `lsn-range` | The five wrong ranges of the lab | `Msg 313, Level 16, State 3` each time, the same text. A wrong capture instance name returns `0x00000000000000000000` |
| `cleanup-by-hand` | `sys.sp_cdc_cleanup_change_table` with a low watermark above a reader's saved position | The minimum LSN moves. The reader's next call: `Msg 313`, the same text |
| `schema-change` | `ALTER TABLE dbo.customers ADD note`, then an insert | The change table has no `note` column. The insert is there without its note |
| | An `UPDATE` that changes only `note` | No row at all in the old change table |
| | A second capture instance, then an insert | `cdc.dbo_customers_v2_CT` has the row with its note. The row written before is not in it |
| | A third capture instance | `Msg 22962`, the same text |
| | `DROP COLUMN note`, `ALTER COLUMN last_name NVARCHAR(200)` | The change table keeps `note` and new rows have NULL in it. `cdc.ddl_history` records both statements |
| `cleanup-start`, `cleanup-wait` | Retention set to 1 minute at 10:38, one change every five minutes | Nothing is removed for 56 minutes: 21 rows at 11:34:38, the same minimum LSN |
| | The automatic clean-up | It ran between 11:34:38 and 11:34:58, one hour after CDC was enabled on the database (10:34:50). 2 of 21 rows are left, and `cdc.lsn_time_mapping` holds two entries, 11:28:51 and 11:33:52 |
| `cleanup-check` | The reader asks for everything after its saved position | `Msg 313`, the same text. After a reload of the 19 source rows, the next change is read |
| `disable` | `sys.sp_cdc_disable_table`, `sys.sp_cdc_disable_db` | Both work for `db_owner`. `is_cdc_enabled` is 0 and the `cdc` schema is gone |

## Files

- `run.sh`: every step. `sql/`: the statements. `logs/`: output of every step, with the server name masked.
