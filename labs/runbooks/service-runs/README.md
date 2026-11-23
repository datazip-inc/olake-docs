# Runs on managed services and with other tools

The labs next to this folder run on one machine with Docker Compose. Four of the runbooks also say what a managed database service or another change data capture (CDC) tool does in the same situation. Those statements are backed by the runs in this folder, made on 23 November 2026.

```text
labs/runbooks/service-runs/
  aws/      Amazon RDS, Amazon Aurora and AWS Database Migration Service (DMS), in ap-south-1
  gcp/      Google Cloud SQL
  azure/    Azure Database for PostgreSQL flexible server and Azure SQL Database
  tools/    Debezium, the Airbyte source connectors and Flink CDC, on Docker Compose like the other labs
```

Every run folder has a `README.md` with the date, the exact versions and sizes and a "What the runs showed" table, the scripts that were run, and `logs/` with their output. In the logs the account-specific parts of host names, the addresses and the account numbers are replaced by placeholders such as `<id>` and `<client-ip>`.

## What the runs were made on

| Where | Versions | Folder |
| --- | --- | --- |
| Amazon RDS for PostgreSQL | 17.11 and 18.6, `db.t4g.micro` | `aws/postgres-rds`, `aws/postgres-rds-disk-full` |
| Amazon Aurora PostgreSQL | 17.11, `db.t3.medium` | `aws/postgres-aurora` |
| AWS DMS | engine 3.6.1, `dms.t3.small` | `aws/dms-postgres`, `aws/dms-mysql`, `aws/dms-sqlserver` |
| Amazon RDS for MySQL | 8.4.13, `db.t4g.micro` | `aws/mysql-rds` |
| Amazon Aurora MySQL | 3.14.0, `db.t3.medium` | `aws/mysql-aurora` |
| Amazon RDS for SQL Server | Standard 2022 (16.00.4305.5), `db.t3.xlarge` | `aws/sqlserver-rds` |
| Google Cloud SQL for PostgreSQL | 17.11, `db-f1-micro` | `gcp/cloudsql-postgres` |
| Azure Database for PostgreSQL flexible server | 17.11, Burstable `B1ms` | `azure/postgres-flexible-server` |
| Azure SQL Database | 12.0.2000.8, S0 then S3 | `azure/sql-database` |
| Debezium | 3.7.1.Final, with checks on 3.0.8.Final | `tools/debezium-postgres`, `tools/debezium-sqlserver` |
| Airbyte source connectors, run directly | `source-postgres` 3.8.12, `source-mysql` 3.53.10, `source-mssql` 5.1.5 | `tools/airbyte-*` |
| Flink CDC | 3.7.0 on Flink 2.2.1 | `tools/flink-cdc-*` |

"Airbyte" here means its open-source source connectors, run directly with the Airbyte protocol commands. The platform around them was not run.

## PostgreSQL: a replication slot fills the disk

Page: `docs/runbooks/postgres/replication-slot-filling-disk.mdx`.

| Scenario | On | What the run showed | Folder |
| --- | --- | --- | --- |
| No consumer connected | Debezium | Stopped, deleted and worker down: `active = f`, 141 MB held. A paused connector is different: `active = t` and still 141 MB held | `tools/debezium-postgres` |
|  | AWS DMS on RDS | A stopped task left its slot inactive with 2,253 MB. CloudWatch showed `TransactionLogsDiskUsage` 2,432 MB and `OldestReplicationSlotLag` 2,253 MB | `aws/dms-postgres` |
|  | Airbyte | Between syncs the slot is inactive and held 130 MB. A slot invalidated by `max_slot_wal_keep_size` makes the sync fail with a configuration error; it does not start over | `tools/airbyte-postgres` |
| Connected, not confirming (`wal_sender_timeout = 0`) | Debezium | With 60 s the server ended the connection after 60 s. With 0 the slot stayed `active = t` for all 160 s of the run, with no log line | `tools/debezium-postgres` |
| Open transaction | AWS DMS | `confirmed_flush_lsn` moved, `restart_lsn` did not, 1,091 MB held until the transaction ended | `aws/dms-postgres` |
| Idle database | Debezium | 129 MB held. `heartbeat.interval.ms` alone did nothing. With `heartbeat.action.query` and the table in the publication: 928 bytes after 60 s | `tools/debezium-postgres` |
|  | AWS DMS | The slot never moved. With `HeartbeatEnable=true` it was free 42 s later | `aws/dms-postgres` |
|  | Airbyte | `confirmed_flush_lsn` stayed put through two syncs. With the heartbeat table and query the next sync moved it | `tools/airbyte-postgres` |
| Disk already full | Amazon RDS | Same `PANIC`. Volume grown from 20 to 25 GB, first connection 289 s later, slot dropped, space back | `aws/postgres-rds-disk-full` |
| Slots left behind | Debezium | Slot and publication stay after stop, delete and shutdown | `tools/debezium-postgres` |
|  | AWS DMS | The slot stays when a task is stopped. It is dropped when the task is deleted | `aws/dms-postgres` |

## PostgreSQL: enable logical replication

Page: `docs/runbooks/postgres/enable-logical-replication.mdx`.

| Scenario | On | What the run showed | Folder |
| --- | --- | --- | --- |
| `wal_level` not logical | Amazon RDS | `rds.logical_replication = 1`, reboot of 47 s, then `wal_level = logical` | `aws/postgres-rds` |
|  | Amazon Aurora | The same in the cluster parameter group, reboot of the writer, 47 s | `aws/postgres-aurora` |
|  | Google Cloud SQL | Flag `cloudsql.logical_decoding=on`, restart of 38 s | `gcp/cloudsql-postgres` |
|  | Azure flexible server | Server parameter `wal_level = logical`, restart of 63 to 124 s | `azure/postgres-flexible-server` |
| No free slot or WAL sender | Google Cloud SQL | Both limits are 10. The eleventh slot and the eleventh connection give the page's errors. On `db-f1-micro` the limit cannot be raised: `max_replication_slots cannot exceed 10` | `gcp/cloudsql-postgres` |
| Role missing REPLICATION | Amazon RDS | `GRANT rds_replication` is the fix. `ALTER ROLE ... REPLICATION` is refused | `aws/postgres-rds` |
|  | Amazon Aurora | The capture role needed `rds_replication` only. `rds_superuser` was needed for the parameter and the publication | `aws/postgres-aurora` |
| Output plugin not installed or not allowed | Google Cloud SQL | `wal2json` works with nothing to install or allow. Google ships the list and it cannot be edited | `gcp/cloudsql-postgres` |

## MySQL: binary log retention and error 1236

Page: `docs/runbooks/mysql/binlog-retention-error-1236.mdx`.

| Scenario | On | What the run showed | Folder |
| --- | --- | --- | --- |
| Reader fails with error 1236 after a purge | Amazon RDS for MySQL | Default retention NULL. A stopped reader's file was gone about 9 minutes later. `Last_IO_Errno: 13114` with the page's text. Maximum 168 hours | `aws/mysql-rds` |
|  | Amazon Aurora MySQL | Binary logging is off until `binlog_format=ROW` and a reboot. With NULL nothing was removed in 68 minutes. 2160 hours accepted, 2161 stored as 2160 without an error | `aws/mysql-aurora` |
|  | AWS DMS | The task log has the page's line, after 11 reconnect attempts | `aws/dms-mysql` |
| The reader's position is purged | Flink CDC | Debezium 1.9 wording. The job loops in `RESTARTING` and never reaches `FAILED` | `tools/flink-cdc-mysql` |
|  | Airbyte | The default is `Fail sync`. The source fails and stays failed | `tools/airbyte-mysql` |
|  | AWS DMS | Status `running` for about 2.5 minutes, then `failed` with `Error 1236 reading binary log` | `aws/dms-mysql` |
| Recovery | AWS DMS | `resume-processing` fails again. `reload-target` reloads, and source and target checksums are equal | `aws/dms-mysql` |
|  | Flink CDC | `when_needed` has no effect there. A new job without the old state works. `latest-offset` skips the gap without a message | `tools/flink-cdc-mysql` |

## SQL Server: enable CDC and empty change tables

Page: `docs/runbooks/sql-server/enable-cdc-change-tables-empty.mdx`.

| Scenario | On | What the run showed | Folder |
| --- | --- | --- | --- |
| Change table empty, Agent not running | Amazon RDS for SQL Server | `sys.sp_cdc_enable_db` gives Msg 22902, `msdb.dbo.rds_cdc_enable_db` works. The Agent runs and the master user cannot stop it | `aws/sqlserver-rds` |
|  | Azure SQL Database | No Agent to look at (`sys.dm_server_services` does not exist). A change was in the change table 5 s after commit | `azure/sql-database` |
| Saved position below the minimum after clean-up | Azure SQL Database | With a retention of one minute the automatic clean-up ran one hour after CDC was enabled and left 2 of 21 rows. The reader then got Msg 313 with the page's text. The same after `sys.sp_cdc_cleanup_change_table` by hand | `azure/sql-database` |
| Schema change, new column | Azure SQL Database | Same as the lab: no column in the old change table, a second capture instance has it, a third gives Msg 22962 | `azure/sql-database` |
|  | AWS DMS | The target got the column and its values with no second capture instance. DMS reads the transaction log, not the change tables | `aws/dms-sqlserver` |
|  | Airbyte | Its documented fix (disable and enable CDC) makes the saved position invalid, and the next sync fails by default | `tools/airbyte-sqlserver` |
|  | Debezium | Events lack the column until the second capture instance exists. It appears 4 s after, with no restart | `tools/debezium-sqlserver` |
|  | Flink CDC | NULL until the second capture instance exists. The connector switches to it by itself | `tools/flink-cdc-sqlserver` |

## Running them again

The `tools/` folders need only Docker, like the other labs. Each `run.sh` lists its steps.

The cloud folders need an account and cost a little money. On the day of the runs the whole set came to about 2 US dollars at list prices, because every resource was the smallest size that shows the behaviour and was deleted as soon as its run was done.

- **AWS.** Set `RB_VPC`, `RB_SUBNETS` and `RB_SECRETS` as `aws/env.sh` describes, then use `aws/provision.sh` step by step. The databases get a public endpoint that only the address of the machine running the script may reach. `./provision.sh teardown` deletes everything and lists what is left under the test names.
- **Google Cloud.** Set `RB_GCP_PROJECT` and `RB_SECRETS`. `gcp/cloudsql-postgres/run.sh create` makes the instance and `delete` removes it.
- **Azure.** Set `AZ_SUB`, `AZ_PG`, `AZ_SQL` and `RB_SECRETS` as `azure/env.sh` describes, then use `azure/provision.sh`. Everything is in one resource group, and `teardown` deletes that group.

`RB_SECRETS` names a private file outside the repository with two lines, `DBPASS=...` and `CDCPASS=...`. The scripts pass these to the clients through files and never print them or put them on a command line.

Two things to know before starting:

- The full-disk run and the SQL Server instance are the slow and the costly parts. Start them when you are ready for them.
- The DMS steps create two IAM roles with fixed names, `dms-vpc-role` and `dms-cloudwatch-logs-role`. In an account that already uses DMS they exist, and `teardown` must not delete them.

## Limits of these runs

- One version per managed service, and the smallest size. Nothing here says how another major version behaves.
- "Airbyte" means the open-source source connectors run directly with the Airbyte protocol. The platform around them, with its retries and resets, was not run.
- Not run: Multi-AZ and read replicas, Azure's automatic drop of an unused slot, high-availability failover, `max_slot_wal_keep_size` with DMS, Windows domain accounts.
- Each case ran once.
