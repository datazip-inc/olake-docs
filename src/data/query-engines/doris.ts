// data/query-engines/doris.ts
import { QueryEngine } from '../../types/iceberg';

export const doris: QueryEngine = {
  id: 'doris',
  name: 'Apache Doris v2.1+',
  description: 'MPP analytical database with comprehensive Iceberg read/write capabilities, vectorized execution, materialized view acceleration, and multi-catalog support for lake ingestion and analytics',
  category: 'general-purpose',
  website: 'https://doris.apache.org/',
  documentation: 'https://doris.apache.org/docs/lakehouse/datalake-analytics/iceberg',
  features: {
    catalogs: {
      support: 'full',
      details: 'CREATE CATALOG supports hive metastore, glue, rest, hadoop, dlf, s3tables with metastore URIs/REST endpoints plus credentials',
      externalLinks: [
        {
          label: 'Iceberg Catalog Documentation',
          url: 'https://doris.apache.org/docs/lakehouse/datalake-analytics/iceberg'
        },
        {
          label: 'Iceberg Catalog Configuration',
          url: 'https://doris.apache.org/docs/dev/lakehouse/catalogs/iceberg-catalog'
        }
      ]
    },
    readWrite: {
      support: 'full',
      details: 'Full SELECT and write-back: INSERT, INSERT OVERWRITE, CTAS. Doris writes Parquet/ORC files and commits Iceberg snapshots as lake-ingestion engine',
      externalLinks: [
        {
          label: 'Iceberg Data Building',
          url: 'https://doris.apache.org/docs/lakehouse/datalake-building/iceberg-build'
        },
        {
          label: 'Data Operations Examples',
          url: 'https://doris.apache.org/docs/lakehouse/datalake-building/iceberg-build'
        }
      ]
    },
    dml: {
      support: 'partial',
      details: 'INSERT INTO (append), INSERT OVERWRITE, UPDATE & DELETE via Iceberg-v2 delete files (v2.1+). MERGE not yet single statement but emulated with patterns',
      externalLinks: [
        {
          label: 'DML Operations Support',
          url: 'https://doris.apache.org/docs/lakehouse/datalake-building/iceberg-build'
        },
        {
          label: 'Delete File Support',
          url: 'https://doris.apache.org/docs/lakehouse/datalake-analytics/iceberg'
        }
      ]
    },
    morCow: {
      support: 'full',
      details: 'Reads: applies position and equality delete files (MoR) automatically. Writes: generates position/equality delete files for UPDATE/DELETE; INSERT OVERWRITE rewrites files (CoW)',
      externalLinks: [
        {
          label: 'Position and Equality Delete Support',
          url: 'https://doris.apache.org/docs/lakehouse/datalake-analytics/iceberg'
        },
        {
          label: 'Doris and Iceberg Best Practices',
          url: 'https://doris.apache.org/docs/dev/lakehouse/best-practices/doris-iceberg'
        }
      ]
    },
    streaming: {
      support: 'none',
      details: 'No native streaming/CDC writer; use external tools (Flink-Iceberg) to land data, then query with sub-second latency. Routine Load only targets internal tables',
      externalLinks: [
        {
          label: 'Loading Overview',
          url: 'https://doris.apache.org/docs/data-operate/import/load-manual'
        }
      ]
    },
    formatV3: {
      support: 'none',
      details: 'Supports Iceberg spec v1 & v2 only. Spec v3 work follows upstream Iceberg roadmap - no GA support yet',
      externalLinks: [
        {
          label: 'Format Compatibility',
          url: 'https://doris.apache.org/docs/lakehouse/datalake-analytics/iceberg'
        }
      ]
    },
    timeTravel: {
      support: 'full',
      details: 'Query historical data with FOR TIMESTAMP AS OF / FOR VERSION AS OF or iceberg_meta() function. System tables ($snapshots, $manifests, $history) exposed',
      externalLinks: [
        {
          label: 'ICEBERG_META Function',
          url: 'https://doris.apache.org/docs/sql-manual/sql-functions/table-valued-functions/iceberg-meta'
        }
      ]
    },
    security: {
      support: 'partial',
      details: 'Doris RBAC plus underlying catalog/storage IAM. Ranger/Lake Formation policies apply at metastore/storage; Doris adds row-policies & column masking on query',
      externalLinks: [
        {
          label: 'Built-in Authorization',
          url: 'https://doris.apache.org/docs/admin-manual/auth/authorization/internal'
        },
        {
          label: 'Introduction to Apache Doris',
          url: 'https://doris.apache.org/blog/introduction-to-apache-doris-a-next-generation-real-time-data-warehouse'
        }
      ]
    }
  },
  quickStart: `-- Create Iceberg catalog in Doris
CREATE CATALOG iceberg_catalog PROPERTIES (
  "type"="iceberg",
  "iceberg.catalog.type"="hive",
  "iceberg.catalog.hive.metastore.uris"="thrift://hms:9083"
);

-- Use the catalog and create table
USE iceberg_catalog;
CREATE TABLE sales_data (
  order_id BIGINT,
  customer_id BIGINT,
  order_date DATE,
  total_amount DECIMAL(10,2)
) ENGINE=ICEBERG;

-- Insert data
INSERT INTO sales_data 
VALUES (1, 100, '2024-01-15', 99.99);

-- Update with delete files (v2.1+)
UPDATE sales_data 
SET total_amount = 149.99 
WHERE order_id = 1;

-- Time travel query
SELECT * FROM sales_data 
FOR TIMESTAMP AS OF '2024-01-15 10:00:00';

-- Query metadata
SELECT * FROM iceberg_meta("table"="sales_data", "query_type"="snapshots");`,
  bestPractices: [
    'Use Doris v2.1+ for UPDATE/DELETE support via Iceberg v2 delete files',
    'Leverage comprehensive catalog support (HMS, Glue, REST, Hadoop, DLF, S3 Tables) for flexibility',
    'Use INSERT OVERWRITE for partition or whole-table replacement patterns',
    'Implement external streaming tools (Flink-Iceberg) for real-time ingestion, query with Doris',
    'Take advantage of vectorized reader and manifest caching for high-performance analytics',
    'Use materialized views on Iceberg sources for zero-ETL aggregation acceleration',
    'Enable metadata caching for improved query performance on large datasets',
    'Leverage partition-predicate push-down for efficient query pruning',
    'Use iceberg_meta() table function for metadata introspection and debugging',
    'Configure Doris RBAC and row/column policies for additional security layers',
    'Be aware of MERGE statement limitation - use INSERT OVERWRITE patterns as workaround',
    'Monitor concurrent multi-engine writes and implement retry logic for conflicts',
    'Use FOR TIMESTAMP AS OF / FOR VERSION AS OF for time travel queries',
    'Query system tables ($snapshots, $manifests, $history) for table introspection',
    'Leverage both Parquet and ORC format support based on workload requirements',
    'Plan for equality-delete support in ORC format available since v2.1.3+',
    'Use CREATE MATERIALIZED VIEW ... REFRESH for automated aggregate maintenance',
    'Be aware that Avro data files are not supported in current versions',
    'Configure appropriate catalog credentials and metastore URIs for secure access',
    'Monitor Iceberg client version (currently 1.6.1) for compatibility with other engines'
  ]
};