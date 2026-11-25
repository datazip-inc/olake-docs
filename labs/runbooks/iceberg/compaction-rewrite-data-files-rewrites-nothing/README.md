# Lab: Iceberg compaction, and why rewrite_data_files rewrites nothing

Backs the runbook at `docs/runbooks/iceberg/compaction-rewrite-data-files-rewrites-nothing.mdx`.

The lab writes tables with many small commits, runs `CALL demo.system.rewrite_data_files(...)` against each reason it can rewrite nothing or less than expected, and counts files before and after in the `files`, `manifests` and `snapshots` metadata tables and in the bucket itself. It then runs compaction while a second writer commits to the same table.

## What you need

Docker with Compose and about 3 GB of free memory. No host port is published. The `concurrent` step writes about 4.9 million rows, 340 MiB in MinIO.

## Run it

```bash
./run.sh up           # MinIO, the Iceberg REST catalog fixture, an idle Spark container
./run.sh small-files  # 30 commits, compaction, rewrite_manifests, expire_snapshots, object counts
./run.sh thresholds   # min-input-files, partitions, a where filter, files near the target, rewrite-all
./run.sh deletes      # delete-file-threshold, remove-dangling-deletes, delete-ratio-threshold
./run.sh sort         # sort and z-order strategies
./run.sh clustered    # unsorted rows into a partitioned table: distribution mode and fanout writers
./run.sh concurrent   # compaction against a concurrent append, a concurrent delete, and partial progress
./run.sh down
```

`./run.sh all` runs every step from `small-files` to `concurrent`. `LINE=3.3` runs the old line instead of the default `LINE=3.5`, and on that line `clustered-old` repeats the `clustered` writes on Iceberg 1.1.0, with a local Hadoop catalog inside the Spark container because 1.1.0 has no AWS bundle:

```bash
LINE=3.3 ./run.sh up && LINE=3.3 ./run.sh all && LINE=3.3 ./run.sh clustered-old && LINE=3.3 ./run.sh down
```

## What the runs showed

Run on 2026-11-17 with the Iceberg REST catalog fixture 1.10.1 and MinIO RELEASE.2025-04-03T14-56-28Z. The two lines are Spark 3.5.6 (Java 17) with Iceberg 1.12.0 and Spark 3.3.3 (Java 11) with Iceberg 1.4.3. The output columns of `rewrite_data_files` are listed in the order the procedure returns them.

| Step | Spark 3.5.6, Iceberg 1.12.0 | Spark 3.3.3, Iceberg 1.4.3 |
| --- | --- | --- |
| `small-files`, 30 commits of 1,000 rows | 30 data files (1,112,810 bytes, 37,094 on average), 30 manifests, 30 snapshots | 30 data files (1,111,839 bytes), 30 manifests, 30 snapshots |
| `small-files`, `rewrite_data_files` | `30, 1, 1112810, 0, 0`. The `files` table: 1 file. The current snapshot: 31 manifests. The bucket: 31 data files, 2.1 MiB | `30, 1, 1111839` (three columns). Same counts |
| `small-files`, `rewrite_manifests` | `31, 1`: 31 manifests became 1 | Same |
| `small-files`, `expire_snapshots` with defaults | All counts 0 | Same |
| `small-files`, `expire_snapshots` with `older_than` now and `retain_last => 1` | 30 data files, 61 manifests and 31 manifest lists deleted. The bucket: 1 data file, 1.0 MiB, and 34 `.metadata.json` files | Same counts |
| `thresholds`, 4 files, then 5 | 4 files: nothing rewritten (`Nothing found to rewrite in demo.db.four_files` at INFO). 5 files: `5, 1, ...` | Same |
| `thresholds`, 24 files in 6 partitions of 4 | Nothing rewritten, also with `where => 'kind = "click"'`. With `min-input-files` 2: one partition `4, 1, ...`, then the rest `20, 5, ...` | Same |
| `thresholds`, 8 files near `target-file-size-bytes` | Nothing rewritten with the target set to the average file size; `8, 1, ...` with the default target | Same |
| `thresholds`, one file | Nothing rewritten; with `rewrite-all`, `1, 1, ...` | Same |
| `deletes`, 3 files with 10% of rows deleted (merge-on-read) | 3 position delete files. Nothing rewritten by default; with `delete-file-threshold` 1, `3, 1, ...` and the 3 delete files stayed in the snapshot | 1 position delete file. With `delete-file-threshold` 1, `3, 2, ...` |
| `deletes`, `remove-dangling-deletes` | `3, 1, 111725, 0, 3`: the 3 delete files were removed in a second commit | `Cannot use options [remove-dangling-deletes], they are not supported by the action or the rewriter BIN-PACK` |
| `deletes`, 3 files with 40% of rows deleted | Rewritten by default: `3, 1, ...` | Nothing rewritten; `delete-ratio-threshold` rejected the same way as above |
| `sort` | `sort_order => 'id DESC NULLS LAST'` and `'zorder(id, kind)'` on 4 files: nothing rewritten. `strategy => 'sort'` without an order: `Cannot sort data without a valid sort order, table 'demo.db.sorted' is unsorted and no sort order is provided`. Z-order with `rewrite-all`: `4, 1, ...` | Same |
| `clustered`, 6,000 unsorted rows in 4 tasks, table partitioned by `kind` (6 values) | `write.distribution-mode` `none`: 24 files, no error. With `write.spark.fanout.enabled`: 24 files. With `hash`: 6 files | Same. Iceberg 1.1.0 on Spark 3.3.3 (`clustered-old`) also gave 24, 24 and 6, with no error |
| `concurrent`, an `INSERT` 3 s into compaction | Both committed: 49 files rewritten into 8, plus the 8 appended | Same |
| `concurrent`, a `DELETE` in partition `p7` 3 s into compaction | Compaction failed: `Cannot commit rewrite because of a ValidationException or CommitFailedException...`, caused by `Cannot commit, found new position delete for replaced data file`. Nothing rewritten; the bucket held 7 more objects, the delete files, and none from the failed rewrite | Same, with 1 delete file |
| `concurrent`, the same `DELETE` with `partial-progress.enabled` | 7 of 8 partitions committed one by one: `42, 7, ..., 0, 0`. The `p7` group failed (`Failure during rewrite commit process, partial progress enabled. Ignoring`), and `failed_data_files_count` stayed 0 | `42, 7, ...`, same failure in the log |

In both partial-progress runs the second writer's `DELETE` lost one race against a compaction commit, logged `Retrying task after failure: ... branch main has changed`, and then committed. The compaction group that hit the validation failure was not retried.

## Files

- `docker-compose.yml`: MinIO, a one-shot `mc` container that creates the bucket and lists objects for `storage.sh`, the Iceberg REST catalog fixture, and an idle Spark container. Memory limits add up to under 3 GB.
- `compaction.py`: each part of the lab, run in its own Spark session; tables persist in the REST catalog between parts.
- `storage.sh`: counts one table's objects in the bucket with `mc find` and `mc du`.
- `conf/log4j2.properties`: warnings and errors, plus the INFO lines of Iceberg's rewrite action and of each commit.
- `run.sh`: every step above.
- `logs/spark-<version>-iceberg-<version>/`: `<part>.txt` holds the statements and results, `<part>.stderr.txt` the Spark log, `storage-*.txt` the object counts. `logs/spark-3.3.3-iceberg-1.1.0/` holds the `clustered-old` run.
