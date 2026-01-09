import argparse
import json
import os
from typing import Optional, Tuple, Union, List

from pyspark.sql import SparkSession
from pyspark.sql.utils import AnalysisException

# Spark session is created in __main__ after we parse destination config.
spark = None  # type: ignore[assignment]

# ------------------------------------------------------------------------------
# User Inputs (must be provided)
# ------------------------------------------------------------------------------
CATALOG = "<YOUR_CATALOG_NAME>"
# Source namespace/database for MOR tables.
# User must hardcode this before running the script.
DB = "<NAME_OF_YOUR_SOURCE_DATABASE>"
# Destination namespace/database for generated COW tables (same catalog, different db)
COW_DB = "<NAME_OF_YOUR_COW_DATABASE>"

# Base S3 location where per-table COW tables (and the shared state table) will be stored.
# Example: "s3://my-bucket/warehouse/cow"
COW_BASE_LOCATION = "<YOUR_COW_BASE_LOCATION>"

# We use WAP (Write-Audit-Publish) pattern to store checkpoint state.
# The truncate snapshot_id is stored as the WAP ID, which is published after each successful write.

PRIMARY_KEY = "_olake_id"


def _recompute_derived_names():
    # No derived names needed for state-table anymore.
    return


def load_destination_writer_config(destination_details_path: str, job_id: Optional[int] = None) -> dict:
    
    with open(destination_details_path, "r", encoding="utf-8") as f:
        outer = json.load(f)

    # New simplified format: top-level dict with writer
    if isinstance(outer, dict) and isinstance(outer.get("writer"), dict):
        writer = outer.get("writer")
        assert isinstance(writer, dict)
        return writer

    # Old format: array of records
    if not isinstance(outer, list) or not outer:
        raise ValueError("Destination config file must be either a JSON object with 'writer' or a non-empty JSON array")

    record = None
    if job_id is None:
        record = outer[0]
    else:
        for r in outer:
            if r.get("job_id") == job_id:
                record = r
                break
        if record is None:
            raise ValueError(f"job_id {job_id} not found in destination_details.json")

    dest = record.get("destination") or {}
    config_str = dest.get("config")
    if not config_str:
        raise ValueError("destination.config missing in destination_details.json")

    inner = json.loads(config_str)
    writer = inner.get("writer")
    if not isinstance(writer, dict):
        raise ValueError("destination.config JSON does not contain a 'writer' object")
    return writer


def _normalize_warehouse(catalog_type: str, warehouse_val: str) -> str:
    """
    - REST/Lakekeeper: warehouse can be a Lakekeeper 'warehouse name' (not a URI).
    - Glue/JDBC: warehouse must be a filesystem URI/path (often s3a://bucket/prefix).
    """
    if not warehouse_val:
        raise ValueError("iceberg_s3_path is required")

    v = warehouse_val.strip()

    if catalog_type == "rest":
        return v

    # For glue/jdbc, accept s3:// or s3a://; if no scheme, assume it's "bucket/prefix"
    if v.startswith("s3://"):
        return "s3a://" + v[len("s3://") :]
    if v.startswith("s3a://"):
        return v
    return "s3a://" + v.lstrip("/")


def _spark_packages_for(writer: dict, catalog_type: str) -> str:
    """
    Base packages are required for Iceberg + S3. JDBC catalogs additionally need a DB driver.
    """
    pkgs = [
        "org.apache.iceberg:iceberg-spark-runtime-3.5_2.12:1.5.2",
        "org.apache.iceberg:iceberg-aws-bundle:1.5.2",
        "org.apache.hadoop:hadoop-aws:3.3.4",
        "com.amazonaws:aws-java-sdk-bundle:1.12.262",
    ]

    if catalog_type == "jdbc":
        jdbc_url = (writer.get("jdbc_url") or "").lower()
        # Common case for Iceberg JDBC catalog
        if jdbc_url.startswith("jdbc:postgresql:"):
            pkgs.append("org.postgresql:postgresql:42.5.4")
        elif jdbc_url.startswith("jdbc:mysql:"):
            pkgs.append("mysql:mysql-connector-java:8.0.33")

    # de-dupe while preserving order
    seen = set()
    out = []
    for p in pkgs:
        if p not in seen:
            seen.add(p)
            out.append(p)
    return ",".join(out)


def build_spark_session_from_writer(writer: dict) -> SparkSession:
    catalog_type = (writer.get("catalog_type") or "").lower()
    catalog_name = writer.get("catalog_name") or CATALOG
    warehouse_raw = writer.get("iceberg_s3_path") or ""
    warehouse = _normalize_warehouse(catalog_type, warehouse_raw)

    # S3A settings
    s3_endpoint = writer.get("s3_endpoint")
    aws_region = writer.get("aws_region")
    aws_access_key = writer.get("aws_access_key")
    aws_secret_key = writer.get("aws_secret_key")
    aws_session_token = (
        writer.get("aws_session_token")
        or writer.get("aws_sessionToken")
        or writer.get("session_token")
        or writer.get("sessionToken")
    )
    s3_path_style = writer.get("s3_path_style")  # may not exist; we'll infer if missing
    s3_use_ssl = writer.get("s3_use_ssl")

    # Infer path-style for MinIO-like endpoints if not specified
    if s3_path_style is None and isinstance(s3_endpoint, str):
        if s3_endpoint.startswith("http://") or "9000" in s3_endpoint or "minio" in s3_endpoint.lower():
            s3_path_style = True
    if s3_path_style is None:
        s3_path_style = True

    # Infer SSL from endpoint scheme if present; allow explicit override via s3_use_ssl
    ssl_enabled = None
    if isinstance(s3_use_ssl, bool):
        ssl_enabled = "true" if s3_use_ssl else "false"
    if isinstance(s3_endpoint, str) and s3_endpoint.startswith("http://"):
        ssl_enabled = ssl_enabled or "false"
    elif isinstance(s3_endpoint, str) and s3_endpoint.startswith("https://"):
        ssl_enabled = ssl_enabled or "true"

    # Maven packages (network is available per your note)
    packages = _spark_packages_for(writer, catalog_type)

    builder = SparkSession.builder.appName("OLake MOR to COW Compaction")
    builder = builder.config("spark.jars.packages", packages)
    builder = builder.config(
        "spark.sql.extensions",
        "org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions",
    )
    builder = builder.config("spark.sql.catalogImplementation", "in-memory")
    builder = builder.config("spark.sql.defaultCatalog", catalog_name)

    # Ensure AWS SDK-based clients (e.g., GlueCatalog, Iceberg S3FileIO) can see credentials.
    # This avoids requiring users to export env vars in the container.
    if aws_region:
        os.environ["AWS_REGION"] = str(aws_region)
        os.environ["AWS_DEFAULT_REGION"] = str(aws_region)
        builder = builder.config("spark.driverEnv.AWS_REGION", str(aws_region))
        builder = builder.config("spark.driverEnv.AWS_DEFAULT_REGION", str(aws_region))
        builder = builder.config("spark.executorEnv.AWS_REGION", str(aws_region))
        builder = builder.config("spark.executorEnv.AWS_DEFAULT_REGION", str(aws_region))
    if aws_access_key and aws_secret_key:
        os.environ["AWS_ACCESS_KEY_ID"] = str(aws_access_key)
        os.environ["AWS_SECRET_ACCESS_KEY"] = str(aws_secret_key)
        builder = builder.config("spark.driverEnv.AWS_ACCESS_KEY_ID", str(aws_access_key))
        builder = builder.config("spark.driverEnv.AWS_SECRET_ACCESS_KEY", str(aws_secret_key))
        builder = builder.config("spark.executorEnv.AWS_ACCESS_KEY_ID", str(aws_access_key))
        builder = builder.config("spark.executorEnv.AWS_SECRET_ACCESS_KEY", str(aws_secret_key))
    if aws_session_token:
        os.environ["AWS_SESSION_TOKEN"] = str(aws_session_token)
        builder = builder.config("spark.driverEnv.AWS_SESSION_TOKEN", str(aws_session_token))
        builder = builder.config("spark.executorEnv.AWS_SESSION_TOKEN", str(aws_session_token))

    # SparkCatalog wrapper
    builder = builder.config(f"spark.sql.catalog.{catalog_name}", "org.apache.iceberg.spark.SparkCatalog")
    builder = builder.config(f"spark.sql.catalog.{catalog_name}.io-impl", "org.apache.iceberg.aws.s3.S3FileIO")
    builder = builder.config(f"spark.sql.catalog.{catalog_name}.warehouse", warehouse)

    # IMPORTANT: Iceberg's S3FileIO uses AWS SDK directly (not Hadoop S3A configs).
    # For MinIO/non-AWS endpoints, set Iceberg catalog-level s3.* properties so
    # metadata/data writes go to the correct endpoint.
    builder = builder.config(
        f"spark.sql.catalog.{catalog_name}.s3.path-style-access",
        str(bool(s3_path_style)).lower(),
    )
    if s3_endpoint:
        builder = builder.config(f"spark.sql.catalog.{catalog_name}.s3.endpoint", s3_endpoint)
    if aws_region:
        builder = builder.config(f"spark.sql.catalog.{catalog_name}.s3.region", aws_region)
    if aws_access_key and aws_secret_key:
        builder = builder.config(f"spark.sql.catalog.{catalog_name}.s3.access-key-id", aws_access_key)
        builder = builder.config(f"spark.sql.catalog.{catalog_name}.s3.secret-access-key", aws_secret_key)

    # Catalog impl specifics
    if catalog_type == "rest":
        rest_url = writer.get("rest_catalog_url")
        if not rest_url:
            raise ValueError("rest_catalog_url is required for catalog_type=rest")
        builder = builder.config(f"spark.sql.catalog.{catalog_name}.catalog-impl", "org.apache.iceberg.rest.RESTCatalog")
        builder = builder.config(f"spark.sql.catalog.{catalog_name}.uri", rest_url)
    elif catalog_type == "glue":
        builder = builder.config(
            f"spark.sql.catalog.{catalog_name}.catalog-impl",
            "org.apache.iceberg.aws.glue.GlueCatalog",
        )
        # Optional: Glue catalog id/account id if provided
        glue_catalog_id = writer.get("glue_catalog_id") or writer.get("glue.catalog-id") or writer.get("catalog_id")
        if glue_catalog_id:
            builder = builder.config(f"spark.sql.catalog.{catalog_name}.glue.catalog-id", str(glue_catalog_id))
        # Region can be needed by AWS SDK for Glue
        if aws_region:
            builder = builder.config(
                "spark.driver.extraJavaOptions",
                f"-Daws.region={aws_region} -Daws.defaultRegion={aws_region}",
            )
            builder = builder.config(
                "spark.executor.extraJavaOptions",
                f"-Daws.region={aws_region} -Daws.defaultRegion={aws_region}",
            )
    elif catalog_type == "jdbc":
        jdbc_url = writer.get("jdbc_url")
        if not jdbc_url:
            raise ValueError("jdbc_url is required for catalog_type=jdbc")
        builder = builder.config(
            f"spark.sql.catalog.{catalog_name}.catalog-impl",
            "org.apache.iceberg.jdbc.JdbcCatalog",
        )
        builder = builder.config(f"spark.sql.catalog.{catalog_name}.uri", jdbc_url)

        jdbc_user = writer.get("jdbc_username") or writer.get("jdbc_user") or writer.get("username")
        jdbc_password = writer.get("jdbc_password") or writer.get("jdbc_pass") or writer.get("password")
        if jdbc_user:
            builder = builder.config(f"spark.sql.catalog.{catalog_name}.jdbc.user", str(jdbc_user))
        if jdbc_password:
            builder = builder.config(f"spark.sql.catalog.{catalog_name}.jdbc.password", str(jdbc_password))
    else:
        raise ValueError(f"Unsupported catalog_type={catalog_type}. Supported: rest, glue, jdbc")

    # S3A filesystem settings
    builder = builder.config("spark.hadoop.fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")
    builder = builder.config("spark.hadoop.fs.s3a.path.style.access", str(bool(s3_path_style)).lower())

    if s3_endpoint:
        builder = builder.config("spark.hadoop.fs.s3a.endpoint", s3_endpoint)
    if aws_region:
        builder = builder.config("spark.hadoop.fs.s3a.region", aws_region)
    if ssl_enabled is not None:
        builder = builder.config("spark.hadoop.fs.s3a.connection.ssl.enabled", ssl_enabled)

    if aws_access_key and aws_secret_key:
        builder = builder.config(
            "spark.hadoop.fs.s3a.aws.credentials.provider",
            "org.apache.hadoop.fs.s3a.SimpleAWSCredentialsProvider",
        )
        builder = builder.config("spark.hadoop.fs.s3a.access.key", aws_access_key)
        builder = builder.config("spark.hadoop.fs.s3a.secret.key", aws_secret_key)

    return builder.getOrCreate()


# ------------------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------------------
def split_fqn(table_fqn: str):
    parts = table_fqn.split(".")
    if len(parts) != 3:
        raise ValueError(f"Expected table fqn as <catalog>.<db>.<table>, got: {table_fqn}")
    return parts[0], parts[1], parts[2]


def cow_table_and_location_for(mor_table_fqn: str):
    catalog, _db, table = split_fqn(mor_table_fqn)
    cow_table_fqn = f"{catalog}.{COW_DB}.{table}_cow"
    cow_location = f"{COW_BASE_LOCATION}/{table}_cow"
    return cow_table_fqn, cow_location


def table_exists(table_name: str) -> bool:
    try:
        spark.read.format("iceberg").load(table_name).limit(1).collect()
        return True
    except AnalysisException:
        return False


def ensure_namespace_exists(catalog: str, namespace: str):
    # Create destination namespace for COW tables/state if missing.
    # Iceberg SparkCatalog supports CREATE NAMESPACE for REST/Glue catalogs.
    spark.sql(f"CREATE NAMESPACE IF NOT EXISTS {catalog}.{namespace}")


def enable_wap_for_table(cow_table_fqn: str):
    """Enable WAP (Write-Audit-Publish) for the COW table if not already enabled."""
    try:
        spark.sql(f"ALTER TABLE {cow_table_fqn} SET TBLPROPERTIES ('write.wap.enabled'='true')")
    except Exception:
        # WAP might already be enabled, ignore error
        pass


def get_wap_id_from_table(cow_table_fqn: str, catalog_name: str) -> Optional[str]:
    """
    Get the latest published WAP ID from the COW table.
    Returns the WAP ID (string) or None if no WAP ID exists.
    
    Queries the COW table's snapshot metadata to find WAP IDs stored in snapshot summaries.
    """
    if not table_exists(cow_table_fqn):
        return None

    # Check snapshot metadata for WAP ID
    try:
        rows = spark.sql(f"""
            SELECT summary
            FROM {cow_table_fqn}.snapshots
            WHERE summary IS NOT NULL
            ORDER BY committed_at DESC
            LIMIT 10
        """).collect()
        for r in rows:
            d = r.asDict(recursive=True)
            summary = d.get("summary") or {}
            if isinstance(summary, dict):
                # Look for wap_id in snapshot summary (check multiple key variations)
                wap_id = summary.get("wap.id") or summary.get("wap_id") or summary.get("wap-id")
                if wap_id:
                    return str(wap_id)
    except Exception:
        pass
    
    return None


def publish_wap_changes(cow_table_fqn: str, catalog_name: str, wap_id: str):
    """
    Publish WAP changes. Idempotent - can be called multiple times safely.
    Catches duplicate WAP commit errors and cherry-pick validation errors (occurs when re-publishing already published WAP IDs).
    """
    try:
        spark.sql(f"CALL {catalog_name}.system.publish_changes('{cow_table_fqn}', '{wap_id}')")
    except Exception as e:
        error_msg = str(e).lower()
        # DuplicateWAPCommitException: "Duplicate request to cherry pick wap id that was published already"
        # Cherry-pick validation errors: "cannot cherry-pick" or "not append, dynamic overwrite, or fast-forward"
        # Both indicate the WAP ID is already published, which is idempotent
        if ("duplicate" in error_msg and "wap" in error_msg and "published already" in error_msg) or \
           "cannot cherry-pick" in error_msg or \
           "not append, dynamic overwrite, or fast-forward" in error_msg:
            # Idempotent - already published, that's fine
            print(f"[{cow_table_fqn}] WAP ID {wap_id} already published (idempotent operation).")
        else:
            # Re-raise if it's a different error
            raise


def extract_truncate_id_from_wap_id(wap_id: str) -> Optional[int]:
    """Extract truncate snapshot_id from WAP ID. WAP ID should be the truncate snapshot_id itself."""
    try:
        return int(wap_id)
    except Exception:
        return None


# ------------------------------------------------------------------------------
# Iceberg snapshot helpers
# ------------------------------------------------------------------------------
def get_latest_snapshot_and_parent_id(table_fqn: str):
    """
    Return the most recent TRUNCATE-like snapshot (snapshot_id, parent_id).
    To be robust against a small race where new OLake writes are committed
    immediately after our TRUNCATE, we look at the latest few snapshots and
    pick the first one that matches the truncate boundary signature.
    """
    rows = spark.sql(f"""
        SELECT snapshot_id, parent_id, committed_at, operation, summary
        FROM {table_fqn}.snapshots
        ORDER BY committed_at DESC
        LIMIT 10
    """).collect()
    if not rows:
        return None, None

    snaps = []
    by_id = {}
    for r in rows:
        d = r.asDict(recursive=True)
        snap = {
            "snapshot_id": d.get("snapshot_id"),
            "parent_id": d.get("parent_id"),
            "committed_at": d.get("committed_at"),
            "operation": d.get("operation"),
            "summary": d.get("summary"),
        }
        snaps.append(snap)
        sid = snap.get("snapshot_id")
        if sid is not None:
            by_id[sid] = snap

    # Among these most recent snapshots, find the newest one that looks like a truncate.
    for snap in snaps:
        parent = by_id.get(snap.get("parent_id"))
        if _is_truncate_boundary_snapshot(snap, parent):
            return snap.get("snapshot_id"), snap.get("parent_id")

    # Fallback: if none looks like a truncate, just return the latest snapshot.
    head = snaps[0]
    return head.get("snapshot_id"), head.get("parent_id")


def _summary_int(summary: Optional[dict], key: str) -> Optional[int]:
    if not summary or key not in summary:
        return None
    try:
        return int(summary.get(key))  # type: ignore[arg-type]
    except Exception:
        return None


def _summary_first_int(summary: Optional[dict], keys: Tuple[str, ...]) -> Optional[int]:
    if not summary:
        return None
    for k in keys:
        v = _summary_int(summary, k)
        if v is not None:
            return v
    return None


def _added_delete_files(summary: Optional[dict]) -> int:
    """
    Best-effort: different engines/versions may emit different keys.
    Treat missing keys as 0.
    """
    if not summary:
        return 0
    for k in ("added-delete-files", "added-equality-delete-files", "added-position-delete-files"):
        v = _summary_int(summary, k)
        if v is not None and v != 0:
            return v
    # If keys exist but are '0', return 0.
    return 0


def _removed_data_files(summary: Optional[dict]) -> Optional[int]:
    """
    Best-effort: removal count is sometimes stored as 'deleted-data-files' (Iceberg metrics),
    and sometimes as other keys depending on engine.
    """
    for k in ("deleted-data-files", "removed-data-files", "deleted_files", "removed_files"):
        v = _summary_int(summary, k)
        if v is not None:
            return v
    return None


def _removed_delete_files(summary: Optional[dict]) -> Optional[int]:
    # Best-effort; key names vary by engine/version.
    return _summary_first_int(
        summary,
        (
            "deleted-delete-files",
            "removed-delete-files",
            "deleted_delete_files",
            "removed_delete_files",
        ),
    )


def _total_delete_files(summary: Optional[dict]) -> Optional[int]:
    return _summary_first_int(summary, ("total-delete-files", "total_delete_files"))


def _is_truncate_boundary_snapshot(snap: dict, parent: Optional[dict]) -> bool:
    """
    Identify compaction boundary snapshots created by TRUNCATE TABLE.

    - operation in {'delete','overwrite'} (varies by engine/version)
    - added-data-files == 0
    - added delete files == 0
    - total-data-files == 0 (table empty after boundary)
    - removed/deleted data files == parent.total-data-files (when both are available)
    - removed/deleted delete files == parent.total-delete-files (when both are available)
    """
    op = (snap.get("operation") or "").lower()
    if op not in ("delete", "overwrite"):
        return False

    summary = snap.get("summary") or {}
    parent_summary = (parent or {}).get("summary") or {}

    added_data_files = _summary_int(summary, "added-data-files") or 0
    if added_data_files != 0:
        return False

    if _added_delete_files(summary) != 0:
        return False

    total_data_files = _summary_int(summary, "total-data-files")
    if total_data_files is not None and total_data_files != 0:
        return False

    total_delete_files = _total_delete_files(summary)
    if total_delete_files is not None and total_delete_files != 0:
        return False

    removed = _removed_data_files(summary)
    parent_total = _summary_int(parent_summary, "total-data-files")
    if removed is not None and parent_total is not None:
        if removed != parent_total:
            return False

    removed_del = _removed_delete_files(summary)
    parent_total_del = _total_delete_files(parent_summary)
    if removed_del is not None and parent_total_del is not None:
        if removed_del != parent_total_del:
            return False

    # Fallback if one side isn't available: delete-to-empty should remove something.
    if removed is not None:
        return removed > 0
    # If the engine doesn't report removed data files, we can't reliably detect.
    return False


# ------------------------------------------------------------------------------
# Merge + schema alignment
# ------------------------------------------------------------------------------
def align_cow_schema(cow_table_fqn: str, mor_df, cow_df):
    mor_schema = {f.name: f.dataType for f in mor_df.schema.fields}
    cow_schema = {f.name: f.dataType for f in cow_df.schema.fields}

    for col, dtype in mor_schema.items():
        if col not in cow_schema:
            print(f"Adding new column '{col}' with type '{dtype.simpleString()}' to COW table")
            spark.sql(f"""
                ALTER TABLE {cow_table_fqn}
                ADD COLUMN {col} {dtype.simpleString()}
            """)

    for col, mor_type in mor_schema.items():
        if col in cow_schema:
            cow_type = cow_schema[col]
            if mor_type != cow_type:
                print(
                    f"Updating column '{col}' type from '{cow_type.simpleString()}' "
                    f"to '{mor_type.simpleString()}' in COW table"
                )
                spark.sql(f"""
                    ALTER TABLE {cow_table_fqn}
                    ALTER COLUMN {col} TYPE {mor_type.simpleString()}
                """)


def merge_snapshot_into_cow(mor_table_fqn: str, cow_table_fqn: str, snapshot_id: int):
    mor_df = (
        spark.read.format("iceberg")
        .option("snapshot-id", snapshot_id)
        .load(mor_table_fqn)
    )
    cow_df = spark.read.format("iceberg").load(cow_table_fqn)

    align_cow_schema(cow_table_fqn, mor_df, cow_df)

    spark.sql(f"""
        MERGE INTO {cow_table_fqn} AS target
        USING (
            SELECT *
            FROM {mor_table_fqn}
            VERSION AS OF {snapshot_id}
        ) AS source
        ON target.{PRIMARY_KEY} = source.{PRIMARY_KEY}

        WHEN MATCHED THEN
            UPDATE SET *

        WHEN NOT MATCHED THEN
            INSERT *
    """)

def _cow_has_any_snapshots(cow_table_fqn: str) -> bool:
    if not table_exists(cow_table_fqn):
        return False
    try:
        cnt = spark.sql(f"SELECT COUNT(*) AS c FROM {cow_table_fqn}.snapshots").collect()[0]["c"]
        return int(cnt) > 0
    except Exception:
        # If metadata table isn't accessible for some reason, assume it has snapshots.
        return True


def _fetch_snapshot_with_summary(table_fqn: str, snapshot_id: int) -> Optional[dict]:
    """
    Fetch a single snapshot (and its summary) by snapshot_id.
    """
    rows = spark.sql(f"""
        SELECT snapshot_id, parent_id, committed_at, operation, summary
        FROM {table_fqn}.snapshots
        WHERE snapshot_id = {snapshot_id}
    """).collect()
    if not rows:
        return None
    d = rows[0].asDict(recursive=True)
    return {
        "snapshot_id": d.get("snapshot_id"),
        "parent_id": d.get("parent_id"),
        "committed_at": d.get("committed_at"),
        "operation": d.get("operation"),
        "summary": d.get("summary"),
    }


def _set_wap_id(wap_id: Optional[Union[int, str]]):
    if wap_id is None:
        spark.sql("SET spark.wap.id=")
    else:
        spark.sql(f"SET spark.wap.id={wap_id}")


def _ensure_cow_table_from_snapshot(
    mor_table_fqn: str,
    cow_table_fqn: str,
    cow_location: str,
    snapshot_id_for_schema: int,
):
    """
    Create the COW table if missing by CTAS from a MOR snapshot.
    This also anchors the initial schema for later schema alignment.
    """
    if table_exists(cow_table_fqn):
        enable_wap_for_table(cow_table_fqn)
        return
    spark.sql(f"""
        CREATE TABLE {cow_table_fqn}
        USING iceberg
        LOCATION '{cow_location}'
        TBLPROPERTIES ('write.wap.enabled'='true')
        AS
        SELECT *
        FROM {mor_table_fqn}
        VERSION AS OF {snapshot_id_for_schema}
    """)
    enable_wap_for_table(cow_table_fqn)


def _apply_truncate_boundary(
    mor_table_fqn: str,
    cow_table_fqn: str,
    cow_location: str,
    catalog_name: str,
    boundary_snap: dict,
):
    """
    For a truncate boundary snapshot t:
    - Compact/merge its parent snapshot h into the COW table (unless h is also a boundary).
    - Commit using WAP ID = t.snapshot_id, then publish (idempotent).
    """
    t_id = boundary_snap.get("snapshot_id")
    h_id = boundary_snap.get("parent_id")
    print(f"[{mor_table_fqn}] Processing boundary {t_id}; parent(high-water)={h_id}")

    if t_id is None:
        return



    if not table_exists(cow_table_fqn) or not _cow_has_any_snapshots(cow_table_fqn):
        print(f"[{mor_table_fqn}] COW table missing/empty; creating baseline from snapshot {h_id} ...")
        _set_wap_id(t_id)
        _ensure_cow_table_from_snapshot(mor_table_fqn, cow_table_fqn, cow_location, int(h_id))
        publish_wap_changes(cow_table_fqn, catalog_name, str(t_id))
        _set_wap_id(None)
        print(f"[{mor_table_fqn}] Published WAP changes with truncate {t_id}.")
        return

    print(f"[{mor_table_fqn}] Compacting snapshot {h_id} into existing COW ...")
    _set_wap_id(t_id)
    merge_snapshot_into_cow(mor_table_fqn, cow_table_fqn, int(h_id))
    publish_wap_changes(cow_table_fqn, catalog_name, str(t_id))
    _set_wap_id(None)
    print(f"[{mor_table_fqn}] Published WAP changes with truncate {t_id}.")


def run_compaction_cycle_for_table(mor_table_fqn: str):
    cow_table_fqn, cow_location = cow_table_and_location_for(mor_table_fqn)
    catalog_name, _, _ = split_fqn(mor_table_fqn)

    # Step 1: Resume checkpoint from COW's last WAP id; re-publish it (idempotent) to finalize any half-done runs.
    if table_exists(cow_table_fqn):
        enable_wap_for_table(cow_table_fqn)

    wap_id = get_wap_id_from_table(cow_table_fqn, catalog_name)
    last_success_t = None

    if wap_id:
        print(f"[{mor_table_fqn}] Found existing WAP ID: {wap_id}. Re-publishing (idempotent)...")
        publish_wap_changes(cow_table_fqn, catalog_name, wap_id)
        last_success_t = extract_truncate_id_from_wap_id(wap_id)
        if last_success_t is not None:
            print(f"[{mor_table_fqn}] Last successful truncate checkpoint: {last_success_t}")
        else:
            print(f"[{mor_table_fqn}] Warning: Could not parse WAP ID {wap_id} as truncate snapshot id. Starting from beginning.")
    else:
        print(f"[{mor_table_fqn}] No WAP ID found; starting from earliest MOR history.")

    # Step 2/3: Truncate MOR to create the boundary for this run.
    spark.sql(f"TRUNCATE TABLE {mor_table_fqn}")

    head_snapshot_id, _ = get_latest_snapshot_and_parent_id(mor_table_fqn)
    if head_snapshot_id is None:
        print(f"[{mor_table_fqn}] No snapshots found; nothing to do.")
        return

    # Build lineage from the new truncate snapshot back to (but not including) last_success_t.
    by_id: dict = {}
    lineage: List[dict] = []

    # Optionally fetch the checkpoint snapshot so we know its summary when detecting truncates.
    if last_success_t is not None:
        chk = _fetch_snapshot_with_summary(mor_table_fqn, int(last_success_t))
        if chk is not None:
            by_id[chk["snapshot_id"]] = chk

    cur_id = head_snapshot_id
    seen = set()
    while cur_id is not None and cur_id not in seen:
        seen.add(cur_id)
        snap = _fetch_snapshot_with_summary(mor_table_fqn, int(cur_id))
        if snap is None:
            break
        by_id[snap["snapshot_id"]] = snap
        lineage.append(snap)

        parent_id = snap.get("parent_id")
        # Stop once we've reached the snapshot whose parent is the checkpoint; this ensures we only
        # reprocess snapshots strictly after last_success_t.
        if last_success_t is not None and parent_id == last_success_t:
            break
        cur_id = parent_id

    if not lineage:
        print(f"[{mor_table_fqn}] No snapshots to scan between checkpoint and current truncate; nothing to do.")
        return

    # Process in chronological order (oldest -> newest).
    lineage.reverse()

    any_boundary = False
    for snap in lineage:
        parent = by_id.get(snap.get("parent_id"))
        is_boundary = _is_truncate_boundary_snapshot(snap, parent)
        if not is_boundary:
            continue

        any_boundary = True
        t_id = snap.get("snapshot_id")

        _apply_truncate_boundary(
            mor_table_fqn=mor_table_fqn,
            cow_table_fqn=cow_table_fqn,
            cow_location=cow_location,
            catalog_name=catalog_name,
            boundary_snap=snap,
        )

    if not any_boundary:
        # If we couldn't detect any truncate boundaries by signature (summary keys missing/version diff),
        # process the head snapshot once as a synthetic boundary so we compact its parent.
        head_snap = by_id.get(head_snapshot_id)
        if head_snap is None:
            print(f"[{mor_table_fqn}] Head snapshot {head_snapshot_id} not found; nothing to do.")
            return

        print(
            f"[{mor_table_fqn}] Warning: no truncate boundaries detected by signature; "
            f"processing head snapshot {head_snapshot_id} once as boundary."
        )
        _apply_truncate_boundary(
            mor_table_fqn=mor_table_fqn,
            cow_table_fqn=cow_table_fqn,
            cow_location=cow_location,
            catalog_name=catalog_name,
            boundary_snap=head_snap,
        )


def list_tables_in_db(catalog: str, db: str):
    rows = spark.sql(f"SHOW TABLES IN {catalog}.{db}").collect()
    table_names = []
    for r in rows:
        d = r.asDict(recursive=True)
        if d.get("isTemporary", False):
            continue
        name = d.get("tableName") or d.get("table")
        if name:
            table_names.append(name)
    return table_names


# ------------------------------------------------------------------------------
# Entry Point
# ------------------------------------------------------------------------------
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="MOR -> COW compaction (REST Lakekeeper / Glue), configured from destination_details.json")
    parser.add_argument(
        "--destination-details",
        required=True,
        help="Path to destination_details.json generated by get_destination_details.sh",
    )
    parser.add_argument("--job-id", type=int, default=None, help="Optional job_id to select from destination_details.json")
    parser.add_argument("--cow-db", default=COW_DB, help="Destination namespace/database for COW tables/state")
    parser.add_argument("--catalog-name", default=None, help="Override catalog name (otherwise taken from destination config)")
    args = parser.parse_args()

    # Source DB is expected to be hardcoded in this file.
    if not DB or DB.strip() == "" or DB.strip() == "<YOUR_SOURCE_DB>":
        raise ValueError("Please set DB = '<YOUR_SOURCE_DB>' at the top of fail_test.py before running.")

    # Update globals from args
    COW_DB = args.cow_db

    writer = load_destination_writer_config(args.destination_details, job_id=args.job_id)
    if args.catalog_name:
        writer["catalog_name"] = args.catalog_name

    # Update catalog name global (used in derived FQNs)
    CATALOG = writer.get("catalog_name") or CATALOG
    _recompute_derived_names()

    # Create Spark session with the right Iceberg/S3 config
    spark = build_spark_session_from_writer(writer)

    # Ensure destination namespace exists before creating state/COW tables
    ensure_namespace_exists(CATALOG, COW_DB)

    # Always compact all MOR tables in the source namespace/database.
    all_tables = list_tables_in_db(CATALOG, DB)
    mor_tables = [
        f"{CATALOG}.{DB}.{t}"
        for t in all_tables
        if not t.endswith("_cow")
    ]

    successes = []
    failures = []

    for mor_table in mor_tables:
        try:
            run_compaction_cycle_for_table(mor_table)
            successes.append(mor_table)
        except Exception as e:
            failures.append((mor_table, str(e)))
            print(f"[{mor_table}] FAILED: {e}")

    print("---- Compaction Summary ----")
    print(f"Successful tables: {len(successes)}")
    for t in successes:
        print(f"  - {t}")
    print(f"Failed tables: {len(failures)}")
    for t, err in failures:
        print(f"  - {t}: {err}")