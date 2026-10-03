/** The sources → OLake Go → destinations diagram under the hero. */
export const GO_SOURCES = ['Postgres', 'MongoDB', 'MySQL', 'Kafka', 'S3', 'Oracle', 'MSSQL', 'DB2 LUW']

/** Sync modes shown under the OLake Go node. */
export const GO_SYNC_MODES = ['Full Load', 'CDC', 'Incremental']

export interface GoDestination {
  label: string
  icon: { src: string; alt: string; width: number; height: number }
  /** The first destination is the highlighted one in the diagram. */
  primary?: boolean
}

export const GO_DESTINATIONS: GoDestination[] = [
  {
    label: 'Iceberg Tables',
    icon: { src: '/img/landing/shared/iceberg-icon.webp', alt: 'Iceberg', width: 256, height: 70 },
    primary: true
  },
  {
    label: 'Parquet Files',
    icon: { src: '/img/landing/shared/parquet-icon.webp', alt: 'Parquet', width: 128, height: 128 }
  }
]

export const GO_ARCHITECTURE_LABELS = {
  sources: 'Sources',
  destinations: 'Destinations',
  node: 'OLake Go'
}
