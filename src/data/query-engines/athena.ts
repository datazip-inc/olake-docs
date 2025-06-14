// data/query-engines/athena.ts
import { QueryEngine } from '../../types/iceberg';

export const athena: QueryEngine = {
  id: 'athena',
  name: 'AWS Athena (Engine v3)',
  description: 'Serverless interactive analytics service for querying Iceberg tables in S3',
  category: 'cloud-native',
  website: 'https://aws.amazon.com/athena/',
  documentation: 'https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg.html',
  features: {
    catalogs: {
      support: 'partial',
      details: 'Only AWS Glue Data Catalog supported; no Hive, REST, Nessie, or JDBC catalogs'
    },
    readWrite: {
      support: 'full',
      details: 'SELECT, CREATE TABLE STORED AS ICEBERG, CTAS, INSERT INTO with immediate query availability'
    },
    dml: {
      support: 'full',
      details: 'INSERT INTO, UPDATE, DELETE, MERGE INTO using position-delete files (Iceberg v2)'
    },
    morCow: {
      support: 'partial',
      details: 'Merge-on-Read only; DML produces delete files, Copy-on-Write not configurable'
    },
    streaming: {
      support: 'none',
      details: 'Batch/interactive only; use AWS Glue or Kinesis Data Firehose for streaming to Iceberg'
    },
    formatV3: {
      support: 'none',
      details: 'Not supported; Engine v3 only handles Iceberg spec v1/v2'
    },
    timeTravel: {
      support: 'full',
      details: 'FOR SYSTEM_TIME AS OF and FOR SYSTEM_VERSION AS OF snapshot_id'
    },
    security: {
      support: 'full',
      details: 'IAM policies, Lake Formation permissions, S3 encryption, VPC endpoints'
    }
  },
  quickStart: `-- Create Iceberg table in Athena
CREATE TABLE my_iceberg_table (
  id bigint,
  data string,
  category string
)
LOCATION 's3://my-bucket/iceberg-data/'
TBLPROPERTIES (
  'table_type' = 'ICEBERG',
  'format' = 'parquet',
  'write_compression' = 'snappy'
);

-- Time travel query
SELECT * FROM my_iceberg_table
FOR SYSTEM_TIME AS OF TIMESTAMP '2024-01-15 10:00:00';`,
  bestPractices: [
    'Use partition projection for better query performance',
    'Enable S3 request payer for cross-account access',
    'Run VACUUM periodically to remove orphaned files',
    'Use ZSTD compression for better compression ratios',
    'Configure workgroup settings for cost control',
    'Leverage Athena query result reuse for repeated queries'
  ]
};