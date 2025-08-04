// data/query-engines/databricks.ts
import { QueryEngine } from '../../types/iceberg';

export const databricks: QueryEngine = {
  id: 'databricks',
  name: 'Databricks Runtime 14.3 LTS+',
  description: 'UniForm technology enables multi-format lakehouse with read-only Iceberg views of Delta tables via Unity Catalog REST endpoint',
  category: 'lakehouse',
  website: 'https://databricks.com/',
  documentation: 'https://docs.databricks.com/aws/en/delta/uniform.html',
  features: {
    catalogs: {
      support: 'partial',
      details: 'Unity Catalog exposes Iceberg REST catalog at /api/2.1/unity-catalog/iceberg for external engines; UniForm tables generate Iceberg metadata on Delta commits',
      externalLinks: [
        {
          label: 'Unity Catalog Iceberg Endpoint',
          url: 'https://docs.databricks.com/aws/en/external-access/iceberg.html'
        },
        {
          label: 'Read Delta Tables with Iceberg Clients',
          url: 'https://docs.databricks.com/aws/en/delta/uniform.html'
        }
      ]
    },
    readWrite: {
      support: 'partial',
      details: 'Full reads via REST catalog or direct metadata paths; writes supported for Managed Iceberg Tables via external engines, but UniForm Delta tables are read-only for Iceberg clients',
      externalLinks: [
        {
          label: 'Read Delta Tables with Iceberg Clients',
          url: 'https://docs.databricks.com/aws/en/delta/uniform.html'
        },
        {
          label: 'Full Apache Iceberg Support Announcement',
          url: 'https://www.databricks.com/blog/announcing-full-apache-iceberg-support-databricks'
        }
      ]
    },
    dml: {
      support: 'limited',
      details: 'Full DML (INSERT, MERGE, UPDATE, DELETE) available for Delta users inside Databricks; Iceberg clients can only read through REST catalog',
      externalLinks: [
        {
          label: 'Read Delta Tables with Iceberg Clients - Limitations',
          url: 'https://docs.databricks.com/aws/en/delta/uniform.html'
        }
      ]
    },
    morCow: {
      support: 'limited',
      details: 'Copy-on-Write (CoW) semantics for Delta commits; no Iceberg delete files produced; external readers see fully merged snapshots',
      externalLinks: [
        {
          label: 'Unity Catalog Iceberg Endpoint - Notes',
          url: 'https://docs.databricks.com/aws/en/external-access/iceberg.html'
        }
      ]
    },
    streaming: {
      support: 'internal',
      details: 'Spark Structured Streaming and Delta Change Data Feed available inside Databricks; Iceberg REST interface does not expose streaming ingestion or CDC endpoints',
      externalLinks: [
        {
          label: 'Read Delta Tables - Streaming Limitations',
          url: 'https://docs.databricks.com/aws/en/delta/uniform.html'
        }
      ]
    },
    formatV3: {
      support: 'none',
      details: 'UniForm currently targets Iceberg spec v2 only; no public roadmap for v3 support announced yet',
      externalLinks: [
        {
          label: 'Full Apache Iceberg Support - V2 Preview',
          url: 'https://www.databricks.com/blog/announcing-full-apache-iceberg-support-databricks'
        }
      ]
    },
    timeTravel: {
      support: 'full',
      details: 'External engines can time-travel by snapshot-ID or timestamp using standard Iceberg syntax; includes converted_delta_version and converted_delta_timestamp properties',
      externalLinks: [
        {
          label: 'Iceberg REST API Specification',
          url: 'https://github.com/apache/iceberg/blob/master/api/src/main/java/org/apache/iceberg/rest/RestCatalog.java'
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
};