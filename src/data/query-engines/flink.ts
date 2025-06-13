// data/query-engines/flink.ts
import { QueryEngine } from '../../types/iceberg';

export const flink: QueryEngine = {
  id: 'flink',
  name: 'Apache Flink 1.18+',
  description: 'The reference engine for streaming CDC to Iceberg with exactly-once semantics',
  category: 'streaming',
  website: 'https://flink.apache.org/',
  documentation: 'https://iceberg.apache.org/docs/latest/flink/',
  features: {
    catalogs: {
      support: 'full',
      details: 'Hive Metastore, Hadoop catalog, REST catalog (incl. Nessie), AWS Glue, JDBC'
    },
    readWrite: {
      support: 'full',
      details: 'Batch and streaming jobs; Iceberg Sink commits on each checkpoint for exactly-once snapshots'
    },
    dml: {
      support: 'partial',
      details: 'INSERT append always available; UPDATE/DELETE via write.upsert.enabled=true; MERGE INTO in Flink SQL 1.17+'
    },
    morCow: {
      support: 'full',
      details: 'Copy-on-Write for batch; Merge-on-Read for streaming/UPSERT with delete files'
    },
    streaming: {
      support: 'full',
      details: 'Native CDC support; consume Debezium/Kafka changelogs, upsert with exactly-once semantics'
    },
    formatV3: {
      support: 'full',
      details: 'Read + write GA with Iceberg 1.8+; Binary Deletion Vectors and Row Lineage supported'
    },
    timeTravel: {
      support: 'full',
      details: 'Point-in-time reads via source options: start-snapshot-id, start-snapshot-timestamp, branch, tag'
    },
    security: {
      support: 'partial',
      details: 'Inherits ACLs from catalogs; Flink itself enforces nothing beyond connector permissions'
    }
  },
  quickStart: `-- Flink SQL with Iceberg
CREATE CATALOG iceberg_catalog WITH (
  'type'='iceberg',
  'catalog-type'='hive',
  'uri'='thrift://localhost:9083'
);
CREATE TABLE iceberg_catalog.db.table (
  id BIGINT,
  data STRING
) WITH ('write.upsert.enabled'='true');`,
  bestPractices: [
    'Enable checkpointing for exactly-once semantics',
    'Use write.upsert.enabled=true for CDC workloads',
    'Monitor checkpoint intervals to balance latency vs throughput',
    'Keep the latest Flink snapshot alive when expiring old snapshots'
  ]
};