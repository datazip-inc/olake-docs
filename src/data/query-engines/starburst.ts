// data/query-engines/starburst.ts
import { QueryEngine } from '../../types/iceberg';

export const starburst: QueryEngine = {
  id: 'starburst',
  name: 'starburst',
  description: 'Distributed SQL query engine for interactive analytics at scale',
  category: 'analytics',
  website: 'https://starburst.io/',
  documentation: 'https://starburst.io/docs/current/connector/iceberg.html',
  features: {
    catalogs: {
      support: 'partial',
      details: 'Hive Metastore and Hadoop catalogs; limited REST support'
    },
    readWrite: {
      support: 'full',
      details: 'Full read support; writes via INSERT, CTAS, CREATE TABLE AS'
    },
    dml: {
      support: 'partial',
      details: 'INSERT only; no UPDATE/DELETE/MERGE support'
    },
    morCow: {
      support: 'partial',
      details: 'Read-only for Merge-on-Read; writes use Copy-on-Write'
    },
    streaming: {
      support: 'none',
      details: 'Batch processing only; designed for interactive queries'
    },
    formatV3: {
      support: 'none',
      details: 'Supports Iceberg v1/v2; v3 features not available'
    },
    timeTravel: {
      support: 'partial',
      details: 'Snapshot queries via @snapshot_id syntax'
    },
    security: {
      support: 'full',
      details: 'File-based access control; integration with Ranger/Sentry'
    }
  },
  quickStart: `-- Configure Iceberg connector in starburst
-- In catalog/iceberg.properties:
connector.name=iceberg
hive.metastore.uri=thrift://localhost:9083
iceberg.file-format=PARQUET

-- Query Iceberg table
SELECT * FROM iceberg.db.table
WHERE date = DATE '2024-01-15';

-- Create new table
CREATE TABLE iceberg.db.new_table AS
SELECT * FROM source_table
WITH (format = 'PARQUET');`,
  bestPractices: [
    'Use cost-based optimizer for complex queries',
    'Enable dynamic filtering for better performance',
    'Configure appropriate memory settings per query',
    'Use columnar formats (Parquet/ORC) for best performance',
    'Consider Trino for newer features and better Iceberg support',
    'Monitor query performance with built-in UI'
  ]
};