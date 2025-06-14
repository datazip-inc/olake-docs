// data/query-engines/clickhouse.ts
import { QueryEngine } from '../../types/iceberg';

export const clickhouse: QueryEngine = {
  id: 'clickhouse',
  name: 'ClickHouse',
  description: 'High-performance columnar OLAP database with Iceberg table engine support',
  category: 'analytics',
  website: 'https://clickhouse.com/',
  documentation: 'https://clickhouse.com/docs/en/engines/table-engines/integrations/iceberg',
  features: {
    catalogs: {
      support: 'partial',
      details: 'S3-based catalogs only; no Hive Metastore or REST catalog support',
      externalLinks: [
        { label: 'Iceberg Table Engine', url: 'https://clickhouse.com/docs/en/engines/table-engines/integrations/iceberg' },
        { label: 'S3 Table Function', url: 'https://clickhouse.com/docs/en/sql-reference/table-functions/iceberg' }
      ]
    },
    readWrite: {
      support: 'partial',
      details: 'Read-only access to Iceberg tables; writes must go through other engines',
      externalLinks: [
        { label: 'Table Functions', url: 'https://clickhouse.com/docs/en/sql-reference/table-functions/' }
      ]
    },
    dml: {
      support: 'none',
      details: 'No DML support; ClickHouse can only read from Iceberg tables'
    },
    morCow: {
      support: 'partial',
      details: 'Reads both base files and delete files; merges happen at query time'
    },
    streaming: {
      support: 'none',
      details: 'Batch reads only; no streaming consumption of Iceberg changes'
    },
    formatV3: {
      support: 'none',
      details: 'Only supports Iceberg spec v1/v2; no v3 features'
    },
    timeTravel: {
      support: 'none',
      details: 'No time travel support; always reads latest snapshot'
    },
    security: {
      support: 'partial',
      details: 'Inherits S3 authentication; no fine-grained access control on Iceberg metadata',
      externalLinks: [
        { label: 'Access Control', url: 'https://clickhouse.com/docs/en/operations/access-rights' }
      ]
    }
  },
  quickStart: `-- Query Iceberg table in ClickHouse
-- Using table function
SELECT * 
FROM iceberg('s3://bucket/path/to/table/', 'access_key', 'secret_key')
WHERE date >= '2024-01-01'
LIMIT 100;

-- Create a table engine
CREATE TABLE iceberg_table
ENGINE = Iceberg('s3://bucket/path/to/table/', 'access_key', 'secret_key');

-- Query the table
SELECT count(*), sum(amount)
FROM iceberg_table
WHERE category = 'electronics';`,
  bestPractices: [
    'Use ClickHouse for analytical queries on Iceberg data lakes',
    'Leverage ClickHouse\'s powerful aggregation capabilities',
    'Consider materialized views for frequently accessed Iceberg data',
    'Use proper S3 endpoint configuration for your region',
    'Monitor query performance with system.query_log',
    'Combine with ClickHouse native tables for hybrid architectures'
  ]
};