// data/query-engines/trino.ts
import { QueryEngine } from '../../types/iceberg';

export const trino: QueryEngine = {
  id: 'trino',
  name: 'Trino 475+',
  description: 'High-performance distributed SQL query engine with advanced DML, time travel, and native Iceberg optimization for interactive analytics',
  category: 'general-purpose',
  website: 'https://trino.io/',
  documentation: 'https://trino.io/docs/current/connector/iceberg.html',
  features: {
    catalogs: {
      support: 'full',
      details: 'iceberg.catalog.type= hive_metastore, glue, jdbc, rest, nessie, or snowflake; each catalog exposes the same tables to Trino once configured',
      externalLinks: [
        {
          label: 'Catalog Requirements',
          url: 'https://trino.io/docs/current/connector/iceberg.html#requirements'
        },
        {
          label: 'Catalog Configuration',
          url: 'https://trino.io/docs/current/connector/iceberg.html#catalog-configuration'
        }
      ]
    },
    readWrite: {
      support: 'full',
      details: 'Ad-hoc SQL reads with filter, projection, and partition pruning; writes via INSERT, CREATE TABLE AS, CREATE OR REPLACE TABLE, and INSERT OVERWRITE',
      externalLinks: [
        {
          label: 'Basic Usage Examples',
          url: 'https://trino.io/docs/current/connector/iceberg.html#basic-usage'
        },
        {
          label: 'Replace Tables',
          url: 'https://trino.io/docs/current/connector/iceberg.html#replace-tables'
        }
      ]
    },
    dml: {
      support: 'full',
      details: 'Supports UPDATE, DELETE, and MERGE INTO, emitting position/equality delete files instead of rewriting entire partitions when possible',
      externalLinks: [
        {
          label: 'Data Management',
          url: 'https://trino.io/docs/current/connector/iceberg.html#data-management'
        },
        {
          label: 'Row Level Deletion',
          url: 'https://trino.io/docs/current/connector/iceberg.html#row-level-deletion'
        }
      ]
    },
    morCow: {
      support: 'full',
      details: 'Default Merge-on-Read for row-level DML (writes compact delete files, queries merge on-the-fly). CTAS/INSERT OVERWRITE follow Copy-on-Write semantics',
      externalLinks: [
        {
          label: 'Position Delete Files',
          url: 'https://trino.io/docs/current/connector/iceberg.html#data-management'
        }
      ]
    },
    streaming: {
      support: 'none',
      details: 'Trino is batch/interactive only; happily reads Iceberg tables updated by streaming engines, but does not run continuous ingestion jobs itself',
      externalLinks: [
        {
          label: 'Overview - No Streaming',
          url: 'https://trino.io/docs/current/connector/iceberg.html#overview'
        }
      ]
    },
    formatV3: {
      support: 'none',
      details: 'Not yet GA; spec v3 read/write tracked but connector currently supports only spec v1/v2; deletion vectors & row lineage planned',
      externalLinks: [
        {
          label: 'Supported Specifications',
          url: 'https://trino.io/docs/current/connector/iceberg.html#iceberg-connector'
        },
        {
          label: 'GitHub Issue #11968 - DV Support',
          url: 'https://github.com/apache/iceberg/issues/11968'
        }
      ]
    },
    timeTravel: {
      support: 'full',
      details: 'Automatic hidden partition pruning; time travel via FOR VERSION AS OF and FOR TIMESTAMP AS OF (also to branches/tags)',
      externalLinks: [
        {
          label: 'Partitioned Tables',
          url: 'https://trino.io/docs/current/connector/iceberg.html#partitioned-tables'
        },
        {
          label: 'Time Travel Syntax',
          url: 'https://trino.io/docs/current/connector/iceberg.html#time-travel'
        }
      ]
    },
    security: {
      support: 'full',
      details: 'Delegates ACLs to underlying catalog (Hive Ranger, AWS IAM, Nessie policies); supports snapshot isolation; commit metadata visible for audit',
      externalLinks: [
        {
          label: 'Security Configuration',
          url: 'https://trino.io/docs/current/connector/iceberg.html#security'
        },
        {
          label: 'Kerberos Authentication',
          url: 'https://trino.io/docs/current/connector/iceberg.html#kerberos-authentication'
        }
      ]
    }
  },
  quickStart: `-- Create Iceberg table in Trino
CREATE TABLE iceberg.default.customer_orders (
  order_id BIGINT,
  customer_id BIGINT,
  order_date DATE,
  total_amount DECIMAL(10,2)
)
WITH (
  format = 'PARQUET',
  partitioning = ARRAY['month(order_date)']
);

-- Insert data
INSERT INTO iceberg.default.customer_orders 
VALUES (1, 100, DATE '2024-01-15', 99.99);

-- Query with time travel
SELECT * FROM iceberg.default.customer_orders 
FOR TIMESTAMP AS OF TIMESTAMP '2024-01-01 12:00:00';`,
  bestPractices: [
    'Use Trino ≥ 475 for full DML support and latest Iceberg compatibility (~1.3.x bundled)',
    'Configure multiple catalog types (hive_metastore, glue, rest, nessie) for different data sources',
    'Leverage Merge-on-Read for frequent row-level updates - position/equality delete files more efficient than rewrites',
    'Use FOR VERSION AS OF and FOR TIMESTAMP AS OF for point-in-time queries and data auditing',
    'Implement bucket-aware execution for better query performance on large tables',
    'Run ALTER TABLE EXECUTE optimize periodically to consolidate small files and improve query performance',
    'Use fault-tolerant execution for large-scale batch processing workloads',
    'Enable Iceberg metadata caching for frequently accessed tables to reduce latency',
    'Keep tables at format_version = 2 for maximum engine interoperability until V3 GA',
    'Use CREATE OR REPLACE TABLE for atomic table replacements in ETL workflows',
    'Monitor system.table_changes() for row-level change streams and audit trails',
    'Configure appropriate connector properties in etc/catalog/*.properties - coordinator restart required for changes',
    'Use metadata tables ($history, $snapshots, $files) for table introspection and maintenance',
    'Pair Trino with streaming engines (Flink/Spark) for real-time ingestion then interactive analytics',
    'Implement expire_snapshots and remove_orphan_files procedures for storage management',
    'Use hidden partition transforms for automatic partition pruning without explicit WHERE clauses',
    'Configure security delegation to underlying catalog systems (Ranger, IAM, Nessie policies)',
    'Be aware that proliferation of small files can degrade performance - optimize regularly'
  ]
};