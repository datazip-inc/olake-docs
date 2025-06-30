// data/query-engines/athena.ts
import { QueryEngine } from '../../types/iceberg';

export const athena: QueryEngine = {
  id: 'athena',
  name: 'Amazon Athena (Engine v3)',
  description: 'Serverless AWS-native query engine with complete DML operations, Lake Formation governance, time travel, and deep AWS ecosystem integration for Iceberg tables',
  category: 'general-purpose',
  website: 'https://aws.amazon.com/athena/',
  documentation: 'https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg.html',
  features: {
    catalogs: {
      support: 'partial',
      details: 'Only AWS Glue Data Catalog supported for Iceberg. Hive, REST, Nessie, or JDBC catalogs not recognized',
      externalLinks: [
        {
          label: 'AWS Glue Data Catalog',
          url: 'https://docs.aws.amazon.com/athena/latest/ug/data-sources-glue.html'
        }
      ]
    },
    readWrite: {
      support: 'full',
      details: 'SELECT, CREATE TABLE STORED AS ICEBERG, CTAS, INSERT INTO. All writes create new snapshots and become immediately queryable',
      externalLinks: [
        {
          label: 'Create Iceberg Tables',
          url: 'https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg-creating-tables.html'
        },
        {
          label: 'INSERT INTO Documentation',
          url: 'https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg-insert-into.html'
        }
      ]
    },
    dml: {
      support: 'full',
      details: 'Engine v3 supports INSERT INTO, UPDATE, DELETE, and MERGE INTO. UPDATE/DELETE/MERGE write position-delete files (Iceberg v2) for row-level changes',
      externalLinks: [
        {
          label: 'UPDATE Operations',
          url: 'https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg-update.html'
        },
        {
          label: 'DELETE Operations',
          url: 'https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg-delete.html'
        },
        {
          label: 'MERGE INTO Operations',
          url: 'https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg-merge-into.html'
        }
      ]
    },
    morCow: {
      support: 'partial',
      details: 'Athena operates Iceberg tables in merge-on-read mode only; DML produces delete files, not full rewrites. Copy-on-write is not configurable',
      externalLinks: [
        {
          label: 'Apache Iceberg on AWS Guide',
          url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/apache-iceberg-on-aws/iceberg-athena.html'
        }
      ]
    },
    streaming: {
      support: 'none',
      details: 'No built-in streaming ingestion or CDC APIs. External tools (Glue ETL, Flink) must land data in Iceberg; Athena queries latest committed snapshot',
      externalLinks: [
        {
          label: 'Serverless CDC with Iceberg',
          url: 'https://aws.amazon.com/blogs/big-data/implement-a-serverless-cdc-process-with-apache-iceberg-using-amazon-dynamodb-and-amazon-athena/'
        }
      ]
    },
    formatV3: {
      support: 'none',
      details: 'Not yet supported; Athena uses Iceberg 1.2.x libraries, spec v3 features (DV, lineage) not available. Creates/writes only spec v2 tables',
      externalLinks: [
        {
          label: 'Query Apache Iceberg Tables',
          url: 'https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg.html'
        }
      ]
    },
    timeTravel: {
      support: 'full',
      details: 'FOR TIMESTAMP AS OF and FOR VERSION AS OF clauses let you query historical snapshots with millisecond precision',
      externalLinks: [
        {
          label: 'Athena Iceberg Tutorial',
          url: 'https://aws-sdk-pandas.readthedocs.io/en/3.3.0/tutorials/039%20-%20Athena%20Iceberg.html'
        }
      ]
    },
    security: {
      support: 'full',
      details: 'Access enforced through IAM plus AWS Lake Formation policies (column-, row-, and cell-level). Lake Formation filters govern metadata table visibility',
      externalLinks: [
        {
          label: 'Lake Formation Fine-grained Access',
          url: 'https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg-table-data.html'
        }
      ]
    }
  },
  quickStart: `-- Create Iceberg table in Athena
CREATE TABLE iceberg_sales_data (
  order_id BIGINT,
  customer_id BIGINT,
  order_date DATE,
  total_amount DECIMAL(10,2)
) 
STORED AS ICEBERG
LOCATION 's3://my-bucket/iceberg-tables/sales/'
TBLPROPERTIES (
  'table_type'='ICEBERG'
);

-- Insert data
INSERT INTO iceberg_sales_data 
VALUES (1, 100, DATE '2024-01-15', 99.99);

-- Update with position delete files
UPDATE iceberg_sales_data 
SET total_amount = 149.99 
WHERE order_id = 1;

-- Time travel query
SELECT * FROM iceberg_sales_data 
FOR TIMESTAMP AS OF TIMESTAMP '2024-01-15 10:00:00.000';

-- Optimize table
OPTIMIZE iceberg_sales_data REWRITE DATA;`,
  bestPractices: [
    'Use Athena Engine v3 for all Iceberg operations - lower versions lack Iceberg support',
    'Register Iceberg tables in AWS Glue Data Catalog with proper Iceberg table properties',
    'Leverage Lake Formation for fine-grained access control (column, row, cell-level)',
    'Use time travel with FOR TIMESTAMP AS OF and FOR VERSION AS OF for historical analysis',
    'Run OPTIMIZE ... REWRITE DATA regularly to compact small files and improve query performance',
    'Schedule VACUUM operations to expire old snapshots and clean up orphaned files',
    'Configure table properties like vacuum_max_snapshot_age_seconds for automated cleanup',
    'Use hidden partitioning with identity, bucket, truncate, and time-based transforms',
    'Leverage metadata tables ($files, $partitions, $manifests, $history, $snapshots) for introspection',
    'Take advantage of serverless auto-scaling for variable workloads',
    'Use MERGE INTO for efficient CDC and data synchronization workflows',
    'Be aware that Athena only supports merge-on-read mode - not configurable to copy-on-write',
    'Ensure proper IAM permissions for S3 bucket access and Glue catalog operations',
    'Use CloudTrail for query audit and compliance requirements',
    'Integrate with QuickSight for business intelligence dashboards on Iceberg data',
    'Use Glue ETL or other AWS services for data ingestion into Iceberg tables',
    'Avoid partitioning on nested fields as it is not supported',
    'Consider millisecond timestamp precision limitations when designing schemas',
    'Use schema evolution (ADD/DROP/RENAME COLUMNS) for metadata-only table changes',
    'Plan external ingestion strategy as Athena provides no streaming or CDC capabilities'
  ]
};