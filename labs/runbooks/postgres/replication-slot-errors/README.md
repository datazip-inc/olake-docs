# Lab: PostgreSQL replication slot errors

Backs the runbook at `docs/runbooks/postgres/replication-slot-errors.mdx`.

A replication slot is looked up by its name on the server a consumer connects to. This lab triggers each error that lookup gives: the slot does not exist, its name is taken, another session holds it, and it has been invalidated.

It triggers them through the SQL functions, through a consumer that streams the slot as a change data capture (CDC) tool does, and through a subscription, PostgreSQL's own logical replication. A second server, a standby, shows what happens to a slot when the standby is promoted, with and without the failover slots of PostgreSQL 17.

## What you need

Docker with Compose and about 800 MB of free memory. No host port is published. `pgoutput.py` runs on the host with the standard library of Python 3.

## Run it

```bash
./run.sh up              # PostgreSQL 19.0, wal_level = logical, three databases and a publication
./run.sh missing         # replication slot "x" does not exist, and was not created in this database
./run.sh recreate        # create the slot again; a consumer that resumes at its saved position
./run.sh exists          # replication slot "x" already exists, and --if-not-exists
./run.sh active          # replication slot "x" is active for PID n, and wal_sender_timeout
./run.sh subscription    # the same errors through CREATE SUBSCRIPTION, DROP SUBSCRIPTION and the apply worker
./run.sh invalidated     # a slot invalidated by max_slot_wal_keep_size
./run.sh standby         # a standby whose primary_slot_name does not exist on the primary
./run.sh promote         # a logical slot after its standby is promoted
./run.sh failover-slots  # PostgreSQL 17 and later: a failover slot, synchronized and then promoted
./run.sh down
```

Every step on another version, captured under `logs/postgres-<version>/`:

```bash
PG_VERSION=13.23 ./run.sh all
```

Each step starts by stopping every consumer and dropping every slot, so the steps can run alone or in any order. One full pass takes about five minutes, most of it in `active`, which waits for the default `wal_sender_timeout` of 60 seconds and then 90 seconds with the timeout off.

## How the lab is built

- `init.sql` creates three databases: `appdb` with a table `orders`, the publication `cdc_pub` and a procedure `write_wal(n)` that writes `n` MB of write-ahead log (WAL), and `otherdb` and `subdb`, each with an empty `orders` table.
- `hba.sh` adds the `pg_hba.conf` line that a replication connection from the standby needs.
- The streaming consumer is `pg_recvlogical`, the client that ships with PostgreSQL, with the `pgoutput` plugin. It reads the slot over the replication protocol, as a CDC tool does.
- Run in the background, `pg_recvlogical` retries every 5 seconds after an error. Each background consumer connects with its own `application_name`, so `pg_stat_activity` shows which one holds the slot.
- A "frozen" consumer is `pg_recvlogical` stopped with `SIGSTOP`. Its connection stays open and it does not answer, as with a client that hangs or a network that drops packets.
- The SQL consumer is `pg_logical_slot_get_binary_changes`, which reads and confirms. `pgoutput.py` prints the messages it returns.
- `recreate` uses the `test_decoding` plugin, so that the rows the consumer receives can be read in the log. The consumer keeps the position it reached and asks for it again with `pg_recvlogical --startpos`, as a CDC tool resumes from its stored offset.
- The subscriptions in `subscription` connect to `appdb` on the same server. The manual allows this when the slot is not created by the same command, so the step creates the slot first.
- The standby is a second container, `standby`, cloned from the primary with `pg_basebackup -R`. Its container stays up without PostgreSQL until `run.sh` has written its settings, then starts it. `pg_promote()` promotes it.
- `invalidated` sets `max_slot_wal_keep_size` to 32 MB, writes 80 MB and runs a checkpoint.

## What the runs showed

Run on 2026-11-28, each version on a fresh container.

| Image | `SELECT version()` | Started (UTC) |
| --- | --- | --- |
| `postgres:19.0` | PostgreSQL 19.0 (Debian 19.0-2.pgdg13+1) | 09:30 |
| `postgres:18.7` | PostgreSQL 18.7 (Debian 18.7-1.pgdg13+5) | 09:35 |
| `postgres:17.12` | PostgreSQL 17.12 (Debian 17.12-1.pgdg13+1) | 09:40 |
| `postgres:13.23` | PostgreSQL 13.23 (Debian 13.23-1.pgdg13+1) | 09:45 |

Unless a row names a version, the result was the same on all four. Process IDs and log sequence numbers (LSNs) differ between runs. 19.0 writes an LSN with eight digits after the slash (`0/00000000`, `0/02474878`), and the other three write `0/0` and `0/2494850`.

| Step | What was done | Result |
| --- | --- | --- |
| `up` | Start the primary | `wal_level = logical`. `max_replication_slots` and `max_wal_senders` 10, `wal_sender_timeout` 60 s |
| `missing` | `pg_drop_replication_slot`, `pg_logical_slot_get_binary_changes`, `pg_replication_slot_advance`, `pg_recvlogical` and `pg_receivewal` on slots that do not exist. Then a slot of `appdb` read from `otherdb` | `ERROR:  replication slot "cdc_slot" does not exist` from every one of the logical readers. `pg_receivewal`: `replication slot "standby_slot" does not exist` on 17.12 to 19.0, `could not send replication command "START_REPLICATION": ERROR:  replication slot "standby_slot" does not exist` on 13.23. From `otherdb`: `replication slot "cdc_slot" was not created in this database`. The read from `appdb` returned the row |
| `recreate` | A consumer reads row 101 and keeps its position. The slot is dropped, rows 102 and 103 are written, the slot is created again, row 104 is written. The consumer asks for its position | The consumer received row 104 and nothing else, with no error. 17.12 to 19.0 logged `<lsn> has been already streamed, forwarding to <lsn>`. 13.23 logged nothing at the default settings, and with `log_min_messages = debug1`: `DEBUG:  cannot stream from 0/1644DB8, minimum is 0/1645018, forwarding` |
| `exists` | `cdc_slot` created again in `appdb`, in `otherdb`, as a physical slot and with `pg_recvlogical --create-slot` | `ERROR:  replication slot "cdc_slot" already exists` each time. The command in the `pg_recvlogical` error ended in `( SNAPSHOT 'nothing')` on 17.12 to 19.0 and in `NOEXPORT_SNAPSHOT` on 13.23. `--if-not-exists` printed nothing and returned `exit status 0` |
| `active` | A second consumer and the SQL functions on a slot in use. A frozen consumer A, with the default timeout. `pg_terminate_backend` on a frozen consumer. A frozen consumer with `wal_sender_timeout = 0` | `ERROR:  replication slot "cdc_slot" is active for PID n` from all of them. With A frozen, B was refused 12 times, 5 s apart, until `terminating walsender process due to replication timeout`, and held the slot 60 s (19.0) or 61 s (13.23, 17.12, 18.7) after A was frozen. A, resumed: `could not send feedback packet: server closed the connection unexpectedly`, then `is active for PID` with the PID of B. C held the slot 5 s after the session of B was ended. With the timeout at 0, the frozen C still held the slot 1 min 34 s after its last reply, D was refused 19 times, and no timeout line was logged |
| `subscription` | `CREATE SUBSCRIPTION` with a slot name that is taken, then with `create_slot = false`. A second subscription on the same slot. The slot dropped on the publisher, then the subscription enabled and dropped | `could not create replication slot "cdc_slot": ERROR:  replication slot "cdc_slot" already exists`. With `create_slot = false` row 201 arrived. Second subscription: `could not start WAL streaming: ERROR:  replication slot "cdc_slot" is active for PID n`. Slot gone: `could not start WAL streaming: ERROR:  replication slot "cdc_slot" does not exist`. `DROP SUBSCRIPTION`: `could not drop replication slot "cdc_slot" on publisher: ERROR:  replication slot "cdc_slot" does not exist` on 17.12 to 19.0, `could not drop the replication slot "cdc_slot" on publisher` with `DETAIL:  The error was: ERROR:  replication slot "cdc_slot" does not exist` on 13.23. The worker line read `logical replication apply worker` on 17.12 to 19.0 and `logical replication worker` on 13.23. `DISABLE`, `SET (slot_name = NONE)` and `DROP` then worked |
| `invalidated` | `max_slot_wal_keep_size = 32MB`, 80 MB of writes, a checkpoint | `wal_status = lost`. 18.7 and 19.0: `can no longer access replication slot "cdc_slot"` with `DETAIL:  This replication slot has been invalidated due to "wal_removed".` from the SQL function, the stream and the advance. 17.12: `can no longer get changes from replication slot "cdc_slot"`, and `replication slot "cdc_slot" cannot be advanced`. 13.23: `can no longer get changes from replication slot "cdc_slot"` from the SQL function, `cannot read from logical replication slot "cdc_slot"` from the stream, and `cannot be advanced`. A new slot then returned row 501 |
| `standby` | A standby with `primary_slot_name = 'standby_slot'` and no such slot on the primary, then the slot created | Standby: `FATAL:  could not start WAL streaming: ERROR:  replication slot "standby_slot" does not exist`, every 5 s. Primary: the same error with `START_REPLICATION SLOT "standby_slot" <lsn> TIMELINE 1`. After the slot was created: `started streaming WAL from primary`, and `pg_stat_wal_receiver` showed `streaming` |
| `promote` | A logical slot read and confirmed on the primary, then the standby promoted with `pg_promote()` | The standby had no slots. On the promoted standby `START_REPLICATION` and the SQL function gave `replication slot "cdc_slot" does not exist`. A new slot could be created there |
| `failover-slots` | 17.12 to 19.0: a slot created with `failover = true`, one switched with `ALTER_REPLICATION_SLOT`, `synchronized_standby_slots` on the primary, a standby with `sync_replication_slots = on`, then the promotion | The standby first logged `could not synchronize replication slot` with `Synchronization could lead to data loss`. After the slots were read and `pg_log_standby_snapshot()` ran, both copies showed `synced = t` and `temporary = f` within about 5 s. On the standby: `cannot use replication slot "cdc_slot" for logical decoding` and `cannot drop replication slot "cdc_slot"`. After the promotion the slots were there, and a read waited with `WARNING:  replication slot "standby_slot" specified in parameter "synchronized_standby_slots" does not exist`, 10 times in 10 s. After `ALTER SYSTEM RESET synchronized_standby_slots` the read returned rows 402 and 403 |
| | 13.23 | `function pg_create_logical_replication_slot(unknown, unknown, boolean, boolean, boolean) does not exist` and `unrecognized configuration parameter "sync_replication_slots"` |

## Limits of these runs

- One machine, Apple silicon. All four images ran natively.
- PostgreSQL 14, 15 and 16 were not run. Where the page says that a message changed in 14 or in 15, that comes from the source code.
- No change data capture tool was run for this page: not Debezium, AWS DMS, Airbyte or Flink CDC.
- A hung client is a local `pg_recvlogical` stopped with `SIGSTOP`, not a lost network connection.
- The subscriptions and their publisher are databases of one server.
- The standby was promoted with `pg_promote()` while the primary kept running. No high-availability manager and no `pg_upgrade` were run.
- Each case ran once per version.

## Files

- `docker-compose.yml`: the primary `pg`, and `standby`, which the standby steps start. No port is published.
- `init.sql`: the three databases, the table, the publication and `write_wal`.
- `hba.sh`: allows replication connections from other hosts, with the authentication method of the image's own line.
- `pgoutput.py`: prints `pgoutput` messages read with `pg_logical_slot_get_binary_changes`.
- `run.sh`: every step above.
- `logs/`: the output of every step, one folder per PostgreSQL version.
