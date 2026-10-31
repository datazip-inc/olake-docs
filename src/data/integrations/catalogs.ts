/**
 * Iceberg catalogs OLake Go can write to.
 *
 * `rank` is the order catalogs are listed in everywhere (pickers, tables, hubs): AWS Glue first,
 * Polaris second, Lakekeeper third, then the vendor-native catalogs. `kind` is OLake's
 * `catalog_type` family; the REST flavours (Lakekeeper, Polaris, Unity, Horizon, ...) are all
 * `rest` under the hood. `docsPath` is the setup page for that catalog on this site.
 */
export type CatalogId =
  | 'glue'
  | 'polaris'
  | 'lakekeeper'
  | 'horizon'
  | 'unity'
  | 'biglake'
  | 's3tables'
  | 'nessie'
  | 'hive'
  | 'jdbc'
  | 'rest'

export interface Catalog {
  id: CatalogId
  label: string
  /** Value of `catalog_type` in destination.json. */
  catalogType: string
  /** Position in every list: lower first. */
  rank: number
  /** Who runs it. */
  vendor: 'aws' | 'gcp' | 'snowflake' | 'databricks' | 'oss'
  /** Managed service or something you host. */
  hosting: 'managed' | 'self-hosted'
  /** Setup page on this site. */
  docsPath: string
  /** Auth options OLake Go offers for it. */
  authTypes: string[]
  /** One line on when to pick it. */
  fitsWhen: string
  logo?: string
}

export const CATALOGS: Record<CatalogId, Catalog> = {
  glue: {
    id: 'glue',
    label: 'AWS Glue',
    catalogType: 'glue',
    rank: 1,
    vendor: 'aws',
    hosting: 'managed',
    docsPath: '/docs/writers/iceberg/catalog/glue/',
    authTypes: ['IAM access key', 'IAM role'],
    fitsWhen: 'Your data is on S3 and Athena, Redshift or EMR will read it.',
    logo: '/img/logo/glue.svg'
  },
  polaris: {
    id: 'polaris',
    label: 'Apache Polaris',
    catalogType: 'polaris',
    rank: 2,
    vendor: 'oss',
    hosting: 'self-hosted',
    docsPath: '/docs/writers/iceberg/catalog/rest/?rest-catalog=polaris',
    authTypes: ['OAuth2 client credentials', 'Token', 'None'],
    fitsWhen: 'You want one open catalog that several engines share, with its own access control.',
    logo: '/img/logo/polaris.webp'
  },
  lakekeeper: {
    id: 'lakekeeper',
    label: 'Lakekeeper',
    catalogType: 'lakekeeper',
    rank: 3,
    vendor: 'oss',
    hosting: 'self-hosted',
    docsPath: '/docs/writers/iceberg/catalog/rest/?rest-catalog=lakekeeper',
    authTypes: ['OAuth2 client credentials', 'Token', 'None'],
    fitsWhen: 'You run your own catalog in Docker or Kubernetes, on S3, MinIO or Azure storage.',
    logo: '/img/logo/lakekeeper.webp'
  },
  horizon: {
    id: 'horizon',
    label: 'Snowflake Horizon',
    catalogType: 'horizon',
    rank: 4,
    vendor: 'snowflake',
    hosting: 'managed',
    docsPath: '/docs/writers/iceberg/catalog/rest/?rest-catalog=horizon',
    authTypes: ['Programmatic access token (PAT)', 'Key-pair JWT', 'External OAuth', 'Workload identity federation'],
    fitsWhen: 'Snowflake is the main reader and you want the tables to appear there with no extra registration.',
    logo: '/img/logo/horizon.webp'
  },
  unity: {
    id: 'unity',
    label: 'Unity Catalog',
    catalogType: 'unity',
    rank: 5,
    vendor: 'databricks',
    hosting: 'managed',
    docsPath: '/docs/writers/iceberg/catalog/rest/?rest-catalog=unity',
    authTypes: ['OAuth2 M2M', 'OAuth2 U2M', 'Token federation', 'Personal access token'],
    fitsWhen: 'Databricks is the main reader; the tables become Unity Catalog managed Iceberg tables.',
    logo: '/img/logo/unity.webp'
  },
  biglake: {
    id: 'biglake',
    label: 'BigLake (Google Cloud Lakehouse)',
    catalogType: 'biglake',
    rank: 6,
    vendor: 'gcp',
    hosting: 'managed',
    docsPath: '/docs/writers/iceberg/catalog/rest/?rest-catalog=biglake',
    authTypes: ['Service account JSON'],
    fitsWhen: 'BigQuery or Dataproc will read the tables and the data lives in Google Cloud Storage.',
    logo: '/img/logo/biglake.webp'
  },
  s3tables: {
    id: 's3tables',
    label: 'Amazon S3 Tables',
    catalogType: 's3tables',
    rank: 7,
    vendor: 'aws',
    hosting: 'managed',
    docsPath: '/docs/writers/iceberg/catalog/rest/?rest-catalog=s3-tables',
    authTypes: ['IAM access key (SigV4)'],
    fitsWhen: 'You want AWS to run compaction and snapshot cleanup for you.',
    logo: '/img/logo/s3.webp'
  },
  nessie: {
    id: 'nessie',
    label: 'Nessie',
    catalogType: 'nessie',
    rank: 8,
    vendor: 'oss',
    hosting: 'self-hosted',
    docsPath: '/docs/writers/iceberg/catalog/rest/?rest-catalog=nessie',
    authTypes: ['OAuth2 client credentials', 'Token', 'None'],
    fitsWhen: 'You want git-style branches and tags on the catalog.',
    logo: '/img/logo/nessie.webp'
  },
  hive: {
    id: 'hive',
    label: 'Hive Metastore',
    catalogType: 'hive',
    rank: 9,
    vendor: 'oss',
    hosting: 'self-hosted',
    docsPath: '/docs/writers/iceberg/catalog/hive/',
    authTypes: ['None', 'SASL'],
    fitsWhen: 'A Hive Metastore already serves Spark, Trino or Dataproc.',
    logo: '/img/logo/hive.webp'
  },
  jdbc: {
    id: 'jdbc',
    label: 'JDBC',
    catalogType: 'jdbc',
    rank: 10,
    vendor: 'oss',
    hosting: 'self-hosted',
    docsPath: '/docs/writers/iceberg/catalog/jdbc/',
    authTypes: ['Database user and password'],
    fitsWhen: 'A Postgres or MySQL database is the simplest catalog you can run.',
    logo: '/img/logo/jdbc.webp'
  },
  rest: {
    id: 'rest',
    label: 'Generic REST',
    catalogType: 'rest',
    rank: 11,
    vendor: 'oss',
    hosting: 'self-hosted',
    docsPath: '/docs/writers/iceberg/catalog/rest/?rest-catalog=generic',
    authTypes: ['OAuth2 client credentials', 'Token', 'None'],
    fitsWhen: 'Any catalog that speaks the Iceberg REST specification and is not listed above.',
    logo: '/img/logo/rest.webp'
  }
}

export const CATALOG_IDS = (Object.keys(CATALOGS) as CatalogId[]).sort(
  (a, b) => CATALOGS[a].rank - CATALOGS[b].rank
)

/** Catalog ids in display order (Glue, Polaris, Lakekeeper, then the rest). */
export function sortCatalogs<T extends CatalogId>(ids: readonly T[]): T[] {
  return [...ids].sort((a, b) => CATALOGS[a].rank - CATALOGS[b].rank)
}
