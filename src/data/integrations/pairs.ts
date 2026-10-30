import type { CatalogId } from './catalogs'
import type { EngineId } from './engines'
import type { SourceId } from './sources'

/**
 * The integration pages: one entry per (source, engine) pair.
 *
 * `status` drives the sidebar and the checks: a `live` pair must have a page under
 * docs/integrations/<slug>.mdx that passes `node scripts/integrations/check.mjs`; a `draft` page
 * exists but stays `unlisted`; a `planned` pair has no page yet. `catalogs` lists the catalogs the
 * page offers in its picker (display order comes from catalogs.ts), and `tested` the ones with a
 * real run behind them. Add a pair here first, then run the scaffold script.
 */
export type PairStatus = 'planned' | 'draft' | 'live'

export interface Pair {
  source: SourceId
  engine: EngineId
  /** URL slug under /docs/integrations/. */
  slug: string
  status: PairStatus
  /** Catalogs offered on the page. */
  catalogs: CatalogId[]
  /** Catalog the page opens on. */
  defaultCatalog: CatalogId
  /** Catalogs with a real end-to-end run behind them. */
  tested: CatalogId[]
  /** Engines shown in the cross-engine section at the end of the page. */
  alsoRead: EngineId[]
}

export const PAIRS: Pair[] = [
  {
    source: 'postgres',
    engine: 'snowflake',
    slug: 'postgres-to-snowflake',
    status: 'draft',
    catalogs: ['horizon', 'glue'],
    defaultCatalog: 'horizon',
    tested: ['horizon'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'mysql',
    engine: 'snowflake',
    slug: 'mysql-to-snowflake',
    status: 'draft',
    catalogs: ['horizon', 'glue'],
    defaultCatalog: 'horizon',
    tested: ['horizon'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'mongodb',
    engine: 'snowflake',
    slug: 'mongodb-to-snowflake',
    status: 'draft',
    catalogs: ['horizon', 'glue'],
    defaultCatalog: 'horizon',
    tested: ['horizon'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'oracle',
    engine: 'snowflake',
    slug: 'oracle-to-snowflake',
    status: 'draft',
    catalogs: ['horizon', 'glue'],
    defaultCatalog: 'horizon',
    tested: ['horizon'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'mssql',
    engine: 'snowflake',
    slug: 'sql-server-to-snowflake',
    status: 'draft',
    catalogs: ['horizon', 'glue'],
    defaultCatalog: 'horizon',
    tested: ['horizon'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'db2',
    engine: 'snowflake',
    slug: 'db2-to-snowflake',
    status: 'draft',
    catalogs: ['horizon', 'glue'],
    defaultCatalog: 'horizon',
    tested: ['horizon'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'mariadb',
    engine: 'snowflake',
    slug: 'mariadb-to-snowflake',
    status: 'draft',
    catalogs: ['horizon', 'glue'],
    defaultCatalog: 'horizon',
    tested: ['horizon'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'kafka',
    engine: 'snowflake',
    slug: 'kafka-to-snowflake',
    status: 'draft',
    catalogs: ['horizon', 'glue'],
    defaultCatalog: 'horizon',
    tested: ['horizon'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 's3',
    engine: 'snowflake',
    slug: 's3-to-snowflake',
    status: 'draft',
    catalogs: ['horizon', 'glue'],
    defaultCatalog: 'horizon',
    tested: ['horizon'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'postgres',
    engine: 'clickhouse',
    slug: 'postgres-to-clickhouse',
    status: 'draft',
    catalogs: ['polaris'],
    defaultCatalog: 'polaris',
    tested: ['polaris'],
    alsoRead: ['duckdb', 'trino']
  },
  {
    source: 'mysql',
    engine: 'clickhouse',
    slug: 'mysql-to-clickhouse',
    status: 'draft',
    catalogs: ['polaris'],
    defaultCatalog: 'polaris',
    tested: ['polaris'],
    alsoRead: ['duckdb', 'trino']
  },
  {
    source: 'mongodb',
    engine: 'clickhouse',
    slug: 'mongodb-to-clickhouse',
    status: 'draft',
    catalogs: ['polaris'],
    defaultCatalog: 'polaris',
    tested: ['polaris'],
    alsoRead: ['duckdb', 'trino']
  },
  {
    source: 'mssql',
    engine: 'clickhouse',
    slug: 'sql-server-to-clickhouse',
    status: 'draft',
    catalogs: ['polaris'],
    defaultCatalog: 'polaris',
    tested: ['polaris'],
    alsoRead: ['duckdb', 'trino']
  },
  {
    source: 'db2',
    engine: 'clickhouse',
    slug: 'db2-to-clickhouse',
    status: 'draft',
    catalogs: ['polaris'],
    defaultCatalog: 'polaris',
    tested: ['polaris'],
    alsoRead: ['duckdb', 'trino']
  },
  {
    source: 'mysql',
    engine: 'duckdb',
    slug: 'mysql-to-duckdb',
    status: 'draft',
    catalogs: ['polaris'],
    defaultCatalog: 'polaris',
    tested: ['polaris'],
    alsoRead: ['clickhouse', 'trino']
  },
  {
    source: 'postgres',
    engine: 'duckdb',
    slug: 'postgres-to-duckdb',
    status: 'draft',
    catalogs: ['polaris'],
    defaultCatalog: 'polaris',
    tested: ['polaris'],
    alsoRead: ['clickhouse', 'trino']
  },
  {
    source: 'postgres',
    engine: 'bigquery',
    slug: 'postgres-to-bigquery',
    status: 'draft',
    catalogs: ['biglake'],
    defaultCatalog: 'biglake',
    tested: ['biglake'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'oracle',
    engine: 'bigquery',
    slug: 'oracle-to-bigquery',
    status: 'draft',
    catalogs: ['biglake'],
    defaultCatalog: 'biglake',
    tested: ['biglake'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'mongodb',
    engine: 'bigquery',
    slug: 'mongodb-to-bigquery',
    status: 'draft',
    catalogs: ['biglake'],
    defaultCatalog: 'biglake',
    tested: ['biglake'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'mysql',
    engine: 'bigquery',
    slug: 'mysql-to-bigquery',
    status: 'draft',
    catalogs: ['biglake'],
    defaultCatalog: 'biglake',
    tested: ['biglake'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'kafka',
    engine: 'bigquery',
    slug: 'kafka-to-bigquery',
    status: 'draft',
    catalogs: ['biglake'],
    defaultCatalog: 'biglake',
    tested: ['biglake'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'mariadb',
    engine: 'bigquery',
    slug: 'mariadb-to-bigquery',
    status: 'draft',
    catalogs: ['biglake'],
    defaultCatalog: 'biglake',
    tested: ['biglake'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 's3',
    engine: 'bigquery',
    slug: 's3-to-bigquery',
    status: 'draft',
    catalogs: ['biglake'],
    defaultCatalog: 'biglake',
    tested: ['biglake'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'db2',
    engine: 'bigquery',
    slug: 'db2-to-bigquery',
    status: 'draft',
    catalogs: ['biglake'],
    defaultCatalog: 'biglake',
    tested: ['biglake'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'mssql',
    engine: 'bigquery',
    slug: 'sql-server-to-bigquery',
    status: 'draft',
    catalogs: ['biglake'],
    defaultCatalog: 'biglake',
    tested: ['biglake'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'postgres',
    engine: 'redshift',
    slug: 'postgres-to-redshift',
    status: 'draft',
    catalogs: ['glue'],
    defaultCatalog: 'glue',
    tested: ['glue'],
    alsoRead: ['athena', 'duckdb']
  },
  {
    source: 'oracle',
    engine: 'redshift',
    slug: 'oracle-to-redshift',
    status: 'draft',
    catalogs: ['glue'],
    defaultCatalog: 'glue',
    tested: ['glue'],
    alsoRead: ['athena', 'duckdb']
  },
  {
    source: 'kafka',
    engine: 'redshift',
    slug: 'kafka-to-redshift',
    status: 'draft',
    catalogs: ['glue'],
    defaultCatalog: 'glue',
    tested: ['glue'],
    alsoRead: ['athena', 'duckdb']
  },
  {
    source: 'mysql',
    engine: 'redshift',
    slug: 'mysql-to-redshift',
    status: 'draft',
    catalogs: ['glue'],
    defaultCatalog: 'glue',
    tested: ['glue'],
    alsoRead: ['athena', 'duckdb']
  },
  {
    source: 'mongodb',
    engine: 'redshift',
    slug: 'mongodb-to-redshift',
    status: 'draft',
    catalogs: ['glue'],
    defaultCatalog: 'glue',
    tested: ['glue'],
    alsoRead: ['athena', 'duckdb']
  },
  {
    source: 'mariadb',
    engine: 'redshift',
    slug: 'mariadb-to-redshift',
    status: 'draft',
    catalogs: ['glue'],
    defaultCatalog: 'glue',
    tested: ['glue'],
    alsoRead: ['athena', 'duckdb']
  },
  {
    source: 's3',
    engine: 'redshift',
    slug: 's3-to-redshift',
    status: 'draft',
    catalogs: ['glue'],
    defaultCatalog: 'glue',
    tested: ['glue'],
    alsoRead: ['athena', 'duckdb']
  },
  {
    source: 'mssql',
    engine: 'redshift',
    slug: 'sql-server-to-redshift',
    status: 'draft',
    catalogs: ['glue'],
    defaultCatalog: 'glue',
    tested: ['glue'],
    alsoRead: ['athena', 'duckdb']
  },
  {
    source: 'db2',
    engine: 'redshift',
    slug: 'db2-to-redshift',
    status: 'draft',
    catalogs: ['glue'],
    defaultCatalog: 'glue',
    tested: ['glue'],
    alsoRead: ['athena', 'duckdb']
  },
  {
    source: 'postgres',
    engine: 'databricks',
    slug: 'postgres-to-databricks',
    status: 'draft',
    catalogs: ['unity'],
    defaultCatalog: 'unity',
    tested: ['unity'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'mysql',
    engine: 'databricks',
    slug: 'mysql-to-databricks',
    status: 'draft',
    catalogs: ['unity'],
    defaultCatalog: 'unity',
    tested: ['unity'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'mariadb',
    engine: 'databricks',
    slug: 'mariadb-to-databricks',
    status: 'draft',
    catalogs: ['unity'],
    defaultCatalog: 'unity',
    tested: ['unity'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'mongodb',
    engine: 'databricks',
    slug: 'mongodb-to-databricks',
    status: 'draft',
    catalogs: ['unity'],
    defaultCatalog: 'unity',
    tested: ['unity'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'oracle',
    engine: 'databricks',
    slug: 'oracle-to-databricks',
    status: 'draft',
    catalogs: ['unity'],
    defaultCatalog: 'unity',
    tested: ['unity'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'mssql',
    engine: 'databricks',
    slug: 'sql-server-to-databricks',
    status: 'draft',
    catalogs: ['unity'],
    defaultCatalog: 'unity',
    tested: ['unity'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'kafka',
    engine: 'databricks',
    slug: 'kafka-to-databricks',
    status: 'draft',
    catalogs: ['unity'],
    defaultCatalog: 'unity',
    tested: ['unity'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 's3',
    engine: 'databricks',
    slug: 's3-to-databricks',
    status: 'draft',
    catalogs: ['unity'],
    defaultCatalog: 'unity',
    tested: ['unity'],
    alsoRead: ['duckdb', 'spark']
  },
  {
    source: 'postgres',
    engine: 'iceberg',
    slug: 'postgres-to-iceberg',
    status: 'draft',
    catalogs: ['polaris'],
    defaultCatalog: 'polaris',
    tested: ['polaris'],
    alsoRead: ['spark', 'duckdb', 'trino']
  },
  {
    source: 'mysql',
    engine: 'iceberg',
    slug: 'mysql-to-iceberg',
    status: 'draft',
    catalogs: ['polaris'],
    defaultCatalog: 'polaris',
    tested: ['polaris'],
    alsoRead: ['spark', 'duckdb', 'trino']
  },
  {
    source: 'mongodb',
    engine: 'iceberg',
    slug: 'mongodb-to-iceberg',
    status: 'draft',
    catalogs: ['polaris'],
    defaultCatalog: 'polaris',
    tested: ['polaris'],
    alsoRead: ['spark', 'duckdb', 'trino']
  },
  {
    source: 'oracle',
    engine: 'iceberg',
    slug: 'oracle-to-iceberg',
    status: 'draft',
    catalogs: ['polaris'],
    defaultCatalog: 'polaris',
    tested: ['polaris'],
    alsoRead: ['spark', 'duckdb', 'trino']
  },
  {
    source: 'mssql',
    engine: 'iceberg',
    slug: 'sql-server-to-iceberg',
    status: 'draft',
    catalogs: ['polaris'],
    defaultCatalog: 'polaris',
    tested: ['polaris'],
    alsoRead: ['spark', 'duckdb', 'trino']
  },
  {
    source: 'kafka',
    engine: 'iceberg',
    slug: 'kafka-to-iceberg',
    status: 'draft',
    catalogs: ['polaris'],
    defaultCatalog: 'polaris',
    tested: ['polaris'],
    alsoRead: ['spark', 'duckdb', 'trino']
  },
  {
    source: 'kafka',
    engine: 'clickhouse',
    slug: 'kafka-to-clickhouse',
    status: 'draft',
    catalogs: ['polaris'],
    defaultCatalog: 'polaris',
    tested: ['polaris'],
    alsoRead: ['duckdb', 'trino']
  }
]
