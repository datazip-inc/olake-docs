// data/query-engines/clickhouse.ts
import { QueryEngine } from '../../types/iceberg';

export const clickhouse: QueryEngine = {
  id: 'clickhouse',
  name: 'ClickHouse v25.4',
  description: 'Rapidly evolving OLAP database with experimental Iceberg read support, time travel, REST catalogs, and comprehensive write capabilities planned for 2025',
  category: 'general-purpose',
  website: 'https://clickhouse.com/',
  documentation: 'https://clickhouse.com/docs/en/engines/table-engines/integrations/iceberg',
  features: {
    catalogs: {
      support: 'partial',
      details: 'Path (Hadoop-style) since 24.3, REST catalog (Nessie, Polaris/Unity, Glue REST) in 24.12; HMS experimental & AWS Glue in testing; R2 catalog on roadmap',
      externalLinks: [
        {
          label: 'ClickHouse Release 24.12',
          url: 'https://clickhouse.com/blog/clickhouse-release-24-12'
        },
        {
          label: 'Iceberg Engine Documentation',
          url: 'https://clickhouse.com/docs/en/engines/table-engines/integrations/iceberg'
        },
        {
          label: 'GitHub Iceberg Roadmap',
          url: 'https://github.com/ClickHouse/ClickHouse/issues/71407'
        }
      ]
    },
    readWrite: {
      support: 'partial',
      details: 'Read-only: ENGINE=Iceberg tables and icebergS3()/icebergCluster() functions; full SQL on Parquet files. Writes/compaction scheduled Q3 2025',
      externalLinks: [
        {
          label: 'ClickHouse Release 25.04',
          url: 'https://clickhouse.com/blog/clickhouse-release-25-04'
        },
        {
          label: 'Iceberg Write Support Tracking',
          url: 'https://github.com/ClickHouse/ClickHouse/issues/71407'
        }
      ]
    },
    dml: {
      support: 'none',
      details: 'Reading of position & equality deletes supported since 24.12; queries merge delete files on-the-fly (MoR). No DELETE/UPDATE/MERGE writers until write support lands',
      externalLinks: [
        {
          label: 'Delete Files Support',
          url: 'https://clickhouse.com/blog/clickhouse-release-24-12'
        },
        {
          label: 'DML Write Support Tracking',
          url: 'https://github.com/ClickHouse/ClickHouse/issues/66588'
        }
      ]
    },
    morCow: {
      support: 'partial',
      details: 'Copy-on-Write always readable; Merge-on-Read readable from 24.12 (non-materialized delete files)',
      externalLinks: [
        {
          label: 'MoR Support in 24.12',
          url: 'https://clickhouse.com/blog/clickhouse-release-24-12'
        },
        {
          label: 'Changelog 24.12',
          url: 'https://clickhouse.com/docs/changelogs/24.12'
        }
      ]
    },
    streaming: {
      support: 'none',
      details: 'No native streaming ingestion; users poll Iceberg or ingest with ClickHouse Kafka engine; roadmap includes ClickPipe Iceberg-CDC for near-real-time sync',
      externalLinks: [
        {
          label: 'Streaming Roadmap',
          url: 'https://github.com/ClickHouse/ClickHouse/issues/71407'
        }
      ]
    },
    formatV3: {
      support: 'none',
      details: 'Not yet supported - engine rejects DV tables; v3 reader/writer planned post-spec-v2 completeness; DV/lineage scheduled Q3 2025',
      externalLinks: [
        {
          label: 'Format V3 Tracking',
          url: 'https://github.com/ClickHouse/ClickHouse/issues/71407'
        },
        {
          label: 'Deletion Vectors Issue',
          url: 'https://github.com/ClickHouse/ClickHouse/issues/74046'
        }
      ]
    },
    timeTravel: {
      support: 'full',
      details: 'Time-travel since 25.4 with SET iceberg_timestamp_ms=<epoch> or iceberg_snapshot_id; partition pruning via use_iceberg_partition_pruning=1',
      externalLinks: [
        {
          label: 'Time Travel in 25.4',
          url: 'https://clickhouse.com/blog/clickhouse-release-25-04'
        },
        {
          label: 'Release 25.4 Presentation',
          url: 'https://presentations.clickhouse.com/2025-release-25.4/'
        }
      ]
    },
    security: {
      support: 'partial',
      details: 'Relies on object-store credentials (AWS_ACCESS_KEY_ID, S3 V4 tokens) or catalog credential vending; ClickHouse RBAC controls database/table access; no column-masking yet',
      externalLinks: [
        {
          label: 'Open House Conference Highlights',
          url: 'https://clickhouse.com/blog/highlights-from-open-house-our-first-user-conference'
        }
      ]
    }
  },
  quickStart: `-- Create database with DataLakeCatalog engine
CREATE DATABASE iceberg_db 
ENGINE = DataLakeCatalog('iceberg', 'path/to/warehouse')
SETTINGS catalog_type='rest';

-- Create Iceberg table (read-only currently)
CREATE TABLE iceberg_table 
ENGINE = Iceberg('s3://bucket/warehouse/table/');

-- Query with time travel (v25.4+)
SELECT * FROM iceberg_table 
SETTINGS iceberg_timestamp_ms = 1640995200000;

-- Use cluster function for distributed reads
SELECT * FROM icebergCluster('cluster', 's3://bucket/warehouse/table/');`,
  bestPractices: [
    'Use ClickHouse v25.4+ for time travel and metadata caching capabilities',
    'Leverage REST catalog support (24.12+) for integration with Nessie, Polaris/Unity, and Glue',
    'Enable partition pruning with use_iceberg_partition_pruning=1 for better query performance',
    'Use icebergCluster() function for distributed reads across ClickHouse cluster',
    'Configure metadata cache for 30-50% faster snapshot discovery in v25.4',
    'Be aware that ENGINE=Iceberg is still experimental - test thoroughly before production use',
    'Use string data types instead of varchar to avoid "Unknown Iceberg type" errors',
    'Query through DatabaseDataLake engine if encountering varchar type issues',
    'Avoid CREATE VIEW on S3 functions for large datasets - may scan entire lake',
    'Use S3Queue with ordered mode for sequential file processing or unordered for parallel',
    'Configure object-store credentials properly for catalog credential vending',
    'Plan for write capabilities arriving Q3 2025 - currently read-only',
    'Consider cloud features like distributed cache and stateless workers for performance',
    'Monitor S3 costs carefully as views and large scans can be expensive',
    'Use single URL patterns with wildcards in S3 functions - arrays not supported',
    'Keep tables at spec v1/v2 until v3 support arrives in Q3 2025',
    'Implement ClickHouse RBAC for database and table access control',
    'Plan migration strategy for when write capabilities become available',
    'Use materialized views for query acceleration on frequently accessed data',
    'Monitor GitHub issues for rapid feature development and breaking changes'
  ]
};