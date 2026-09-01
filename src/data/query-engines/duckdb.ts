// data/query-engines/duckdb.ts
import { QueryEngine } from '../../types/iceberg';
import { createVersionedEngine } from './versioning';

export const duckdb: QueryEngine = createVersionedEngine({
  id: 'duckdb',
  name: 'DuckDB v1.3+',
  description: 'A light-weight, read-only analytics engine for Iceberg with SQL time travel, external file caching, and REST catalog support',
  category: 'analytics',
  website: 'https://duckdb.org/',
  documentation: 'https://duckdb.org/docs/stable/core_extensions/iceberg/overview.html',
  features: {
    catalogs: {
      support: 'partial',
      details: 'REST catalog, AWS Glue (via ENDPOINT_TYPE=glue), and Polaris supported for V3 tables with V2-compatible data types. Hive Metastore, Nessie, Hadoop, JDBC not supported',
      externalLinks: [
        {
          label: 'Iceberg REST Catalogs',
          url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/iceberg_rest_catalogs.html'
        }
      ]
    },
    readWrite: {
      support: 'partial',
      details: 'DuckDB can read V3 tables that use only V2-compatible data types. INSERT into V3 tables supported; UPDATE/DELETE on V3 not yet documented',
      externalLinks: [
        {
          label: 'Iceberg Extension Overview',
          url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/overview.html'
        }
      ]
    },
    dml: {
      support: 'none',
      details: 'MERGE INTO not supported on any version. UPDATE/DELETE on V3 tables not yet documented. INSERT into V3 supported per extension limitations page',
      externalLinks: [
        {
          label: 'Troubleshooting - Current Limitations',
          url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/troubleshooting.html'
        }
      ]
    },
    morCow: {
      support: 'partial',
      details: 'V3 tables with position deletes can be read if only V2-compatible data types are used. Full MoR/CoW behavior on V3 not yet documented',
      externalLinks: [
        {
          label: 'Troubleshooting - Delete Limitations',
          url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/troubleshooting.html'
        }
      ]
    },
    streaming: {
      support: 'none',
      details: 'Batch-only analytics engine; no built-in streaming ingestion or CDC subscribe APIs',
      externalLinks: [
        {
          label: 'Iceberg Extension Overview',
          url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/overview.html'
        }
      ]
    },
    formatV3: {
      support: 'partial',
      details: 'DuckDB can read V3 tables that use only V2-compatible data types. V3-only data types (nanosecond timestamps, geometry, vector, shredded variant) are not supported',
      externalLinks: [
        {
          label: 'Troubleshooting - Current Limitations',
          url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/troubleshooting.html'
        }
      ]
    },
    timeTravel: {
      support: 'partial',
      details: 'Time travel on V3 tables likely works for V2-compatible data types via AT (VERSION => snapshot_id) and AT (TIMESTAMP => ts) syntax, but not explicitly documented for V3',
      externalLinks: [
        {
          label: 'Iceberg Extension Overview',
          url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/overview.html'
        }
      ]
    },
    security: {
      support: 'partial',
      details: 'Uses DuckDB\'s standard S3/Azure credentials in httpfs extension; REST-catalog OAuth2 tokens supported since v1.3+; no built-in RBAC or row-level masking',
      externalLinks: [
        {
          label: 'Iceberg REST Catalogs Authentication',
          url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/iceberg_rest_catalogs.html'
        }
      ]
    }
  },
  quickStart: `-- DuckDB with Iceberg
INSTALL iceberg;
LOAD iceberg;

-- Direct file-system scan
SELECT * FROM iceberg_scan('/bucket/table/');

-- REST catalog connection
CREATE SECRET iceberg_rest (
    TYPE 'ICEBERG',
    CATALOG_TYPE 'REST',
    CATALOG_URL 'https://rest-catalog.example.com',
    CATALOG_TOKEN 'your_token_here'
);

-- Time travel query
SELECT * FROM iceberg_scan('/bucket/table/') 
AT (TIMESTAMP => '2025-05-01 10:15:00');`,
  versions: {
    v2: {
      features: {
        catalogs: {
          support: 'full',
          details: 'Supports attaching to Iceberg REST Catalogs (OAuth2 since v1.3+), AWS Glue via ENDPOINT_TYPE=glue, Polaris, and S3 Tables. Only REST-based catalogs supported — no Hive Metastore, Hadoop, Nessie, or JDBC',
          externalLinks: [
            { label: 'Iceberg REST Catalogs', url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/iceberg_rest_catalogs.html' }
          ]
        },
        readWrite: {
          support: 'full',
          details: 'Full read support for V1 and V2 tables via the iceberg extension with predicate push-down, manifest pruning, and external file cache. INSERT INTO supported since v1.4.0 via REST catalog attachment',
          externalLinks: [
            { label: 'Iceberg Extension Overview', url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/overview.html' }
          ]
        },
        dml: {
          support: 'partial',
          details: 'UPDATE and DELETE supported since v1.4.2; MERGE INTO and ALTER TABLE are not supported. Requires REST catalog attachment for write operations',
          externalLinks: [
            { label: 'Troubleshooting - Current Limitations', url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/troubleshooting.html' }
          ]
        },
        morCow: {
          support: 'full',
          details: 'Full MoR semantics: UPDATE/DELETE use positional deletes (MoR). INSERT uses COW semantics. Supports reading tables with position deletes and equality deletes',
          externalLinks: [
            { label: 'Iceberg Extension Overview', url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/overview.html' }
          ]
        },
        streaming: {
          support: 'none',
          details: 'Batch-only analytics engine; no built-in streaming ingestion or CDC subscribe APIs'
        },
        formatV3: {
          support: 'none',
          details: 'Iceberg Format V3 features are not applicable to V2 tables.'
        },
        timeTravel: {
          support: 'full',
          details: 'SQL time travel via AT (VERSION => snapshot_id) and AT (TIMESTAMP => ts) syntax. Older iceberg_scan() function-style parameters still work',
          externalLinks: [
            { label: 'Iceberg Extension Overview', url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/overview.html' }
          ]
        },
        security: {
          support: 'partial',
          details: 'Standard S3/Azure credentials via httpfs extension; REST-catalog OAuth2 tokens supported since v1.3+; no built-in RBAC or row-level masking',
          externalLinks: [
            { label: 'S3 Iceberg Import', url: 'https://duckdb.org/docs/stable/guides/network_cloud_storage/s3_iceberg_import.html' }
          ]
        }
      },
      score: 20,
      description: 'DuckDB v1.4+ supports full Iceberg V2 read/write operations with REST catalog, time travel, MoR/CoW semantics, and partial DML (UPDATE/DELETE but no MERGE)'
    }
  },
  bestPractices: [
    'Use DuckDB v1.3.0 or later for the built-in Iceberg extension',
    'Configure external file-cache via SET s3_cache_size=\'4GB\'; to halve cold-scan latency',
    'Set allow_moved_paths flag to true for relocated tables to work out-of-the-box',
    'Use REST catalog auto-refresh with snapshot_refresh_interval session setting',
    'Leverage the new SQL AT syntax for time travel instead of function parameters',
    'Use iceberg_snapshots() to view current snapshot first with summary JSON for quick diffing',
    'Use iceberg_metadata() for file-size/row-count stats used by the planner',
    'Only read Parquet-based Iceberg tables as Avro/ORC data files are ignored',
    'Avoid tables with delete files as reading tables with deletes is not yet supported',
    'Use CREATE SECRET workflow for S3/Azure authentication with httpfs extension',
    'Keep queries focused on analytical workloads as DuckDB is read-only for Iceberg',
    'Use CREATE VIEW with iceberg_scan() for reusable table references',
    'Leverage predicate push-down and manifest pruning for better query performance',
    'Consider single-node execution limitations for large lake queries',
    'Use object-store IAM plus catalog ACLs for security and governance',
    'Rely on cost-based optimization improvements in 1.3 for better query planning'
  ]
});