# Service test: Airbyte's SQL Server source and a column added to a CDC-enabled table

Backs the Airbyte part of `docs/runbooks/sql-server/enable-cdc-change-tables-empty.mdx`, next to the page's own section "Fix: a schema change needs a new capture instance".

A column is added to a table that change data capture (CDC) already tracks. The test records what the Airbyte SQL Server source delivers for that column, then applies the fix Airbyte documents, which is to disable and enable CDC on the table, and records what the next syncs do.

## What "Airbyte" means here

The open-source connector image `airbyte/source-mssql` is run directly with the Airbyte protocol commands `spec`, `check`, `discover` and `read`. This is not Airbyte Cloud and not the Airbyte platform: there is no scheduler, no destination and no retry logic. A sync here is one `read`. The state it prints is handed to the next `read` with `--state`, as the platform does.

## What you need

Docker with Compose, `python3`, and about 3 GB of free memory. No host port is published. The SQL Server image exists only for x86-64, so on Apple silicon it runs emulated. The connector image is about 1.1 GB.

## Run it

```bash
./run.sh up           # SQL Server 2022 with the Agent on, CDC on dbo.orders
./run.sh spec         # the CDC options the connector has
./run.sh check        # the connection check
./run.sh discover     # the stream, and the catalog for the syncs
./run.sh sync1        # first sync: the 4 rows of orders
./run.sh sync2        # one insert, then a second sync: the change arrives through CDC
./run.sh add-column   # ALTER TABLE ... ADD note, two inserts and one update with a value in it
./run.sh sync3        # discover again, then a sync: what the records carry for the new column
./run.sh reenable     # one more insert, then CDC is disabled and enabled on the table, as Airbyte documents
./run.sh sync4        # a sync with the state saved before that
./run.sh sync5        # one more insert; sync 4 left no state to continue with
./run.sh resync       # what "Re-sync data" does with the same saved state
./run.sh after        # one more insert and a sync: the new column now arrives through CDC
./run.sh down
```

`./run.sh all` runs every step and captures each one under `logs/`. One pass takes about six minutes.

## How the test is built

- One SQL Server 2022 container with SQL Server Agent on. `sql/init.sql` creates the database `cdclab` with the table `dbo.orders`, turns on snapshot isolation, enables CDC on the database and the table, and creates the login `airbyte` with the grants the Airbyte set-up guide lists: `db_datareader`, `SELECT` on the `cdc` schema and `VIEW SERVER STATE`.
- The two calls in the `reenable` step are the ones on Airbyte's troubleshooting page: `sys.sp_cdc_disable_table` with the capture instance name, then `sys.sp_cdc_enable_table` with `@role_name = NULL`.
- `ab.py` runs one protocol command in a one-off container, keeps the complete output under `logs/raw/` as a gzip file (those files are not kept in the repository), prints the warnings, the errors and the lines about the saved position, and saves the last STATE message for the next sync.
- The connector's `initial_waiting_seconds` is set to 120, the lowest value its description allows. Everything else is at its default.

## What the runs showed

Run on 2026-11-23 from 09:34 UTC on a fresh container, on an Apple silicon machine with the SQL Server image emulated.

| Component | Version |
| --- | --- |
| Connector | `airbyte/source-mssql:5.1.5`, digest `sha256:1b49d5f0f2c60511ceb330475f5d6803a697a904f2651792df5500da44beb3dc` |
| Debezium inside the connector | 3.4.3.Final, from its log line `Running Debezium engine version 3.4.3.Final.` |
| SQL Server | 2022 Developer Edition, 16.0.4305.5 (CU27), Agent `Running` |

| Step | Result |
| --- | --- |
| `spec` | The CDC method has the option `invalid_cdc_cursor_position_behavior`, titled "Invalid CDC Position Behavior (Advanced)". Its default is `Fail sync`, and the other allowed value is `Re-sync data` |
| `sync1`, `sync2` | 4 records from the table, then 1 record for the inserted order through CDC. Each sync took 4 seconds |
| `add-column` | `ALTER TABLE dbo.orders ADD note NVARCHAR(100) NULL`, two inserts with a note and one update that sets only the note of order 1. The capture instance `dbo_orders` still has its 4 columns. The change table has the two inserts without the note, and no row at all for the update |
| `sync3`: discover | The stream `dbo.orders` now lists the column `note` |
| `sync3`: the sync | 2 records, orders 6 and 7, each with `"note": null`. The source rows hold `first note` and `second note`. No record for the update of order 1. The sync took 161 seconds: its target was the database's maximum LSN, `0000002b:00000b10:0003`, the last change row was at `0000002b:00000b00:0005`, and the connector waited until `Heartbeat timeout: no progress for 2 minutes` |
| `reenable` | One more insert (order 8, with a note) that no sync has read. After the two calls the capture instance `dbo_orders` has 5 columns, a new start LSN, and an empty change table: the change row of order 8 went with the old one |
| `sync4`, default setting | Exit code 1 after 2 seconds, no records, no state. Failure type `config_error`. Message: `Incumbent CDC state is invalid, reason: Saved offset no longer present on the server, please reset the connection. To prevent this, increase transaction log retention and/or increase sync frequency. Saved LSN '0000002b:00000b10:0003' is no longer available in SQL Server transaction logs.` The line before it: `Saved LSN '0000002b:00000b10:0003' is outside the available range [min: 0000002c:00000368:0049, max: 0000002c:00000ec8:0004]. Transaction logs may have been truncated.` |
| `resync`, `Re-sync data` | Exit code 1 after 4 seconds, no records. Failure type `transient_error`. Message: `Triggering reset. Incumbent CDC state is invalid, reason: Saved offset no longer present on the server. Automatically resetting to current position. WARNING: Any changes between the saved position and current position will be lost.` It prints one state, at the current position |
| The sync after it | 10 records, every row read from the table again. Orders 1, 6, 7, 8, 9 and 10 now arrive with their notes |
| `after` | One more insert. The sync delivers it through CDC with its note, `written after the full read` |

## Files

- `docker-compose.yml`: one SQL Server container. No port is published.
- `sql/init.sql`: the database, the table, CDC and the connector's login.
- `ab.py`: runs one Airbyte protocol command and summarises its output.
- `run.sh`: every step above.
- `logs/`: the output of every step. The complete connector output is written under `raw/` when the lab runs and is not kept in the repository.
