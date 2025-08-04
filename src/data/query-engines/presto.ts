// data/query-engines/presto.ts
import { QueryEngine } from '../../types/iceberg';

export const presto: QueryEngine = {
  id: 'presto',
  name: 'Presto 0.288+',
  description: 'Distributed SQL query engine with REST/Nessie catalogs, row-level DELETE, time travel, and configurable MoR/CoW modes for interactive analytics',
  category: 'general-purpose',
  website: 'https://prestodb.io/',
  documentation: 'https://github.com/prestodb/presto/blob/master/presto-docs/src/main/sphinx/connector/iceberg.rst',
  features: {
    catalogs: {
      support: 'full',
      details: 'Hive Metastore, AWS Glue, REST/Nessie (0.277+ with OAuth2), Hadoop (file-based); JDBC possible via same properties',
      externalLinks: [
        {
          label: 'Iceberg Connector Documentation',
          url: 'https://github.com/prestodb/presto/blob/master/presto-docs/src/main/sphinx/connector/iceberg.rst'
        },
        {
          label: 'REST/Nessie Catalog Support',
          url: 'https://github.com/prestodb/presto/blob/master/presto-docs/src/main/sphinx/connector/iceberg.rst#catalogs'
        }
      ]
    },
    readWrite: {
      support: 'partial',
      details: 'Reads all Iceberg v1/v2 tables; INSERT, CTAS, DELETE (row & partition) available since 0.277-0.282. Presto C++ is read-only',
      externalLinks: [
        {
          label: 'DML Operations Documentation',
          url: 'https://github.com/prestodb/presto/blob/master/presto-docs/src/main/sphinx/connector/iceberg.rst#dml-operations'
        },
        {
          label: 'Presto C++ Limitations',
          url: 'https://cloud.ibm.com/docs/watsonxdata?topic=watsonxdata-known_issues'
        }
      ]
    },
    dml: {
      support: 'partial',
      details: 'INSERT, CTAS, DELETE (row-level, partition); UPDATE experimental; MERGE not yet supported. Presto C++ has no DML',
      externalLinks: [
        {
          label: 'DELETE Operations',
          url: 'https://github.com/prestodb/presto/blob/master/presto-docs/src/main/sphinx/connector/iceberg.rst#delete'
        },
        {
          label: 'MERGE INTO Support Tracking',
          url: 'https://github.com/prestodb/presto/issues/20578'
        }
      ]
    },
    morCow: {
      support: 'full',
      details: 'Table props write.delete.mode/write.update.mode choose COPY_ON_WRITE or MERGE_ON_READ; readers honor MoR with enable-merge-on-read-mode=true',
      externalLinks: [
        {
          label: 'Delete File Formats',
          url: 'https://iceberg.apache.org/spec/#delete-formats'
        },
        {
          label: 'MoR Configuration',
          url: 'https://github.com/prestodb/presto/blob/master/presto-docs/src/main/sphinx/connector/iceberg.rst#merge-on-read'
        }
      ]
    },
    streaming: {
      support: 'none',
      details: 'None - batch queries only; external engines handle CDC and streaming ingestion',
      externalLinks: [
        {
          label: 'Connector Limitations',
          url: 'https://github.com/prestodb/presto/blob/master/presto-docs/src/main/sphinx/connector/iceberg.rst#limitations'
        }
      ]
    },
    formatV3: {
      support: 'none',
      details: 'Roadmap: read Deletion Vectors & Row Lineage after Iceberg 1.8 libraries land; write DV planned post-0.295. Currently supports v1/v2 only',
      externalLinks: [
        {
          label: 'Format Version Support',
          url: 'https://github.com/prestodb/presto/blob/master/presto-docs/src/main/sphinx/connector/iceberg.rst#format-versions'
        },
        {
          label: 'Iceberg Format Versioning',
          url: 'https://iceberg.apache.org/spec/#format-versioning'
        }
      ]
    },
    timeTravel: {
      support: 'full',
      details: 'AS OF TIMESTAMP / @snapshot_id=... syntax (0.282+). Snapshot procedures: rollback, expire, remove orphan files',
      externalLinks: [
        {
          label: 'Time Travel in Presto',
          url: 'https://medium.com/@akbg/time-travel-for-iceberg-tables-in-presto-1dd8364f29cb'
        },
        {
          label: 'Time Travel Syntax Issue',
          url: 'https://github.com/prestodb/presto/issues/21396'
        }
      ]
    },
    security: {
      support: 'full',
      details: 'Relies on Hive/Glue/Nessie ACLs; Presto logs for audit; iceberg.security configuration for authorization',
      externalLinks: [
        {
          label: 'Security Configuration',
          url: 'https://github.com/prestodb/presto/blob/master/presto-docs/src/main/sphinx/connector/iceberg.rst#authorization'
        }
      ]
    }
  },
  quickStart: `-- Create Iceberg table in Presto
CREATE TABLE iceberg.default.orders (
  order_id BIGINT,
  customer_id BIGINT,
  order_date DATE,
  total_amount DECIMAL(10,2)
) WITH (
  format = 'PARQUET',
  partitioning = ARRAY['month(order_date)']
);

-- Insert data
INSERT INTO iceberg.default.orders 
VALUES (1, 100, DATE '2024-01-15', 99.99);

-- Row-level DELETE
DELETE FROM iceberg.default.orders 
WHERE order_id = 1;

-- Time travel query
SELECT * FROM iceberg.default.orders 
FOR VERSION AS OF 1234567890;`,
  bestPractices: [
    'Use Presto 0.288+ for latest Iceberg features and stability improvements',
    'Configure REST/Nessie catalogs (0.277+) with OAuth2 for secure catalog access',
    'Enable merge-on-read-mode=true for reading tables with delete files efficiently',
    'Use table properties write.delete.mode and write.update.mode to control CoW vs MoR behavior',
    'Leverage time travel with AS OF TIMESTAMP or @snapshot_id syntax for point-in-time queries',
    'Be aware that Presto C++ (Velox) is read-only - use Java Presto for write operations',
    'Use DELETE operations for row-level modifications - more efficient than partition rewrites',
    'Monitor UPDATE feature status as it is still experimental and may have limitations',
    'Plan for MERGE INTO support - currently not available but being tracked',
    'Configure manifest caching (0.282+) for improved metadata query performance',
    'Use metadata tables ($snapshots, $history, $manifests, etc.) for table introspection',
    'Implement proper authorization through iceberg.security configuration',
    'Leverage dynamic filtering and split-thread tuning for query optimization',
    'Consider Alluxio or file-stripe cache for performance in data-intensive workloads',
    'Keep tables at spec v1/v2 until v3 support is available (post-0.295)',
    'Use snapshot procedures (rollback, expire, remove orphan files) for table maintenance',
    'Configure Parquet/ORC footer cache for repeated query performance',
    'Monitor Presto logs for audit and security compliance requirements',
    'Test experimental features thoroughly before production deployment',
    'Plan migration strategy for when MERGE operations become available'
  ]
};