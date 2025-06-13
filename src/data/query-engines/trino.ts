// data/query-engines/trino.ts
import { QueryEngine } from '../../types/iceberg';

export const trino: QueryEngine = {
  id: 'trino',
  name: 'Trino 475+',
  description: 'Fast ad-hoc analytics with full DML support and rich metadata operations',
  category: 'analytics',
  website: 'https://trino.io/',
  documentation: 'https://trino.io/docs/current/connector/iceberg.html',
  features: {
    catalogs: {
      support: 'full',
      details: 'hive_metastore, glue, jdbc, rest, nessie, or snowflake catalog types'
    },
    readWrite: {
      support: 'full',
      details: 'Ad-hoc SQL reads with optimization; writes via INSERT, CTAS, CREATE OR REPLACE, INSERT OVERWRITE'
    },
    dml: {
      support: 'full',
      details: 'UPDATE, DELETE, MERGE INTO emit position/equality delete files (v414+)'
    },
    morCow: {
      support: 'full',
      details: 'Default Merge-on-Read for row-level DML; CTAS/INSERT OVERWRITE use copy-on-write'
    },
    streaming: {
      support: 'none',
      details: 'Batch/interactive only; reads tables updated by streaming engines'
    },
    formatV3: {
      support: 'none',
      details: 'Not yet GA; currently supports only spec v1/v2'
    },
    timeTravel: {
      support: 'full',
      details: 'FOR VERSION AS OF or FOR TIMESTAMP AS OF with snapshot/branch properties'
    },
    security: {
      support: 'full',
      details: 'Honors catalog ACLs; Enterprise builds add column masking & row filtering'
    }
  },
  quickStart: `-- Trino with Iceberg
CREATE SCHEMA iceberg.prod;
CREATE TABLE iceberg.prod.table (
  id bigint,
  data varchar
) WITH (format = 'PARQUET');
INSERT INTO iceberg.prod.table VALUES (1, 'data');`,
  bestPractices: [
    'Use metadata caching for improved query performance',
    'Enable dynamic filtering for better partition pruning',
    'Run OPTIMIZE regularly to compact small files',
    'Configure bucket execution for join optimization'
  ]
};