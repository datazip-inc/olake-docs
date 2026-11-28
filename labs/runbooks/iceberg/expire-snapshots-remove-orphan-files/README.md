# Lab: Iceberg snapshot expiry and orphan-file removal, and what each leaves in storage

Backs the runbook at `docs/runbooks/iceberg/expire-snapshots-remove-orphan-files.mdx`.

The lab writes small Iceberg tables, changes them, and runs `CALL demo.system.expire_snapshots(...)` and `CALL demo.system.remove_orphan_files(...)` against each reason they delete less than expected. Storage is measured before and after every call: `maintenance.py` lists the table location through the table's own FileIO and counts objects and bytes by kind, and `run.sh` counts the same objects with `mc` after each part.

It is the same stack as the [compaction lab](../compaction-rewrite-data-files-rewrites-nothing/): MinIO, the Iceberg REST catalog test fixture, and a Spark container that runs one `spark-submit` per part.

## What you need

Docker with Compose and about 3 GB of free memory. No host port is published. The sessions that use the Hadoop S3A file system download `hadoop-aws` and the AWS SDK bundle it depends on, a few hundred MB per Spark line, into an Ivy cache volume that `./run.sh down` removes.

## Run it

```bash
./run.sh up        # MinIO, the Iceberg REST catalog fixture, an idle Spark container
./run.sh expire    # expire_snapshots: appends only, table properties, retain_last, a tag, DELETE then expiry
./run.sh gc        # gc.enabled = false
./run.sh metadata  # .metadata.json files: expiry, delete-after-commit, previous-versions-max, untracked files
./run.sh orphans   # remove_orphan_files: default listing, prefix_listing, the 24-hour guard, the action, Hadoop S3A
./run.sh down
```

`./run.sh all` runs every step from `expire` to `orphans`. `LINE` picks the versions:

```bash
LINE=4.0 ./run.sh up && LINE=4.0 ./run.sh all && LINE=4.0 ./run.sh down
LINE=3.3 ./run.sh up && LINE=3.3 ./run.sh all && LINE=3.3 ./run.sh down
```

| `LINE` | Spark image | Iceberg | `hadoop-aws` |
| --- | --- | --- | --- |
| `3.5` (default) | `apache/spark:3.5.6-scala2.12-java17-python3-ubuntu` | 1.12.0 | 3.3.4 |
| `4.0` | `apache/spark:4.0.5-scala2.13-java17-python3-ubuntu` | 1.12.0 | 3.4.1 |
| `3.3` | `apache/spark:3.3.3-scala2.12-java11-python3-ubuntu` | 1.4.3 | 3.3.2 |

The other images are pinned in `docker-compose.yml`: `olakego/minio:RELEASE.2025-04-03T14-56-28Z`, `olakego/mc:RELEASE.2025-04-03T17-07-56Z` and `apache/iceberg-rest-fixture:1.10.1`.

## How the orphans are made

An orphan file here is an object under a table's `data/` directory that no snapshot references, as a failed write leaves behind. `maintenance.py` writes each one through the table's FileIO just before the call that should find it, named `orphan-<letter>.parquet`.

Those objects are minutes old, and the procedure refuses any `older_than` less than 24 hours ago. Where the lab needs an orphan to be found, it calls the Java action behind the procedure through Py4J, `SparkActions.get(spark).deleteOrphanFiles(table).olderThan(now)`, which takes any interval and deletes what it finds. The error message of the procedure points to that action itself. Do not run it with such a short interval on a table that other jobs write to.

`minio://` is the same bucket registered a second time under another scheme name, with `fs.minio.impl` set to the S3A file system. It is used once, to make the scheme mismatch that `equal_schemes` and `prefix_mismatch_mode` exist for.

## What the runs showed

Run on 2026-11-27, each line on a fresh stack.

| Run | Spark | Iceberg | Folder |
| --- | --- | --- | --- |
| `LINE=3.5` | 3.5.6 | Apache Iceberg 1.12.0 (commit 212aa894e919ff9fdf89160da4aadcbe6858ac01) | `logs/spark-3.5.6-iceberg-1.12.0` |
| `LINE=4.0` | 4.0.5 | Apache Iceberg 1.12.0 (commit 212aa894e919ff9fdf89160da4aadcbe6858ac01) | `logs/spark-4.0.5-iceberg-1.12.0` |
| `LINE=3.3` | 3.3.3 | Apache Iceberg 1.4.3 (commit 9a5d24fee239352021a9a73f6a4cad8ecf464f01) | `logs/spark-3.3.3-iceberg-1.4.3` |

Spark 3.5.6 and 4.0.5 gave the same procedure results, messages and object counts. Byte counts differ by a few bytes between the lines, and on Spark 3.3.3 and 4.0.5 some `DELETE` statements wrote more files than on 3.5.6; the numbers below are from Spark 3.5.6. The `orphans` step was run a second time on each line after `orphans-args` was added, and its logs are from that run.

| Step | What was done | Iceberg 1.12.0 | Iceberg 1.4.3 |
| --- | --- | --- | --- |
| `expire-appends` | 10 appends, then `expire_snapshots` with `older_than` now and `retain_last => 1` | `0 \| 0 \| 0 \| 0 \| 9 \| 0`: nine manifest lists, no data file. 7,478,145 to 7,439,750 bytes | The same counts |
| `expire-properties` | 4 appends and a `DELETE`; `expire_snapshots` with no arguments, before and after `history.expire.max-snapshot-age-ms = 1000` with `history.expire.min-snapshots-to-keep` 3, then 1 | Defaults: nothing. Age 1 s and keep 3: two manifest lists. Keep 1: four data files, 4,497,610 to 1,536,720 bytes | The same, with more files from the `DELETE` |
| `expire-retain-last` | 4 appends and two `DELETE` commits; `older_than` now with `retain_last => 3`, then 1 | `retain_last => 3`: three manifest lists, no data file. `retain_last => 1`: six data files | Three manifest lists, then eight data files |
| `expire-tag` | 3 appends, `CREATE TAG before_purge`, `DELETE ... WHERE true`, expiry, `DROP TAG`, expiry | With the tag: the three data files (2,199,810 bytes) stayed. After `DROP TAG`: deleted, 55,379 bytes left | The same; `CREATE TAG` and `DROP TAG` ran in Spark SQL |
| `expire-deletes` | `DELETE` of half the rows with copy-on-write and with merge-on-read, expiry, compaction, expiry | Copy-on-write: 3,669,303, then 5,510,612, then 1,846,387 bytes. Merge-on-read: expiry freed nothing until `rewrite_data_files`; then 1,918,601 bytes, with the 59,106-byte delete file still referenced | The same pattern |
| `gc-disabled` | `gc.enabled = false`, both procedures, then `true` | `Cannot expire snapshots: GC is disabled (deleting files may corrupt other tables)` and `Cannot delete orphan files: GC is disabled (...)`. With `true`, expiry deleted two data files | The same messages |
| `metadata` | 12 appends, expiry, the two metadata properties; a second table with `previous-versions-max` only | 13 `.metadata.json`, 14 after expiry, 4 after `delete-after-commit` with `previous-versions-max = 3`. Second table: 15 stayed, also after turning on `delete-after-commit` | The same counts |
| `metadata-orphans` | The action with `olderThan(now)` through S3A on the second table | Deleted 11 untracked `.metadata.json`, 4 left | The same |
| `orphans` | A planted orphan; the procedure with its default listing, with `prefix_listing`, with `older_than` 1 hour ago; the action with prefix listing | `No FileSystem for scheme "s3"`. `prefix_listing`: no rows. 1 hour: `Cannot remove orphan files with an interval less than 24 hours. [...]`. The action deleted `orphan-a.parquet` | `No FileSystem for scheme "s3"`. `Could not build name to arg map: Unknown argument: prefix_listing`. `Method usePrefixListing([class java.lang.Boolean]) does not exist` |
| `orphans-s3a` | The same table with S3A: the procedure; the action at the table location, at `s3a://`, at `minio://`, with `equalSchemes`, with `IGNORE`, with `NONE` | Procedure: no rows, and the 24-hour message. Action: deleted each planted orphan, including through `s3a://`. `minio://`: `Unable to determine whether certain files are orphan. [...] Conflicting authorities/schemes: [(s3, minio)].` `NONE`: `No enum constant org.apache.iceberg.actions.DeleteOrphanFiles.PrefixMismatchMode.NONE` | The same; the action at the table location deleted `orphan-a` and `orphan-b`, since `orphan-a` was still there |
| `orphans-args` | The procedure with `dry_run`, `equal_schemes`, `prefix_mismatch_mode` | Both accepted; `'NONE'`: `Invalid mode: NONE` | The same |

## Limits of these runs

- One machine, Apple silicon, and one bucket in MinIO. No HDFS, no Amazon S3, no Azure or Google storage.
- The scheme mismatch was made with a second scheme name for the same bucket. A changed HDFS authority, the case the Iceberg documentation warns about, was not run.
- Orphans were objects written minutes before the call, so the procedure's default interval could not delete them; the deletions ran through the Java action with `olderThan(now)`.
- Trino and Athena were not run.
- Each case ran once per line.
