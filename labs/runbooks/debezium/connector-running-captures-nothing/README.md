# Lab: a Debezium connector that is RUNNING and captures nothing

Backs the runbook at `docs/runbooks/debezium/connector-running-captures-nothing.mdx`.

A Debezium connector can report `RUNNING` for itself and its task while no change event reaches Kafka. This lab makes five mistakes on purpose, on MySQL and on PostgreSQL, shows the command that proves each one, and runs the fix. A second, smaller stack shows a connector that is `RUNNING` with no task because two workers advertise the same address.

## What you need

Docker with Compose, `curl`, `python3`, and about 3 GB of free memory (every service has a `mem_limit`; the main stack adds up to 2944 MB). Port 18083 must be free, or set `CONNECT_PORT`. The two-worker stack also uses 18084 (`CONNECT_PORT_2`).

The broker runs with `auto.create.topics.enable=false`. Every connector in the lab therefore carries `topic.creation.default.replication.factor` and `topic.creation.default.partitions`, except in the step that leaves them out.

## Run it

```bash
./run.sh up                 # Kafka 4.3.1, MySQL 8.4, PostgreSQL 16, Debezium 3.7.1.Final
./run.sh filter-mysql       # table.include.list in the wrong format, the fix, the backfill, a column filter
./run.sh filter-postgres    # the same on PostgreSQL, plus publication.autocreate.mode=filtered
./run.sh old-names          # table.whitelist and its siblings
./run.sh snapshot-mysql     # snapshot.mode=no_data, then initial, then a new snapshot
./run.sh snapshot-postgres
./run.sh topics             # no topic.creation.default.*: UNKNOWN_TOPIC_OR_PARTITION, two fixes
./run.sh publication        # a publication without one of the tables, two fixes
./run.sh no-task            # tasks.max=2 on the MySQL connector
./run.sh topics-worker-off  # the worker restarted with topic.creation.enable=false
./run.sh down
```

`./run.sh all` runs every step above in that order. The two-worker stack is separate, so take the first one down before starting it:

```bash
./run.sh two-workers        # both workers advertise localhost, then the fix
./run.sh two-workers-down
```

Old property names and an old Kafka Connect, on an amd64 image (slow on Apple silicon; `./run.sh all` took 27 minutes):

```bash
export LEGACY=1 DEBEZIUM_IMAGE=quay.io/debezium/connect:1.9 MYSQL_IMAGE=mysql:8.0 POSTGRES_IMAGE=postgres:13
./run.sh up && ./run.sh all && ./run.sh down
```

Set `LOG_DIR=logs/<folder>` to keep the status responses and log lines of a run.

## What the runs showed

Run on 2026-11-16. Counts are events on the table topic. The steps share two tables, so the counts depend on the order above.

| Step | Debezium 3.7.1.Final, Kafka Connect 4.3.1, MySQL 8.4.13, PostgreSQL 16.15 | Debezium 1.9.7.Final, Kafka Connect 3.2.0, MySQL 8.0.46, PostgreSQL 13.23 |
| --- | --- | --- |
| `filter-mysql`, `table.include.list=customers` | Connector and task `RUNNING`. Warning `After applying the include/exclude list filters, no changes will be captured. Please check your configuration!` twice. Schema change topic 8 records, no table topic. `GET /offsets` shows a stored binlog position | Same state, warning and counts. `GET /connectors/<name>/offsets` answers `HTTP 404 Not Found` |
| Other values | `INVENTORY.CUSTOMERS` captures (5 events, no warning). `inventory.cust*` does not (warning twice) | Same |
| Fix on the same connector | No warning. Log: `A previous offset indicating a completed snapshot has been found.` Topic gets 1 event, the row inserted while the filter was wrong, then 1 more for a new insert. The 4 older rows do not arrive | Same counts. Log: `A previous offset indicating a completed snapshot has been found. Neither schema nor data will be snapshotted.` |
| Backfill | Stop, delete offsets, delete history topic, resume: topic 2 to 8, six rows read as `op=r` | Connector and history topic deleted, same configuration under a new name: topic 2 to 8 |
| `column.include.list=id,email` | 6 events with `"after": {}`. With `inventory\.customers\.(id\|email)`: events with `id` and `email` | Same |
| `filter-postgres`, `table.include.list=inventory.customers` | Connector and task `RUNNING`. Warning once. Publication created `FOR ALL TABLES`, slot active, no topic. `GET /offsets` returns `{"offsets":[]}` | Same state and warning. The offsets call answers 404 |
| Other values | `customers` and `inventory.public.customers` do not capture. `PUBLIC.CUSTOMERS` captures (5 events) | Same |
| Fix on the same connector | Initial snapshot runs: 5 events, all `op=r`. A new insert makes 6 | Same |
| Wrong list with `publication.autocreate.mode=filtered` | Task `FAILED`: `No table filters found for filtered publication pgg_pub` | Same |
| `old-names` | `database.whitelist`, `table.whitelist`, `column.whitelist`, `schema.whitelist` are ignored with no log line: both tables are captured with all columns | The old names filter as asked. Log: `Using configuration property "table.whitelist" is deprecated and will be removed in future versions. Please use "table.include.list" instead.` |
| `snapshot-mysql` | `snapshot.mode=no_data`: `Snapshot step 7 - Skipping snapshotting of data`. No table topic for 4 rows; 1 event after one insert | `snapshot.mode=schema_only`: same line, same counts |
| Change to `initial` | Snapshot `SKIPPED`, topic stays at 1 | Same |
| New snapshot after removing the offset | Topic 1 to 6 | New connector name: topic 1 to 6 |
| The other version's value | `schema_only` rejected: `The 'snapshot.mode' value is invalid: Value must be one of always, initial_only, configuration_based, when_needed, initial, custom, no_data, recovery` | `no_data` rejected: `Value must be one of never, initial_only, when_needed, initial, schema_only, schema_only_recovery` |
| `snapshot-postgres` | `snapshot.mode=no_data`: `According to the connector configuration no snapshot will be executed`. No topic; 1 event after one insert | `snapshot.mode=never`: same line, same counts |
| Change to `initial` | `A previous offset indicating a completed snapshot has been found.` Topic stays at 1 | `Previous snapshot has completed successfully, streaming logical changes from last known position`. Topic stays at 1 |
| New snapshot after removing the offset | Topic 1 to 6 | New connector name and new `slot.name`: topic 1 to 6 |
| The other version's value | `never` rejected: `Value must be one of always, initial_only, configuration_based, when_needed, initial, custom, no_data` | `no_data` rejected: `Value must be one of always, exported, never, initial_only, initial, custom` |
| `topics`, no `topic.creation.default.*` | Connector and task `RUNNING`, no topic of the prefix except the schema history topic. 33 warnings in 30 seconds: `The metadata response from the cluster reported a recoverable issue with correlation id 35 : {myt=UNKNOWN_TOPIC_OR_PARTITION}` | Same state. 733 warnings in 75 seconds: `Error while fetching metadata with correlation id 734 : {myt=UNKNOWN_TOPIC_OR_PARTITION}` |
| Fix: add the two settings | `Created topic (name=myt.inventory.customers, ...)`, 7 and 5 events | Same |
| Fix: create the topics by hand (PostgreSQL connector) | Topics fill without a restart: 6 and 5 events | Same |
| `publication`, existing publication with `orders` only | Snapshot reads both tables (6 and 5). After one insert into each: `customers` 6, `orders` 6. `pg_publication_tables` lists `orders` only | Same |
| Fix: `ALTER PUBLICATION ... ADD TABLE` | Next insert arrives (7 events, 8 rows in the table). The row inserted before the fix does not | Same |
| Same start with `publication.autocreate.mode=filtered` | Debezium runs `ALTER PUBLICATION pgq_pub SET TABLE "public"."customers", "public"."orders";`. The topic holds the 8 snapshot events and the next insert, 9 in all | The publication is left as it was: `orders` only. The topic holds the 8 snapshot events and the next insert does not arrive |
| `no-task`, `tasks.max=2` on MySQL | Connector `RUNNING`, `"tasks": []`. `Failed to reconfigure connector's tasks (my-notask), retrying after backoff.` and `java.lang.IllegalArgumentException: Only a single connector task may be started` | Same, the first line ends `retrying after backoff:` |
| Fix: `tasks.max=1` | Task `RUNNING`, snapshot arrives | Same |
| `tasks.max=2` on PostgreSQL | One task, `RUNNING` | Same |
| `topics-worker-off` | Worker `topic.creation.enable = false`: the connector's `topic.creation.default.*` do nothing, 33 warnings in 30 seconds, no topic. No log line says so. Back to `true`: topics are created | Same, 723 warnings in 75 seconds |
| `two-workers` | Both workers advertise `localhost`. The second connector is `RUNNING` with `"tasks": []` and `worker_id` `localhost:8083`. `Request to leader to reconfigure connector tasks failed`, `Internal request missing required signature`. With resolvable names: task `RUNNING`, 4 and 4 events | Not run |

## Files

- `docker-compose.yml`: Kafka in KRaft mode with topic auto-creation off, MySQL, PostgreSQL, Kafka Connect with the Debezium connectors. Only the Connect REST port is published.
- `docker-compose.two-workers.yml`: Kafka, PostgreSQL and two Kafka Connect workers in one group.
- `mysql/init.sql`, `postgres/init.sql`: an `inventory` database with `customers` and `orders`, 4 rows each. The PostgreSQL tables are in the `public` schema.
- `run.sh`: every step above. The connector configurations are built in `mysql_config` and `pg_config`.
- `logs/`: the output of the two runs, one folder per Debezium version. `00-run-output.txt` is the whole run; the other files are the status responses and log lines of single steps.
