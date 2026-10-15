export * from './sources'
export * from './catalogs'
export * from './engines'
export * from './pairs'
export * from './people'

import type { CatalogId } from './catalogs'
import type { EngineId } from './engines'
import type { SourceId } from './sources'

/**
 * The `integration` block in an integration page's front matter.
 *
 * ```yaml
 * integration:
 *   source: postgres
 *   engine: snowflake
 *   catalogs: [horizon, glue]
 *   default: horizon
 *   author: shubham
 *   reviewer: nayan
 *   tested:
 *     date: 2026-10-01
 *     olake: v0.11.2
 *     engines: ["Snowflake (Horizon)", "DuckDB 1.5.5", "Apache Spark 3.5.6 with Iceberg 1.10.0"]
 *   faq: [{ q: "...", a: "..." }]
 * ```
 */
export interface IntegrationFrontMatter {
  source: SourceId
  engine: EngineId
  catalogs: CatalogId[]
  default: CatalogId
  author: string
  reviewer: string
  tested: {
    date: string
    olake: string
    engines: string[]
    /** Catalogs with a real run behind them on this page. */
    catalogs?: CatalogId[]
    /** Short line on what the run did, shown in the "How we tested this" box. */
    summary?: string
  }
  faq?: { q: string; a: string }[]
}
