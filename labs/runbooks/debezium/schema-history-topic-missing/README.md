# Lab: Debezium loses its schema history topic

Backs the runbook at `docs/runbooks/debezium/schema-history-topic-missing.mdx`.

A Debezium MySQL connector keeps its position (offsets) and its table structures (schema history) in two different Kafka topics. This lab deletes the second one and shows what the connector does, what fixes it, and when the fix fails.

## What you need

Docker with Compose, `curl`, `python3`, and about 4 GB of free memory. Port 8083 must be free, or set `CONNECT_PORT`.

## Run it

```bash
./run.sh up            # Kafka 4.3.1, MySQL 8.4, Debezium 3.7.1.Final; registers the connector
./run.sh lose-topic    # the task fails: "The db history topic is missing."
./run.sh recover       # snapshot.mode=recovery: resumes from the stored offset
./run.sh ddl-outage    # a column is added while the connector is down: recovery now fails
./run.sh full-reset    # offsets cleared, new initial snapshot
./run.sh add-table     # second connector: "schema isn't known to this connector"
./run.sh fix-add-table # the documented fix for it
./run.sh down
```

Old property names and an old Kafka Connect, on an amd64 image (slow to start on Apple silicon):

```bash
export LEGACY=1 DEBEZIUM_IMAGE=quay.io/debezium/connect:1.9 MYSQL_IMAGE=mysql:8.0
./run.sh up && ./run.sh lose-topic && ./run.sh recover && ./run.sh down
```

## What the runs showed

Run on 2026-11-16.

| Step | Debezium 3.7.1.Final, Kafka Connect 4.3.1, MySQL 8.4.13 | Debezium 1.9.7.Final, Kafka Connect 3.2.0, MySQL 8.0.46 |
| --- | --- | --- |
| `up` | 4 customers, 4 orders, 8 history records. History topic: 1 partition, `cleanup.policy=delete`, `retention.ms=9223372036854775807`, `retention.bytes=-1` | Same counts and topic settings |
| `lose-topic` | Task `FAILED`: `The db history topic is missing. You may attempt to recover it by reconfiguring the connector to recovery.` | Task `FAILED`: `The db history topic is missing. You may attempt to recover it by reconfiguring the connector to SCHEMA_ONLY_RECOVERY` |
| `recover` | Task `RUNNING`. Customers topic 4 to 5: the row written during the outage arrives as `op=c`, `snapshot=false`. History topic rebuilt with 8 records | Same, with `snapshot.mode=schema_only_recovery` |
| `ddl-outage` | Task `FAILED`: `Error processing row in customers, internal schema size 5, but row size 4 , restart connector with schema recovery mode.` | Not run |
| `full-reset` | Task `RUNNING`. Customers topic 5 to 12: all 7 rows are read again as `op=r` | Not run |
| `add-table` | Task `FAILED`: `Encountered change event for table inventory.orders whose schema isn't known to this connector` | Not run |
| `fix-add-table` | Task `RUNNING`. The new topic holds 1 event (the insert that failed); the 4 older rows of the table are not backfilled | Not run |

## Files

- `docker-compose.yml`: Kafka in KRaft mode, MySQL, Kafka Connect with the Debezium connectors. Only the Connect REST port is published.
- `mysql/init.sql`: the `inventory` database and a capture user with the grants Debezium documents.
- `connector.json`, `connector-partial.json`: the two connector configurations.
- `run.sh`: every step above.
- `logs/`: the status responses and log lines captured from the runs, one folder per Debezium version.
