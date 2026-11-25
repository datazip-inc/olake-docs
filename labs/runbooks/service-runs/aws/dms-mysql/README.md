# Run: AWS DMS when its MySQL binary log position is purged

Backs the AWS Database Migration Service (DMS) part of `docs/runbooks/mysql/binlog-retention-error-1236.mdx`.

Author: Shubham. Run on 2026-11-23, in AWS region ap-south-1.

## What was run

| Part | Version and size |
| --- | --- |
| DMS replication instance | `dms.t3.small`, engine 3.6.1, 20 GB |
| Source | Amazon RDS for MySQL 8.4.13, `db.t4g.micro`, 20 GB gp3, automated backups 1 day, parameter group with default values, `binlog retention hours` NULL (the default) |
| Target | Aurora MySQL 3.14.0 (MySQL 8.0.46), `db.t3.medium`, schema `dms_from_rds` |
| Task | `full-load-and-cdc`, table `inventory.customers`, task logging on, every other setting default |

Endpoint host names in the logs read `rbtest-mysql.<id>.ap-south-1.rds.amazonaws.com`.

## Steps

```bash
./setup.sh                       # the two endpoints (the password comes from a private file)
# the task is created and started with the AWS CLI, see logs/02-task-start.txt
./task.sh start resume-processing
./task.sh watch 16 15            # status, stop reason, table state, target rows, every 15 s
./task.sh logs <epoch ms>        # error and warning lines of the task log since that time
./task.sh start reload-target
./task.sh compare                # row count and checksum on both sides
../mysql-poll.sh rds <file> 40   # one line a minute until the file leaves SHOW BINARY LOGS
```

## What the run showed

Times are UTC.

| Step | Result |
| --- | --- |
| Start | Full load of 11 rows, then `running`. A row inserted on the source at 09:00:40 was in the target 5 seconds later |
| Stop | `stop-replication-task` at 09:01:41, `stopped` at 09:02:04, stop reason `Stop Reason NORMAL`. The saved checkpoint names `mysql-bin-changelog.000009`, position 1105 |
| The source after the stop | The task's `Binlog Dump` session was still in the process list 11 seconds after the stop and gone by 09:06:37. While the task was stopped: 3 inserts, 1 update, 1 delete, and two `FLUSH BINARY LOGS` |
| The source removes the file | `SHOW BINARY LOGS` lost files at 09:00:42, 09:05:47 and 09:10:51, five minutes apart. `mysql-bin-changelog.000009` went in the third round, 8 minutes 47 seconds after the task had stopped |
| `resume-processing` at 09:11:03 | Status `starting`, then `running` from 09:11:38. The task log has 11 lines `Error 1236 (Could not find first log file name in binary log index file) reading the binlog, try to reconnect`, 5 seconds apart, and at 09:12:07 the two error lines below. The status stayed `running` until 09:13:50 and was `failed` at 09:14:07. No row reached the target in between: 15 rows before and after |
| A second `resume-processing` at 09:15:55 | The same: 11 reconnect lines, the same two error lines at 09:16:58, `failed` at 09:19:31 |
| `reload-target` at 09:20:21 | The target table was dropped and loaded again: 25 rows at 09:20:36, `running` at 09:21:03. Source and target then had the same 25 rows and the same checksum. The update and the delete made during the outage were in the target. A row inserted afterwards arrived within 10 seconds |

The error lines of the task log, as CloudWatch Logs returned them:

```text
[SOURCE_CAPTURE  ]I:  Error 1236 (Could not find first log file name in binary log index file) reading the binlog, try to reconnect  (mysql_endpoint_capture.c:1497)
[SOURCE_CAPTURE  ]E:  Error 1236 reading binlog, exit after 11 retries [1020493]  (mysql_endpoint_capture.c:1509)
[SOURCE_CAPTURE  ]E:  Error 1236 (Could not find first log file name in binary log index file) reading binlog [1020493]  (mysql_endpoint_capture.c:1511)
[TASK_MANAGER    ]E:  Task '<task id>' encountered a fatal error  (repository.c:5751)
```

What `describe-replication-tasks` returned once the task had failed:

```text
Status:             failed
StopReason:         Last Error Error 1236 reading binary log. Stop Reason FATAL_ERROR Error Level FATAL
LastFailureMessage: Last Error Error 1236 reading binary log. Stop Reason FATAL_ERROR Error Level FATAL
```

## Files

- `setup.sh`, `task.sh`: the commands of the run. `../dms-logs.sh` prints a task log stream, `../mysql-poll.sh` watches `SHOW BINARY LOGS`.
- `table-mappings.json`, `task-settings.json`: the task definition.
- `logs/01` to `logs/12`: the output of every step. `03`, `07`, `09` and `11` are the task log of the first run, the two resumes and the reload.
