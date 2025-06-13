// data/query-engines/spark.ts
import { QueryEngine } from '../../types/iceberg';

export const spark: QueryEngine = {
  id: 'spark',
  name: 'Apache Spark 3.3+',
  description: 'The reference implementation for Apache Iceberg with comprehensive read/write support',
  category: 'general-purpose',
  website: 'https://spark.apache.org/',
  documentation: 'https://iceberg.apache.org/docs/latest/spark/',
  features: {
    catalogs: {
      support: 'full',
      details: 'Hive Metastore, Hadoop warehouse, REST, AWS Glue, JDBC, Nessie, plus custom plug-ins'
    },
    readWrite: {
      support: 'full',
      details: 'Full table scans, metadata-table reads, INSERT INTO, atomic INSERT OVERWRITE, DataFrame writeTo, and stored procedures'
    },
    dml: {
      support: 'full',
      details: 'MERGE INTO, UPDATE, DELETE via Spark Session Extensions; Iceberg 0.14+ emits position/equality-delete files'
    },
    morCow: {
      support: 'full',
      details: 'Copy-on-Write default; Merge-on-Read enabled when delete files are written'
    },
    streaming: {
      support: 'partial',
      details: 'Incremental reads with stream-from-timestamp; append/complete Structured Streaming writes'
    },
    formatV3: {
      support: 'full',
      details: 'GA read + write on Spark 3.5 with Iceberg 1.8+; Deletion Vectors, Row Lineage columns, new types supported'
    },
    timeTravel: {
      support: 'full',
      details: 'SQL VERSION AS OF / TIMESTAMP AS OF supported since Spark 3.3'
    },
    security: {
      support: 'full',
      details: 'Delegates ACLs to underlying catalog (Hive Ranger, AWS IAM, Nessie policies)'
    }
  },
  quickStart: `// Spark with Iceberg
spark.sql("CREATE TABLE prod.db.table (id bigint, data string) USING iceberg")
spark.sql("INSERT INTO prod.db.table VALUES (1, 'a'), (2, 'b')")
df.writeTo("prod.db.table").append()`,
  bestPractices: [
    'Use Spark 3.5+ with Iceberg 1.8+ for full V3 support',
    'Enable adaptive query execution for better performance',
    'Use write.distribution.mode for optimized writes',
    'Regularly run maintenance procedures (rewrite_data_files, expire_snapshots)'
  ]
};