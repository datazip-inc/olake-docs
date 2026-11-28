"""Partition specs and partition evolution in Spark, one case per argument.

run.sh starts it with spark-submit: spark-submit [options] /lab/partitions.py <case> [<case> ...]
The session has two Iceberg catalogs: demo, the REST catalog fixture on MinIO, and local, a Hadoop
catalog on the Spark container's own disk, which commits without a catalog server. Every case drops
and creates its own tables, except old-read and clean-specs, which use the tables of the dropcol case.
"""
import json
import sys
import time
import urllib.request


def show_error(e):
    from py4j.protocol import Py4JJavaError

    print(f"ERROR {type(e).__module__}.{type(e).__name__}")
    if isinstance(e, Py4JJavaError):
        t, depth = e.java_exception, 0
        while t is not None and depth < 4:
            print(("Caused by: " if depth else "") + t.toString()[:1200])
            t, depth = t.getCause(), depth + 1
        return
    for line in str(e).splitlines()[:14]:
        print(line[:1200])
    for getter in ("getCondition", "getErrorClass"):
        f = getattr(e, getter, None)
        if f:
            try:
                print(f"error class: {f()}")
            except Exception:  # noqa: BLE001
                pass
            break


def attempt(label, fn):
    print(f"\n=== {label}")
    try:
        out = fn()
    except Exception as e:  # noqa: BLE001 - the failure is the output
        show_error(e)
        return False
    print("OK")
    if out:
        cols, rows = out
        if cols:
            print("  " + " | ".join(cols))
        for r in rows[:30]:
            print("  " + " | ".join(str(v) for v in r))
        if len(rows) > 30:
            print(f"  ... {len(rows)} rows")
    return True


def q(spark, statement):
    def run():
        df = spark.sql(statement)
        return df.columns, df.collect()
    return attempt(statement, run)


def table(spark, name, ddl, extra="", cat="demo"):
    try:
        spark.sql(f"DROP TABLE IF EXISTS {cat}.db.{name} PURGE")
    except Exception as e:  # noqa: BLE001 - a table left unreadable by an earlier run
        print(f"\n(could not drop {cat}.db.{name} before the case: {str(e).splitlines()[0][:200]})")
    return q(spark, f"CREATE TABLE {cat}.db.{name} ({ddl}) USING iceberg {extra}".rstrip())


def jtable(spark, name, cat="demo"):
    return spark._jvm.org.apache.iceberg.spark.Spark3Util.loadIcebergTable(spark._jsparkSession, f"{cat}.db.{name}")


def specs(spark, name, cat="demo"):
    """Every partition spec the table metadata holds, and the current schema with its field IDs."""
    def run():
        t = jtable(spark, name, cat)
        t.refresh()
        meta = t.operations().current()
        rows = [[f"format version {meta.formatVersion()}, current spec {t.spec().specId()}"]]
        for sid in sorted(int(s) for s in t.specs().keySet()):
            fields = ", ".join(str(f) for f in t.specs().get(sid).fields())
            rows.append([f"spec {sid}: [{fields}]"])
        cols = ", ".join(str(c) for c in t.schema().columns())
        rows.append([f"schema {t.schema().schemaId()}: [{cols}]"])
        return None, rows
    attempt(f"partition specs and schema of {cat}.db.{name}", run)


def metadata_file(spark, name, cat="demo"):
    try:
        loc = jtable(spark, name, cat).operations().current().metadataFileLocation()
    except Exception as e:  # noqa: BLE001
        show_error(e)
        return None
    print(f"\n--- current metadata file of {cat}.db.{name}: {loc}")
    return loc


def scan_metrics(spark):
    """Metrics of the Iceberg scan in the last SQL execution, from the Spark UI's REST API."""
    sc = spark.sparkContext
    url = f"{sc.uiWebUrl}/api/v1/applications/{sc.applicationId}/sql?details=true&planDescription=false&length=100000"
    wanted = ("number of output rows", "number of result data files", "number of skipped data files",
              "number of scanned data manifests", "number of skipped data manifests")
    for _ in range(20):
        try:
            with urllib.request.urlopen(url) as r:
                execs = json.load(r)
        except Exception as e:  # noqa: BLE001
            return {"metrics error": str(e)[:200]}
        if execs:
            last = max(execs, key=lambda x: x["id"])
            if last.get("status") == "COMPLETED":
                out = {}
                for node in last.get("nodes", []):
                    if node.get("nodeName", "").startswith("BatchScan"):
                        for m in node.get("metrics", []):
                            if m.get("name") in wanted:
                                out[m["name"]] = m["value"]
                if out:
                    return out
        time.sleep(0.5)
    return {}


def scan(spark, statement):
    """A query, the filters Spark pushed to the Iceberg scan, and how many files and rows it read."""
    print(f"\n=== {statement}")
    try:
        df = spark.sql(statement)
        rows = df.collect()
        plan = df._jdf.queryExecution().executedPlan().toString()
    except Exception as e:  # noqa: BLE001
        show_error(e)
        return
    print("OK")
    for r in rows:
        print("  " + " | ".join(str(v) for v in r))
    for line in plan.splitlines():
        if "BatchScan" in line:
            print("  scan: " + line.strip().lstrip("+-: ")[:500])
    m = scan_metrics(spark)
    print("  read: " + (", ".join(f"{k} {v}" for k, v in m.items()) if m else "no scan metrics found"))


def insert_days(spark, name, first_day, days, start_id):
    """1,000 rows for each of the categories a, b and c on each of `days` days from `first_day`, one INSERT."""
    n = days * 3000
    q(spark, f"""INSERT INTO demo.db.{name}
SELECT {start_id} + id AS id,
       timestamp_seconds(unix_seconds(TIMESTAMP '{first_day} 00:00:00') + (id DIV 3000) * 86400 + (id % 3000) * 20) AS ts,
       element_at(array('a', 'b', 'c'), CAST(id % 3 AS INT) + 1) AS category,
       CAST(id % 100 AS DOUBLE) AS amount
FROM range({n})""")


# ---- cases

def case_noext(spark):
    """Run in a session without spark.sql.extensions: the partition DDL is parsed by the extensions."""
    table(spark, "noext_t", "id bigint, ts timestamp, category string", "PARTITIONED BY (days(ts), bucket(4, id))")
    q(spark, "INSERT INTO demo.db.noext_t VALUES (1, TIMESTAMP '2026-11-01 10:00:00', 'a'), "
             "(2, TIMESTAMP '2026-11-02 11:00:00', 'b')")
    for stmt in [
        "ALTER TABLE demo.db.noext_t ADD PARTITION FIELD category",
        "ALTER TABLE demo.db.noext_t DROP PARTITION FIELD ts_day",
        "ALTER TABLE demo.db.noext_t REPLACE PARTITION FIELD ts_day WITH hours(ts)",
    ]:
        q(spark, stmt)
    specs(spark, "noext_t")
    q(spark, "SELECT * FROM demo.db.noext_t ORDER BY id")


def case_create(spark):
    """Partition specs that CREATE TABLE refuses, and one on a field inside a struct."""
    for name, ddl, part in [
        ("bad_bucket", "id bigint, amount double", "bucket(16, amount)"),
        ("bad_hours", "id bigint, d date", "hours(d)"),
        ("bad_truncate", "id bigint, ts timestamp", "truncate(10, ts)"),
        ("bad_redundant", "id bigint, ts timestamp", "days(ts), hours(ts)"),
        ("bad_struct", "id bigint, point struct<x: double, y: double>", "point"),
        ("bad_column", "id bigint, ts timestamp", "days(created)"),
        ("nested_p", "id bigint, point struct<x: double, y: double>", "point.x"),
    ]:
        table(spark, name, ddl, f"PARTITIONED BY ({part})")
    q(spark, "INSERT INTO demo.db.nested_p VALUES (1, named_struct('x', 1.0D, 'y', 2.0D)), "
             "(2, named_struct('x', 3.0D, 'y', 4.0D))")
    specs(spark, "nested_p")
    q(spark, "SELECT * FROM demo.db.nested_p ORDER BY id")


def case_evolve(spark):
    """ADD, DROP and REPLACE PARTITION FIELD: what each refuses, and the change that works."""
    table(spark, "evo_t", "id bigint, ts timestamp, category string, amount double", "PARTITIONED BY (days(ts))")
    q(spark, "INSERT INTO demo.db.evo_t VALUES (1, TIMESTAMP '2026-11-01 10:00:00', 'a', 1.0)")
    for stmt in [
        "ALTER TABLE demo.db.evo_t ADD PARTITION FIELD hours(ts)",
        "ALTER TABLE demo.db.evo_t ADD PARTITION FIELD months(ts)",
        "ALTER TABLE demo.db.evo_t ADD PARTITION FIELD days(ts)",
        "ALTER TABLE demo.db.evo_t ADD PARTITION FIELD days(ts) AS day_of_ts",
        "ALTER TABLE demo.db.evo_t ADD PARTITION FIELD category AS ts_day",
        "ALTER TABLE demo.db.evo_t ADD PARTITION FIELD bucket(16, amount)",
        "ALTER TABLE demo.db.evo_t DROP PARTITION FIELD hours(ts)",
        "ALTER TABLE demo.db.evo_t DROP PARTITION FIELD ts_hour",
        "ALTER TABLE demo.db.evo_t REPLACE PARTITION FIELD ts_day WITH hours(ts)",
    ]:
        q(spark, stmt)
    specs(spark, "evo_t")
    q(spark, "INSERT INTO demo.db.evo_t VALUES (2, TIMESTAMP '2026-11-01 11:00:00', 'b', 2.0)")
    q(spark, "SELECT spec_id, partition, record_count FROM demo.db.evo_t.files ORDER BY spec_id")
    q(spark, "SELECT * FROM demo.db.evo_t ORDER BY id")

    # The default name of the new field is taken by a column.
    table(spark, "name_t", "id bigint, ts timestamp, ts_day date")
    q(spark, "ALTER TABLE demo.db.name_t ADD PARTITION FIELD days(ts)")
    q(spark, "ALTER TABLE demo.db.name_t ADD PARTITION FIELD days(ts) AS ts_day_part")
    specs(spark, "name_t")


def split_table(spark, name):
    """Four days written under days(ts), then ADD PARTITION FIELD category, then two more days."""
    table(spark, name, "id bigint, ts timestamp, category string, amount double", "PARTITIONED BY (days(ts))")
    insert_days(spark, name, "2026-11-01", 4, 0)
    q(spark, f"ALTER TABLE demo.db.{name} ADD PARTITION FIELD category")
    insert_days(spark, name, "2026-11-05", 2, 12000)
    specs(spark, name)


def case_prune(spark):
    """Files written before ADD PARTITION FIELD keep the old spec; which filters prune them."""
    split_table(spark, "split_t")  # left as it is, for the PyIceberg and Trino steps
    split_table(spark, "prune_t")
    q(spark, "SELECT spec_id, partition, record_count FROM demo.db.prune_t.files "
             "ORDER BY spec_id, partition.ts_day, partition.category")
    for stmt in [
        "SELECT count(*) AS n, sum(amount) AS total FROM demo.db.prune_t "
        "WHERE ts >= TIMESTAMP '2026-11-02 00:00:00' AND ts < TIMESTAMP '2026-11-03 00:00:00'",
        "SELECT count(*) AS n, sum(amount) AS total FROM demo.db.prune_t WHERE CAST(ts AS DATE) = DATE '2026-11-02'",
        "SELECT count(*) AS n, sum(amount) AS total FROM demo.db.prune_t "
        "WHERE date_format(ts, 'yyyy-MM-dd') = '2026-11-02'",
        "SELECT count(*) AS n, sum(amount) AS total FROM demo.db.prune_t "
        "WHERE demo.system.days(ts) = demo.system.days(TIMESTAMP '2026-11-02 00:00:00')",
        "SELECT count(*) AS n, sum(amount) AS total FROM demo.db.prune_t WHERE ts_day = DATE '2026-11-02'",
        "SELECT count(*) AS n, sum(amount) AS total FROM demo.db.prune_t WHERE category = 'b'",
    ]:
        scan(spark, stmt)
    q(spark, "CALL demo.system.rewrite_data_files(table => 'db.prune_t')")
    q(spark, "SELECT spec_id, count(*) AS files, sum(record_count) AS records FROM demo.db.prune_t.files "
             "GROUP BY spec_id ORDER BY spec_id")
    q(spark, "CALL demo.system.rewrite_data_files(table => 'db.prune_t', options => map('rewrite-all', 'true'))")
    q(spark, "SELECT spec_id, count(*) AS files, sum(record_count) AS records FROM demo.db.prune_t.files "
             "GROUP BY spec_id ORDER BY spec_id")
    scan(spark, "SELECT count(*) AS n, sum(amount) AS total FROM demo.db.prune_t WHERE category = 'b'")


def dropcol_current(spark, cat):
    """DROP COLUMN on the source column of a field in the current spec."""
    table(spark, "dc_cur", "id bigint, category string, v string", "PARTITIONED BY (category)", cat=cat)
    q(spark, f"INSERT INTO {cat}.db.dc_cur VALUES (1, 'a', 'x')")
    q(spark, f"ALTER TABLE {cat}.db.dc_cur DROP COLUMN category")
    q(spark, f"SELECT * FROM {cat}.db.dc_cur ORDER BY id")


def dropcol_old_spec(spark, cat, version):
    """DROP PARTITION FIELD, then DROP COLUMN of its source, on format version 1 or 2, then read and repair."""
    t = f"{cat}.db.dc_v{version}"
    if cat == "demo":
        try:
            spark.sql(f"DROP TABLE IF EXISTS demo.db.dc_v{version}_restored")  # no PURGE: it shares files
        except Exception:  # noqa: BLE001
            pass
    table(spark, f"dc_v{version}", "id bigint, category string, v string", "PARTITIONED BY (category) "
          f"TBLPROPERTIES ('format-version' = '{version}')", cat=cat)
    q(spark, f"INSERT INTO {t} VALUES (1, 'a', 'x'), (2, 'b', 'y')")
    q(spark, f"ALTER TABLE {t} DROP PARTITION FIELD category")
    q(spark, f"INSERT INTO {t} VALUES (3, 'c', 'z')")
    specs(spark, f"dc_v{version}", cat)
    before = metadata_file(spark, f"dc_v{version}", cat)
    q(spark, f"ALTER TABLE {t} DROP COLUMN category")
    specs(spark, f"dc_v{version}", cat)
    q(spark, f"SELECT * FROM {t} ORDER BY id")
    q(spark, f"SELECT spec_id, partition, record_count FROM {t}.files ORDER BY spec_id")
    q(spark, f"SELECT * FROM {t}.partitions")
    q(spark, f"INSERT INTO {t} VALUES (4, 'w')")
    q(spark, f"ALTER TABLE {t} ADD COLUMN category string")
    q(spark, f"SELECT * FROM {t} ORDER BY id")
    q(spark, f"CALL {cat}.system.rewrite_manifests(table => 'db.dc_v{version}')")
    specs(spark, f"dc_v{version}", cat)
    if cat == "demo" and before:
        # A second table on the metadata file from before DROP COLUMN. It shares every data file with
        # dc_v<version>; the clean-specs step later expires snapshots of dc_v<version>.
        q(spark, f"CALL demo.system.register_table(table => 'db.dc_v{version}_restored', metadata_file => '{before}')")
        q(spark, f"SELECT * FROM demo.db.dc_v{version}_restored ORDER BY id")


def dropcol_repair(spark):
    """The same DROP COLUMN, then the table dropped from the catalog without PURGE and the metadata file from
    before DROP COLUMN registered under the same name."""
    t = "demo.db.dc_fix"
    table(spark, "dc_fix", "id bigint, category string, v string", "PARTITIONED BY (category)")
    q(spark, f"INSERT INTO {t} VALUES (1, 'a', 'x'), (2, 'b', 'y')")
    q(spark, f"ALTER TABLE {t} DROP PARTITION FIELD category")
    q(spark, f"INSERT INTO {t} VALUES (3, 'c', 'z')")
    before = metadata_file(spark, "dc_fix")
    q(spark, f"ALTER TABLE {t} DROP COLUMN category")
    q(spark, f"INSERT INTO {t} VALUES (4, 'w')")
    q(spark, f"SELECT timestamp, file, latest_snapshot_id FROM {t}.metadata_log_entries ORDER BY timestamp")
    q(spark, f"DROP TABLE {t}")  # no PURGE: the catalog entry goes, the files stay
    q(spark, f"CALL demo.system.register_table(table => 'db.dc_fix', metadata_file => '{before}')")
    q(spark, f"SELECT * FROM {t} ORDER BY id")
    specs(spark, "dc_fix")


def case_dropcol(spark):
    for cat in ("demo", "local"):
        print(f"\n######## catalog: {cat}")
        dropcol_current(spark, cat)
        for version in ("2", "1"):
            dropcol_old_spec(spark, cat, version)
    print("\n######## repair")
    dropcol_repair(spark)


def case_old_read(spark):
    """Run with an older Spark and Iceberg: read the tables the newer one changed."""
    for name in ("dc_v2", "dc_v1", "dc_v2_restored", "dc_fix", "evo_t", "nested_p"):
        q(spark, f"SELECT * FROM demo.db.{name} ORDER BY id")
        specs(spark, name)
    q(spark, "SELECT count(*) AS n FROM demo.db.prune_t WHERE category = 'b'")


def now(spark):
    return spark.sql("SELECT date_format(current_timestamp(), 'yyyy-MM-dd HH:mm:ss.SSS')").collect()[0][0]


def manifests(spark, name):
    q(spark, "SELECT partition_spec_id, added_data_files_count, existing_data_files_count, deleted_data_files_count "
             f"FROM demo.db.{name}.manifests ORDER BY partition_spec_id")


def expire_unused(spark, name):
    q(spark, f"CALL demo.system.expire_snapshots(table => 'db.{name}', older_than => TIMESTAMP '{now(spark)}', "
             "retain_last => 1, clean_expired_metadata => true)")
    specs(spark, name)


def clean(spark, name, next_id):
    """Rewrite every file into the current spec, then expire with clean_expired_metadata, once right after the
    rewrite and once after one more commit."""
    specs(spark, name)
    q(spark, f"CALL demo.system.rewrite_data_files(table => 'db.{name}', options => map('rewrite-all', 'true'))")
    manifests(spark, name)
    expire_unused(spark, name)
    q(spark, f"INSERT INTO demo.db.{name} VALUES ({next_id}, 'v')")
    manifests(spark, name)
    expire_unused(spark, name)
    q(spark, f"SELECT * FROM demo.db.{name} ORDER BY id")


def case_clean_specs(spark):
    for name in ("dc_v2", "dc_v1"):
        clean(spark, name, 5)


def case_clean_v1(spark):
    """Format version 1 keeps the dropped field as void in the current spec: move to version 2 and drop it."""
    specs(spark, "dc_v1")
    q(spark, "ALTER TABLE demo.db.dc_v1 SET TBLPROPERTIES ('format-version' = '2')")
    q(spark, "ALTER TABLE demo.db.dc_v1 DROP PARTITION FIELD category")
    specs(spark, "dc_v1")
    clean(spark, "dc_v1", 6)


def case_replace(spark):
    """saveAsTable in overwrite mode with another partition column, as in iceberg#4510, on format 2 and 1, then
    the same data with writeTo().createOrReplace()."""
    for version in ("2", "1"):
        name = f"rep_v{version}"
        try:
            spark.sql(f"DROP TABLE IF EXISTS demo.db.{name} PURGE")
        except Exception:  # noqa: BLE001
            pass
        first = spark.createDataFrame([("1991-04-01",)], "some_date string")
        attempt(f"DataFrame(some_date).writeTo('demo.db.{name}').partitionedBy('some_date')"
                f".tableProperty('format-version', '{version}').create()",
                lambda: first.writeTo(f"demo.db.{name}").partitionedBy(first["some_date"])
                .tableProperty("format-version", version).create())
        specs(spark, name)
        second = spark.createDataFrame([("1991-04-02",)], "some_date_2 string")
        attempt(f"DataFrame(some_date_2).write.format('iceberg').mode('overwrite').partitionBy('some_date_2')"
                f".saveAsTable('demo.db.{name}')",
                lambda: second.write.format("iceberg").mode("overwrite").partitionBy("some_date_2")
                .saveAsTable(f"demo.db.{name}"))
        specs(spark, name)
        q(spark, f"SELECT * FROM demo.db.{name}")
        attempt(f"DataFrame(some_date_2).writeTo('demo.db.{name}').partitionedBy('some_date_2').createOrReplace()",
                lambda: second.writeTo(f"demo.db.{name}").partitionedBy(second["some_date_2"]).createOrReplace())
        specs(spark, name)
        q(spark, f"SELECT * FROM demo.db.{name}")


def case_replace_fix(spark):
    """Two ways round the failed overwrite of the replace case: move a format version 1 table to version 2
    first, or drop the table and create it again with the new partitioning."""
    second = spark.createDataFrame([("1991-04-02",)], "some_date_2 string")
    for version in ("1", "2"):
        name = f"rep_up_v{version}"
        spark.sql(f"DROP TABLE IF EXISTS demo.db.{name} PURGE")
        first = spark.createDataFrame([("1991-04-01",)], "some_date string")
        attempt(f"DataFrame(some_date).writeTo('demo.db.{name}').partitionedBy('some_date')"
                f".tableProperty('format-version', '{version}').create()",
                lambda: first.writeTo(f"demo.db.{name}").partitionedBy(first["some_date"])
                .tableProperty("format-version", version).create())
        if version == "1":
            q(spark, f"ALTER TABLE demo.db.{name} SET TBLPROPERTIES ('format-version' = '2')")
        attempt(f"DataFrame(some_date_2).write.format('iceberg').mode('overwrite').partitionBy('some_date_2')"
                f".saveAsTable('demo.db.{name}')",
                lambda: second.write.format("iceberg").mode("overwrite").partitionBy("some_date_2")
                .saveAsTable(f"demo.db.{name}"))
        specs(spark, name)
        q(spark, f"SELECT * FROM demo.db.{name}")
    spark.sql("DROP TABLE IF EXISTS demo.db.rep_new PURGE")
    first = spark.createDataFrame([("1991-04-01",)], "some_date string")
    attempt("DataFrame(some_date).writeTo('demo.db.rep_new').partitionedBy('some_date')"
            ".tableProperty('format-version', '1').create()",
            lambda: first.writeTo("demo.db.rep_new").partitionedBy(first["some_date"])
            .tableProperty("format-version", "1").create())
    q(spark, "DROP TABLE demo.db.rep_new PURGE")
    attempt("DataFrame(some_date_2).writeTo('demo.db.rep_new').partitionedBy('some_date_2').create()",
            lambda: second.writeTo("demo.db.rep_new").partitionedBy(second["some_date_2"]).create())
    specs(spark, "rep_new")
    q(spark, "SELECT * FROM demo.db.rep_new")


CASES = {
    "noext": case_noext,
    "create": case_create,
    "evolve": case_evolve,
    "prune": case_prune,
    "dropcol": case_dropcol,
    "replace": case_replace,
    "replace-fix": case_replace_fix,
    "old-read": case_old_read,
    "clean-specs": case_clean_specs,
    "clean-v1": case_clean_v1,
}


def main():
    from pyspark.sql import SparkSession

    spark = SparkSession.builder.appName("partition-evolution").getOrCreate()
    print(f"# Spark {spark.version}; {spark._jvm.org.apache.iceberg.IcebergBuild.fullVersion()}; "
          f"spark.sql.extensions={spark.conf.get('spark.sql.extensions', '(not set)')}")
    spark.sql("CREATE NAMESPACE IF NOT EXISTS demo.db")
    spark.sql("CREATE NAMESPACE IF NOT EXISTS local.db")
    for name in sys.argv[1:]:
        print(f"\n######## case: {name}")
        CASES[name](spark)
    spark.stop()


if __name__ == "__main__":
    main()
