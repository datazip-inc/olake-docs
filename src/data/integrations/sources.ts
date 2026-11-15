/**
 * Sources OLake Go reads from, as the integration pages describe them.
 *
 * One entry per source connector. `label` is the spelling used in prose and headings, `aliases`
 * are the other spellings people search for (the page body mentions them once). `cdc` says
 * whether the connector has log-based change data capture; the pages must never claim CDC for a
 * source that has none. `docsPath` is the connector doc the page links to for the full field
 * reference, and `setupVariants` are the hosted flavours that have their own setup guide.
 */
export type SourceId =
  | 'postgres'
  | 'mysql'
  | 'mariadb'
  | 'mongodb'
  | 'mssql'
  | 'oracle'
  | 'db2'
  | 'kafka'
  | 's3'

export type SetupVariant = 'local' | 'generic' | 'rds' | 'aurora' | 'azure' | 'gcp'

export interface Source {
  id: SourceId
  /** Spelling in prose and headings. */
  label: string
  /** Spelling in tables (PostgreSQL rather than Postgres). */
  formalLabel: string
  /** Other spellings people search for. */
  aliases: string[]
  /** Log-based change data capture exists for this source. */
  cdc: boolean
  /** How changes are read when `cdc` is true. */
  cdcMechanism?: string
  /** Sync modes the connector offers, in the order the UI lists them. */
  syncModes: string[]
  /** Connector reference page. */
  docsPath: string
  /** Hosted flavours with their own setup guide under `${docsPath}setup/<variant>/`. */
  setupVariants: SetupVariant[]
  /** Logo under static/img/logo. */
  logo?: string
}

export const SOURCES: Record<SourceId, Source> = {
  postgres: {
    id: 'postgres',
    label: 'Postgres',
    formalLabel: 'PostgreSQL',
    aliases: ['PostgreSQL', 'postgresql'],
    cdc: true,
    cdcMechanism: 'logical replication (pgoutput)',
    syncModes: ['Full Refresh', 'Full Refresh + CDC', 'CDC Only', 'Full Refresh + Incremental'],
    docsPath: '/docs/connectors/postgres/',
    setupVariants: ['local', 'generic', 'rds', 'aurora', 'azure', 'gcp'],
    logo: '/img/logo/postgres.webp'
  },
  mysql: {
    id: 'mysql',
    label: 'MySQL',
    formalLabel: 'MySQL',
    aliases: [],
    cdc: true,
    cdcMechanism: 'binary log (binlog)',
    syncModes: ['Full Refresh', 'Full Refresh + CDC', 'CDC Only', 'Full Refresh + Incremental'],
    docsPath: '/docs/connectors/mysql/',
    setupVariants: ['local', 'generic', 'rds', 'aurora', 'azure', 'gcp'],
    logo: '/img/logo/mysql.webp'
  },
  mariadb: {
    id: 'mariadb',
    label: 'MariaDB',
    formalLabel: 'MariaDB',
    aliases: [],
    cdc: true,
    cdcMechanism: 'binary log (binlog), through the MySQL connector',
    syncModes: ['Full Refresh', 'Full Refresh + CDC', 'CDC Only', 'Full Refresh + Incremental'],
    docsPath: '/docs/connectors/mysql/',
    setupVariants: ['local', 'generic', 'rds', 'azure'],
    logo: '/img/logo/mysql.webp'
  },
  mongodb: {
    id: 'mongodb',
    label: 'MongoDB',
    formalLabel: 'MongoDB',
    aliases: ['Mongo'],
    cdc: true,
    cdcMechanism: 'oplog and change streams',
    syncModes: ['Full Refresh', 'Full Refresh + CDC', 'CDC Only', 'Full Refresh + Incremental'],
    docsPath: '/docs/connectors/mongodb/',
    setupVariants: ['local', 'generic'],
    logo: '/img/logo/mongodb.webp'
  },
  mssql: {
    id: 'mssql',
    label: 'SQL Server',
    formalLabel: 'Microsoft SQL Server',
    aliases: ['MSSQL'],
    cdc: true,
    cdcMechanism: 'SQL Server change data capture (capture instances)',
    syncModes: ['Full Refresh', 'Full Refresh + CDC', 'CDC Only', 'Full Refresh + Incremental'],
    docsPath: '/docs/connectors/mssql/',
    setupVariants: ['generic']
  },
  oracle: {
    id: 'oracle',
    label: 'Oracle',
    formalLabel: 'Oracle Database',
    aliases: [],
    cdc: false,
    syncModes: ['Full Refresh', 'Full Refresh + Incremental'],
    docsPath: '/docs/connectors/oracle/',
    setupVariants: ['generic'],
    logo: '/img/logo/oracle.webp'
  },
  db2: {
    id: 'db2',
    label: 'DB2',
    formalLabel: 'IBM DB2 LUW',
    aliases: ['IBM DB2'],
    cdc: false,
    syncModes: ['Full Refresh', 'Full Refresh + Incremental'],
    docsPath: '/docs/connectors/db2/',
    setupVariants: []
  },
  kafka: {
    id: 'kafka',
    label: 'Kafka',
    formalLabel: 'Apache Kafka',
    aliases: [],
    cdc: true,
    cdcMechanism: 'topic offsets (strict CDC, no backfill)',
    syncModes: ['CDC Only'],
    docsPath: '/docs/connectors/kafka/',
    setupVariants: [],
    logo: '/img/logo/kafka.webp'
  },
  s3: {
    id: 's3',
    label: 'S3',
    formalLabel: 'Amazon S3',
    aliases: ['AWS S3'],
    cdc: false,
    syncModes: ['Full Refresh', 'Full Refresh + Incremental'],
    docsPath: '/docs/connectors/s3/',
    setupVariants: [],
    logo: '/img/logo/s3.webp'
  }
}

export const SOURCE_IDS = Object.keys(SOURCES) as SourceId[]
