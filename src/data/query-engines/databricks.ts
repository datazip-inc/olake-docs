// data/query-engines/databricks.ts
import { QueryEngine } from '../../types/iceberg';
import { createVersionedEngine } from './versioning';

export const databricks: QueryEngine = createVersionedEngine({
  id: 'databricks',
  name: 'Databricks (DBR 16.4+)',
  description: 'Native Iceberg support in Databricks Runtime 16.4+ with Unity Catalog. Full DML on managed Iceberg tables, deletion vectors (V3 Beta in DBR 17.3), and UniForm for multi-format lakehouse interoperability',
  category: 'lakehouse',
  website: 'https://databricks.com/',
  documentation: 'https://docs.databricks.com/aws/en/delta/uniform.html',
  features: {
    catalogs: {
      support: 'full',
      details: 'Unity Catalog implements the Iceberg REST Catalog API for both read and write on managed Iceberg tables. Hive Metastore and AWS Glue accessible via Lakehouse Federation (read-only). Nessie, Hadoop, JDBC not supported',
      externalLinks: [
        {
          label: 'Unity Catalog Iceberg Endpoint',
          url: 'https://docs.databricks.com/aws/en/external-access/iceberg.html'
        },
        {
          label: 'Full Apache Iceberg Support Announcement',
          url: 'https://www.databricks.com/blog/announcing-full-apache-iceberg-support-databricks'
        }
      ]
    },
    readWrite: {
      support: 'full',
      details: 'Full read/write for native managed Iceberg V3 tables via Unity Catalog (DBR 18.0+ Public Preview). INSERT INTO, CREATE TABLE, and full DDL supported. External engines can read and write via REST catalog',
      externalLinks: [
        {
          label: 'Full Apache Iceberg Support Announcement',
          url: 'https://www.databricks.com/blog/announcing-full-apache-iceberg-support-databricks'
        }
      ]
    },
    dml: {
      support: 'full',
      details: 'MERGE, UPDATE, DELETE fully supported for native managed Iceberg V3 tables with deletion vectors for efficient row-level changes (DBR 18.0+ Public Preview)',
      externalLinks: [
        {
          label: 'Unity Catalog Iceberg Endpoint',
          url: 'https://docs.databricks.com/aws/en/external-access/iceberg.html'
        }
      ]
    },
    morCow: {
      support: 'partial',
      details: 'V3 uses deletion vectors (MoR-like) for efficient row-level deletes without rewriting data files. Copy-on-write also fully supported. V2 position/equality deletes not used — DVs replace them in V3',
      externalLinks: [
        {
          label: 'Full Apache Iceberg Support Announcement',
          url: 'https://www.databricks.com/blog/announcing-full-apache-iceberg-support-databricks'
        }
      ]
    },
    streaming: {
      support: 'none',
      details: 'Change Data Feed (CDF) not supported on Iceberg tables — CDF is Delta Lake-only. Iceberg V3 row lineage provides CDC building blocks but CDC streaming is not directly exposed',
      externalLinks: [
        {
          label: 'Read Delta Tables with Iceberg Clients',
          url: 'https://docs.databricks.com/aws/en/delta/uniform.html'
        }
      ]
    },
    formatV3: {
      support: 'partial',
      details: 'Iceberg V3 Public Preview in DBR 18.0+. Supports deletion vectors, VARIANT columns, V3 table creation. Existing V2 tables can be upgraded. V2 position/equality deletes not supported — Databricks uses DVs (V3) exclusively',
      externalLinks: [
        {
          label: 'Iceberg V3 in Databricks',
          url: 'https://docs.databricks.com/aws/en/iceberg/iceberg-v3'
        },
        {
          label: 'Full Apache Iceberg Support Announcement',
          url: 'https://www.databricks.com/blog/announcing-full-apache-iceberg-support-databricks'
        }
      ]
    },
    timeTravel: {
      support: 'full',
      details: 'Time travel and RESTORE TABLE supported for managed Iceberg V3 tables (DBR 18.0+ Public Preview). For foreign Iceberg tables, time travel is limited',
      externalLinks: [
        {
          label: 'Unity Catalog Iceberg Endpoint',
          url: 'https://docs.databricks.com/aws/en/external-access/iceberg.html'
        }
      ]
    },
    security: {
      support: 'full',
      details: 'Unity Catalog RBAC governs access; Iceberg REST clients receive temporary, scoped cloud-storage credentials via credential vending during handshake',
      externalLinks: [
        {
          label: 'Access Databricks Tables from Iceberg Clients',
          url: 'https://docs.databricks.com/aws/en/external-access/iceberg.html'
        }
      ]
    }
  },
  quickStart: `-- Enable UniForm on existing Delta table
ALTER TABLE my_table SET TBLPROPERTIES (
  'delta.enableIcebergCompatV2' = 'true'
);

-- Or create new table with UniForm
CREATE TABLE my_uniform_table (
  id BIGINT,
  name STRING,
  created_at TIMESTAMP
) USING DELTA
TBLPROPERTIES (
  'delta.universalFormat.enabledFormats' = 'iceberg'
);

-- External Iceberg client connection
-- REST Catalog: https://<workspace-url>/api/2.1/unity-catalog/iceberg
-- OAuth Token: <databricks-personal-access-token>`,
  versions: {
    v2: {
      features: {
        catalogs: {
          support: 'full',
          details: 'Unity Catalog provides native Iceberg REST Catalog API for both read and write on managed Iceberg V2 tables (Public Preview, DBR 16.4 LTS). Hive Metastore and AWS Glue accessible via Lakehouse Federation (read-only)',
          externalLinks: [{ label: 'Unity Catalog Iceberg Endpoint', url: 'https://docs.databricks.com/aws/en/external-access/iceberg.html' }]
        },
        readWrite: {
          support: 'full',
          details: 'Full read/write for native managed Iceberg V2 tables via Unity Catalog (Public Preview, DBR 16.4 LTS). INSERT INTO, CREATE TABLE, and full DDL supported',
          externalLinks: [{ label: 'Full Apache Iceberg Support Announcement', url: 'https://www.databricks.com/blog/announcing-full-apache-iceberg-support-databricks' }]
        },
        dml: {
          support: 'full',
          details: 'MERGE, UPDATE, DELETE fully supported for native managed Iceberg V2 tables via copy-on-write. Managed Iceberg tables use CoW exclusively in V2',
          externalLinks: [{ label: 'Unity Catalog Iceberg Endpoint', url: 'https://docs.databricks.com/aws/en/external-access/iceberg.html' }]
        },
        morCow: {
          support: 'partial',
          details: 'Copy-on-write is the default and only write mode for managed Iceberg V2 tables. Iceberg V2 position and equality deletes are explicitly not supported — Databricks uses deletion vectors (V3 feature) instead',
          externalLinks: [{ label: 'Full Apache Iceberg Support Announcement', url: 'https://www.databricks.com/blog/announcing-full-apache-iceberg-support-databricks' }]
        },
        streaming: {
          support: 'none',
          details: 'Change Data Feed not supported on Iceberg tables. CDC and streaming ingestion must use external engines (Flink, Spark Structured Streaming) writing to Iceberg'
        },
        formatV3: {
          support: 'none',
          details: 'Iceberg Format V3 features are not applicable to V2 tables.'
        },
        timeTravel: {
          support: 'full',
          details: 'Time travel fully supported for managed Iceberg V2 tables by snapshot ID and timestamp. For foreign Iceberg tables, time travel is limited',
          externalLinks: [{ label: 'Unity Catalog Iceberg Endpoint', url: 'https://docs.databricks.com/aws/en/external-access/iceberg.html' }]
        },
        security: {
          support: 'full',
          details: 'Unity Catalog RBAC governs access; Iceberg REST clients receive temporary, scoped cloud-storage credentials via credential vending during handshake',
          externalLinks: [{ label: 'Access Databricks Tables from Iceberg Clients', url: 'https://docs.databricks.com/aws/en/external-access/iceberg.html' }]
        }
      },
      score: 22,
      description: 'Databricks DBR 16.4+ provides full native Iceberg V2 support with Unity Catalog, complete DML operations, and copy-on-write semantics for managed tables'
    }
  },
  bestPractices: [
    'Use Databricks Runtime 14.3 LTS or newer for IcebergCompatV2 feature support',
    'Enable UniForm via delta.universalFormat.enabledFormats=iceberg for new tables',
    'Upgrade existing tables with REORG … UPGRADE UNIFORM(ICEBERG_COMPAT_VERSION=2)',
    'Purge deletion vectors with REORG … PURGE DELETION_VECTORS before enabling Iceberg reads',
    'Use MSCK REPAIR TABLE … SYNC METADATA to force synchronous metadata generation',
    'Configure Unity Catalog RBAC properly for external Iceberg client access',
    'Use credential vending for secure, scoped cloud storage access from external engines',
    'Leverage converted_delta_version and converted_delta_timestamp for time travel mapping',
    'Ensure tables use Parquet with Zstandard compression when UniForm is enabled',
    'Avoid streaming writes and materialized views on tables requiring Iceberg compatibility',
    'Monitor asynchronous metadata generation after Delta commits for consistency',
    'Use Delta features (Liquid Clustering, Predictive Optimization) inside Databricks',
    'Plan for read-only access patterns when designing external Iceberg workflows',
    'Consider UniForm for true multi-format lakehouse enabling simultaneous Delta and Iceberg access',
    'Use Unity Catalog REST API v2.1 for proper Iceberg catalog endpoint access',
    'Test external engine compatibility before production deployment of UniForm tables'
  ]
});