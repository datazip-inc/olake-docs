// data/query-engines/duckdb.ts
import { QueryEngine } from '../../types/iceberg';

export const duckdb: QueryEngine = {
  id: 'duckdb',
  name: 'DuckDB v1.3+',
  description: 'A light-weight, read-only analytics engine for Iceberg with SQL time travel, external file caching, and REST catalog support',
  category: 'analytics',
  website: 'https://duckdb.org/',
  documentation: 'https://duckdb.org/docs/stable/core_extensions/iceberg/overview.html',
  features: {
    catalogs: {
      support: 'partial',
      details: 'Hadoop (file-system) and Iceberg REST catalogs supported via rest option with bearer/OAuth tokens; no native Hive/Glue catalog yet',
      externalLinks: [
        {
          label: 'Iceberg Extension Overview',
          url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/overview.html'
        },
        {
          label: 'Iceberg REST Catalogs',
          url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/iceberg_rest_catalogs.html'
        }
      ]
    },
    readWrite: {
      support: 'readonly',
      details: 'Full SELECT support with predicate evaluation, manifest pruning and external file-cache to avoid re-downloading S3/GCS objects; write operations not available',
      externalLinks: [
        {
          label: 'Iceberg Extension Overview',
          url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/overview.html'
        },
        {
          label: 'Troubleshooting - Write Limitations',
          url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/troubleshooting.html'
        }
      ]
    },
    dml: {
      support: 'none',
      details: 'iceberg_scan() and CREATE VIEW for reads; metadata helper functions available; no INSERT/UPDATE/DELETE/MERGE operations',
      externalLinks: [
        {
          label: 'GitHub - duckdb-iceberg README',
          url: 'https://github.com/duckdb/duckdb-iceberg'
        },
        {
          label: 'Troubleshooting - Writing Not Supported',
          url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/troubleshooting.html'
        }
      ]
    },
    morCow: {
      support: 'limited',
      details: 'Reading tables with deletes is not yet supported; only Copy-on-Write tables without delete files can be read',
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
      support: 'none',
      details: 'DuckDB 1.3 only reads v1 & v2 tables; v3 metadata changes will be evaluated post-GA of the spec',
      externalLinks: [
        {
          label: 'Iceberg Extension Overview',
          url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/overview.html'
        },
        {
          label: 'Troubleshooting - Current Limitations',
          url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/troubleshooting.html'
        }
      ]
    },
    timeTravel: {
      support: 'full',
      details: 'Convenient SQL syntax: SELECT * FROM tbl AT (VERSION => 314159) or AT (TIMESTAMP => \'2025-05-01 10:15:00\'); older function-style still works',
      externalLinks: [
        {
          label: 'Iceberg Extension Overview',
          url: 'https://duckdb.org/docs/stable/core_extensions/iceberg/overview.html'
        }
      ]
    },
    security: {
      support: 'basic',
      details: 'Uses DuckDB\'s standard S3/Azure creds in httpfs extension; REST-catalog tokens may be supplied per-session; no built-in RBAC/row-masking',
      externalLinks: [
        {
          label: 'S3 Iceberg Import',
          url: 'https://duckdb.org/docs/stable/guides/network_cloud_storage/s3_iceberg_import.html'
        },
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
};