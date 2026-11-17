# Lab: a Spark session that cannot find Iceberg

Backs the runbook at `docs/runbooks/iceberg/spark-cannot-find-iceberg.mdx`.

A Spark session sees Iceberg through three settings: the runtime jar on the class path, a catalog defined with `spark.sql.catalog.<name>`, and, for some statements, the SQL extensions. This lab leaves each one out or gets it wrong, on three Spark lines, and records what every statement printed.

## What you need

Docker with Compose and about 3 GB of free memory. No host port is published. Each step downloads the Iceberg jars from Maven Central with `--packages` the first time.

## Run it

```bash
./run.sh up               # MinIO, the Iceberg REST catalog fixture, an idle Spark container
./run.sh working          # the full configuration: CREATE, INSERT, MERGE, UPDATE, DELETE, CALL
./run.sh no-jar           # catalog and extensions configured, no runtime jar
./run.sh wrong-jar        # runtime jars built for another Spark minor version or Scala version
./run.sh no-extensions    # no spark.sql.extensions, then a misspelled one
./run.sh typo             # a catalog name the session does not have, a misspelled class, no type,
                          # a misspelled spark.sql.defaultCatalog
./run.sh session-catalog  # spark_catalog without and with SparkSessionCatalog, and under another name
./run.sh defaults-file    # the working configuration read from conf/spark-<minor>/spark-defaults.conf
./run.sh down
```

`./run.sh all` runs every step from `working` to `defaults-file`. `LINE` picks the versions:

```bash
LINE=3.5 ./run.sh up && LINE=3.5 ./run.sh all && LINE=3.5 ./run.sh down   # default
LINE=3.3 ./run.sh up && LINE=3.3 ./run.sh all && LINE=3.3 ./run.sh down
LINE=4.0 ./run.sh up && LINE=4.0 ./run.sh all && LINE=4.0 ./run.sh down
```

## What the runs showed

Run on 2026-11-17 with the Iceberg REST catalog fixture 1.10.1 and MinIO RELEASE.2025-04-03T14-56-28Z. The three lines are Spark 3.3.3 (Scala 2.12.15, Java 11.0.20) with Iceberg 1.4.3, Spark 3.5.6 (Scala 2.12.18, Java 17.0.15) with Iceberg 1.12.0, and Spark 4.0.5 (Scala 2.13.16, Java 17.0.20.1) with Iceberg 1.12.0.

| Step | Spark 3.3.3, Iceberg 1.4.3 | Spark 3.5.6, Iceberg 1.12.0 | Spark 4.0.5, Iceberg 1.12.0 |
| --- | --- | --- | --- |
| `working` | Every statement ran | Every statement ran | Every statement ran |
| `no-jar`, query on the catalog | `Cannot find catalog plugin class for catalog 'demo': org.apache.iceberg.spark.SparkCatalog` | Same, with a period at the end | Same as 3.5.6 |
| `no-jar`, `format("iceberg")` and `USING iceberg` | `Failed to find data source: iceberg. Please find packages at` | `[DATA_SOURCE_NOT_FOUND] Failed to find the data source: iceberg. Please find packages at ...` | `[DATA_SOURCE_NOT_FOUND] Failed to find the data source: iceberg. Make sure the provider name is correct ...` |
| `no-jar`, extensions class missing | `WARN` only: `Cannot use org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions to configure session extensions.` | Same | Same |
| `wrong-jar`, Scala 2.13 jar on Scala 2.12 | `NoClassDefFoundError: scala/$less$colon$less`; `NoSuchMethodError` for `MERGE`, `UPDATE` and `DELETE` | `NoClassDefFoundError: scala/collection/SeqOps` on every statement | Not run (the 4.0 runtime is built for Scala 2.13 only) |
| `wrong-jar`, other Spark minor | 3.5 jar: `IncompatibleClassChangeError` (`OrderAwareCoalesce`), then `NoClassDefFoundError: org/apache/spark/sql/connector/catalog/SupportsDeleteV2` | 3.4 jar (1.11.0): reads, writes and `DELETE` ran; `MERGE` and `UPDATE` failed with `NoSuchMethodError` (`DataType$.canWrite`), `CALL` with `NoSuchMethodError` (`StructType.toAttributes()`) | 3.5 jar: `ExceptionInInitializerError` (`RewriteUpdateTableForRowLineage$`), `CALL`: `Could not deserialize ATN with version 3 (expected 4).` 4.1 jar: `NoSuchMethodError` (`ParserInterface.$init$`) on every statement |
| `no-extensions` | `MERGE INTO TABLE is not supported temporarily.` and `UPDATE TABLE is not supported temporarily.`; `DELETE` ran; `CALL`: `Syntax error at or near 'CALL'` | `MERGE`, `UPDATE` and `DELETE` ran; `CALL`: `[PARSE_SYNTAX_ERROR] Syntax error at or near 'CALL'.` | All four ran, `CALL` included |
| `typo`, `dmeo.db.events` | `spark_catalog requires a single-part namespace, but got [dmeo, db]` | `[REQUIRES_SINGLE_PART_NAMESPACE] ...` | Same as 3.5.6, with `SQLSTATE: 42K05` |
| `typo`, `CALL dmeo.system...` | `Cannot use catalog spark_catalog: not a ProcedureCatalog` | Same | `Catalog spark_catalog does not support procedures.` |
| `typo`, `spark.sql.defaultCatalog=dmeo` | `CatalogNotFoundException: Catalog 'dmeo' plugin class not found: spark.sql.catalog.dmeo is not defined` | Same | `[CATALOG_NOT_FOUND] The catalog ... not found. Consider to set the SQL config "spark.sql.catalog.dmeo" to a catalog plugin. SQLSTATE: 42P08` |
| `typo`, no `type` | Iceberg used a Hive catalog: `Failed to get table info from metastore db.events` (`TTransportException`) | Same | Same, `TTransportException: MaxMessageSize reached` |
| `session-catalog`, Iceberg table in the built-in catalog | `CREATE` ran; `INSERT`, `SELECT` and `DELETE`: `iceberg is not a valid Spark SQL Data Source.` | Same | `CREATE`: `Cannot open table: path is not set` |
| `session-catalog`, `SparkSessionCatalog` | Iceberg and Parquet tables both worked; `SHOW TABLES` listed only the Parquet table | Same | Same |
| `session-catalog`, `SparkSessionCatalog` named `demo` | `Delegated SessionCatalog is missing. Please make sure your are replacing Spark's default catalog, named 'spark_catalog'.` | Same | Same |
| `defaults-file` | Every statement ran | Every statement ran | Every statement ran |

## Files

- `docker-compose.yml`: MinIO, a one-shot `mc` container that creates the bucket, the Iceberg REST catalog fixture, and an idle Spark container. Memory limits add up to under 3 GB.
- `probe.py`: runs one named case in a Spark session and prints what each statement returned or raised, plus what the session loaded (Iceberg build, `spark.jars`, SQL parser class, the class path entry of `SparkCatalog`, `SHOW CATALOGS`).
- `conf/base/log4j2.properties`: warnings and errors only. `conf/spark-<minor>/spark-defaults.conf`: the working configuration for each line.
- `run.sh`: every step above.
- `logs/spark-<version>-iceberg-<version>/`: `<step>.txt` is what each statement returned or raised, `<step>.stderr.txt` is the Spark log with Ivy's resolution report.
