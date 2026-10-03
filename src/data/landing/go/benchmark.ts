import type { BenchmarkMode } from '@site/src/data/benchmarkData'

/** Copy of the "OLake Advantage" benchmark block. The numbers themselves live in src/data/benchmarkData.ts. */
export const GO_BENCHMARK_INTRO = {
  eyebrow: 'The OLake Advantage',
  title: 'Get the OLake Go Advantage'
}

/** Bold runs are marked with `strong: true`. */
export const GO_BENCHMARK_SUMMARY: { text: string; strong?: boolean }[] = [
  { text: 'OLake Go replicates up to ' },
  { text: '12.5× faster', strong: true },
  { text: ' than Fivetran and ' },
  { text: '35–1000× faster', strong: true },
  { text: ' than other open-source tools, syncing ' },
  { text: '50M CDC changes in 15 minutes', strong: true },
  { text: '.' }
]

export const GO_BENCHMARK_MODES: { id: BenchmarkMode; label: string }[] = [
  { id: 'full_load', label: 'Full Load' },
  { id: 'cdc', label: 'CDC' }
]

export const GO_BENCHMARK_LINK = {
  label: 'View all performance benchmarks',
  href: '/docs/benchmarks/ingestion'
}

export const GO_BENCHMARK_COST_NOTE = 'OLake is OSS and self-hosted — only pay for your infrastructure.'

/** The disclosure under the table. */
export const GO_BENCHMARK_INFO = {
  title: 'How OLake Go does this',
  icon: { src: '/img/landing/shared/benchmark-info-icon.webp', width: 96, height: 96 },
  items: [
    {
      term: 'Parallel chunking',
      body: '— OLake Go splits large tables into chunks and loads them concurrently for maximum throughput.'
    },
    {
      term: 'Native Iceberg writes',
      body: '— data lands directly in open Apache Iceberg tables with no proprietary staging layer.'
    }
  ]
}
