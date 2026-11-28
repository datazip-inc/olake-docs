# Lab: add a table to a running Debezium connector

Backs the runbook at `docs/runbooks/debezium/add-table-incremental-snapshot.mdx`.

A Debezium MySQL connector captures one table. A second table, which already holds 20,000 rows, is then added to it, and each step counts how many of those rows reach the table's Kafka topic. The steps cover the include list alone, an incremental snapshot started from a signal table, a read-only one started from a Kafka topic, and a blocking snapshot. They also cover the signals that start nothing or skip a table, `stop-snapshot`, a task restart during a snapshot, and updates and deletes made while one runs.

## What you need

Docker with Compose, `curl` and `python3`. Every service has a `mem_limit`; together they need about 2.7 GB. Port 18316 must be free, or set `CONNECT_PORT`. The 1.9.7.Final Debezium image is built for x86 only, so on Apple silicon it runs under emulation and starts slowly.

`count.py` runs on the host with the standard library. It reads a topic from `kafka-console-consumer.sh` and prints the events by operation and by `source.snapshot`, how many rows they cover, and how many rows of the table never arrived.

## Run it

```bash
./run.sh up               # Kafka 4.3.1, MySQL 8.4.13, Debezium 3.7.1.Final
./run.sh include-list     # a connector on customers; orders added to table.include.list
./run.sh signal-unlisted  # signal table and signal.data.collection, signal table not in table.include.list
./run.sh signal-denied    # signal table in table.include.list; the capture user has no INSERT on it
./run.sh signal           # GRANT INSERT, then execute-snapshot again
./run.sh outside-list     # execute-snapshot for a table that is not in table.include.list
./run.sh no-key           # a table without a primary key, then surrogate-key, then message.key.columns
./run.sh stop             # stop-snapshot during an incremental snapshot
./run.sh restart          # a task restart during an incremental snapshot
./run.sh blocking         # execute-snapshot with "type": "blocking"
./run.sh kafka-signal     # read.only=true and a signal sent to a Kafka topic, no signal table
./run.sh changes          # updates and deletes during an incremental snapshot
./run.sh down
```

The steps build on each other and use fixed connector names and signal ids, so run them once, in this order, on a fresh `up`. `./run.sh all` does that, captures each step under `logs/debezium-<version>/`, writes `connect-log-excerpt.txt` and removes everything at the end.

Old Debezium on an old Kafka Connect (about 30 minutes on Apple silicon; the 3.7.1 run takes about 13):

```bash
DEBEZIUM_IMAGE=quay.io/debezium/connect:1.9.7.Final MYSQL_IMAGE=mysql:8.0.46 ./run.sh all
```

The steps from `stop` onward use a new connector each, which captures `orders` from the start with a snapshot mode that reads no rows (`no_data` on 3.7.1, `schema_only` on 1.9.7). Their counts therefore come from the snapshot under test only. `stop`, `restart` and `changes` set `incremental.snapshot.chunk.size=2`, so that the snapshot runs long enough to be interrupted. Change it with `SMALL_CHUNK`. The worker flushes offsets every 10 seconds (`OFFSET_FLUSH_INTERVAL_MS`).

## The tables

`mysql/init.sql` creates `inventory` with four tables and the capture user `debezium`, with the grants the Debezium MySQL documentation lists (`SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.*`):

- `customers`: 4 rows, captured from the start.
- `orders`: 20,000 rows, the table that is added.
- `shipments`: 3 rows, never in the include list.
- `order_notes`: 50 rows and no primary key.

`signal-unlisted` creates the signal table `inventory.debezium_signal` with the statement in the Debezium documentation. Every signal is written by `root`, the way an operator would.

## What the runs showed

Run on 2026-11-28, each version from a fresh `up`.

| Run | Stack | Started (UTC) | Took |
| --- | --- | --- | --- |
| `logs/debezium-1.9.7` | `quay.io/debezium/connect:1.9.7.Final` (Kafka Connect 3.2.0), `apache/kafka:4.3.1`, `mysql:8.0.46` | 07:39 | 30 min |
| `logs/debezium-3.7.1` | `quay.io/debezium/connect:3.7.1.Final` (Kafka Connect 4.3.1), `apache/kafka:4.3.1`, `mysql:8.4.13` | 08:10 | 13 min |

"Of N" counts the rows of the table that reached its topic, from `count.py`. Each step's file under `logs/` holds the full output.

| Step | What was done | Debezium 1.9.7 | Debezium 3.7.1 |
| --- | --- | --- | --- |
| `include-list` | Connector on `customers`, then `orders` added to `table.include.list`, then one insert | 1 event (`op=c`); 0 of the 20,000 rows. Log: `A previous offset indicating a completed snapshot has been found. Neither schema nor data will be snapshotted.` | The same counts. Log: `A previous offset indicating a completed snapshot has been found.` and `SnapshotResult [status=SKIPPED` |
| `signal-unlisted` | Signal table created, `signal.data.collection` set, signal table not in `table.include.list`, `execute-snapshot` for `orders` | No log line, no topic for the signal table, 0 rows | `Requested 'INCREMENTAL' snapshot`, then `WARN ... SQL error while executing incremental snapshot for table 'inventory.orders', skipping and continuing streaming` with `INSERT command denied to user 'debezium'@'172.19.0.4' for table 'debezium_signal'`. Task `RUNNING`, 1 event in `dbserver1.inventory.debezium_signal`, 0 rows |
| `signal-denied` | Signal table added to `table.include.list`, still no `INSERT`, a second signal | The restarted task started at `pos=787` (GTIDs `1-18`), ran the first signal and `FAILED`: `Database error while executing incremental snapshot for table 'inventory.orders'`, `INSERT command denied ...`. A restart failed the same way. 0 rows | The restarted task started at `pos=867` (GTIDs `1-19`): `No incremental snapshot in progress`. The second signal: the same warning, task `RUNNING`, 0 rows |
| `signal` | `GRANT INSERT ON inventory.debezium_signal`, a third signal (1.9.7: task restarted first) | Three snapshots, one per signal: 60,003 read events, every row three times, 0 missing. Signal table: 3 `execute-snapshot`, 62 `snapshot-window-open`, 62 `snapshot-window-close`. Last snapshot 1.5 s by the log | One snapshot: 20,001 read events with `source.snapshot` `incremental`, 0 missing. Signal table: 3, 21 and 21. 1.1 s by the log |
| `outside-list` | Signal for `shipments`, which is not captured | `WARN ... Schema not found for table 'inventory.shipments', known tables [inventory.customers, inventory.debezium_signal, inventory.orders]`. No topic | `WARN ... Schema retrieval failed due to an exception for inventory.shipments` and `java.lang.NullPointerException: Cannot invoke "io.debezium.relational.Table.id()" because "table" is null`. No topic |
| `no-key` | `order_notes` (50 rows, no primary key) added and signalled; then `"surrogate-key": "note_id"`; then `message.key.columns=inventory.order_notes:note_id` | `skipped cause the table has no primary keys`, 0 rows. With `surrogate-key`: the same, 0 rows. With `message.key.columns`: 50 of 50 | `skipped because the table has no primary keys`, 0 rows. With `surrogate-key`: `surrogate key 'note_id'` logged, the snapshot finished, 1 of 50. With `message.key.columns`: 50 of 50 |
| `stop` | New connector, no rows at start, chunk size 2; `execute-snapshot`, then `stop-snapshot` | Stop sent at 408 events. `Signal 'stop-2' has been received but the type 'stop-snapshot' is not recognized`. 20,001 of 20,001 | Stop sent at 794 events. `Requested stop of snapshot 'INCREMENTAL'`, `Incremental snapshot has stopped.` 1,370 of 20,001 |
| `restart` | The same set-up; the stored offset read during the snapshot, then `POST /connectors/restart-connector/tasks/0/restart` | Offset with `incremental_snapshot_collections` and the two keys, decoded `[5434]` and `[20001]`. Restart at 8,378 events. `Incremental snapshot in progress, need to read new chunk on start`. 20,001 of 20,001, none twice | Offset with `incremental_snapshot_correlation_id` `restart-1`, keys `[3670]` and `[20001]`. Restart at 11,090 events. The same lines. 20,001 of 20,001, none twice |
| `blocking` | New connector, no rows at start; `execute-snapshot` with `"type": "blocking"` | `WARN ... Detected an unexpected snapshot type 'blocking'`, `Requested 'null' snapshot`, task `FAILED`, trace ends in `java.lang.NullPointerException`. A restart failed again. No topic | `Streaming will now pause`, snapshot steps 1 to 7 with `Locking captured tables [inventory.orders]`, `Snapshot completed`, `Streaming resumed`. 20,001 of 20,001; `source.snapshot` `first` 1, `true` 19,999, `last` 1 |
| `kafka-signal` | New connector with `read.only=true` and `signal.kafka.topic` (3.7.1: `signal.enabled.channels=kafka`), no `signal.data.collection`; signal sent to the topic with key `readonly` | `Requested 'INCREMENTAL' snapshot` from `KafkaSignalThread`. 20,001 of 20,001 in 23.2 s by the log. Signal table 40,169 rows before and after | 20,001 of 20,001 in 23.7 s. Signal table 21,475 rows before and after |
| `changes` | New connector, chunk size 2; during the snapshot, 20 rounds of 5 updates and 1 delete | Events before the first change, after the last and at the end: 778, 2,680, 20,121. Last event matches the table for all 19,981 rows; the 20 deleted rows end with a delete | 1,406, 3,852, 20,131. The same match |

## Limits of these runs

- One machine, Apple silicon. The 1.9.7.Final image ran under x86 emulation.
- MySQL only. The Debezium connectors for other databases were not run.
- Debezium 2.x and 3.0 to 3.6 were not run. The page dates the changes between the two versions from the Debezium release notes and blog.
- Each case ran once per version for these logs. The counts that depend on timing (`stop`, `restart`, `changes`) and the durations change from run to run.
- The task restart went through the Kafka Connect API. A crash of the worker during a snapshot was not run.
- The Kafka signal channel was run with `read.only=true` only. `pause-snapshot`, `resume-snapshot`, `additional-conditions`, and the file and JMX signal channels were not run.
- In the 3.7.1 `surrogate-key` case the lab counted 1 of 50 rows; it did not check which row arrived or why.
- Flink CDC was not run.
