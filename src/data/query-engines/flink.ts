// data/query-engines/flink.ts
import { QueryEngine } from '../../types/iceberg';

export const flink: QueryEngine = {
  id: 'flink',
  name: 'Apache Flink 1.18+',
  description: 'The reference implementation for CDC to Iceberg with comprehensive streaming support, exactly-once semantics, and advanced FLIP-27 incremental reads',
  category: 'streaming',
  website: 'https://flink.apache.org/',
  documentation: 'https://iceberg.apache.org/docs/latest/flink/',
  features: {
    catalogs: {
      support: 'full',
      details: 'Hive Metastore, Hadoop catalog, REST catalog (incl. Nessie), AWS Glue, JDBC, plus any custom implementation via catalog-impl',
      externalLinks: [
        {
          label: 'Flink Catalog Configuration',
          url: 'https://iceberg.apache.org/docs/latest/flink-configuration/#catalog-configuration'
        }
      ]
    },
    readWrite: {
      support: 'full',
      details: 'Batch and streaming jobs read snapshots or incremental DataStreams; Iceberg Sink commits on each Flink checkpoint with exactly-once semantics',
      externalLinks: [
        {
          label: 'Flink Queries - Batch & Streaming',
          url: 'https://iceberg.apache.org/docs/latest/flink-queries/'
        },
        {
          label: 'Flink Writes',
          url: 'https://iceberg.apache.org/docs/latest/flink-writes/'
        },
        {
          label: 'Incremental Read Strategies',
          url: 'https://iceberg.apache.org/docs/1.4.3/flink-configuration/#starting-strategy'
        }
      ]
    },
    dml: {
      support: 'partial',
      details: 'INSERT append always available; row-level changes via write.upsert.enabled=true on spec v2 tables; MERGE INTO not supported in Flink SQL',
      externalLinks: [
        {
          label: 'Flink INSERT INTO',
          url: 'https://iceberg.apache.org/docs/latest/flink-writes/#insert-into'
        },
        {
          label: 'UPSERT Mode',
          url: 'https://iceberg.apache.org/docs/latest/flink-writes/#upsert'
        },
        {
          label: 'Delete Data Feature',
          url: 'https://docs.cloudera.com/cdw-runtime/1.5.5/iceberg-how-to/topics/iceberg-delete.html'
        }
      ]
    },
    morCow: {
      support: 'full',
      details: 'Copy-on-Write for static batch rewrites; Merge-on-Read for streaming/UPSERT with delete files instead of partition rewrites',
      externalLinks: [
        {
          label: 'Flink Batch INSERT OVERWRITE',
          url: 'https://iceberg.apache.org/docs/latest/flink/#writing-with-sql'
        },
        {
          label: 'UPSERT Mode MoR',
          url: 'https://iceberg.apache.org/docs/1.5.0/flink-writes/#upsert'
        }
      ]
    },
    streaming: {
      support: 'full',
      details: 'Reference engine for CDC → Iceberg: consume Debezium/Kafka changelogs, upsert with exactly-once semantics, FLIP-27 source for incremental reads',
      externalLinks: [
        {
          label: 'Apache Flink CDC Overview',
          url: 'https://nightlies.apache.org/flink/flink-cdc-docs-master/docs/connectors/flink-sources/overview/'
        },
        {
          label: 'CDC with Apache Iceberg',
          url: 'https://www.dremio.com/blog/cdc-with-apache-iceberg/'
        },
        {
          label: 'Debezium Iceberg Integration',
          url: 'https://debezium.io/blog/2021/10/20/using-debezium-create-data-lake-with-apache-iceberg/'
        },
        {
          label: 'Flink Streaming Read',
          url: 'https://iceberg.apache.org/docs/latest/flink-queries/#flink-streaming-read'
        },
        {
          label: 'Iceberg Pipeline Connector',
          url: 'https://nightlies.apache.org/flink/flink-cdc-docs-master/docs/connectors/pipeline-connectors/iceberg/'
        }
      ]
    },
    formatV3: {
      support: 'full',
      details: 'GA read + write with Flink 1.18+ and Iceberg 1.8+; Binary Deletion Vectors, Row Lineage (_row_id, _last_updated_sequence_number), new data types, multi-argument transforms',
      externalLinks: [
        {
          label: 'Multi-Engine Support',
          url: 'https://iceberg.apache.org/multi-engine-support/'
        },
        {
          label: 'Format V3 Specification',
          url: 'https://iceberg.apache.org/spec/#version-3-extended-types-and-capabilities'
        },
        {
          label: 'Iceberg 1.8.0 Release',
          url: 'https://iceberg.apache.org/releases/#1.8.0-release'
        },
        {
          label: 'New Data Types',
          url: 'https://www.dremio.com/blog/apache-iceberg-v3/'
        }
      ]
    },
    timeTravel: {
      support: 'full',
      details: 'Filter push-down + partition pruning automatic; point-in-time reads via source options: start-snapshot-id, start-snapshot-timestamp, branch, tag',
      externalLinks: [
        {
          label: 'Flink Read Options',
          url: 'https://iceberg.apache.org/docs/latest/flink-configuration/#read-options'
        },
        {
          label: 'Performance Data Filtering',
          url: 'https://iceberg.apache.org/docs/latest/performance/#data-filtering'
        }
      ]
    },
    security: {
      support: 'full',
      details: 'Inherits ACLs from underlying catalog (Hive Ranger, AWS IAM, Nessie authorization); REST catalog secured with credential/token properties',
      externalLinks: [
        {
          label: 'Table-level Governance',
          url: 'https://www.linkedin.com/pulse/brief-guide-governance-apache-iceberg-tables-alex-merced-ckf4e'
        },
        {
          label: 'Iceberg Table Governance',
          url: 'https://atlan.com/know/iceberg/apache-iceberg-table-governance/'
        },
        {
          label: 'Flink with Nessie',
          url: 'https://www.dremio.com/blog/using-flink-with-apache-iceberg-and-nessie/'
        },
        {
          label: 'REST Catalog Security',
          url: 'https://medium.com/data-engineering-with-dremio/iceberg-rest-catalog-overview-3-oauth-authentication-34dc06a6aa20'
        }
      ]
    }
  },
  quickStart: `// Flink with Iceberg
CREATE CATALOG iceberg_catalog WITH (
  'type'='iceberg',
  'catalog-type'='hive',
  'uri'='thrift://localhost:9083'
);

CREATE TABLE iceberg_catalog.db.events (
  id BIGINT,
  event_time TIMESTAMP(3),
  data STRING
) WITH (
  'format-version'='2',
  'write.upsert.enabled'='true'
);`,
  bestPractices: [
    'Use Flink 1.18+ with Iceberg 1.8+ for full Format V3 support and deletion vectors',
    'Enable write.upsert.enabled=true for row-level operations on spec v2 tables',
    'Use exactly-once semantics for streaming writes with Flink checkpointing',
    'Keep the latest Flink snapshot alive when expiring old snapshots to avoid job corruption',
    'Use FLIP-27 source for incremental reads and streaming data consumption',
    'Configure appropriate checkpoint intervals for streaming jobs to balance latency and consistency',
    'Use HASH or RANGE write distribution modes for optimal data layout',
    'Leverage primary-key dedup on ingest for CDC workflows',
    'Set proper starting strategies (TABLE_SCAN_THEN_INCREMENTAL or INCREMENTAL_FROM_LATEST_SNAPSHOT)',
    'Use Flink CDC connectors for seamless database change capture integration',
    'Configure catalog credentials properly for multi-tenant REST catalog deployments',
    'Run maintenance actions (rewrite_data_files) as separate Flink batch jobs',
    'Monitor Flink job IDs in Iceberg snapshot summaries for troubleshooting',
    'Use external tools for schema changes (ADD/RENAME columns) due to Flink DDL limitations'
  ]
};