"""PyIceberg: appending Arrow tables whose schema does not match the Iceberg table.

run.sh installs one PyIceberg version with pip and runs: python /lab/pyiceberg_cases.py
The table py.events is created here; db.case_t was created by Spark in the same lab run.
"""
import datetime

import pyarrow as pa
import pyiceberg
from pyiceberg.catalog import load_catalog
from pyiceberg.schema import Schema
from pyiceberg.types import IntegerType, LongType, NestedField, StringType, TimestampType

CATALOG = {
    "type": "rest",
    "uri": "http://rest:8181",
    "s3.endpoint": "http://minio:9000",
    "s3.access-key-id": "admin",
    "s3.secret-access-key": "password",
    "s3.region": "us-east-1",
}
TS = datetime.datetime(2026, 11, 17, 12, 0, 0)


def attempt(label, fn):
    print(f"\n=== {label}")
    try:
        out = fn()
        print("OK" if out is None else f"OK: {out}")
    except Exception as e:  # noqa: BLE001 - the failure is the output
        print(f"ERROR {type(e).__module__}.{type(e).__name__}")
        print(str(e))
        cause = e.__cause__ or e.__context__
        while cause is not None:
            print(f"caused by {type(cause).__module__}.{type(cause).__name__}: {cause}")
            cause = cause.__cause__ or cause.__context__


def arrow(fields, columns):
    return pa.Table.from_arrays(columns, schema=pa.schema(fields))


def main():
    print(f"# pyiceberg {pyiceberg.__version__}, pyarrow {pa.__version__}")
    cat = load_catalog("demo", **CATALOG)
    try:
        cat.create_namespace("py")
    except Exception:  # noqa: BLE001 - it exists after the first run
        pass
    try:
        cat.drop_table("py.events")
    except Exception:  # noqa: BLE001
        pass
    schema = Schema(
        NestedField(1, "id", LongType(), required=True),
        NestedField(2, "name", StringType(), required=False),
        NestedField(3, "created", TimestampType(), required=False),
    )
    tbl = cat.create_table("py.events", schema=schema)
    print(f"table py.events: {tbl.schema()}")

    ids = pa.array([1, 2], pa.int64())
    names = pa.array(["a", "b"])
    created = pa.array([TS, TS], pa.timestamp("us"))
    id_req = pa.field("id", pa.int64(), nullable=False)

    attempt("append: same columns, Arrow's default nullable id",
            lambda: tbl.append(arrow([pa.field("id", pa.int64()), pa.field("name", pa.string()),
                                      pa.field("created", pa.timestamp("us"))], [ids, names, created])))
    attempt("append: same columns, id declared not nullable",
            lambda: tbl.append(arrow([id_req, pa.field("name", pa.string()), pa.field("created", pa.timestamp("us"))],
                                     [ids, names, created])))
    with_email = arrow([id_req, pa.field("name", pa.string()), pa.field("created", pa.timestamp("us")),
                        pa.field("email", pa.string())], [ids, names, created, pa.array(["a@x", "b@x"])])
    attempt("append: an extra column, email", lambda: tbl.append(with_email))
    attempt("append: optional column created missing",
            lambda: tbl.append(arrow([id_req, pa.field("name", pa.string())], [ids, names])))
    attempt("append: id as int32",
            lambda: tbl.append(arrow([pa.field("id", pa.int32(), nullable=False), pa.field("name", pa.string()),
                                      pa.field("created", pa.timestamp("us"))],
                                     [pa.array([3, 4], pa.int32()), names, created])))
    attempt("append: id as string",
            lambda: tbl.append(arrow([pa.field("id", pa.string(), nullable=False), pa.field("name", pa.string()),
                                      pa.field("created", pa.timestamp("us"))],
                                     [pa.array(["5", "6"]), names, created])))
    attempt("append: created in nanoseconds",
            lambda: tbl.append(arrow([id_req, pa.field("name", pa.string()), pa.field("created", pa.timestamp("ns"))],
                                     [ids, names, pa.array([TS, TS], pa.timestamp("ns"))])))

    def union_then_append():
        with tbl.update_schema() as update:
            update.union_by_name(with_email.schema)
        tbl.append(with_email)
        return f"schema now {tbl.schema()}"
    attempt("update_schema().union_by_name(arrow schema), then append the table with email", union_then_append)

    def narrow():
        with tbl.update_schema() as update:
            update.update_column("id", IntegerType())
    attempt("update_schema().update_column('id', IntegerType())", narrow)
    attempt("rows in py.events", lambda: tbl.scan().to_arrow().num_rows)

    def read_spark_table():
        t = cat.load_table("db.case_t")
        return f"schema {t.schema()}; rows {t.scan().to_arrow().num_rows}"
    attempt("load and scan db.case_t (columns id and ID, written by Spark)", read_spark_table)


if __name__ == "__main__":
    main()
