"""Iceberg delete files in Spark: write each delete format, then read every table of the lab.

run.sh starts it with spark-submit: spark-submit [options] /lab/deletes.py <case> [<arg>]
  write <prefix>   the tables of one Spark version, prefix s35, s40 or s33 (see tables.txt)
  errors           format version downgrades, merge-on-read on a v1 table, and a position delete file
                   committed to a v3 table
  fix              rewrite_data_files on the equality delete tables, rewrite_position_delete_files on
                   Trino's v2 table and on the table moved from v2 to v3
  copy-v2          CREATE TABLE ... AS SELECT: a format version 2 copy of the v3 table s35_v3_dv
  read <label> [<table> ...]
                   read every table in tables.txt, or the tables given, and compare its rows with the
                   expected rows

Every table gets the same changes: ids 1 to 5 and 6 to 10 in two inserts, a delete of ids 3 and 8,
an update of id 5, and a merge that updates id 10 and inserts id 11. Spark SQL writes position
deletes or deletion vectors; the equality deletes are written with the Iceberg Java API, the way
streaming writers commit an upsert: an equality delete on id, plus the new rows, in one RowDelta.
"""
import sys
import time

EXPECTED = [(1, "r1"), (2, "r2"), (4, "r4"), (5, "u5"), (6, "r6"), (7, "r7"), (9, "r9"), (10, "m10"), (11, "m11")]
MOR = "'write.delete.mode' = 'merge-on-read', 'write.update.mode' = 'merge-on-read', 'write.merge.mode' = 'merge-on-read'"
COW = MOR.replace("merge-on-read", "copy-on-write")
CHANGES = [
    "DELETE FROM demo.db.{t} WHERE id IN (3, 8)",
    "UPDATE demo.db.{t} SET v = 'u5' WHERE id = 5",
    "MERGE INTO demo.db.{t} t USING (SELECT * FROM VALUES (10, 'm10'), (11, 'm11') AS s(id, v)) s ON t.id = s.id "
    "WHEN MATCHED THEN UPDATE SET v = s.v WHEN NOT MATCHED THEN INSERT (id, v) VALUES (s.id, s.v)",
]
# The same three changes as equality deletes on id: (ids deleted, rows added in the same commit).
EQ_CHANGES = [([3, 8], []), ([5], [(5, "u5")]), ([10, 11], [(10, "m10"), (11, "m11")])]


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


def first_line(e):
    from py4j.protocol import Py4JJavaError

    if isinstance(e, Py4JJavaError):
        t = e.java_exception
        while t.getCause() is not None and t.getCause() != t:
            t = t.getCause()
        return t.toString().splitlines()[0][:300]
    return (str(e).splitlines() or [type(e).__name__])[0][:300]


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
    return True


def q(spark, statement):
    def run():
        df = spark.sql(statement)
        return df.columns, df.collect()
    return attempt(statement, run)


def iceberg(spark):
    return spark._jvm.org.apache.iceberg.IcebergBuild.version()


def jtable(spark, name):
    return spark._jvm.org.apache.iceberg.spark.Spark3Util.loadIcebergTable(spark._jsparkSession, f"demo.db.{name}")


def summary(spark, name):
    """The data and delete counters in the summary of the table's last snapshot."""
    t = jtable(spark, name)
    t.refresh()
    s = t.currentSnapshot()
    m = s.summary()
    keys = [k for k in sorted(m.keySet()) if "delete" in k or "dvs" in k or k in ("added-data-files", "total-data-files")]
    print(f"  snapshot {s.sequenceNumber()}, {s.operation()}: " + ", ".join(f"{k}={m.get(k)}" for k in keys))


def delete_files(spark, name):
    q(spark, f"SELECT content, file_format, count(*) AS files, sum(record_count) AS records "
             f"FROM demo.db.{name}.delete_files GROUP BY content, file_format ORDER BY content, file_format")


def create(spark, name, props):
    try:
        spark.sql(f"DROP TABLE IF EXISTS demo.db.{name} PURGE")
    except Exception as e:  # noqa: BLE001
        print(f"\n(could not drop demo.db.{name}: {first_line(e)})")
    with_props = f" TBLPROPERTIES ({props})" if props else ""
    q(spark, f"CREATE TABLE demo.db.{name} (id int, v string) USING iceberg{with_props}")
    q(spark, f"INSERT INTO demo.db.{name} VALUES (1, 'r1'), (2, 'r2'), (3, 'r3'), (4, 'r4'), (5, 'r5')")
    q(spark, f"INSERT INTO demo.db.{name} VALUES (6, 'r6'), (7, 'r7'), (8, 'r8'), (9, 'r9'), (10, 'r10')")


def sql_changes(spark, name, before_merge=None):
    for i, stmt in enumerate(CHANGES):
        if i == 2 and before_merge:
            before_merge()
        if q(spark, stmt.format(t=name)):
            summary(spark, name)
    delete_files(spark, name)


def writer_factory(spark, t):
    """A generic file writer factory with equality deletes on id, for the table's Iceberg version."""
    jvm = spark._jvm
    gw = spark.sparkContext._gateway
    schema = t.schema()
    parquet = jvm.org.apache.iceberg.FileFormat.PARQUET
    eq_ids = gw.new_array(jvm.int, 1)
    eq_ids[0] = schema.findField("id").fieldId()
    cols = jvm.java.util.ArrayList()
    cols.add("id")
    del_schema = schema.select(cols)
    files = jvm.org.apache.iceberg.io.OutputFileFactory.builderFor(t, 1, int(time.time() * 1000)).format(parquet).build()
    if iceberg(spark).startswith("1.4."):
        f = jvm.org.apache.iceberg.data.GenericAppenderFactory(schema, t.spec(), eq_ids, del_schema, None)
        return {
            "eq": lambda: f.newEqDeleteWriter(files.newOutputFile(), parquet, None),
            "data": lambda: f.newDataWriter(files.newOutputFile(), parquet, None),
            "pos": lambda: f.newPosDeleteWriter(files.newOutputFile(), parquet, None),
            "del_schema": del_schema,
        }
    f = getattr(jvm.org.apache.iceberg.data, "GenericFileWriterFactory$Builder")(t) \
        .dataFileFormat(parquet).deleteFileFormat(parquet) \
        .equalityFieldIds(eq_ids).equalityDeleteRowSchema(del_schema).build()
    return {
        "eq": lambda: f.newEqualityDeleteWriter(files.newOutputFile(), t.spec(), None),
        "data": lambda: f.newDataWriter(files.newOutputFile(), t.spec(), None),
        "pos": lambda: f.newPositionDeleteWriter(files.newOutputFile(), t.spec(), None),
        "del_schema": del_schema,
    }


def eq_commit(spark, name, ids, rows):
    """One RowDelta: an equality delete file with the ids, and a data file with the new rows."""
    jvm = spark._jvm
    t = jtable(spark, name)
    t.refresh()
    w = writer_factory(spark, t)
    deletes = w["eq"]()
    key = jvm.org.apache.iceberg.data.GenericRecord.create(w["del_schema"])
    for i in ids:
        r = key.copy()
        r.setField("id", i)
        deletes.write(r)
    deletes.close()
    delta = t.newRowDelta().addDeletes(deletes.toDeleteFile())
    if rows:
        data = w["data"]()
        row = jvm.org.apache.iceberg.data.GenericRecord.create(t.schema())
        for i, v in rows:
            r = row.copy()
            r.setField("id", i)
            r.setField("v", v)
            data.write(r)
        data.close()
        delta = delta.addRows(data.toDataFile())
    delta.commit()


def eq_changes(spark, name):
    for ids, rows in EQ_CHANGES:
        label = f"equality delete on id {ids}" + (f", new rows {rows}" if rows else "") + ", one RowDelta (Iceberg Java API)"
        if attempt(label, lambda ids=ids, rows=rows: eq_commit(spark, name, ids, rows)):
            summary(spark, name)
    delete_files(spark, name)


def format_version(spark, name):
    t = jtable(spark, name)
    t.refresh()
    return t.operations().current().formatVersion()


# ---- cases

def case_write(spark, prefix):
    v3 = not iceberg(spark).startswith("1.4.")
    spark.sql("CREATE NAMESPACE IF NOT EXISTS demo.db")
    tables = [
        (f"{prefix}_v2_pos", "format version 2, merge-on-read", f"'format-version' = '2', {MOR}", sql_changes),
        (f"{prefix}_v2_eq", "format version 2, equality deletes", "'format-version' = '2'", eq_changes),
    ]
    if v3:
        tables += [
            (f"{prefix}_v3_dv", "format version 3, merge-on-read", f"'format-version' = '3', {MOR}", sql_changes),
            (f"{prefix}_v3_eq", "format version 3, equality deletes", "'format-version' = '3'", eq_changes),
        ]
    if prefix == "s35":
        tables += [
            (f"{prefix}_v2_cow", "format version 2, copy-on-write", f"'format-version' = '2', {COW}", sql_changes),
            (f"{prefix}_v3_cow", "format version 3, copy-on-write", f"'format-version' = '3', {COW}", sql_changes),
        ]
    for name, what, props, changes in tables:
        print(f"\n######## demo.db.{name}: {what}")
        create(spark, name, props)
        changes(spark, name)

    if prefix == "s35":
        name = f"{prefix}_v2to3"
        print(f"\n######## demo.db.{name}: format version 2, merge-on-read, moved to 3 before the merge")
        create(spark, name, f"'format-version' = '2', {MOR}")

        def upgrade():
            delete_files(spark, name)
            q(spark, f"ALTER TABLE demo.db.{name} SET TBLPROPERTIES ('format-version' = '3')")
            attempt(f"format version of demo.db.{name}", lambda: (None, [[format_version(spark, name)]]))
        sql_changes(spark, name, before_merge=upgrade)
        q(spark, f"SELECT content, file_format, record_count, file_path FROM demo.db.{name}.delete_files ORDER BY content, file_path")

    name = f"{prefix}_default"
    print(f"\n######## demo.db.{name}: CREATE TABLE without format-version")
    create(spark, name, "")
    attempt(f"format version of demo.db.{name}", lambda: (None, [[format_version(spark, name)]]))
    q(spark, f"SHOW TBLPROPERTIES demo.db.{name}")
    spark.sql(f"DROP TABLE demo.db.{name} PURGE")


def case_errors(spark):
    print("\n######## format version changes")
    q(spark, "ALTER TABLE demo.db.s35_v3_dv SET TBLPROPERTIES ('format-version' = '2')")
    q(spark, "ALTER TABLE demo.db.s35_v2_pos SET TBLPROPERTIES ('format-version' = '1')")

    name = "s35_v1_mor"
    print(f"\n######## demo.db.{name}: format version 1, merge-on-read")
    create(spark, name, f"'format-version' = '1', {MOR}")
    if q(spark, CHANGES[0].format(t=name)):
        summary(spark, name)
    delete_files(spark, name)
    spark.sql(f"DROP TABLE demo.db.{name} PURGE")

    name = "s35_v3_posfile"
    print(f"\n######## demo.db.{name}: a Parquet position delete file committed to a format version 3 table")
    create(spark, name, "'format-version' = '3'")
    path = spark.sql(f"SELECT file_path FROM demo.db.{name}.files ORDER BY file_path LIMIT 1").collect()[0][0]

    def run():
        jvm = spark._jvm
        t = jtable(spark, name)
        t.refresh()
        writer = writer_factory(spark, t)["pos"]()
        d = jvm.org.apache.iceberg.deletes.PositionDelete.create()
        # set(CharSequence path, long pos) through reflection: Py4J passes 0 as an Integer, which
        # Method.invoke widens to long.
        setter = [m for m in d.getClass().getMethods()
                  if m.getName() == "set" and [str(c.getName()) for c in m.getParameterTypes()] == ["java.lang.CharSequence", "long"]][0]
        args = spark.sparkContext._gateway.new_array(jvm.java.lang.Object, 2)
        args[0] = path
        args[1] = 0
        setter.invoke(d, args)
        writer.write(d)
        writer.close()
        t.newRowDelta().addDeletes(writer.toDeleteFile()).commit()
    attempt(f"position delete of row 0 in {path.rsplit('/', 1)[-1]}, one RowDelta (Iceberg Java API)", run)
    q(spark, f"SELECT count(*) FROM demo.db.{name}")
    spark.sql(f"DROP TABLE demo.db.{name} PURGE")


def case_fix(spark):
    print("\n######## equality deletes: rewrite the data files they apply to")
    for name, opts in [
        ("s35_v2_eq", "map('delete-file-threshold', '1')"),
        ("s40_v2_eq", "map('delete-file-threshold', '1', 'remove-dangling-deletes', 'true')"),
        ("s35_v3_eq", "map('delete-file-threshold', '1', 'remove-dangling-deletes', 'true')"),
    ]:
        q(spark, f"CALL demo.system.rewrite_data_files(table => 'db.{name}', options => {opts})")
        summary(spark, name)
        delete_files(spark, name)

    print("\n######## position delete files: Trino's on a v2 table, and the v2 ones left in a table moved to v3")
    for name in ("t_v2_pos", "s35_v2to3"):
        q(spark, f"CALL demo.system.rewrite_position_delete_files(table => 'db.{name}', options => map('rewrite-all', 'true'))")
        summary(spark, name)
        delete_files(spark, name)


def case_copy_v2(spark):
    print("\n######## a format version 2 copy of a v3 table, for readers that cannot open v3")
    name = "s35_v3_dv_v2copy"
    try:
        spark.sql(f"DROP TABLE IF EXISTS demo.db.{name} PURGE")
    except Exception as e:  # noqa: BLE001
        print(f"\n(could not drop demo.db.{name}: {first_line(e)})")
    q(spark, f"CREATE TABLE demo.db.{name} USING iceberg TBLPROPERTIES ('format-version' = '2') AS SELECT * FROM demo.db.s35_v3_dv")
    attempt(f"format version of demo.db.{name}", lambda: (None, [[format_version(spark, name)]]))
    delete_files(spark, name)
    q(spark, f"SELECT count(*) FROM demo.db.{name}")


def read_one(spark, name):
    try:
        print(f"format version {format_version(spark, name)}")
    except Exception as e:  # noqa: BLE001
        show_error(e)
        return "ERROR " + first_line(e)
    try:
        inv = spark.sql(f"SELECT content, file_format, count(*), sum(record_count) FROM demo.db.{name}.delete_files "
                        "GROUP BY content, file_format ORDER BY content, file_format").collect()
        print("delete files: " + ("; ".join(f"content {r[0]} {r[1]}: {r[2]} files, {r[3]} records" for r in inv) or "none"))
    except Exception as e:  # noqa: BLE001
        print("delete files: not listed")
        show_error(e)
    try:
        rows = [(r[0], r[1]) for r in spark.sql(f"SELECT id, v FROM demo.db.{name} ORDER BY id").collect()]
        print("rows: " + ",".join(f"{i}:{v}" for i, v in rows))
        n = spark.sql(f"SELECT count(*) FROM demo.db.{name}").collect()[0][0]
        print(f"count(*): {n}")
    except Exception as e:  # noqa: BLE001
        show_error(e)
        return "ERROR " + first_line(e)
    if rows == EXPECTED and n == len(EXPECTED):
        return f"correct, {n} rows"
    missing = [r for r in EXPECTED if r not in rows]
    extra = [r for r in rows if r not in EXPECTED]
    return (f"WRONG, {len(rows)} rows, count(*) {n}" + (f", missing {missing}" if missing else "")
            + (f", extra {extra}" if extra else ""))


def case_read(spark, label, only=None):
    names = only or [line.strip() for line in open("/lab/tables.txt") if line.strip() and not line.startswith("#")]
    results = []
    for name in names:
        print(f"\n=== read demo.db.{name}")
        results.append((name, read_one(spark, name)))
    print("\n######## results")
    for name, verdict in results:
        print(f"RESULT {label} {name}: {verdict}")


def main():
    from pyspark.sql import SparkSession

    spark = SparkSession.builder.appName("iceberg-deletes").getOrCreate()
    print(f"######## Spark {spark.version}, Iceberg {spark._jvm.org.apache.iceberg.IcebergBuild.fullVersion()}")
    case, arg = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else "")
    {"write": lambda: case_write(spark, arg), "errors": lambda: case_errors(spark),
     "fix": lambda: case_fix(spark), "copy-v2": lambda: case_copy_v2(spark),
     "read": lambda: case_read(spark, arg, sys.argv[3:])}[case]()
    spark.stop()


if __name__ == "__main__":
    main()
