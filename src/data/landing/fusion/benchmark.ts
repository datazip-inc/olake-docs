/** Fusion vs Spark compaction benchmark as published on the OLake Fusion page. */
export interface BenchmarkRow {
  metric: string
  spark: string
  fusion: string
  /** The green badge next to the Fusion value. */
  delta: string
}

export const BENCHMARK = {
  eyebrow: 'Benchmarks',
  title: 'Engineered for Performance',
  /** Rendered with `2.06× ` and `half the cost` in bold. */
  lead: {
    before: 'OLake Fusion compacts Apache Iceberg tables ',
    boldSpeed: '2.06× ',
    middle: 'faster than Apache Spark and at roughly ',
    boldCost: 'half the cost',
    after: '.'
  },
  headers: { metric: 'Metrics', spark: 'Spark compaction', fusionBrand: 'OLake', fusionProduct: 'Fusion' },
  rows: [
    { metric: 'Total compaction time', spark: '55m 47s', fusion: '27m 02s', delta: '2.06X Faster' },
    { metric: 'Compaction cost / job', spark: '$2.19', fusion: '$1.06', delta: '52% Less Cost' },
    { metric: 'Config parameters', spark: '10+', fusion: '1', delta: '10X Simpler' }
  ] as BenchmarkRow[],
  link: { label: 'View detailed benchmarks', href: '/docs/fusion/getting-started/compaction/' }
}

/** The expandable "How Fusion does this" panel under the table. */
export const BENCHMARK_INFO = {
  title: 'How Fusion does this',
  items: [
    {
      term: 'Per-table scheduling',
      text: 'compaction schedules run in sets; Lite, Medium, or Full, instead of one-size-fits-all.'
    },
    {
      term: 'Smarter deletes',
      text: 'equality deletes convert to position deletes before merge, so queries do less work.'
    }
  ]
}
