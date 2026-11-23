"""Schema changes and writes whose schema does not match the table, in one Spark session.

run.sh starts it with spark-submit: spark-submit [options] /lab/schema.py <case> [<case> ...]
Every case drops and creates its own tables, so a case can be run again on its own.
"""
import sys


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
        return
    if out is None:
        print("OK")
        return
    cols, rows = out
    print("OK")
    if cols:
        print("  " + " | ".join(cols))
    for r in rows[:20]:
        print("  " + " | ".join(str(v) for v in r))


def q(spark, statement):
    def run():
        df = spark.sql(statement)
        return df.columns, df.collect()
    attempt(statement, run)


def table(spark, name, ddl, extra=""):
    spark.sql(f"DROP TABLE IF EXISTS demo.db.{name} PURGE")
    q(spark, f"CREATE TABLE demo.db.{name} ({ddl}) USING iceberg {extra}")


def df_write(spark, label, rows, schema, target, how="append", options=None):
    def run():
        df = spark.createDataFrame(rows, schema)
        if how == "insertInto":
            df.write.insertInto(f"demo.db.{target}")
        else:
            w = df.writeTo(f"demo.db.{target}")
            for k, v in (options or {}).items():
                w = w.option(k, v)
            w.append()
    attempt(f"{label}: DataFrame({schema}) -> {how} {target}" + (f" {options}" if options else ""), run)


def case_types(spark):
    table(spark, "types_t", "id int, amount float, price decimal(10,2), name string, created date")
    q(spark, "INSERT INTO demo.db.types_t VALUES (1, 1.5, 9.99, 'a', DATE '2026-11-17')")
    for stmt in [
        "ALTER TABLE demo.db.types_t ALTER COLUMN id TYPE bigint",
        "ALTER TABLE demo.db.types_t ALTER COLUMN amount TYPE double",
        "ALTER TABLE demo.db.types_t ALTER COLUMN price TYPE decimal(12,2)",
        "ALTER TABLE demo.db.types_t ALTER COLUMN id TYPE int",
        "ALTER TABLE demo.db.types_t ALTER COLUMN name TYPE int",
        "ALTER TABLE demo.db.types_t ALTER COLUMN id TYPE string",
        "ALTER TABLE demo.db.types_t ALTER COLUMN price TYPE decimal(12,4)",
        "ALTER TABLE demo.db.types_t ALTER COLUMN created TYPE timestamp",
    ]:
        q(spark, stmt)
    q(spark, "DESCRIBE TABLE demo.db.types_t")
    q(spark, "SELECT * FROM demo.db.types_t")
    if spark.version >= "3.4":
        # The v3 promotion date -> timestamp (without time zone, TIMESTAMP_NTZ in Spark).
        for version in ("2", "3"):
            table(spark, f"dates_v{version}", "id bigint, created date",
                  f"TBLPROPERTIES ('format-version' = '{version}')")
            q(spark, f"ALTER TABLE demo.db.dates_v{version} ALTER COLUMN created TYPE timestamp_ntz")


def case_missing(spark):
    table(spark, "miss_t", "id bigint, name string")
    q(spark, "ALTER TABLE demo.db.miss_t ADD COLUMN email string")
    df_write(spark, "column missing from the DataFrame", [(1, "a")], "id bigint, name string", "miss_t")
    q(spark, "INSERT INTO demo.db.miss_t VALUES (2, 'b')")
    q(spark, "INSERT INTO demo.db.miss_t (id, name) VALUES (3, 'c')")
    q(spark, "ALTER TABLE demo.db.miss_t SET TBLPROPERTIES ('write.spark.accept-any-schema' = 'true')")
    df_write(spark, "same, accept-any-schema", [(4, "d")], "id bigint, name string", "miss_t")
    df_write(spark, "same, accept-any-schema and mergeSchema", [(5, "e")], "id bigint, name string",
             "miss_t", options={"mergeSchema": "true"})
    q(spark, "SELECT * FROM demo.db.miss_t ORDER BY id")


def case_extra(spark):
    table(spark, "extra_t", "id bigint, name string")
    rows, schema = [(1, "a", "555-0100")], "id bigint, name string, phone string"
    df_write(spark, "extra column", rows, schema, "extra_t")
    df_write(spark, "extra column, mergeSchema only", rows, schema, "extra_t", options={"mergeSchema": "true"})
    q(spark, "ALTER TABLE demo.db.extra_t SET TBLPROPERTIES ('write.spark.accept-any-schema' = 'true')")
    df_write(spark, "extra column, accept-any-schema only", rows, schema, "extra_t")
    df_write(spark, "extra column, accept-any-schema and mergeSchema", rows, schema, "extra_t",
             options={"mergeSchema": "true"})
    q(spark, "DESCRIBE TABLE demo.db.extra_t")
    q(spark, "INSERT INTO demo.db.extra_t VALUES (2, 'b', '555-0101', 'extra')")
    # Same number of values as columns, on a table with write.spark.accept-any-schema=true.
    q(spark, "INSERT INTO demo.db.extra_t VALUES (3, 'c', '555-0102')")
    q(spark, "INSERT INTO demo.db.extra_t SELECT 4 AS id, 'd' AS name, '555-0103' AS phone")
    q(spark, "SELECT * FROM demo.db.extra_t ORDER BY id")


def case_rename(spark):
    table(spark, "ren_t", "id bigint, first_name string, last_name string")
    q(spark, "INSERT INTO demo.db.ren_t VALUES (1, 'Ada', 'Lovelace')")
    q(spark, "ALTER TABLE demo.db.ren_t RENAME COLUMN last_name TO surname")
    q(spark, "SELECT * FROM demo.db.ren_t")
    df_write(spark, "old column name", [(2, "Alan", "Turing")], "id bigint, first_name string, last_name string",
             "ren_t")
    q(spark, "ALTER TABLE demo.db.ren_t ALTER COLUMN surname AFTER id")
    q(spark, "DESCRIBE TABLE demo.db.ren_t")
    schema = "id bigint, first_name string, surname string"
    df_write(spark, "by position after the reorder", [(3, "Grace", "Hopper")], schema, "ren_t", how="insertInto")
    df_write(spark, "by name after the reorder", [(4, "Edsger", "Dijkstra")], schema, "ren_t")
    q(spark, "INSERT INTO demo.db.ren_t SELECT 5, 'Barbara', 'Liskov'")
    q(spark, "INSERT INTO demo.db.ren_t (id, first_name, surname) SELECT 6, 'Donald', 'Knuth'")
    q(spark, "SELECT * FROM demo.db.ren_t ORDER BY id")


def case_nested(spark):
    table(spark, "nest_t", "id bigint, point struct<x: double, y: double>")
    q(spark, "INSERT INTO demo.db.nest_t VALUES (1, named_struct('x', 1.0D, 'y', 2.0D))")
    q(spark, "ALTER TABLE demo.db.nest_t ADD COLUMN point.z double")
    df_write(spark, "struct without the new field", [(2, (1.0, 2.0))], "id bigint, point struct<x: double, y: double>",
             "nest_t")
    df_write(spark, "struct fields in another order", [(3, (2.0, 1.0, 0.5))],
             "id bigint, point struct<y: double, x: double, z: double>", "nest_t")
    q(spark, "ALTER TABLE demo.db.nest_t RENAME COLUMN point.x TO lon")
    q(spark, "ALTER TABLE demo.db.nest_t ALTER COLUMN point.y TYPE float")
    q(spark, "DESCRIBE TABLE demo.db.nest_t")
    q(spark, "SELECT * FROM demo.db.nest_t ORDER BY id")


def case_required(spark):
    table(spark, "req_t", "id bigint NOT NULL, name string")
    df_write(spark, "nullable id, no null values", [(1, "a")], "id bigint, name string", "req_t")
    df_write(spark, "nullable id, one null value", [(None, "b")], "id bigint, name string", "req_t")
    spark.conf.set("spark.sql.iceberg.check-nullability", "false")
    df_write(spark, "nullable id, no null values, check-nullability=false", [(3, "c")], "id bigint, name string",
             "req_t")
    df_write(spark, "nullable id, one null value, check-nullability=false", [(None, "d")], "id bigint, name string",
             "req_t")
    spark.conf.set("spark.sql.iceberg.check-nullability", "true")
    df_write(spark, "id declared NOT NULL in the DataFrame schema", [(5, "f")], "id bigint NOT NULL, name string",
             "req_t")
    # Iceberg's own write check, which runs when the table accepts any schema.
    q(spark, "ALTER TABLE demo.db.req_t SET TBLPROPERTIES ('write.spark.accept-any-schema' = 'true')")
    df_write(spark, "nullable id, accept-any-schema", [(6, "g")], "id bigint, name string", "req_t")
    spark.conf.set("spark.sql.iceberg.check-nullability", "false")
    df_write(spark, "nullable id, accept-any-schema, check-nullability=false", [(7, "h")], "id bigint, name string",
             "req_t")
    spark.conf.set("spark.sql.iceberg.check-nullability", "true")
    q(spark, "ALTER TABLE demo.db.req_t UNSET TBLPROPERTIES ('write.spark.accept-any-schema')")
    q(spark, "INSERT INTO demo.db.req_t VALUES (NULL, 'e')")
    q(spark, "ALTER TABLE demo.db.req_t ALTER COLUMN name SET NOT NULL")
    q(spark, "ALTER TABLE demo.db.req_t ADD COLUMN code string NOT NULL")
    q(spark, "ALTER TABLE demo.db.req_t ALTER COLUMN id DROP NOT NULL")
    q(spark, "SELECT * FROM demo.db.req_t ORDER BY id")


def case_cast(spark):
    table(spark, "cast_t", "id int, amount double, label string")
    df_write(spark, "bigint into int", [(1, 1.0, "a")], "id bigint, amount double, label string", "cast_t")
    df_write(spark, "string into int", [("2", 2.0, "b")], "id string, amount double, label string", "cast_t")
    df_write(spark, "float into double", [(3, 3.0, "c")], "id int, amount float, label string", "cast_t")
    df_write(spark, "int into string", [(4, 4.0, 5)], "id int, amount double, label int", "cast_t")
    q(spark, "INSERT INTO demo.db.cast_t VALUES ('x', 5.0, 'e')")
    q(spark, "INSERT INTO demo.db.cast_t VALUES (CAST(6 AS BIGINT), 6.0, 'f')")
    q(spark, "SELECT * FROM demo.db.cast_t ORDER BY id")


def case_case(spark):
    table(spark, "case_t", "id bigint, name string")
    q(spark, "INSERT INTO demo.db.case_t VALUES (1, 'a')")
    df_write(spark, "upper-case DataFrame columns", [(2, "b")], "ID bigint, Name string", "case_t")
    spark.conf.set("spark.sql.caseSensitive", "true")
    df_write(spark, "same, spark.sql.caseSensitive=true", [(3, "c")], "ID bigint, Name string", "case_t")
    spark.conf.set("spark.sql.caseSensitive", "false")
    q(spark, "ALTER TABLE demo.db.case_t ADD COLUMN ID int")
    spark.conf.set("spark.sql.caseSensitive", "true")
    q(spark, "ALTER TABLE demo.db.case_t ADD COLUMN ID int")
    q(spark, "SELECT * FROM demo.db.case_t ORDER BY id")
    spark.conf.set("spark.sql.caseSensitive", "false")
    q(spark, "SELECT * FROM demo.db.case_t")
    q(spark, "SELECT id FROM demo.db.case_t")
    q(spark, "SELECT name FROM demo.db.case_t WHERE name = 'a'")
    q(spark, "ALTER TABLE demo.db.case_t ADD COLUMN extra string")


def case_case_fix(spark):
    """The same pair of columns on another table, then one of them renamed while case matters."""
    table(spark, "case_fix_t", "id bigint, name string")
    q(spark, "INSERT INTO demo.db.case_fix_t VALUES (1, 'a')")
    spark.conf.set("spark.sql.caseSensitive", "true")
    q(spark, "ALTER TABLE demo.db.case_fix_t ADD COLUMN ID int")
    q(spark, "ALTER TABLE demo.db.case_fix_t RENAME COLUMN ID TO id_int")
    spark.conf.set("spark.sql.caseSensitive", "false")
    q(spark, "SELECT * FROM demo.db.case_fix_t")
    q(spark, "SELECT id FROM demo.db.case_fix_t")


CASES = {
    "types": case_types,
    "missing": case_missing,
    "extra": case_extra,
    "rename": case_rename,
    "nested": case_nested,
    "required": case_required,
    "cast": case_cast,
    "case": case_case,
    "case-fix": case_case_fix,
}


def main():
    from pyspark.sql import SparkSession

    spark = SparkSession.builder.appName("schema-evolution").getOrCreate()
    print(f"# Spark {spark.version}; {spark._jvm.org.apache.iceberg.IcebergBuild.fullVersion()}")
    spark.sql("CREATE NAMESPACE IF NOT EXISTS demo.db")
    for name in sys.argv[1:]:
        print(f"\n######## case: {name}")
        CASES[name](spark)
    spark.stop()


if __name__ == "__main__":
    main()
