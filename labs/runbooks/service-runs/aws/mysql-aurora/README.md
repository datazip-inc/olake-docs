# Run: binary log retention and error 1236 on Aurora MySQL

Backs the Aurora MySQL part of `docs/runbooks/mysql/binlog-retention-error-1236.mdx`.

Author: Shubham. Run on 2026-11-23, in AWS region ap-south-1.

## What was run

| Part | Version and size |
| --- | --- |
| Source | Aurora MySQL 3.14.0 (engine `8.0.mysql_aurora.3.14.0`, `@@version` 8.0.46), one writer of class `db.t3.medium`, backup retention 1 day, a cluster parameter group of family `aurora-mysql8.0` |
| Reader | A MySQL 8.4.13 container on a laptop, set up as a replica of the cluster's writer endpoint over TLS with `CHANGE REPLICATION SOURCE TO`, connecting as the master user |

The cluster was also the target of two AWS DMS tasks of the same day (`../dms-mysql`, `../dms-sqlserver`), which wrote about 17 MB into its binary log while this run watched it.

## Steps

```bash
../mysql-reader.sh aurora seed     # inventory.customers with 4 rows on the source
../mysql-reader.sh aurora up       # the local replica container, with the same 4 rows
../mysql-reader.sh aurora attach   # replicate from the source's current position
../mysql-reader.sh aurora stop     # STOP REPLICA
../mysql-poll.sh aurora <file> 200 10   # one line a minute, FLUSH BINARY LOGS every 10 minutes
../mysql-reader.sh aurora start    # START REPLICA and the status
```

The SQL of the other steps is in the logs, each statement above its answer.

## What the run showed

Times are UTC.

| Step | Result |
| --- | --- |
| As created | `log_bin` is OFF. `SHOW BINARY LOGS`: `ERROR 1381 (HY000): You are not using binary logging`. `SHOW MASTER STATUS`: `Empty set`. The cluster parameter group has `binlog_format = OFF`, and the server variable `@@binlog_format` reads ROW all the same. `CALL mysql.rds_show_configuration` returns one row, `binlog retention hours` NULL |
| Turn binary logging on | `binlog_format = ROW` in the cluster parameter group is a static parameter. The writer showed `applying`, then `pending-reboot` after 79 seconds. The reboot took under a minute. Afterwards `log_bin` is ON and files are named `mysql-bin-changelog.000001` and up. `binlog_expire_logs_seconds` is 0 |
| `CALL mysql.rds_set_configuration('binlog retention hours', n)` | 2160 and 168 are accepted. 2161 and 100000 give no error and are stored as 2160. 0 answers `ERROR 1644 (45000): For binlog retention hours the value must be between 1 and 2160 inclusive or be NULL`. NULL is accepted |
| `SET GLOBAL binlog_expire_logs_seconds = 604800` | `ERROR 1227 (42000): Access denied; you need (at least one of) the SUPER or SYSTEM_VARIABLES_ADMIN privilege(s) for this operation` |
| `PURGE BINARY LOGS BEFORE NOW()` | `ERROR 1227 (42000): Access denied; you need (at least one of) the SUPER or BINLOG_ADMIN privilege(s) for this operation` |
| `FLUSH BINARY LOGS` | Works |
| The reader attached | A row inserted on the source was on the replica 6 seconds later, 5 rows on both |
| The reader stopped at 08:54:48 on `mysql-bin-changelog.000003`, retention NULL | For 68 minutes no file left `SHOW BINARY LOGS`. At 10:02:39 all 11 files written since the reboot of 08:50 were listed, the first of them 72 minutes old. A new file appeared only at each `FLUSH BINARY LOGS` of the run, every 10 minutes: Aurora did not start one by itself |
| Retention set to 1 hour at 10:02:39 | At 10:05:47, three minutes later, files 000001 to 000005 were gone. Each had been closed more than an hour before. File 000006, closed 51 minutes before, stayed |
| The reader started at 10:05:58 | `Last_IO_Errno: 13114`, `Last_IO_Error: Got fatal error 1236 from source when reading data from binary log: 'Could not find first log file name in binary log index file'`. Source 79 rows, replica 5 |

The error as the replica printed it:

```text
                Last_IO_Errno: 13114
                Last_IO_Error: Got fatal error 1236 from source when reading data from binary log: 'Could not find first log file name in binary log index file'
```

```text
[ERROR] [MY-010557] [Repl] Error reading packet from server for channel '': Could not find first log file name in binary log index file (server_errno=1236)
[ERROR] [MY-013114] [Repl] Replica I/O for channel '': Got fatal error 1236 from source when reading data from binary log: 'Could not find first log file name in binary log index file', Error_code: MY-013114
```

The wording "from source" and the number 13114 come from the replica, which ran MySQL 8.4.13. The Aurora side only sends error 1236 and the text in quotes.

## Files

- `../mysql-reader.sh`, `../mysql-poll.sh`, `../mysql-common.sh`: the scripts of the run.
- `logs/01` the cluster as created, `02` the parameter change and the reboot, `03` the checks after it and the retention procedure, `04` the reader, `05` the watch with retention NULL, `06` and `07` the retention of one hour, `08` the reader's error.
