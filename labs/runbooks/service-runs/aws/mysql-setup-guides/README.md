# Run: the statements of the RDS and Aurora MySQL setup guides

Backs the corrections to `docs/connectors/mysql/setup/rds.mdx`, `docs/connectors/mysql/setup/aurora.mdx` and `docs/connectors/mysql/index.mdx`. It is not tied to a runbook page.

## What was run

- Run on 2026-11-23, 09:05 to 10:00 UTC, in `ap-south-1`, on the instances of `../mysql-rds` (Amazon RDS for MySQL 8.4.13) and `../mysql-aurora` (Aurora MySQL 3.14.0) while they were up.
- One read replica of the RDS instance, `db.t4g.micro`, created with the defaults of the API and deleted the same day.
- The CDC user was created with the grants the guides give. The statements were run with the AWS CLI and the `mysql` client and are in the logs, each above its answer.

## What the runs showed

| Log | Result |
| --- | --- |
| `logs/mysql-rds-read-replica.txt` | A read replica created without a backup retention had `log_bin` OFF, and `SHOW BINARY LOGS` answered `ERROR 1381 (HY000): You are not using binary logging`. After automated backups were turned on for the replica, which restarted it, `log_bin` was ON. `log_replica_updates` was 1 both times |
| `logs/mysql-rds-cdc-user.txt` | With the grants of the RDS guide, the user reads `mysql.user` and runs `SHOW GRANTS`. `FLUSH LOGS` and `FLUSH BINARY LOGS` answer `ERROR 1227` and name the `RELOAD` privilege. `CALL mysql.rds_set_configuration` answers `ERROR 1370` |
| `logs/mysql-aurora-cdc-user.txt` | The same checks on Aurora MySQL. With `GRANT EXECUTE` on `mysql.rds_set_configuration` and `mysql.rds_show_configuration` the user calls both |
| `logs/mysql-error-numbers-and-roles.txt` | RDS for MySQL has `rds_superuser_role`, `rdsadmin` and `rdsrepladmin`, and no `rds_replication`. After `GRANT EXECUTE` on the two procedures, the CDC user changed the retention. Error 1290 is `ER_OPTION_PREVENTS_STATEMENT`, the read-only message, and 1449 is `ER_NO_SUCH_USER` |
| `logs/mysql-rds-gtid-mode.txt` | Both parameter groups refuse `gtid-mode = ON` without `enforce_gtid_consistency = ON`. The RDS group accepts both in one change, and after one reboot the server has both ON |
| `logs/mysql-parameter-defaults.txt` | Per parameter group family: `binlog_format` defaults to MIXED on `mysql5.7` and `mysql8.0`, is unset on `mysql8.4`, and is OFF on both Aurora MySQL families. The parameter is spelled `gtid-mode`. `binlog_expire_logs_seconds` is not modifiable. CloudWatch has `BinLogDiskUsage` for the RDS instance, and `SumBinaryLogSize` and `NumBinaryLogFiles` for Aurora |

The retention limits (168 hours on RDS, 2160 on Aurora), `SHOW MASTER STATUS` on MySQL 8.4 and what the default retention removes are in `../mysql-rds` and `../mysql-aurora`.

## Files

- `logs/`: the output of each check. Host names and addresses are replaced by placeholders, as in the other folders.
