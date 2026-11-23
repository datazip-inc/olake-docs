# Lab: a Kafka Connect task is killed and "will not recover until manually restarted"

Backs the runbook at `docs/runbooks/kafka-connect/task-failed-will-not-recover.mdx`.

One record that is not JSON is written to a topic that a sink connector reads with the JSON converter. The task is killed, restart calls do not get it past the record, and `errors.tolerance=all` with a dead letter queue does. Further steps show what the dead letter queue does not cover.

The sink is the file sink that ships with Apache Kafka, so the failure and the fix come from the Kafka Connect framework and not from one vendor's connector. The `put-failure` step uses the Debezium JDBC sink and PostgreSQL.

## What you need

Docker with Compose, `curl`, `python3`, `jq`, and about 2.5 GB of free memory (the three services have a `mem_limit` that adds up to 2464 MB). Port 18083 must be free, or set `CONNECT_PORT`.

## Run it

```bash
./run.sh up           # Kafka 4.3.1, PostgreSQL 16, Kafka Connect 4.3.1; topic "orders", two good records, a file sink
./run.sh break        # one record that is not JSON: the task is FAILED
./run.sh restart      # three restart calls
./run.sh dlq          # errors.tolerance=all and a dead letter queue on the same connector
./run.sh dlq-rf       # the default replication factor of the dead letter queue on one broker
./run.sh silent       # errors.tolerance=all and nothing else
./run.sh skip         # move the sink's offset past the record, and the same jump on a sink that has written nothing
./run.sh source       # the same wrapper on a source task
./run.sh put-failure  # a record the JDBC sink itself rejects
./run.sh down
```

`./run.sh all` runs the steps from `break` to `put-failure` in that order.

Old Kafka Connect, from an amd64 image (slow on Apple silicon):

```bash
export LEGACY=1 CONNECT_IMAGE=quay.io/debezium/connect:1.9 KAFKA_VERSION=3.2.0
./run.sh up && ./run.sh all && ./run.sh down
```

Set `LOG_DIR=logs/<folder>` to keep the status responses and log lines of a run.

## What the runs showed

Run on 2026-11-17. Both workers are the Debezium Connect image: `3.7.1.Final` carries Kafka Connect 4.3.1 and `1.9` carries Kafka Connect 3.2.0. The broker is Kafka 4.3.1 in both runs.

| Step | Kafka Connect 4.3.1 | Kafka Connect 3.2.0 |
| --- | --- | --- |
| `up` | File sink `RUNNING`, 2 records written | Same |
| `break` | Connector `RUNNING`, task `FAILED`. Log: `WorkerSinkTask{id=orders-file-sink-0} Task threw an uncaught and unrecoverable exception. Task is being killed and will not recover until manually restarted`. Trace: `Tolerance exceeded in error handler`, caused by `DataException: Converting byte[] to Kafka Connect data failed due to serialization error`, caused by `JsonParseException: Unrecognized token 'id'`. Consumer group at offset 2 of 5 | Same text, same offsets |
| `restart`, `POST /connectors/<name>/restart` | HTTP 204. The task is not restarted | Same |
| `restart`, `POST /connectors/<name>/tasks/0/restart` | HTTP 204. The task starts and is killed again | Same |
| `restart`, `POST /connectors/<name>/restart?includeTasks=true&onlyFailed=true` | HTTP 202, task `RESTARTING`, then killed again | Same |
| `dlq` | The task restarts by itself after the configuration change and is `RUNNING`. 4 good records in the sink, 1 record in `dlq.orders` with 10 `__connect.errors.*` headers, consumer group lag 0. Log: `Error encountered in task orders-file-sink-0. Executing stage 'VALUE_CONVERTER' with class 'org.apache.kafka.connect.json.JsonConverter', where consumed record is {topic='orders', partition=0, offset=2, ...}.` | The task stays `FAILED` after the configuration change, for the 30 seconds the lab waits, and is `RUNNING` after `POST /connectors/orders-file-sink/tasks/0/restart` (HTTP 204). Then the same: 4 good records, 1 record in `dlq.orders` with the same 10 headers, lag 0, the same log line |
| `dlq-rf` | Task `FAILED` at start: `Could not initialize dead letter queue with topic=dlq.orders.rf`, caused by `InvalidReplicationFactorException`. With the factor set to 1: `RUNNING`, 4 records, 1 in the queue | Same failure. After the factor is set to 1 the task again stays `FAILED` until it is restarted by hand, then `RUNNING`, 4 records, 1 in the queue |
| `silent` | `RUNNING`, 4 good records, no dead letter queue and no log line about the dropped record | Same |
| `skip`, sink that had written 2 records | Log names offset 2 with `errors.log.include.messages=true`. Group at offset 2. `PUT /stop`, `PATCH /offsets` to 3 (`The offsets for this connector have been altered successfully`), `PUT /resume`: `RUNNING`, 4 records | Same log line and group offset. `PUT /stop` answers HTTP 404. The connector is deleted, `kafka-consumer-groups.sh --reset-offsets --to-offset 3 --execute` reports `NEW-OFFSET 3`, and the connector is created again: `RUNNING`, 4 records |
| `skip`, new sink that had written nothing | Log line without topic, partition or offset (`errors.log.enable=true` alone). `GET /offsets` returns `{"offsets":[]}`. After the jump to 3 the sink holds 2 records: the 2 good ones before the bad record are skipped too | Not run |
| `source` | Task `FAILED`: `WorkerSourceTask{id=lines-source-0} Task threw an uncaught and unrecoverable exception ...`, `Tolerance exceeded in error handler`, caused by `DataException: Only Struct objects supported for [field extraction], found: java.lang.String`. With `errors.tolerance=all` and a dead letter queue name: `RUNNING`, both records dropped, no `dlq.lines` topic, 2 `Error encountered in task lines-source-0` log lines | Same failure text. After the configuration change the task stays `FAILED` until it is restarted by hand, then the same result |
| `put-failure` | Debezium JDBC sink 3.7.1.Final with `errors.tolerance=all` and a dead letter queue: a record that breaks a `CHECK` constraint kills the task. Trace: `Exiting WorkerSinkTask due to unrecoverable exception.`, ending in `PSQLException: ERROR: new row for relation "orders_jdbc" violates check constraint "orders_jdbc_quantity_check"`. `dlq.orders_jdbc` holds 0 records. After `PATCH /offsets` from 2 to 3: `RUNNING`, rows 1, 2 and 4 | Not run. The image has no JDBC sink connector |

## Files

- `docker-compose.yml`: Kafka in KRaft mode, PostgreSQL, Kafka Connect. The file connector jar of the Kafka distribution is added to the plug-in path, because it is not there by default. Only the Connect REST port is published.
- `postgres/init.sql`: the target table of the `put-failure` step, with a `CHECK` constraint.
- `run.sh`: every step above. `file_sink` builds the sink configuration, `cause` prints the exception lines of a task trace.
- `logs/`: the output of the two runs, one folder per Kafka Connect version. `00-run-output.txt` is the whole run; the other files are the status responses and log lines of single steps.
