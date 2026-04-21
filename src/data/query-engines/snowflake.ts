// data/query-engines/snowflake.ts
import { QueryEngine } from '../../types/iceberg';
import { createVersionedEngine } from './versioning';

export const snowflake: QueryEngine = createVersionedEngine({
  id: 'snowflake',
  name: 'Snowflake',
  description: 'Enterprise cloud data warehouse with native Iceberg catalog, automatic optimization, Snowpipe Streaming, UniForm interoperability, and full integration with Snowflake features',
  category: 'general-purpose',
  website: 'https://www.snowflake.com/',
  documentation: 'https://docs.snowflake.com/en/user-guide/tables-iceberg',
  features: {
    catalogs: {
      support: 'partial',
      details: 'Snowflake Horizon Catalog (Polaris) native, REST Catalog, and AWS Glue supported for V3 (Public Preview). Hive Metastore, Nessie, Hadoop, JDBC not supported',
      externalLinks: [
        {
          label: 'CREATE ICEBERG TABLE Documentation',
          url: 'https://docs.snowflake.com/en/sql-reference/sql/create-iceberg-table'
        },
        {
          label: 'Apache Iceberg Tables Overview',
          url: 'https://docs.snowflake.com/en/user-guide/tables-iceberg'
        }
      ]
    },
    readWrite: {
      support: 'full',
      details: 'Full read and write support for Snowflake-managed Iceberg tables including Parquet, COPY INTO, CTAS, and multi-statement transactions. V3 support in Public Preview (March 2026)',
      externalLinks: [
        {
          label: 'Iceberg Table Tutorial',
          url: 'https://docs.snowflake.com/en/user-guide/tutorials/create-your-first-iceberg-table'
        },
        {
          label: 'Manage Iceberg Tables',
          url: 'https://docs.snowflake.com/en/user-guide/tables-iceberg-manage'
        }
      ]
    },
    dml: {
      support: 'full',
      details: 'INSERT, UPDATE, DELETE, MERGE INTO fully ACID on Snowflake-managed Iceberg tables. V3 uses deletion vectors for row-level changes (Public Preview March 2026)',
      externalLinks: [
        {
          label: 'DML Commands with Iceberg',
          url: 'https://docs.snowflake.com/en/user-guide/tables-iceberg-manage'
        }
      ]
    },
    morCow: {
      support: 'full',
      details: 'V3 supports full MoR via deletion vectors and CoW. V3 deletion vectors replace position deletes for improved write performance (Public Preview March 2026)',
      externalLinks: [
        {
          label: 'Iceberg Storage Management',
          url: 'https://docs.snowflake.com/en/user-guide/tables-iceberg-storage'
        }
      ]
    },
    streaming: {
      support: 'full',
      details: 'Snowflake V3 row lineage enables CDC capabilities for data governance and auditing. Snowpipe Streaming for real-time ingestion (Public Preview March 2026)',
      externalLinks: [
        {
          label: 'Snowpipe Streaming with Iceberg',
          url: 'https://docs.snowflake.com/en/user-guide/data-load-snowpipe-streaming-iceberg'
        }
      ]
    },
    formatV3: {
      support: 'partial',
      details: 'Iceberg V3 support in Public Preview (March 2026). Supports deletion vectors, nanosecond timestamps, geometry type, variant type, and row lineage',
      externalLinks: [
        {
          label: 'Apache Iceberg v3 Table Spec Blog',
          url: 'https://www.snowflake.com/en/blog/apache-iceberg-v3-table-spec-oss-shared-success/'
        }
      ]
    },
    timeTravel: {
      support: 'full',
      details: 'Query snapshots with AT(SNAPSHOT => id) or AT(TIME => ts). Zero-Copy Clones work on Iceberg tables. External tables require explicit REFRESH',
      externalLinks: [
        {
          label: 'Understanding Time Travel',
          url: 'https://docs.snowflake.com/en/user-guide/data-time-travel'
        },
        {
          label: 'Transactions and Iceberg Tables',
          url: 'https://docs.snowflake.com/en/user-guide/tables-iceberg-transactions'
        }
      ]
    },
    security: {
      support: 'full',
      details: 'Full Snowflake RBAC, column masking, row-access policies, tag-based masking. Query activity in ACCOUNT_USAGE & ACCESS_HISTORY. Customer-managed IAM roles',
      externalLinks: [
        {
          label: 'Access Control Privileges',
          url: 'https://docs.snowflake.com/en/user-guide/security-access-control-privileges'
        },
        {
          label: 'Lakehouse Governance',
          url: 'https://docs.snowflake.com/en/user-guide/tables-iceberg'
        }
      ]
    }
  },
  quickStart: `-- Create native Snowflake-catalog Iceberg table
CREATE ICEBERG TABLE sales_data (
  order_id NUMBER,
  customer_id NUMBER,
  order_date DATE,
  total_amount NUMBER(10,2)
)
CATALOG = 'SNOWFLAKE'
EXTERNAL_VOLUME = 'my_s3_volume'
BASE_LOCATION = 'sales/'
CLUSTER BY (customer_id);

-- Insert data
INSERT INTO sales_data 
VALUES (1, 100, '2024-01-15', 99.99);

-- MERGE operation with full ACID support
MERGE INTO sales_data AS target
USING (
  SELECT 1 as order_id, 150.00 as new_amount
) AS source
ON target.order_id = source.order_id
WHEN MATCHED THEN 
  UPDATE SET total_amount = source.new_amount
WHEN NOT MATCHED THEN 
  INSERT VALUES (source.order_id, 200, '2024-01-16', source.new_amount);

-- Time travel query
SELECT * FROM sales_data 
AT(TIME => '2024-01-15 10:00:00');

-- Create zero-copy clone
CREATE ICEBERG TABLE sales_data_backup 
CLONE sales_data;`,
  versions: {
    v2: {
      features: {
        catalogs: {
          support: 'partial',
          details: 'Snowflake Horizon Catalog (Polaris) native, REST Catalog, and AWS Glue supported. Hive Metastore, Nessie, Hadoop, JDBC, Unity Catalog (read-only via REST) not fully supported',
          externalLinks: [{ label: 'Apache Iceberg Tables Overview', url: 'https://docs.snowflake.com/en/user-guide/tables-iceberg' }]
        },
        readWrite: {
          support: 'full',
          details: 'Full read and write support for Snowflake-managed Iceberg tables. Parquet-only format. COPY INTO, CTAS, multi-statement transactions all supported',
          externalLinks: [{ label: 'Manage Iceberg Tables', url: 'https://docs.snowflake.com/en/user-guide/tables-iceberg-manage' }]
        },
        dml: {
          support: 'full',
          details: 'INSERT, UPDATE, DELETE, MERGE INTO fully ACID on Snowflake-managed Iceberg tables. All DML operations use copy-on-write mode',
          externalLinks: [{ label: 'DML Commands with Iceberg', url: 'https://docs.snowflake.com/en/user-guide/tables-iceberg-manage' }]
        },
        morCow: {
          support: 'partial',
          details: 'Copy-on-write is the exclusive write strategy for Snowflake-managed tables. Merge-on-read supported only for externally managed Iceberg tables via ENABLE_ICEBERG_MERGE_ON_READ session parameter',
          externalLinks: [{ label: 'Iceberg Storage Management', url: 'https://docs.snowflake.com/en/user-guide/tables-iceberg-storage' }]
        },
        streaming: {
          support: 'partial',
          details: 'Snowpipe Streaming & Storage Write API for real-time ingestion (GA). Streams & Tasks supported on Snowflake-catalog tables. No built-in CDC ingestion',
          externalLinks: [{ label: 'Snowpipe Streaming with Iceberg', url: 'https://docs.snowflake.com/en/user-guide/data-load-snowpipe-streaming-iceberg' }]
        },
        formatV3: {
          support: 'none',
          details: 'Iceberg Format V3 features are not applicable to V2 tables.'
        },
        timeTravel: {
          support: 'full',
          details: 'Query snapshots with AT(SNAPSHOT => id) or AT(TIME => ts). Zero-Copy Clones work on Iceberg tables. Full time travel for Snowflake-managed tables',
          externalLinks: [{ label: 'Understanding Time Travel', url: 'https://docs.snowflake.com/en/user-guide/data-time-travel' }]
        },
        security: {
          support: 'full',
          details: 'Full Snowflake RBAC, column masking, row-access policies, tag-based masking. Query activity in ACCOUNT_USAGE & ACCESS_HISTORY. Customer-managed IAM roles',
          externalLinks: [{ label: 'Access Control Privileges', url: 'https://docs.snowflake.com/en/user-guide/security-access-control-privileges' }]
        }
      },
      score: 22,
      description: 'Snowflake provides complete Iceberg V2 support with full DML operations, automatic optimization, and enterprise-grade security for managed tables'
    }
  },
  bestPractices: [
    'Use Snowflake 8.20+ for GA Iceberg support and latest features',
    'Leverage native Snowflake catalog for full DML capabilities and Snowflake feature integration',
    'Use external catalog integration objects for read-only access to existing Iceberg data',
    'Take advantage of automatic clustering and compaction - no manual OPTIMIZE/VACUUM needed',
    'Configure CLUSTER BY keys for micro-partition clustering and improved query performance',
    'Use Snowpipe Streaming and Storage Write API for real-time data ingestion into Iceberg tables',
    'Leverage Streams and Tasks for change data capture and downstream processing workflows',
    'Implement Snowflake RBAC, column masking, and row-access policies for comprehensive security',
    'Use AT(SNAPSHOT => id) or AT(TIME => ts) syntax for time travel queries',
    'Create Zero-Copy Clones for development, testing, and backup scenarios',
    'Monitor ACCOUNT_USAGE and ACCESS_HISTORY for query activity and governance',
    'Use External Volumes for cross-cloud and cross-region data access',
    'Enable Search Optimization on Iceberg tables for point lookup performance',
    'Configure appropriate snapshot retention policies for time travel requirements',
    'Use UniForm to expose Snowflake tables to external engines via Iceberg REST catalog',
    'Be aware of Parquet-only limitation - no ORC or Avro format support',
    'Plan for equality-delete file support currently in preview status',
    'Avoid S3 bucket names containing dots when using external volumes',
    'Use customer-managed IAM roles for secure access to external storage',
    'Monitor cross-region egress charges when compute and storage are in different regions'
  ]
});