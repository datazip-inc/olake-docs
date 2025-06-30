// // data/query-engines/index.ts
// import { QueryEngine } from '../../types/iceberg';

// // Import available query engine data files
// import { spark } from './spark';
// import { flink } from './flink';
// import { snowflake } from './snowflake';

// // TODO: Create and import the remaining engines:
// // import { trino } from './trino';
// // import { hive } from './hive';
// // import { clickhouse } from './clickhouse';
// // import { presto } from './presto';
// // import { dremio } from './dremio';
// // import { starrocks } from './starrocks';
// // import { athena } from './athena';
// // import { bigquery } from './bigquery';
// // import { doris } from './doris';
// // import { duckdb } from './duckdb';
// // import { databricks } from './databricks';
// // import { starburst } from './starburst';
// // import { impala } from './impala';

// export const QUERY_ENGINES: QueryEngine[] = [
//   spark,
//   flink,
//   snowflake,
//   // Add the remaining engines here as you create them:
//   // trino,
//   // hive,
//   // clickhouse,
//   // presto,
//   // dremio,
//   // starrocks,
//   // athena,
//   // bigquery,
//   // doris,
//   // duckdb,
//   // databricks,
//   // starburst,
//   // impala,
// ];

// // Export individual engines for direct access
// export {
//   spark,
//   flink,
//   snowflake,
//   // trino,
//   // hive,
//   // clickhouse,
//   // presto,
//   // dremio,
//   // starrocks,
//   // athena,
//   // bigquery,
//   // doris,
//   // duckdb,
//   // databricks,
//   // starburst,
//   // impala,
// };

// // Utility functions
// export const getEngineById = (id: string): QueryEngine | undefined => {
//   return QUERY_ENGINES.find(engine => engine.id === id);
// };

// export const getEnginesByCategory = (category: QueryEngine['category']): QueryEngine[] => {
//   return QUERY_ENGINES.filter(engine => engine.category === category);
// };

// export const getEnginesBySupportLevel = (
//   feature: keyof QueryEngine['features'], 
//   level: QueryEngine['features'][keyof QueryEngine['features']]['support']
// ): QueryEngine[] => {
//   return QUERY_ENGINES.filter(engine => engine.features[feature].support === level);
// };

// data/query-engines/index.ts
import { QueryEngine } from '../../types/iceberg';
import { validateQueryEngine } from '../../templates/query-engine-template';

// Import available query engine data files
import { spark } from './spark';
import { flink } from './flink';
import { snowflake } from './snowflake';
import { clickhouse } from './clickhouse';
import { presto } from './presto';

// TODO: Create and import the remaining engines using the template:
import { trino } from './trino';
import { hive } from './hive';
import { dremio } from './dremio';
import { starrocks } from './starrocks';
import { athena } from './athena';
import { bigquery } from './bigquery';
import { doris } from './doris';
import { duckdb } from './duckdb';
import { databricks } from './databricks';
import { starburst } from './starburst';
import { impala } from './impala';

/**
 * Validate all engines before exporting
 * This ensures data consistency across all query engines
 */
function validateAllEngines(engines: QueryEngine[]): void {
  const validationErrors: string[] = [];

  engines.forEach(engine => {
    const validation = validateQueryEngine(engine);
    if (!validation.isValid) {
      validationErrors.push(`${engine.name}: ${validation.errors.join(', ')}`);
    }
  });

  if (validationErrors.length > 0) {
    console.warn('Query Engine Validation Warnings:', validationErrors);
  }
}

/**
 * All available query engines
 * Add new engines here after creating their data files
 */
export const QUERY_ENGINES: QueryEngine[] = [
  spark,
  flink,
  hive,
  trino,
  clickhouse,
  presto,
  dremio,
  starrocks,
  athena,
  bigquery,
  snowflake,
  doris,
  duckdb,
  databricks,
  starburst,
  impala,
];

// Validate all engines in development
if (process.env.NODE_ENV === 'development') {
  validateAllEngines(QUERY_ENGINES);
}

// Export individual engines for direct access
export {
  spark,
  flink,
  hive,
  trino,
  clickhouse,
  presto,
  dremio,
  starrocks,
  athena,
  bigquery,
  snowflake,
  doris,
  duckdb,
  databricks,
  starburst,
  impala,
};

/**
 * Utility functions for working with query engines
 */

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

export const getEnginesByFeatureSupport = (
  feature: keyof QueryEngine['features']
): { full: QueryEngine[]; partial: QueryEngine[]; preview: QueryEngine[]; none: QueryEngine[] } => {
  return {
    full: getEnginesBySupportLevel(feature, 'full'),
    partial: getEnginesBySupportLevel(feature, 'partial'),
    preview: getEnginesBySupportLevel(feature, 'preview'),
    none: getEnginesBySupportLevel(feature, 'none')
  };
};

export const searchEngines = (query: string): QueryEngine[] => {
  const searchTerm = query.toLowerCase();
  return QUERY_ENGINES.filter(engine =>
    engine.name.toLowerCase().includes(searchTerm) ||
    engine.description.toLowerCase().includes(searchTerm) ||
    engine.id.toLowerCase().includes(searchTerm)
  );
};

export const getEngineStats = () => {
  const stats = {
    total: QUERY_ENGINES.length,
    byCategory: {} as Record<QueryEngine['category'], number>,
    bySupport: {} as Record<string, Record<string, number>>
  };

  // Count by category
  QUERY_ENGINES.forEach(engine => {
    stats.byCategory[engine.category] = (stats.byCategory[engine.category] || 0) + 1;
  });

  // Count by feature support
  Object.keys(QUERY_ENGINES[0]?.features || {}).forEach(feature => {
    stats.bySupport[feature] = { full: 0, partial: 0, preview: 0, none: 0 };
    QUERY_ENGINES.forEach(engine => {
      const support = engine.features[feature as keyof QueryEngine['features']].support;
      stats.bySupport[feature][support]++;
    });
  });

  return stats;
};

/**
 * Constants for UI components
 */
export const ENGINE_CATEGORIES = [
  'general-purpose',
  'streaming',
  'analytics',
  'cloud-native',
  'embedded'
] as const;

export const SUPPORT_LEVELS = [
  'full',
  'partial',
  'preview',
  'none'
] as const;

export const FEATURE_KEYS = [
  'catalogs',
  'readWrite',
  'dml',
  'morCow',
  'streaming',
  'formatV3',
  'timeTravel',
  'security'
] as const;

/**
 * Documentation for adding new engines:
 * 
 * 1. Create a new file in this directory following the naming convention:
 *    src/data/query-engines/[engine-name].ts
 * 
 * 2. Use the template from templates/query-engine-template.ts
 * 
 * 3. Import and add the engine to the QUERY_ENGINES array above
 * 
 * 4. Export the engine in the individual exports section
 * 
 * 5. Run validation to ensure data consistency
 * 
 * 6. Test the engine appears correctly in all views (table, cards, features)
 */