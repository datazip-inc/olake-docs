// data/query-engines/clickhouse.ts
import { QueryEngine } from '../../types/iceberg';
import { createVersionedEngine } from './versioning';

export const clickhouse: QueryEngine = createVersionedEngine({
  id: 'clickhouse',
  name: 'ClickHouse v25.9',
  description: 'Rapidly evolving OLAP database with Iceberg read+write support (v25.7+), time travel (v25.4+), REST catalogs, and basic DML (INSERT/ALTER DELETE/ALTER UPDATE) via LTS v25.8',
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
      details: 'Full reads via ENGINE=Iceberg and icebergS3()/icebergCluster() functions. Write support added v25.7 (INSERT INTO existing tables), CREATE TABLE and DROP TABLE added v25.8 (LTS). No compaction yet',
      externalLinks: [
        {
          label: 'ClickHouse Release 25.08 (LTS)',
          url: 'https://clickhouse.com/blog/clickhouse-release-25-08'
        },
        {
          label: 'ClickHouse 2025 Year in Review',
          url: 'https://clickhouse.com/blog/clickhouse-2025-roundup'
        }
      ]
    },
    dml: {
      support: 'partial',
      details: 'INSERT INTO existing tables (v25.7+), CREATE TABLE (v25.8+), ALTER TABLE DELETE (positional+equality deletes, v25.8+), ALTER TABLE UPDATE (v25.9+). MERGE not yet supported',
      externalLinks: [
        {
          label: 'ClickHouse Release 25.08',
          url: 'https://clickhouse.com/blog/clickhouse-release-25-08'
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
  versions: {
    v2: {
      features: {
        catalogs: {
          support: 'full',
          details: 'REST catalog (icebergS3 function with storage_catalog_type), AWS Glue, Polaris (partial), Unity Catalog (partial) supported via icebergS3/icebergLocal table functions and experimental DataLakeCatalog engine',
          externalLinks: [{ label: 'Iceberg Engine Documentation', url: 'https://clickhouse.com/docs/en/engines/table-engines/integrations/iceberg' }]
        },
        readWrite: {
          support: 'partial',
          details: 'Full reads via icebergS3/icebergAzure/icebergLocal table functions and ENGINE=Iceberg. INSERT INTO existing tables (v25.7+), CREATE TABLE and DROP TABLE (v25.8+, LTS). No compaction',
          externalLinks: [{ label: 'ClickHouse Release 25.08', url: 'https://clickhouse.com/blog/clickhouse-release-25-08' }]
        },
        dml: {
          support: 'partial',
          details: 'INSERT INTO (v25.7+), ALTER TABLE DELETE with positional and equality deletes (v25.8+), ALTER TABLE UPDATE (v25.9+). No MERGE support. Applies to V2 tables',
          externalLinks: [{ label: 'ClickHouse Release 25.08', url: 'https://clickhouse.com/blog/clickhouse-release-25-08' }]
        },
        morCow: {
          support: 'partial',
          details: 'Reads CoW and MoR (position+equality deletes) since v24.12; writes position/equality delete files for ALTER TABLE DELETE (v25.8+); no compaction',
          externalLinks: [{ label: 'ClickHouse Release 25.08', url: 'https://clickhouse.com/blog/clickhouse-release-25-08' }]
        },
        streaming: {
          support: 'none',
          details: 'No native streaming ingestion; users poll Iceberg or ingest with ClickHouse Kafka engine'
        },
        formatV3: {
          support: 'none',
          details: 'Iceberg Format V3 features are not applicable to V2 tables.'
        },
        timeTravel: {
          support: 'full',
          details: 'Time travel via SET iceberg_timestamp_ms=<epoch> or iceberg_snapshot_id since v25.4; partition pruning via use_iceberg_partition_pruning=1',
          externalLinks: [{ label: 'Time Travel in 25.4', url: 'https://clickhouse.com/blog/clickhouse-release-25-04' }]
        },
        security: {
          support: 'partial',
          details: 'Relies on object-store credentials (AWS_ACCESS_KEY_ID, S3 V4 tokens) or catalog credential vending; ClickHouse RBAC controls database/table access; no column-masking yet'
        }
      },
      score: 16,
      description: 'ClickHouse v25.8+ (LTS) supports Iceberg V2 read+write with INSERT INTO, CREATE/DROP TABLE, ALTER TABLE DELETE/UPDATE, time travel, and REST catalog support; MERGE and V3 not yet available'
    },
    v3: {
      features: {
        catalogs: { support: 'none', details: 'ClickHouse only supports reading Iceberg V1 and V2 via table functions; V3 is not yet supported' },
        readWrite: { support: 'none', details: 'ClickHouse currently supports reading Iceberg V1 and V2 only; V3 support is not yet available' },
        dml: { support: 'none', details: 'Read-only integration for V2 only; V3 not supported' },
        morCow: { support: 'none', details: 'V3 deletion vectors not supported; only V1 and V2 tables readable' },
        streaming: { support: 'none', details: 'No streaming support for any version' },
        formatV3: { support: 'none', details: 'Iceberg Format V3 is not yet supported in ClickHouse; V3 reader/writer planned for a future release' },
        timeTravel: { support: 'none', details: 'Time travel only available for V1 and V2 tables; V3 not supported' },
        security: { support: 'none', details: 'V3 not supported; security features are V2 only' }
      },
      score: 0,
      description: 'ClickHouse does not yet support Iceberg V3 format tables. V3 reader/writer planned for a future release'
    }
  },
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
});