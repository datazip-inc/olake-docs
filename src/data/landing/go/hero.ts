import { GITHUB_REPO_URL } from '@site/src/components/landing/chrome/navItems'

/** Hero copy and calls to action of the OLake Go page. */
export const GO_HERO = {
  eyebrow: 'OLake Go',
  headline: 'Fastest Replication into Apache Iceberg & S3',
  body: 'OLake Go helps you ingest data from 8 different sources into Apache Iceberg and S3',
  primary: { label: 'Github', href: GITHUB_REPO_URL },
  secondary: { label: 'Visit Docs', href: '/docs' }
}

export type GoSourceId =
  'kafka' | 'postgres' | 'mysql' | 'mongodb' | 's3' | 'mssql' | 'db2' | 'oracle'

/** The "Available Sources" strip under the hero buttons, in the order it scrolls. */
export const GO_SOURCES_LABEL = 'Available Sources'

export const GO_SOURCES: { id: GoSourceId; name: string }[] = [
  { id: 'kafka', name: 'Kafka' },
  { id: 'postgres', name: 'Postgres' },
  { id: 'mysql', name: 'MySQL' },
  { id: 'mongodb', name: 'MongoDB' },
  { id: 's3', name: 'S3' },
  { id: 'mssql', name: 'MSSQL' },
  { id: 'db2', name: 'DB2' },
  { id: 'oracle', name: 'Oracle' }
]
