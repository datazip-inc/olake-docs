/**
 * "Works with what you run" — what OLake connects to.
 *
 * Sources and destinations mirror the connectors the home page already lists
 * (`landing/pages/useHomeLogic.ts` → `archSources`, `archDestinations`), which
 * are the same eight connectors `src/data/benchmarkData.ts` benchmarks.
 * Catalogs and query engines have no structured source in the repo yet; the
 * lists below are the ones the docs and the query-engine pages
 * (`src/data/query-engines/*`) cover.
 */
export interface ChipGroup {
  title: string
  chips: string[]
}

export const ARCHITECTURE_INTRO = {
  eyebrow: 'Architecture',
  title: 'Works with what you run',
  body: 'OLake Go supports ingestion from 8 different sources into Iceberg and Parquet. OLake Fusion keeps your Iceberg tables fast, through scheduled compaction and maintenance.',
  cta: { label: 'Get in touch', href: '/contact' }
}

export const ARCHITECTURE_GROUPS: ChipGroup[] = [
  {
    title: 'Sources',
    chips: ['Postgres', 'MySQL', 'MongoDB', 'Oracle', 'Kafka', 'S3', 'DB2 LUW', 'MSSQL']
  },
  {
    // Everything under docs/writers/iceberg/catalog: the four catalog types,
    // plus the REST implementations that page documents as its own tabs.
    title: 'Catalogs',
    chips: [
      'AWS Glue',
      'Hive',
      'JDBC',
      'REST',
      'Lakekeeper',
      'Nessie',
      'S3 Tables',
      'Unity',
      'Apache Polaris',
      'BigLake'
    ]
  },
  {
    title: 'Destinations',
    chips: ['Apache Iceberg', 'Parquet on S3']
  },
  {
    // The engines docs/understanding/compatibility-engines.mdx certifies
    // against OLake Go's Iceberg tables, in the order that table lists them.
    title: 'Query Engines that read results',
    chips: [
      'Amazon Athena',
      'Apache Spark',
      'Apache Flink',
      'Trino',
      'Starburst',
      'Presto',
      'Apache Hive',
      'Apache Impala',
      'Dremio',
      'DuckDB',
      'ClickHouse',
      'StarRocks',
      'Apache Doris',
      'BigQuery',
      'Snowflake',
      'Databricks',
      'AWS Redshift',
      'Azure Synapse'
    ]
  }
]

export const ARCHITECTURE_GRAPH = {
  src: '/img/landing/lakeside/architecture-graph.svg',
  width: 960,
  height: 480,
  alt: 'Eight sources flow into OLake Go, which writes Iceberg tables and Parquet on S3; OLake Fusion optimises those tables.'
}
