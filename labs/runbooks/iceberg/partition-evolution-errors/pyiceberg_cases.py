"""PyIceberg: partition spec changes, and reading the tables Spark evolved.

run.sh installs one PyIceberg version with pip and runs: python /lab/pyiceberg_cases.py
The tables in the namespace py are created here; db.split_t, db.nested_p, db.dc_v2, db.dc_v1 and
db.dc_fix were created by Spark in the same lab run.
"""
import datetime

import pyarrow as pa
import pyiceberg
from pyiceberg.catalog import load_catalog
from pyiceberg.expressions import And, EqualTo, GreaterThanOrEqual, LessThan
from pyiceberg.partitioning import PartitionField, PartitionSpec
from pyiceberg.schema import Schema
from pyiceberg.transforms import BucketTransform, DayTransform, HourTransform, IdentityTransform, TruncateTransform
from pyiceberg.types import DoubleType, LongType, NestedField, StringType, TimestampType

CATALOG = {
    "type": "rest",
    "uri": "http://rest:8181",
    "s3.endpoint": "http://minio:9000",
    "s3.access-key-id": "admin",
    "s3.secret-access-key": "password",
    "s3.region": "us-east-1",
}


def attempt(label, fn):
    print(f"\n=== {label}")
    try:
        out = fn()
        print("OK" if out is None else f"OK: {out}")
    except Exception as e:  # noqa: BLE001 - the failure is the output
        print(f"ERROR {type(e).__module__}.{type(e).__name__}")
        print(str(e)[:1500])
        cause = e.__cause__ or e.__context__
        while cause is not None:
            print(f"caused by {type(cause).__module__}.{type(cause).__name__}: {str(cause)[:600]}")
            cause = cause.__cause__ or cause.__context__


def specs(tbl):
    parts = [f"spec {sid}: {spec}".replace("\n", " ") for sid, spec in sorted(tbl.specs().items())]
    return f"current spec {tbl.spec().spec_id}; " + "; ".join(parts)


def update_spec(tbl, change):
    def run():
        with tbl.update_spec() as update:
            change(update)
        return specs(tbl)
    return run


def main():
    try:
        from importlib.metadata import version
        core = version("pyiceberg-core")
    except Exception:  # noqa: BLE001
        core = "not installed"
    print(f"# pyiceberg {pyiceberg.__version__}, pyarrow {pa.__version__}, pyiceberg-core {core}")
    cat = load_catalog("demo", **CATALOG)
    try:
        cat.create_namespace("py")
    except Exception:  # noqa: BLE001 - it exists after the first run
        pass
    try:
        cat.drop_table("py.spec_t")
    except Exception:  # noqa: BLE001
        pass

    schema = Schema(
        NestedField(1, "id", LongType(), required=False),
        NestedField(2, "ts", TimestampType(), required=False),
        NestedField(3, "category", StringType(), required=False),
        NestedField(4, "amount", DoubleType(), required=False),
    )
    spec = PartitionSpec(PartitionField(source_id=2, field_id=1000, transform=DayTransform(), name="ts_day"))
    tbl = cat.create_table("py.spec_t", schema=schema, partition_spec=spec)
    print(f"table py.spec_t: {specs(tbl)}")

    attempt("update_spec: add_field('ts', HourTransform(), 'ts_hour')",
            update_spec(tbl, lambda u: u.add_field("ts", HourTransform(), "ts_hour")))
    attempt("update_spec: add_field('ts', DayTransform(), 'ts_day')",
            update_spec(tbl, lambda u: u.add_field("ts", DayTransform(), "ts_day")))
    attempt("update_spec: add_field('category', IdentityTransform(), 'ts_day')",
            update_spec(tbl, lambda u: u.add_field("category", IdentityTransform(), "ts_day")))
    attempt("update_spec: add_field('amount', BucketTransform(16), 'amount_bucket')",
            update_spec(tbl, lambda u: u.add_field("amount", BucketTransform(16), "amount_bucket")))
    attempt("update_spec: add_field('created', DayTransform(), 'created_day')",
            update_spec(tbl, lambda u: u.add_field("created", DayTransform(), "created_day")))
    attempt("update_spec: remove_field('ts_hour')",
            update_spec(tbl, lambda u: u.remove_field("ts_hour")))

    def day_to_hour(u):
        u.remove_field("ts_day")
        u.add_field("ts", HourTransform(), "ts_hour")
    attempt("update_spec: remove_field('ts_day'), then add_field('ts', HourTransform(), 'ts_hour')",
            update_spec(tbl, day_to_hour))

    ts = pa.array([datetime.datetime(2026, 11, 1, 10), datetime.datetime(2026, 11, 1, 11)], pa.timestamp("us"))
    data = pa.Table.from_arrays([pa.array([1, 2], pa.int64()), ts, pa.array(["a", "b"]), pa.array([1.0, 2.0])],
                                schema=pa.schema([("id", pa.int64()), ("ts", pa.timestamp("us")),
                                                  ("category", pa.string()), ("amount", pa.float64())]))
    attempt("append 2 rows to py.spec_t (spec: hour(ts))", lambda: tbl.append(data))
    attempt("files of py.spec_t: spec_id, partition",
            lambda: [(r["spec_id"], r["partition"]) for r in tbl.inspect.files().to_pylist()])

    # The same two rows appended to a table with each transform alone.
    for name, source_id, transform in [
        ("w_identity", 3, IdentityTransform()),
        ("w_day", 2, DayTransform()),
        ("w_hour", 2, HourTransform()),
        ("w_bucket", 1, BucketTransform(16)),
        ("w_truncate", 3, TruncateTransform(4)),
    ]:
        try:
            cat.drop_table(f"py.{name}")
        except Exception:  # noqa: BLE001
            pass
        field = PartitionField(source_id=source_id, field_id=1000, transform=transform, name="p")
        t = cat.create_table(f"py.{name}", schema=schema, partition_spec=PartitionSpec(field))
        attempt(f"append 2 rows to py.{name} (spec: {t.spec()})".replace("\n", " "), lambda t=t: t.append(data))

    # The Spark table whose spec changed from day(ts) to day(ts) and category, and which was not rewritten.
    def plan(name, row_filter):
        t = cat.load_table(name)
        tasks = list(t.scan(row_filter=row_filter).plan_files())
        by_spec = {}
        for task in tasks:
            by_spec[task.file.spec_id] = by_spec.get(task.file.spec_id, 0) + 1
        rows = sum(task.file.record_count for task in tasks)
        return f"{len(tasks)} files {dict(sorted(by_spec.items()))} by spec id, {rows} records planned"
    attempt("db.split_t: plan_files for category == 'b'", lambda: plan("db.split_t", EqualTo("category", "b")))
    attempt("db.split_t: plan_files for 2026-11-02 <= ts < 2026-11-03",
            lambda: plan("db.split_t", And(GreaterThanOrEqual("ts", "2026-11-02T00:00:00+00:00"),
                                           LessThan("ts", "2026-11-03T00:00:00+00:00"))))

    # Tables Spark changed: a partition field on a struct field, and dropped partition source columns.
    for name in ("db.nested_p", "db.dc_v2", "db.dc_v1", "db.dc_fix"):
        def read(name=name):
            t = cat.load_table(name)
            rows = t.scan().to_arrow().to_pylist()
            return f"{specs(t)}; schema {t.schema()}; rows {rows}".replace("\n", " ")
        attempt(f"load and scan {name}", read)


if __name__ == "__main__":
    main()
