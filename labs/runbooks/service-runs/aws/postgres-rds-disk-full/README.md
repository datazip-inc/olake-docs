# Run: a replication slot fills the volume of an Amazon RDS for PostgreSQL instance

Backs the Amazon RDS part of "Fix 5: the disk is already full" in `docs/runbooks/postgres/replication-slot-filling-disk.mdx`. The page's own lab fills a 256 MB disk of a self-hosted server. This run fills the 20 GB volume of an RDS instance.

## What was run

- Run on 2026-11-23, 09:02 to 09:45 UTC, in `ap-south-1`.
- Amazon RDS for PostgreSQL 18.6, `db.t4g.micro`, 20 GB gp3, storage autoscaling off, no automated backups, `rds.logical_replication = 1`.
- Settings on the instance: `max_wal_size = 2048` MB, `wal_keep_size = 2048` MB, `max_slot_wal_keep_size = -1`, `idle_replication_slot_timeout = 0`, WAL segments of 64 MB.
- The table and the `write_wal` procedure are the ones of the lab on the page.

```bash
./run.sh setup      # settings, the lab's table and write_wal procedure, a pgoutput slot with no consumer
./run.sh fill       # 1 GB of writes per round until something gives
./run.sh observe    # what the instance, its events, its metrics and its log say afterwards
./run.sh recover    # grow the volume, connect, drop the slot, checkpoint
```

`fill` was run twice. The first pass (`logs/02-fill-first-pass.txt`) stopped at 7.5 GB because the script misread a successful round. The second pass (`logs/02-fill.txt`) wrote until the volume was full.

## What the run showed

| Time (UTC) | What happened |
| --- | --- |
| 09:02 | `FreeStorageSpace` 19,454 MB. A `pgoutput` slot is created and nobody reads it |
| 09:03 to 09:15 | 12 GB by `write_wal` in rounds of 1 GB (18 to 21 s each) and 6.4 GB in 16 MB records. The slot holds everything: 18 GB at 09:15:36, `wal_status = extended` |
| 09:15:56 | The session that writes gets `PANIC:  could not write to file "pg_wal/xlogtemp.3333": No space left on device`, then `connection to server was lost` |
| 09:15:58 | A new connection gets `FATAL:  the database system is not accepting connections`, `DETAIL:  Hot standby mode is disabled.` From 09:16:19 on: `Connection refused` |
| 09:15:56 to 09:28:48 | The PostgreSQL log shows 8 start attempts, about 2 minutes apart. Each one ends the same way (below) |
| 09:16 | `FreeStorageSpace` is 57 MB and stays there. `TransactionLogsDiskUsage` is 19,648 MB. The last value of `OldestReplicationSlotLag` is 18,382 MB at 09:15 |
| until 09:29:13 | `describe-db-instances` still reports `available` |
| 09:38:08 | The status is `storage-full` (first seen; it changed between 09:29 and 09:38) |
| 09:38:27 | `modify-db-instance --allocated-storage 25 --apply-immediately` is accepted |
| 09:38:44 | Status `modifying` |
| 09:41:56 | Status `storage-optimization`, connections still refused |
| 09:43:16 | The first query works, 289 s after the modify call |
| 09:43 | The slot is still there and holds 19 GB in 308 WAL files. `pg_drop_replication_slot` and `CHECKPOINT`: `pg_wal` is 4,096 MB in 64 files, `FreeStorageSpace` is 20,648 MB, an insert works |

Each start attempt in the PostgreSQL log:

```text
LOG:  database system was not properly shut down; automatic recovery in progress
LOG:  redo starts at 4/8C1E71B0
LOG:  redo done at 4/DBFFFEF8 system usage: CPU: user: 3.87 s, system: 2.84 s, elapsed: 10.06 s
FATAL:  could not write to file "pg_wal/xlogtemp.3361": No space left on device
LOG:  startup process (PID 3361) exited with exit code 1
LOG:  shutting down due to startup process failure
LOG:  database system is shut down
```

RDS events for the instance between 09:00 and 09:45: `Applying modification to allocated storage` (09:39:31), `Finished applying modification to allocated storage` (09:41:54), `DB instance restarted` (09:43:16). There was no event for the full volume.

## Files

- `run.sh`: every step. `logs/`: output of every step, with host names and the client address masked.
