// data/query-engines/index.ts
import { QueryEngine } from '../../types/iceberg';

// Import available query engine data files
import { spark } from './spark';
import { flink } from './flink';
import { snowflake } from './snowflake';

// TODO: Create and import the remaining engines:
// import { trino } from './trino';
// import { hive } from './hive';
// import { clickhouse } from './clickhouse';
// import { presto } from './presto';
// import { dremio } from './dremio';
// import { starrocks } from './starrocks';
// import { athena } from './athena';
// import { bigquery } from './bigquery';
// import { doris } from './doris';
// import { duckdb } from './duckdb';
// import { databricks } from './databricks';
// import { starburst } from './starburst';
// import { impala } from './impala';

export const QUERY_ENGINES: QueryEngine[] = [
  spark,
  flink,
  snowflake,
  // Add the remaining engines here as you create them:
  // trino,
  // hive,
  // clickhouse,
  // presto,
  // dremio,
  // starrocks,
  // athena,
  // bigquery,
  // doris,
  // duckdb,
  // databricks,
  // starburst,
  // impala,
];

// Export individual engines for direct access
export {
  spark,
  flink,
  snowflake,
  // trino,
  // hive,
  // clickhouse,
  // presto,
  // dremio,
  // starrocks,
  // athena,
  // bigquery,
  // doris,
  // duckdb,
  // databricks,
  // starburst,
  // impala,
};

// Utility functions
export const getEngineById = (id: string): QueryEngine | undefined => {
  return QUERY_ENGINES.find(engine => engine.id === id);
};

export const getEnginesByCategory = (category: QueryEngine['category']): QueryEngine[] => {
  return QUERY_ENGINES.filter(engine => engine.category === category);
};

export const getEnginesBySupportLevel = (
  feature: keyof QueryEngine['features'], 
  level: QueryEngine['features'][keyof QueryEngine['features']]['support']
): QueryEngine[] => {
  return QUERY_ENGINES.filter(engine => engine.features[feature].support === level);
};