# Runs: a Debezium PostgreSQL connector and its replication slot

Backs the Debezium part of `docs/runbooks/postgres/replication-slot-filling-disk.mdx`. These runs put a Debezium connector on the same kind of server as the page's own lab and record what its replication slot does in each state.

## What you need

Docker with Compose, `curl`, `python3`, and about 2.5 GB of free memory. Every service has a memory limit. Port 18301 must be free, or set `CONNECT_PORT`. Nothing else is published on the host.

## Run it

```bash
./run.sh up              # PostgreSQL 18.7, Kafka 4.3.1, Kafka Connect 4.3.1 with Debezium 3.7.1.Final
./run.sh no-consumer     # the slot while the connector runs, is paused, stopped, deleted, and while the worker is down
OFFSET_FLUSH_MS=10000 ./run.sh up   # the steps below commit offsets every 10 s, to keep them short
./run.sh not-confirming  # the worker frozen, then Kafka unreachable, with wal_sender_timeout at 60 s and at 0
./run.sh idle-database   # a connector on a database nobody writes to: heartbeat settings and lsn.flush.mode
./run.sh properties      # the connector's own description of those properties
./run.sh left-behind     # what stays on the server after a stop, a delete and a shutdown; slot.drop.on.stop
./run.sh down
```

Set `OFFSET_FLUSH_MS=10000` for every later step as well, or export it once. Other versions, each on a fresh stack (`./run.sh down` first):

```bash
DEBEZIUM_IMAGE=quay.io/debezium/connect:3.0.8.Final ./run.sh up && ./run.sh idle-flush-mode
PG_VERSION=14.25 ./run.sh up && ./run.sh idle-heartbeat-outside
PG_VERSION=15.19 ./run.sh up && ./run.sh idle-heartbeat-outside
```

Each step starts from a server with no connector, no stored offsets, no slot and no topic, so the steps can run in any order.

## How the runs are built

- `appdb` has two tables. `orders` takes the bulk of the writes and is not in the publication. `notes` is the captured table, and it gets one row for every 5,000 rows written to `orders`, in the same transaction. The connector therefore receives one change event for about every 1.6 MB of WAL, and Kafka stays small. In the run, 128 MB of writes were 65 events.
- `quietdb` has a `customers` table that never changes and a `heartbeat` table. Publication `quiet_pub` holds only `customers`. Publication `quiet_hb_pub` holds both.
- The connector uses `plugin.name=pgoutput`, `publication.autocreate.mode=disabled` and the default `snapshot.mode`, and connects as `postgres`.
- `max_wal_size` is 64 MB and `min_wal_size` 32 MB, as in the page's lab. Everything else on the server is at its default.
- Debezium confirms a position to PostgreSQL when Kafka Connect commits source offsets. Kafka Connect does that every `offset.flush.interval.ms`, which is 60 s by default. The `no-consumer` step ran with that default. The other steps ran with 10 s.
- Between two scenarios the script stops the connector, resets its offsets, deletes it, drops every slot and deletes the topics. Deleting a connector alone keeps its offsets in Kafka Connect.
- "Frozen" is `docker pause` on the Kafka Connect container. "Kafka unreachable" is `docker pause` on the Kafka container.

## What the runs showed

Run on 2026-11-23 between 07:12 and 09:00 UTC, on an Apple silicon machine. All images ran natively.

| Image | Version reported |
| --- | --- |
| `quay.io/debezium/connect:3.7.1.Final` | Debezium PostgreSQL connector 3.7.1.Final on Kafka Connect 4.3.1 |
| `apache/kafka:4.3.1` | Kafka 4.3.1 |
| `postgres:18.7` | PostgreSQL 18.7 (Debian 18.7-1.pgdg13+2) |
| `quay.io/debezium/connect:3.0.8.Final`, one check | Debezium PostgreSQL connector 3.0.8.Final on Kafka Connect 3.9.0 |
| `postgres:14.25` and `postgres:15.19`, one check each | PostgreSQL 14.25 (Debian 14.25-1.pgdg13+1), PostgreSQL 15.19 (Debian 15.19-1.pgdg13+2) |

### `no-consumer`: the slot in each state of the connector

Debezium 3.7.1.Final, PostgreSQL 18.7, `offset.flush.interval.ms` = 60000. In each state 128 MB were written to `appdb`.

| State of the connector | `active` | WAL sender in `pg_stat_replication` | Held by the slot | Change events delivered |
| --- | --- | --- | --- | --- |
| `RUNNING` | `t` | `Debezium Streaming`, `streaming` | 129 MB for 53 s, until the next offset commit | 65 of 65 |
| `PAUSED` (`PUT /connectors/app/pause`) | `t` | `streaming`, `reply_time` moved every 10 s, `flush_lsn` stayed at `0/AB2E490` | 141 MB for the 90 s it was watched | none of the 65 |
| `STOPPED` (`PUT /connectors/app/stop`) | `f` | none | 141 MB | none |
| deleted (`DELETE /connectors/app`) | `f` | none | 141 MB | none |
| worker shut down (`docker compose stop connect`) | `f` | none | 141 MB | none |

How the slot came back each time:

| After | Time until `confirmed_flush_lsn` moved | Time from there until `restart_lsn` moved and `pg_wal` shrank |
| --- | --- | --- |
| the writes, connector `RUNNING` | 53 s | 65 s, `pg_wal` 144 MB to 64 MB |
| `PUT /connectors/app/resume` after the pause | 16 s | 64 s, 160 MB to 80 MB |
| `PUT /connectors/app/resume` after the stop | 64 s | 64 s, 176 MB to 80 MB |
| the same connector created again after the delete | 64 s | 65 s, 160 MB to 80 MB |
| `docker compose start connect` | 64 s | 65 s, 160 MB to 80 MB |

- `confirmed_flush_lsn` moved at the first offset commit after the connector was back. `restart_lsn` moved at the second commit, 60 s later, and the next checkpoint removed the WAL. The five checkpoints that ran between the two commits changed nothing.
- A connector created again under the same name after a delete took no new snapshot. It read on from its stored offset and delivered the 65 events written meanwhile.
- At the end `notes` held 355 rows and the topic held 355 events.

### `not-confirming`: a connected connector that stops confirming

Debezium 3.7.1.Final, PostgreSQL 18.7, `offset.flush.interval.ms` = 10000. After the freeze, 16 MB were written every 20 s for 3 minutes.

| `wal_sender_timeout` | What was frozen | The slot during the 3 minutes | PostgreSQL log | After the unfreeze |
| --- | --- | --- | --- | --- |
| 60 s (default) | the Kafka Connect worker | `active = t` for 57 s, then `f`. It held 89 MB at the last check that showed `t` and 178 MB at the end | `LOG:  terminating walsender process due to replication timeout`, 60 s after the last reply | Debezium logged `Unexpected exception while performing keepalive status update on the replication stream`, `Retry 1 of unlimited retries will be attempted` and `Going to restart connector after 10 sec. after a retriable exception`. The slot was active again 10 s later and had confirmed after 21 s. The task state stayed `RUNNING`. 93 rows, 93 events |
| 0 | the Kafka Connect worker | `active = t` for all 160 s. `reply_time` stayed at 07:42:00 and `flush_lsn` at `0/4C88CCC8`. The WAL sender waited on `Client / WalSenderWaitForWal`. It held 178 MB at the end | no line | The same connection went on, with no error in the Kafka Connect log. Confirmed after 10 s. 93 rows, 93 events |
| 60 s (default) | Kafka | `active = t` for under 35 s, then `f` until 07:41. It held 178 MB after 3 minutes and 202 MB just before the connector was back | no line | See below. 104 rows, 108 events |
| 0 | Kafka | the same: `f` within 35 s | no line | the same. 104 rows, 108 events |

With Kafka unreachable the connector does not stay connected. The Kafka Connect worker stopped it, in both runs 14 s after Kafka was paused:

```text
07:33:32  Group coordinator kafka:9092 (id: 2147483646 rack: null isFenced: false) is unavailable or invalid due to cause: session timed out without receiving a heartbeat response.
07:33:35  Broker coordinator was unreachable for 3000ms. Revoking previous assignment Assignment{... connectorIds=[app], taskIds=[app-0] ...} to avoid running tasks while not being a member the group
07:33:35  Stopping connector app
07:33:35  Stopping task app-0
```

Kafka was resumed at 07:36:01. The worker joined its group again in the same second and got no work for five minutes:

```text
07:36:01  Joined group at generation 36 ... connectorIds=[], taskIds=[] ... delay=300000} with rebalance delay: 300000
07:41:01  Joined group at generation 37 ... connectorIds=[app], taskIds=[app-0] ... delay=0} with rebalance delay: 0
07:41:01  Starting task app-0
```

So a Kafka outage of 2 min 40 s left the slot without a consumer for 7 min 26 s, from 07:33:35 to 07:41:01. The REST API answered `connector=UNASSIGNED tasks=[RUNNING]` during the wait. 300000 ms is the default of the Kafka Connect setting `scheduled.rebalance.max.delay.ms`. This stack has a single worker.

### `idle-database`: the connector captures `quietdb`, and `appdb` writes 128 MB

`offset.flush.interval.ms` = 10000. After the writes each run watched the slot for 60 s and then ran three more checkpoints.

| Connector settings | Debezium, PostgreSQL | The slot | `pg_wal` at the end |
| --- | --- | --- | --- |
| defaults | 3.7.1, 18.7 | held 129 MB, then 135 MB. `confirmed_flush_lsn` and `restart_lsn` never moved, `flush_lsn` stayed empty | 160 MB in 10 files |
| `heartbeat.interval.ms=5000` | 3.7.1, 18.7 | the same, 135 MB. Kafka got 21 heartbeat records in `__debezium-heartbeat.quiet` | 160 MB |
| `heartbeat.interval.ms=5000`, `heartbeat.action.query=UPDATE public.heartbeat SET ts = now() WHERE id = 1`, the heartbeat table in the publication | 3.7.1, 18.7 | 129 MB, 79 MB after 20 s, 928 bytes after 60 s | 64 MB in 4 files |
| the same, the heartbeat table not in the publication | 3.7.1, 18.7 | held 129 MB, then 135 MB, while the heartbeat row was being written (last write 4 s before the check) | 160 MB |
| the same, the heartbeat table not in the publication | 3.7.1, 15.19 | held 129 MB, then 135 MB | 160 MB |
| the same, the heartbeat table not in the publication | 3.7.1, 14.25 | 129 MB, 65 MB after 20 s, 600 bytes after 40 s | 64 MB in 4 files |
| `lsn.flush.mode=connector_and_driver`, no heartbeat setting | 3.7.1, 18.7 | 129 MB, 56 bytes after 20 s | 64 MB in 4 files |
| `lsn.flush.mode=connector_and_driver`, no heartbeat setting | 3.0.8, 18.7 | held 129 MB, then 135 MB | 144 MB in 9 files |

What the connector logged at start, 3.7.1.Final:

```text
INFO   Using LSN flush mode 'connector': Debezium will flush LSN on event processing. The pgjdbc driver keepalive flush is DISABLED; consider using heartbeat.action.query to prevent WAL growth on low-activity databases.
INFO   Using LSN flush mode 'connector_and_driver': Debezium will flush LSN on event processing. The pgjdbc driver keepalive flush is ENABLED and will automatically flush unmonitored LSNs to prevent WAL growth on low-activity databases.
WARN   heartbeat.interval.ms was internally set to 600000 ms since lsn.flush.mode=CONNECTOR_AND_DRIVER requires periodic opportunities to propagate LSNs to Kafka. If this behavior is not desired, explicitly set heartbeat.interval.ms to more than 0 or enable provide.transaction.metadata.
```

- The first line is printed with the default configuration, so the default mode in 3.7.1 is `connector`. The second and third are printed with `lsn.flush.mode=connector_and_driver`.
- The validation endpoint of 3.7.1 lists `lsn.flush.mode` among 165 properties and describes `flush.lsn.source` as deprecated. The one of 3.0.8 lists 123 properties and no `lsn.flush.mode`. 3.0.8 accepted the setting with HTTP 201, printed it with the rest of its configuration and did nothing with it.
- No version between 3.0.8 and 3.7.1 was run, so the release that introduced the setting is not confirmed here.
- On 3.0.8, `reply_time` in `pg_stat_replication` read 01:10:52 on every line of a run that took place from 08:16 to 08:18. On that version the column says nothing about when the consumer last answered. On 3.7.1 it moved every 10 s.

### `left-behind`: what stays on the server

Debezium 3.7.1.Final, PostgreSQL 18.7. First with default settings and `publication.autocreate.mode=filtered`, so that Debezium created the publication itself:

| After | Slot `dbz_owned` | Publication `dbz_owned_pub` |
| --- | --- | --- |
| `PUT /connectors/owned/stop` | there, `active = f` | there |
| `DELETE /connectors/owned` | there, `active = f` | there |
| `docker compose stop connect` | there, `active = f` | there |

Retiring the connector for good took five calls: `PUT /connectors/owned/stop`, `DELETE /connectors/owned/offsets` (HTTP 200), `DELETE /connectors/owned`, `SELECT pg_drop_replication_slot('dbz_owned')` and `DROP PUBLICATION dbz_owned_pub`.

A slot dropped by hand while its connector was stopped: on resume the task went to `FAILED` and created no new slot.

```text
WARN   Last recorded offset is no longer available on the server.
io.debezium.DebeziumException: The connector is trying to read change stream starting at PostgresOffsetContext [...], but this is no longer available on the server. Reconfigure the connector to use a snapshot mode when needed.
```

With `slot.drop.on.stop=true`, three rows were written after each action:

| Action | Slot afterwards | When the connector came back |
| --- | --- | --- |
| `PUT /connectors/app/pause` | there, `active = t` | the 3 rows arrived |
| `PUT /connectors/app/stop` | dropped | task `FAILED` with the message above, the 3 rows did not arrive |
| `DELETE /connectors/app` | dropped | created again: task `FAILED`, the 3 rows did not arrive |
| `POST /connectors/app/restart?includeTasks=true` | dropped | task `FAILED`, the 3 rows did not arrive |
| `docker compose stop connect` | dropped | task `FAILED`, the 3 rows did not arrive |
| `docker kill` on the worker | there, `active = f` | the 3 rows arrived |

At start the connector warns: `Connector has enabled automated replication slot removal upon restart (slot.drop.on.stop = true). This setting is not recommended for production environments, as a new replication slot will be created after a connector restart, resulting in missed data change events.` In these runs no new slot was created. The task failed instead.

## Files

- `docker-compose.yml`: PostgreSQL, Kafka in KRaft mode and Kafka Connect. Only the Connect REST port is published.
- `init.sql`: `appdb` with `orders`, `notes` and the `write_wal` procedure, `quietdb` with `customers` and `heartbeat`, and the three publications.
- `run.sh`: every step above.
- `logs/debezium-3.7.1-postgres-18.7/`: `01-up.txt`, `02-no-consumer.txt`, `03-up-offset-flush-10s.txt`, `04-not-confirming.txt`, `05-kafka-unreachable-worker-log.txt` (the worker's own lines for the two Kafka runs), `06-idle-database.txt`, `07-properties.txt`, `08-left-behind.txt`.
- `logs/debezium-3.0.8-postgres-18.7/`: `01-up.txt`, `02-idle-flush-mode.txt`.
- `logs/debezium-3.7.1-postgres-14.25/` and `logs/debezium-3.7.1-postgres-15.19/`: `01-up.txt`, `02-idle-heartbeat-outside.txt`.
