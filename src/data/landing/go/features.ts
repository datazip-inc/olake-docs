/** "Features": the four capabilities behind the tab strip. `tab` is the pill label, `title` the card heading. */
export interface GoFeature {
  id: string
  tab: string
  title: string
  body: string
}

export const GO_FEATURES_INTRO = {
  eyebrow: 'Features',
  title: 'Experience the most seamless workflow'
}

export const GO_FEATURES: GoFeature[] = [
  {
    id: 'cdc',
    tab: 'CDC',
    title: 'Full, Incremental & CDC Syncs',
    body: 'Run full loads, incremental pulls, or real-time change data capture, whatever each table needs, all from a single tool.'
  },
  {
    id: 'schema-evolution',
    tab: 'Schema Evolution',
    title: 'Schema & Partition Evolution',
    body: 'Source schemas change and partitions grow. OLake Go evolves your Iceberg tables automatically so pipelines never break.'
  },
  {
    id: 'parallel-chunking',
    tab: 'Parallel Chunking',
    title: 'Parallelised Chunking',
    body: 'Large collections are split into virtual chunks read in parallel, dramatically cutting the time for full snapshots of big datasets.'
  },
  {
    id: 'resumable-syncs',
    tab: 'Resumable Syncs',
    title: 'Stateful, Resumable Syncs',
    body: 'Syncs checkpoint their progress and resume automatically after crashes or network failures; never from scratch.'
  }
]
