// data/query-engines/starrocks.ts
import { QueryEngine } from '../../types/iceberg';

export const starrocks: QueryEngine = {
  id: 'starrocks',
  name: 'StarRocks v3.2/3.3',
  description: 'Vectorized OLAP engine with read-write Iceberg support, async materialized views, CBO optimization, and strong analytical performance for lakehouse analytics',
  category: 'general-purpose',
  website: 'https://www.starrocks.io/',
  documentation: 'https://docs.starrocks.io/docs/data_source/catalog/iceberg/iceberg_catalog/',
  features: {
    catalogs: {
      support: 'full',
      details: 'Hive Metastore, AWS Glue, REST (Nessie/Tabular) with credential vending support',
      externalLinks: [
        {
          label: 'Iceberg Catalog Configuration',
          url: 'https://docs.starrocks.io/docs/data_source/catalog/iceberg/iceberg_catalog/'
        },
        {
          label: 'Apache Iceberg Blog',
          url: 'https://www.starrocks.io/blog/apache-iceberg'
        }
      ]
    },
    readWrite: {
      support: 'partial',
      details: 'Full reads including MoR; INSERT/INSERT OVERWRITE, CREATE/DROP DB & TABLE (v3.1+). No UPDATE/DELETE/MERGE operations',
      externalLinks: [
        {
          label: 'Iceberg Lakehouse Guide',
          url: 'https://docs.starrocks.io/docs/quick_start/iceberg/'
        },
        {
          label: 'Feature Support Data Lake Analytics',
          url: 'https://docs.starrocks.io/docs/data_source/feature-support-data-lake-analytics/'
        }
      ]
    },
    dml: {
      support: 'partial',
      details: 'Supports INSERT & INSERT OVERWRITE (partition-level). No UPDATE/DELETE/MERGE operations available',
      externalLinks: [
        {
          label: 'Data Lake Analytics Features',
          url: 'https://docs.starrocks.io/docs/data_source/feature-support-data-lake-analytics/'
        }
      ]
    },
    morCow: {
      support: 'partial',
      details: 'Reads MoR (position & equality-delete files). Writes CoW only (partition overwrite)',
      externalLinks: [
        {
          label: 'File Format Support',
          url: 'https://docs.starrocks.io/docs/data_source/feature-support-data-lake-analytics/'
        }
      ]
    },
    streaming: {
      support: 'none',
      details: 'No native streaming. Supports Async Materialized Views for incremental ingest patterns',
      externalLinks: [
        {
          label: 'Async Materialized Views',
          url: 'https://docs.starrocks.io/docs/data_source/catalog/iceberg/iceberg_catalog/'
        }
      ]
    },
    formatV3: {
      support: 'none',
      details: 'Not yet GA. Currently supports Iceberg v1 & v2 (Parquet & ORC) only',
      externalLinks: [
        {
          label: 'File Format Support',
          url: 'https://docs.starrocks.io/docs/data_source/catalog/iceberg/iceberg_catalog/'
        }
      ]
    },
    timeTravel: {
      support: 'partial',
      details: 'No SQL "AS OF" in v3.2/3.3 - use separate catalog pointing at older snapshot. SQL time travel supported from v3.4.0+',
      externalLinks: [
        {
          label: 'Time Travel with Iceberg',
          url: 'https://docs.starrocks.io/docs/data_source/catalog/iceberg/iceberg_timetravel/'
        }
      ]
    },
    security: {
      support: 'full',
      details: 'Catalog ACLs respected (IAM/HMS). StarRocks RBAC on external catalogs for fine-grained access control',
      externalLinks: [
        {
          label: 'Data Lake Access Control',
          url: 'https://docs.starrocks.io/docs/data_source/feature-support-data-lake-analytics/'
        }
      ]
    }
  },
  quickStart: `-- Create external Iceberg catalog
CREATE EXTERNAL CATALOG iceberg_catalog 
PROPERTIES (
  "type" = "iceberg",
  "iceberg.catalog.type" = "hive",
  "iceberg.catalog.hive.metastore.uris" = "thrift://metastore:9083"
);

-- Create Iceberg database and table
CREATE DATABASE iceberg_catalog.sales_db;
CREATE TABLE iceberg_catalog.sales_db.orders (
  order_id BIGINT,
  customer_id BIGINT,
  order_date DATE,
  total_amount DECIMAL(10,2)
) ENGINE = iceberg;

-- Insert data
INSERT INTO iceberg_catalog.sales_db.orders 
VALUES (1, 100, '2024-01-15', 99.99);

-- Create async materialized view for performance
CREATE MATERIALIZED VIEW sales_summary
REFRESH ASYNC EVERY(INTERVAL 5 MINUTE)
AS SELECT 
  DATE_TRUNC('day', order_date) as day,
  COUNT(*) as order_count,
  SUM(total_amount) as total_revenue
FROM iceberg_catalog.sales_db.orders 
GROUP BY 1;`,
  bestPractices: [
    'Use StarRocks v3.3+ for latest Iceberg features including equality-delete reads and metadata caching',
    'Configure REST catalog integration for Tabular, Unity Catalog, or Nessie with credential vending',
    'Leverage async materialized views over Iceberg tables for low-latency dashboard queries',
    'Use INSERT OVERWRITE for partition-level data replacement with Iceberg ReplaceSnapshots',
    'Enable metadata caching (enable_iceberg_metadata_cache) for improved query performance',
    'Take advantage of vectorized Parquet/ORC reader for high-performance analytical queries',
    'Use cost-based optimizer with Iceberg statistics for optimal query planning',
    'Configure StarRocks RBAC for fine-grained access control on external Iceberg catalogs',
    'Schedule materialized view refresh every few minutes to avoid scanning lake data on each query',
    'Use identity, year/month/day, bucket, and truncate partition transforms for pruning optimization',
    'Be aware of DML limitations - no UPDATE/DELETE/MERGE operations currently available',
    'Plan for time travel capabilities arriving in v3.4+ with SQL AS OF syntax',
    'Avoid Avro format as it is not currently supported for Iceberg tables',
    'Use partition overwrite pattern instead of row-level modifications for data updates',
    'Monitor equality-delete file accumulation as StarRocks cannot produce equality-delete writes',
    'Leverage data-file and output-size tuning properties for write optimization',
    'Use separate catalog configurations to query different snapshot versions',
    'Configure appropriate row-group size and page size for Parquet write performance',
    'Plan migration path for when UPDATE/DELETE/MERGE operations become available',
    'Consider StarRocks as primary query engine in lakehouse architecture with other engines for writes'
  ]
};