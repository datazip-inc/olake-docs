# Lab: MySQL binary log retention, purging, and error 1236

Backs the runbook at `docs/runbooks/mysql/binlog-retention-error-1236.mdx`.

A reader of the MySQL binary log (a replica, or a change data capture tool such as Debezium) remembers a position in that log. This lab shows how MySQL removes binary log files, by expiry and by `PURGE BINARY LOGS`, what a reader reports when it comes back and its position is gone, and which recovery works.

## What you need

Docker with Compose, `curl`, `python3`, and about 2.5 GB of free memory. Every service has a memory limit. Port 18183 must be free for the Debezium steps, or set `CONNECT_PORT`.

The MySQL 5.7 and Debezium 1.9 images exist only for x86-64. On Apple silicon they run emulated.

## Run it

One source server plus one reader at a time. The MySQL steps use a second MySQL server as the reader:

```bash
./run.sh up              # MySQL 8.4.13 source and replica; the replica is loaded from a dump
./run.sh variables       # retention variables, and the statements this version accepts
./run.sh expire          # automatic expiry happens at a flush, not when the time passes
./run.sh expire-on-rotation  # the same when a file fills up and the server rotates by itself
./run.sh purge           # SHOW BINARY LOGS, PURGE BINARY LOGS BEFORE and TO, replica attached
./run.sh purge-in-use    # PURGE while a connected replica still reads an older file
./run.sh rm-file         # a binary log file deleted by hand
./run.sh break-replica   # the replica is stopped, its file is purged: error 1236
./run.sh skip-replica    # the unsafe shortcut, and the rows it loses
./run.sh fix-replica     # the replica rebuilt from a dump
./run.sh other-1236      # an error 1236 that purging did not cause
./run.sh down
```

The Debezium steps replace the second server with Kafka and Kafka Connect:

```bash
./run.sh up-debezium        # Kafka 4.3.1, Debezium 3.7.1.Final; registers the connector
./run.sh break-debezium     # the connector is stopped, the log expires: the task fails
./run.sh fix-debezium       # snapshot.mode=when_needed: a new snapshot
./run.sh reset-debezium     # the other fix: offsets cleared, snapshot.mode=initial
./run.sh quiet-debezium     # a running connector whose tables are quiet loses its position too
./run.sh heartbeat-debezium # heartbeat.interval.ms keeps the stored position moving
./run.sh down
```

Other versions and modes are chosen with environment variables, set for every step of a run:

```bash
export MYSQL_IMAGE=mysql:8.0.46                              # MySQL 8.0
export MYSQL_IMAGE=mysql:5.7.44 MYSQL_PLATFORM=linux/amd64   # MySQL 5.7
export GTID=ON                                               # gtid_mode=ON and auto-positioning
export DEBEZIUM_IMAGE=quay.io/debezium/connect:3.0.8.Final   # Debezium 3.0.8.Final
export LEGACY=1 DEBEZIUM_IMAGE=quay.io/debezium/connect:1.9 MYSQL_IMAGE=mysql:8.0.46   # Debezium 1.9.7.Final
```

Debezium 1.9 cannot read MySQL 8.4, so the old connector is paired with MySQL 8.0.

## What the runs showed: MySQL

Run on 2026-11-16. Each version ran twice, once with `gtid_mode=OFF` (the default) and once with `GTID=ON`.

| Step | MySQL 8.4.13 | MySQL 8.0.46 | MySQL 5.7.44 |
| --- | --- | --- | --- |
| `variables` | `binlog_expire_logs_seconds` = 2592000. `expire_logs_days`: `ERROR 1193 Unknown system variable`. `SHOW MASTER STATUS`, `SHOW MASTER LOGS`, `SHOW SLAVE STATUS`: `ERROR 1064` | `binlog_expire_logs_seconds` = 2592000, `expire_logs_days` = 0. Setting `expire_logs_days` while the other is not 0: `ERROR 3683`. The reverse: `ERROR 4113`. Old and new statements both work, `SHOW BINARY LOG STATUS` does not (`ERROR 1064`) | `expire_logs_days` = 0. `binlog_expire_logs_seconds`: `ERROR 1193`. `SHOW BINARY LOG STATUS` and `SHOW REPLICA STATUS`: `ERROR 1064` |
| `expire` | A file back-dated by two days, with a one-day retention, stays listed until `FLUSH BINARY LOGS`. With a 5-second retention nothing is removed after 8 seconds; the next flush removes every older file. `binlog_expire_logs_auto_purge=OFF` stops it | Same | Same for the back-dated file with `expire_logs_days=1`. The variable counts whole days |
| `expire-on-rotation`, on a fresh stack after `up` | With `max_binlog_size=4096` and a one-day retention, 40 inserts and no flush statement: the server rotates by itself and the file back-dated by two days is removed | Same | Same |
| `purge` | `PURGE BINARY LOGS BEFORE NOW() - INTERVAL 1 DAY` removes the two back-dated files. `PURGE BINARY LOGS TO` the file the replica is on removes the rest. The replica keeps running | Same | Same |
| `purge-in-use` | Warning 1867: `file ./mysql-bin.000012 was not purged because it was being read by 1 thread(s), purged only 0 out of 2 files.` The replica catches up: 48 of 48 rows | Same | Same, on `mysql-bin.000010` |
| `rm-file` | `SHOW BINARY LOGS` lists the deleted file with size 0. `PURGE BINARY LOGS TO` succeeds with warning 1612: `Being purged log ./mysql-bin.000013 was not found` | Same | Same, on `mysql-bin.000011` |
| `break-replica` | `Last_IO_Errno: 13114`, `Got fatal error 1236 from source when reading data from binary log: 'Could not find first log file name in binary log index file'`. Source 7 customers, replica 4 | Same | `Last_IO_Errno: 1236`, `Got fatal error 1236 from master when reading data from binary log: 'Could not find first log file name in binary log index file'` |
| `skip-replica` | Both threads `Yes`, 0 seconds behind, source 7 customers and replica 4. A later update of a missing row stops the SQL thread: `Last_SQL_Errno: 1032`, `Can't find record in 'customers'` | Same | Same |
| `fix-replica` | Both threads `Yes`, 8 customers and 8 orders on both servers, `CHECKSUM TABLE` equal | Same | Same |
| `other-1236` | `'Client requested source to start replication from position > file size'` | Same | `'Client requested master to start replication from position > file size'` |
| `break-replica` with `GTID=ON` | `'Cannot replicate because the source purged required binary logs. Replicate the missing transactions from elsewhere, or provision a new replica from backup. Consider increasing the source's binary log expiration period. The GTID set sent by the replica is '...:1-17', and the missing transactions are '...:18-19''`. The source logs warning `MY-011809` | Same text | `'The slave is connecting using CHANGE MASTER TO MASTER_AUTO_POSITION = 1, but the master has purged binary logs containing GTIDs that the slave requires. Replicate the missing transactions from elsewhere, or provision a new slave from backup. Consider increasing the master's binary log expiration period. ...'` |
| `skip-replica` with `GTID=ON` | Same outcome as without GTIDs: no error, 3 customers missing, then `Last_SQL_Errno: 1032` | Same | Same |
| `fix-replica` with `GTID=ON` | Loading the dump without clearing the replica's GTID state: `ERROR 3546 ... the added gtid set must not overlap with @@GLOBAL.GTID_EXECUTED`. After `RESET BINARY LOGS AND GTIDS`: both threads `Yes`, checksums equal | Same, with `RESET MASTER` | `ERROR 1840 ... can only be set when @@GLOBAL.GTID_EXECUTED is empty.` After `RESET MASTER`: both threads `Yes`, checksums equal |

## What the runs showed: Debezium

Run on 2026-11-16. The outage in `break-debezium` adds 3 customers, changes 1 order and deletes 1 order while the connector is stopped. The source then holds 7 customers and 3 orders.

| Step | Debezium 3.7.1.Final, Kafka Connect 4.3.1, MySQL 8.4.13 | Debezium 3.0.8.Final, Kafka Connect 3.9.0, MySQL 8.4.13 | Debezium 1.9.7.Final, Kafka Connect 3.2.0, MySQL 8.0.46 |
| --- | --- | --- | --- |
| `up-debezium` | 4 customers and 4 orders read by the snapshot | Same | Same |
| `break-debezium` | Task `FAILED`: `The connector is trying to read change stream starting at BinlogOffsetContext{...}, but this is no longer available on the server. Reconfigure the connector to use a snapshot mode when needed.` | Task stays `RUNNING`. Warning `The connector is trying to read redo log starting at ...`, then `Could not find first log file name in binary log index file Error code: 1236; SQLSTATE: HY000.` and `Retry 1 of unlimited retries will be attempted`, repeated about every 15 seconds | Task `FAILED`: `The connector is trying to read binlog starting at SourceInfo [...], but this is no longer available on the server. Reconfigure the connector to use a snapshot when needed.` |
| The log line before it, `gtid_mode=OFF` | `Connector requires binlog file 'mysql-bin.000003', but server only has mysql-bin.000004, mysql-bin.000005` | Same | `Connector requires binlog file 'mysql-bin.000003', but MySQL only has mysql-bin.000004, mysql-bin.000005` |
| The log line before it, `GTID=ON` | `Some of the GTIDs needed to replicate have been already purged` | Same, and the error from MySQL is `Cannot replicate because the source purged required binary logs. ...` | `Some of the GTIDs needed to replicate have been already purged` |
| `fix-debezium` | Task `RUNNING`. Customers topic 4 to 11, orders topic 4 to 7: every row is read again (`op=r`). No delete event for the order deleted during the outage. A new insert is then streamed (`op=c`) | Same | Same |
| `break-debezium` again, `when_needed` still set | No failure. The connector takes another snapshot by itself: customers topic 12 to 23, orders topic 7 to 9 | Not run | Not run |
| `reset-debezium` (`GTID=ON`) | Kafka Connect: `The Connect framework-managed offsets for this connector have been reset successfully.` Task `RUNNING`, customers topic 4 to 11, orders topic 4 to 7 | Not run | Not run. The step needs the stop and offsets endpoints, which the Kafka Connect 3.2.0 documentation does not list |
| `quiet-debezium` (`GTID=ON`) | The connector is `RUNNING` the whole time. Its stored offset stays on `mysql-bin.000005` while the server expires that file. A task restart then fails with the same message | Not run | Not run |
| `heartbeat-debezium` (`GTID=ON`) | With `heartbeat.interval.ms=2000` the stored offset moves to `mysql-bin.000011`. A task restart stays `RUNNING`, with no new snapshot | Not run | Not run |

## Files

- `docker-compose.yml`: the source server, and two profiles for the reader: `replication` (a second MySQL server) and `debezium` (Kafka in KRaft mode and Kafka Connect). Only the Connect REST port is published.
- `mysql/init.sql`: the `inventory` database, a second database named `noise` that no reader captures, a replication user and a capture user.
- `connector.json`: the Debezium connector configuration.
- `run.sh`: every step above.
- `logs/`: the output of every step, one folder per version. Files with `gtid` in the name are from the `GTID=ON` runs, and `15-fresh-expire-on-rotation.txt` is from a separate stack on which only `up` had run.
