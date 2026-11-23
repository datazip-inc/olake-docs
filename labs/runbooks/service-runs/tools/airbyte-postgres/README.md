# Service test: Airbyte's PostgreSQL source and its replication slot

Backs the Airbyte part of `docs/runbooks/postgres/replication-slot-filling-disk.mdx`.

Two things are tested. Series 1 looks at the slot between two syncs and at what the connector does when its saved position can no longer be used. Series 2 puts the slot in a database that is not written to while another database of the same server is busy.

## What "Airbyte" means here

The open-source connector image `airbyte/source-postgres` is run directly with the Airbyte protocol commands `spec`, `check`, `discover` and `read`. This is not Airbyte Cloud and not the Airbyte platform: there is no scheduler, no destination and no retry logic. A sync here is one `read`. The state it prints is handed to the next `read` with `--state`, as the platform does.

## What you need

Docker with Compose, `python3`, and about 3 GB of free memory when both series run at once. No host port is published. The connector image is about 1 GB.

## Run it

```bash
./run.sh prep        # up, spec, strings, check, discover

# Series 1, server pg, database appdb
./run.sh sync1       # first sync: the 4 rows of orders
./run.sh between     # no sync runs: 3 changes to orders, then 128 MB written to an unpublished table
./run.sh sync2       # second sync, with the slot watched while it runs
./run.sh sync3       # third sync, nothing new to read
./run.sh tail        # one more change to orders, behind the 128 MB
./run.sh sync4       # fourth sync: reads that change
./run.sh sync5       # fifth sync: the slot moves when it starts
./run.sh settle      # checkpoints until pg_wal is back near max_wal_size
./run.sh lost        # max_slot_wal_keep_size invalidates the slot between two syncs
./run.sh recreated   # the slot is dropped and created again between two syncs
./run.sh ahead       # the slot is moved past the saved position between two syncs

# Series 2, server pgq, database quietdb
./run.sh quiet-sync 1          # first sync: the 3 rows of customers
./run.sh quiet-busy            # appdb writes 128 MB, quietdb nothing
./run.sh quiet-sync 2          # a sync with nothing to read (and 3: another one)
./run.sh quiet-heartbeat       # a heartbeat table in the publication and the heartbeat query
./run.sh quiet-sync 4 hb       # syncs with the heartbeat query (and 5), then quiet-settle
./run.sh quiet-nopub           # the heartbeat table taken out of the publication
./run.sh quiet-sync 6 hb       # syncs with the query and the table not published (and 7)
./run.sh quiet-republish       # the table back in the publication, then quiet-sync 8 hb, 9 hb, quiet-settle

./run.sh down
```

`./run.sh series1` and `./run.sh series2` run each series in order and capture every step under `logs/`. The two series use different servers, so they can run at the same time. One pass of series 1 takes about 11 minutes and one of series 2 about 14, nearly all of it the connector waiting.

## How the test is built

- Two PostgreSQL servers with the same content, `pg` for series 1 and `pgq` for series 2, so that the two series do not share a write-ahead log (WAL). Each has one slot, created by hand in `run.sh up`, as the Airbyte set-up guide describes. `max_wal_size` is 64 MB, as in the slot lab, so that 128 MB of writes show what a slot holds.
- `write_wal(n)` writes `n` MB of WAL into the table `noise`, which is in no publication. The connector gets no change from it.
- `ab.py` runs one protocol command in a one-off container, keeps the complete output under `logs/raw/` as a gzip file (those files are not kept in the repository), prints the warnings, the errors and the lines about the saved position, and saves the last STATE message for the next sync.
- While a sync runs, the script reads `pg_replication_slots` about three times a second and prints one line each time the slot changes.
- The connector's `initial_waiting_seconds` is set to 120, the lowest value its specification allows. Everything else is at its default, including `lsn_commit_behaviour`, which is `After loading Data in the destination`.

## What the runs showed

Run on 2026-11-23 from 09:19 UTC, both series at the same time, each on a fresh container.

| Component | Version |
| --- | --- |
| Connector | `airbyte/source-postgres:3.8.12`, digest `sha256:d81312cfdcd7db1e9ef7b311e1143d2c82ee47edad8b6008ae61fda9d5ba3c38` |
| Debezium inside the connector | 3.4.3.Final, from the jar names and the log line `Running Debezium engine version 3.4.3.Final.` |
| PostgreSQL | 18.7 (Debian 18.7-1.pgdg13+2), `wal_level=logical`, `max_wal_size=64MB`, `wal_sender_timeout=1min` |

### The connector's options and log lines

| Step | Result |
| --- | --- |
| `spec` | The CDC method has `replication_slot`, `publication`, `initial_waiting_seconds` (default 1200, range 120 to 2400), `lsn_commit_behaviour` (default `After loading Data in the destination`, the other value is `While reading Data`), `heartbeat_action_query` (titled "Debezium heartbeat query (Advanced)", default empty), `initial_load_timeout_hours` and `debezium_shutdown_timeout_seconds`. It has no `invalid_cdc_cursor_position_behavior`, and the words `Fail sync` and `Re-sync data` are not in the specification |
| `strings` | Of the 193 jar files in the image, none has a class that contains `trigger sync from scratch` or `Saved offset is before`. `has advanced beyond the source` and `is not valid: wal_status` are in `ReplicationSlotManager` of the connector's own jar |
| Every sync | The connector logs `Using LSN flush mode 'manual': LSN will NOT be flushed to the database and WAL logs will NOT be cleared automatically.` and `Using offset mismatch strategy 'no_validation'` |

### Series 1: the slot between two syncs

| Step | Result |
| --- | --- |
| `sync1`, no state | 4 records in 18 seconds. Before it reads, the connector moves the slot to the current WAL position: `Attempting to commit up to LSN{0/20404C8}`, `Successfully committed`. The slot is `active = t` for 11 seconds and `f` afterwards |
| `between` | No WAL sender is connected. After 3 changes to `orders` and then 128 MB of writes to the unpublished table, the slot holds 130 MB, `wal_status` is `extended`, and `pg_wal` is 144 MB in 9 files |
| `sync2`, state of sync 1 | 3 records: the insert, the update and the delete. `confirmed_flush_lsn` does not move, neither while the sync runs nor when it ends. After the sync and a checkpoint the slot still holds 130 MB. The sync took 274 seconds: the saved position cannot reach the end of the WAL, because the last 128 MB hold nothing that is published, so the connector twice logs `Heartbeat timeout: no progress for 2 minutes` and `heartbeat position has not progressed for an extended period, indicating database is idle` |
| `sync3`, state of sync 2 | No records, 138 seconds. When it starts, the connector moves the slot to the position saved by sync 2, `0/20955C8`, which is the last change to `orders`. That is 340 kB further on, so the slot still holds 130 MB |
| `tail`, `sync4` | One update to `orders` is written after the 128 MB. Sync 4 reads it in 13 seconds and saves `0/A24F870`. The slot does not move: 130 MB |
| `sync5`, state of sync 4 | When it starts, the connector moves the slot to `0/A24F870`. The slot then holds 6240 bytes, and after the checkpoint `pg_wal` is 64 MB in 4 files |

So the slot moves once per sync, when the sync starts, to the position the previous sync saved. The WAL written before sync 2 was released at the start of sync 5: sync 4 was the first to save a position behind it, and sync 5 was the first to commit that position.

### Series 1: a saved position that can no longer be used

| Step | Result |
| --- | --- |
| `lost` | With `max_slot_wal_keep_size = 64MB`, 160 MB of writes and a checkpoint, the server logs `invalidating obsolete replication slot "airbyte_slot"` and the slot shows `wal_status = lost`, `invalidation_reason = wal_removed` |
| A sync with the last good state | Exit code 1 after 2 seconds, no records. Failure type `config_error`. Message: `Replication slot 'airbyte_slot' is not valid: wal_status = 'lost', invalidation_reason = 'wal_removed'.` |
| The same sync without state | The same error. Clearing the state does not help while the slot is invalid |
| `recreated`: the slot dropped and created again, then a sync with the old state | Exit code 1 after 2 seconds. Failure type `config_error`. Message: `Replication slot 'airbyte_slot' has advanced beyond the source's state LSN. Confirmed flush LSN: LSN{0/14602BB8}, source LSN: LSN{0/A24F870}.` |
| The same sync without state | 6 records in 14 seconds: every row of `orders` is read again |
| `ahead`: `pg_replication_slot_advance` past the saved position, then a sync | The same `has advanced beyond the source's state LSN` error |

In none of these runs did the connector start over by itself.

### Series 2: a slot in a database that is not written to

| Step | Result |
| --- | --- |
| `quiet-busy` | `appdb` writes 128 MB and `quietdb` nothing. The slot of `quietdb` holds 130 MB, and `pg_wal` is 144 MB in 9 files |
| `quiet-sync 2`, `quiet-sync 3` | No records. Each sync runs 137 to 141 seconds and ends with `Heartbeat timeout: no progress for 2 minutes`. The state does not change, `confirmed_flush_lsn` stays at `0/2036A20`, and the slot holds 130 MB after both |
| `quiet-heartbeat`, `quiet-sync 4 hb` | With the table `airbyte_heartbeat` in the publication and `heartbeat_action_query` set to `INSERT INTO airbyte_heartbeat (text) VALUES ('heartbeat')`, the sync ends after 24 seconds and saves `0/A257310`, a position behind the 128 MB. The connector wrote 2 heartbeat rows. The slot has not moved yet |
| `quiet-sync 5 hb` | When it starts, the connector moves the slot to `0/A257310`. The slot then holds 203 kB, and after the checkpoint `pg_wal` is 64 MB in 4 files |
| `quiet-nopub`, `quiet-busy`, `quiet-sync 6 hb`, `quiet-sync 7 hb` | The heartbeat table is taken out of the publication and the query stays. After another 128 MB the slot holds 132 MB. The two syncs run 272 and 136 seconds, the connector writes 39 more heartbeat rows, and the slot still holds 132 MB |
| `quiet-republish`, `quiet-sync 8 hb`, `quiet-sync 9 hb` | With the table back in the publication, sync 8 ends after 23 seconds, and sync 9 moves the slot when it starts: 5456 bytes held, `pg_wal` 64 MB in 4 files |

## Files

- `docker-compose.yml`: the two PostgreSQL servers. No port is published.
- `init.sql`: the databases `appdb` and `quietdb`, the role `airbyte`, the procedure `write_wal` and one publication per database.
- `ab.py`: runs one Airbyte protocol command and summarises its output.
- `run.sh`: every step above.
- `logs/`: the output of every step, `01` to `16` for series 1 and `21` to `36` for series 2, and the complete connector output under `raw/`.
