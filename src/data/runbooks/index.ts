/**
 * Data behind the runbooks under docs/runbooks: set-up and operations guides for the databases and
 * tools people move data out of, each backed by a failure that was reproduced in a lab under
 * labs/runbooks. The page front matter carries a `runbook:` block; the components read it.
 */
import { PEOPLE, type Person } from '@site/src/data/integrations'

export type RunbookFamilyId = 'postgres' | 'mysql' | 'sql-server' | 'debezium' | 'kafka-connect' | 'iceberg'

export interface RunbookFamily {
  id: RunbookFamilyId
  /** Sidebar and hub label. */
  label: string
  /** Product name as its owner writes it. */
  product: string
  /** Who owns the name. Shown in the non-affiliation line. */
  owner: string
  /** Official documentation, linked from the hub. */
  docs: string
  /**
   * How OLake Go relates to the product. `alternative`: OLake Go does the same job a different way.
   * `source`: OLake Go reads from it, so the page applies to OLake Go users too. `format`: OLake Go
   * writes it.
   */
  relation: 'alternative' | 'source' | 'format'
}

export const FAMILIES: Record<RunbookFamilyId, RunbookFamily> = {
  postgres: {
    id: 'postgres',
    label: 'PostgreSQL',
    product: 'PostgreSQL',
    owner: 'the PostgreSQL Community Association of Canada',
    docs: 'https://www.postgresql.org/docs/current/logical-replication.html',
    relation: 'source'
  },
  mysql: {
    id: 'mysql',
    label: 'MySQL',
    product: 'MySQL',
    owner: 'Oracle',
    docs: 'https://dev.mysql.com/doc/refman/8.4/en/binary-log.html',
    relation: 'source'
  },
  'sql-server': {
    id: 'sql-server',
    label: 'SQL Server',
    product: 'Microsoft SQL Server',
    owner: 'Microsoft',
    docs: 'https://learn.microsoft.com/en-us/sql/relational-databases/track-changes/about-change-data-capture-sql-server',
    relation: 'source'
  },
  debezium: {
    id: 'debezium',
    label: 'Debezium',
    product: 'Debezium',
    owner: 'the Commonhaus Foundation',
    docs: 'https://debezium.io/documentation/reference/stable/',
    relation: 'alternative'
  },
  'kafka-connect': {
    id: 'kafka-connect',
    label: 'Kafka Connect',
    product: 'Apache Kafka Connect',
    owner: 'the Apache Software Foundation',
    docs: 'https://kafka.apache.org/documentation/#connect',
    relation: 'alternative'
  },
  iceberg: {
    id: 'iceberg',
    label: 'Apache Iceberg',
    product: 'Apache Iceberg',
    owner: 'the Apache Software Foundation',
    docs: 'https://iceberg.apache.org/docs/latest/',
    relation: 'format'
  }
}

export interface RunbookFrontMatter {
  family: RunbookFamilyId
  /** Id in PEOPLE. */
  author: string
  /**
   * Id in PEOPLE of a second person who re-ran the lab and read the page. A page stays `unlisted`
   * until this is set (scripts/runbooks/check.mjs enforces it).
   */
  reviewer?: string
  reproduced: {
    /** ISO date of the last run of the lab. Change it only when the lab is run again. */
    date: string
    /** Exact versions the lab ran, most important first. */
    versions: string[]
    /** Folder of the lab, relative to the repository root. */
    lab: string
    /** One line on what the run did and showed. */
    summary?: string
    /**
     * Runs on managed services and with other tools, which need more than the lab's Compose file.
     * They have their own date, and their folders are under labs/runbooks/service-runs.
     */
    services?: {
      /** ISO date of these runs. */
      date: string
      /** Services and tools with their exact versions. */
      versions: string[]
      /** Folders of the runs, relative to the repository root. */
      labs: string[]
    }
  }
}

export { PEOPLE }
export type { Person }
