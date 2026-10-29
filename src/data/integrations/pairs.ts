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
    status: 'planned',
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
  }
]

export function findPair(source: string, engine: string): Pair | undefined {
  return PAIRS.find((p) => p.source === source && p.engine === engine)
}

export function pairBySlug(slug: string): Pair | undefined {
  return PAIRS.find((p) => p.slug === slug)
}
