# Service test: Airbyte's MySQL source and a purged binary log position

Backs the Airbyte part of `docs/runbooks/mysql/binlog-retention-error-1236.mdx`.

The Airbyte MySQL source connector reads with change data capture (CDC), saves a binary log position in its state, and is handed that state at the next sync. This test purges the binary log past the saved position between two syncs and records what the next sync does.

## What "Airbyte" means here

The open-source connector image `airbyte/source-mysql` is run directly with the Airbyte protocol commands `spec`, `check`, `discover` and `read`. This is not Airbyte Cloud and not the Airbyte platform: there is no scheduler, no destination and no retry logic. A sync here is one `read`. The state it prints is handed to the next `read` with `--state`, as the platform does.

## What you need

Docker with Compose, `python3`, and about 2 GB of free memory. No host port is published. The connector image is about 1 GB.

## Run it

```bash
./run.sh up          # MySQL 8.4.13 with the binary log on
./run.sh spec        # the CDC options the connector has
./run.sh strings     # which of the log lines in question exist in the connector's jar files
./run.sh check       # the connection check
./run.sh discover    # the streams, and the catalog for the syncs
./run.sh sync1       # first sync: 4 customers and 4 orders
./run.sh sync2       # one insert, then a second sync: the position in the state moves
./run.sh outage      # no sync runs: 3 customers added, 1 order changed, 1 deleted, the log purged
./run.sh fail        # a sync with the saved state and the default setting
./run.sh resync      # the same sync with "Re-sync data"
./run.sh after       # one more insert and a sync with the state the re-sync returned
./run.sh down
```

`./run.sh all` runs every step and captures each one under `logs/gtid-off/`. `GTID=ON ./run.sh all` does the same with `gtid_mode=ON` and writes to `logs/gtid-on/`.

## How the test is built

- `ab.py` runs one protocol command in a one-off container, keeps the complete output under `logs/<mode>/raw/` as a gzip file (those files are not kept in the repository), prints the warnings, the errors and the lines about the saved position, and saves the last STATE message for the next sync.
- The outage is the one the MySQL lab uses for Debezium: while no sync runs, 3 customers are added, the quantity of order 2 is changed and order 4 is deleted. The binary log is then rotated twice and `PURGE BINARY LOGS TO` removes every file before the newest one.
- The capture user has the grants the Airbyte set-up guide lists: `SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT`.

## What the runs showed

Run on 2026-11-23, starting at 09:05 UTC (`gtid_mode=OFF`) and 09:09 UTC (`gtid_mode=ON`), each on a fresh container.

| Component | Version |
| --- | --- |
| Connector | `airbyte/source-mysql:3.53.10`, digest `sha256:e1f9ddb68e76ca8cee18957df239ce3c6184c3d45f950d2f6dc84a4033a5ba9a` |
| Debezium inside the connector | 3.4.3.Final, from its log line `Running Debezium engine version 3.4.3.Final.` |
| MySQL | 8.4.13, `binlog_format=ROW`, `binlog_row_image=FULL` |

| Step | Result |
| --- | --- |
| `spec` | The CDC method has the option `invalid_cdc_cursor_position_behavior`, titled "Invalid CDC Position Behavior (Advanced)". Its default is `Fail sync`, and the other allowed value is `Re-sync data` |
| `sync1` | 8 records: 4 customers and 4 orders. The state holds `mysql-bin.000003`, position 158 |
| `sync2` | 1 record, the inserted order. The state moves to `mysql-bin.000003`, position 461 (position 501 and GTIDs `1-16` with `gtid_mode=ON`). The sync took 52 to 53 seconds |
| `outage` | After `PURGE BINARY LOGS TO 'mysql-bin.000005'` the server lists that one file. The source has 7 customers and 4 orders |
| `fail`, default setting | The sync ends with exit code 1 after 3 to 4 seconds, with no records and no state. Failure type `config_error`. Message: `Incumbent CDC state is invalid, reason: Saved offset no longer present on the server, please reset the connection, and then increase binlog retention and/or increase sync frequency. Connector last known binlog file mysql-bin.000003 is not found in the server. Server has [mysql-bin.000005].` |
| `fail`, with `gtid_mode=ON` | The same up to `increase sync frequency.`, then `Connector has not seen GTIDs <uuid>:17-21, but MySQL server has purged <uuid>:1-21.` |
| `fail`, run a second time | The same error. The sync keeps failing until the state is cleared |
| `resync`, `Re-sync data` | The sync also ends with exit code 1, after 4 to 5 seconds, with no records. Failure type `transient_error`. Message: `Triggering reset. Incumbent CDC state is invalid, reason: Saved offset no longer present on the server. Connector last known binlog file mysql-bin.000003 is not found in the server. Server has [mysql-bin.000005]..` It prints one state: the current position (`mysql-bin.000005`, 158) and empty stream states |
| `after`, with the state from `resync` | 13 records: all 7 customers, the 5 orders that exist read from the table, and the new order once more from the binary log. Order 2 arrives with quantity 9. There is no delete record for order 4 |

The line that Airbyte's troubleshooting page quotes, `Saved offset no longer present on the server, Airbyte is going to trigger a sync from scratch`, was not printed in any run. A search of every class file in the connector's 153 jar files (`./run.sh strings`, output in `logs/strings.txt`) found `Saved offset no longer present on the server` and `please reset the connection` in the connector's own jar, and `going to trigger a sync from scratch` nowhere. Airbyte's troubleshooting page still showed the old line on 2026-11-23.

## Files

- `docker-compose.yml`: one MySQL server. No port is published.
- `mysql/init.sql`: the `inventory` database, a second database `noise` that the connector does not capture, and the capture user.
- `ab.py`: runs one Airbyte protocol command and summarises its output.
- `run.sh`: every step above.
- `logs/gtid-off/`, `logs/gtid-on/`: the output of every step, and the complete connector output under `raw/`.
