// data/query-engines/snowflake.ts
import { QueryEngine } from '../../types/iceberg';

export const snowflake: QueryEngine = {
  id: 'snowflake',
  name: 'Snowflake',
  description: 'Native Iceberg tables with automatic optimization and governance',
  category: 'cloud-native',
  website: 'https://www.snowflake.com/',
  documentation: 'https://docs.snowflake.com/en/user-guide/tables-iceberg',
  features: {
    catalogs: {
      support: 'partial',
      details: 'Snowflake catalog (native); external catalogs read-only'
    },
    readWrite: {
      support: 'full',
      details: 'All DML & DDL on Snowflake-catalog Iceberg tables'
    },
    dml: {
      support: 'full',
      details: 'INSERT, UPDATE, DELETE, MERGE INTO all ACID compliant'
    },
    morCow: {
      support: 'full',
      details: 'DML writes MoR delete files; automatic optimization to CoW'
    },
    streaming: {
      support: 'full',
      details: 'Snowpipe Streaming & Streams/Tasks for CDC'
    },
    formatV3: {
      support: 'none',
      details: 'Not supported; writes spec v2 only'
    },
    timeTravel: {
      support: 'full',
      details: 'AT(SNAPSHOT => \'id\') or AT(TIME => \'ts\'); Zero-Copy Clones'
    },
    security: {
      support: 'full',
      details: 'Full RBAC, column masking, row-access policies'
    }
  },
  quickStart: `-- Snowflake Iceberg table
CREATE OR REPLACE ICEBERG TABLE my_iceberg_table (
  id NUMBER,
  name STRING,
  created_at TIMESTAMP
) 
CATALOG = 'SNOWFLAKE'
EXTERNAL_VOLUME = 'my_external_volume'
BASE_LOCATION = 'path/to/table/';`,
  bestPractices: [
    'Use Snowflake-managed catalogs for full feature support',
    'Enable automatic clustering for better query performance',
    'Leverage Snowpipe Streaming for real-time data ingestion',
    'Use time travel and cloning for data protection and testing'
  ]
};