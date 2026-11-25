# Service test: a Flink CDC job on MySQL whose binary log position was purged

Backs the Flink CDC part of `docs/runbooks/mysql/binlog-retention-error-1236.mdx`.

A Flink SQL job reads two MySQL tables with the MySQL CDC connector. The job is stopped with a savepoint, the binary log is purged past the position in that savepoint, and the job is started again in five different ways.

## What you need

Docker with Compose, `curl`, `python3`, and about 4 GB of free memory. Every service has a memory limit. Port 18381 must be free: it is the Flink REST port, which the script reads job states from. The Flink image is about 1.6 GB.

Two jar files go into `lib/`, and `./run.sh fetch` puts them there:

- `flink-sql-connector-mysql-cdc-3.7.0-2.2.jar`, downloaded from Maven Central and checked against its SHA-1 there.
- The MySQL JDBC driver. The connector jar does not carry it: the Flink CDC page says the driver's licence does not allow that, and names `mysql:mysql-connector-java:8.0.27`. This run used `mysql-connector-java-8.0.28.jar`, copied out of the image `quay.io/debezium/connect:1.9`, which was already on the machine. Its SHA-1 is the one Maven Central lists for that file.

## Run it

```bash
./run.sh fetch          # the two jar files
./run.sh up             # MySQL 8.4.13 and a Flink 2.2.1 session cluster with the connector jar
./run.sh start          # submit the job: snapshot of 4 customers and 4 orders, then one streamed insert
./run.sh stop           # stop the job with a savepoint
./run.sh outage         # the job is stopped: 3 customers added, 1 order changed, 1 deleted, the log purged
./run.sh restore        # break it: restore the job from the savepoint
./run.sh restore-none   # the same restore with restart-strategy.type = none
./run.sh when-needed    # the same restore with debezium.snapshot.mode = when_needed
./run.sh latest         # a new job without state and scan.startup.mode = latest-offset
./run.sh fresh          # fix: a new job without state, which takes a new snapshot
./run.sh faq            # the lines of the Flink CDC FAQ that the runbook quotes
./run.sh down
```

`./run.sh all` runs every step and captures each one under `logs/gtid-off/`. `GTID=ON ./run.sh all` does the same with `gtid_mode=ON` and writes to `logs/gtid-on/`. `WATCH=30` shortens the time each restored job is watched from 90 seconds to 30.

## How the test is built

- `sql/job.sql.tmpl` is the job: two `mysql-cdc` source tables, `customers` and `orders`, each printed by a `print` sink. The rows a job prints are read from the TaskManager's standard output. Checkpoints run every 5 seconds.
- Nothing sets a restart strategy, except in the `restore-none` step. With checkpoints on, Flink 2.2.1 chose `ExponentialDelayRestartBackoffTimeStrategy(initialBackoffMS=1000, maxBackoffMS=60000, backoffMultiplier=1.5, ...)` for these jobs, as the JobManager log shows.
- The outage is the one the MySQL lab uses for Debezium: while the job is stopped, 3 customers are added, the quantity of order 2 is changed and order 4 is deleted. The binary log is then rotated twice and `PURGE BINARY LOGS TO` removes every file before the newest one.
- The job state comes from the Flink REST API, `GET /jobs/<id>`, read every 5 seconds, together with the metric `numRestarts`.

## What the runs showed

Run on 2026-11-23, from 09:45 UTC with `gtid_mode=OFF` and from 09:53 UTC with `gtid_mode=ON`, each on fresh containers. The `gtid_mode=ON` run watched each restored job for 30 seconds.

| Component | Version |
| --- | --- |
| Flink | 2.2.1, image `flink:2.2.1-scala_2.12-java17`, one JobManager and one TaskManager |
| Connector | `flink-sql-connector-mysql-cdc-3.7.0-2.2.jar` |
| Debezium inside the connector jar | 1.9.8.Final (`debezium-connector-mysql`, `debezium-core`, `debezium-embedded`), with `mysql-binlog-connector-java` 0.27.2 |
| MySQL JDBC driver | `mysql-connector-java` 8.0.28 |
| MySQL | 8.4.13, `binlog_format=ROW` |

| Step | `gtid_mode=OFF` | `gtid_mode=ON` |
| --- | --- | --- |
| `start` | The job prints 8 rows from the snapshot and then the inserted order, `orders> +I[5, 1, 5, ...]` | Same |
| `stop` | `Savepoint completed.` The TaskManager log gives the saved positions: `mysql-bin.000003`, 237 for `orders` and 158 for `customers` | Positions 277 and 198, with `gtids=<uuid>:1-15` |
| `outage` | After the purge the server lists `mysql-bin.000005` only. The source has 7 customers and 4 orders | Same |
| `restore` | The job is `RESTARTING` at every one of 19 readings over 90 seconds, `numRestarts` reaches 10, and it prints no row. It never reaches `FAILED` | `RESTARTING` at all 7 readings over 30 seconds, `numRestarts` 7 |
| The exception | `java.lang.IllegalStateException: The connector is trying to read binlog starting at Struct{version=1.9.8.Final,connector=mysql,name=mysql_binlog_source,ts_ms=...,db=,server_id=0,file=mysql-bin.000003,pos=158,row=0}, but this is no longer available on the server. Reconfigure the connector to use a snapshot when needed.` | The same text, with `pos=198` and `pos=277` |
| The log line before it | `Connector requires binlog file 'mysql-bin.000003', but MySQL only has mysql-bin.000005` | `Some of the GTIDs needed to replicate have been already purged` and `Server has already purged <uuid>:1-21 GTIDs` |
| `restore-none` | `FAILED` at the first reading. `org.apache.flink.runtime.JobException: Recovery is suppressed by NoRestartBackoffTimeStrategy`, caused by the exception above | Same |
| `when-needed` | No effect. `RESTARTING` at 18 of 19 readings and `RUNNING` at one, between two restarts. `numRestarts` reaches 10, the exception is the same, and no row is printed | `RESTARTING` at 6 of 7 readings and `RUNNING` at one, `numRestarts` 7 |
| `latest` | `RUNNING`. The job prints only the customer inserted after it started. The 3 customers, the changed order and the deleted order of the outage are never printed | Same |
| `fresh` | `RUNNING`. The job prints 12 rows, every row of both tables as it is now: 8 customers and 4 orders, order 2 with quantity 9. There is no delete for order 4. An insert made afterwards is printed | Same |
| `faq` | The FAQ entry Q9 quotes the error with the wording above, says "This error occurs because the binlog file being read by the job has been cleaned up on the MySQL server", and gives `set global expire_logs_days=7;`. The page mentions `expire_logs_days` twice and `binlog_expire_logs_seconds` not at all | Same page |

## Files

- `docker-compose.yml`: the MySQL server, the JobManager and the TaskManager. Only the Flink REST port is published.
- `mysql/init.sql`: the `inventory` database, a second database `noise` that the job does not capture, and the capture user.
- `sql/job.sql.tmpl`: the Flink SQL job.
- `lib/`: the two jar files.
- `run.sh`: every step above.
- `logs/gtid-off/`, `logs/gtid-on/`: the output of every step.
