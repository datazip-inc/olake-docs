"""Runs one named case in a Spark session and prints what each statement returned or raised.

run.sh starts it with spark-submit, so the session gets exactly the options of the step being
reproduced. Usage: spark-submit [options] /lab/probe.py <case>
"""
import sys

# Each case is a list of steps: ("sql", statement), ("read", format, name), ("table", name)
# or ("info",).
SETUP = [
    ("sql", "CREATE NAMESPACE IF NOT EXISTS demo.db"),
    ("sql", "DROP TABLE IF EXISTS demo.db.events"),
    ("sql", "CREATE TABLE demo.db.events (id bigint, kind string) USING iceberg"),
    ("sql", "INSERT INTO demo.db.events VALUES (1, 'open'), (2, 'click'), (3, 'close')"),
]
ROW_LEVEL = [
    ("sql", "MERGE INTO demo.db.events t USING (SELECT 2 AS id, 'merged' AS kind) s "
            "ON t.id = s.id WHEN MATCHED THEN UPDATE SET t.kind = s.kind"),
    ("sql", "UPDATE demo.db.events SET kind = 'updated' WHERE id = 3"),
    ("sql", "DELETE FROM demo.db.events WHERE kind = 'open'"),
    ("sql", "CALL demo.system.rewrite_data_files(table => 'db.events')"),
    ("sql", "SELECT * FROM demo.db.events ORDER BY id"),
]
READS = [
    ("sql", "SELECT count(*) FROM demo.db.events"),
    ("read", "iceberg", "demo.db.events"),
]
CASES = {
    # The full configuration: creates the table, runs the statements that need the extensions.
    "working": [("info",)] + SETUP + ROW_LEVEL + READS + [("sql", "SHOW CATALOGS")],
    # Only reads, for sessions that are expected to fail before they touch the catalog.
    "reads": READS + [("sql", "CREATE TABLE default.t_session (id bigint) USING iceberg")],
    # What a session with a runtime jar of the wrong build does with the same statements.
    "wrong-jar": [("info",)] + SETUP + ROW_LEVEL,
    # Row-level statements and a procedure call, for a session without the extensions.
    "no-extensions": [("info",)] + SETUP + ROW_LEVEL,
    # A catalog name that is not configured in this session.
    "typo": [
        ("sql", "SELECT count(*) FROM dmeo.db.events"),
        ("read", "iceberg", "dmeo.db.events"),
        ("sql", "USE dmeo"),
        ("sql", "CALL dmeo.system.rewrite_data_files(table => 'db.events')"),
        ("sql", "SELECT count(*) FROM demo.db.events"),
    ],
    # The built-in session catalog without SparkSessionCatalog: an "iceberg" table there.
    "session-builtin": [
        ("sql", "CREATE TABLE default.t_session (id bigint) USING iceberg"),
        ("sql", "INSERT INTO default.t_session VALUES (1)"),
        ("sql", "SELECT * FROM default.t_session"),
        ("sql", "DELETE FROM default.t_session WHERE id = 1"),
        ("read", "iceberg", "demo.db.events"),
        ("read", "iceberg", "db.events"),
    ],
    # spark.sql.defaultCatalog set to a name that is not configured.
    "default-catalog": [
        ("sql", "SELECT count(*) FROM db.events"),
        ("sql", "SHOW NAMESPACES"),
    ],
    # spark_catalog replaced by SparkSessionCatalog over the REST catalog.
    "session-iceberg": [
        ("info",),
        ("sql", "CREATE NAMESPACE IF NOT EXISTS db"),
        ("sql", "SHOW NAMESPACES"),
        ("sql", "SELECT count(*) FROM db.events"),
        ("sql", "DROP TABLE IF EXISTS db.t_iceberg"),
        ("sql", "CREATE TABLE db.t_iceberg (id bigint) USING iceberg"),
        ("sql", "INSERT INTO db.t_iceberg VALUES (1)"),
        ("sql", "DROP TABLE IF EXISTS db.t_parquet"),
        ("sql", "CREATE TABLE db.t_parquet (id bigint) USING parquet"),
        ("sql", "INSERT INTO db.t_parquet VALUES (1)"),
        ("sql", "SHOW TABLES IN db"),
        ("sql", "SELECT * FROM db.t_iceberg.snapshots"),
        ("sql", "SELECT * FROM db.t_parquet.snapshots"),
        ("sql", "CALL spark_catalog.system.rewrite_data_files(table => 'db.t_iceberg')"),
    ],
    # SparkSessionCatalog registered under another name.
    "session-misnamed": [
        ("sql", "SELECT count(*) FROM demo.db.events"),
        ("sql", "SELECT count(*) FROM demo.db.no_such_table"),
        ("sql", "SHOW TABLES IN demo.db"),
        ("sql", "CREATE TABLE demo.db.t_parquet (id bigint) USING parquet"),
    ],
}


def show_error(e):
    from py4j.protocol import Py4JJavaError

    cls = type(e)
    print(f"ERROR {cls.__module__}.{cls.__name__}")
    if isinstance(e, Py4JJavaError):
        t, depth = e.java_exception, 0
        while t is not None and depth < 6:
            print(("Caused by: " if depth else "") + t.toString())
            for frame in list(t.getStackTrace())[:2]:
                print("\tat " + frame.toString())
            t, depth = t.getCause(), depth + 1
        return
    lines = str(e).splitlines()
    for line in lines[:12]:
        print(line)
    for getter in ("getCondition", "getErrorClass"):
        f = getattr(e, getter, None)
        if f:
            try:
                print(f"error class: {f()}")
            except Exception:
                pass
            break


def info(spark):
    jvm = spark._jvm
    sc = spark.sparkContext
    print(f"Spark {spark.version}, Scala {jvm.scala.util.Properties.versionNumberString()}, "
          f"Java {jvm.java.lang.System.getProperty('java.version')}")
    try:
        print(f"Iceberg build: {jvm.org.apache.iceberg.IcebergBuild.fullVersion()}")
    except Exception as e:
        print(f"Iceberg build: not loaded ({type(e).__name__})")
    for key in ("spark.jars", "spark.sql.extensions", "spark.sql.catalog.demo",
                "spark.sql.catalog.demo.type", "spark.sql.catalog.spark_catalog",
                "spark.sql.catalog.spark_catalog.type"):
        print(f"{key} = {sc.getConf().get(key, '<not set>')}")
    print(f"SQL parser: {spark._jsparkSession.sessionState().sqlParser().getClass().getName()}")
    try:
        loader = jvm.java.lang.Thread.currentThread().getContextClassLoader()
        c = jvm.java.lang.Class.forName("org.apache.iceberg.spark.SparkCatalog", False, loader)
        print(f"SparkCatalog loaded from: {c.getProtectionDomain().getCodeSource().getLocation().toString()}")
    except Exception as e:
        print(f"SparkCatalog loaded from: not found ({type(e).__name__})")
    try:
        print("SHOW CATALOGS: " + ", ".join(r[0] for r in spark.sql("SHOW CATALOGS").collect()))
    except Exception as e:
        print(f"SHOW CATALOGS: {str(e).splitlines()[0][:160]}")


def run(spark, step):
    kind = step[0]
    label = {"sql": lambda s: s[1], "read": lambda s: f'spark.read.format("{s[1]}").load("{s[2]}")',
             "table": lambda s: f'spark.table("{s[1]}")', "info": lambda s: "what the session loaded"}[kind](step)
    print(f"\n=== {label}")
    try:
        if kind == "info":
            info(spark)
            return
        if kind == "sql":
            df = spark.sql(step[1])
        elif kind == "read":
            df = spark.read.format(step[1]).load(step[2])
        else:
            df = spark.table(step[1])
        rows = df.limit(20).collect()
        print(f"OK, {len(rows)} row(s)")
        for r in rows:
            print("  " + str(tuple(r)))
    except Exception as e:  # noqa: BLE001 - every failure is the output
        show_error(e)


def main():
    case = sys.argv[1]
    from pyspark.sql import SparkSession

    print(f"# case: {case}")
    try:
        spark = SparkSession.builder.appName(f"probe-{case}").getOrCreate()
    except Exception as e:  # noqa: BLE001
        print("\n=== session start")
        show_error(e)
        return
    for step in CASES[case]:
        run(spark, step)
    spark.stop()


if __name__ == "__main__":
    main()
