# Lab: Iceberg schema evolution errors in Spark, PyIceberg and Trino

Backs the runbook at `docs/runbooks/iceberg/schema-evolution-errors.mdx`.

The lab changes table schemas and writes data whose schema does not match the table, in Spark on three versions, in PyIceberg on two, and in Trino, all against the same Iceberg REST catalog and MinIO bucket. Each engine runs alone: run.sh stops Spark before it starts PyIceberg or Trino.

## What you need

Docker with Compose and about 3 GB of free memory. No host port is published. The Spark step downloads the Iceberg jars from Maven Central, and the PyIceberg step installs PyIceberg from PyPI.

## Run it

```bash
./run.sh up          # MinIO, the Iceberg REST catalog fixture, an idle Spark container
./run.sh spark       # all Spark cases in one session (schema.py)
./run.sh pyiceberg   # stops Spark, then pyiceberg_cases.py with PyIceberg 0.12.0 and 0.7.1
./run.sh trino       # stops Spark, starts Trino 484, runs trino.sql one statement at a time
./run.sh down
```

The PyIceberg and Trino steps read tables the Spark step created, so run them after it in the same stack. `LINE=3.3` and `LINE=4.0` run the Spark step on the other two lines:

```bash
LINE=3.3 ./run.sh up && LINE=3.3 ./run.sh spark && LINE=3.3 ./run.sh down
LINE=4.0 ./run.sh up && LINE=4.0 ./run.sh spark && LINE=4.0 ./run.sh down
```

## What the runs showed

Run on 2026-11-17 with the Iceberg REST catalog fixture 1.10.1 and MinIO RELEASE.2025-04-03T14-56-28Z. Spark ran as 3.3.3 (Java 11) with Iceberg 1.4.3, 3.5.6 (Java 17) with Iceberg 1.12.0, and 4.0.5 (Java 17) with Iceberg 1.12.0.

PyIceberg ran as 0.12.0 with PyArrow 26.0.1 and as 0.7.1 with PyArrow 17.0.0, on Python 3.12.16, and Trino as 484.

| Case | Spark 3.3.3, Iceberg 1.4.3 | Spark 3.5.6, Iceberg 1.12.0 | Spark 4.0.5, Iceberg 1.12.0 |
| --- | --- | --- | --- |
| `int` to `bigint`, `float` to `double`, `decimal(10,2)` to `decimal(12,2)` | Allowed; the old row read with the new types | Same | Same |
| `bigint` to `int`, `string` to `int`, `decimal(12,2)` to `decimal(12,4)` | `Cannot update demo.db.types_t field id: bigint cannot be cast to int` | `[NOT_SUPPORTED_CHANGE_COLUMN] ALTER TABLE ALTER/CHANGE COLUMN is not supported for changing ...` | Same, with `SQLSTATE: 0A000` |
| `bigint` to `string`, `date` to `timestamp` | `Cannot change column type: id: long -> string`, `... created: date -> timestamptz` | Same | Same |
| `date` to `timestamp_ntz` on format version 3 | Not run (no `timestamp_ntz` in Spark 3.3) | `Cannot change column type: created: date -> timestamp` | Same |
| DataFrame without a new column | `Cannot write incompatible data to table 'demo.db.miss_t': - Cannot find data for output column 'email'` | ``[INCOMPATIBLE_DATA_FOR_TABLE.CANNOT_FIND_DATA] ... Cannot find data for the output column `email`.`` | Same, with `SQLSTATE: KD000` |
| The same, table with `write.spark.accept-any-schema` | Written, `email` null | Same | Same |
| A string column, or `VALUES ('x', ...)`, into an `int` column | `- Cannot safely cast 'id': string to int` | ``[INCOMPATIBLE_DATA_FOR_TABLE.CANNOT_SAFELY_CAST] ... Cannot safely cast `id` "STRING" to "INT".`` | Same, with `SQLSTATE: KD000` |
| `bigint` into `int`, `float` into `double`, `int` into `string` | Written | Same | Same |
| DataFrame with an extra column, with or without `mergeSchema` | `Cannot write to 'demo.db.extra_t', too many data columns` | `[INSERT_COLUMN_ARITY_MISMATCH.TOO_MANY_DATA_COLUMNS] ...` | Same |
| Extra column, `accept-any-schema` only | `Field phone not found in source schema` | Same | Same |
| Extra column, `accept-any-schema` and `mergeSchema` | Column added | Same | Same |
| `INSERT ... VALUES` with the right number of values, `accept-any-schema` on | `Field col1 not found in source schema` | Same | Same |
| Write with the old name after `RENAME COLUMN` | `- Cannot find data for output column 'surname'` | `CANNOT_FIND_DATA` for `surname` | Same |
| By-position write after a column reorder | Values landed in the swapped columns, no error | Same | Same |
| Struct without a new nested field | `- Cannot find data for output column 'point.z'` | `CANNOT_FIND_DATA` for `point`.`z` | Same |
| Struct fields in another order | Written by name | Same | Same |
| Nullable DataFrame column, no nulls, into `NOT NULL` | `- Cannot write nullable values to non-null column 'id'` | Written | Written |
| The same with a null value | Same as above | `NullPointerException: Null value appeared in non-nullable field` at run time | `[NOT_NULL_ASSERT_VIOLATION] NULL value appeared in non-nullable field` |
| Nullable column, `accept-any-schema` on | `Cannot write incompatible dataset to table with schema: ... * id should be required, but is optional` | Same | Same |
| The same with `spark.sql.iceberg.check-nullability=false` | Written | Same | Same |
| `SET NOT NULL`, `ADD COLUMN ... NOT NULL` | `Cannot change nullable column to non-nullable: name`; `Incompatible change: cannot add required column: code` | Same | Same |
| `ADD COLUMN ID` next to `id` | `Cannot add column, because ID already exists in root` | `[FIELDS_ALREADY_EXISTS] ...` | `[FIELD_ALREADY_EXISTS] ...` |
| The same with `spark.sql.caseSensitive=true`, then read case-insensitively | Added; `Invalid projection for field ID: Cannot project int to incompatible type: LongType`, and `id` ambiguous | Same | Same |
| On that table, `SELECT name ... WHERE name = 'a'` and `ADD COLUMN extra string`, case-insensitive | Both ran | Same | Same |
| Repair: `RENAME COLUMN ID TO id_int` with `spark.sql.caseSensitive=true` (table `case_fix_t`) | Not run | `SELECT *` and `SELECT id` ran with the default setting; Trino 484 read the table | Not run |

PyIceberg, appending to a table with `id` required:

| Case | PyIceberg 0.7.1 | PyIceberg 0.12.0 |
| --- | --- | --- |
| Arrow's default nullable `id` | `ValueError: Mismatch in fields:` with a table marking `1: id: required long` against `1: id: optional long` | Same |
| An extra column | `ValueError: PyArrow table contains more columns: email. Update the schema first (hint, use union_by_name).` | Same |
| A missing optional column, `id` as `int32` | Written | Written |
| `id` as a string | `ValueError: Mismatch in fields:` | Same |
| Nanosecond timestamps | `TypeError: Iceberg does not yet support 'ns' timestamp precision. Use 'downcast-ns-timestamp-to-us-on-write' ...` | `UnsupportedPyArrowTypeException: Column 'created' has an unsupported type: timestamp[ns]`, caused by the same `TypeError` |
| `update_schema().union_by_name(...)`, then append | Written, `email` added | Same |
| `update_column("id", IntegerType())` | `ValidationError: Cannot change column type: id: long -> int` | Same |
| The Spark table with `id` and `ID` | Loaded and scanned | Same |

Trino 484 read the evolved Spark tables, refused the table with `id` and `ID` (`Table iceberg.db.case_t has multiple columns with the same name after lower-case normalization: 'id' and 'ID'`), widened `integer` to `bigint` and `real` to `double`, refused narrowing with `Failed to set column type: Cannot change column type: id: long -> int`, refused `INSERT` with too few values with `Insert query has mismatched column types`, and refused `ADD COLUMN ... NOT NULL` with `This connector does not support adding not null columns`.

PyIceberg 0.6.1 was tried first as the old line. It depends on `mmhash3`, which pip had to build from source on Python 3.12, and the slim image has no compiler, so the install failed and 0.7.1 was used instead.

## Files

- `docker-compose.yml`: MinIO, a one-shot `mc` container that creates the bucket, the Iceberg REST catalog fixture, an idle Spark container, and the `pyiceberg` and `trino` services behind profiles.
- `schema.py`: the Spark cases. `pyiceberg_cases.py`: the PyIceberg cases. `trino.sql`: the Trino statements, one per line.
- `trino/catalog/iceberg.properties`, `trino/jvm.config`: the Iceberg connector on the same catalog and bucket, with a 1 GB heap.
- `conf/log4j2.properties`: warnings and errors only.
- `run.sh`: every step above.
- `logs/spark-<version>-iceberg-<version>/spark.txt`, `logs/pyiceberg/pyiceberg-<version>.txt`, `logs/trino-484/trino.txt`: what each statement returned or raised.
