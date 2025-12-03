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
    sectionHeader("GETTING STARTED"),
    'intro',

    {
      type: 'category',
      label: 'Benchmarks',
      link: { type: 'doc', id: 'benchmarks' },
      items: [
        'dmsvsolake',
      ],
    },
    

    // GETTING STARTED

    {
      type: 'category',
      label: 'Getting Started',      
      items: [
        'getting-started/quickstart',
        {
          type: 'category',
          label: 'Create Your First Job Pipeline',
          link: { type: 'doc', id: 'getting-started/creating-first-pipeline' },
          items: [
            'getting-started/job-level-properties',
            'getting-started/alerts-and-notifications',
          ],
        },
        'getting-started/playground',
      ],
    },

    // INSTALL 

    {
      type: 'category',
      label: 'Install',
      items: [
        {
          type: 'category',
          label: 'Docker Compose (UI)',
          link: { type: 'doc', id: 'install/olake-ui/index' },
          items: [
            'install/olake-ui/offline-environments-aws',
            'install/olake-ui/offline-environments-generic',
          ],
        },
        'install/kubernetes',
        'install/docker-cli',
      ],
    },

    // CONNECTORS
    sectionHeader("CONNECTORS"),
    {
      type: 'category',
      label: 'Sources',
      items: [
        'connectors/postgres/index',
        'connectors/mongodb/index',
        'connectors/mysql/index',
        'connectors/oracle/index',
        'connectors/kafka/index',
      ],
    },


    // Writers
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
                'writers/iceberg/catalog/glue',
                'writers/iceberg/catalog/rest',
                'writers/iceberg/catalog/jdbc',
                'writers/iceberg/catalog/hive',
              ],
            },
            'writers/iceberg/partitioning',
            'writers/iceberg/azure',
            'writers/iceberg/gcp',
            'writers/iceberg/troubleshooting-local',
          ],
        },

        {
          type: 'category',
          label: 'Parquet Writer',
          items: [
            'writers/parquet/config',
            'writers/parquet/permission',
            'writers/parquet/partitioning',
            'writers/parquet/troubleshoot',
            
          ],
        },

      ],
    },

    sectionHeader("UNDERSTANDING OLAKE"),
    {
      type: 'category',
      label: 'Terminologies',
      items: [
        'understanding/terminologies/general',
        'understanding/terminologies/olake',
      ],
    },
    'features/index',
    'core/architecture',
    'understanding/compatibility-catalogs',
    'understanding/compatibility-engines',
    'core/use-cases',

    // Community
    sectionHeader("COMMUNITY"),
    'community/contributing',
    'community/setting-up-a-dev-env',
    'community/commands-and-flags',
    'community/issues-and-prs',
    'community/code-of-conduct',
    'community/channels',

    
    sectionHeader("RELEASE NOTES"),
    {
      type: 'category',
      label: 'Versions',
      items: [
        'release/overview',
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
    
  ],
};

export default docSidebar;