// data/query-engines/athena.ts
import { QueryEngine } from '../../types/iceberg';
import { createVersionedEngine } from './versioning';

export const athena: QueryEngine = createVersionedEngine({
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
      details: 'Not yet supported; Athena uses Iceberg 1.4.2 libraries; spec v3 features (deletion vectors, row lineage) not available. Creates/writes only spec v2 tables',
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
  ],
  versions: {
    v2: {
      features: {
        catalogs: {
          support: 'partial',
          details: 'Only AWS Glue Data Catalog supported for Iceberg. Hive, REST, Nessie, or JDBC catalogs not recognized. Polaris and Unity Catalog accessible via Glue Catalog Federation (read-only)',
          externalLinks: [{ label: 'AWS Glue Data Catalog', url: 'https://docs.aws.amazon.com/athena/latest/ug/data-sources-glue.html' }]
        },
        readWrite: {
          support: 'full',
          details: 'SELECT, CREATE TABLE STORED AS ICEBERG, CTAS, INSERT INTO. All writes create new snapshots and become immediately queryable',
          externalLinks: [{ label: 'Create Iceberg Tables', url: 'https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg-creating-tables.html' }]
        },
        dml: {
          support: 'full',
          details: 'INSERT INTO, UPDATE, DELETE, and MERGE INTO supported via Athena Engine v3. UPDATE/DELETE/MERGE write position-delete files (MoR) for row-level changes',
          externalLinks: [{ label: 'MERGE INTO Operations', url: 'https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg-merge-into.html' }]
        },
        morCow: {
          support: 'full',
          details: 'Supports merge-on-read for both position and equality deletes. Copy-on-write is the default write mode; however MERGE and DELETE always use MoR regardless of table properties',
          externalLinks: [{ label: 'Apache Iceberg on AWS Guide', url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/apache-iceberg-on-aws/iceberg-athena.html' }]
        },
        streaming: {
          support: 'none',
          details: 'No built-in streaming ingestion or CDC APIs. External tools (Glue ETL, Flink) must land data in Iceberg; Athena queries latest committed snapshot'
        },
        formatV3: {
          support: 'none',
          details: 'Iceberg Format V3 features are not applicable to V2 tables.'
        },
        timeTravel: {
          support: 'full',
          details: 'FOR TIMESTAMP AS OF and FOR VERSION AS OF clauses let you query historical snapshots with millisecond precision',
          externalLinks: [{ label: 'Athena Iceberg Tutorial', url: 'https://aws-sdk-pandas.readthedocs.io/en/3.3.0/tutorials/039%20-%20Athena%20Iceberg.html' }]
        },
        security: {
          support: 'full',
          details: 'Access enforced through IAM plus AWS Lake Formation policies (column-, row-, and cell-level). Lake Formation filters govern metadata table visibility',
          externalLinks: [{ label: 'Lake Formation Fine-grained Access', url: 'https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg-table-data.html' }]
        }
      },
      score: 22,
      description: 'Athena Engine v3 provides full Iceberg V2 support with complete DML operations, time travel, and deep AWS ecosystem integration — V3 format is not supported'
    },
    v3: {
      features: {
        catalogs: { support: 'none', details: 'Athena does not support Iceberg V3 format tables' },
        readWrite: { support: 'none', details: 'Athena does not support Iceberg V3 format tables' },
        dml: { support: 'none', details: 'Athena does not support Iceberg V3 format tables' },
        morCow: { support: 'none', details: 'Athena does not support Iceberg V3 format tables' },
        streaming: { support: 'none', details: 'Athena does not support Iceberg V3 format tables' },
        formatV3: { support: 'none', details: 'Athena uses Iceberg 1.2.x libraries; spec V3 features (deletion vectors, row lineage) are not available. Tables are created as spec V2 only' },
        timeTravel: { support: 'none', details: 'Athena does not support Iceberg V3 format tables' },
        security: { support: 'none', details: 'Athena does not support Iceberg V3 format tables' }
      },
      score: 0,
      description: 'Athena does not support Iceberg V3 format tables. All Athena Iceberg operations are limited to spec V2'
    }
  }
});