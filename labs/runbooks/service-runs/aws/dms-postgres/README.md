# Run: AWS DMS on a PostgreSQL replication slot (Amazon RDS)

Backs the AWS DMS and Amazon RDS part of `docs/runbooks/postgres/replication-slot-filling-disk.mdx`.

## What was run

- Run on 2026-11-23, 09:05 to 10:00 UTC, in `ap-south-1`.
- AWS DMS replication instance `dms.t3.small`, engine 3.6.1. Tasks of type full load and ongoing replication, with task logging on.
- Source: Amazon RDS for PostgreSQL 17.11, `db.t4g.micro`, `rds.logical_replication = 1`, `wal_sender_timeout = 30000` ms (the RDS default), `max_wal_size` lowered to 256 MB, `wal_keep_size = 2048` MB (the RDS default), `archive_timeout = 300` s, WAL segments of 64 MB.
- Target: Aurora PostgreSQL 17.11, database `dmstarget`.
- Two source databases as in the lab: `appdb`, which is written to, and `quietdb`, which is not. The WAL volume goes to a table `filler` that no task captures, so DMS has nothing to apply.

`setup.sh` creates the endpoints, `common.sh` holds the queries, and each step below was run from the shell with its output captured under `logs/`.

## What the runs showed

| Case | Step | Result |
| --- | --- | --- |
| Start | A task on `appdb` (`orders`, `notes`) | DMS creates its own slot, named like `x45rd6uednefxke3_00016415_02f6a4d8_e2b6_46f9_9847_832f36cfcc78`, with the plugin `test_decoding`. It also creates the table `public.awsdms_ddl_audit` and the event trigger `awsdms_intercept_ddl` in the source database. No publication |
| No consumer | Task running, 1 GB of writes in 30 s | `confirmed_flush_lsn` follows. `restart_lsn` lags: 711 MB still held after two checkpoints, 40 s later |
| | `stop-replication-task` | Status `stopped`. The slot stays, `active = f` |
| | 1.5 GB more while the task is stopped | The slot holds 2,253 MB, `wal_status = extended`, `pg_wal` is 2,432 MB in 38 files |
| | CloudWatch for the instance, three minutes later | `TransactionLogsDiskUsage` 2,432 MB, `OldestReplicationSlotLag` 2,253 MB, `ReplicationSlotDiskUsage` 0 MB |
| | `start-replication-task` with `resume-processing` | The slot is active after 16 s. It holds 100 MB after 187 s and 1,448 bytes after the next captured change. `pg_wal` stays at 2,304 MB (`wal_keep_size` plus `max_wal_size`) |
| Open transaction | Task running. One session inserts a row and sits `idle in transaction` for 300 s. Others write 1 GB | `confirmed_flush_lsn` moves from `0/B800C810` to `0/FC36FDD8`. `restart_lsn` stays at `0/B800CA68`. The slot holds 1,091 MB. The `pg_stat_activity` query of the page finds the session |
| | CloudWatch in the same minutes | `OldestReplicationSlotLag` 1,091 MB, `ReplicationSlotDiskUsage` 0 MB |
| | After the `COMMIT` | Four checkpoints in the next 63 s change nothing. After one more captured change, 75 s later, `restart_lsn` is `0/FC380608` and the slot holds 61 MB. The row of the open transaction is in the target |
| Idle database | A second task on `quietdb`. `appdb` writes 1.5 GB | The `quietdb` slot is `active = t` and holds 1,541 MB. Neither of its positions moves in the next five minutes |
| | Endpoint settings | `HeartbeatEnable`, `HeartbeatFrequency` and `HeartbeatSchema` are all unset |
| | `modify-endpoint --postgre-sql-settings HeartbeatEnable=true,HeartbeatFrequency=1`, then a resume | The first resume is refused: `Test connection for replication instance rbtest-dms and endpoint rbtest-p-src-quietdb should be successful for starting the replication task`. After `test-connection` it starts |
| | With the heartbeat | 42 s after the task is running the slot holds 1,984 bytes (from 1,792 MB). DMS has created `public.awsdms_heartbeat` in `quietdb` and updates its one row every minute |
| | The `appdb` slot in the same half hour: task running, no heartbeat, no writes to `appdb` | 198 MB at 09:37, 262 MB at 09:39, 390 MB at 09:52, 454 MB at 09:54. It grows by one 64 MB segment each time RDS switches the WAL file, every 300 s |
| Left behind | Both tasks stopped | Both slots stay, `active = f` |
| | Both tasks deleted (`delete-replication-task`) | Both slots are gone from `pg_replication_slots` |
| | What stays in the source databases | `public.awsdms_ddl_audit`, the event trigger and function `awsdms_intercept_ddl`, and `public.awsdms_heartbeat` |

## Files

- `setup.sh`: endpoints and connection tests. `common.sh`: the queries and helpers.
- `logs/00-prepare.txt` to `06-left-behind.txt`: output of every step, with host names and the client address masked. In `05-idle-database.txt` one line reads `task rbtest-p-quietdb: running` after the refused start; the task was stopped at that moment, as the slot lines below it show.
