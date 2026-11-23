# Runs: the Debezium SQL Server connector without the Agent, and with a new column

Backs the Debezium part of `docs/runbooks/sql-server/enable-cdc-change-tables-empty.mdx`. These runs put a Debezium SQL Server connector on the same kind of server as the page's own lab.

## What you need

Docker with Compose, `curl`, `python3`, and about 4.2 GB of free memory. Every service has a memory limit. Port 18311 must be free, or set `CONNECT_PORT`. Nothing else is published on the host.

The SQL Server image exists only for x86-64. On Apple silicon it runs emulated and needs Rosetta enabled in Docker Desktop.

## Run it

Run the steps in this order.

```bash
./run.sh up            # SQL Server 2022 with the Agent off, Kafka 4.3.1, Kafka Connect 4.3.1 with Debezium 3.7.1.Final
./run.sh agent-off     # the connector with the Agent off: its state, its log, a row that does not arrive
./run.sh agent-on      # the container is created again with the Agent on: the row arrives
./run.sh new-column    # ALTER TABLE ADD, rows written before and after a second capture instance
./run.sh old-instance  # the first capture instance is dropped while the connector runs
./run.sh down
```

## How the runs are built

- The database `cdclab` has one table, `dbo.orders`, with four rows. `up` enables CDC on the database and on the table while the Agent is off, which SQL Server allows.
- The connector reads `dbo.orders` only. Its settings are the connection, `database.names=cdclab`, `database.encrypt=false`, `topic.prefix=mssql`, `table.include.list=dbo.orders` and the schema history topic. Everything else is at its default.
- `agent-on` stops the connector, creates the SQL Server container again over the same data volume with `MSSQL_AGENT_ENABLED=true`, and resumes the connector.
- After the container was created again, SQL Server 2022 skipped ahead in the identity column, as it did in the page's lab. The rows written later have ids from 1005.
- Kafka Connect commits offsets every 10 s in this stack.

## What the runs showed

Run on 2026-11-23 between 08:38 and 08:49 UTC, on an Apple silicon machine. SQL Server ran emulated.

| Image | Version reported |
| --- | --- |
| `mcr.microsoft.com/mssql/server:2022-CU27-GDR1-ubuntu-22.04` | 16.0.4305.5, CU27, Developer Edition (64-bit) |
| `quay.io/debezium/connect:3.7.1.Final` | Debezium SQL Server connector 3.7.1.Final on Kafka Connect 4.3.1 |
| `apache/kafka:4.3.1` | Kafka 4.3.1 |

| Step | Result |
| --- | --- |
| `up` | `sys.sp_cdc_enable_table` prints `SQLServerAgent is not currently running so it cannot be notified of this action.` four times and succeeds. The Agent is `Stopped` |
| `agent-off` | `sys.fn_cdc_get_max_lsn()` is NULL. The connector and its task are `RUNNING`. The snapshot delivers the 4 rows (`op=r`). Two seconds after the start the task logs one line at `ERROR` level: `No maximum LSN recorded in the database; SQL Server Agent is not running`. It did not log it again in the 70 s that followed |
| | A row written now does not arrive: the topic stays at 4 records after 30 s, `cdc.dbo_orders_CT` has 0 rows, and the task is still `RUNNING` |
| `agent-on` | The Agent is `Running`, the maximum LSN is `0x0000002b000005700004` and the change table has the 1 row written while the Agent was off. After the resume the topic has 5 records, the fifth is `op=c` for that row, and the line about the maximum LSN does not come back |
| `new-column`, before a second capture instance | After `ALTER TABLE dbo.orders ADD note NVARCHAR(100) NULL`, a row is inserted with a note and an old row gets a note with an `UPDATE` that changes nothing else. The insert arrives as `op=c` with the columns `id, customer_id, quantity, placed_at` and no `note` field. The update produces no event, and no row in `cdc.dbo_orders_CT` either. The task stays `RUNNING` and logs nothing: no warning, no error, no line about the schema |
| | `cdc.ddl_history` holds the `ALTER TABLE` statement. The change table still has its 4 columns |
| `new-column`, after `sys.sp_cdc_enable_table ... @capture_instance = N'dbo_orders_v2'` | Four seconds later the connector logs `Multiple capture instances present for the same table`, `Schema will be changed for Capture instance "dbo_orders_v2"` and `Migrating schema to Capture instance "dbo_orders_v2"`, all at `INFO` level. The connector was not restarted. The next insert arrives with `note` filled in |
| | The two rows whose note the connector never saw are then changed again (`quantity + 1`). Both arrive as `op=u` with their notes in `before` and `after` |
| `old-instance` | `sys.sp_cdc_disable_table` on `dbo_orders` while the connector runs: the task logs `com.microsoft.sqlserver.jdbc.SQLServerException: Invalid object name 'cdclab.cdc.dbo_orders_CT'.` 8 times, then `Retry 1 of unlimited retries will be attempted` and `Going to restart connector after 10 sec. after a retriable exception`. About ten seconds later: `Successfully restarted task`. The row written right after the drop arrives. The REST API showed the task as `RUNNING` when it was asked 45 s after the drop |

The gap, in the words of the run. The source table at the end:

```text
id|quantity|note
1|2|updated before the second capture instance
1006|2|written before the second capture instance
1007|2|written after the second capture instance
```

The events for those rows, in order:

```text
 7  op=c  id=1006  columns=id,customer_id,quantity,placed_at       note=(no such field)
 8  op=c  id=1007  columns=id,customer_id,quantity,placed_at,note  note='written after the second capture instance'
 9  op=u  id=1     columns=id,customer_id,quantity,placed_at,note  note='updated before the second capture instance'
10  op=u  id=1006  columns=id,customer_id,quantity,placed_at,note  note='written before the second capture instance'
```

Events 9 and 10 exist only because the script changed the two rows again. Without that, a consumer of the topic would have had the wrong value for both rows, and no error anywhere.

One thing in this run was not looked into. The `UPDATE` that changed the two rows again took about two minutes to return. The same statement had returned at once in an earlier pass over the same steps.

## Files

- `docker-compose.yml`: SQL Server with a data volume, Kafka in KRaft mode and Kafka Connect. `AGENT=true` or `false` sets `MSSQL_AGENT_ENABLED`. Only the Connect REST port is published.
- `sql/init.sql`: the `cdclab` database and `dbo.orders`.
- `run.sh`: every step above.
- `logs/debezium-3.7.1-sql-server-2022/`: `01-up.txt`, `02-agent-off.txt`, `03-agent-on.txt`, `04-new-column.txt`, `05-old-instance.txt`.
