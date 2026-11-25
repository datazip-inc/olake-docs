# Run: binary log retention and error 1236 on Amazon RDS for MySQL

Backs the Amazon RDS part of `docs/runbooks/mysql/binlog-retention-error-1236.mdx`. This run repeats the reader steps of the local lab (`labs/runbooks/mysql/binlog-retention-error-1236`) against an RDS instance.

Author: Shubham. Run on 2026-11-23, in AWS region ap-south-1.

## What was run

| Part | Version and size |
| --- | --- |
| Source | Amazon RDS for MySQL 8.4.13, `db.t4g.micro`, 20 GB gp3, single-AZ, automated backups 1 day, a parameter group of family `mysql8.4` with default values |
| Reader | A MySQL 8.4.13 container on a laptop, set up as a replica of the instance over TLS with `CHANGE REPLICATION SOURCE TO`, connecting as the master user |

The instance host name in the logs reads `rbtest-mysql.<id>.ap-south-1.rds.amazonaws.com`.

## Steps

```bash
../mysql-reader.sh rds seed      # inventory.customers with 4 rows on the source
../mysql-reader.sh rds up        # the local replica container, with the same 4 rows
../mysql-reader.sh rds attach    # replicate from the source's current position
../mysql-reader.sh rds stop      # STOP REPLICA
../mysql-poll.sh rds <file> 40   # one line a minute until <file> leaves SHOW BINARY LOGS
../mysql-reader.sh rds start     # START REPLICA and the status
```

The SQL of the other steps is in the logs, each statement above its answer.

## What the run showed

Times are UTC.

| Step | Result |
| --- | --- |
| Defaults | `log_bin` 1, `binlog_format` ROW, `binlog_row_image` FULL, `binlog_row_metadata` MINIMAL, `gtid_mode` OFF_PERMISSIVE, `binlog_expire_logs_seconds` 2592000. Files are named `mysql-bin-changelog.000001` and up. `CALL mysql.rds_show_configuration` returns `binlog retention hours` NULL, `source delay` 0 and `target delay` 0 |
| Statements of MySQL 8.4 | `SHOW BINARY LOG STATUS` works. `SHOW MASTER STATUS`: `ERROR 1064`, as on any MySQL 8.4 |
| `SET GLOBAL binlog_expire_logs_seconds = 604800` | `ERROR 1227 (42000): Access denied; you need (at least one of) the SUPER or SYSTEM_VARIABLES_ADMIN privilege(s) for this operation`. `SET PERSIST` the same. In the parameter group the setting is not modifiable: `The parameter binlog_expire_logs_seconds cannot be modified.` |
| `PURGE BINARY LOGS TO ...` and `BEFORE ...` | `ERROR 1227 (42000): Access denied; you need (at least one of) the SUPER or BINLOG_ADMIN privilege(s) for this operation` |
| `FLUSH BINARY LOGS` | Works. `FLUSH LOGS`: `ERROR 1045 (28000): Access denied for user 'rbadmin'@'%' (using password: YES)` |
| The reader attached | A row inserted on the source was on the replica 6 seconds later, 5 rows on both |
| The reader stopped at 08:56:37 on `mysql-bin-changelog.000005`, retention NULL | `SHOW BINARY LOGS` lost files in three rounds five minutes apart: files 1 to 3 by 09:00:42, files 4 to 8 by 09:05:47, files 9 to 11 by 09:10:51. The reader's file was last listed at 09:04:45 and gone at 09:05:47, about 9 minutes after the reader stopped |
| The reader started at 09:06:09 | `Last_IO_Errno: 13114`, `Last_IO_Error: Got fatal error 1236 from source when reading data from binary log: 'Could not find first log file name in binary log index file'`. Source 21 rows, replica 5 |
| `CALL mysql.rds_set_configuration('binlog retention hours', n)` | 24 and 168 are accepted. 169, 2160, 100000 and 0 answer `ERROR 1644 (45000): For binlog retention hours the value must be between 1 and 168 inclusive or be NULL` and leave the value as it was. `binlog_expire_logs_seconds` stays 2592000 whatever the hours are |
| The reader rebuilt, then stopped at 09:16:28 on `mysql-bin-changelog.000014`, retention 24 hours | 22 minutes and four rounds later every file from 000013 to 000022 was still listed |
| The reader started at 09:38:47 | No error 1236: the I/O thread read up to `mysql-bin-changelog.000022`. The SQL thread stopped on `Last_SQL_Errno: 1146`, `Table 'mysql.rds_heartbeat2' doesn't exist`. With `CHANGE REPLICATION FILTER REPLICATE_WILD_IGNORE_TABLE = ('mysql.%')` both threads ran, and source and replica had the same 26 rows and the same checksum |
| What RDS itself writes | Each new file starts with `INSERT INTO mysql.rds_heartbeat2(id, value) values (1, <time in ms>) ON DUPLICATE KEY UPDATE ...`. Seven of them in 26 minutes, about five minutes apart (`logs/10`) |

The error as the replica printed it:

```text
                Last_IO_Errno: 13114
                Last_IO_Error: Got fatal error 1236 from source when reading data from binary log: 'Could not find first log file name in binary log index file'
```

```text
[ERROR] [MY-010557] [Repl] Error reading packet from server for channel '': Could not find first log file name in binary log index file (server_errno=1236)
[ERROR] [MY-013114] [Repl] Replica I/O for channel '': Got fatal error 1236 from source when reading data from binary log: 'Could not find first log file name in binary log index file', Error_code: MY-013114
```

## Files

- `../mysql-reader.sh`, `../mysql-poll.sh`, `../mysql-common.sh`: the scripts of the run.
- `logs/01` defaults, `02` the generic statements, `03` to `05` the reader with the default retention, `06` the retention procedure, `07` to `09` the reader with 24 hours, `10` what RDS writes to the binary log.
