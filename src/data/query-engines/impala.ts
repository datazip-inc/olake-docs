// data/query-engines/impala.ts
import { QueryEngine } from '../../types/iceberg';

export const impala: QueryEngine = {
  id: 'impala',
  name: 'Apache Impala v4.4+',
  description: 'High-performance analytics engine with Iceberg v2 support, row-level operations via position deletes, and deep HMS integration for enterprise environments',
  category: 'analytics',
  website: 'https://impala.apache.org/',
  documentation: 'https://impala.apache.org/docs/build/html/topics/impala_iceberg.html',
  features: {
    catalogs: {
      support: 'limited',
      details: 'HiveCatalog (HMS), HadoopCatalog, HadoopTables; other catalog-impl values can be registered in Hive site-config but no direct Glue/REST/Nessie support',
      externalLinks: [
        {
          label: 'Using Impala with Iceberg Tables',
          url: 'https://impala.apache.org/docs/build/html/topics/impala_iceberg.html'
        }
      ]
    },
    readWrite: {
      support: 'full',
      details: 'Full SELECT/INSERT/CTAS/ALTER/DROP on Iceberg tables with ACID snapshot-isolation on every commit',
      externalLinks: [
        {
          label: 'Impala Iceberg DDL/DML Support',
          url: 'https://impala.apache.org/docs/build/html/topics/impala_iceberg.html'
        }
      ]
    },
    dml: {
      support: 'partial',
      details: 'INSERT INTO & INSERT OVERWRITE, DELETE (v2 position-delete files), UPDATE (v2 position deletes); MERGE planned/preview in CDW 1.5.5',
      externalLinks: [
        {
          label: 'Iceberg V2 Tables - Impala',
          url: 'https://impala.apache.org/docs/build/html/topics/impala_iceberg.html'
        },
        {
          label: 'Row-level Operations - Cloudera',
          url: 'https://docs.cloudera.com/cdw-runtime/cloud/iceberg-how-to/topics/iceberg-row-level-ops.html'
        }
      ]
    },
    morCow: {
      support: 'partial',
      details: 'Copy-on-Write for overwrites; Merge-on-Read for row-level UPDATE/DELETE with position-delete files; equality deletes not supported',
      externalLinks: [
        {
          label: 'Impala Iceberg V2 - MoR Support',
          url: 'https://impala.apache.org/docs/build/html/topics/impala_iceberg.html'
        }
      ]
    },
    streaming: {
      support: 'none',
      details: 'No built-in streaming ingestion or CDC apply; reads latest Iceberg snapshot at query start time only',
      externalLinks: [
        {
          label: 'Using Impala with Iceberg Tables',
          url: 'https://impala.apache.org/docs/build/html/topics/impala_iceberg.html'
        }
      ]
    },
    formatV3: {
      support: 'none',
      details: 'Supports spec v1 and v2 tables only; spec v3 features like deletion vectors, row lineage, and new catalog RPCs not supported',
      externalLinks: [
        {
          label: 'Impala Iceberg V2 - Format Support',
          url: 'https://impala.apache.org/docs/build/html/topics/impala_iceberg.html'
        }
      ]
    },
    timeTravel: {
      support: 'full',
      details: 'Manual snapshot queries via FOR SYSTEM_TIME AS OF / FOR SYSTEM_VERSION AS OF; DESCRIBE HISTORY & EXPIRE SNAPSHOTS commands available',
      externalLinks: [
        {
          label: 'Time Travel - Impala Docs',
          url: 'https://impala.apache.org/docs/build/html/topics/impala_iceberg.html'
        }
      ]
    },
    security: {
      support: 'delegated',
      details: 'Relies on Hive Metastore + Apache Ranger ACLs; storage-layer permissions (HDFS/S3/Ozone) apply; integrates with enterprise security infrastructure',
      externalLinks: [
        {
          label: 'Accessing Iceberg Tables - Ranger',
          url: 'https://docs.cloudera.com/cdw-runtime/1.5.4/iceberg-how-to/topics/iceberg-ranger-introduction.html'
        }
      ]
    }
  },
  quickStart: `-- Create Iceberg v2 table for row-level operations
CREATE TABLE my_iceberg_table (
  id BIGINT,
  name STRING,
  created_at TIMESTAMP
) STORED AS ICEBERG
TBLPROPERTIES (
  'format-version'='2',
  'write.parquet.compression-codec'='snappy'
);

-- Time travel query
SELECT * FROM my_iceberg_table 
FOR SYSTEM_TIME AS OF '2025-01-01 10:00:00';

-- Row-level UPDATE (requires format-version=2)
UPDATE my_iceberg_table 
SET name = 'updated_name' 
WHERE id = 123;`,
  bestPractices: [
    'Use Impala 4.4+ for full UPDATE/DELETE support with Iceberg v2 tables',
    'Set format-version=2 in table properties to enable row-level DML operations',
    'Configure HMS 3.1.2+ for proper Iceberg metadata management',
    'Use Parquet format for writes as it\'s the only supported write format',
    'Enable manifest caching via iceberg.io.manifest.cache.* properties for performance',
    'Leverage hidden-partition pruning for better query performance on partitioned tables',
    'Use DESCRIBE HISTORY to inspect table evolution and snapshot information',
    'Set external.table.purge=true to control data deletion behavior on DROP TABLE',
    'Configure Apache Ranger policies for table and column-level access control',
    'Use REFRESH commands after external table modifications for metadata consistency',
    'Leverage parallel manifest reads for improved metadata processing performance',
    'Configure LLVM compilation for optimized query execution paths',
    'Use in-memory data caching for frequently accessed datasets',
    'Monitor and expire old snapshots regularly with EXPIRE SNAPSHOTS command',
    'Plan for Copy-on-Write overhead on INSERT OVERWRITE operations',
    'Use position delete files understanding for Merge-on-Read table design',
    'Configure appropriate storage-layer permissions (HDFS/S3/Ozone) for data access',
    'Leverage $snapshots, $history, $manifests, $files metadata tables for introspection',
    'Consider Puffin NDV statistics for improved query planning (read-only)',
    'Plan catalog integration carefully as direct Glue/REST/Nessie support is not available',
    'Use INSERT INTO for append operations and INSERT OVERWRITE for partition replacement',
    'Consider schema evolution limitations on complex types when designing table schemas',
    'Monitor manifest cache effectiveness and tune cache settings appropriately',
    'Use snapshot isolation guarantees for consistent read operations'
  ]
};