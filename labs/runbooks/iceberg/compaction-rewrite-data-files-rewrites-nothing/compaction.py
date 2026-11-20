"""Small files, rewrite_data_files and what it leaves behind, one part per Spark session.

run.sh starts it with spark-submit: spark-submit [options] /lab/compaction.py <part>
The tables live in the REST catalog, so a later part sees what an earlier part wrote.
"""
import sys
import threading
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
    return rows


def create(spark, t, cols="id bigint, kind string, payload string", extra=""):
    sql(spark, f"DROP TABLE IF EXISTS demo.db.{t} PURGE", quiet=True)
    sql(spark, f"CREATE TABLE demo.db.{t} ({cols}) USING iceberg {extra}")


def append(spark, t, start, n, commits=1, partition_col="kind"):
    """`commits` separate appends of n rows each; one file per commit (per partition)."""
    for i in range(commits):
        lo = start + i * n
        df = spark.range(lo, lo + n).selectExpr(
            "id",
            f"element_at({KINDS}, cast(id % 6 as int) + 1) AS {partition_col}"
            if partition_col == "kind" else f"concat('p', cast(id % 8 as string)) AS {partition_col}",
            "sha2(cast(id as string), 256) AS payload",
        )
        df.coalesce(1).writeTo(f"demo.db.{t}").append()
    print(f"\n--- {commits} append(s) of {n} rows to db.{t}")


def report(spark, t, snapshots=3):
    sql(spark, f"SELECT content, count(*) AS files, sum(file_size_in_bytes) AS bytes, "
               f"round(avg(file_size_in_bytes)) AS avg_bytes FROM demo.db.{t}.files "
               f"GROUP BY content ORDER BY content")
    sql(spark, f"SELECT count(*) AS manifests FROM demo.db.{t}.manifests")
    sql(spark, f"SELECT count(*) AS snapshots FROM demo.db.{t}.snapshots")
    if snapshots:
        sql(spark, f"SELECT snapshot_id, operation, summary['added-data-files'] AS added_data_files, "
                   f"summary['deleted-data-files'] AS deleted_data_files, "
                   f"summary['total-data-files'] AS total_data_files, "
                   f"summary['total-delete-files'] AS total_delete_files "
                   f"FROM demo.db.{t}.snapshots ORDER BY committed_at DESC LIMIT {snapshots}")


def rewrite(spark, t, args=""):
    return sql(spark, f"CALL demo.system.rewrite_data_files(table => 'db.{t}'{args})")


def part_many_create(spark):
    """Thirty small commits: thirty files, thirty snapshots."""
    sql(spark, "CREATE NAMESPACE IF NOT EXISTS demo.db", quiet=True)
    create(spark, "many_commits")
    append(spark, "many_commits", 0, 1000, commits=30)
    report(spark, "many_commits")


def part_many_compact(spark):
    rewrite(spark, "many_commits")
    report(spark, "many_commits")
    sql(spark, "SELECT count(*) AS data_files_in_any_snapshot FROM demo.db.many_commits.all_data_files")


def part_many_cleanup(spark):
    sql(spark, "CALL demo.system.rewrite_manifests('db.many_commits')")
    sql(spark, "SELECT count(*) AS manifests FROM demo.db.many_commits.manifests")
    # The default older_than is five days ago: on a new table this expires nothing.
    sql(spark, "CALL demo.system.expire_snapshots(table => 'db.many_commits')")
    # older_than takes a constant, so read the clock first.
    now = sql(spark, "SELECT date_format(current_timestamp(), 'yyyy-MM-dd HH:mm:ss.SSS')", quiet=True)[0][0]
    sql(spark, f"CALL demo.system.expire_snapshots(table => 'db.many_commits', "
               f"older_than => TIMESTAMP '{now}', retain_last => 1)")
    report(spark, "many_commits", snapshots=1)
    sql(spark, "SELECT count(*) AS data_files_in_any_snapshot FROM demo.db.many_commits.all_data_files")


def part_thresholds(spark):
    # Four files in one group: under min-input-files (5).
    create(spark, "four_files")
    append(spark, "four_files", 0, 1000, commits=4)
    rewrite(spark, "four_files")
    append(spark, "four_files", 4000, 1000)
    rewrite(spark, "four_files")

    # Twenty-four files, but four in each of six partitions: every group is under 5.
    create(spark, "by_kind", extra="PARTITIONED BY (kind)")
    append(spark, "by_kind", 0, 1200, commits=4)
    sql(spark, "SELECT partition, file_count FROM demo.db.by_kind.partitions ORDER BY 1")
    rewrite(spark, "by_kind")
    rewrite(spark, "by_kind", ", where => 'kind = \"click\"'")
    rewrite(spark, "by_kind", ", where => 'kind = \"buy\"', options => map('min-input-files', '2')")
    rewrite(spark, "by_kind", ", options => map('min-input-files', '2')")
    report(spark, "by_kind", snapshots=0)

    # Files already near the target size are not candidates, however many there are.
    create(spark, "in_range")
    append(spark, "in_range", 0, 1000, commits=8)
    avg = int(sql(spark, "SELECT round(avg(file_size_in_bytes)) FROM demo.db.in_range.files", quiet=True)[0][0])
    print(f"\n--- average data file size in db.in_range: {avg} bytes")
    rewrite(spark, "in_range", f", options => map('target-file-size-bytes', '{avg}', 'min-input-files', '2')")
    rewrite(spark, "in_range", ", options => map('min-input-files', '2')")

    # One file: nothing to combine, unless rewrite-all forces it.
    create(spark, "one_file")
    append(spark, "one_file", 0, 1000)
    rewrite(spark, "one_file")
    rewrite(spark, "one_file", ", options => map('rewrite-all', 'true')")


def part_deletes(spark):
    mor = "TBLPROPERTIES ('format-version' = '2', 'write.delete.mode' = 'merge-on-read')"
    # 10% of each file deleted: delete files are added, data files stay.
    create(spark, "with_deletes", extra=mor)
    append(spark, "with_deletes", 0, 1000, commits=3)
    sql(spark, "DELETE FROM demo.db.with_deletes WHERE id % 10 = 0")
    report(spark, "with_deletes", snapshots=0)
    rewrite(spark, "with_deletes")
    rewrite(spark, "with_deletes", ", options => map('delete-file-threshold', '1')")
    report(spark, "with_deletes", snapshots=2)
    sql(spark, "SELECT count(*) AS live_rows FROM demo.db.with_deletes")

    # Options that 1.4.3 does not have.
    create(spark, "dangling", extra=mor)
    append(spark, "dangling", 0, 1000, commits=3)
    sql(spark, "DELETE FROM demo.db.dangling WHERE id % 10 = 0")
    rewrite(spark, "dangling", ", options => map('delete-file-threshold', '1', 'remove-dangling-deletes', 'true')")
    report(spark, "dangling", snapshots=3)

    # 40% of each file deleted.
    create(spark, "heavy_deletes", extra=mor)
    append(spark, "heavy_deletes", 0, 1000, commits=3)
    sql(spark, "DELETE FROM demo.db.heavy_deletes WHERE id % 10 < 4")
    rewrite(spark, "heavy_deletes")
    rewrite(spark, "heavy_deletes", ", options => map('delete-ratio-threshold', '0.3')")
    report(spark, "heavy_deletes", snapshots=0)


def part_sort(spark):
    create(spark, "sorted")
    append(spark, "sorted", 0, 1000, commits=4)
    rewrite(spark, "sorted", ", strategy => 'sort', sort_order => 'id DESC NULLS LAST'")
    rewrite(spark, "sorted", ", strategy => 'sort', sort_order => 'zorder(id, kind)'")
    rewrite(spark, "sorted", ", strategy => 'sort'")
    rewrite(spark, "sorted", ", strategy => 'sort', sort_order => 'zorder(id, kind)', "
                             "options => map('rewrite-all', 'true')")
    report(spark, "sorted", snapshots=1)


def busy_setup(spark):
    """Eight partitions with six files each, and a seventh file in p7."""
    create(spark, "busy", cols="id bigint, p string, payload string",
           extra="PARTITIONED BY (p) TBLPROPERTIES ('format-version' = '2', "
                 "'write.delete.mode' = 'merge-on-read')")
    append(spark, "busy", 0, 800000, commits=6, partition_col="p")
    df = spark.range(10_000_000, 10_100_000).selectExpr(
        "id * 8 + 7 AS id", "'p7' AS p", "sha2(cast(id as string), 256) AS payload")
    df.coalesce(1).writeTo("demo.db.busy").append()
    sql(spark, "SELECT partition, file_count, record_count FROM demo.db.busy.partitions ORDER BY 1")
    s0 = sql(spark, "SELECT snapshot_id FROM demo.db.busy.snapshots ORDER BY committed_at DESC LIMIT 1", quiet=True)[0][0]
    sql(spark, f"ALTER TABLE demo.db.busy SET TBLPROPERTIES ('lab.start-snapshot' = '{s0}')")


def busy_reset(spark):
    s0 = sql(spark, "SHOW TBLPROPERTIES demo.db.busy ('lab.start-snapshot')", quiet=True)[0][1]
    sql(spark, f"CALL demo.system.rollback_to_snapshot('db.busy', {s0})")
    sql(spark, "SELECT count(*) AS data_files FROM demo.db.busy.files WHERE content = 0")


def race(spark, compact_sql, other_sql, delay):
    """Compaction in one thread; after `delay` seconds a second writer commits to the same table."""
    t0 = time.time()

    def stamp():
        return f"{time.time() - t0:5.1f}s"

    def compact():
        print(f"  {stamp()} compaction starts: {compact_sql}", flush=True)
        try:
            df = spark.sql(compact_sql)
            rows = df.collect()
            print(f"  {stamp()} compaction returned {df.columns}: {[tuple(r) for r in rows]}", flush=True)
        except Exception as e:  # noqa: BLE001
            print(f"  {stamp()} compaction failed", flush=True)
            show_error(e)

    print("\n=== race")
    th = threading.Thread(target=compact)
    th.start()
    time.sleep(delay)
    print(f"  {stamp()} second writer starts: {other_sql}", flush=True)
    try:
        spark.sql(other_sql).collect()
        print(f"  {stamp()} second writer committed", flush=True)
    except Exception as e:  # noqa: BLE001
        print(f"  {stamp()} second writer failed", flush=True)
        show_error(e)
    th.join()
    print(f"  {stamp()} both done")


COMPACT = ("CALL demo.system.rewrite_data_files(table => 'db.busy', options => map("
           "'max-concurrent-file-group-rewrites', '1', 'rewrite-job-order', 'files-asc'{extra}))")
APPEND = ("INSERT INTO demo.db.busy SELECT id + 20000000, concat('p', cast(id % 8 as string)), "
          "sha2(cast(id as string), 256) FROM range(0, 80000)")
DELETE = "DELETE FROM demo.db.busy WHERE p = 'p7' AND id % 100 = 7"


def part_concurrent_setup(spark):
    busy_setup(spark)


def part_concurrent_append(spark):
    busy_reset(spark)
    race(spark, COMPACT.format(extra=""), APPEND, delay=3)
    report(spark, "busy", snapshots=3)


def part_concurrent_delete(spark):
    busy_reset(spark)
    race(spark, COMPACT.format(extra=""), DELETE, delay=3)
    report(spark, "busy", snapshots=3)


def part_concurrent_partial(spark):
    busy_reset(spark)
    race(spark, COMPACT.format(extra=", 'partial-progress.enabled', 'true'"), DELETE, delay=3)
    report(spark, "busy", snapshots=10)


def part_clustered(spark, cat="demo"):
    """The same unsorted rows, in 4 tasks, into a partitioned table under three write settings."""
    t = f"{cat}.db.clustered"
    sql(spark, f"DROP TABLE IF EXISTS {t}", quiet=True)
    sql(spark, f"CREATE TABLE {t} (id bigint, kind string, payload string) USING iceberg "
               f"PARTITIONED BY (kind) TBLPROPERTIES ('write.distribution-mode' = 'none')")

    def write(label):
        print(f"\n=== {label}: 6,000 rows in 4 tasks, appended to {t}")
        df = spark.range(0, 6000).selectExpr(
            "id", f"element_at({KINDS}, cast(id % 6 as int) + 1) AS kind",
            "sha2(cast(id as string), 256) AS payload").repartition(4)
        try:
            df.writeTo(t).append()
            print("OK")
        except Exception as e:  # noqa: BLE001
            show_error(e)
        sql(spark, f"SELECT snapshot_id, summary['added-data-files'] AS added_data_files, "
                   f"summary['total-data-files'] AS total_data_files FROM {t}.snapshots "
                   f"ORDER BY committed_at DESC LIMIT 1")

    write("write.distribution-mode=none, fanout not set")
    sql(spark, f"ALTER TABLE {t} SET TBLPROPERTIES ('write.spark.fanout.enabled' = 'true')")
    write("write.distribution-mode=none, write.spark.fanout.enabled=true")
    sql(spark, f"ALTER TABLE {t} SET TBLPROPERTIES "
               f"('write.distribution-mode' = 'hash', 'write.spark.fanout.enabled' = 'false')")
    write("write.distribution-mode=hash, write.spark.fanout.enabled=false")
    sql(spark, f"SELECT partition, file_count FROM {t}.partitions ORDER BY 1")


def part_clustered_old(spark):
    """part_clustered on Iceberg 1.1.0, with a local Hadoop catalog named local."""
    part_clustered(spark, cat="local")


PARTS = {
    "many-create": part_many_create,
    "many-compact": part_many_compact,
    "many-cleanup": part_many_cleanup,
    "thresholds": part_thresholds,
    "deletes": part_deletes,
    "sort": part_sort,
    "concurrent-setup": part_concurrent_setup,
    "concurrent-append": part_concurrent_append,
    "concurrent-delete": part_concurrent_delete,
    "concurrent-partial": part_concurrent_partial,
    "clustered": part_clustered,
    "clustered-old": part_clustered_old,
}


def main():
    from pyspark.sql import SparkSession

    part = sys.argv[1]
    spark = SparkSession.builder.appName(f"compaction-{part}").getOrCreate()
    print(f"# part: {part}; Spark {spark.version}; "
          f"{spark._jvm.org.apache.iceberg.IcebergBuild.fullVersion()}")
    sql(spark, f"CREATE NAMESPACE IF NOT EXISTS {'local' if part == 'clustered-old' else 'demo'}.db", quiet=True)
    PARTS[part](spark)
    spark.stop()


if __name__ == "__main__":
    main()
