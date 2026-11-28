# Lab: which engine reads which Iceberg delete format, on format version 2 and 3 tables

Backs the runbook at `docs/runbooks/iceberg/deletion-vectors-delete-files-by-engine.mdx`.

Each engine writes the same rows and the same three changes (a delete, an update and a merge) to its own tables, on format version 2 and 3, with every delete format it can write. Then each engine reads every table, and the lab compares what it returned with the rows the changes leave. Spark runs on three versions; PyIceberg 0.12.0 and Trino 484 use the same Iceberg REST catalog and MinIO bucket. Each engine runs alone: every step starts its engine and stops it when it is done.

## What you need

Docker with Compose and about 3 GB of free memory. No host port is published. The Spark steps download the Iceberg jars from Maven Central into an Ivy cache volume that `./run.sh down` removes, and the PyIceberg steps install PyIceberg from PyPI.

## Run it

```bash
./run.sh all     # starts the stack, then every step below, in this order
./run.sh down
```

The steps of `all`:

```bash
./run.sh up                                # MinIO, the Iceberg REST catalog fixture
./run.sh write spark-3.5                   # the s35_ tables (tables.txt lists every table)
./run.sh write spark-4.0                   # the s40_ tables
./run.sh write spark-3.3                   # the s33_ tables, format version 2 only
./run.sh write pyiceberg                   # py_v2, and the attempt at py_v3
./run.sh write trino                       # t_v2_pos and t_v3_dv (trino-write.sql), and a format version 1 table
./run.sh errors                            # Spark 3.5.6: downgrades, merge-on-read on v1, a position delete file on v3
./run.sh read spark-3.5                    # every reader reads every table in tables.txt
./run.sh read spark-4.0
./run.sh read spark-3.3
./run.sh read pyiceberg                    # twice: without and with pyiceberg-core 0.10.1
./run.sh read trino
./run.sh read-no-vectorization spark-3.3   # the same read with spark.sql.iceberg.vectorization.enabled=false
./run.sh diagnose                          # PyIceberg: Parquet encodings of the files of t_v2_pos and s35_v2_pos
./run.sh fix                               # rewrite_data_files, rewrite_position_delete_files, Trino optimize
./run.sh read pyiceberg after-fix
./run.sh read spark-3.5 after-fix
./run.sh read trino after-fix
./run.sh copy-v2                           # a format version 2 copy of s35_v3_dv, read by Spark 3.3.3
```

The read and fix steps use the tables the write steps created, so run them in this order in the same stack.

| Engine | Image or package | Iceberg |
| --- | --- | --- |
| `spark-3.5` | `apache/spark:3.5.6-scala2.12-java17-python3-ubuntu` | 1.12.0 |
| `spark-4.0` | `apache/spark:4.0.5-scala2.13-java17-python3-ubuntu` | 1.12.0 |
| `spark-3.3` | `apache/spark:3.3.3-scala2.12-java11-python3-ubuntu` | 1.4.3 |
| `pyiceberg` | `python:3.12.16-slim-bookworm`, `pyiceberg[pyarrow]==0.12.0` with `pyarrow==26.0.1`, then with `pyiceberg-core==0.10.1` as well | |
| `trino` | `trinodb/trino:484` | |

The other images are pinned in `docker-compose.yml`: `olakego/minio:RELEASE.2025-04-03T14-56-28Z`, `olakego/mc:RELEASE.2025-04-03T17-07-56Z` and `apache/iceberg-rest-fixture:1.10.1`. `logs/00-images.txt` has the image IDs of the run.

## The tables and the changes

Every table gets ids 1 to 5 and 6 to 10 in two inserts, then `DELETE ... WHERE id IN (3, 8)`, `UPDATE ... SET v = 'u5' WHERE id = 5`, and a `MERGE` that updates id 10 to `m10` and inserts id 11 as `m11`. The rows they leave are `1:r1,2:r2,4:r4,5:u5,6:r6,7:r7,9:r9,10:m10,11:m11`. A read is correct when it returns exactly those 9 rows and `count(*)` returns 9.

Spark runs with `spark.default.parallelism=1`, so that each insert writes one data file of 5 rows and the deletes fall inside files. Without it, Spark 3.5.6 wrote one file per row, and `DELETE` dropped whole files instead of writing delete files.

No `DELETE`, `UPDATE` or `MERGE` in Spark, Trino or PyIceberg writes equality deletes. The `_eq` tables get them from the Iceberg Java API in the Spark session (`deletes.py`, `eq_commit`): each change is one `RowDelta` with an equality delete file on `id` and, for the update and the merge, a data file with the new rows. That is how streaming upsert writers commit a change.

## What the runs showed

Run on 2026-11-27, on one stack, in the order above. `all` ran up to the `after-fix` reads; `copy-v2` was added after that run and ran next on the same stack.

| Run | Version | Folder |
| --- | --- | --- |
| Spark 3.5.6 (Java 17) | Apache Iceberg 1.12.0 (commit 212aa894e919ff9fdf89160da4aadcbe6858ac01) | `logs/spark-3.5.6-iceberg-1.12.0` |
| Spark 4.0.5 (Java 17) | Apache Iceberg 1.12.0 (commit 212aa894e919ff9fdf89160da4aadcbe6858ac01) | `logs/spark-4.0.5-iceberg-1.12.0` |
| Spark 3.3.3 (Java 11) | Apache Iceberg 1.4.3 (commit 9a5d24fee239352021a9a73f6a4cad8ecf464f01) | `logs/spark-3.3.3-iceberg-1.4.3` |
| PyIceberg 0.12.0 | PyArrow 26.0.1, Python 3.12.16, without and with `pyiceberg-core` 0.10.1 | `logs/pyiceberg` |
| Trino 484 | | `logs/trino-484` |

### What each engine wrote

| Writer | Format version 2 | Format version 3 |
| --- | --- | --- |
| Spark 3.5.6 and 4.0.5, merge-on-read | Position delete files, one per data file, replaced at each later change: 2 files, 4 deletes | Deletion vectors (Puffin), one per data file, replaced at each later change: 2, 4 deletes |
| Spark 3.3.3, merge-on-read | Position delete files, a new one at each change: 3 files, 4 deletes | Not run: Iceberg 1.4.3 has no format version 3 |
| Spark 3.5.6, copy-on-write | No delete files | No delete files |
| Iceberg Java API 1.12.0 and 1.4.3 | 3 equality delete files, 5 deletes | 3 equality delete files, 5 deletes (1.12.0 only) |
| Trino 484 | Position delete files, a new one per data file at each change: 4 files, 4 deletes | Deletion vectors, replaced at each later change: 2, 4 deletes |
| PyIceberg 0.12.0, merge-on-read properties set | No delete files. `delete`, `overwrite` and `upsert` each warned `Merge on read is not yet supported, falling back to copy-on-write` | `create_table` ran; the first `append` failed with `ValueError: Cannot write manifest for table version: 3` |

`s35_v2to3` was written as a version 2 merge-on-read table, moved to version 3 with `ALTER TABLE ... SET TBLPROPERTIES ('format-version' = '3')` after the update, and then merged. The merge wrote a deletion vector for the data file it changed and removed that file's position delete file. The table ended with `1 | PARQUET | 1 | 2` and `1 | PUFFIN | 1 | 2` in `delete_files`.

A table created without `format-version` was version 2 on Iceberg 1.4.3 and 1.12.0, in PyIceberg 0.12.0 and in Trino 484.

### What each engine read

| Table | Spark 3.5.6 and 4.0.5 | Spark 3.3.3, Iceberg 1.4.3 | PyIceberg 0.12.0 | Trino 484 |
| --- | --- | --- | --- | --- |
| `s35_v2_pos`, `s40_v2_pos`, `s33_v2_pos` | Correct | Correct | Correct | Correct |
| `s35_v2_eq`, `s40_v2_eq`, `s33_v2_eq` | Correct | Correct | `ValueError: PyIceberg does not yet support equality deletes: https://github.com/apache/iceberg/issues/6568` | Correct |
| `s35_v2_cow`, `py_v2` | Correct | Correct | Correct | Correct |
| `t_v2_pos` | Correct | `UnsupportedOperationException: Cannot support vectorized reads for column [v] optional binary v (STRING) = 2 with encoding DELTA_LENGTH_BYTE_ARRAY. Disable vectorized reads to read this table/file`; correct with vectorization off | `OSError: Not yet implemented: DecodeArrow of DictAccumulator for DeltaLengthByteArrayDecoder.` | Correct |
| `s35_v3_dv`, `s40_v3_dv`, `t_v3_dv` | Correct | `IllegalArgumentException: Cannot read unsupported version 3` | Correct | Correct |
| `s35_v3_eq`, `s40_v3_eq` | Correct | `Cannot read unsupported version 3` | `PyIceberg does not yet support equality deletes` | Correct |
| `s35_v3_cow`, `s35_v2to3` | Correct | `Cannot read unsupported version 3` | Correct | Correct |

PyIceberg gave the same results without and with `pyiceberg-core`. No reader returned wrong rows or a wrong count: each read was correct or failed with an error.

On Iceberg 1.4.3 the version 3 error came wrapped by the REST client: `RESTException: Received a success response code of 200, but failed to parse response body into LoadTableResponse`, caused by `Cannot read unsupported version 3`.

### The two Parquet encoding failures on Trino's table

Trino 484 wrote its Parquet files with `created_by parquet-mr-trino version 484` and encoded string columns as `DELTA_LENGTH_BYTE_ARRAY`: the column `v` of its data files and the column `file_path` of its position delete files (`diagnose`). Spark's position delete files encoded `file_path` as `PLAIN_DICTIONARY`.

- Iceberg 1.4.3's vectorized Parquet reader rejected the data files. With `spark.sql.iceberg.vectorization.enabled=false` the same session read `t_v2_pos` correctly, Trino's 4 position delete files included (`read-no-vectorization`).
- PyIceberg 0.12.0 reads `file_path` of a position delete file as a dictionary column (`_read_deletes`, printed by `diagnose`). PyArrow 26.0.1 failed on Trino's delete files with `read_dictionary=['file_path']`, with the same `DecodeArrow` message, and read them without it. The same data files with Trino's deletion vectors (`t_v3_dv`) read correctly.

### Errors on changes

| Change | Result |
| --- | --- |
| `ALTER TABLE demo.db.s35_v3_dv SET TBLPROPERTIES ('format-version' = '2')` | `org.apache.spark.SparkException: Unsupported table change: Cannot downgrade v3 table to v2` |
| `ALTER TABLE demo.db.s35_v2_pos SET TBLPROPERTIES ('format-version' = '1')` | `Unsupported table change: Cannot downgrade v2 table to v1` |
| A Parquet position delete file committed to a version 3 table with `RowDelta` (Iceberg 1.12.0) | `IllegalArgumentException: Must use DVs for position deletes in V3: s3://warehouse/db/s35_v3_posfile/data/...parquet`; the table kept its 10 rows |
| Spark 3.5.6, `DELETE` on a version 1 table with merge-on-read properties | `IllegalArgumentException: Deletes are supported in V2 and above` |
| Trino 484, `DELETE`, `UPDATE` and `MERGE` on a version 1 table | `Iceberg table updates require at least format version 2`, each; after `ALTER TABLE iceberg.db.t_v1 SET PROPERTIES format_version = 2` the `DELETE` ran and wrote a position delete file |

### The fixes

| Step | Result | Read afterwards |
| --- | --- | --- |
| `rewrite_data_files` on `s35_v2_eq`, `delete-file-threshold` 1 | 4 data files into 1; 2 of the 3 equality delete files removed, 1 left | PyIceberg still refused it |
| The same with `remove-dangling-deletes`, on `s40_v2_eq` and `s35_v3_eq` | No delete file left; the removal was a second commit | PyIceberg: correct |
| Trino `ALTER TABLE iceberg.db.s33_v2_eq EXECUTE optimize` | `rewritten_data_files_count` 4, `removed_delete_files_count` 3, `added_data_files_count` 1 | PyIceberg: correct |
| `rewrite_position_delete_files` with `rewrite-all` on `t_v2_pos` | Trino's 4 position delete files into 2 written by Spark | PyIceberg: correct |
| The same on `s35_v2to3` | The position delete file became a deletion vector: `1 \| PUFFIN \| 2 \| 4` | Correct in every reader that opens version 3 |
| `CREATE TABLE ... TBLPROPERTIES ('format-version' = '2') AS SELECT * FROM demo.db.s35_v3_dv` (`copy-v2`) | `s35_v3_dv_v2copy`, a version 2 table without delete files | Spark 3.3.3 with Iceberg 1.4.3: correct |

After the fixes, Spark 3.5.6 and Trino 484 still read every table correctly, and PyIceberg read every table except `s35_v2_eq` and `s40_v3_eq`, the one left with an equality delete file and the one that was not rewritten (`after-fix`).

## Limits of these runs

- One machine, Apple silicon, and one bucket in MinIO. No Amazon S3, AWS Glue, Hive Metastore or other catalog server.
- The REST catalog is the Iceberg test fixture, Iceberg 1.10.1. It applies every commit again with its own Iceberg library.
- Small unpartitioned tables: 2 to 5 data files each. Equality deletes on a partitioned table, and delete files at scale, were not run.
- Equality deletes were written with the Iceberg Java API only. Flink, the Kafka Connect Iceberg sink and other streaming writers were not run.
- Iceberg 1.5 to 1.11, Spark 3.4, PyIceberg before 0.12 and Trino before 484 were not run. Amazon Athena, Amazon Redshift, Snowflake, BigQuery, Databricks, DuckDB and ClickHouse were not run.
- Each case ran once.

## Files

- `docker-compose.yml`: MinIO, a one-shot `mc` container that creates the bucket, the Iceberg REST catalog fixture, and the three Spark versions, PyIceberg and Trino behind profiles.
- `tables.txt`: every table the read steps read, with its writer.
- `deletes.py`: the Spark cases (`write`, `errors`, `fix`, `copy-v2`, `read`). `pyiceberg_cases.py`: the PyIceberg cases (`write`, `read`, `encodings`).
- `trino-write.sql`, `trino-fix.sql`: the Trino statements, one per line; a line that starts with `DEBUG` runs with `--debug`. `run.sh` runs Trino's read itself.
- `trino/catalog/iceberg.properties`, `trino/jvm.config`: the Iceberg connector on the same catalog and bucket, with a 1 GB heap.
- `conf/log4j2.properties`: warnings and errors, plus the INFO lines of Iceberg commits and actions.
- `run.sh`: every step above.
- `logs/<engine>/<step>.txt`: what each statement returned or raised, with the Spark and pip output in `<step>.stderr.txt`. `RESULT` lines at the end of each read log give the result per table.
