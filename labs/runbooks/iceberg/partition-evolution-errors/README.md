# Lab: Iceberg partition specs and partition evolution in Spark, PyIceberg and Trino

Backs the runbook at `docs/runbooks/iceberg/partition-evolution-errors.mdx`.

The lab creates partitioned Iceberg tables, changes their partition specs, writes under the old and the new spec, and drops columns that a spec uses. It runs in Spark on three versions, then reads and changes the same tables with PyIceberg 0.12.0, Trino 484 and an older Spark, all against one Iceberg REST catalog and one MinIO bucket. Each engine runs alone: run.sh stops the others before it starts one.

## What you need

Docker with Compose and about 3 GB of free memory. No host port is published. The Spark steps download the Iceberg jars from Maven Central into an Ivy cache volume that `./run.sh down` removes, and the PyIceberg step installs PyIceberg from PyPI.

## Run it

```bash
./run.sh up      # MinIO, the Iceberg REST catalog fixture, an idle Spark container
./run.sh all     # every step below, in this order
./run.sh down
```

The steps of `all` on the default line, Spark 3.5.6 with Iceberg 1.12.0:

```bash
./run.sh noext                        # partition DDL in a session without the Iceberg SQL extensions
./run.sh spark                        # the cases create, evolve, prune, replace and dropcol (partitions.py)
./run.sh replace-fix                  # two ways round the failed overwrite of the replace case
./run.sh pyiceberg                    # PyIceberg 0.12.0 without, then with pyiceberg-core 0.10.1
./run.sh trino                        # Trino 484: trino.sql
./run.sh old-read before              # Spark 3.3.3 with Iceberg 1.4.3 reads the tables
./run.sh clean-specs                  # rewrite_data_files, then expire_snapshots with clean_expired_metadata, twice
./run.sh old-read after-clean-specs
./run.sh clean-v1                     # the format version 1 table: to version 2, drop its void field, clean again
./run.sh old-read after-clean-v1
./run.sh trino trino-after.sql        # Trino reads the DROP COLUMN tables again
```

The later steps use the tables the `spark` step created, so run them in this order in the same stack. On the other two lines `all` runs `noext`, `spark` and `replace-fix`:

```bash
LINE=4.0 ./run.sh up && LINE=4.0 ./run.sh all && LINE=4.0 ./run.sh down
LINE=3.3 ./run.sh up && LINE=3.3 ./run.sh all && LINE=3.3 ./run.sh down
```

| `LINE` | Spark image | Iceberg |
| --- | --- | --- |
| `3.5` (default) | `apache/spark:3.5.6-scala2.12-java17-python3-ubuntu` | 1.12.0 |
| `4.0` | `apache/spark:4.0.5-scala2.13-java17-python3-ubuntu` | 1.12.0 |
| `3.3` | `apache/spark:3.3.3-scala2.12-java11-python3-ubuntu` | 1.4.3 |

The other images are pinned in `docker-compose.yml`: `olakego/minio:RELEASE.2025-04-03T14-56-28Z`, `olakego/mc:RELEASE.2025-04-03T17-07-56Z`, `apache/iceberg-rest-fixture:1.10.1`, `python:3.12.16-slim-bookworm` and `trinodb/trino:484`. The older Spark of `old-read` is the `LINE=3.3` image with Iceberg 1.4.3.

## Two catalogs

The Spark session has two Iceberg catalogs. `demo` is the REST catalog fixture, which applies every commit again with its own Iceberg library, 1.10.1, and can refuse a change that the client accepted. `local` is a Hadoop catalog on the Spark container's disk, where the client writes the metadata itself.

The `dropcol` case runs on both catalogs. Where the two disagree, the difference comes from the catalog server.

## How the scan is measured

`partitions.py` reads the metrics of the Iceberg scan from the Spark UI's REST API after each query in the `prune` case: the number of data files the scan read (`number of result data files`), the files it skipped, and the rows it returned to Spark (`number of output rows`). The queries use `count(*)` with `sum(amount)`, so that Spark does not answer them from metadata alone.

## What the runs showed

Run on 2026-11-27, each line on a fresh stack.

| Run | Spark | Iceberg | Folder |
| --- | --- | --- | --- |
| `LINE=3.5` | 3.5.6 (Java 17) | Apache Iceberg 1.12.0 (commit 212aa894e919ff9fdf89160da4aadcbe6858ac01) | `logs/spark-3.5.6-iceberg-1.12.0` |
| `LINE=4.0` | 4.0.5 (Java 17) | Apache Iceberg 1.12.0 (commit 212aa894e919ff9fdf89160da4aadcbe6858ac01) | `logs/spark-4.0.5-iceberg-1.12.0` |
| `LINE=3.3` | 3.3.3 (Java 11) | Apache Iceberg 1.4.3 (commit 9a5d24fee239352021a9a73f6a4cad8ecf464f01) | `logs/spark-3.3.3-iceberg-1.4.3` |

PyIceberg ran as 0.12.0 with PyArrow 26.0.1 on Python 3.12.16, once without and once with `pyiceberg-core` 0.10.1 (`logs/pyiceberg`). Trino ran as 484 (`logs/trino-484`). The older reader of the `old-read` steps was Spark 3.3.3 with Iceberg 1.4.3 (`logs/old-read`). All of them used the tables the `LINE=3.5` run created.

Spark 3.5.6 and 4.0.5 gave the same results. Their messages differ only where Spark itself prints them: Spark 4.0.5 adds `SQLSTATE` and says "A column, variable, or function parameter" where 3.5.6 says "A column or function parameter".

### Spark

| Case | Spark 3.3.3, Iceberg 1.4.3 | Spark 3.5.6 and 4.0.5, Iceberg 1.12.0 |
| --- | --- | --- |
| `noext`: `ADD`, `DROP`, `REPLACE PARTITION FIELD` without `spark.sql.extensions` | `Syntax error at or near 'FIELD': missing '('(line 1, pos 42)`, and `'PARTITION'` for `REPLACE` | `[PARSE_SYNTAX_ERROR] Syntax error at or near 'FIELD': missing '('.(line 1, pos 42)`; 4.0.5 adds `SQLSTATE: 42601` |
| `noext`: `CREATE TABLE ... PARTITIONED BY (days(ts), bucket(4, id))` and an insert | Ran | Ran |
| `create`: `bucket(16, amount)` on a `double` | `Invalid source type double for transform: bucket[16]` | Same |
| `create`: `hours(d)` on a `date`, `truncate(10, ts)` on a `timestamp` | `Invalid source type date for transform: hour`, `Invalid source type timestamptz for transform: truncate[10]` | Same |
| `create`: `days(ts), hours(ts)` | `Cannot add redundant partition: 1000: ts_day: day(1) conflicts with 1001: ts_hour: hour(1)` | Same |
| `create`: a struct column, a column that does not exist | `Cannot partition by non-primitive source field: struct<...>`, `Couldn't find column created in:` | Same |
| `create`: `point.x`, a field inside a struct | Ran, `1000: point.x: identity(3)` | Same |
| `evolve`: `ADD PARTITION FIELD hours(ts)`, then `months(ts)`, on `days(ts)` | Ran: spec `[ts_day, ts_hour, ts_month]` | Same |
| `evolve`: `ADD PARTITION FIELD days(ts)`, with and without `AS` | `Cannot add duplicate partition field ..., conflicts with 1000: ts_day: day(2)` | Same |
| `evolve`: `ADD PARTITION FIELD category AS ts_day` | `Cannot add duplicate partition field name: ts_day` | Same |
| `evolve`: `ADD PARTITION FIELD bucket(16, amount)` | `Cannot bind: bucket[16] cannot transform double values from 'amount'` | Same |
| `evolve`: `DROP PARTITION FIELD ts_hour` after `ts_hour` was dropped | `Cannot find partition field to remove: ts_hour` | Same |
| `evolve`: `REPLACE PARTITION FIELD ts_day WITH hours(ts)` | Ran; the next insert had spec 4 | Same |
| `evolve`: `ADD PARTITION FIELD days(ts)` on a table with a column `ts_day` | `Cannot create identity partition sourced from different field in schema: ts_day`; with `AS ts_day_part` ran | Same |
| `prune`: `WHERE category = 'b'` after `ADD PARTITION FIELD category` | 14,000 rows read for a count of 6,000 | 6 files read (4 under spec 0), 4 skipped, 14,000 rows |
| `prune`: range on `ts` / `CAST(ts AS DATE)` / `system.days(ts)` / `date_format(ts, ...)` | 3,000 / 18,000 / 18,000 / 18,000 rows | 1 / 1 / 1 / 10 files; 3,000 / 3,000 / 3,000 / 18,000 rows |
| `prune`: `WHERE ts_day = ...` | `Column 'ts_day' does not exist. Did you mean one of the following? [...]` | ``[UNRESOLVED_COLUMN.WITH_SUGGESTION] A column or function parameter with name `ts_day` cannot be resolved`` (4.0.5: "A column, variable, or function parameter") |
| `prune`: `rewrite_data_files` with defaults, then with `rewrite-all` | 0 files; then 10 into 18, all spec 1; the `category` query then read 6,000 rows | Same; 6 files read, 12 skipped |
| `replace`: `saveAsTable` overwrite partitioned by a new column, format 2 | `Cannot find source column for partition field: 1000: some_date: identity(1)` | Replaced, spec `[1001: some_date_2: identity(2)]` |
| `replace`: the same, format 1 | Same as format 2 | `Cannot build accessor for field: null` |
| `replace`: `writeTo(...).partitionedBy('some_date_2').createOrReplace()` | Same as `saveAsTable`, on both formats | Format 2 ran; format 1 `Cannot build accessor for field: null` |
| `replace-fix`: format 1 moved to format 2, then the `saveAsTable` overwrite | `Cannot find source column for partition field: 1000: some_date: identity(1)` | Replaced, spec `[1001: some_date_2: identity(2)]` |
| `replace-fix`: `DROP TABLE ... PURGE`, then `writeTo(...).partitionedBy('some_date_2').create()` | Created, spec `[1000: some_date_2: identity(1)]` | Same |
| `dropcol`: `DROP COLUMN` of the current spec's source | `Cannot find source column for partition field: 1000: category: identity(2)` | Same |
| `dropcol`: `DROP PARTITION FIELD category`, then `DROP COLUMN category`, format 2 and 1 | Ran; then `SELECT`, `files` and `partitions` failed with `NullPointerException: Type cannot be null`, and the insert with `Cannot find source column for partition field` | Ran; `SELECT` and the insert ran, `files` had no `partition` column |
| `dropcol`: `ADD COLUMN category` afterwards | `Cannot create identity partition sourced from different field in schema: category`, on both catalogs | REST catalog: the same message; Hadoop catalog: added as field 4, earlier rows `None` |
| `dropcol`: `rewrite_manifests` afterwards | Ran, `0 \| 0` | Format 2 ran; format 1 `Cannot find field 1000: category: optional unknown in struct<>` |
| `dropcol`: `register_table` of the metadata file from before the drop, as `dc_v<n>_restored` | Rows 1 to 3 with `category` | Same |
| `dropcol` repair: `DROP TABLE` without `PURGE`, `register_table` under the same name | Rows 1 to 3 with `category`; `metadata_log_entries` listed the files after the drop | Same; row 4, written after the drop, was gone |

### Reading the same tables

All after the `LINE=3.5` `spark` step.

| Table | Spark 3.3.3, Iceberg 1.4.3 (`old-read before`) | PyIceberg 0.12.0 | Trino 484 |
| --- | --- | --- | --- |
| `dc_v2`, `dc_v1` (old spec's column dropped) | `The Spark SQL phase analysis failed with an internal error.`, `Caused by: java.lang.NullPointerException: Type cannot be null` | Loaded and scanned, 4 rows | `Error processing metadata for table db.dc_v2`, caused by `NullPointerException: Cannot invoke "org.apache.iceberg.types.Type.typeId()" because "type" is null`; `$partitions` answered |
| `dc_v2_restored`, `dc_fix` | Read, 3 rows with `category` | `dc_fix` read | Read, 3 rows |
| `split_t`, `WHERE category = 'b'` | | `6 files {0: 4, 1: 2} by spec id, 14000 records planned` | `Input: 14000 rows`, `Splits: 6` |
| `nested_p` (`point.x`) | Read | Read | Read |

After `clean-specs` (rewrite with `rewrite-all`, expiry with `clean_expired_metadata`, an insert, the expiry again), spec 0 was gone from `dc_v2`, and Iceberg 1.4.3 read it (`old-read after-clean-specs`). The first expiry, right after the rewrite, had left spec 0: a spec 0 manifest still held the deleted entries (`0 | 0 | 0 | 2`). On `dc_v1` the same steps removed spec 0 but not the current spec `[1000: category: void(2)]`, and 1.4.3 still failed. The expiry on `dc_v2` also deleted the data files of `dc_v2_restored`, which then failed with `NoSuchKeyException` (Status Code: 404).

After `clean-v1` (format version 2, `DROP PARTITION FIELD category`, then the same steps), only `spec 2: []` was left, and Iceberg 1.4.3 (`old-read after-clean-v1`) and Trino 484 (`trino-after.txt`) read `dc_v1`, 6 rows, and `dc_v2`, 5 rows.

### PyIceberg and Trino on their own tables

| Case | Result |
| --- | --- |
| PyIceberg `update_spec().add_field('ts', HourTransform(), 'ts_hour')` on `day(ts)` | Added: spec `[ts_day, ts_hour]` |
| PyIceberg `add_field('ts', DayTransform(), 'ts_day')` | `ValueError: Duplicate partition field for $ts=$Reference(name='ts'), $1000: ts_day: day(2) already exists` |
| PyIceberg `add_field('category', IdentityTransform(), 'ts_day')` | `ValueError: Cannot add duplicate partition field name: ts_day` |
| PyIceberg `add_field('amount', BucketTransform(16), ...)`, `add_field('created', ...)` | `bucket[16] cannot transform double values from amount`, `Could not find field with name created, case_sensitive=True` |
| PyIceberg `remove_field('ts_day')` with `add_field('ts', HourTransform(), 'ts_hour')` | Ran: spec `[1001: ts_hour: hour(2)]` |
| PyIceberg append, without `pyiceberg-core` | Identity written; `day`, `hour`, `bucket[16]`, `truncate[4]`: `pyiceberg_core needs to be installed. pip install "pyiceberg[pyiceberg-core]"` |
| PyIceberg append, with `pyiceberg-core` 0.10.1 | All written |
| Trino `partitioning = ARRAY['days(ts)']`, `['bucket(16, id)']`, `['point.x']` | `Unable to parse partitioning value: Invalid partition field declaration: ...` |
| Trino `['bucket(id, 16)']`, `['"point.x"']` | Created |
| Trino `['bucket(amount, 16)']` on a `double` | `Unable to parse partitioning value: Invalid source type double for transform: bucket[16]` |
| Trino `['day(ts)', 'hour(ts)']`, in `CREATE TABLE` and in `SET PROPERTIES` | `Unable to parse partitioning value: Cannot add redundant partition: 1000: ts_day: day(2) conflicts with 1001: ts_hour: hour(2)` |
| Trino `SET PROPERTIES partitioning` to `['day(ts)', 'category']`, then `['hour(ts)', 'category']` | Ran; `$files` showed the partition values of each spec |
| Trino `DROP COLUMN category` while the current spec uses it | `Cannot drop partition field: category` |
| Trino `DROP COLUMN category` after the field was removed from the spec | `Cannot drop column which is used by an old partition spec: category` |

The `replace-fix` step was run after the other steps, each line on a fresh stack: `up`, `replace-fix`, `down`.

## Limits of these runs

- One machine, Apple silicon, and one bucket in MinIO. No Amazon S3, HDFS, AWS Glue, Hive Metastore or other catalog server.
- The REST catalog is the Iceberg test fixture, Iceberg 1.10.1. A production REST catalog can check commits differently, as the `ADD COLUMN category` case shows for this one.
- PyIceberg ran on 0.12.0 only, and Trino on 484 only. Flink and Amazon Athena were not run.
- The scan metrics of Iceberg 1.4.3 had no file counts, only `number of output rows`.
- Each case ran once per line.

## Files

- `docker-compose.yml`: MinIO, a one-shot `mc` container that creates the bucket, the Iceberg REST catalog fixture, an idle Spark container, and the `spark-old`, `pyiceberg` and `trino` services behind profiles.
- `partitions.py`: the Spark cases, one per argument. `pyiceberg_cases.py`: the PyIceberg cases. `trino.sql` and `trino-after.sql`: the Trino statements, one per line; a line that starts with `DEBUG` runs with `--debug`.
- `trino/catalog/iceberg.properties`, `trino/jvm.config`: the Iceberg connector on the same catalog and bucket, with a 1 GB heap.
- `conf/log4j2.properties`: warnings and errors, plus the INFO lines of Iceberg commits and actions.
- `run.sh`: every step above.
- `logs/spark-<version>-iceberg-<version>/<step>.txt`: what each statement returned or raised, with the Spark log in `<step>.stderr.txt`. `logs/pyiceberg/`, `logs/trino-484/` and `logs/old-read/`: the same for the other engines.
