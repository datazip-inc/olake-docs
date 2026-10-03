/** "The Fundamental": the four capabilities in the feature selector. */
export type GoFeatureArt = 'tiered' | 'decay' | 'chunk' | 'resume'

export interface GoFeature {
  id: string
  title: string
  body: string
  art: GoFeatureArt
}

export const GO_FEATURES_INTRO = {
  eyebrow: 'The Fundamental',
  title: 'Experience the most seamless workflow'
}

export const GO_FEATURES: GoFeature[] = [
  {
    id: 'syncs',
    title: 'Full, incremental & CDC syncs',
    body: 'Run full loads, incremental pulls, or real-time change data capture, whatever each table needs, all from a single tool.',
    art: 'tiered'
  },
  {
    id: 'evolution',
    title: 'Schema & partition evolution',
    body: 'Source schemas change and partitions grow. OLake Go evolves your Iceberg tables automatically so pipelines never break.',
    art: 'decay'
  },
  {
    id: 'chunking',
    title: 'Parallelised chunking',
    body: 'Large collections are split into virtual chunks read in parallel, dramatically cutting the time for full snapshots of big datasets.',
    art: 'chunk'
  },
  {
    id: 'resumable',
    title: 'Stateful, resumable syncs',
    body: 'Syncs checkpoint their progress and resume automatically after crashes or network failures; never from scratch.',
    art: 'resume'
  }
]
