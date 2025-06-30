// templates/query-engine-template.ts
// This is a template file to help create new query engines consistently

import { QueryEngine } from '../types/iceberg';

/**
 * Template for creating a new query engine configuration
 * Copy this file and replace all TEMPLATE_* placeholders with actual values
 * 
 * File naming convention: src/data/query-engines/[engine-name-lowercase].ts
 * Example: src/data/query-engines/clickhouse.ts
 * 
 * Required steps:
 * 1. Copy this template file
 * 2. Replace all TEMPLATE_* placeholders
 * 3. Add import to src/data/query-engines/index.ts
 * 4. Export the engine in the QUERY_ENGINES array
 * 5. Add any missing tests
 */

export const TEMPLATE_ENGINE_NAME: QueryEngine = {
    // Unique identifier (lowercase, no spaces, use hyphens)
    id: 'TEMPLATE_ID',

    // Display name (proper capitalization)
    name: 'TEMPLATE_NAME',

    // Brief description (1-2 sentences max)
    description: 'TEMPLATE_DESCRIPTION',

    // Category must be one of: 'general-purpose' | 'streaming' | 'analytics' | 'cloud-native' | 'embedded'
    category: 'TEMPLATE_CATEGORY',

    // Official website URL
    website: 'TEMPLATE_WEBSITE',

    // Official documentation URL (preferably Iceberg-specific docs)
    documentation: 'TEMPLATE_DOCUMENTATION',

    features: {
        // Catalog support: what catalog types are supported?
        catalogs: {
            support: 'TEMPLATE_SUPPORT_LEVEL', // 'full' | 'partial' | 'preview' | 'none'
            details: 'TEMPLATE_CATALOG_DETAILS' // Specific catalogs supported (Hive, Glue, REST, etc.)
        },

        // Read/Write capabilities
        readWrite: {
            support: 'TEMPLATE_SUPPORT_LEVEL',
            details: 'TEMPLATE_READWRITE_DETAILS' // SQL operations, APIs supported
        },

        // DML operations (INSERT, UPDATE, DELETE, MERGE)
        dml: {
            support: 'TEMPLATE_SUPPORT_LEVEL',
            details: 'TEMPLATE_DML_DETAILS' // Which DML operations are supported
        },

        // Copy-on-Write vs Merge-on-Read support
        morCow: {
            support: 'TEMPLATE_SUPPORT_LEVEL',
            details: 'TEMPLATE_MORCOW_DETAILS' // Default mode, configuration options
        },

        // Streaming capabilities
        streaming: {
            support: 'TEMPLATE_SUPPORT_LEVEL',
            details: 'TEMPLATE_STREAMING_DETAILS' // Streaming frameworks, real-time capabilities
        },

        // Iceberg Format V3 support
        formatV3: {
            support: 'TEMPLATE_SUPPORT_LEVEL',
            details: 'TEMPLATE_FORMATV3_DETAILS' // V3 features supported (deletion vectors, etc.)
        },

        // Time travel capabilities
        timeTravel: {
            support: 'TEMPLATE_SUPPORT_LEVEL',
            details: 'TEMPLATE_TIMETRAVEL_DETAILS' // SQL syntax, snapshot access methods
        },

        // Security and access control
        security: {
            support: 'TEMPLATE_SUPPORT_LEVEL',
            details: 'TEMPLATE_SECURITY_DETAILS' // RBAC, encryption, access control methods
        }
    },

    // Quick start code example (keep it concise, 3-5 lines max)
    quickStart: `TEMPLATE_QUICKSTART_CODE`,

    // Array of best practices (3-6 items recommended)
    bestPractices: [
        'TEMPLATE_BEST_PRACTICE_1',
        'TEMPLATE_BEST_PRACTICE_2',
        'TEMPLATE_BEST_PRACTICE_3',
        'TEMPLATE_BEST_PRACTICE_4'
    ]
};

/**
 * Validation function to ensure data consistency
 * Run this before exporting any new query engine
 */
export function validateQueryEngine(engine: QueryEngine): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!engine.id || engine.id.includes(' ') || engine.id !== engine.id.toLowerCase()) {
        errors.push('ID must be lowercase with no spaces (use hyphens for multi-word names)');
    }

    if (!engine.name || engine.name.length < 2) {
        errors.push('Name is required and must be at least 2 characters');
    }

    if (!engine.description || engine.description.length < 10) {
        errors.push('Description must be at least 10 characters');
    }

    if (!['general-purpose', 'streaming', 'analytics', 'cloud-native', 'embedded'].includes(engine.category)) {
        errors.push('Category must be one of: general-purpose, streaming, analytics, cloud-native, embedded');
    }

    if (!engine.website || !engine.website.startsWith('http')) {
        errors.push('Website must be a valid URL starting with http/https');
    }

    if (!engine.documentation || !engine.documentation.startsWith('http')) {
        errors.push('Documentation must be a valid URL starting with http/https');
    }

    // Features validation
    const supportLevels = ['full', 'partial', 'preview', 'none'];
    Object.entries(engine.features).forEach(([key, feature]) => {
        if (!supportLevels.includes(feature.support)) {
            errors.push(`Feature ${key} must have support level: full, partial, preview, or none`);
        }

        if (!feature.details || feature.details.length < 5) {
            errors.push(`Feature ${key} must have details with at least 5 characters`);
        }
    });

    if (!engine.quickStart || engine.quickStart.length < 10) {
        errors.push('Quick start code example is required');
    }

    if (!engine.bestPractices || engine.bestPractices.length < 2) {
        errors.push('At least 2 best practices are required');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Helper function to generate a new query engine file
 */
export function generateQueryEngineFile(
    engineName: string,
    engineId: string,
    category: QueryEngine['category']
): string {
    const template = `// data/query-engines/${engineId}.ts
import { QueryEngine } from '../../types/iceberg';

export const ${engineId.replace(/-/g, '')}: QueryEngine = {
  id: '${engineId}',
  name: '${engineName}',
  description: 'Add description here',
  category: '${category}',
  website: 'https://example.com',
  documentation: 'https://example.com/docs',
  features: {
    catalogs: {
      support: 'none',
      details: 'Add catalog support details'
    },
    readWrite: {
      support: 'none', 
      details: 'Add read/write capabilities'
    },
    dml: {
      support: 'none',
      details: 'Add DML support details'
    },
    morCow: {
      support: 'none',
      details: 'Add MoR/CoW details'
    },
    streaming: {
      support: 'none',
      details: 'Add streaming capabilities'
    },
    formatV3: {
      support: 'none',
      details: 'Add format V3 support'
    },
    timeTravel: {
      support: 'none',
      details: 'Add time travel capabilities'
    },
    security: {
      support: 'none',
      details: 'Add security features'
    }
  },
  quickStart: \`// Add quick start code here\`,
  bestPractices: [
    'Add best practice 1',
    'Add best practice 2'
  ]
};`;

    return template;
}

// Usage examples:
// 1. Copy this template file to create a new engine file
// 2. Use validateQueryEngine() to check your data before committing
// 3. Use generateQueryEngineFile() to create boilerplate code
// 4. Always run validation before adding to the main QUERY_ENGINES array