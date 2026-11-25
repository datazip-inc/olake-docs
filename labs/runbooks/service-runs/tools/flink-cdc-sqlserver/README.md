# Service test: a Flink CDC job on SQL Server and a column added to a CDC-enabled table

Backs the Flink CDC part of `docs/runbooks/sql-server/enable-cdc-change-tables-empty.mdx`, next to the page's own section "Fix: a schema change needs a new capture instance".

A Flink SQL job reads `dbo.orders` with the SQL Server CDC connector. A column is added to the table, and the test records what the job prints before and after a second capture instance exists. A last step starts a job on a database where change data capture (CDC) was enabled while SQL Server Agent was off.

## What you need

Docker with Compose, `curl`, `python3`, and about 5 GB of free memory. Every service has a memory limit. Port 18382 must be free: it is the Flink REST port. The SQL Server image exists only for x86-64, so on Apple silicon it runs emulated. The Flink image is about 1.6 GB.

One jar file goes into `lib/`: `flink-sql-connector-sqlserver-cdc-3.7.0-2.2.jar`. `./run.sh fetch` downloads it from Maven Central and prints its SHA-1 next to the one listed there. This jar carries its JDBC driver.

## Run it

```bash
./run.sh fetch            # the connector jar
./run.sh up               # SQL Server 2022 with the Agent on, CDC on dbo.orders, a Flink 2.2.1 session cluster
./run.sh start            # job 1, declared with the four original columns: snapshot, then one streamed insert
./run.sh add-column       # ALTER TABLE ... ADD note, two inserts with a value in it: what job 1 prints
./run.sh with-column      # job 2, declared with the new column: its snapshot, then one streamed insert
./run.sh second-instance  # a second capture instance that has the column: what job 2 prints afterwards
./run.sh restart          # job 3, the same declaration, started from a savepoint of job 2
./run.sh agent-off        # the server again with the Agent off, CDC enabled on a new database: job 4
./run.sh down
```

`./run.sh all` runs every step and captures each one under `logs/`. One pass takes about seven minutes.

## How the test is built

- `sql/job.sql.tmpl` is the job: one `sqlserver-cdc` source table and a `print` sink. Each job prints under its own name, so the rows of one job can be told from those of another in the TaskManager's standard output. Checkpoints run every 5 seconds.
- A Flink SQL table has the columns its `CREATE TABLE` names. Job 1 names the four columns the source table starts with. Jobs 2 and 3 name `note` as well. Job 2 starts without state, so its first rows come from the snapshot, which reads the table itself.
- The second capture instance is created as the runbook does it, with `sys.sp_cdc_enable_table` and `@capture_instance = N'dbo_orders_v2'`.
- For the last step the SQL Server container is created again over the same data volume with `MSSQL_AGENT_ENABLED=false`, as the SQL Server lab does. A new database, `cdclab2`, is then enabled for CDC, so that nothing has ever scanned its log.

## What the runs showed

Run on 2026-11-23 from 09:58 UTC on fresh containers, on an Apple silicon machine with the SQL Server image emulated.

| Component | Version |
| --- | --- |
| Flink | 2.2.1, image `flink:2.2.1-scala_2.12-java17`, one JobManager and one TaskManager |
| Connector | `flink-sql-connector-sqlserver-cdc-3.7.0-2.2.jar` |
| Debezium inside the connector jar | 1.9.8.Final (`debezium-connector-sqlserver`, `debezium-core`), with `mssql-jdbc` 9.4.1 |
| SQL Server | 2022 Developer Edition, 16.0.4305.5 (CU27) |

| Step | Result |
| --- | --- |
| `start` | Job 1 prints the 4 rows of the snapshot and then the inserted order, `job1> +I[5, 1, 5, ...]` |
| `add-column` | After `ALTER TABLE dbo.orders ADD note NVARCHAR(100) NULL` and two inserts with a note, job 1 prints orders 6 and 7 with its four columns. It stays `RUNNING` with 0 restarts and no exception, and the TaskManager log has no line about the new column. The capture instance `dbo_orders` still has 4 columns |
| `with-column` | Job 2 declares `note`. Its snapshot prints orders 6 and 7 with `first note` and `second note`. Order 8 is then inserted with `third note` and arrives through the change table: `job2> +I[8, 4, 8, ..., null]` |
| `second-instance` | `dbo_orders_v2` is created with 5 columns. Job 2 keeps running. An insert 12 seconds later is printed with its value, `job2> +I[9, 1, 9, ..., fourth note]`, and so is one a minute after that. The TaskManager log has `Multiple capture instances present for the same table`, `Schema will be changed for Capture instance "dbo_orders_v2"` and `Migrating schema to Capture instance "dbo_orders_v2"`, once each |
| `restart` | Job 2 is stopped with a savepoint and job 3 starts from it: `RUNNING`, 0 restarts. An insert is printed with its value, `job3> +I[11, 3, 11, ..., sixth note]`. Order 8 is not printed again |
| `agent-off`: the database | `sys.dm_server_services` shows the Agent `Stopped`. Enabling CDC on `cdclab2` succeeds and prints `SQLServerAgent is not currently running so it cannot be notified of this action.` four times. `sys.fn_cdc_get_max_lsn()` is NULL and the change table is empty |
| `agent-off`: job 4 | `RUNNING` at every reading for 100 seconds, 0 restarts, no exception. It prints the 4 rows of the snapshot. An insert made while it runs is not printed: the table has 5 rows and the change table 0. The TaskManager log has 223 warnings: `No maximum LSN recorded in the database; please ensure that the SQL Server Agent is running` |

## Files

- `docker-compose.yml`: the SQL Server container, the JobManager and the TaskManager. Only the Flink REST port is published.
- `sql/init.sql`: the database `cdclab`, the table and CDC. `sql/init-agent-off.sql`: the database `cdclab2`, created while the Agent is off.
- `sql/job.sql.tmpl`: the Flink SQL job.
- `lib/`: the connector jar.
- `run.sh`: every step above.
- `logs/`: the output of every step.
