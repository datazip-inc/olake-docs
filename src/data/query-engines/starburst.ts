// data/query-engines/starburst.ts
import { QueryEngine } from '../../types/iceberg';
import { createVersionedEngine } from './versioning';

export const starburst: QueryEngine = createVersionedEngine({
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
      details: 'Default copy-on-write for large rewrites; V2 fine-grained updates use position/equality delete files (MoR); SEP 476-e+ writes deletion vectors (V3 MoR) when format-version=3',
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
      support: 'full',
      details: 'Full Iceberg V3 read+write GA in SEP 476-e (September 2025); deletion vectors (MoR writes), VARIANT type, nanosecond timestamps, and row lineage all supported',
      externalLinks: [
        {
          label: 'SEP 476-e Release Notes',
          url: 'https://docs.starburst.io/latest/release/release-476-e.html'
        },
        {
          label: 'Iceberg V3 in Starburst Blog',
          url: 'https://www.starburst.io/blog/iceberg-v3/'
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
  ],
  versions: {
    v3: {
      features: {
        catalogs: { support: 'full', details: 'All catalog types (HMS, Glue, REST, Nessie, Snowflake, Galaxy) accessible; V3 table creation fully supported in SEP 476-e+' },
        readWrite: { support: 'full', details: 'Full V3 read+write GA in SEP 476-e (September 2025); creates and queries V3-format Iceberg tables natively' },
        dml: { support: 'full', details: 'INSERT, UPDATE, DELETE, MERGE with V3 deletion vectors for MoR writes; partition-aligned predicates become partition deletes' },
        morCow: { support: 'full', details: 'Deletion vectors (V3 MoR) written for fine-grained updates; copy-on-write still available for large partition rewrites' },
        streaming: { support: 'none', details: 'No built-in streaming ingestion for any format version' },
        formatV3: { support: 'full', details: 'Full Iceberg V3 GA in SEP 476-e (September 2025); deletion vectors, VARIANT type, nanosecond timestamps, row lineage all supported' },
        timeTravel: { support: 'full', details: 'FOR VERSION AS OF / FOR TIMESTAMP AS OF fully work on V3 tables; metadata tables expose row lineage columns' },
        security: { support: 'full', details: 'Built-in ACL engine, LDAP/OAuth, Lake Formation, Ranger policies; row lineage (_row_id) visible for audit purposes' }
      },
      score: 28,
      description: 'Starburst Enterprise SEP 476-e+ provides full Iceberg V3 read+write GA support including deletion vectors, VARIANT type, nanosecond timestamps, and row lineage (since September 2025)'
    }
  }
});