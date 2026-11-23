# Run: logical replication on Google Cloud SQL for PostgreSQL

Backs the Cloud SQL part of the "Managed services" section of `docs/runbooks/postgres/enable-logical-replication.mdx`.

## What was run

- Run on 2026-11-23, 10:11 to 10:31 UTC, in `asia-south1`.
- Cloud SQL for PostgreSQL 17.11 (`POSTGRES_17_11`), Enterprise edition, `db-f1-micro`, 10 GB HDD, single zone, no backups, created with `gcloud` and its defaults. Creating it took 489 s.
- Client: `psql` and `pg_recvlogical` 18.7 from the `postgres:18.7` image, through the public IP with this machine as the only authorized network.

```bash
./run.sh create          # the smallest instance
./run.sh defaults        # settings and roles of a new instance
./run.sh wal-level       # a logical slot while cloudsql.logical_decoding is off
./run.sh enable          # the flag, the restart, the check
./run.sh role            # a role without REPLICATION, then ALTER USER ... WITH REPLICATION
./run.sh grant-postgres  # the built-in postgres user gives itself the attribute
./run.sh wal-level-repl  # the flag off again, with a role that has the attribute
./run.sh limits          # max_replication_slots and max_wal_senders
./run.sh plugins         # pgoutput, test_decoding, wal2json, decoderbufs
./run.sh publication     # the statements of the OLake Cloud SQL guide
./run.sh delete
```

`limits`, `plugins` and `publication` were first run as the built-in `postgres` user before it had the REPLICATION attribute. Those logs are kept in `logs/postgres-user-without-replication/`, because that is what a reader of the OLake guide gets.

## What the runs showed

| Step | What was asked | Result |
| --- | --- | --- |
| `defaults` | Settings of a new instance | `cloudsql.logical_decoding = off`, `wal_level = replica`, `max_replication_slots = 10`, `max_wal_senders = 10`, `max_connections = 25`, `wal_sender_timeout = 60000` ms, `wal_keep_size = 0`, `archive_timeout = 0`, `max_wal_size = 1024` MB |
| | Roles | `postgres` has `rolsuper = f` and `rolreplication = f`. It is a member of `cloudsqlsuperuser`, which has `rolreplication = f` too |
| | A connection with `sslmode=disable` | Accepted. The instance reports `sslMode: ALLOW_UNENCRYPTED_AND_ENCRYPTED` |
| `wal-level` | A logical slot as `postgres`, flag off | `ERROR:  must be superuser or replication role to use replication slots`. The permission error comes before any `wal_level` error |
| | `ALTER SYSTEM SET wal_level = logical` | `ERROR:  permission denied to set parameter "wal_level"` |
| | A replication connection as `postgres` | `FATAL:  insufficient privileges to start walsender` |
| `enable` | `gcloud sql instances patch --database-flags=cloudsql.logical_decoding=on` | The instance restarts by itself and is `RUNNABLE` again after 38 s. `SHOW cloudsql.logical_decoding` returns `on`, `SHOW wal_level` returns `logical` |
| | A logical slot as `postgres` after that | Still `must be superuser or replication role to use replication slots` |
| `role` | A slot and a replication connection as a new role | The same two errors |
| | `ALTER USER cdc_user WITH REPLICATION` as `postgres` | Works. The role can then create, read and drop a slot, and `IDENTIFY_SYSTEM` answers |
| `grant-postgres` | `ALTER USER postgres WITH REPLICATION`, run by `postgres` | Works. In a new session `postgres` can create a slot |
| `wal-level-repl` | Flag cleared (restart, 38 s), slot as a role with REPLICATION | `ERROR:  logical decoding requires "wal_level" >= "logical"`. `IDENTIFY_SYSTEM` answers; `CREATE_REPLICATION_SLOT ... LOGICAL` gives the same error |
| `limits` | 11 slots with `max_replication_slots = 10` | Ten are created. The eleventh: `ERROR:  all replication slots are in use`, `HINT:  Free one or increase "max_replication_slots".` |
| | 10 streaming connections, then one more | `FATAL:  number of requested standby connections exceeds "max_wal_senders" (currently 10)` |
| | Drop one slot, ask again | The new slot is created |
| | `max_replication_slots=100000` as a flag | `Failed to set max_replication_slots: 100000 is not between 10 and 8192.` |
| | `max_replication_slots=12` as a flag | `12 is greater than 10. For Instances in db-f1-micro with 1024MB RAM, max_replication_slots cannot exceed 10.` |
| `plugins` | `SHOW output_plugin_libraries` | `pgoutput, test_decoding, pglogical_output, wal2json, decoderbufs, pg_squeeze` |
| | Slots for `pgoutput`, `test_decoding`, `wal2json`, `decoderbufs` | All four created |
| | A slot for `pglogical_output` | `ERROR:  the pglogical extension is not enabled` |
| | Changing the list | `ALTER SYSTEM`: `permission denied to set parameter "output_plugin_libraries"`. As a flag: `The requested flag is either misspelled or unsupported by Cloud SQL.` |
| `publication` | `FOR ALL TABLES` and `FOR TABLES IN SCHEMA public` as `postgres` | Both created. `UPDATE` on a published table without a key fails with the replica identity error |

## Files

- `run.sh`: every step. `logs/`: output of every step, with the instance address masked. `logs/postgres-user-without-replication/`: the first pass of three steps as `postgres` without the attribute.
