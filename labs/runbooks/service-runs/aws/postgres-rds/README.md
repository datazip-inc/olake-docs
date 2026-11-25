# Run: logical replication on Amazon RDS for PostgreSQL

Backs the Amazon RDS part of the "Managed services" section of `docs/runbooks/postgres/enable-logical-replication.mdx`.

## What was run

- Run on 2026-11-23, 08:49 to 08:58 UTC, in `ap-south-1`.
- Amazon RDS for PostgreSQL 17.11 (`PostgreSQL 17.11 on aarch64-unknown-linux-gnu`), `db.t4g.micro`, 20 GB gp3, single-AZ, custom DB parameter group of family `postgres17`.
- Client: `psql` 18.7 from the `postgres:18.7` image, over TLS.
- A second instance, PostgreSQL 18.6, was created with `rds.logical_replication = 1` and no automated backups. It is described in `../postgres-rds-disk-full/`.

```bash
./run.sh defaults      # settings and roles of a new instance
./run.sh wal-level     # a logical slot while rds.logical_replication = 0, and the self-hosted fix
./run.sh enable        # rds.logical_replication = 1 in the parameter group, reboot, check
./run.sh role          # a role without rds_replication, ALTER ROLE ... REPLICATION, the grant
./run.sh publication   # the publication and slot statements of the OLake RDS guide
./run.sh plugins       # pgoutput, test_decoding, wal2json, decoderbufs, pglogical
./run.sh timeout       # wal_sender_timeout = 0 through the parameter group
```

The instance was first created without automated backups. `defaults` and `wal-level` were run in that state (`logs/backups-off/`), then backups were turned on (`logs/00-backups-on.txt`) and every step was run (`logs/`).

## What the runs showed

| Step | What was asked | Result |
| --- | --- | --- |
| `defaults`, backups off | Settings of a new instance with backup retention 0 | `wal_level = minimal`, `max_replication_slots = 0`, `max_wal_senders = 0`, `rds.logical_replication = off` |
| `wal-level`, backups off | A logical slot | `ERROR:  replication slots can only be used if "max_replication_slots" > 0`. A replication connection: `FATAL:  number of requested standby connections exceeds "max_wal_senders" (currently 0)` |
| Backups on | `modify-db-instance --backup-retention-period 1 --apply-immediately` | Events `Enabled automated backups`, `DB instance shutdown`, `DB instance restarted`. Available again after 280 s |
| `defaults`, backups on | Settings | `wal_level = replica`, `max_replication_slots = 20`, `max_wal_senders = 35`, `max_connections = 79`, `wal_sender_timeout = 30000` ms, `max_slot_wal_keep_size = -1`, `max_wal_size = 2048` MB |
| | Roles | The master user has `rolsuper = f` and `rolreplication = f`. It is a member of `rds_superuser`, and `rds_superuser` is a member of `rds_replication` |
| `wal-level` | A logical slot with `rds.logical_replication = 0` | `ERROR:  logical decoding requires "wal_level" >= "logical"` |
| | `ALTER SYSTEM SET wal_level = logical` | `ERROR:  ALTER SYSTEM command is not supported` |
| | `SET wal_level = logical` | `ERROR:  parameter "wal_level" cannot be changed without restarting the server` |
| | `CREATE PUBLICATION` | Created, with `WARNING:  "wal_level" is insufficient to publish logical changes` |
| | A replication connection (`replication=database`) as the master user | `FATAL:  no pg_hba.conf entry for host "<client-ip>", user "rbadmin", database "appdb", SSL encryption` |
| `enable` | `rds.logical_replication = 1` with `ApplyMethod=immediate` | `InvalidParameterCombination ... cannot use immediate apply method for static parameter` |
| | The same with `ApplyMethod=pending-reboot` | The group status on the instance was `applying` for 75 s, then `pending-reboot`. `pg_settings` showed `pending_restart = t` for `rds.logical_replication` and `wal_level` |
| | `reboot-db-instance` | Available again after 47 s. `rds.logical_replication = on`, `wal_level = logical`. `max_replication_slots`, `max_wal_senders` and `max_connections` were the same as before. A `pgoutput` slot was created |
| `role` | A slot as a role without `rds_replication` | `ERROR:  permission denied to use replication slots`, `DETAIL:  Only roles with the REPLICATION attribute or privileges of the "rds_replication" role may use replication slots.` |
| | A replication connection as that role | `FATAL:  permission denied to start WAL sender`, with the same kind of `DETAIL` |
| | `ALTER ROLE cdc_user REPLICATION` as the master user | `ERROR:  permission denied to alter role`, `DETAIL:  Only roles with the REPLICATION attribute may change the REPLICATION attribute.` |
| | `GRANT rds_replication TO cdc_user` | Works. `rolreplication` stays `f`. The role can then create, read and drop a slot, and `IDENTIFY_SYSTEM` answers |
| `publication` | `CREATE PUBLICATION ... FOR ALL TABLES` and `FOR TABLES IN SCHEMA public` as the master user | Both created |
| | Slot, insert, `pg_logical_slot_peek_binary_changes` | 4 messages: `B`, `R`, `I`, `C` |
| | `UPDATE` and `DELETE` on a published table without a key | `ERROR:  cannot update table "events_nopk" because it does not have a replica identity and publishes updates`, and the `cannot delete from table` twin. The `INSERT` on the same table worked and was in the slot |
| | `CREATE PUBLICATION` as `cdc_user` | `ERROR:  permission denied for database appdb` |
| `plugins` | `SHOW output_plugin_libraries` | `pgoutput, test_decoding, wal2json, decoder_raw, pglogical, pglogical_output, pgactive` |
| | Slots for `pgoutput`, `test_decoding`, `wal2json` | Created, with nothing to install or allow |
| | A slot for `decoderbufs` | `ERROR:  library "decoderbufs" may not be used as an output plugin` |
| | A slot for `pglogical_output` | `ERROR:  pglogical is not in shared_preload_libraries` |
| `timeout` | `ALTER SYSTEM SET wal_sender_timeout = 0` | `ERROR:  ALTER SYSTEM command is not supported` |
| | `wal_sender_timeout = 0` in the parameter group, `ApplyMethod=immediate` | `SHOW wal_sender_timeout` answered `0` about 10 s later, with no reboot |

On the second instance (18.6, backup retention 0, `rds.logical_replication = 1` from creation), `wal_level` was `logical` and `max_replication_slots` was 20. Automated backups are therefore not needed for logical replication. What they change is the starting point: without them and without `rds.logical_replication`, the instance runs with `wal_level = minimal` and no slots at all.

The parameter group of family `postgres17` has 437 parameters and none is called `wal_level`. It does have `max_slot_wal_keep_size`, as a dynamic parameter with no default value, and the family `postgres18` also has `idle_replication_slot_timeout` (`logs/08-slot-limits-in-parameter-group.txt`). Neither was changed on an instance in this run. The group defaults per family: `max_replication_slots` 20 on 13 to 18, `max_wal_senders` 20 on 13 to 15 and 35 on 16 to 18, `wal_sender_timeout` 30000 on all.

## Files

- `run.sh`: every step. Passwords come from a private file through `.pgpass` in the client container and are never printed.
- `logs/`: output of every step with backups on. `logs/backups-off/`: the first two steps before backups were turned on.
- In the logs, the account-specific part of host names is replaced by `<id>` and the client address by `<client-ip>`.
