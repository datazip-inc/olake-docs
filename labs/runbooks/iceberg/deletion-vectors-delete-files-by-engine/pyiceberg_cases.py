"""PyIceberg: write the lab's changes to a v2 and a v3 table, then read every table of the lab.

run.sh installs one PyIceberg version with pip and runs:
  python /lab/pyiceberg_cases.py write           the tables py_v2 and py_v3 (tables.txt lists py_v2 only:
                                                 PyIceberg 0.12.0 could not append to py_v3)
  python /lab/pyiceberg_cases.py read <label>    read every table in tables.txt, compare with the expected rows
  python /lab/pyiceberg_cases.py encodings <table> [<table> ...]
                                                 the Parquet encodings of each file of the tables, and a
                                                 PyArrow read of each position delete file
"""
import sys
import warnings

import pyarrow as pa
import pyiceberg
from pyiceberg.catalog import load_catalog
from pyiceberg.expressions import EqualTo, In
from pyiceberg.schema import Schema
from pyiceberg.types import IntegerType, NestedField, StringType

CATALOG = {
    "type": "rest",
    "uri": "http://rest:8181",
    "s3.endpoint": "http://minio:9000",
    "s3.access-key-id": "admin",
    "s3.secret-access-key": "password",
    "s3.region": "us-east-1",
}
EXPECTED = [(1, "r1"), (2, "r2"), (4, "r4"), (5, "u5"), (6, "r6"), (7, "r7"), (9, "r9"), (10, "m10"), (11, "m11")]
ARROW = pa.schema([pa.field("id", pa.int32()), pa.field("v", pa.string())])
MOR = {"write.delete.mode": "merge-on-read", "write.update.mode": "merge-on-read", "write.merge.mode": "merge-on-read"}


def rows(*pairs):
    return pa.Table.from_pylist([{"id": i, "v": v} for i, v in pairs], schema=ARROW)


def attempt(label, fn):
    print(f"\n=== {label}")
    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter("always")
        try:
            out = fn()
            ok = True
        except Exception as e:  # noqa: BLE001 - the failure is the output
            ok = False
            print(f"ERROR {type(e).__module__}.{type(e).__name__}")
            print(str(e)[:1500])
            cause = e.__cause__ or e.__context__
            while cause is not None:
                print(f"caused by {type(cause).__module__}.{type(cause).__name__}: {str(cause)[:600]}")
                cause = cause.__cause__ or cause.__context__
    for w in caught:
        print(f"WARNING {w.category.__name__}: {w.message}")
    if ok:
        print("OK" if out is None else f"OK: {out}")
    return ok


def files(tbl):
    """Data and delete files of the current snapshot, by content (0 data, 1 position deletes, 2 equality deletes)."""
    t = tbl.inspect.files()
    counts = {}
    for c, fmt, n in zip(t["content"].to_pylist(), t["file_format"].to_pylist(), t["record_count"].to_pylist()):
        files_, records = counts.get((c, fmt), (0, 0))
        counts[(c, fmt)] = (files_ + 1, records + n)
    return "; ".join(f"content {c} {fmt}: {f} files, {r} records" for (c, fmt), (f, r) in sorted(counts.items()))


def last_summary(tbl):
    s = tbl.current_snapshot()
    return "no snapshot" if s is None else f"snapshot {s.sequence_number}, {s.summary}".replace("\n", " ")


def case_write(cat):
    try:
        cat.create_namespace("db")
    except Exception:  # noqa: BLE001 - Spark created it
        pass
    schema = Schema(NestedField(1, "id", IntegerType(), required=False), NestedField(2, "v", StringType(), required=False))
    for name, fv in (("py_v2", 2), ("py_v3", 3)):
        print(f"\n######## db.{name}: format version {fv}, write.delete.mode, write.update.mode and write.merge.mode merge-on-read")
        try:
            cat.drop_table(f"db.{name}", purge_requested=True)
        except Exception:  # noqa: BLE001
            pass
        props = {"format-version": str(fv), **MOR}
        if not attempt(f"create_table db.{name}, properties {props}",
                       lambda: cat.create_table(f"db.{name}", schema=schema, properties=props).format_version):
            continue
        tbl = cat.load_table(f"db.{name}")
        steps = [
            ("append ids 1 to 5", lambda: tbl.append(rows((1, "r1"), (2, "r2"), (3, "r3"), (4, "r4"), (5, "r5")))),
            ("append ids 6 to 10", lambda: tbl.append(rows((6, "r6"), (7, "r7"), (8, "r8"), (9, "r9"), (10, "r10")))),
            ("delete(In('id', [3, 8]))", lambda: tbl.delete(In("id", [3, 8]))),
            ("overwrite(rows (5, 'u5'), overwrite_filter=EqualTo('id', 5))",
             lambda: tbl.overwrite(rows((5, "u5")), overwrite_filter=EqualTo("id", 5))),
            ("upsert(rows (10, 'm10'), (11, 'm11'), join_cols=['id'])",
             lambda: tbl.upsert(rows((10, "m10"), (11, "m11")), join_cols=["id"])),
        ]
        for label, fn in steps:
            if not attempt(label, fn):
                print(f"  {last_summary(tbl)}; the later changes to db.{name} were not run")
                break
            print("  " + last_summary(tbl))
        attempt(f"files of db.{name}", lambda: files(tbl))

    print("\n######## db.py_default: create_table without format-version")
    try:
        cat.drop_table("db.py_default", purge_requested=True)
    except Exception:  # noqa: BLE001
        pass
    attempt("create_table db.py_default: format_version",
            lambda: cat.create_table("db.py_default", schema=schema).format_version)
    cat.drop_table("db.py_default", purge_requested=True)


def read_one(cat, name):
    try:
        tbl = cat.load_table(f"db.{name}")
        print(f"format version {tbl.format_version}")
    except Exception as e:  # noqa: BLE001
        print(f"ERROR {type(e).__module__}.{type(e).__name__}: {str(e)[:800]}")
        return f"ERROR {type(e).__name__}: {str(e).splitlines()[0][:300] if str(e) else ''}"
    try:
        print(f"files: {files(tbl)}")
    except Exception as e:  # noqa: BLE001
        print(f"files: not listed, {type(e).__name__}: {str(e)[:300]}")
    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter("always")
        try:
            got = sorted((r["id"], r["v"]) for r in tbl.scan().to_arrow().to_pylist())
            print("rows: " + ",".join(f"{i}:{v}" for i, v in got))
            n = tbl.scan().count()
            print(f"scan().count(): {n}")
        except Exception as e:  # noqa: BLE001
            print(f"ERROR {type(e).__module__}.{type(e).__name__}")
            print(str(e)[:1500])
            return f"ERROR {type(e).__name__}: {(str(e).splitlines() or [''])[0][:300]}"
        finally:
            for w in caught:
                print(f"WARNING {w.category.__name__}: {w.message}")
    if got == EXPECTED and n == len(EXPECTED):
        return f"correct, {n} rows"
    missing = [r for r in EXPECTED if r not in got]
    extra = [r for r in got if r not in EXPECTED]
    return (f"WRONG, {len(got)} rows, count() {n}" + (f", missing {missing}" if missing else "")
            + (f", extra {extra}" if extra else ""))


def case_read(cat, label):
    names = [line.strip() for line in open("/lab/tables.txt") if line.strip() and not line.startswith("#")]
    results = []
    for name in names:
        print(f"\n=== read db.{name}")
        results.append((name, read_one(cat, name)))
    print("\n######## results")
    for name, verdict in results:
        print(f"RESULT {label} {name}: {verdict}")


def case_encodings(cat, names):
    """The writer and the Parquet encodings of each file, and a PyArrow read of each position delete file."""
    import inspect

    import pyarrow.parquet as pq
    from pyiceberg.io import pyarrow as pyarrow_io

    print("\n######## how PyIceberg reads a Parquet delete file (pyiceberg.io.pyarrow._read_deletes)")
    print(inspect.getsource(pyarrow_io._read_deletes))
    for name in names:
        print(f"\n######## db.{name}")
        tbl = cat.load_table(f"db.{name}")
        for f in sorted(tbl.inspect.files().to_pylist(), key=lambda f: (f["content"], f["file_path"])):
            if f["file_format"] != "PARQUET":
                continue
            path, tail = f["file_path"], f["file_path"].rsplit("/", 1)[-1]
            with tbl.io.new_input(path).open() as fi:
                md = pq.ParquetFile(fi).metadata
                encodings = {md.schema.column(i).name: sorted({e for g in range(md.num_row_groups)
                                                               for e in md.row_group(g).column(i).encodings})
                             for i in range(md.num_columns)}
            print(f"content {f['content']} {tail}: created_by {md.created_by}; encodings {encodings}")
            if f["content"] == 1:
                for kwargs in ({"read_dictionary": ["file_path"]}, {}):
                    def read(kwargs=kwargs):
                        with tbl.io.new_input(path).open() as fi:
                            return f"{pq.read_table(fi, **kwargs).num_rows} rows"
                    attempt(f"pyarrow.parquet.read_table({tail}, {kwargs})", read)


def main():
    try:
        from importlib.metadata import version
        core = version("pyiceberg-core")
    except Exception:  # noqa: BLE001
        core = "not installed"
    print(f"######## PyIceberg {pyiceberg.__version__}, PyArrow {pa.__version__}, pyiceberg-core {core}")
    cat = load_catalog("demo", **CATALOG)
    if sys.argv[1] == "write":
        case_write(cat)
    elif sys.argv[1] == "encodings":
        case_encodings(cat, sys.argv[2:])
    else:
        case_read(cat, sys.argv[2])


if __name__ == "__main__":
    main()
