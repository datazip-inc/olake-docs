# Run: logical replication on Amazon Aurora PostgreSQL

Backs the Aurora part of the "Managed services" section of `docs/runbooks/postgres/enable-logical-replication.mdx`.

## What was run

- Run on 2026-11-23, 08:59 to 09:02 UTC, with one more check at 10:02 UTC, in `ap-south-1`.
- Aurora PostgreSQL 17.11 (`PostgreSQL 17.11 on x86_64-linux`), one writer of class `db.t3.medium`, custom DB cluster parameter group of family `aurora-postgresql17`. `db.t4g.medium` was asked for first and refused with `InsufficientDBInstanceCapacity`.
- Client: `psql` 18.7 from the `postgres:18.7` image, over TLS, on the cluster endpoint.

`run.sh` has the same steps as `../postgres-rds/run.sh`. The parameter is changed in the cluster parameter group and the writer instance is rebooted.

## What the runs showed

| Step | What was asked | Result |
| --- | --- | --- |
| `defaults` | Settings of a new cluster | `wal_level = replica`, `rds.logical_replication = off`, `max_replication_slots = 20`, `max_wal_senders = 20`, `max_connections = 402`, `wal_sender_timeout = 60000` ms, `max_wal_size = 1024` MB |
| | Roles | As on RDS: the master user is a member of `rds_superuser` and has neither `rolsuper` nor `rolreplication` |
| `wal-level` | A logical slot with `rds.logical_replication = 0` | `ERROR:  logical decoding requires "wal_level" >= "logical"` |
| | `ALTER SYSTEM SET wal_level = logical` | `ERROR:  must be superuser to execute ALTER SYSTEM command` |
| | A replication connection as the master user | `FATAL:  no pg_hba.conf entry for host "<client-ip>", user "rbadmin", database "appdb", SSL encryption` |
| `enable` | `rds.logical_replication = 1` in the cluster parameter group, `ApplyMethod=pending-reboot` | The group status on the writer was `applying` for 74 s, then `pending-reboot`. `pending_restart = t` for `rds.logical_replication` and `wal_level` |
| | `reboot-db-instance` on the writer | Available again after 47 s. `SHOW rds.logical_replication` returns `on` and `SHOW wal_level` returns `logical`. A `pgoutput` slot was created |
| `role` | A slot as a role without `rds_replication` | `ERROR:  must be superuser, replication role, or rds_replication role to use logical replication slots` |
| | A replication connection as that role | `FATAL:  permission denied to start WAL sender`, `DETAIL:  Only roles with the REPLICATION attribute may start a WAL sender process.` |
| | `ALTER ROLE cdc_user REPLICATION` as the master user | `ERROR:  permission denied to alter role` |
| | `GRANT rds_replication TO cdc_user` | Works. The role can then create, read and drop a slot, and `IDENTIFY_SYSTEM` answers. It was never given `rds_superuser` |
| `publication` | `FOR ALL TABLES` and `FOR TABLES IN SCHEMA public` as the master user | Both created. Slot, insert and peek: `B`, `R`, `I`, `C` |
| | `UPDATE` and `DELETE` on a published table without a key | The same two errors as on a self-hosted server |
| `plugins` | `SHOW output_plugin_libraries` | `pgoutput, test_decoding, wal2json, decoder_raw, pglogical, pglogical_output, pgactive`. Slots for `pgoutput`, `test_decoding` and `wal2json` were created, `decoderbufs` was refused |
| Backups | `modify-db-cluster --backup-retention-period 0` | `InvalidParameterValue ... Invalid backup retention period: 0. Retention period must be between 1 and 35.` |

The cluster parameter group has 473 parameters and none is called `wal_level`.

## Files

- `run.sh`: every step. `logs/`: output of every step. The check of what a role with `rds_replication` only can do, and what `rds_superuser` adds, is in `logs/07-capture-role-rights.txt`.
