/**
 * The two engines. Copy and destinations match the current home page
 * (`landing/pages/useHomeLogic.ts`); the stat pairs are the figures the
 * OLake Advantage block publishes today.
 */
export interface EngineStat {
  value: string
  label: string
}

export interface EngineCard {
  art: string
  /** Rendered as "OLake <name>" with the product word in a lighter tone. */
  brand: string
  name: string
  body: string
  stats: EngineStat[]
  href: string
  linkLabel: string
  /** Chips the design shows under Fusion, e.g. a "Coming Soon" note. */
  note?: string
}

export const ENGINES: EngineCard[] = [
  {
    art: '/img/landing/lakeside/engine-go.png',
    brand: 'OLake',
    name: 'Go',
    body: 'Replicate your databases fast, into Apache Iceberg & Parquet on object storage.',
    stats: [
      // docs/benchmarks/ingestion.mdx, Postgres tab: 580,113 vs 46,395 rows/s, and < $ 6 for 4.01 B rows.
      { value: '12.5X', label: 'Faster than Fivetran (Postgres full load)' },
      { value: '< $6', label: 'To load 4 billion Postgres rows' }
    ],
    href: '/olake-go',
    linkLabel: 'Know more'
  },
  {
    art: '/img/landing/lakeside/engine-fusion.png',
    brand: 'OLake',
    name: 'Fusion',
    body: 'Keep your Apache Iceberg tables consistently performant and scalable.',
    stats: [
      { value: '2X', label: 'Faster than Apache Spark' },
      { value: '50%', label: 'Cheaper Per Compaction Cycle' }
    ],
    href: '/olake-fusion',
    linkLabel: 'Know more',
  }
]
