// data/query-engines/bigquery.ts
import { QueryEngine } from '../../types/iceberg';

export const bigquery: QueryEngine = {
  id: 'bigquery',
  name: 'Google BigQuery',
  description: 'Serverless Google Cloud data warehouse with managed Iceberg tables, automatic optimization, Storage Write API streaming, and deep GCP ecosystem integration',
  category: 'general-purpose',
  website: 'https://cloud.google.com/bigquery',
  documentation: 'https://cloud.google.com/bigquery/docs/iceberg-tables',
  features: {
    catalogs: {
      support: 'partial',
      details: 'BigQuery-managed Iceberg (internal catalog) and BigLake external Iceberg (Dataplex, HMS, AWS Glue via GCS). No direct REST/Nessie support',
      externalLinks: [
        {
          label: 'BigQuery Managed Iceberg Tables',
          url: 'https://cloud.google.com/blog/products/data-analytics/announcing-bigquery-tables-for-apache-iceberg'
        },
        {
          label: 'Create External Iceberg Tables',
          url: 'https://cloud.google.com/bigquery/docs/iceberg-external-tables'
        }
      ]
    },
    readWrite: {
      support: 'partial',
      details: 'Managed tables: full CREATE, CTAS, INSERT, DML. External tables: SELECT + limited INSERT via Dataflow/Storage Write API',
      externalLinks: [
        {
          label: 'BigQuery Iceberg DML Operations',
          url: 'https://cloud.google.com/bigquery/docs/iceberg-tables#dml'
        },
        {
          label: 'Managed Iceberg Capabilities',
          url: 'https://cloud.google.com/blog/products/data-analytics/announcing-bigquery-tables-for-apache-iceberg'
        }
      ]
    },
    dml: {
      support: 'partial',
      details: 'Managed tables: INSERT, UPDATE, DELETE, MERGE with GoogleSQL semantics. External tables: limited INSERT support via Dataflow/Spark',
      externalLinks: [
        {
          label: 'Data Manipulation Language DML',
          url: 'https://cloud.google.com/bigquery/docs/iceberg-tables#dml'
        }
      ]
    },
    morCow: {
      support: 'full',
      details: 'Operations generate position/equality delete files (MoR). Automatic compaction, clustering, and garbage collection (CoW) in background',
      externalLinks: [
        {
          label: 'Automatic Storage Optimization',
          url: 'https://cloud.google.com/blog/products/data-analytics/announcing-bigquery-tables-for-apache-iceberg'
        },
        {
          label: 'Merge-on-Read Support',
          url: 'https://cloud.google.com/bigquery/docs/iceberg-external-tables'
        }
      ]
    },
    streaming: {
      support: 'partial',
      details: 'High-throughput streaming via Storage Write API (Preview) - Dataflow, Beam, Spark. No built-in CDC apply; use Datastream + Dataflow patterns',
      externalLinks: [
        {
          label: 'Storage Write API Streaming',
          url: 'https://cloud.google.com/blog/products/data-analytics/announcing-bigquery-tables-for-apache-iceberg'
        }
      ]
    },
    formatV3: {
      support: 'none',
      details: 'Not yet supported. v2 required for managed tables, recommended for external. v3 evaluation planned for 2025 on public roadmap',
      externalLinks: [
        {
          label: 'Iceberg Specification Support',
          url: 'https://cloud.google.com/bigquery/docs/iceberg-external-tables'
        }
      ]
    },
    timeTravel: {
      support: 'partial',
      details: 'Managed tables: FOR SYSTEM_TIME AS OF syntax translating to snapshots. External BigLake tables: no SQL time travel currently',
      externalLinks: [
        {
          label: 'Time Travel for Historical Data',
          url: 'https://cloud.google.com/bigquery/docs/iceberg-tables#time_travel'
        }
      ]
    },
    security: {
      support: 'full',
      details: 'IAM permissions like native BigQuery tables. Column-level security & masking on managed Iceberg. External via BigLake/Dataplex policy tags',
      externalLinks: [
        {
          label: 'Column-level Security and Data Masking',
          url: 'https://cloud.google.com/bigquery/docs/iceberg-tables#security'
        },
        {
          label: 'Fine-grained Security Policies',
          url: 'https://cloud.google.com/blog/products/data-analytics/announcing-bigquery-tables-for-apache-iceberg'
        }
      ]
    }
  },
  quickStart: `-- Create managed Iceberg table in BigQuery
CREATE TABLE iceberg_dataset.sales_data (
  order_id INT64,
  customer_id INT64,
  order_date DATE,
  total_amount NUMERIC
)
OPTIONS (
  storage_format = 'ICEBERG',
  file_format = 'PARQUET'
)
CLUSTER BY customer_id;

-- Insert data
INSERT INTO iceberg_dataset.sales_data 
VALUES (1, 100, DATE '2024-01-15', 99.99);

-- MERGE operation with GoogleSQL semantics
MERGE iceberg_dataset.sales_data AS target
USING (
  SELECT 1 as order_id, 150.00 as new_amount
) AS source
ON target.order_id = source.order_id
WHEN MATCHED THEN 
  UPDATE SET total_amount = source.new_amount
WHEN NOT MATCHED THEN 
  INSERT VALUES (source.order_id, 200, DATE '2024-01-16', source.new_amount);

-- Time travel query
SELECT * FROM iceberg_dataset.sales_data 
FOR SYSTEM_TIME AS OF TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR);`,
  bestPractices: [
    'Enable Iceberg Tables Preview or BigLake Iceberg in your GCP project for access',
    'Use managed Iceberg tables for full DML capabilities and automatic optimization',
    'Leverage BigLake external tables for querying existing Iceberg data in GCS',
    'Take advantage of automatic compaction, clustering, and garbage collection - no manual OPTIMIZE/VACUUM needed',
    'Use Storage Write API for high-throughput streaming ingestion from Dataflow, Beam, or Spark',
    'Configure CLUSTER BY columns (up to 4) for extra data locality and query performance',
    'Implement column-level security and data masking using BigQuery IAM and policy tags',
    'Use FOR SYSTEM_TIME AS OF syntax for time travel on managed Iceberg tables',
    'Integrate with BigQuery ML for machine learning on Iceberg data',
    'Leverage Dataform for transformation workflows on Iceberg tables',
    'Use BigQuery Omni for cross-cloud queries on Iceberg data',
    'Store managed Iceberg data in customer GCS buckets for multi-engine access',
    'Monitor metadata cache hit/miss rates for BigLake external tables',
    'Use Datastream + Dataflow patterns for CDC processing into Iceberg tables',
    'Be aware of Parquet-only limitation - ORC and Avro not yet supported',
    'Plan for v2 format requirement - v3 not yet supported but planned for 2025',
    'Use Dataplex APIs or EXPORT TABLE METADATA for snapshot inspection',
    'Consider concurrency limitations with Iceberg optimistic locking for heavy MERGE workloads',
    'Leverage end-to-end lineage through Dataplex integration',
    'Use external table writes via Dataflow/Spark when BigQuery-native DML is insufficient'
  ]
};