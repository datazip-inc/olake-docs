"""Snapshot expiry and orphan-file removal, and what each one leaves in storage, one part per Spark session.

run.sh starts it with spark-submit: spark-submit [options] /lab/maintenance.py <part>
The tables live in the REST catalog, so a later part sees what an earlier part wrote.

Storage is counted before and after each procedure call, by listing the table location through the
table's own FileIO (S3FileIO, so no Hadoop S3 file system is needed). run.sh also counts the same
objects with mc at the end of each part.
"""
import os
import sys
import time

KINDS = "array('open', 'click', 'close', 'view', 'buy', 'share')"


def show_error(e):
    from py4j.protocol import Py4JJavaError

    print(f"ERROR {type(e).__module__}.{type(e).__name__}")
    if isinstance(e, Py4JJavaError):
        t, depth = e.java_exception, 0
        while t is not None and depth < 5:
            print(("Caused by: " if depth else "") + t.toString()[:1500])
            t, depth = t.getCause(), depth + 1
        return
    for line in str(e).splitlines()[:8]:
        print(line[:1500])


def sql(spark, q, quiet=False):
    if not quiet:
        print(f"\n=== {q}")
    try:
        df = spark.sql(q)
        rows = df.collect()
    except Exception as e:  # noqa: BLE001 - the failure is the output
        if quiet:
            print(f"\n=== {q}")
        show_error(e)
        return None
    if not quiet:
        if df.columns:
            print("  " + " | ".join(df.columns))
        for r in rows[:30]:
            print("  " + " | ".join(str(v) for v in r))
        if len(rows) > 30:
            print(f"  ... {len(rows)} rows")
    return rows


def now(spark, minus=""):
    """The session clock as a timestamp literal. Procedure arguments take constants."""
    expr = f"current_timestamp() - INTERVAL {minus}" if minus else "current_timestamp()"
    return sql(spark, f"SELECT date_format({expr}, 'yyyy-MM-dd HH:mm:ss.SSS')", quiet=True)[0][0]


def create(spark, t, extra=""):
    sql(spark, f"DROP TABLE IF EXISTS demo.db.{t} PURGE", quiet=True)
    sql(spark, f"CREATE TABLE demo.db.{t} (id bigint, kind string, payload string) USING iceberg {extra}")


def append(spark, t, start, n, commits=1):
    """`commits` separate appends of n rows each, one data file per commit."""
    for i in range(commits):
        lo = start + i * n
        spark.range(lo, lo + n).selectExpr(
            "id",
            f"element_at({KINDS}, cast(id % 6 as int) + 1) AS kind",
            "sha2(cast(id as string), 256) AS payload",
        ).coalesce(1).writeTo(f"demo.db.{t}").append()
    print(f"\n--- {commits} append(s) of {n} rows to db.{t}")


def jtable(spark, t):
    return spark._jvm.org.apache.iceberg.spark.Spark3Util.loadIcebergTable(spark._jsparkSession, f"demo.db.{t}")


def storage(spark, t, label):
    """Every object under the table location, by kind, listed through the table's FileIO."""
    table = jtable(spark, t)
    it = table.io().listPrefix(table.location()).iterator()
    kinds = {"data files": [0, 0], "delete files": [0, 0], "metadata.json": [0, 0],
             "manifest lists": [0, 0], "manifests": [0, 0], "other": [0, 0]}
    while it.hasNext():
        f = it.next()
        loc, size = f.location(), f.size()
        name = loc.rsplit("/", 1)[-1]
        if "/data/" in loc:
            k = "delete files" if ("-deletes" in name or name.endswith(".puffin")) else "data files"
        elif name.endswith(".metadata.json"):
            k = "metadata.json"
        elif name.startswith("snap-"):
            k = "manifest lists"
        elif name.endswith(".avro"):
            k = "manifests"
        else:
            k = "other"
        kinds[k][0] += 1
        kinds[k][1] += size
    total = sum(v[0] for v in kinds.values()), sum(v[1] for v in kinds.values())
    parts = ", ".join(f"{k} {v[0]} ({v[1]:,} B)" for k, v in kinds.items() if v[0])
    print(f"\n--- storage of db.{t}, {label}: {total[0]} objects, {total[1]:,} bytes | {parts}")
    return total


def counts(spark, t):
    sql(spark, f"SELECT count(*) AS snapshots FROM demo.db.{t}.snapshots")
    sql(spark, f"SELECT count(*) AS data_files_in_current_snapshot FROM demo.db.{t}.files")
    sql(spark, f"SELECT count(*) AS data_files_in_any_snapshot FROM demo.db.{t}.all_data_files")


def call(spark, t, q):
    """A procedure call with the table's storage before and after it."""
    storage(spark, t, "before")
    rows = sql(spark, q)
    storage(spark, t, "after")
    return rows


def expire(spark, t, args=""):
    return call(spark, t, f"CALL demo.system.expire_snapshots(table => 'db.{t}'{args})")


# ---- expire_snapshots

def part_expire_appends(spark):
    """Ten appends, then expiry: every data file is still in the current snapshot."""
    create(spark, "appends")
    append(spark, "appends", 0, 20000, commits=10)
    counts(spark, "appends")
    expire(spark, "appends", f", older_than => TIMESTAMP '{now(spark)}', retain_last => 1")
    counts(spark, "appends")


def part_expire_properties(spark):
    """The defaults come from table properties: max snapshot age, then min snapshots to keep."""
    create(spark, "props")
    append(spark, "props", 0, 20000, commits=4)
    sql(spark, "DELETE FROM demo.db.props WHERE id % 2 = 0")
    counts(spark, "props")
    sql(spark, "SHOW TBLPROPERTIES demo.db.props")
    expire(spark, "props")
    sql(spark, "ALTER TABLE demo.db.props SET TBLPROPERTIES ('history.expire.max-snapshot-age-ms' = '1000', "
               "'history.expire.min-snapshots-to-keep' = '3')")
    time.sleep(2)
    expire(spark, "props")
    counts(spark, "props")
    sql(spark, "ALTER TABLE demo.db.props SET TBLPROPERTIES ('history.expire.min-snapshots-to-keep' = '1')")
    time.sleep(2)
    expire(spark, "props")
    counts(spark, "props")


def part_expire_retain_last(spark):
    """older_than now with retain_last: the newest snapshots stay, whatever their age."""
    create(spark, "retain")
    append(spark, "retain", 0, 20000, commits=4)
    sql(spark, "DELETE FROM demo.db.retain WHERE id % 2 = 0")
    sql(spark, "DELETE FROM demo.db.retain WHERE id % 3 = 0")
    counts(spark, "retain")
    expire(spark, "retain", f", older_than => TIMESTAMP '{now(spark)}', retain_last => 3")
    counts(spark, "retain")
    expire(spark, "retain", f", older_than => TIMESTAMP '{now(spark)}', retain_last => 1")
    counts(spark, "retain")


def part_expire_tag(spark):
    """A tag keeps its snapshot, and the snapshot keeps its files, until the tag is dropped."""
    create(spark, "tagged")
    append(spark, "tagged", 0, 20000, commits=3)
    if sql(spark, "ALTER TABLE demo.db.tagged CREATE TAG before_purge") is None:
        t = jtable(spark, "tagged")
        t.manageSnapshots().createTag("before_purge", t.currentSnapshot().snapshotId()).commit()
        print("--- tag before_purge created with the Java API: manageSnapshots().createTag(...)")
    sql(spark, "DELETE FROM demo.db.tagged WHERE true")
    sql(spark, "SELECT name, type, snapshot_id FROM demo.db.tagged.refs ORDER BY name")
    counts(spark, "tagged")
    expire(spark, "tagged", f", older_than => TIMESTAMP '{now(spark)}', retain_last => 1")
    counts(spark, "tagged")
    if sql(spark, "ALTER TABLE demo.db.tagged DROP TAG before_purge") is None:
        jtable(spark, "tagged").manageSnapshots().removeTag("before_purge").commit()
        print("--- tag before_purge dropped with the Java API: manageSnapshots().removeTag(...)")
    sql(spark, "SELECT name, type, snapshot_id FROM demo.db.tagged.refs ORDER BY name")
    expire(spark, "tagged", f", older_than => TIMESTAMP '{now(spark)}', retain_last => 1")
    counts(spark, "tagged")


def part_expire_deletes(spark):
    """DELETE with copy-on-write and with merge-on-read, then expiry, then compaction."""
    for t, mode in (("cow", "copy-on-write"), ("mor", "merge-on-read")):
        create(spark, t, f"TBLPROPERTIES ('format-version' = '2', 'write.delete.mode' = '{mode}')")
        append(spark, t, 0, 100000)
        storage(spark, t, "after the append")
        sql(spark, f"DELETE FROM demo.db.{t} WHERE id % 2 = 0")
        sql(spark, f"SELECT content, count(*) AS files, sum(file_size_in_bytes) AS bytes FROM demo.db.{t}.files GROUP BY content ORDER BY content")
        expire(spark, t, f", older_than => TIMESTAMP '{now(spark)}', retain_last => 1")
    sql(spark, "CALL demo.system.rewrite_data_files(table => 'db.mor', options => map('delete-file-threshold', '1'))")
    expire(spark, "mor", f", older_than => TIMESTAMP '{now(spark)}', retain_last => 1")
    sql(spark, "SELECT content, count(*) AS files, sum(file_size_in_bytes) AS bytes FROM demo.db.mor.files GROUP BY content ORDER BY content")


def part_gc_disabled(spark):
    """gc.enabled = false: both procedures refuse."""
    create(spark, "nogc")
    append(spark, "nogc", 0, 20000, commits=2)
    sql(spark, "DELETE FROM demo.db.nogc WHERE id % 2 = 0")
    sql(spark, "ALTER TABLE demo.db.nogc SET TBLPROPERTIES ('gc.enabled' = 'false')")
    expire(spark, "nogc", f", older_than => TIMESTAMP '{now(spark)}', retain_last => 1")
    sql(spark, "CALL demo.system.remove_orphan_files(table => 'db.nogc')")
    sql(spark, "ALTER TABLE demo.db.nogc SET TBLPROPERTIES ('gc.enabled' = 'true')")
    expire(spark, "nogc", f", older_than => TIMESTAMP '{now(spark)}', retain_last => 1")


# ---- metadata files

def metadata_log(spark, t):
    sql(spark, f"SELECT count(*) AS tracked_previous_metadata_files FROM demo.db.{t}.metadata_log_entries")


def part_metadata(spark):
    """One .metadata.json per commit. Expiry leaves them; two table properties trim them."""
    create(spark, "meta")
    append(spark, "meta", 0, 1000, commits=12)
    metadata_log(spark, "meta")
    expire(spark, "meta", f", older_than => TIMESTAMP '{now(spark)}', retain_last => 1")
    sql(spark, "ALTER TABLE demo.db.meta SET TBLPROPERTIES ('write.metadata.delete-after-commit.enabled' = 'true', "
               "'write.metadata.previous-versions-max' = '3')")
    storage(spark, "meta", "after setting the two properties")
    append(spark, "meta", 12000, 1000)
    storage(spark, "meta", "after one more commit")
    metadata_log(spark, "meta")

    create(spark, "meta_untracked")
    append(spark, "meta_untracked", 0, 1000, commits=12)
    sql(spark, "ALTER TABLE demo.db.meta_untracked SET TBLPROPERTIES ('write.metadata.previous-versions-max' = '3')")
    append(spark, "meta_untracked", 12000, 1000)
    storage(spark, "meta_untracked", "after previous-versions-max = 3 without delete-after-commit, and one more commit")
    metadata_log(spark, "meta_untracked")
    sql(spark, "ALTER TABLE demo.db.meta_untracked SET TBLPROPERTIES ('write.metadata.delete-after-commit.enabled' = 'true')")
    append(spark, "meta_untracked", 13000, 1000)
    storage(spark, "meta_untracked", "after delete-after-commit = true and one more commit")


# ---- remove_orphan_files

def plant_orphan(spark, t, name):
    """An object under the table's data directory that no snapshot references, as a failed write leaves.
    It is written through the table's FileIO, so it is a fresh object with the current time."""
    table = jtable(spark, t)
    path = f"{table.location()}/data/{name}"
    out = table.io().newOutputFile(path).create()
    out.write(bytearray(b"not referenced by any snapshot\n" * 32))
    out.close()
    print(f"\n--- wrote {path}, an object the table does not reference")


def part_orphans_setup(spark):
    create(spark, "orphans")
    append(spark, "orphans", 0, 20000, commits=3)
    storage(spark, "orphans", "after three appends")


def orphan_action(spark, t, older_ms, prefix=False, location=None, equal_schemes=None, mode=None):
    """The Java action behind remove_orphan_files, which takes any interval. It deletes what it finds."""
    jvm = spark._jvm
    desc = ["olderThan(now)"]
    if prefix:
        desc.append("usePrefixListing(true)")
    if location:
        desc.append(f"location({location!r})")
    if equal_schemes:
        desc.append(f"equalSchemes({equal_schemes})")
    if mode:
        desc.append(f"prefixMismatchMode({mode})")
    print(f"\n=== SparkActions.get(spark).deleteOrphanFiles(table).{'.'.join(desc)}.execute()")
    try:
        a = jvm.org.apache.iceberg.spark.actions.SparkActions.get(spark._jsparkSession) \
            .deleteOrphanFiles(jtable(spark, t)).olderThan(older_ms)
        if prefix:
            a = a.usePrefixListing(True)
        if location:
            a = a.location(location)
        if equal_schemes:
            m = jvm.java.util.HashMap()
            for k, v in equal_schemes.items():
                m.put(k, v)
            a = a.equalSchemes(m)
        if mode:
            a = a.prefixMismatchMode(getattr(jvm.org.apache.iceberg.actions, "DeleteOrphanFiles$PrefixMismatchMode").valueOf(mode))
        res = a.execute()
    except Exception as e:  # noqa: BLE001 - the failure is the output
        show_error(e)
        return None
    it = res.orphanFileLocations().iterator()
    found = []
    while it.hasNext():
        found.append(it.next())
    print(f"  orphan_file_location ({len(found)} deleted)")
    for f in found:
        print(f"  {f}")
    return found


def action(spark, t, **kw):
    storage(spark, t, "before")
    found = orphan_action(spark, t, int(time.time() * 1000), **kw)
    storage(spark, t, "after")
    return found


def part_orphans(spark):
    """The procedure with its default listing, with prefix listing, and the action, without Hadoop S3A."""
    t = "orphans"
    plant_orphan(spark, t, "orphan-a.parquet")
    sql(spark, f"SELECT count(*) AS data_files_in_any_snapshot FROM demo.db.{t}.all_data_files")
    call(spark, t, f"CALL demo.system.remove_orphan_files(table => 'db.{t}')")
    call(spark, t, f"CALL demo.system.remove_orphan_files(table => 'db.{t}', prefix_listing => true)")
    call(spark, t, f"CALL demo.system.remove_orphan_files(table => 'db.{t}', prefix_listing => true, "
                   f"older_than => TIMESTAMP '{now(spark, '1 HOUR')}')")
    action(spark, t, prefix=True)


def part_orphans_s3a(spark):
    """The same table with the Hadoop S3A file system registered for s3:// (and, for one check, minio://)."""
    t = "orphans"
    plant_orphan(spark, t, "orphan-b.parquet")
    call(spark, t, f"CALL demo.system.remove_orphan_files(table => 'db.{t}', dry_run => true)")
    call(spark, t, f"CALL demo.system.remove_orphan_files(table => 'db.{t}', dry_run => true, "
                   f"older_than => TIMESTAMP '{now(spark, '1 HOUR')}')")
    action(spark, t)
    plant_orphan(spark, t, "orphan-c.parquet")
    action(spark, t, location="s3a://warehouse/db/orphans")
    plant_orphan(spark, t, "orphan-d.parquet")
    action(spark, t, location="minio://warehouse/db/orphans")
    action(spark, t, location="minio://warehouse/db/orphans", equal_schemes={"minio": "s3"})
    plant_orphan(spark, t, "orphan-e.parquet")
    action(spark, t, location="minio://warehouse/db/orphans", mode="IGNORE")
    # The error message above names a mode 'NONE'. The documented modes are ERROR, IGNORE and DELETE.
    orphan_action(spark, t, int(time.time() * 1000), location="minio://warehouse/db/orphans", mode="NONE")


def part_orphans_args(spark):
    """Whether the procedure itself takes the prefix arguments. dry_run and the default interval delete nothing."""
    t = "orphans"
    sql(spark, f"CALL demo.system.remove_orphan_files(table => 'db.{t}', dry_run => true, "
               f"equal_schemes => map('minio', 's3'))")
    sql(spark, f"CALL demo.system.remove_orphan_files(table => 'db.{t}', dry_run => true, "
               f"prefix_mismatch_mode => 'IGNORE')")
    sql(spark, f"CALL demo.system.remove_orphan_files(table => 'db.{t}', dry_run => true, "
               f"prefix_mismatch_mode => 'NONE')")


def part_metadata_orphans(spark):
    """The untracked .metadata.json files of meta_untracked are orphans to the action."""
    t = "meta_untracked"
    action(spark, t, prefix=os.environ.get("PREFIX_LISTING") == "1")


PARTS = {
    "expire-appends": part_expire_appends,
    "expire-properties": part_expire_properties,
    "expire-retain-last": part_expire_retain_last,
    "expire-tag": part_expire_tag,
    "expire-deletes": part_expire_deletes,
    "gc-disabled": part_gc_disabled,
    "metadata": part_metadata,
    "orphans-setup": part_orphans_setup,
    "orphans": part_orphans,
    "orphans-s3a": part_orphans_s3a,
    "orphans-args": part_orphans_args,
    "metadata-orphans": part_metadata_orphans,
}


def main():
    from pyspark.sql import SparkSession

    part = sys.argv[1]
    spark = SparkSession.builder.appName(f"maintenance-{part}").getOrCreate()
    print(f"# part: {part}; Spark {spark.version}; "
          f"{spark._jvm.org.apache.iceberg.IcebergBuild.fullVersion()}")
    sql(spark, "CREATE NAMESPACE IF NOT EXISTS demo.db", quiet=True)
    PARTS[part](spark)
    spark.stop()


if __name__ == "__main__":
    main()
