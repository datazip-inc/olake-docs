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
    sectionHeader("GET STARTED"),
    { type: 'doc', id: 'intro', label: 'Overview' },
    {
      type: 'category',
      label: 'Benchmarks',
      items: [
        { type: 'doc', id: 'benchmarks/ingestion', label: 'Ingestion Benchmarks' },
        { type: 'doc', id: 'dmsvsolake', label: 'AWS DMS vs OLake Go' },
      ],
    },
    { type: 'doc', id: 'getting-started/quickstart', label: 'Quickstart' },
    { type: 'doc', id: 'getting-started/creating-first-pipeline', label: 'Configure Your Pipeline' },
    { type: 'doc', id: 'getting-started/playground', label: 'Playground' },

    // MOVE AND MANAGE DATA
    sectionHeader("MOVE AND MANAGE DATA"),
    {
      type: 'category',
      label: 'Sources',
      items: [
        { type: 'doc', id: 'connectors/postgres/index', label: 'PostgreSQL' },
        { type: 'doc', id: 'connectors/mongodb/index', label: 'MongoDB' },
        { type: 'doc', id: 'connectors/mysql/index', label: 'MySQL' },
        { type: 'doc', id: 'connectors/oracle/index', label: 'Oracle' },
        { type: 'doc', id: 'connectors/kafka/index', label: 'Kafka' },
        { type: 'doc', id: 'connectors/db2/index', label: 'DB2 LUW' },
        { type: 'doc', id: 'connectors/s3/index', label: 'S3' },
        { type: 'doc', id: 'connectors/mssql/index', label: 'MSSQL' },
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
                { type: 'doc', id: 'writers/iceberg/catalog/glue', label: 'AWS Glue' },
                { type: 'doc', id: 'writers/iceberg/catalog/rest', label: 'REST Catalog' },
                { type: 'doc', id: 'writers/iceberg/catalog/jdbc', label: 'JDBC Catalog' },
                { type: 'doc', id: 'writers/iceberg/catalog/hive', label: 'Hive Metastore' },
              ],
            },
            { type: 'doc', id: 'writers/iceberg/partitioning', label: 'Data Partitioning' },
            { type: 'doc', id: 'writers/iceberg/azure', label: 'Iceberg On Azure' },
            { type: 'doc', id: 'writers/iceberg/gcp', label: 'Iceberg on Google Cloud' },
            { type: 'doc', id: 'writers/iceberg/troubleshooting-local', label: 'Troubleshooting & Local Testing' },
          ],
        },
        {
          type: 'category',
          label: 'Parquet Writer',
          items: [
            { type: 'doc', id: 'writers/parquet/config', label: 'Configuration' },
            { type: 'doc', id: 'writers/parquet/permission', label: 'IAM Permissions' },
            { type: 'doc', id: 'writers/parquet/partitioning', label: 'Partitioning' },
            { type: 'doc', id: 'writers/parquet/troubleshoot', label: 'Troubleshooting' },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Properties',
      items: [
        { type: 'doc', id: 'getting-started/job-level-properties', label: 'Job-level Properties' },
        { type: 'doc', id: 'understanding/terminologies/olake', label: 'Stream-level Properties' },
        { type: 'doc', id: 'getting-started/alerts-and-notifications', label: 'Alerts & Notifications' },
      ],
    },

    // INSTALL & CONFIGURE
    sectionHeader("INSTALL & CONFIGURE"),
    {
      type: 'category',
      label: 'Docker UI',
      items: [
        { type: 'doc', id: 'install/olake-ui/index', label: 'Docker Compose' },
        { type: 'doc', id: 'install/olake-ui/offline-environments-aws', label: 'Offline Environments (AWS)' },
        { type: 'doc', id: 'install/olake-ui/offline-environments-generic', label: 'Offline Environments (Generic)' },
      ],
    },
    { type: 'doc', id: 'install/docker-cli', label: 'Docker CLI' },
    { type: 'doc', id: 'install/kubernetes', label: 'Kubernetes/Helm' },

    // CORE CONCEPTS
    sectionHeader("CORE CONCEPTS"),
    { type: 'doc', id: 'core/architecture', label: 'Core Architecture' },
    { type: 'doc', id: 'understanding/compatibility-catalogs', label: 'Catalog Compatibility' },
    { type: 'doc', id: 'understanding/compatibility-engines', label: 'Query Engine Compatibility' },
    { type: 'doc', id: 'understanding/terminologies/general', label: 'Terminologies' },
    { type: 'doc', id: 'features/schema', label: 'Schema Evolution' },
    { type: 'doc', id: 'core/use-cases', label: 'Use Cases' },
    
    // API REFERENCE
    sectionHeader("API DOCUMENTATION"),
    {
      type: 'doc',
      label: 'OLake UI API',
      id: 'api/olake-ui-api',
    },
    
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
    'release/ingestion/overview',
    {
      type: 'category',
      label: 'Versions',
      items: [
        'release/ingestion/v0.7.0',
        'release/ingestion/v0.6.0',
        'release/ingestion/v0.5.0',
        'release/ingestion/v0.4.0',
        'release/ingestion/v0.3.17',
        'release/ingestion/v0.3.14',
        'release/ingestion/v0.3.9-v0.3.11',
        'release/ingestion/v0.3.5',
        'release/ingestion/v0.2.10',
        'release/ingestion/v0.2.8',
        'release/ingestion/v0.2.5-v0.2.7',
        'release/ingestion/v0.2.2-v0.2.4',
        'release/ingestion/v0.2.0-v0.2.1',
        'release/ingestion/v0.1.9-v0.1.11',
        'release/ingestion/v0.1.6-v0.1.8',
        'release/ingestion/v0.1.2-v0.1.5',
        'release/ingestion/v0.1.0-v0.1.1',
      ],
    },
  ],
};

// ─── FUSION SIDEBAR ────────────────────────────────────────────────────────────
const fusionDocSidebar = {
  fusionDocSidebar: [

    // GET STARTED
    sectionHeader("Get Started"),
    { type: 'doc', id: 'fusion/getting-started/overview', label: 'Overview' },
    { type: 'doc', id: 'fusion/getting-started/compaction', label: 'Benchmarks' },
    { type: 'doc', id: 'fusion/getting-started/quickstart', label: 'Quickstart' },
    { type: 'doc', id: 'fusion/getting-started/configure-first-compaction', label: 'Configure Your First Compaction' },

    // MAINTENANCE
    sectionHeader("Maintenance"),
    { type: 'doc', id: 'fusion/maintenance/catalogs', label: 'Catalogs' },
    {
      type: 'category',
      label: 'Compaction',
      items: [
        { type: 'doc', id: 'fusion/compaction/types-of-compaction', label: 'Types of Compaction' },
        { type: 'doc',  id: 'fusion/compaction/configuration', label: 'Configuration' },
      ],
    },
    { type: 'doc', id: 'fusion/maintenance/runs-and-logs', label: 'Runs & Logs' },
    { type: 'doc', id: 'fusion/maintenance/metrics', label: 'Metrics' },

    // INSTALL & CONFIGURE
    sectionHeader("Install & Configure"),
    {
      type: 'category',
      label: 'Docker UI',
      items: [
        { type: 'doc', id: 'fusion/install/olake-ui/index', label: 'Docker Compose' },
        { type: 'doc', id: 'fusion/install/olake-ui/offline-environments-aws', label: 'Offline Environments (AWS)' },
        { type: 'doc', id: 'fusion/install/olake-ui/offline-environments-generic', label: 'Offline Environments (Generic)' },
      ],
    },
    { type: 'doc', id: 'fusion/install/kubernetes-compaction', label: 'Kubernetes/Helm' },

    // CORE CONCEPTS
    sectionHeader("Core Concepts"),
    { type: 'doc', id: 'fusion/core/architecture', label: 'Architecture' },
    { type: 'doc', id: 'fusion/core/compatibility/query-engines', label: 'Query Engines' },
    { type: 'doc', id: 'fusion/core/terminologies', label: 'Terminologies' },
    { type: 'doc', id: 'fusion/core/use-cases', label: 'Use Cases' },

    // COMMUNITY
    sectionHeader("Community"),
    { type: 'doc', id: 'fusion/community/contributing', label: 'Contributing' },
    { type: 'doc', id: 'fusion/community/issues-and-prs', label: 'How to Raise a PR' },
    { type: 'doc', id: 'fusion/community/code-of-conduct', label: 'Code of Conduct' },
    { type: 'doc', id: 'fusion/community/channels', label: 'Channels' },

    // RELEASE NOTES
    sectionHeader("Release Notes"),
    { type: 'doc', id: 'fusion/release/maintenance/overview', label: 'Start Here' },
    {
      type: 'category',
      label: 'Versions',
      items: [
        { type: 'doc', id: 'fusion/release/maintenance/v0.1.0', label: 'v0.1.0' },
      ],
    },
  ],
};

export default { ...docSidebar, ...fusionDocSidebar };