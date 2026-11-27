import type { CatalogId } from './catalogs'

/**
 * Query engines that read the Iceberg tables OLake Go writes, and what each one can read.
 *
 * This file is the single source for the engine facts the integration pages show (the
 * compatibility strip, the delete-format table, the "what this engine cannot read" notes). Every
 * fact carries the vendor page it came from in `sources`, with the date it was checked. When a
 * vendor ships something new, change it here and every page for that engine follows.
 *
 * Delete formats are OLake's upsert types: `eq` = equality deletes (Iceberg v2), `pos` =
 * positional deletes (v2), `dv` = deletion vectors (v3).
 */
export type EngineId =
  | 'snowflake'
  | 'databricks'
  | 'bigquery'
  | 'redshift'
  | 'athena'
  | 'emr'
  | 'dataproc'
  | 'trino'
  | 'starburst'
  | 'presto'
  | 'spark'
  | 'duckdb'
  | 'clickhouse'
  | 'doris'
  | 'starrocks'
  | 'fabric'
  | 'iceberg'

export type DeleteFormat = 'eq' | 'pos' | 'dv'

export type Support = 'yes' | 'no' | 'partial'

export interface CatalogSupport {
  /** Can this engine read tables registered in this catalog? */
  reads: Support
  /** How it connects, in one short phrase ("native", "catalog integration", "REST catalog"). */
  how: string
  /** Why it is partial or unsupported. */
  note?: string
}

export interface Engine {
  id: EngineId
  label: string
  /** Version the facts below were checked against. */
  version: string
  /** Delete formats the engine reads. */
  deletes: Record<DeleteFormat, Support>
  /** Short explanation of the delete-format situation, shown under the table. */
  deletesNote: string
  /**
   * Upsert type for this engine. For an engine OLake Go lists, the one OLake Go preselects with this
   * engine as the only target query engine on its default catalog: the first of eq, pos, dv that the
   * engine reads in OLake Go's read matrix (types/query_engine.go). For an engine OLake Go does not
   * list, the one to keep, set by hand when OLake Go preselects another.
   */
  recommendedDelete: DeleteFormat
  /**
   * This engine's entry in OLake Go's Target Query Engines list: the label the OLake UI picker shows
   * and the value `--target-query-engines` takes. Absent when OLake Go does not list the engine; it
   * then reads the tables without narrowing the delete formats OLake Go offers.
   */
  targetEngine?: { label: string; value: string }
  /** For an engine OLake Go does not list: a listed engine to set as the target query engine in its place. */
  standIn?: EngineId
  /** Catalogs and how the engine reads them. */
  catalogs: Partial<Record<CatalogId, CatalogSupport>>
  /** The catalog a page for this engine opens on. */
  defaultCatalog: CatalogId
  /** Public compatibility page or connector doc for the engine. */
  docsUrl: string
  /** Vendor pages the facts come from, with the check date. */
  sources: { title: string; url: string; checked: string }[]
}

export const ENGINES: Record<EngineId, Engine> = {
  snowflake: {
    id: 'snowflake',
    label: 'Snowflake',
    version: 'Horizon Catalog, external writes GA 2026-05-26',
    deletes: { eq: 'no', pos: 'yes', dv: 'yes' },
    deletesNote:
      'Snowflake reads positional deletes on Iceberg v2 tables and deletion vectors on v3 tables. Equality delete files are not supported, so never leave an OLake Go job on the default equality-delete upsert type when Snowflake reads the table.',
    recommendedDelete: 'pos',
    targetEngine: { label: 'Snowflake', value: 'snowflake' },
    catalogs: {
      horizon: { reads: 'yes', how: 'native: tables are Snowflake-managed Iceberg tables' },
      glue: { reads: 'yes', how: 'catalog integration (read-only)' },
      polaris: { reads: 'yes', how: 'catalog integration', note: 'Not yet tested on this site.' },
      lakekeeper: { reads: 'yes', how: 'catalog integration', note: 'Not yet tested on this site.' },
      unity: { reads: 'yes', how: 'catalog integration', note: 'Not yet tested on this site.' },
      s3tables: { reads: 'yes', how: 'catalog integration', note: 'Not yet tested on this site.' },
      biglake: { reads: 'yes', how: 'catalog integration', note: 'Not yet tested on this site.' },
      nessie: { reads: 'yes', how: 'catalog integration', note: 'Not yet tested on this site.' },
      hive: { reads: 'no', how: 'no catalog integration for Hive Metastore' },
      jdbc: { reads: 'no', how: 'no catalog integration for JDBC catalogs' }
    },
    defaultCatalog: 'horizon',
    docsUrl: 'https://docs.snowflake.com/en/user-guide/tables-iceberg',
    sources: [
      {
        title: 'Snowflake: Apache Iceberg tables (row-level deletes)',
        url: 'https://docs.snowflake.com/en/user-guide/tables-iceberg',
        checked: '2026-11-27'
      },
      {
        title: 'Snowflake: Horizon Catalog, Iceberg REST API for external engines',
        url: 'https://docs.snowflake.com/en/user-guide/tables-iceberg-access-using-external-query-engine-snowflake-horizon',
        checked: '2026-11-27'
      },
      {
        title: 'Snowflake release note: Horizon external writes GA',
        url: 'https://docs.snowflake.com/en/release-notes/2026/other/2026-05-26-tables-iceberg-query-using-external-query-engine-snowflake-horizon-writes-ga',
        checked: '2026-10-12'
      }
    ]
  },
  databricks: {
    id: 'databricks',
    label: 'Databricks',
    version: 'Unity Catalog, DBR 18 LTS',
    deletes: { eq: 'no', pos: 'no', dv: 'yes' },
    deletesNote:
      'Under Unity Catalog, Databricks does not read Iceberg v2 position or equality deletes. Only Iceberg v3 deletion vectors work, so the OLake Go job must use deletion vectors from the first sync.',
    recommendedDelete: 'dv',
    targetEngine: { label: 'Databricks', value: 'databricks' },
    catalogs: {
      unity: { reads: 'yes', how: 'native: Unity Catalog managed Iceberg tables' },
      glue: { reads: 'partial', how: 'foreign Iceberg tables through catalog federation (read-only)' },
      hive: { reads: 'partial', how: 'foreign Iceberg tables through catalog federation (read-only)' }
    },
    defaultCatalog: 'unity',
    docsUrl: 'https://docs.databricks.com/aws/en/iceberg/',
    sources: [
      { title: 'Databricks: Apache Iceberg on Databricks', url: 'https://docs.databricks.com/aws/en/iceberg/', checked: '2026-11-27' },
      { title: 'Databricks: Deletion vectors', url: 'https://docs.databricks.com/aws/en/tables/features/deletion-vectors', checked: '2026-10-12' }
    ]
  },
  bigquery: {
    id: 'bigquery',
    label: 'BigQuery',
    version: 'Lakehouse (BigLake) Iceberg REST catalog, v3 in preview',
    deletes: { eq: 'yes', pos: 'yes', dv: 'partial' },
    deletesNote:
      'BigQuery reads Iceberg v2 merge-on-read tables with equality and positional deletes. Deletion vectors on v3 tables are a preview feature with per-query limits, so OLake Go does not offer them while BigQuery is a target query engine.',
    recommendedDelete: 'eq',
    targetEngine: { label: 'Google BigQuery', value: 'bigquery' },
    catalogs: {
      biglake: { reads: 'yes', how: 'native: namespaces map to BigQuery datasets' },
      glue: { reads: 'partial', how: 'Lakehouse federated catalog (cross-cloud data access)' },
      horizon: { reads: 'partial', how: 'Lakehouse federated catalog (cross-cloud data access)' },
      unity: {
        reads: 'partial',
        how: 'Lakehouse federated catalog (cross-cloud data access)',
        note: 'OLake Go upserts Unity tables with deletion vectors only, which BigQuery reads in preview'
      }
    },
    defaultCatalog: 'biglake',
    docsUrl: 'https://docs.cloud.google.com/bigquery/docs/iceberg-external-tables',
    sources: [
      { title: 'BigQuery: Iceberg external tables', url: 'https://docs.cloud.google.com/bigquery/docs/iceberg-external-tables', checked: '2026-11-27' },
      { title: 'Lakehouse: Iceberg v3 binary deletion vectors', url: 'https://docs.cloud.google.com/lakehouse/docs/use-iceberg-v3-binary-deletion-vectors', checked: '2026-11-27' },
      { title: 'Lakehouse: about cross-cloud lakehouse', url: 'https://docs.cloud.google.com/lakehouse/docs/about-cross-cloud-lakehouse', checked: '2026-11-27' },
      { title: 'Lakehouse release notes (cross-cloud data access GA, 2026-11-02)', url: 'https://docs.cloud.google.com/lakehouse/docs/release-notes', checked: '2026-11-27' }
    ]
  },
  redshift: {
    id: 'redshift',
    label: 'Amazon Redshift',
    version: 'Serverless, RG or RA3; v3 on Serverless or RG, patch 204+',
    deletes: { eq: 'partial', pos: 'yes', dv: 'partial' },
    deletesNote:
      'Redshift reads positional deletes on v2 tables. Deletion vectors need Iceberg v3, which Redshift reads only on Serverless or on RG clusters (patch 204 or later), so RA3 clusters read v2 tables only. Redshift cannot use v3 tables that contain equality deletes.',
    recommendedDelete: 'pos',
    standIn: 'athena',
    catalogs: {
      glue: { reads: 'yes', how: 'external schema from the Glue Data Catalog' },
      s3tables: { reads: 'yes', how: 'Glue resource link to the S3 Tables catalog' },
      unity: {
        reads: 'partial',
        how: 'Lake Formation catalog federation only',
        note: 'OLake Go upserts Unity tables with deletion vectors, so Serverless or RG only'
      },
      polaris: { reads: 'partial', how: 'Lake Formation catalog federation only' },
      horizon: { reads: 'partial', how: 'Lake Formation catalog federation only' }
    },
    defaultCatalog: 'glue',
    docsUrl: 'https://docs.aws.amazon.com/redshift/latest/dg/querying-iceberg.html',
    sources: [
      { title: 'Redshift: Querying Apache Iceberg tables', url: 'https://docs.aws.amazon.com/redshift/latest/dg/querying-iceberg.html', checked: '2026-11-27' },
      { title: 'Redshift: Iceberg v3 features', url: 'https://docs.aws.amazon.com/redshift/latest/dg/iceberg-v3-features.html', checked: '2026-11-27' },
      { title: 'S3: Working with Apache Iceberg v3 (Redshift patch 204+)', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/working-with-apache-iceberg-v3.html', checked: '2026-11-27' }
    ]
  },
  athena: {
    id: 'athena',
    label: 'Amazon Athena',
    version: 'engine v3, Iceberg 1.4.2',
    deletes: { eq: 'yes', pos: 'yes', dv: 'no' },
    deletesNote: 'Athena reads Iceberg v2 tables with position and equality deletes. It cannot read v3 tables at all, so never pick deletion vectors.',
    recommendedDelete: 'eq',
    targetEngine: { label: 'AWS Athena', value: 'athena' },
    catalogs: {
      glue: { reads: 'yes', how: 'native: Glue Data Catalog' },
      s3tables: { reads: 'yes', how: 'S3 Tables catalog integration (lowercase names only)' },
      polaris: {
        reads: 'partial',
        how: 'Glue catalog federation (read-only)',
        note: 'AWS documents only the Snowflake and Databricks sources in detail, so validate Polaris first'
      },
      horizon: { reads: 'partial', how: 'Glue catalog federation (read-only)' },
      unity: {
        reads: 'partial',
        how: 'Glue catalog federation (read-only)',
        note: 'append-only jobs: OLake Go upserts Unity tables as v3, which Athena cannot read'
      }
    },
    defaultCatalog: 'glue',
    docsUrl: 'https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg.html',
    sources: [
      { title: 'Athena: Query Apache Iceberg tables', url: 'https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg.html', checked: '2026-11-27' },
      { title: 'S3: Working with Apache Iceberg v3', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/working-with-apache-iceberg-v3.html', checked: '2026-11-27' },
      { title: 'Lake Formation: catalog federation', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/catalog-federation.html', checked: '2026-11-27' },
      { title: 'AWS: catalog federation for Apache Iceberg tables', url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/apache-iceberg-on-aws/catalog-federation-for-apache-iceberg-tables.html', checked: '2026-11-27' }
    ]
  },
  emr: {
    id: 'emr',
    label: 'Spark on Amazon EMR',
    version: 'EMR 7.12 and later for v3',
    deletes: { eq: 'yes', pos: 'yes', dv: 'yes' },
    deletesNote: 'Spark on EMR reads every delete format. Deletion vectors need EMR 7.12 or later (Iceberg 1.10).',
    recommendedDelete: 'eq',
    standIn: 'spark',
    catalogs: {
      glue: { reads: 'yes', how: 'native: Glue Data Catalog' },
      s3tables: { reads: 'yes', how: 'S3 Tables catalog (EMR 7.5 and later)' },
      hive: { reads: 'yes', how: 'Hive Metastore' },
      lakekeeper: { reads: 'yes', how: 'REST catalog' },
      polaris: { reads: 'yes', how: 'REST catalog' }
    },
    defaultCatalog: 'glue',
    docsUrl: 'https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-iceberg-use-spark-cluster.html',
    sources: [
      { title: 'EMR: Iceberg release history', url: 'https://docs.aws.amazon.com/emr/latest/ReleaseGuide/Iceberg-release-history.html', checked: '2026-10-12' }
    ]
  },
  dataproc: {
    id: 'dataproc',
    label: 'Google Cloud Dataproc',
    version: 'Dataproc Serverless, Iceberg 1.10',
    deletes: { eq: 'yes', pos: 'yes', dv: 'yes' },
    deletesNote: 'Spark on Dataproc reads every delete format with Iceberg 1.10 jars. If BigQuery shares the table, follow the BigQuery limits instead.',
    recommendedDelete: 'eq',
    standIn: 'spark',
    catalogs: {
      biglake: { reads: 'yes', how: 'REST catalog with Google auth' },
      hive: { reads: 'yes', how: 'Dataproc Metastore (Spark only; BigQuery does not see these tables)' }
    },
    defaultCatalog: 'biglake',
    docsUrl: 'https://docs.cloud.google.com/dataproc/docs/guides/iceberg-metadata-biglake-metastore',
    sources: [
      { title: 'Dataproc: Iceberg with the Lakehouse catalog', url: 'https://docs.cloud.google.com/dataproc/docs/guides/iceberg-metadata-biglake-metastore', checked: '2026-10-12' }
    ]
  },
  trino: {
    id: 'trino',
    label: 'Trino',
    version: '484',
    deletes: { eq: 'yes', pos: 'yes', dv: 'partial' },
    deletesNote: 'Trino reads v2 position and equality deletes. Deletion vectors arrived in Trino 480 and are still labelled experimental in the docs.',
    recommendedDelete: 'eq',
    targetEngine: { label: 'Trino', value: 'trino' },
    catalogs: {
      glue: { reads: 'yes', how: 'iceberg.catalog.type=glue' },
      polaris: { reads: 'yes', how: 'REST catalog with OAuth2' },
      lakekeeper: { reads: 'yes', how: 'REST catalog with OAuth2' },
      s3tables: { reads: 'yes', how: 'REST catalog with SigV4' },
      hive: { reads: 'yes', how: 'Hive Metastore' },
      jdbc: { reads: 'yes', how: 'JDBC catalog (same catalog name as OLake Go)' },
      nessie: { reads: 'yes', how: 'Nessie catalog' },
      unity: { reads: 'yes', how: 'REST catalog' },
      horizon: { reads: 'yes', how: 'REST catalog' },
      biglake: { reads: 'yes', how: 'REST catalog with Google auth' },
      aistor: { reads: 'yes', how: 'REST catalog with SigV4 (signing name s3tables)', note: 'iceberg.rest-catalog.security=SIGV4 on Trino 477 and later' }
    },
    defaultCatalog: 'glue',
    docsUrl: 'https://trino.io/docs/current/connector/iceberg.html',
    sources: [
      { title: 'Trino: Iceberg connector', url: 'https://trino.io/docs/current/connector/iceberg.html', checked: '2026-11-27' },
      { title: 'Trino release 480', url: 'https://trino.io/docs/current/release/release-480.html', checked: '2026-11-27' },
      { title: 'Trino: release notes (484, 15 Oct 2026)', url: 'https://trino.io/docs/current/release.html', checked: '2026-11-27' },
      { title: 'MinIO: Connecting query engines to AIStor Tables', url: 'https://docs.min.io/aistor/developers/aistor-tables/connect-query-engines/', checked: '2026-11-04' }
    ]
  },
  starburst: {
    id: 'starburst',
    label: 'Starburst',
    version: 'Galaxy and SEP 2026.6.1 LTS',
    deletes: { eq: 'yes', pos: 'yes', dv: 'partial' },
    deletesNote: 'Starburst follows Trino: v2 deletes everywhere, deletion vectors on releases based on Trino 480 or later, where v3 support is experimental.',
    recommendedDelete: 'eq',
    standIn: 'trino',
    catalogs: {
      glue: { reads: 'yes', how: 'Glue catalog' },
      polaris: { reads: 'yes', how: 'Polaris catalog (public preview in Galaxy)' },
      s3tables: { reads: 'yes', how: 'S3 Tables (public preview in Galaxy)' },
      lakekeeper: { reads: 'partial', how: 'Galaxy supports Lakekeeper on Azure storage only' },
      aistor: { reads: 'yes', how: 'Trino Iceberg REST connector with SigV4 (signing name s3tables)' }
    },
    defaultCatalog: 'glue',
    docsUrl: 'https://docs.starburst.io/latest/connector/iceberg.html',
    sources: [
      { title: 'Starburst Galaxy: catalogs', url: 'https://docs.starburst.io/starburst-galaxy/working-with-data/create-catalogs/index.html', checked: '2026-10-12' },
      { title: 'Starburst Galaxy: S3 Tables catalog (public preview)', url: 'https://docs.starburst.io/starburst-galaxy/working-with-data/create-catalogs/non-object-storage/s3tables.html', checked: '2026-11-27' },
      { title: 'Starburst Enterprise: Iceberg connector', url: 'https://docs.starburst.io/latest/connector/iceberg.html', checked: '2026-11-27' },
      { title: 'Starburst Enterprise: release notes', url: 'https://docs.starburst.io/latest/release.html', checked: '2026-11-27' },
      { title: 'MinIO: Connecting query engines to AIStor Tables', url: 'https://docs.min.io/aistor/developers/aistor-tables/connect-query-engines/', checked: '2026-11-04' }
    ]
  },
  presto: {
    id: 'presto',
    label: 'Presto',
    version: '0.299',
    deletes: { eq: 'partial', pos: 'yes', dv: 'partial' },
    deletesNote: 'Presto reads position deletes on both Java and native workers. Equality deletes need Java workers; deletion vectors only on Presto C++ 0.299 and later. OLake Go preselects equality deletes for Presto, so switch the streams to positional deletes by hand on native workers.',
    recommendedDelete: 'eq',
    targetEngine: { label: 'Presto', value: 'presto' },
    catalogs: {
      glue: { reads: 'yes', how: 'Hive catalog type with hive.metastore=glue' },
      polaris: { reads: 'yes', how: 'REST catalog with OAuth2' },
      lakekeeper: { reads: 'yes', how: 'REST catalog with OAuth2' },
      hive: { reads: 'yes', how: 'Hive Metastore' },
      nessie: { reads: 'yes', how: 'Nessie catalog' }
    },
    defaultCatalog: 'glue',
    docsUrl: 'https://prestodb.io/docs/current/connector/iceberg.html',
    sources: [
      { title: 'Presto: Iceberg connector', url: 'https://prestodb.io/docs/current/connector/iceberg.html', checked: '2026-10-12' },
      { title: 'Presto: Iceberg connector docs source (Presto C++ limits)', url: 'https://github.com/prestodb/presto/blob/master/presto-docs/src/main/sphinx/connector/iceberg.rst', checked: '2026-11-27' }
    ]
  },
  spark: {
    id: 'spark',
    label: 'Apache Spark',
    version: '3.5, 4.0 or 4.1 with Iceberg 1.12',
    deletes: { eq: 'yes', pos: 'yes', dv: 'yes' },
    deletesNote: 'Spark with the Iceberg runtime reads every delete format. Deletion vectors need Iceberg 1.8 or later on the classpath.',
    recommendedDelete: 'eq',
    targetEngine: { label: 'Apache Spark', value: 'spark' },
    catalogs: {
      glue: { reads: 'yes', how: 'type=glue' },
      polaris: { reads: 'yes', how: 'type=rest with OAuth2' },
      lakekeeper: { reads: 'yes', how: 'type=rest with OAuth2' },
      horizon: { reads: 'yes', how: 'type=rest with a Snowflake token' },
      unity: { reads: 'yes', how: 'type=rest with OAuth2' },
      biglake: { reads: 'yes', how: 'type=rest with Google auth' },
      s3tables: { reads: 'yes', how: 'type=rest with SigV4' },
      nessie: { reads: 'yes', how: 'type=nessie' },
      hive: { reads: 'yes', how: 'type=hive' },
      jdbc: { reads: 'yes', how: 'type=jdbc' },
      rest: { reads: 'yes', how: 'type=rest' },
      aistor: { reads: 'yes', how: 'REST catalog with rest.sigv4-enabled and rest.signing-name=s3tables' }
    },
    defaultCatalog: 'glue',
    docsUrl: 'https://iceberg.apache.org/docs/latest/spark-configuration/',
    sources: [
      { title: 'Iceberg: Spark configuration', url: 'https://iceberg.apache.org/docs/latest/spark-configuration/', checked: '2026-10-12' },
      { title: 'Iceberg: multi-engine support (maintained Spark versions)', url: 'https://iceberg.apache.org/multi-engine-support/', checked: '2026-11-27' },
      { title: 'Iceberg: releases (1.8.0 reads deletion vectors)', url: 'https://iceberg.apache.org/releases/', checked: '2026-11-27' },
      { title: 'MinIO: Connecting query engines to AIStor Tables', url: 'https://docs.min.io/aistor/developers/aistor-tables/connect-query-engines/', checked: '2026-11-04' }
    ]
  },
  duckdb: {
    id: 'duckdb',
    label: 'DuckDB',
    version: '2.0.1 LTS; deletion vectors since duckdb-iceberg 1.5.3',
    deletes: { eq: 'partial', pos: 'yes', dv: 'yes' },
    deletesNote: 'DuckDB reads positional deletes and, since duckdb-iceberg 1.5.3, deletion vectors. Equality delete reads are undocumented; they returned correct rows on the runs on this site (duckdb-iceberg 1.5.x, checked 2026-10-29). OLake Go preselects equality deletes for DuckDB, so switch the streams to positional deletes by hand when DuckDB is the main reader.',
    recommendedDelete: 'eq',
    targetEngine: { label: 'DuckDB', value: 'duckdb' },
    catalogs: {
      glue: { reads: 'yes', how: 'ATTACH with ENDPOINT_TYPE glue (needs Lake Formation grants)' },
      polaris: { reads: 'yes', how: 'ATTACH to the REST endpoint' },
      lakekeeper: { reads: 'yes', how: 'ATTACH to the REST endpoint' },
      horizon: { reads: 'yes', how: 'ATTACH to the Horizon REST endpoint with a Snowflake token' },
      unity: { reads: 'yes', how: 'ATTACH to the Unity REST endpoint (AWS-hosted workspaces)' },
      biglake: { reads: 'yes', how: 'ATTACH with a Google access token' },
      s3tables: { reads: 'yes', how: 'ATTACH with ENDPOINT_TYPE s3_tables' },
      hive: { reads: 'no', how: 'DuckDB attaches REST catalogs only' },
      jdbc: { reads: 'no', how: 'DuckDB attaches REST catalogs only' },
      aistor: { reads: 'yes', how: 'ATTACH with AUTHORIZATION_TYPE sigv4 and SIGV4_SERVICE s3tables', note: 'DuckDB 1.5 or later; single-level namespaces only' }
    },
    defaultCatalog: 'glue',
    docsUrl: 'https://duckdb.org/docs/current/core_extensions/iceberg/catalogs.html',
    sources: [
      { title: 'DuckDB: Iceberg REST catalogs', url: 'https://duckdb.org/docs/current/core_extensions/iceberg/catalogs.html', checked: '2026-11-27' },
      { title: 'DuckDB: new Iceberg features (v3 support)', url: 'https://duckdb.org/2026/05/29/new-iceberg-features', checked: '2026-11-27' },
      { title: 'DuckDB: announcing DuckDB 2.0.1 LTS', url: 'https://duckdb.org/2026/11/20/announcing-duckdb-201.html', checked: '2026-11-27' },
      { title: 'MinIO: Connecting query engines to AIStor Tables', url: 'https://docs.min.io/aistor/developers/aistor-tables/connect-query-engines/', checked: '2026-11-04' }
    ]
  },
  clickhouse: {
    id: 'clickhouse',
    label: 'ClickHouse',
    version: '26.10 (LTS 26.8)',
    deletes: { eq: 'yes', pos: 'yes', dv: 'partial' },
    deletesNote: 'ClickHouse reads position deletes, equality deletes from 25.8, and deletion vectors from 26.10, where the changelog lists them as an experimental feature. The 26.8 LTS release does not read deletion vectors.',
    recommendedDelete: 'eq',
    targetEngine: { label: 'ClickHouse', value: 'clickhouse' },
    catalogs: {
      glue: { reads: 'yes', how: 'DataLakeCatalog with catalog_type glue (beta)' },
      polaris: { reads: 'yes', how: 'DataLakeCatalog with catalog_type rest' },
      lakekeeper: { reads: 'yes', how: 'DataLakeCatalog with catalog_type rest' },
      horizon: { reads: 'yes', how: 'DataLakeCatalog with catalog_type horizon' },
      unity: { reads: 'yes', how: 'DataLakeCatalog with catalog_type unity (external locations only)' },
      biglake: { reads: 'yes', how: 'DataLakeCatalog with catalog_type biglake' },
      s3tables: { reads: 'yes', how: 'DataLakeCatalog with catalog_type s3tables (26.8 and later)' },
      nessie: { reads: 'yes', how: 'DataLakeCatalog with catalog_type rest' },
      hive: { reads: 'partial', how: 'experimental hive catalog' },
      jdbc: { reads: 'no', how: 'no JDBC catalog support' },
      aistor: { reads: 'yes', how: 'REST with an OAuth2 bearer token from the catalog token endpoint', note: 'ClickHouse cannot sign catalog requests with SigV4' }
    },
    defaultCatalog: 'glue',
    docsUrl: 'https://clickhouse.com/docs/engines/table-engines/integrations/iceberg',
    sources: [
      { title: 'ClickHouse: Iceberg table engine', url: 'https://clickhouse.com/docs/engines/table-engines/integrations/iceberg', checked: '2026-11-27' },
      { title: 'ClickHouse changelog 2026 (26.10 deletion vectors, 26.8 S3 Tables catalog)', url: 'https://clickhouse.com/docs/whats-new/changelog', checked: '2026-11-27' },
      { title: 'ClickHouse PR 110781 (deletion vectors)', url: 'https://github.com/ClickHouse/ClickHouse/pull/110781', checked: '2026-10-12' },
      { title: 'MinIO: Connecting query engines to AIStor Tables', url: 'https://docs.min.io/aistor/developers/aistor-tables/connect-query-engines/', checked: '2026-11-04' }
    ]
  },
  doris: {
    id: 'doris',
    label: 'Apache Doris',
    version: '4.1',
    deletes: { eq: 'yes', pos: 'yes', dv: 'yes' },
    deletesNote: 'Doris reads position and equality deletes on 3.x and 4.0; deletion vectors from 4.1.0.',
    recommendedDelete: 'eq',
    catalogs: {
      glue: { reads: 'yes', how: 'iceberg.catalog.type glue' },
      polaris: { reads: 'yes', how: 'REST catalog with OAuth2' },
      lakekeeper: { reads: 'yes', how: 'REST catalog with vended credentials' },
      s3tables: { reads: 'yes', how: 'REST catalog with SigV4' },
      hive: { reads: 'yes', how: 'Hive Metastore' },
      jdbc: { reads: 'partial', how: 'experimental JDBC catalog (4.1 and later)' }
    },
    defaultCatalog: 'glue',
    docsUrl: 'https://doris.apache.org/docs/lakehouse/catalogs/iceberg-catalog',
    sources: [
      { title: 'Doris: Iceberg catalog', url: 'https://doris.apache.org/docs/lakehouse/catalogs/iceberg-catalog', checked: '2026-11-27' }
    ]
  },
  starrocks: {
    id: 'starrocks',
    label: 'StarRocks',
    version: '4.1',
    deletes: { eq: 'partial', pos: 'yes', dv: 'no' },
    deletesNote: 'StarRocks reads position deletes, and equality deletes from 3.2.5 (a NULL-key bug was fixed in 3.5.19). No released version reads deletion vectors. OLake Go preselects equality deletes for StarRocks, so switch the streams to positional deletes by hand on earlier releases.',
    recommendedDelete: 'eq',
    targetEngine: { label: 'StarRocks', value: 'starrocks' },
    catalogs: {
      glue: { reads: 'yes', how: 'iceberg.catalog.type glue' },
      polaris: { reads: 'yes', how: 'REST catalog with OAuth2' },
      lakekeeper: { reads: 'yes', how: 'REST catalog with OAuth2' },
      hive: { reads: 'yes', how: 'Hive Metastore' },
      jdbc: { reads: 'yes', how: 'JDBC catalog (same catalog name as OLake Go)' }
    },
    defaultCatalog: 'glue',
    docsUrl: 'https://docs.starrocks.io/docs/data_source/catalog/iceberg/',
    sources: [
      { title: 'StarRocks: Iceberg catalog', url: 'https://docs.starrocks.io/docs/data_source/catalog/iceberg/', checked: '2026-10-31' }
    ]
  },
  iceberg: {
    id: 'iceberg',
    label: 'Apache Iceberg',
    version: 'table format v2 and v3, read through an Iceberg REST catalog',
    deletes: { eq: 'yes', pos: 'yes', dv: 'yes' },
    deletesNote:
      'The Iceberg spec defines all three delete formats; what a reader can open depends on the engine. OLake Go picks the format every target query engine on the job reads, so list the engines that will read the tables.',
    recommendedDelete: 'eq',
    catalogs: {
      glue: { reads: 'yes', how: 'any engine with the Iceberg AWS bundle' },
      polaris: { reads: 'yes', how: 'any Iceberg REST client with OAuth2' },
      lakekeeper: { reads: 'yes', how: 'any Iceberg REST client with OAuth2' },
      s3tables: { reads: 'yes', how: 'Iceberg REST with SigV4' },
      nessie: { reads: 'yes', how: 'Nessie or REST client' },
      hive: { reads: 'yes', how: 'Hive Metastore client' },
      jdbc: { reads: 'yes', how: 'Iceberg JDBC catalog' },
      rest: { reads: 'yes', how: 'any Iceberg REST client' },
      aistor: { reads: 'yes', how: 'Iceberg REST catalog built into the object store' }
    },
    defaultCatalog: 'polaris',
    docsUrl: 'https://iceberg.apache.org/spec/',
    sources: [
      { title: 'Apache Iceberg: table spec', url: 'https://iceberg.apache.org/spec/', checked: '2026-10-30' },
      { title: 'Apache Iceberg: REST catalog spec', url: 'https://iceberg.apache.org/rest-catalog-spec/', checked: '2026-10-30' },
      { title: 'MinIO: Connecting query engines to AIStor Tables', url: 'https://docs.min.io/aistor/developers/aistor-tables/connect-query-engines/', checked: '2026-11-04' }
    ]
  },
  fabric: {
    id: 'fabric',
    label: 'Microsoft Fabric',
    version: 'OneLake Iceberg table APIs (preview)',
    deletes: { eq: 'no', pos: 'yes', dv: 'yes' },
    deletesNote: 'Fabric reads Iceberg through Delta virtualization: position deletes and deletion vectors convert, equality deletes fail conversion.',
    recommendedDelete: 'pos',
    catalogs: {
      lakekeeper: { reads: 'yes', how: 'OneLake shortcut to the table folder on ADLS' },
      unity: { reads: 'yes', how: 'Azure Databricks Unity Catalog' }
    },
    defaultCatalog: 'lakekeeper',
    docsUrl: 'https://learn.microsoft.com/en-us/fabric/onelake/onelake-iceberg-tables',
    sources: [
      { title: 'Microsoft Fabric: Iceberg tables in OneLake', url: 'https://learn.microsoft.com/en-us/fabric/onelake/onelake-iceberg-tables', checked: '2026-10-12' }
    ]
  }
}

export const ENGINE_IDS = Object.keys(ENGINES) as EngineId[]

export const DELETE_FORMAT_LABELS: Record<DeleteFormat, string> = {
  eq: 'Equality deletes (v2)',
  pos: 'Positional deletes (v2)',
  dv: 'Deletion vectors (v3)'
}
