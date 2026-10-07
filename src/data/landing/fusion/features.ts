/** The four Fusion features shown in the selector on the OLake Fusion page. */
export type FeatureKind = 'tiered' | 'decay' | 'config' | 'hosted'

export interface Feature {
  kind: FeatureKind
  title: string
  body: string
}

export const FEATURES_EYEBROW = 'Features'
export const FEATURES_TITLE = 'Built to keep your data lake performant'

export const FEATURES: Feature[] = [
  {
    kind: 'tiered',
    title: 'Tiered compaction',
    body: 'Trigger-based tiers instead of one blunt job, so lightweight compaction can run constantly and deep rewrites only run when they’re actually needed.'
  },
  {
    kind: 'decay',
    title: 'Reduced decay',
    body: 'Small files, delete files, and excess metadata pile up as tables evolve. Fusion resolves them periodically so query performance never degrades.'
  },
  {
    kind: 'config',
    title: 'Easy configuration',
    body: 'One target-size parameter replaces the seven Spark rewrite_data_files needs. Same result, far less to manage.'
  },
  {
    kind: 'hosted',
    title: 'Self-hosted',
    body: 'Open-source and deployable on Docker or Kubernetes so you pay only for the compute and storage you provision.'
  }
]

/** Tiered compaction visual: schedule per tier. `fill` is the bar width in percent. */
export const TIERS = [
  { label: 'Lite', fill: 30, note: 'every 20 min' },
  { label: 'Medium', fill: 60, note: 'every 40 min' },
  { label: 'Full', fill: 100, note: 'deep-clean' }
]

/** Config visual: parameter counts. */
export const CONFIG_COMPARE = {
  fusion: { value: '1', label: 'Fusion parameter' },
  spark: { value: '10+', label: 'Spark parameters' }
}

/** Self-hosted visual: where Fusion runs. */
export const HOSTS = ['Docker', 'Kubernetes']

/** Decay visual captions. */
export const DECAY_LABELS = { before: 'fragmented files', after: 'compacted' }

/** Auto-advance: one step every `FEATURE_TICK_MS`, `FEATURE_STEPS` steps per feature (10 s). */
export const FEATURE_TICK_MS = 100
export const FEATURE_STEPS = 100
