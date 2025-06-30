// data/query-engines/dremio.ts
import { QueryEngine } from '../../types/iceberg';

export const dremio: QueryEngine = {
  id: 'dremio',
  name: 'Dremio v26',
  description: 'Full Iceberg authoring engine with built-in Polaris catalog, complete DML including MERGE, Arctic git-like branching, and Data Reflections acceleration',
  category: 'general-purpose',
  website: 'https://www.dremio.com/',
  documentation: 'https://docs.dremio.com/current/developer/data-formats/apache-iceberg/',
  features: {
    catalogs: {
      support: 'full',
      details: 'Polaris/Dremio Catalog (built-in REST, Nessie-backed), Generic Iceberg REST Catalog, Arctic (Nessie) sources, HMS, AWS Glue, Hadoop (file-based), Nessie stand-alone',
      externalLinks: [
        {
          label: 'Manage Sources - Dremio Catalog',
          url: 'https://docs.dremio.com/current/data-sources/'
        },
        {
          label: 'Iceberg REST Catalog',
          url: 'https://docs.dremio.com/current/data-sources/lakehouse-catalogs/iceberg-rest-catalog/'
        },
        {
          label: 'Nessie Source Configuration',
          url: 'https://docs.dremio.com/current/data-sources/lakehouse-catalogs/nessie/'
        }
      ]
    },
    readWrite: {
      support: 'full',
      details: 'Full DDL & DML (CREATE/ALTER/DROP, CTAS, INSERT, MERGE, UPDATE, DELETE) on Iceberg tables in S3/ADLS/GCS or Polaris/Arctic; HDFS/Hive may remain read-only',
      externalLinks: [
        {
          label: 'Apache Iceberg CREATE',
          url: 'https://docs.dremio.com/24.3.x/reference/sql/commands/apache-iceberg-tables/apache-iceberg-create/'
        },
        {
          label: 'SQL Commands Overview',
          url: 'https://docs.dremio.com/current/reference/sql/commands/apache-iceberg-tables/'
        }
      ]
    },
    dml: {
      support: 'full',
      details: 'INSERT, COPY INTO, UPDATE, DELETE (row & partition), MERGE (insert/update/delete branches since 25.1; uses MoR)',
      externalLinks: [
        {
          label: 'INSERT Operations',
          url: 'https://docs.dremio.com/24.3.x/reference/sql/commands/apache-iceberg-tables/apache-iceberg-insert/'
        },
        {
          label: 'MERGE Operations',
          url: 'https://docs.dremio.com/current/reference/sql/commands/apache-iceberg-tables/apache-iceberg-merge/'
        },
        {
          label: 'UPDATE Operations',
          url: 'https://docs.dremio.com/current/reference/sql/commands/apache-iceberg-tables/apache-iceberg-update/'
        },
        {
          label: 'DELETE Operations',
          url: 'https://docs.dremio.com/current/reference/sql/commands/apache-iceberg-tables/apache-iceberg-delete/'
        }
      ]
    },
    morCow: {
      support: 'full',
      details: 'Default CoW; merge-on-read available via write.delete.mode=merge-on-read & write.merge.mode=merge-on-read (v25+). OPTIMIZE can merge delete files',
      externalLinks: [
        {
          label: 'Table Properties',
          url: 'https://docs.dremio.com/current/sonar/query-manage/data-formats/apache-iceberg/table-properties'
        },
        {
          label: 'MERGE Documentation',
          url: 'https://docs.dremio.com/current/reference/sql/commands/apache-iceberg-tables/apache-iceberg-merge/'
        }
      ]
    },
    streaming: {
      support: 'none',
      details: 'No native streaming; queries always see latest committed snapshot. External engines ingest → Dremio queries/MERGE applies changes',
      externalLinks: [
        {
          label: 'Change Data Capture Guide',
          url: 'https://medium.com/data-engineering-with-dremio/change-data-capture-cdc-when-there-is-no-cdc-6b5c9f304263'
        }
      ]
    },
    formatV3: {
      support: 'none',
      details: 'Planned (2025) - roadmap calls for reading Deletion Vectors & row-lineage columns first; writer support (DV emission) to follow once Iceberg 1.8+ library adopted',
      externalLinks: [
        {
          label: 'What\'s New in Iceberg v3?',
          url: 'https://www.dremio.com/blog/apache-iceberg-v3/'
        },
        {
          label: 'Table Properties Format Version',
          url: 'https://docs.dremio.com/current/sonar/query-manage/data-formats/apache-iceberg/table-properties'
        }
      ]
    },
    timeTravel: {
      support: 'full',
      details: 'Via Arctic/Nessie branches & tags (table@branch); or query $history/$snapshots tables to locate snapshot id, then ROLLBACK or branch/tag for analysis',
      externalLinks: [
        {
          label: 'Rolling Back Tables',
          url: 'https://docs.dremio.com/current/developer/data-formats/apache-iceberg/rolling-back/'
        },
        {
          label: 'Expiring Snapshots',
          url: 'https://docs.dremio.com/current/developer/data-formats/apache-iceberg/expiring-snapshots/'
        }
      ]
    },
    security: {
      support: 'full',
      details: 'Honors catalog ACLs (Glue IAM, Hive Ranger, Nessie RBAC). Dremio role/column masking applies to Iceberg (v26). Arctic commit log gives audit trail',
      externalLinks: [
        {
          label: 'Governance Guide',
          url: 'https://medium.com/data-engineering-with-dremio/a-brief-guide-to-the-governance-of-apache-iceberg-tables-7c0a50316e22'
        },
        {
          label: 'Securing Iceberg Data Lakehouse',
          url: 'https://www.dremio.com/blog/securing-your-apache-iceberg-data-lakehouse/'
        }
      ]
    }
  },
  quickStart: `-- Create Iceberg table in Dremio
CREATE TABLE iceberg_catalog.sales.orders (
  order_id BIGINT,
  customer_id BIGINT,
  order_date DATE,
  total_amount DECIMAL(10,2)
) PARTITION BY (month(order_date));

-- Insert data
INSERT INTO iceberg_catalog.sales.orders 
VALUES (1, 100, DATE '2024-01-15', 99.99);

-- MERGE operation (since v25.1)
MERGE INTO iceberg_catalog.sales.orders AS target
USING (
  SELECT 1 as order_id, 150.00 as new_amount
) AS source
ON target.order_id = source.order_id
WHEN MATCHED THEN 
  UPDATE SET total_amount = source.new_amount
WHEN NOT MATCHED THEN 
  INSERT VALUES (source.order_id, 200, DATE '2024-01-16', source.new_amount);

-- Time travel with Arctic/Nessie
SELECT * FROM iceberg_catalog.sales.orders@main;`,
  bestPractices: [
    'Use Dremio v26+ for full Iceberg authoring capabilities including generic REST catalog support',
    'Leverage built-in Polaris/Dremio Catalog with Nessie backend for git-like data versioning',
    'Configure generic REST catalog sources to connect to any modern Iceberg catalog (Unity, Tabular, Snowflake Open)',
    'Use MERGE operations (v25.1+) for efficient upsert patterns with automatic MoR optimization',
    'Configure write.delete.mode=merge-on-read and write.merge.mode=merge-on-read for frequent update workloads',
    'Leverage Arctic/Nessie branches and tags for time travel and data experimentation (table@branch syntax)',
    'Use OPTIMIZE TABLE regularly for file and manifest compaction, especially with MoR tables',
    'Implement VACUUM CATALOG for automated snapshot expiry and storage cleanup',
    'Enable Data Reflections on frequently queried Iceberg tables for query acceleration',
    'Use Arctic git-like branching for multi-table commits and data pipeline isolation',
    'Configure Dremio RBAC and column masking for fine-grained access control on Iceberg data',
    'Leverage metadata tables ($history, $snapshots, $files) for table introspection and monitoring',
    'Use prefer_cached_metadata hint for performance optimization on metadata-heavy queries',
    'Be aware of Parquet-only limitation - no ORC/Avro write support currently',
    'Avoid HDFS-backed Iceberg tables for write operations - use cloud storage (S3/ADLS/GCS)',
    'Monitor for global equality-delete file limitations in current implementation',
    'Plan for concurrent commit scenarios and implement appropriate retry logic',
    'Use Arctic commit logs for comprehensive audit trails and data lineage',
    'Leverage Dremio\'s catalog credential vending for secure multi-tenant access',
    'Plan for Format V3 support arriving in 2025 with deletion vectors and row lineage'
  ]
};