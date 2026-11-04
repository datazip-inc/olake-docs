/** Fusion vs Spark compaction benchmark as published on the OLake Fusion page. */
export interface BenchmarkRow {
  metric: string
  fusion: string
  /** The badge next to the Fusion value. */
  delta: string
  spark: string
}

export const BENCHMARK = {
  eyebrow: 'Benchmarks',
  title: 'Engineered for performance',
  /** The design sets the prose grey and the claims white: those runs are marked `bright: true`. */
  summary: [
    { text: 'OLake Fusion compacts ' },
    { text: 'Apache Iceberg tables 2.06×', bright: true },
    { text: ' faster than Apache Spark and at roughly ' },
    { text: 'half the cost.', bright: true }
  ] as { text: string; bright?: boolean }[],
  caption: '1 Parameter, 1.8 billion rows compacted in 27 minutes.',
  headers: {
    metric: 'Metrics',
    fusionBrand: 'OLake',
    fusionProduct: 'Fusion',
    fusionSub: 'Open Source',
    spark: 'Spark Compaction'
  },
  rows: [
    { metric: 'Total Compaction Time', fusion: '27m 2s', delta: '2.06x faster', spark: '55m 47s' },
    { metric: 'Compaction Cost/ Job', fusion: '$1.06', delta: '52% less cost', spark: '$2.19' },
    { metric: 'Config Parameters', fusion: '1', delta: '10x simpler', spark: '10+' }
  ] as BenchmarkRow[],
  link: { label: 'View detailed benchmarks', href: '/docs/fusion/getting-started/compaction/' }
}

/** The notes under the table. */
export const BENCHMARK_HOW = {
  title: 'How OLake Fusion does this',
  lead: 'In order to outperform Spark, Fusion runs compaction on a per-table schedule you define. Rather than treating every table the same, it offers three tiers;',
  tiers: [
    { name: 'Lite', text: 'for frequent lightweight cleanup' },
    { name: 'Medium', text: 'for regular small-file and delete resolution' },
    { name: 'Full', text: 'for occasional deep rewrites' }
  ],
  outro: [
    'Each tier is scheduled independently, with higher tiers automatically overriding lower ones when schedules overlap.',
    'To improve read efficiency, Fusion converts expensive equality deletes into position deletes, reducing the work query engines do at read time.'
  ]
}
