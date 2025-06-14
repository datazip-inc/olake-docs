// data/query-engines/hive.ts
import { QueryEngine } from '../../types/iceberg';

export const hive: QueryEngine = {
  id: 'hive',
  name: 'Apache Hive 4.0+',
  description: 'Traditional data warehouse with native Iceberg support via HiveIcebergStorageHandler',
  category: 'general-purpose',
  website: 'https://hive.apache.org/',
  documentation: 'https://cwiki.apache.org/confluence/display/Hive/Iceberg+Integration',
  features: {
    catalogs: {
      support: 'full',
      details: 'Hive Metastore default; supports Hadoop, REST, AWS Glue, JDBC catalogs'
    },
    readWrite: {
      support: 'full',
      details: 'SELECT, INSERT INTO, INSERT OVERWRITE, CTAS via Tez or MapReduce'
    },
    dml: {
      support: 'partial',
      details: 'INSERT and basic MERGE; UPDATE/DELETE requires rewriting entire partitions'
    },
    morCow: {
      support: 'partial',
      details: 'Copy-on-Write only; no Merge-on-Read support yet'
    },
    streaming: {
      support: 'none',
      details: 'Batch processing only; no streaming capabilities'
    },
    formatV3: {
      support: 'none',
      details: 'Supports only Iceberg spec v1/v2; v3 not implemented'
    },
    timeTravel: {
      support: 'partial',
      details: 'Basic snapshot queries via metadata tables; no SQL syntax support'
    },
    security: {
      support: 'full',
      details: 'Apache Ranger integration for fine-grained access control'
    }
  },
  quickStart: `-- Create Iceberg table in Hive
CREATE TABLE iceberg_table (
  id bigint,
  data string
) STORED BY 'org.apache.iceberg.mr.hive.HiveIcebergStorageHandler'
LOCATION 's3://bucket/warehouse/db/table'
TBLPROPERTIES (
  'iceberg.catalog'='hive',
  'iceberg.file-format'='parquet'
);

-- Query Iceberg table
SELECT * FROM iceberg_table WHERE id > 100;`,
  bestPractices: [
    'Use Tez execution engine for better performance',
    'Enable vectorized query execution when possible',
    'Configure appropriate file formats (Parquet recommended)',
    'Use partition pruning to minimize data scans',
    'Regularly run ANALYZE TABLE for statistics',
    'Consider migrating to Spark or Trino for better Iceberg features'
  ]
};