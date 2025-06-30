// data/query-engines/hive.ts
import { QueryEngine } from '../../types/iceberg';

export const hive: QueryEngine = {
  id: 'hive',
  name: 'Apache Hive 4.0+',
  description: 'Traditional data warehouse with first-class Iceberg support, full SQL DML, hidden partitioning, and Ranger-based governance for batch analytics',
  category: 'general-purpose',
  website: 'https://hive.apache.org/',
  documentation: 'https://iceberg.apache.org/docs/latest/hive/',
  features: {
    catalogs: {
      support: 'full',
      details: 'Hive Metastore default via HiveIcebergStorageHandler; Hadoop, REST/Nessie, AWS Glue, JDBC, or custom catalogs configurable',
      externalLinks: [
        {
          label: 'Hive Catalog Management',
          url: 'https://iceberg.apache.org/docs/latest/hive/#catalog-management'
        },
        {
          label: 'Custom Iceberg Catalogs',
          url: 'https://iceberg.apache.org/docs/latest/hive/#custom-iceberg-catalogs'
        },
        {
          label: 'Hive via Nessie',
          url: 'https://projectnessie.org/iceberg/hive/'
        }
      ]
    },
    readWrite: {
      support: 'full',
      details: 'SELECT, INSERT INTO, atomic INSERT OVERWRITE, CTAS, CREATE TABLE LIKE; works through Tez or MapReduce jobs',
      externalLinks: [
        {
          label: 'Hive SELECT Operations',
          url: 'https://iceberg.apache.org/docs/latest/hive/#select'
        },
        {
          label: 'Hive INSERT INTO',
          url: 'https://iceberg.apache.org/docs/latest/hive/#insert-into'
        },
        {
          label: 'Hive INSERT OVERWRITE',
          url: 'https://iceberg.apache.org/docs/latest/hive/#insert-overwrite'
        },
        {
          label: 'CREATE TABLE AS SELECT',
          url: 'https://iceberg.apache.org/docs/latest/hive/#create-table-as-select'
        }
      ]
    },
    dml: {
      support: 'full',
      details: 'SQL DELETE, UPDATE, and MERGE INTO supported when Hive runs on Tez; operations rewrite whole files (CoW)',
      externalLinks: [
        {
          label: 'Hive DELETE FROM',
          url: 'https://iceberg.apache.org/docs/latest/hive/#delete-from'
        },
        {
          label: 'Hive UPDATE',
          url: 'https://iceberg.apache.org/docs/latest/hive/#update'
        },
        {
          label: 'Hive MERGE INTO',
          url: 'https://iceberg.apache.org/docs/latest/hive/#merge-into'
        }
      ]
    },
    morCow: {
      support: 'partial',
      details: 'Copy-on-Write for all Hive writes; Merge-on-Read delete files are readable but not produced by Hive',
      externalLinks: [
        {
          label: 'Write Delete Mode Configuration',
          url: 'https://iceberg.apache.org/docs/latest/configuration/#write.delete.mode'
        }
      ]
    },
    streaming: {
      support: 'none',
      details: 'No native streaming; ingest via micro-batch jobs only; CDC pipelines typically rely on Spark/Flink then query with Hive',
      externalLinks: [
        {
          label: 'Row-level Operations',
          url: 'https://docs.cloudera.com/cdw-runtime/cloud/iceberg-how-to/topics/iceberg-row-level-ops.html'
        }
      ]
    },
    formatV3: {
      support: 'none',
      details: 'Not supported. Hive 4 bundles Iceberg 1.4.3, predating spec v3. Cannot write or reliably read v3 tables until upgrade to Iceberg ≥ 1.8.0',
      externalLinks: [
        {
          label: 'Hive 1.4.3 Documentation',
          url: 'https://iceberg.apache.org/docs/1.4.3/hive/'
        }
      ]
    },
    timeTravel: {
      support: 'partial',
      details: 'Hidden partitioning supported (PARTITIONED BY SPEC); time-travel via snapshot/branch properties, not SQL clauses',
      externalLinks: [
        {
          label: 'Branching and Tagging',
          url: 'https://iceberg.apache.org/docs/1.8.1/branching/'
        }
      ]
    },
    security: {
      support: 'full',
      details: 'Inherits Ranger/SQL-standard policies from Hive Metastore; Ranger policies can target Iceberg tables and storage-handler paths',
      externalLinks: [
        {
          label: 'Ranger Integration',
          url: 'https://docs.cloudera.com/runtime/7.3.1/iceberg-how-to/topics/iceberg-ranger-introduction.html'
        },
        {
          label: 'Hive Ranger Configuration',
          url: 'https://docs.starburst.io/latest/security/hive-ranger.html'
        }
      ]
    }
  },
  quickStart: `-- Create Iceberg table in Hive
CREATE TABLE iceberg_table (
  id BIGINT,
  name STRING,
  created_date DATE
) STORED BY 'org.apache.iceberg.mr.hive.HiveIcebergStorageHandler'
LOCATION 's3://bucket/warehouse/db/table'
TBLPROPERTIES (
  'iceberg.catalog'='hive',
  'iceberg.file-format'='parquet'
);

-- Query Iceberg table
SELECT * FROM iceberg_table WHERE created_date >= '2024-01-01';`,
  bestPractices: [
    'Use Tez execution engine (hive.execution.engine=tez) for DML operations - MapReduce not supported for DELETE/UPDATE/MERGE',
    'Consider Copy-on-Write performance implications for frequent small updates - entire files are rewritten',
    'Pair Hive with streaming writers (Spark 3.5+/Flink 1.18+) for real-time workflows and query with Hive for analytics',
    'Keep canonical tables on spec v2 for compatibility until Hive upgrades beyond Iceberg 1.8',
    'Use external Iceberg connector for Hive 2/3 deployments as they require runtime JAR',
    'Leverage Apache Ranger policies for fine-grained access control on Iceberg tables',
    'Use hidden partition specs (PARTITIONED BY SPEC) for better query performance',
    'Be aware of HMS locks that can limit high-concurrency write scenarios',
    'Use ALTER TABLE COMPACT for periodic maintenance and file optimization',
    'Migrate existing Hive tables to Iceberg using ALTER TABLE SET STORED AS ICEBERG',
    'Monitor for early Hive 4 build issues with snapshot reading and upgrade as needed',
    'Use branch/tag properties for time travel rather than expecting SQL time travel syntax',
    'Configure appropriate storage handlers and catalog properties for different deployment scenarios',
    'Consider micro-batch processing patterns for near-real-time data ingestion requirements'
  ]
};