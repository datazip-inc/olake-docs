/**
 * Fusion vs Spark compaction benchmark, as published on the OLake Fusion page
 * (`landing/pages/useFusionLogic.ts`): TPC-H lineitem, ~1.8 billion rows.
 */
export interface FusionBenchmarkRow {
  metric: string
  fusion: string
  /** The green delta badge next to the Fusion value. */
  delta: string
  spark: string
}

export const FUSION_BENCHMARK = {
  title: 'Faster & half the cost',
  linkLabel: 'View OLake Fusion benchmarks',
  linkHref: '/docs/fusion/getting-started/compaction/',
  fusionLabel: 'OLake Fusion',
  sparkLabel: 'Spark Compaction',
  rows: [
    {
      metric: 'Total Compaction Time',
      fusion: '27m 02s',
      delta: '2.06x faster',
      spark: '55m 47s'
    },
    {
      metric: 'Compaction Cost/ Job',
      fusion: '$1.06',
      delta: '52% less cost',
      spark: '$2.19'
    },
    {
      metric: 'Config Parameters',
      fusion: '1',
      delta: '10x simpler',
      spark: '10+'
    }
  ] as FusionBenchmarkRow[]
}
