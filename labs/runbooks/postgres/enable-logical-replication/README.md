# Lab: enable PostgreSQL logical replication for CDC

Backs the runbook at `docs/runbooks/postgres/enable-logical-replication.mdx`.

A stock PostgreSQL server is taken from its defaults to a working `pgoutput` slot, one prerequisite at a time. Each step first asks for the thing that is still missing, so the error is on record, and then applies the fix.

## What you need

Docker with Compose and about 400 MB of free memory. No host port is published. The `plugin` step downloads two packages from apt.postgresql.org, so it needs internet access from the container.

## Run it

```bash
./run.sh up            # PostgreSQL 18.7 with its defaults (wal_level = replica)
./run.sh wal-level     # logical decoding without wal_level = logical; the fix needs a restart
./run.sh limits        # max_replication_slots and max_wal_senders
./run.sh role          # a role without REPLICATION, table privileges, pg_hba.conf
./run.sh publication   # create and check a publication; publication "x" does not exist
./run.sh identity      # UPDATE and DELETE on a published table without a key
./run.sh verify        # the whole chain as the capture role, then clean up
./run.sh plugin        # pgoutput is built in; wal2json and decoderbufs are installed and allowed
./run.sh down
```

Another version, with every step captured under `logs/postgres-<version>/`:

```bash
PG_VERSION=13.23 ./run.sh all
```

The `plugin` step is last on purpose. It installs packages into the running container, and on an image that is not on the newest minor release that also replaces the server binaries.

## What the runs showed

Run on 2026-11-16, each version on a fresh container.

| Image | `SELECT version()` | Started (UTC) |
| --- | --- | --- |
| `postgres:18.7` | PostgreSQL 18.7 (Debian 18.7-1.pgdg13+2) | 17:45 |
| `postgres:17.12` | PostgreSQL 17.12 (Debian 17.12-1.pgdg13+1) | 17:47 |
| `postgres:16.15` | PostgreSQL 16.15 (Debian 16.15-1.pgdg13+2) | 17:48 |
| `postgres:15.19` | PostgreSQL 15.19 (Debian 15.19-1.pgdg13+2) | 17:49 |
| `postgres:14.25` | PostgreSQL 14.25 (Debian 14.25-1.pgdg13+1) | 17:51 |
| `postgres:13.23` | PostgreSQL 13.23 (Debian 13.23-1.pgdg13+1) | 17:52 |
| `postgres:12.22` | PostgreSQL 12.22 (Debian 12.22-1.pgdg120+1) | 17:53 |
| `postgres:19rc2` | PostgreSQL 19rc2 (Debian 19~rc2-1.pgdg13+1) | 17:55 |

On every version the defaults were `wal_level = replica`, `max_replication_slots = 10` and `max_wal_senders = 10`.

| Step | What was asked | Result |
| --- | --- | --- |
| `wal-level` | A logical slot with `wal_level = replica` | 12.22 to 16.15: `ERROR:  logical decoding requires wal_level >= logical`. 17.12 and 18.7: `ERROR:  logical decoding requires "wal_level" >= "logical"`. 19rc2: the slot is created and `effective_wal_level` goes from `replica` to `logical` |
| | `ALTER SYSTEM SET wal_level = logical` and a reload | All: `SHOW wal_level` still `replica`, `pending_restart = t`. `SET wal_level` in a session: `ERROR:  parameter "wal_level" cannot be changed without restarting the server`. After a restart: `logical` |
| | `CREATE PUBLICATION` with `wal_level = replica` | Created on all. 13.23 to 16.15 add `WARNING:  wal_level is insufficient to publish logical changes`, 17.12 and 18.7 the same with `"wal_level"` in quotes, 12.22 and 19rc2 no message |
| | 19rc2 only: the slot with `wal_level = minimal` | `ERROR:  replication slots can only be used if "wal_level" >= "replica"` |
| `limits` | A third slot with `max_replication_slots = 2` | All: `ERROR:  all replication slots are in use`. Hint: `Free one or increase max_replication_slots.`, with the name in double quotes from 17.12 |
| | A third replication connection with `max_wal_senders = 2` | 12.22 to 16.15: `FATAL:  number of requested standby connections exceeds max_wal_senders (currently 2)`. 17.12 to 19rc2: the same with `"max_wal_senders"` in quotes |
| | Drop one slot, ask again | All: the refused slot is created |
| `role` | A slot as a role without `REPLICATION` | 12.22 to 15.19: `ERROR:  must be superuser or replication role to use replication slots`. 16.15 to 19rc2: `ERROR:  permission denied to use replication slots` |
| | A replication connection as that role | 12.22 to 15.19: `FATAL:  must be superuser or replication role to start walsender`. 16.15 to 19rc2: `FATAL:  permission denied to start WAL sender` |
| | The same after `ALTER ROLE cdc_user REPLICATION` | All: the slot is created and `IDENTIFY_SYSTEM` answers |
| | `SELECT` on a table as that role | All: `ERROR:  permission denied for table orders` until `USAGE` on the schema and `SELECT` on the tables are granted |
| | A logical and a physical replication connection from 172.28.0.2 | All: the logical one is accepted by the row `host all all all`. The physical one: `FATAL:  no pg_hba.conf entry for replication connection from host "172.28.0.2", user "cdc_user", no encryption` (`SSL off` on 12.22 and 13.23) |
| `publication` | `CREATE PUBLICATION` as the capture role | All: `ERROR:  permission denied for database appdb`. With `CREATE` on the database: `ERROR:  must be superuser to create FOR ALL TABLES publication` (19rc2: `must be superuser to create a FOR ALL TABLES or ALL SEQUENCES publication`) and `ERROR:  must be owner of table orders` |
| | `FOR TABLES IN SCHEMA` | 12.22, 13.23, 14.25: `ERROR:  syntax error at or near "TABLES"`. Works from 15.19 |
| | `publish_via_partition_root` | 12.22: `ERROR:  unrecognized publication parameter: "publish_via_partition_root"`. Works from 13.23 |
| | A consumer names a publication that does not exist | 12.22 to 17.12: `ERROR:  publication "cdc_publication" does not exist`, at the first change and not at connect. 18.7 and 19rc2: no error, the change is skipped, `WARNING:  skipped loading publication "cdc_publication"` |
| | A slot created before its publication | 12.22 to 17.12: `ERROR:  publication "late_pub" does not exist` on every read. 18.7 and 19rc2: the change made before the publication is skipped with the warning, the later one is delivered |
| | Drop that slot, create it after the publication | All: the next insert arrives as 4 messages (`B`, `R`, `I`, `C`) |
| `identity` | `UPDATE` and `DELETE` on a published table without a primary key | All: `ERROR:  cannot update table "events_nopk" because it does not have a replica identity and publishes updates`, and the `cannot delete from table` twin |
| | `REPLICA IDENTITY FULL`, then a primary key, then a unique index with `REPLICA IDENTITY USING INDEX` | All: each one makes the `UPDATE` work |
| | What `test_decoding` shows for `orders` | All: with the default identity a delete carries `id` only. With `REPLICA IDENTITY FULL` the update has an `old-key:` part with every column and the delete carries every column |
| | An update that does not touch a 32,000-character column | All: `body[text]:unchanged-toast-datum`. With `REPLICA IDENTITY FULL` the old row carries the value |
| `verify` | Slot, insert, update, delete, read back as the capture role | All: 10 `pgoutput` messages, `B R I C B U C B D C` |
| `plugin` | Slots for `pgoutput` and `test_decoding` on the stock server | All: created |
| | Slots for `wal2json` and `decoderbufs` | 12.22, 13.23: `ERROR:  could not access file "wal2json": No such file or directory`. 14.25 to 19rc2: `ERROR:  library "wal2json" may not be used as an output plugin` |
| | `ALTER SYSTEM SET output_plugin_libraries = 'pgoutput, test_decoding, wal2json, decoderbufs'` (one quoted string) | 14.25 to 19rc2: the setting reads `"pgoutput, test_decoding, wal2json, decoderbufs"` and `pgoutput` is refused too |
| | The same list without the quotes, and a reload | 14.25 to 19rc2: `pgoutput` works again, `wal2json` and `decoderbufs` now answer `could not access file` |
| | `apt-get install postgresql-NN-wal2json postgresql-NN-decoderbufs` | 12.22, 13.23: wal2json 2.6-3 and decoderbufs 3.6.0-1, slots created, no restart. 14.25, 17.12, 18.7: wal2json 2.7-1 and decoderbufs 3.7.0-1, slots created, no restart. 19rc2: wal2json 2.7-1 works, `E: Unable to locate package postgresql-19-decoderbufs` |
| | The same on 15.19 and 16.15 | apt also set up `postgresql-15 (15.20-1.pgdg13+1)` and `postgresql-16 (16.16-1.pgdg13+1)`. The running server then answered `could not load library ... undefined symbol: heap_datum_check` for `wal2json`, `decoderbufs` and `test_decoding`. After a restart the server reported 15.20 and 16.16 and both slots were created |

The package versions in the `plugin` step are whatever apt.postgresql.org served on the day of the run. A later run will get later packages, and an image that has fallen behind its newest minor release will see its server package replaced, as 15.19 and 16.15 did here.

## Files

- `docker-compose.yml`: one PostgreSQL container with default settings. No port is published.
- `init.sql`: the `appdb` database with three tables: `orders` with a primary key, `events_nopk` without one, and `documents` with a large text column.
- `run.sh`: every step above.
- `logs/`: the output of every step, one folder per PostgreSQL version.
