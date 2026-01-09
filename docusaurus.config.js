const imageFetchPriorityRehypePlugin = require('./src/plugins/image-fetchpriority-rehype-plugin');


// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Fastest Open Source Data Replication Tool',
  tagline: 'Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.',
  favicon: 'img/logo/olake-blue.svg',

  // Set the production url of your site here
  url: 'https://olake.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'datazip-inc', // Usually your GitHub org/user name.
  projectName: 'olake-docs', // Usually your repo name.
  deploymentBranch: 'master',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: true,

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  future: {
    v4: true,
    experimental_faster: true
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,

        theme: {
          customCss: './src/css/custom.css',
        },
        blog: false,


        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
          createSitemapItems: async (params) => {
            const { defaultCreateSitemapItems, ...rest } = params;
            const items = await defaultCreateSitemapItems(rest);
            return items.filter((item) => !item.url.includes('/page/'));
          },
        },
      })
      //  satisfies Preset.Options,
    ],
  ],



  scripts: [
    {
      src: '/font-loading-optimizer.js', // Load fonts after critical render path
      defer: true,
      fetchpriority: 'low'
    },
    {
      src: '/suppress-resize-observer.js', // Suppress ResizeObserver warnings
      defer: true,
      fetchpriority: 'high'
    },
    {
      src: '/ignore-resize-observer-error.js', // Suppress noisy ResizeObserver loop errors that Chrome prints
      defer: true,
      fetchpriority: 'high'
    },
    {
      src: '/message-listener.js', // path relative to the static directory
      defer: true, // if the script must be executed in order, set async to false
      fetchpriority: 'low'
    }
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/logo/olake-blue-with-text.webp',

      announcementBar: {
        id: 'monthly-events-2025',
        content: 'Monthly events are <a href="/webinar" class="text-white underline hover:text-black transition-colors duration-200" aria-label="View upcoming webinars" title="View upcoming webinars">here<span class="sr-only">View upcoming webinars</span></a>. Check out! 🎉',
        backgroundColor: '#193ae6',
        textColor: 'white',
        isCloseable: true,
      },

      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: true
        },
      },

      navbar: {
        hideOnScroll: false,
        // style: 'dark',
        title: '',
        logo: {
          alt: 'OLake Logo',
          src: 'img/logo/olake-blue-with-text.svg',
        },
        items: [
          { to: '/docs', label: 'Docs', position: 'right' },
          { to: '/ai-lake', label: 'AILake', position: 'right' },
          { to: '/blog', label: 'Blogs', position: 'right' },

          {
            // Dropdown menu in the navbar for "Iceberg" section
            type: "dropdown",
            position: "right",
            label: "Iceberg",
            items: [
              {
                label: "Iceberg Blogs",
                href: `/iceberg`,
              },
              {
                label: "Query Engine",
                href: `/iceberg/query-engine`,
              },
            ],
          },

          {
            // Dropdown menu in the navbar for "Learn" section
            type: "dropdown",
            position: "right",
            label: "Community",
            items: [
              {
                label: "Webinars & Events",
                href: `/webinar`,
              },
              {
                label: "OLake Community",
                href: `/community`,
              },
              {
                label: "Top Contributors",
                href: `/community/contributors`,
              },
              {
                label: "Contributor's Program",
                href: `/community/contributor-program`,
              },
            ],
          },

          { to: '/customer-stories', label: 'Customer Stories', position: 'right', activeBasePath: '/customer-stories' },

          {
            href: 'https://join.slack.com/t/getolake/shared_invite/zt-2uyphqf69-KQxih9Gwd4GCQRD_XFcuyw',
            position: 'right',
            className: 'header-slack-link',
          },
          {
            href: 'https://github.com/datazip-inc/olake',
            position: 'right',
            className: 'header-github-link',

          },
          {
            label: 'Talk to us',
            href: 'https://olake.io/#olake-form-product',
            position: 'right',
            className: 'dev-portal-signup dev-portal-link',
          },
        ],
      },

      metadata: [
        // { name: 'robots', content: 'noindex, nofollow' },
        { name: 'OLake', content: 'ETL tool, ELT tool, open source' },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@olake.io" },
        { name: "msvalidate.01", content: "C36AD97FE1CEDCD4041338A807D6BC4C" },
      ],
      headTags: [
          // Critical resource preloads for mobile performance
          {
            tagName: 'link',
            attributes: {
              rel: 'preload',
              href: '/img/logo/olake-blue-with-text.svg',
              as: 'image',
              type: 'image/svg+xml',
              fetchpriority: 'high'
            },
          },
          {
            tagName: 'link',
            attributes: {
              rel: 'preload',
              href: '/img/site/hero-section.svg',
              as: 'image',
              type: 'image/svg+xml',
              fetchpriority: 'high'
            },
        },
        // Font optimization - preconnect to Google Fonts
        {
          tagName: 'link',
          attributes: {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com',
          },
        },
        {
          tagName: 'link',
          attributes: {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: 'anonymous'
          },
        },
        // Minimal font optimization - only DNS prefetch for performance
        {
          tagName: 'link',
          attributes: {
            rel: 'dns-prefetch',
            href: 'https://fonts.googleapis.com'
          },
        },
         // DNS prefetch for external resources
        {
          tagName: 'link',
          attributes: {
            rel: 'dns-prefetch',
            href: 'https://js.hsforms.net'
          },
        },
        {
          tagName: 'link',
          attributes: {
            rel: 'dns-prefetch',
            href: 'https://www.google-analytics.com'
          },
        },
        {
          tagName: 'link',
          attributes: {
            rel: 'dns-prefetch',
            href: 'https://www.googletagmanager.com'
          },
        },
         // Preconnect to critical domains
        {
          tagName: 'link',
          attributes: {
            rel: 'preconnect',
            href: 'https://olake.io',
            crossorigin: 'anonymous'
          },
        },
        // Canonical URL - Removed hardcoded canonical tag
        // Docusaurus automatically generates proper canonical URLs for each page
        // OpenSearch meta tags
        {
          tagName: 'link',
          attributes: {
            rel: 'search',
            type: 'application/opensearchdescription+xml',
            title: 'OLake Documentation',
            href: '/opensearch.xml',
          },
        },
        // Enhanced Open Graph Meta Tags
        {
          tagName: 'meta',
          attributes: {
            property: 'og:type',
            content: 'website',
          },
        },
        {
          tagName: 'meta',
          attributes: {
            property: 'og:title',
            content: 'OLake - The Open Lakehouse Platform',
          },
        },
        {
          tagName: 'meta',
          attributes: {
            property: 'og:description',
            content: 'Fastest way to replicate MongoDB data in Apache Iceberg. Open-source data lakehouse platform for modern data engineering.',
          },
        },
        {
          tagName: 'meta',
          attributes: {
            property: 'og:image',
            content: 'https://olake.io/img/logo/olake-blue.webp',
          },
        },
        {
          tagName: 'meta',
          attributes: {
            property: 'og:site_name',
            content: 'OLake',
          },
        },
        {
          tagName: 'meta',
          attributes: {
            property: 'og:locale',
            content: 'en_US',
          },
        },
        // Enhanced Open Graph Meta Tags
        {
          tagName: 'meta',
          attributes: {
            property: 'og:image:type',
            content: 'image/webp',
          },
        },
        {
          tagName: 'meta',
          attributes: {
            property: 'og:image:width',
            content: '1200',
          },
        },
        {
          tagName: 'meta',
          attributes: {
            property: 'og:image:height',
            content: '630',
          },
        },
        // Enhanced Twitter Meta Tags
        {
          tagName: 'meta',
          attributes: {
            name: 'twitter:creator',
            content: '@_olake',
          },
        },
        {
          tagName: 'meta',
          attributes: {
            name: 'twitter:title',
            content: 'OLake - The Open Lakehouse Platform',
          },
        },
        {
          tagName: 'meta',
          attributes: {
            name: 'twitter:description',
            content: 'OLake is the fastest data replication platform, built to stream operational databases into Apache Iceberg in real time with full CDC, incremental sync, and zero-lag reliability.',
          },
        },
        {
          tagName: 'meta',
          attributes: {
            name: 'twitter:image',
            content: 'https://olake.io/img/logo/olake-blue.webp',
          },
        },
        {
          tagName: 'meta',
          attributes: {
            name: 'twitter:image:alt',
            content: 'OLake - The Open Lakehouse Platform',
          },
        },
        // Enhanced Twitter Meta Tags
        {
          tagName: 'meta',
          attributes: {
            name: 'twitter:label1',
            content: 'Written by',
          },
        },
        {
          tagName: 'meta',
          attributes: {
            name: 'twitter:data1',
            content: 'OLake Team',
          },
        },
        // Enhanced Bot Directives
        {
          tagName: 'meta',
          attributes: {
            name: 'robots',
            content: 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
          },
        },
        // Bing Webmaster Verification
        {
          tagName: 'meta',
          attributes: {
            name: 'msvalidate.01',
            content: 'C36AD97FE1CEDCD4041338A807D6BC4C',
          },
        },
        // Enhanced Favicon Support
        {
          tagName: 'link',
          attributes: {
            rel: 'icon',
            type: 'image/svg+xml',
            href: '/img/logo/olake-blue.svg',
          },
        }
      ],

      colorMode: {
        defaultMode: "light", // dark or light
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },

      imageZoom: {
        // CSS selector to apply the plugin to, defaults to '.markdown img'
        selector: '.markdown img',
        options: {
          margin: 24,
          background: '#000000',
        },
      },

      algolia: {
        // The application ID provided by Algolia
        appId: '1E406NO1AX',

        // Public API key: it is safe to commit it
        apiKey: 'e33125f9089a304cef5331a186931e48',

        indexName: 'olake',

        // Optional: see doc section below
        contextualSearch: true,


        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',

        // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
        insights: true,
      },


    }),

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],


  plugins: [
    'plugin-image-zoom',

    [
      './src/plugins/tailwind-config.js', {}
    ],

    [
      './src/plugins/indexnow/index.js', {}
    ],

    [
      'ideal-image',
      /** @type {import('@docusaurus/plugin-ideal-image').PluginOptions} */
      ({
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        // Use false to debug, but it incurs huge perf costs
        disableInDev: true
      })
    ],

    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'main-docs',             // must be unique
        path: 'docs',                // folder on disk
        routeBasePath: 'docs',       // URL => /docs/…
        sidebarPath: require.resolve('./sidebars.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        rehypePlugins: [imageFetchPriorityRehypePlugin],
        editUrl: 'https://github.com/datazip-inc/olake-docs/tree/master/',
      },
    ],

    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'iceberg-query-engine',
        path: 'docs-iceberg-query-engine',      // new folder on disk
        routeBasePath: 'iceberg/query-engine',  // final URL → /iceberg/query-engine/*
        sidebarPath: require.resolve('./sidebarsIcebergQE.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        editUrl: 'https://github.com/datazip-inc/olake-docs/tree/master/docs-iceberg-query-engine/',
      },
    ],

    [
      './src/plugins/blog-plugin',
      {
        path: 'blog',
        id: 'olake-blog',
        editLocalizedFiles: false,
        blogTitle: 'Blogs on OLake',
        blogDescription: '',
        blogSidebarCount: 'ALL',
        blogSidebarTitle: 'List blog',
        routeBasePath: 'blog',
        include: ['**/*.md', '**/*.mdx'],
        exclude: [
          '**/_*.{js,jsx,ts,tsx,md,mdx}',
          '**/_*/**',
          '**/*.test.{js,jsx,ts,tsx}',
          '**/__tests__/**',
          '**/customer-stories/**'
        ],
        postsPerPage: 6,
        truncateMarker: /<!--\s*(truncate)\s*-->/,
        showReadingTime: true,
        onUntruncatedBlogPosts: 'ignore',
        // Remove this to remove the "edit this page" links.
        editUrl:
          'https://github.com/datazip-inc/olake-docs/tree/master/',
        remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]],
        rehypePlugins: [imageFetchPriorityRehypePlugin],

      }
    ],

    [
      './src/plugins/blog-plugin',
      {
        path: 'iceberg',
        id: 'iceberg-blog',
        editLocalizedFiles: false,
        blogTitle: 'Blogs on Apache Iceberg',
        blogDescription: '',
        blogSidebarCount: 'ALL',
        blogSidebarTitle: 'List Iceberg blog',
        routeBasePath: 'iceberg',
        include: ['**/*.md', '**/*.mdx'],
        exclude: [
          '**/_*.{js,jsx,ts,tsx,md,mdx}',
          '**/_*/**',
          '**/*.test.{js,jsx,ts,tsx}',
          '**/__tests__/**'
        ],
        postsPerPage: 6,
        truncateMarker: /<!--\s*(truncate)\s*-->/,
        showReadingTime: true,
        onUntruncatedBlogPosts: 'ignore',
        // Remove this to remove the "edit this page" links.
        editUrl:
          'https://github.com/datazip-inc/olake-docs/tree/master/',
        remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]],
        rehypePlugins: [imageFetchPriorityRehypePlugin],

      }
    ],
    [
      './src/plugins/blog-plugin',
      {
        path: 'customer-stories',
        id: 'customer-stories-blog',
        editLocalizedFiles: false,
        blogTitle: 'Customer Stories',
        blogDescription: 'Customer success stories and case studies',
        blogSidebarCount: 'ALL',
        blogSidebarTitle: 'Customer Stories',
        routeBasePath: 'customer-stories',
        include: ['**/*.md', '**/*.mdx'],
        exclude: [
          '**/_*.{js,jsx,ts,tsx,md,mdx}',
          '**/_*/**',
          '**/*.test.{js,jsx,ts,tsx}',
          '**/__tests__/**'
        ],
        postsPerPage: 6,
        truncateMarker: /<!--\s*(truncate)\s*-->/,
        showReadingTime: true,
        onUntruncatedBlogPosts: 'ignore',
        editUrl:
          'https://github.com/datazip-inc/olake-docs/tree/master/',
        remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]],
        rehypePlugins: [imageFetchPriorityRehypePlugin],
      }
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        // Disable auto trailing-slash redirects to avoid conflicts with static servers
        // that force directory slashes 
        createRedirects() {
          return undefined;
        },
        redirects: [
          {
            to: '/docs/benchmarks?tab=mongodb',
            from: '/docs/connectors/mongodb/benchmarks',
          },
          {
            to: '/docs/benchmarks?tab=postgres',
            from: '/docs/connectors/postgres/benchmarks',
          },
          {
            to: '/docs/benchmarks?tab=mysql',
            from: '/docs/connectors/mysql/benchmarks',
          },
          {
            to: '/docs',
            from: '/olake/mongodb',
          },
          {
            to: '/docs',
            from: '/olake/mongodb/colake-connectors-for-olake',
          },
          {
            to: '/docs/core/state-controller',
            from: '/olake/mongodb/colake-state-management',
          },
          {
            to: '/docs/core/architecture',
            from: '/olake/mongodb/framework',
          },
          {
            to: '/docs/benchmarks?tab=mongodb',
            from: '/olake/mongodb/benchmark',
          },
          {
            to: '/docs/community/contributing',
            from: '/olake/mongodb/how-to-start-contributing-on-olake',
          },
          {
            to: '/docs/community/contributing',
            from: '/docs/olake/mongodb/how-to-start-contributing-on-olake',
          },
          {
            to: '/docs/connectors/mongodb/overview',
            from: '/olake/drivers/mongodb-poc',
          },
          {
            to: '/blog',
            from: '/blog/top-mongodb-etl-tools-a-comprehensive-guide-to-syncing-your-nosql-data',
          },
          {
            to: '/customer-stories',
            from: '/customers',
          },
          {
            to: '/customer-stories/cordial-real-time-data-sync',
            from: '/blog/customer-stories/cordial-real-time-data-sync',
          },
          {
            to: '/customer-stories/astro-talk-lakehouse-transformation',
            from: '/blog/customer-stories/astro-talk-lakehouse-transformation',
          },
          {
            to: '/docs/getting-started/quickstart',
            from: '/docs/getting-started/',
          },
          {
            to: '/docs',
            from: '/docs/',
          },
          {
            to: '/docs/getting-started/playground',
            from: '/docs/playground/olake-iceberg-presto',
          },
          {
            to: '/',
            from: '/iceberg/olake.io',
          },
          {
            to: '/',
            from: '/img/blog/2024/09/mongodb-etl-challenges-cover.webp',
          },
          {
            to: '/',
            from: '/img/blog/2024/11/issues-debezium-kafka-cover.webp',
          },
          {
            to: '/docs/writers/parquet/config',
            from: '/docs/configs/s3',
          },
          {
            to: '/docs',
            from: '/docs/category/tutorials/',
          },
          {
            to: '/blog/troubleshooting-common-issues-and-solutions-to-mongodb-etl-errors',
            from: '/blog/troubleshooting-common-issues-and-solutions-to-mongodb-etl-errors/',
          },
          {
            to: '/',
            from: '/docs/community/sheet',
          },
          {
            to: '/docs/writers/iceberg/catalog/overview',
            from: '/docs/writers/iceberg/config',
          },
          {
            to: '/docs/connectors/mongodb/setup/local',
            from: '/docs/connectors/mongodb/docker-compose',
          },
          {
            to: '/docs/connectors/postgres/setup/local',
            from: '/docs/connectors/postgres/docker-compose',
          },
          {
            to: '/docs/connectors/mysql/setup/local',
            from: '/docs/connectors/mysql/docker-compose',
          },
          {
            to: '/docs/writers/iceberg/overview',
            from: '/docs/category/apache-iceberg',
          },
          {
            to: '/docs/connectors/mongodb/overview',
            from: '/docs/category/mongodb',
          },

          {
            to: '/docs/connectors/postgres/overview',
            from: '/docs/category/postgres',
          },

          {
            to: '/docs/connectors/mysql/overview',
            from: '/docs/category/mysql',
          },

          {
            to: '/docs/getting-started/quickstart',
            from: '/docs/category/getting-started',
          },
          {
            to: '/docs/install/docker-cli',
            from: '/docs/install/docker',
          },
          {
            to: '/docs/install/docker-cli',
            from: '/docs/install/docker.mdx',
          },



          // recent destination doc re-structuring redirects

          {
            to: '/docs/writers/iceberg/azure',
            from: '/docs/writers/azure-adls/overview',
          },

          {
            to: '/docs/writers/iceberg/gcs',
            from: '/docs/writers/gcs/overview',
          },

          {
            to: '/docs/writers/parquet/s3',
            from: '/docs/writers/s3/overview',
          },

          {
            to: '/docs/writers/parquet/config',
            from: '/docs/writers/s3/config',
          },

          {
            to: '/docs/writers/parquet/partitioning',
            from: '/docs/writers/s3/partitioning',
          },

          {
            to: '/docs/writers/parquet/local',
            from: '/docs/writers/local',
          },


          // END

          // START - 404 redirects

          {
            to: '/docs/core/architecture',
            from: '/docs/category/understanding-olake',
          },

          {
            to: '/docs/features/overview',
            from: '/docs/category/features',
          },

          {
            to: '/docs/core/configs/catalog',
            from: '/docs/configs/catalog',
          },
          {
            to: '/blog/tags',
            from: '/blog/tags/nosql',
          },
          {
            to: '/docs/connectors/mongodb/config',
            from: '/docs/connectors/mongodb/catalog',
          },
          {
            to: '/docs/connectors/overview',
            from: '/docs/connectors/intro',
          },

          {
            to: '/iceberg/paimon-vs-iceberg',
            from: '/blog/paimon-vs-iceberg',
          },
          {
            to: '/docs/writers/parquet/s3',
            from: '/docs/category/aws-s3',
          },
          {
            to: '/docs/connectors/overview',
            from: '/docs/olake/drivers',
          },
          {
            to: '/docs/connectors/mongodb/overview',
            from: '/docs/olake/drivers/mongodb-poc',
          },
          {
            to: '/docs/connectors/mongodb/overview',
            from: '/docs/olake/mongodb/colake-connectors-for-olake',
          },
          {
            to: '/docs/core/configs/catalog',
            from: '/core/configs/catalog',
          },
          {
            to: '/docs/core/configs/source',
            from: '/core/configs/source',
          },
          {
            to: '/docs/core/configs/state',
            from: '/core/configs/state',
          },
          {
            to: '/docs/core/configs/writer',
            from: '/core/configs/writer',
          },
          {
            to: '/docs/writers/iceberg/catalog/overview',
            from: '/docs/category/catalogs',
          },
          {
            to: '/community',
            from: '/docs/category/community',
          },
          {
            to: '/docs/core/configs/source',
            from: '/docs/category/configurations',
          },
          {
            to: '/docs/community/contributing',
            from: '/docs/category/contributing',
          },
          {
            to: '/docs/core/architecture',
            from: '/docs/category/core',
          },
          {
            to: '/docs/writers/overview',
            from: '/docs/category/destinations-writers',
          },
          {
            to: '/docs/resources/olake-terminologies',
            from: '/docs/category/resources',
          },
          {
            to: '/docs/getting-started/quickstart',
            from: '/docs/category/setup',
          },
          {
            to: '/docs/getting-started/quickstart',
            from: '/docs/category/setup-1',
          },
          {
            to: '/docs/getting-started/quickstart',
            from: '/docs/category/setup-2',
          },
          {
            to: '/docs/connectors/overview',
            from: '/docs/category/sources',
          },
          {
            to: '/docs/connectors/overview',
            from: '/docs/category/sources-connectors',
          },
          {
            to: '/docs/writers/overview',
            from: '/docs/category/writers-destinations',
          },
          {
            to: '/docs/core/configs/source',
            from: '/docs/configs/source',
          },
          {
            to: '/docs/core/configs/state',
            from: '/docs/configs/state',
          },
          {
            to: '/docs/core/configs/writer',
            from: '/docs/configs/writer',
          },
          {
            to: '/docs/connectors/mongodb/config',
            from: '/docs/connectors/mongodb/state',
          },
          {
            to: '/docs/release/overview',
            from: '/docs/release-notes',
          },
          {
            to: '/docs',
            from: '/shared/commands/DockerDiscover',
          },
          {
            to: '/docs',
            from: '/shared/commands/DockerSync',
          },
          {
            to: '/docs',
            from: '/shared/commands/DockerSyncWithState',
          },
          {
            to: '/docs',
            from: '/shared/commands/LocalDiscover',
          },
          {
            to: '/docs',
            from: '/shared/commands/LocalSync',
          },
          {
            to: '/docs',
            from: '/shared/commands/LocalSyncWithState',
          },
          {
            to: '/docs',
            from: '/docs/troubleshooting',
          },

          {
            to: '/docs/writers/iceberg/catalog/overview',
            from: '/docs/writers/catalog/overview',
          },
          {
            to: '/docs/getting-started/quickstart',
            from: '/docs/writers/getting-started/overview',
          },
          {
            to: '/docs/writers/iceberg/overview',
            from: '/docs/writers/iceberg/',
          },
          {
            to: '/docs/writers/parquet/partitioning',
            from: '/docs/writers/parquet/s3/partitioning',
          },
          {
            to: '/docs/writers/parquet/s3',
            from: '/docs/writers/s3/',
          },

          // 404 redirects from Ahrefs audit (trailingSlash: true handles / automatically)
          {
            to: '/docs/writers/iceberg/catalog/glue/',
            from: '/docs/connectors/glue-catalog',
          },
          {
            to: '/docs/writers/iceberg/partitioning/',
            from: '/docs/understanding/iceberg-partitioning',
          },
          {
            to: '/docs/writers/iceberg/catalog/overview/',
            from: '/docs/connectors/iceberg',
          },
          {
            to: '/docs/install/docker-cli/',
            from: '/docs/getting-started/docker-cli',
          },
          {
            to: '/docs/install/docker-cli/',
            from: '/docs/getting-started/olake-cli',
          },
          {
            to: '/docs/connectors/overview/',
            from: '/docs/connectors',
          },

          // END
          // Note: Query parameter URLs (e.g., /docs/features?tab=schema) are handled
          // via canonical tags in the theme files, not through redirects

          {
            to: 'https://join.slack.com/t/getolake/shared_invite/zt-2uyphqf69-KQxih9Gwd4GCQRD_XFcuyw',
            from: '/slack',
          },
          {
            to: 'https://github.com/datazip-inc/olake',
            from: '/github',
          },
        ],
      },
    ],
    '@docusaurus/theme-live-codeblock',
  ],

  // Removed render-blocking stylesheets - fonts now loaded asynchronously via head tags
   
};

export default config;

