# Lab: a PostgreSQL replication slot fills the disk

Backs the runbook at `docs/runbooks/postgres/replication-slot-filling-disk.mdx`.

A replication slot keeps the write-ahead log (WAL) that its consumer has not confirmed yet. This lab leaves a slot without a consumer on a server that keeps writing, shows each way a slot stops moving, applies each fix, and then lets a 256 MB disk fill up to see what PostgreSQL does and how it comes back.

## What you need

Docker with Compose and about 1 GB of free memory. No host port is published. The lab writes a few hundred megabytes of WAL inside the container and removes everything with `./run.sh down`.

## Run it

```bash
./run.sh up             # PostgreSQL 18.7, wal_level=logical, max_wal_size=64MB, two databases
./run.sh baseline       # no slot: 96 MB of writes, pg_wal stays near max_wal_size
./run.sh stall          # a logical slot nobody reads, 256 MB of writes: pg_wal keeps it all
./run.sh diagnose       # the queries that identify the slot
./run.sh catch-up       # the consumer reads and confirms, checkpoints remove the WAL
./run.sh stalled        # a connected consumer that is frozen: active = t, WAL still kept
./run.sh neighbour      # a slot in an idle database keeps the WAL of a busy one; a heartbeat row frees it
./run.sh long-xact      # a healthy consumer and one transaction left open: restart_lsn cannot move
./run.sh drop-active    # pg_drop_replication_slot on an active slot, then the order that works
./run.sh cap            # max_slot_wal_keep_size: the slot is invalidated; what each consumer then gets
./run.sh idle-timeout   # idle_replication_slot_timeout (PostgreSQL 18 and later)
./run.sh disk-full      # a 256 MB disk: the PANIC and the failed restart
./run.sh disk-recover   # free space outside pg_wal, start PostgreSQL, drop the slot
./run.sh disk-capped    # the same disk and the same writes with max_slot_wal_keep_size set
./run.sh down
```

Another version, with every step captured under `logs/postgres-<version>/`:

```bash
PG_VERSION=13.23 ./run.sh all
```

The steps build on each other, so run them in this order. One full pass takes about six minutes, most of it waiting: the consumer reports every 10 seconds, `wal_sender_timeout` is 60 seconds, and one step leaves a transaction open for 60 seconds.

## How the lab is built

- The consumer is `pg_recvlogical`, the client that ships with PostgreSQL. It reads the slot over the replication protocol, as a change data capture (CDC) tool does, and throws the changes away.
- `write_wal(n)` in `init.sql` inserts rows until `n` MB of WAL exist and empties the table every 50,000 rows, so only the WAL grows.
- `max_wal_size` is 64 MB, so that a few hundred megabytes of writes are enough to see the effect of a slot. The `cap` step raises it to 1 GB for its duration, so that no automatic checkpoint runs between two queries.
- After a consumer has caught up, the lab keeps writing about 1 MB per round and runs a checkpoint every 12 seconds, and prints one line per round until `pg_wal` is back near `max_wal_size`.
- The `disk-full` steps use a second service, `pgfull`, whose data directory is on a 256 MB tmpfs. Its container stays up when PostgreSQL shuts down, as a host would, so the full disk is still there afterwards.
- The "frozen" consumer is `pg_recvlogical` stopped with `SIGSTOP`. The consumer that "confirms only what it has read" is two SQL functions: `pg_logical_slot_peek_binary_changes` to read and `pg_replication_slot_advance` to confirm the last position read.

## What the runs showed

Run on 2026-11-16, each version on a fresh container. Sizes in the table are from 18.7 unless a version is named.

| Image | `SELECT version()` | Started (UTC) |
| --- | --- | --- |
| `postgres:18.7` | PostgreSQL 18.7 (Debian 18.7-1.pgdg13+2) | 18:42 |
| `postgres:17.12` | PostgreSQL 17.12 (Debian 17.12-1.pgdg13+1) | 18:20 |
| `postgres:16.15` | PostgreSQL 16.15 (Debian 16.15-1.pgdg13+2) | 18:25 |
| `postgres:15.19` | PostgreSQL 15.19 (Debian 15.19-1.pgdg13+2) | 18:31 |
| `postgres:14.25` | PostgreSQL 14.25 (Debian 14.25-1.pgdg13+1) | 18:37 |
| `postgres:13.23` | PostgreSQL 13.23 (Debian 13.23-1.pgdg13+1) | 18:54 |
| `postgres:12.22` | PostgreSQL 12.22 (Debian 12.22-1.pgdg120+1) | 18:15 |
| `postgres:19rc2` | PostgreSQL 19rc2 (Debian 19~rc2-1.pgdg13+1) | 18:48 |

| Step | Result |
| --- | --- |
| `up` | `pg_replication_slots` has 12 columns on 12.22. 13.23 adds `wal_status` and `safe_wal_size`, 14.25 `two_phase`, 16.15 `conflicting`, 17.12 `inactive_since`, `invalidation_reason`, `failover` and `synced`, 18.7 `two_phase_at`, 19rc2 `slotsync_skip_reason` |
| `baseline` | All: after 96 MB of writes and a checkpoint, `pg_wal` is 64 MB in 4 files |
| `stall` | All: after 256 MB of writes and a checkpoint the slot holds 257 MB, and `pg_wal` is 272 MB (288 MB on 15.19, 16.15 and 17.12). `wal_status` is `extended` from 13.23 |
| `diagnose` | 12.22: `max_slot_wal_keep_size`, `wal_keep_size` and `idle_replication_slot_timeout` are each an `unrecognized configuration parameter`, and `wal_keep_segments` exists. 13.23 to 17.12: `wal_keep_segments` and `idle_replication_slot_timeout` are unrecognized. 18.7, 19rc2: only `wal_keep_segments` is |
| `catch-up` | All: the consumer confirms the backlog in its first report. `pg_wal` is back at 64 MB in 4 files after the second checkpoint (after the first on 12.22). On 18.7: 256 MB in 16 files, then 64 MB |
| `stalled` | All: the frozen consumer keeps `active = t` and the slot holds 99 MB to 101 MB. After 60 s: `LOG:  terminating walsender process due to replication timeout`, and the slot is inactive and still holds the WAL. After the consumer is resumed, `pg_wal` goes back to 64 MB to 96 MB |
| `neighbour` | All: the slot in `quietdb` holds 129 MB (130 MB on 19rc2) written by `appdb`, and a read returns 0 changes. After one heartbeat row: 4 messages, and the slot still holds 44 MB to 93 MB. After the second: under 1 kB, and `pg_wal` is 64 MB. `pg_recvlogical` on the same slot confirms the keepalive position with no change in `quietdb` |
| `long-xact` | All: with one session `idle in transaction`, the consumer confirms and the slot still holds 97 MB. After the transaction ends, `pg_wal` goes from 112 MB or 128 MB to 64 MB or 80 MB |
| `drop-active` | All: `ERROR:  replication slot "cdc_slot" is active for PID n`. After `pg_terminate_backend` alone the consumer is back within 8 s. Terminate and drop together: the first attempt failed with the same error on 16.15 and 19rc2 and the second worked, on the other six the first worked. 14.25 to 19rc2: with `pg_terminate_backend(pid, 5000)` the drop works at once. Afterwards the consumer gets `ERROR:  replication slot "cdc_slot" does not exist` |
| `cap` | 12.22: no such setting. 13.23 to 19rc2, cap 64 MB: `reserved` after 32 MB, `unreserved` after 80 MB, `lost` after the checkpoint. Log on 13.23, 14.25, 15.19: `invalidating slot "cdc_slot" because its restart_lsn ... exceeds max_slot_wal_keep_size`. Log on 16.15 to 19rc2: `invalidating obsolete replication slot "cdc_slot"` |
| | What consumers of the invalidated slots get. SQL functions: `can no longer get changes from replication slot "cdc_slot"` (13.23 to 17.12), `can no longer access replication slot "cdc_slot"` (18.7, 19rc2). Streaming: `cannot read from logical replication slot "cdc_slot"` (13.23, 14.25, 15.19), then as the SQL functions. `pg_receivewal` on the physical slot: `requested WAL segment ... has already been removed` (13.23 to 17.12), `can no longer access replication slot "standby_slot"` (18.7, 19rc2). `pg_replication_slot_advance`: `replication slot "cdc_slot" cannot be advanced` (13.23 to 17.12) |
| | 13.23 to 19rc2: raising the cap afterwards leaves the slots `lost`. A new slot holds 0 changes. With a connected consumer: `terminating process n to release replication slot "cdc_slot"`, the consumer gets `FATAL:  terminating connection due to administrator command`. With a frozen consumer: `CHECKPOINT` gives no answer within 20 s, the checkpointer waits on `ReplicationSlotDrop` and the WAL sender on `ClientWrite`, until the consumer is resumed |
| `idle-timeout` | 18.7, 19rc2: with the timeout at 20 s the next checkpoint logs `The slot's idle time of 26s exceeds the configured "idle_replication_slot_timeout" duration of 20s.`, the slot is `lost` with `invalidation_reason = idle_timeout`. 12.22 to 17.12: no such setting |
| `disk-full` | All: PostgreSQL shuts down and `pg_isready` answers `no response`. `PANIC:  could not write to file "pg_wal/xlogtemp.n": No space left on device` on seven versions, `PANIC:  could not write to file "pg_logical/replorigin_checkpoint.tmp": No space left on device` on 16.15. 15.19 to 19rc2 first print `ERROR:  could not extend file ...`. Recovery fails with `FATAL:  could not extend file ...` (19rc2: `could not write to file "pg_wal/xlogtemp.n"`), then `aborting startup due to startup process failure` (12.22 to 14.25) or `shutting down due to startup process failure` (15.19 to 19rc2) |
| `disk-recover` | All: after the 48 MB file is deleted PostgreSQL starts and the slot still holds 131 MB to 160 MB. Drop and checkpoint: `pg_wal` goes from 160 MB or 176 MB to 32 MB or 64 MB, the disk from 82% to between 35% and 44% used, and an insert works |
| `disk-capped` | 13.23 to 19rc2: with `max_slot_wal_keep_size = 64MB`, eight rounds of 24 MB all succeed, `pg_wal` peaks at 80 MB (112 MB on 18.7), the slot is `lost` and the server accepts connections. 12.22: no such setting |

Which file a full disk hits first is a matter of timing, so the `disk-full` step does not give the same messages on every run.

## Files

- `docker-compose.yml`: the main server `pg`, and `pgfull`, the same server on a 256 MB disk. No port is published.
- `init.sql`: two databases (`appdb`, which is written to, and `quietdb`, which is not), the `write_wal` procedure, and one publication per database.
- `run.sh`: every step above.
- `logs/`: the output of every step, one folder per PostgreSQL version.
