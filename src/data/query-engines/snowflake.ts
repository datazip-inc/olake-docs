// data/query-engines/snowflake.ts
import { QueryEngine } from '../../types/iceberg';

export const snowflake: QueryEngine = {
  id: 'snowflake',
  name: 'Snowflake',
  description: 'Enterprise cloud data warehouse with native Iceberg catalog, automatic optimization, Snowpipe Streaming, UniForm interoperability, and full integration with Snowflake features',
  category: 'general-purpose',
  website: 'https://www.snowflake.com/',
  documentation: 'https://docs.snowflake.com/en/user-guide/tables-iceberg',
  features: {
    catalogs: {
      support: 'partial',
      details: 'Snowflake catalog (native) with full read/write. External catalogs (Glue, Open Table Catalog) read-only via catalog integration objects',
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
      support: 'partial',
      details: 'Full SELECT, DML & DDL on Snowflake-catalog tables including COPY INTO, CTAS, multi-statement transactions. External catalogs read-only',
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
      support: 'partial',
      details: 'INSERT, UPDATE, DELETE, MERGE INTO fully ACID on Snowflake-catalog tables. Position-delete files, equality-delete in preview. External tables read-only',
      externalLinks: [
        {
          label: 'DML Commands with Iceberg',
          url: 'https://docs.snowflake.com/en/user-guide/tables-iceberg-manage'
        },
        {
          label: 'Row-level Deletes',
          url: 'https://docs.snowflake.com/en/user-guide/tables-iceberg-manage'
        }
      ]
    },
    morCow: {
      support: 'full',
      details: 'DML writes merge-on-read delete files. Automatic Storage Optimization compacts files & merges delete files, switching to copy-on-write during clustering',
      externalLinks: [
        {
          label: 'Iceberg Storage Management',
          url: 'https://docs.snowflake.com/en/user-guide/tables-iceberg-storage'
        }
      ]
    },
    streaming: {
      support: 'partial',
      details: 'Snowpipe Streaming & Storage Write API for real-time ingestion (GA). Streams & Tasks supported on Snowflake-catalog tables. No built-in CDC ingestion',
      externalLinks: [
        {
          label: 'Snowpipe Streaming with Iceberg',
          url: 'https://docs.snowflake.com/en/user-guide/data-load-snowpipe-streaming-iceberg'
        },
        {
          label: 'Introduction to Streams',
          url: 'https://docs.snowflake.com/en/user-guide/streams-intro'
        }
      ]
    },
    formatV3: {
      support: 'none',
      details: 'Not yet supported. Snowflake-catalog tables use spec v2; external v3 tables readable if future reader upgrades land. Roadmap evaluation ongoing',
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
};