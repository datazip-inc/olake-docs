# Run: logical replication on Azure Database for PostgreSQL flexible server

Backs the Azure part of the "Managed services" section of `docs/runbooks/postgres/enable-logical-replication.mdx`.

## What was run

- Run on 2026-11-23, 10:26 to 10:37 UTC.
- Azure Database for PostgreSQL flexible server 17.11, Burstable `Standard_B1ms`, 32 GB, public access with one firewall rule, in South India. The same size was refused twice in Central India with `SkuNotAvailable: Specified SKU is not supported in this region`, although `list-skus` offers it there. Creating the server took 327 s.
- Client: `psql` 18.7 from the `postgres:18.7` image, over TLS.

```bash
./run.sh defaults        # settings and roles of a new server
./run.sh wal-level       # a logical slot while wal_level = replica
./run.sh enable          # server parameter wal_level = logical, restart, check
./run.sh role            # a role without REPLICATION, ALTER ROLE ... REPLICATION, azure_pg_admin
./run.sh publication     # the statements of the OLake Azure guide
./run.sh plugins         # pgoutput, test_decoding, wal2json, decoderbufs, pglogical
./run.sh timeout         # wal_sender_timeout = 0 as a server parameter
./run.sh wal-level-repl  # wal_level = replica again, with a role that has REPLICATION
```

## What the runs showed

| Step | What was asked | Result |
| --- | --- | --- |
| `defaults` | Settings of a new server | `wal_level = replica`, `max_replication_slots = 10`, `max_wal_senders = 10`, `max_connections = 50`, `wal_sender_timeout = 60000` ms, `wal_keep_size = 400` MB, `archive_timeout = 300` s, `max_wal_size = 2048` MB, WAL segments of 16 MB |
| | Server parameters as Azure reports them | `wal_level`: allowed `replica,logical`, static. `max_replication_slots`: 2 to 262143. `max_wal_senders`: 5 to 100. `wal_sender_timeout`: dynamic. `max_slot_wal_keep_size`: read-only |
| | Roles | The admin user has `rolsuper = f` and `rolreplication = f`. It is a member of `azure_pg_admin` |
| `wal-level` | A logical slot as the admin user | `ERROR:  permission denied to use replication slots`, `DETAIL:  Only roles with the REPLICATION attribute may use replication slots.` The permission error comes before any `wal_level` error |
| | `ALTER SYSTEM SET wal_level = logical` | `ERROR:  permission denied to set parameter "wal_level"` |
| | A replication connection as the admin user | `FATAL:  permission denied to start WAL sender` |
| `enable` | `az postgres flexible-server parameter set --name wal_level --value logical` | Accepted in 14 s, `isConfigPendingRestart` is true, `pg_settings` shows `pending_restart = t` |
| | `az postgres flexible-server restart` | The server answers again after 124 s (63 s and 64 s on two later restarts). `SHOW wal_level` returns `logical` |
| `role` | `ALTER ROLE rbadmin WITH REPLICATION`, run by the admin user on itself | Works |
| | `ALTER ROLE cdc_user WITH REPLICATION` | Works. With that attribute, `USAGE` and `SELECT`, and no membership in `azure_pg_admin`, the role creates, reads and drops a slot, and `IDENTIFY_SYSTEM` answers |
| `wal-level-repl` | `wal_level` back to `replica`, slot as a role with REPLICATION | `ERROR:  logical decoding requires "wal_level" >= "logical"` |
| `publication` | `FOR ALL TABLES` and `FOR TABLES IN SCHEMA public` as the admin user | Both created. Slot and peek: `B`, `R`, `I`, `C`. `UPDATE` on a published table without a key fails with the replica identity error |
| `plugins` | `SHOW output_plugin_libraries` | `pgoutput, test_decoding, pglogical, pglogical_output, wal2json, pg_squeeze` |
| | Slots for `pgoutput`, `test_decoding`, `wal2json` | Created. `decoderbufs`: `ERROR:  library "decoderbufs" may not be used as an output plugin` |
| | The list as a server parameter | `ConfigurationNotExists`: Azure has no server parameter of that name |
| `timeout` | `wal_sender_timeout = 0` as a server parameter | Accepted, no restart, `SHOW wal_sender_timeout` returns `0` |
| | `max_slot_wal_keep_size = 1024` as a server parameter | `ReadOnlyParameter: Value of server parameter 'max_slot_wal_keep_size' cannot be set because it's declared as read-only.` |

## Files

- `run.sh`: every step. `logs/`: output of every step, with the server name and addresses masked.
