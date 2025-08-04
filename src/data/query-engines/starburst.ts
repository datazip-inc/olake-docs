// data/query-engines/starburst.ts
import { QueryEngine } from '../../types/iceberg';

export const starburst: QueryEngine = {
  id: 'starburst',
  name: 'Starburst Enterprise SEP 414-E+',
  description: 'End-to-end Iceberg analytics platform with comprehensive catalog support, full DML operations, enterprise governance, and advanced optimization features',
  category: 'analytics',
  website: 'https://www.starburst.io/',
  documentation: 'https://docs.starburst.io/latest/connector/iceberg.html',
  features: {
    catalogs: {
      support: 'full',
      details: 'Hive Metastore, AWS Glue, JDBC, REST, Nessie, Snowflake, and Starburst Galaxy managed metastore with flexible configuration via iceberg.catalog.type',
      externalLinks: [
        {
          label: 'Iceberg Connector Requirements',
          url: 'https://docs.starburst.io/latest/connector/iceberg.html#requirements'
        },
        {
          label: 'Metastores Configuration',
          url: 'https://docs.starburst.io/latest/object-storage/metastores.html'
        }
      ]
    },
    readWrite: {
      support: 'full',
      details: 'Complete read & write capabilities including CREATE TABLE, CTAS, INSERT, and all query operations with atomic metadata swap for consistency',
      externalLinks: [
        {
          label: 'SQL Support - Iceberg Connector',
          url: 'https://docs.starburst.io/latest/connector/iceberg.html#sql-support'
        },
        {
          label: 'Data Management',
          url: 'https://docs.starburst.io/latest/connector/iceberg.html#data-management'
        }
      ]
    },
    dml: {
      support: 'full',
      details: 'INSERT, UPDATE, DELETE, MERGE all supported; partition-aligned predicates become partition deletes, otherwise writes Iceberg v2 position/equality-delete files',
      externalLinks: [
        {
          label: 'Data Management - DML Operations',
          url: 'https://docs.starburst.io/latest/connector/iceberg.html#data-management'
        }
      ]
    },
    morCow: {
      support: 'full',
      details: 'Default copy-on-write for large rewrites; fine-grained updates create separate delete files (MoR) merged at query time; handles both position & equality deletes',
      externalLinks: [
        {
          label: 'Data Management - Deletion Strategies',
          url: 'https://docs.starburst.io/latest/connector/iceberg.html#data-management'
        }
      ]
    },
    streaming: {
      support: 'none',
      details: 'No built-in streaming ingestion; queries Iceberg snapshots produced by external tools; materialized-view refreshes can approximate micro-batch CDC',
      externalLinks: [
        {
          label: 'Iceberg Connector Documentation',
          url: 'https://docs.starburst.io/latest/connector/iceberg.html'
        }
      ]
    },
    formatV3: {
      support: 'preview',
      details: 'Supports Iceberg spec v1 & v2; can read v3 preview metadata under feature flag but no v3 writes; production v3 GA on roadmap for 2025',
      externalLinks: [
        {
          label: 'Iceberg Connector - Spec Support',
          url: 'https://docs.starburst.io/latest/connector/iceberg.html'
        }
      ]
    },
    timeTravel: {
      support: 'full',
      details: 'Query past snapshots using FOR VERSION AS OF or FOR TIMESTAMP AS OF; metadata tables $snapshots, $history, $manifests; procedures for rollback, expire, orphan cleanup',
      externalLinks: [
        {
          label: 'Time Travel Queries',
          url: 'https://docs.starburst.io/latest/connector/iceberg.html#time-travel-queries'
        }
      ]
    },
    security: {
      support: 'full',
      details: 'Built-in access-control engine with table/column-level ACLs; integrates with LDAP/OAuth; honors Lake Formation permissions and HMS Ranger policies',
      externalLinks: [
        {
          label: 'Security - Iceberg Connector',
          url: 'https://docs.starburst.io/latest/connector/iceberg.html#security'
        }
      ]
    }
  },
  quickStart: `-- Configure Iceberg catalog in catalog properties
iceberg.catalog.type=hive_metastore
hive.metastore.uri=thrift://localhost:9083

-- Create Iceberg table
CREATE TABLE iceberg_catalog.schema.sales (
    id BIGINT,
    product VARCHAR,
    amount DECIMAL(10,2),
    sale_date DATE
) WITH (
    format = 'PARQUET',
    partitioning = ARRAY['month(sale_date)']
);

-- Time travel query
SELECT * FROM iceberg_catalog.schema.sales 
FOR TIMESTAMP AS OF TIMESTAMP '2025-01-01 00:00:00';`,
  bestPractices: [
    'Use SEP 414-E or newer for full Iceberg v2 DML support and advanced features',
    'Configure appropriate catalog type (hive_metastore, glue, rest, nessie, snowflake, jdbc) per environment',
    'Enable metadata caching with iceberg.metadata-cache.enabled for better performance',
    'Use concurrent manifest fetch via metadata-parallelism for large tables',
    'Leverage dynamic filtering and bucket-aware execution for query optimization',
    'Run periodic OPTIMIZE operations for frequently updated tables with small commits',
    'Use built-in access control (iceberg.security=system) for table/column-level security',
    'Configure LDAP/OAuth integration for enterprise authentication',
    'Leverage automatic statistics via ANALYZE for query optimization',
    'Use materialized views with incremental refresh for performance',
    'Set up proper network access from coordinators/workers to metastore and object storage',
    'Configure region-specific endpoints properly for AWS Glue catalogs',
    'Use Snowflake external volume credentials for Snowflake catalog integration',
    'Enable Starburst Warp Speed indexing and caching for selective query patterns',
    'Monitor and use automatic table-maintenance UI for operational efficiency',
    'Plan for manual compaction on tables with very frequent small commits',
    'Use partition-aligned predicates for optimal partition deletion performance',
    'Leverage $snapshots, $history, $manifests metadata tables for table introspection',
    'Configure appropriate data file formats (Parquet default, ORC, Avro) and codecs',
    'Use rollback_to_snapshot, expire_snapshots, remove_orphan_files procedures for maintenance'
  ]
};