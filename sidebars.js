// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 * - create an ordered group of docs
 * - render a sidebar for each doc of that group
 * - provide next/previous navigation
 *
 * The sidebars can be generated from the filesystem, or explicitly defined here.
 *
 * Create as many sidebars as you want.
 *
 *
 */
const sectionHeader = (title) => ({
  type: "html",
  value: title,
  className: "navbar__category",
});

const docSidebar = {
  // module.exports = {
  docSidebar: [
    // OVERVIEW
    sectionHeader("Overview"),
    'intro',
    {
      type: 'category',
      label: 'Benchmarks',
      items: [
        {
          type: 'doc',
          id: 'benchmarks/ingestion',
          label: 'Ingestion Benchmarks',
        },
        {
          type: 'doc',
          id: 'benchmarks/optimization',
          label: 'Optimization Benchmarks',
        },
        {
          type: 'doc',
          id: 'dmsvsolake',
          label: 'AWS DMS vs OLake',
        },
      ],
    },
    {
      type: 'category',
      label: 'Install',
      items: [
        {
          type: 'category',
          label: 'Docker (UI)',
          items: [
            {
              type: 'doc',
              id: 'install/olake-ui/index',
              label: 'Docker Compose',
            },
            {
              type: 'doc',
              id: 'install/olake-ui/offline-environments-aws',
              label: 'Offline Environments (AWS)',
            },
            {
              type: 'doc',
              id: 'install/olake-ui/offline-environments-generic',
              label: 'Offline Environments (Generic)',
            },
          ],
        },
        {
          type: 'doc',
          id: 'install/docker-cli',
          label: 'Docker Compose (CLI)',
        },
        {
          type: 'doc',
          id: 'install/kubernetes',
          label: 'Kubernetes Installation',
        },
        {
          type: 'doc',
          id: 'install/kubernetes-optimization',
          label: 'Kubernetes Optimization Installation',
        },
      ],
    },

    // SERVICES
    sectionHeader("SERVICES"),
    {
      type: 'category',
      label: 'Ingestion',
      items: [
        {
          type: 'doc',
          id: 'features/index',
          label: 'Overview',
        },
        
        {
          type: 'category',
          label: 'Quickstart',
          items: [
            {
              type: 'doc',
              id: 'getting-started/quickstart',
              label: 'Getting Started',
            },
            {
              type: 'doc',
              id: 'getting-started/creating-first-pipeline',
              label: 'Create Your First Job Pipeline',
            },
            {
              type: 'doc',
              id: 'getting-started/playground',
              label: 'Playground',
            },
          ],
        },
        {
          type: 'category',
          label: 'Sources',
          items: [
            {
              type: 'doc',
              id: 'connectors/postgres/index',
              label: 'PostgreSQL',
            },
            {
              type: 'doc',
              id: 'connectors/mongodb/index',
              label: 'MongoDB',
            },
            {
              type: 'doc',
              id: 'connectors/mysql/index',
              label: 'MySQL',
            },
            {
              type: 'doc',
              id: 'connectors/oracle/index',
              label: 'Oracle',
            },
            {
              type: 'doc',
              id: 'connectors/kafka/index',
              label: 'Kafka',
            },
            {
              type: 'doc',
              id: 'connectors/db2/index',
              label: 'DB2 LUW',
            },
            {
              type: 'doc',
              id: 'connectors/s3/index',
              label: 'S3',
            },
            {
              type: 'doc',
              id: 'connectors/mssql/index',
              label: 'MSSQL',
            },
          ],
        },
        {
          type: 'category',
          label: 'Destinations',
          items: [
            {
              type: 'category',
              label: 'Apache Iceberg',
              items: [
                {
                  type: 'category',
                  label: 'Catalogs',
                  items: [
                    {
                      type: 'doc',
                      id: 'writers/iceberg/catalog/glue',
                      label: 'AWS Glue',
                    },
                    {
                      type: 'doc',
                      id: 'writers/iceberg/catalog/rest',
                      label: 'REST Catalog',
                    },
                    {
                      type: 'doc',
                      id: 'writers/iceberg/catalog/jdbc',
                      label: 'JDBC Catalog',
                    },
                    {
                      type: 'doc',
                      id: 'writers/iceberg/catalog/hive',
                      label: 'Hive Metastore',
                    },
                  ],
                },
                {
                  type: 'doc',
                  id: 'writers/iceberg/partitioning',
                  label: 'Data Partitioning',
                },
                {
                  type: 'doc',
                  id: 'writers/iceberg/azure',
                  label: 'Iceberg On Azure',
                },
                {
                  type: 'doc',
                  id: 'writers/iceberg/gcp',
                  label: 'Iceberg on Google Cloud',
                },
                {
                  type: 'doc',
                  id: 'writers/iceberg/troubleshooting-local',
                  label: 'Troubleshooting & Local Testing',
                },
              ],
            },
            {
              type: 'category',
              label: 'Parquet Writer',
              items: [
                {
                  type: 'doc',
                  id: 'writers/parquet/config',
                  label: 'Configuration',
                },
                {
                  type: 'doc',
                  id: 'writers/parquet/permission',
                  label: 'IAM Permissions',
                },
                {
                  type: 'doc',
                  id: 'writers/parquet/partitioning',
                  label: 'Partitioning',
                },
                {
                  type: 'doc',
                  id: 'writers/parquet/troubleshoot',
                  label: 'Troubleshooting',
                },
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Features',
          items: [
            {
              type: 'doc',
              id: 'getting-started/job-level-properties',
              label: 'Job level features',
            },
            {
              type: 'doc',
              id: 'getting-started/alerts-and-notifications',
              label: 'Alerts & Notifications',
            },
          ],
        },
        {
          type: 'doc',
          id: 'understanding/terminologies/olake',
          label: 'Properties',
        },
      ],
    },

    {
      type: 'category',
      label: 'Iceberg Maintenance',
      items: [
        {
          type: 'doc',
          id: 'iceberg-maintenance/overview',
          label: 'Overview',
        },
        {
          type: 'category',
          label: 'Quickstart',
          items: [
            {
              type: 'doc',
              id: 'getting-started/configure-first-optimization',
              label: 'Configure Your First Optimization',
            },
          ],
        },
        {
          type: 'doc',
          id: 'iceberg-maintenance/catalogs',
          label: 'Catalogs',
        },
        {
          type: 'category',
          label: 'Optimization',
          items: [
            {
              type: 'doc',
              id: 'iceberg-maintenance/optimization/overview',
              label: 'Types of Optimization',
            },
            {
              type: 'doc',
              id: 'iceberg-maintenance/optimization/configuration',
              label: 'Configuration',
            },
          ],
        },
        {
          type: 'doc',
          id: 'iceberg-maintenance/runs-and-logs',
          label: 'Logs & Runs',
        },
        {
          type: 'doc',
          id: 'iceberg-maintenance/metrics',
          label: 'Metrics',
        },
      ],
    },

    // UNDERSTANDING OLAKE
    sectionHeader("UNDERSTANDING OLAKE"),
    'understanding/terminologies/general',
    'core/architecture',
    'understanding/compatibility-catalogs',
    'understanding/compatibility-engines',
    'core/use-cases',

    // Community
    sectionHeader("COMMUNITY"),
    'community/contributing',
    {
      type: 'category',
      label: 'Development environment',
      items: [
        {
          type: 'doc',
          id: 'community/setting-up-a-dev-env',
          label: 'Setting up a development environment',
        },
        'community/learning-modules',
      ],
    },
    'community/commands-and-flags',
    'community/issues-and-prs',
    'community/code-of-conduct',
    'community/channels',

    // RELEASE NOTES
    sectionHeader("RELEASE NOTES"),
    {
      type: 'category',
      label: 'Ingestion',
      items: [
        'release/overview',
        'release/v0.6.0',
        'release/v0.5.0',
        'release/v0.4.0',
        'release/v0.3.17',
        'release/v0.3.14',
        'release/v0.3.9-v0.3.11',
        'release/v0.3.5',
        'release/v0.2.10',
        'release/v0.2.8',
        'release/v0.2.5-v0.2.7',
        'release/v0.2.2-v0.2.4',
        'release/v0.2.0-v0.2.1',
        'release/v0.1.9-v0.1.11',
        'release/v0.1.6-v0.1.8',
        'release/v0.1.2-v0.1.5',
        'release/v0.1.0-v0.1.1',
      ],
    },
    {
      type: 'category',
      label: 'Optimization',
      items: [
        'release/overview'
      ],
    },
  ],
};

export default docSidebar;