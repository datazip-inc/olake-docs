/**
 * "Why teams pick OLake." — the four capability cards. Copy is the design's;
 * it tracks the same four claims the current home page makes (`whyRows` in
 * landing/pages/useHomeLogic.ts).
 */
export type FeatureArt = 'ingestion' | 'lakehouse' | 'vpc' | 'maintenance'

export interface FeatureCard {
  art: FeatureArt
  kicker: string
  title: string
  body: string
}

export const FEATURES: FeatureCard[] = [
  {
    art: 'ingestion',
    kicker: 'Fast',
    title: 'Replicate databases at scale, instantly',
    body: 'Sync MySQL, Postgres, MongoDB, Oracle, and more to Apache Iceberg with parallelised chunking, incremental sync, and change data capture, so your lakehouse tables stay fresh with minimal overhead.'
  },
  {
    art: 'lakehouse',
    kicker: 'Open',
    title: 'Built on open standards, no lock-in',
    body: 'Write directly to Apache Iceberg or Parquet with support for multiple catalogs including AWS Glue, Apache Hive Metastore, and REST catalogs like Nessie, Polaris, and Unity Catalog — your data stays queryable by any engine you choose.'
  },
  {
    art: 'vpc',
    kicker: 'Controlled',
    title: 'Self-hosted, on your infrastructure',
    body: "Deploy OLake entirely within your own cloud or on-prem environment, keeping full control over where your data lives — critical for regulated industries like financial services that can't compromise on data residency."
  },
  {
    art: 'maintenance',
    kicker: 'Maintained',
    title: 'Keep tables fast as data keeps growing',
    body: "Automate Iceberg table maintenance through compaction, clearing delete files, and trimming metadata so query performance and storage costs don't degrade as your lakehouse scales."
  }
]
