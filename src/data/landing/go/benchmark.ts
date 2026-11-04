import type { BenchmarkMode, ConnectorId } from '@site/src/data/benchmarkData'

/** Copy of the dark "Benchmarks" section. The numbers themselves live in src/data/benchmarkData.ts. */
export const GO_BENCHMARK_INTRO = {
  eyebrow: 'Benchmarks',
  title: 'Get the OLake Go Advantage'
}

/** The design greys the figures and keeps the prose white: those runs are marked `muted: true`. */
export const GO_BENCHMARK_SUMMARY: { text: string; muted?: boolean }[] = [
  { text: 'OLake Go replicates up to ' },
  { text: '12.5× faster than Fivetran', muted: true },
  { text: ' and ' },
  { text: '35–1000× faster than other open-source tools, ', muted: true },
  { text: 'syncing ' },
  { text: '50M CDC changes in 15 minutes', muted: true },
  { text: '.' }
]

export const GO_BENCHMARK_MODES: { id: BenchmarkMode; label: string }[] = [
  { id: 'full_load', label: 'Full Load' },
  { id: 'cdc', label: 'CDC' }
]

/**
 * Two-line caption above the table, e.g. "Time to move 4.01 billion rows," / "Postgres to Apache
 * Iceberg, full load". `rows` is the OLake row count, '-' while a source has no published numbers.
 */
export function goBenchmarkCaption(
  mode: BenchmarkMode,
  rows: string,
  source: string
): [string, string] {
  const amount = rows && rows !== '-' ? `${rows.toLowerCase()} ` : ''
  return mode === 'cdc'
    ? [`Time to sync ${amount}CDC changes,`, `${source} to Apache Iceberg`]
    : [`Time to move ${amount}rows,`, `${source} to Apache Iceberg, full load`]
}

/** Source tabs of the table, in the design's order. */
export const GO_BENCHMARK_CONNECTORS: ConnectorId[] = [
  'postgres',
  'mysql',
  'kafka',
  'mssql',
  'mongodb'
]

/** Row labels, in the design's title case. */
export const GO_BENCHMARK_METRIC_LABELS = {
  rowsSynced: 'Rows Synced',
  elapsedTime: 'Elapsed Time',
  speed: 'Speed (Rows/s)',
  comparison: 'Comparison',
  cost: 'Cost'
}

export const GO_BENCHMARK_LINK = {
  label: 'View detailed benchmarks',
  href: '/docs/benchmarks/ingestion'
}

export const GO_BENCHMARK_COST_NOTE =
  'OLake is OSS and self-hosted — only pay for your infrastructure.'

/** The notes under the table. */
export const GO_BENCHMARK_HOW = {
  title: 'How OLake Go does this',
  items: [
    {
      term: 'Parallel chunking',
      body: 'OLake Go splits large tables into chunks and loads them concurrently for maximum throughput.'
    },
    {
      term: 'Native Iceberg writes',
      body: 'data lands directly in open Apache Iceberg tables with no proprietary staging layer.'
    }
  ]
}
