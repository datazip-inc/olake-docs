import type { ProductFeature } from '@site/src/components/landing/product/ProductFeatures'

/** "Features": the four capabilities behind the tab strip on the OLake Fusion page. */
export const FEATURES_INTRO = {
  eyebrow: 'Features',
  title: 'Built to keep your lakehouse performant'
}

export const FEATURES: ProductFeature[] = [
  {
    id: 'tiered',
    tab: 'Tiered Compaction',
    title: 'Tiered Compaction',
    body: 'Schedule Lite, Medium and Full compaction per table instead of one whole job.\nDefaults: Lite every hour, Medium every 8 hours, Full off until you schedule it as a periodic deep-clean for much larger datasets.'
  },
  {
    id: 'decay',
    tab: 'Omit Decay',
    title: 'Omit Decay',
    body: 'Small files, delete files, and excess metadata pile up as tables evolve.\nFusion resolves them periodically so query performance never degrades.'
  },
  {
    id: 'config',
    tab: 'Easy Configuration',
    title: 'Easy Configuration',
    body: 'One target-size parameter replaces the seven Spark rewrite_data_files needs. Same result, far less to manage.'
  },
  {
    id: 'hosted',
    tab: 'Self-Hosted',
    title: 'Self-Hosted',
    body: 'Open-source and deployable on Docker or Kubernetes so you pay only for the compute and storage you provision.'
  }
]
