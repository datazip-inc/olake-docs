const imageFetchPriorityRehypePlugin = require('./src/plugins/image-fetchpriority-rehype-plugin')
const fs = require('fs')
const path = require('path')

/**
 * Latest OLake Go release, derived at build time from the release notes in
 * docs/release/ingestion. Those notes are the page the landing-page bulletin
 * card links to, so deriving from them keeps the label and the link in sync
 * automatically instead of hardcoding a version that goes stale.
 *
 * A note's title may cover a range ("OLake Go (v0.8.0 - v0.8.2)"), so the
 * displayed version is the LAST version mentioned in the newest note's title,
 * falling back to the filename.
 */
function getLatestOlakeRelease() {
  const dir = path.join(__dirname, 'docs/release/ingestion')
  const toParts = (v) => v.split('.').map(Number)
  const files = fs
    .readdirSync(dir)
    .map((f) => f.match(/^v(\d+\.\d+\.\d+)\.mdx$/))
    .filter(Boolean)
    .map((m) => ({ file: `v${m[1]}`, version: m[1] }))
    .sort((a, b) => {
      const [A, B] = [toParts(a.version), toParts(b.version)]
      return A[0] - B[0] || A[1] - B[1] || A[2] - B[2]
    })

  if (!files.length) return { version: '', label: 'OLake', docPath: '/docs/release/ingestion' }

  const newest = files[files.length - 1]
  let version = newest.version
  try {
    const title = fs
      .readFileSync(path.join(dir, `${newest.file}.mdx`), 'utf8')
      .match(/^title:\s*"?([^"\n]+)"?/m)
    const mentioned = title && title[1].match(/v(\d+\.\d+\.\d+)/g)
    if (mentioned && mentioned.length) version = mentioned[mentioned.length - 1].slice(1)
  } catch {
    /* fall back to the filename version */
  }
  return { version, label: `OLake v${version}`, docPath: `/docs/release/ingestion/${newest.file}` }
}

const latestOlakeRelease = getLatestOlakeRelease()

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Fastest Open Source Data Replication Tool',
  tagline:
    'Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.',
  favicon: 'img/logo/olake-blue.svg',

  // Exposed to components via useDocusaurusContext().siteConfig.customFields
  customFields: {
    latestOlakeVersion: latestOlakeRelease.version,
    latestOlakeReleaseLabel: latestOlakeRelease.label,
    latestOlakeReleasePath: latestOlakeRelease.docPath
  },

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
    locales: ['en']
  },

  future: {
    v4: true,
    experimental_faster: true
  },

  // Client modules for handling client-side functionality
  clientModules: [
    require.resolve('./src/clientModules/hashScroll.ts'),
    require.resolve('./src/clientModules/deferredGtag.ts')
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,

        theme: {
          customCss: './src/css/custom.css'
        },
        blog: false,

        // GA is loaded by src/clientModules/deferredGtag.ts instead of the preset, so the
        // 166KB script stays off the critical path. Re-enabling this would double-load it.
        gtag: undefined,

        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
          createSitemapItems: async (params) => {
            const { defaultCreateSitemapItems, ...rest } = params
            const items = await defaultCreateSitemapItems(rest)
            return items.filter((item) => !item.url.includes('/page/'))
          }
        }
      })
      //  satisfies Preset.Options,
    ]
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

  // Site-wide, non-per-page tags only. og:*/twitter:card/twitter:title/twitter:description/
  // twitter:image are owned per-page by src/theme/DocItem, BlogPostPage, BlogListPage and
  // src/pages/* — do not duplicate them here.
  headTags: [
    {
      tagName: 'meta',
      attributes: { name: 'msvalidate.01', content: 'C36AD97FE1CEDCD4041338A807D6BC4C' }
    },
    {
      tagName: 'meta',
      attributes: { name: 'twitter:site', content: '@_olake' }
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'robots',
        content: 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large'
      }
    },
    // Critical resource preloads for mobile performance
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        href: '/img/logo/olake-blue-with-text.svg',
        as: 'image',
        type: 'image/svg+xml',
        fetchpriority: 'high'
      }
    },
    // No preload for /img/site/hero-section.svg — it belonged to the v1 homepage and is
    // no longer rendered by any routed page, so preloading it cost 22KB at high priority
    // on every page for nothing. It is still referenced by JSON-LD in src/data/landing/seo.ts.
    // Preconnect to Google Fonts
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com'
      }
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous'
      }
    },
    // DNS prefetch for HubSpot forms
    {
      tagName: 'link',
      attributes: {
        rel: 'dns-prefetch',
        href: 'https://js.hsforms.net'
      }
    },
    // OpenSearch
    {
      tagName: 'link',
      attributes: {
        rel: 'search',
        type: 'application/opensearchdescription+xml',
        title: 'OLake Documentation',
        href: '/opensearch.xml'
      }
    }
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/logo/olake-blue-with-text.webp',

      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: true
        }
      },

      navbar: {
        hideOnScroll: false,
        // style: 'dark',
        title: '',
        logo: {
          alt: 'OLake Logo',
          src: 'img/logo/olake-blue-with-text.svg'
        },
        items: [
          {
            type: 'dropdown',
            position: 'left',
            label: 'Docs',
            activeBasePath: '/docs',
            items: [
              {
                label: 'OLake Go',
                to: '/docs',
                activeBaseRegex: '^/docs(?!/fusion)'
              },
              {
                label: 'OLake Fusion',
                to: '/docs/fusion/getting-started/overview',
                activeBaseRegex: '^/docs/fusion'
              }
            ]
          },
          { to: '/contact', label: 'Pricing', position: 'left' },
          { to: '/blog', label: 'Blogs', position: 'left' },

          {
            // Dropdown menu in the navbar for "Iceberg" section
            type: 'dropdown',
            position: 'left',
            label: 'Iceberg',
            items: [
              {
                label: 'Iceberg Blogs',
                href: `/iceberg`
              },
              {
                label: 'Query Engine',
                href: `/iceberg/query-engine`
              }
            ]
          },

          {
            // Dropdown menu in the navbar for "Learn" section
            type: 'dropdown',
            position: 'left',
            label: 'Community',
            items: [
              {
                label: 'Webinars & Events',
                href: `/webinar`
              },
              {
                label: 'OLake Community',
                href: `/community`
              },
              {
                label: 'Top Contributors',
                href: `/community/contributors`
              },
              {
                label: "Contributor's Program",
                href: `/community/contributor-program`
              },
              {
                label: 'GSoC',
                href: `/community/gsoc`
              }
            ]
          },

          {
            to: '/customer-stories',
            label: 'Customer Stories',
            position: 'left',
            activeBasePath: '/customer-stories'
          },

          {
            href: 'https://olake.io/slack',
            position: 'right',
            className: 'header-slack-link'
          },
          {
            href: 'https://github.com/datazip-inc/olake',
            position: 'right',
            className: 'header-github-link'
          },
          {
            label: 'Talk to us',
            href: '/contact',
            position: 'right',
            className: 'dev-portal-signup dev-portal-link'
          }
        ]
      },

      colorMode: {
        defaultMode: 'light', // dark or light
        disableSwitch: false,
        respectPrefersColorScheme: false
      },

      imageZoom: {
        // CSS selector to apply the plugin to, defaults to '.markdown img'
        selector: '.markdown img',
        options: {
          margin: 24,
          background: '#000000'
        }
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
        insights: true
      }
    }),

  markdown: {
    mermaid: true
  },
  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    'plugin-image-zoom',

    ['./src/plugins/tailwind-config.js', {}],

    ['./src/plugins/navbar-breakpoint/index.js', {}],

    ['./src/plugins/indexnow/index.js', {}],

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
        id: 'main-docs', // must be unique
        path: 'docs', // folder on disk
        routeBasePath: 'docs', // URL => /docs/…
        sidebarPath: require.resolve('./sidebars.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        rehypePlugins: [imageFetchPriorityRehypePlugin],
        editUrl: 'https://github.com/datazip-inc/olake-docs/tree/master/'
      }
    ],

    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'iceberg-query-engine',
        path: 'docs-iceberg-query-engine', // new folder on disk
        routeBasePath: 'iceberg/query-engine', // final URL → /iceberg/query-engine/*
        sidebarPath: require.resolve('./sidebarsIcebergQE.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        editUrl: 'https://github.com/datazip-inc/olake-docs/tree/master/docs-iceberg-query-engine/'
      }
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
          '**/__tests__/**'
        ],
        postsPerPage: 6,
        truncateMarker: /<!--\s*(truncate)\s*-->/,
        showReadingTime: true,
        onUntruncatedBlogPosts: 'ignore',
        // Remove this to remove the "edit this page" links.
        editUrl: 'https://github.com/datazip-inc/olake-docs/tree/master/',
        remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]],
        rehypePlugins: [imageFetchPriorityRehypePlugin]
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
        editUrl: 'https://github.com/datazip-inc/olake-docs/tree/master/',
        remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]],
        rehypePlugins: [imageFetchPriorityRehypePlugin]
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
        editUrl: 'https://github.com/datazip-inc/olake-docs/tree/master/',
        remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]],
        rehypePlugins: [imageFetchPriorityRehypePlugin]
      }
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        // Disable auto trailing-slash redirects to avoid conflicts with static servers
        // that force directory slashes
        createRedirects() {
          return undefined
        },
        redirects: [
          // Features page replaced by intro (intro.mdx has slug: / so it lives at /docs/)
          {
            to: '/docs/',
            from: '/docs/features'
          },
          // Fusion release notes moved to fusion/release/maintenance
          {
            to: '/docs/fusion/release/maintenance/overview',
            from: '/docs/release/maintenance/overview'
          },
          {
            to: '/docs/fusion/release/maintenance/v0.1.0',
            from: '/docs/release/maintenance/v0.1.0'
          },
          // Fusion maintenance pages moved from iceberg-maintenance to fusion/maintenance
          {
            to: '/docs/fusion/maintenance/catalogs',
            from: '/docs/iceberg-maintenance/catalogs'
          },
          {
            to: '/docs/fusion/maintenance/metrics',
            from: '/docs/iceberg-maintenance/metrics'
          },
          {
            to: '/docs/fusion/maintenance/runs-and-logs',
            from: '/docs/iceberg-maintenance/runs-and-logs'
          },
          // Fusion overview moved from iceberg-maintenance to fusion/getting-started
          {
            to: '/docs/fusion/getting-started/overview',
            from: [
              '/docs/iceberg-maintenance/overview',
              '/docs/iceberg-maintenance/compaction/overview',
              '/docs/iceberg-maintenance/optimisation/overview',
              '/docs/iceberg-maintenance/optimization/overview'
            ]
          },
          {
            to: '/docs/fusion/compaction/configuration',
            from: [
              '/docs/iceberg-maintenance/compaction/configuration',
              '/docs/iceberg-maintenance/optimisation/configuration',
              '/docs/iceberg-maintenance/optimization/configuration'
            ]
          },
          {
            to: '/docs/fusion/getting-started/configure-first-compaction',
            from: [
              '/docs/getting-started/configure-first-compaction',
              '/docs/getting-started/configure-first-optimisation',
              '/docs/getting-started/configure-first-optimization'
            ]
          },
          {
            to: '/docs/benchmarks/ingestion',
            from: '/docs/benchmarks'
          },
          {
            to: '/docs/fusion/getting-started/compaction',
            from: [
              '/docs/benchmarks/compaction',
              '/docs/benchmarks/optimisation',
              '/docs/benchmarks/optimization'
            ]
          },
          {
            to: '/docs/install/kubernetes',
            from: '/docs/install/kubernetes-ingestion'
          },
          {
            to: '/docs/fusion/install/kubernetes-compaction',
            from: [
              '/docs/install/kubernetes-compaction',
              '/docs/install/kubernetes-optimisation',
              '/docs/install/kubernetes-optimization'
            ]
          },
          // Legacy release-note URLs -> ingestion release notes
          {
            to: '/docs/release/ingestion/overview',
            from: '/docs/release/overview'
          },
          {
            to: '/docs/release/ingestion/v0.6.0',
            from: '/docs/release/v0.6.0'
          },
          {
            to: '/docs/release/ingestion/v0.5.0',
            from: '/docs/release/v0.5.0'
          },
          {
            to: '/docs/release/ingestion/v0.4.0',
            from: '/docs/release/v0.4.0'
          },
          {
            to: '/docs/release/ingestion/v0.3.17',
            from: '/docs/release/v0.3.17'
          },
          {
            to: '/docs/release/ingestion/v0.3.14',
            from: '/docs/release/v0.3.14'
          },
          {
            to: '/docs/release/ingestion/v0.3.9-v0.3.11',
            from: '/docs/release/v0.3.9-v0.3.11'
          },
          {
            to: '/docs/release/ingestion/v0.3.5',
            from: '/docs/release/v0.3.5'
          },
          {
            to: '/docs/release/ingestion/v0.2.10',
            from: '/docs/release/v0.2.10'
          },
          {
            to: '/docs/release/ingestion/v0.2.8',
            from: '/docs/release/v0.2.8'
          },
          {
            to: '/docs/release/ingestion/v0.2.5-v0.2.7',
            from: '/docs/release/v0.2.5-v0.2.7'
          },
          {
            to: '/docs/release/ingestion/v0.2.2-v0.2.4',
            from: '/docs/release/v0.2.2-v0.2.4'
          },
          {
            to: '/docs/release/ingestion/v0.2.0-v0.2.1',
            from: '/docs/release/v0.2.0-v0.2.1'
          },
          {
            to: '/docs/release/ingestion/v0.1.9-v0.1.11',
            from: '/docs/release/v0.1.9-v0.1.11'
          },
          {
            to: '/docs/release/ingestion/v0.1.6-v0.1.8',
            from: '/docs/release/v0.1.6-v0.1.8'
          },
          {
            to: '/docs/release/ingestion/v0.1.2-v0.1.5',
            from: '/docs/release/v0.1.2-v0.1.5'
          },
          {
            to: '/docs/release/ingestion/v0.1.0-v0.1.1',
            from: '/docs/release/v0.1.0-v0.1.1'
          },

          {
            to: '/docs/benchmarks/ingestion?tab=mongodb',
            from: '/docs/connectors/mongodb/benchmarks'
          },
          {
            to: '/docs/benchmarks/ingestion?tab=postgres',
            from: '/docs/connectors/postgres/benchmarks'
          },
          {
            to: '/docs/benchmarks/ingestion?tab=mysql',
            from: '/docs/connectors/mysql/benchmarks'
          },
          {
            to: '/docs',
            from: '/olake/mongodb'
          },
          {
            to: '/docs',
            from: '/olake/mongodb/colake-connectors-for-olake'
          },
          {
            to: '/docs/core/state-controller',
            from: '/olake/mongodb/colake-state-management'
          },
          {
            to: '/docs/core/architecture',
            from: '/olake/mongodb/framework'
          },
          {
            to: '/docs/benchmarks/ingestion?tab=mongodb',
            from: '/olake/mongodb/benchmark'
          },
          {
            to: '/docs/community/contributing',
            from: '/olake/mongodb/how-to-start-contributing-on-olake'
          },
          {
            to: '/docs/community/contributing',
            from: '/docs/olake/mongodb/how-to-start-contributing-on-olake'
          },
          {
            to: '/docs/connectors/mongodb/overview',
            from: '/olake/drivers/mongodb-poc'
          },
          {
            to: '/blog',
            from: '/blog/top-mongodb-etl-tools-a-comprehensive-guide-to-syncing-your-nosql-data'
          },
          {
            to: '/customer-stories',
            from: '/customers'
          },
          {
            to: '/customer-stories/cordial-real-time-data-sync',
            from: '/blog/customer-stories/cordial-real-time-data-sync'
          },
          {
            to: '/customer-stories/astro-talk-lakehouse-transformation',
            from: '/blog/customer-stories/astro-talk-lakehouse-transformation'
          },
          {
            to: '/docs/getting-started/quickstart',
            from: '/docs/getting-started/'
          },
          {
            to: '/docs',
            from: '/docs/'
          },
          {
            to: '/docs/getting-started/playground',
            from: '/docs/playground/olake-iceberg-presto'
          },
          {
            to: '/',
            from: '/iceberg/olake.io'
          },
          {
            to: '/',
            from: '/img/blog/2024/09/mongodb-etl-challenges-cover.webp'
          },
          {
            to: '/',
            from: '/img/blog/2024/11/issues-debezium-kafka-cover.webp'
          },
          {
            to: '/docs/writers/parquet/config',
            from: '/docs/configs/s3'
          },
          {
            to: '/docs',
            from: '/docs/category/tutorials/'
          },
          {
            to: '/blog/troubleshooting-common-issues-and-solutions-to-mongodb-etl-errors',
            from: '/blog/troubleshooting-common-issues-and-solutions-to-mongodb-etl-errors/'
          },
          {
            to: '/',
            from: '/docs/community/sheet'
          },
          {
            to: '/docs/writers/iceberg/catalog/overview',
            from: '/docs/writers/iceberg/config'
          },
          {
            to: '/docs/connectors/mongodb/setup/local',
            from: '/docs/connectors/mongodb/docker-compose'
          },
          {
            to: '/docs/connectors/postgres/setup/local',
            from: '/docs/connectors/postgres/docker-compose'
          },
          {
            to: '/docs/connectors/mysql/setup/local',
            from: '/docs/connectors/mysql/docker-compose'
          },
          {
            to: '/docs/writers/iceberg/overview',
            from: '/docs/category/apache-iceberg'
          },
          {
            to: '/docs/connectors/mongodb/overview',
            from: '/docs/category/mongodb'
          },

          {
            to: '/docs/connectors/postgres/overview',
            from: '/docs/category/postgres'
          },

          {
            to: '/docs/connectors/mysql/overview',
            from: '/docs/category/mysql'
          },

          {
            to: '/docs/getting-started/quickstart',
            from: '/docs/category/getting-started'
          },
          {
            to: '/docs/install/docker-cli',
            from: '/docs/install/docker'
          },
          {
            to: '/docs/install/docker-cli',
            from: '/docs/install/docker.mdx'
          },

          // recent destination doc re-structuring redirects

          {
            to: '/docs/writers/iceberg/azure',
            from: '/docs/writers/azure-adls/overview'
          },

          {
            to: '/docs/writers/iceberg/gcs',
            from: '/docs/writers/gcs/overview'
          },

          {
            to: '/docs/writers/parquet/s3',
            from: '/docs/writers/s3/overview'
          },

          {
            to: '/docs/writers/parquet/config',
            from: '/docs/writers/s3/config'
          },

          {
            to: '/docs/writers/parquet/partitioning',
            from: '/docs/writers/s3/partitioning'
          },

          {
            to: '/docs/writers/parquet/local',
            from: '/docs/writers/local'
          },

          // END

          // START - 404 redirects

          {
            to: '/docs/core/architecture',
            from: '/docs/category/understanding-olake'
          },

          {
            to: '/docs/features/overview',
            from: '/docs/category/features'
          },

          {
            to: '/docs/core/configs/catalog',
            from: '/docs/configs/catalog'
          },
          {
            to: '/blog/tags',
            from: '/blog/tags/nosql'
          },
          {
            to: '/docs/connectors/mongodb/config',
            from: '/docs/connectors/mongodb/catalog'
          },
          {
            to: '/docs/connectors/overview',
            from: '/docs/connectors/intro'
          },

          {
            to: '/iceberg/paimon-vs-iceberg',
            from: '/blog/paimon-vs-iceberg'
          },
          {
            to: '/docs/writers/parquet/s3',
            from: '/docs/category/aws-s3'
          },
          {
            to: '/docs/connectors/overview',
            from: '/docs/olake/drivers'
          },
          {
            to: '/docs/connectors/mongodb/overview',
            from: '/docs/olake/drivers/mongodb-poc'
          },
          {
            to: '/docs/connectors/mongodb/overview',
            from: '/docs/olake/mongodb/colake-connectors-for-olake'
          },
          {
            to: '/docs/core/configs/catalog',
            from: '/core/configs/catalog'
          },
          {
            to: '/docs/core/configs/source',
            from: '/core/configs/source'
          },
          {
            to: '/docs/core/configs/state',
            from: '/core/configs/state'
          },
          {
            to: '/docs/core/configs/writer',
            from: '/core/configs/writer'
          },
          {
            to: '/docs/writers/iceberg/catalog/overview',
            from: '/docs/category/catalogs'
          },
          {
            to: '/community',
            from: '/docs/category/community'
          },
          {
            to: '/docs/core/configs/source',
            from: '/docs/category/configurations'
          },
          {
            to: '/docs/community/contributing',
            from: '/docs/category/contributing'
          },
          {
            to: '/docs/core/architecture',
            from: '/docs/category/core'
          },
          {
            to: '/docs/writers/overview',
            from: '/docs/category/destinations-writers'
          },
          {
            to: '/docs/resources/olake-terminologies',
            from: '/docs/category/resources'
          },
          {
            to: '/docs/getting-started/quickstart',
            from: '/docs/category/setup'
          },
          {
            to: '/docs/getting-started/quickstart',
            from: '/docs/category/setup-1'
          },
          {
            to: '/docs/getting-started/quickstart',
            from: '/docs/category/setup-2'
          },
          {
            to: '/docs/connectors/overview',
            from: '/docs/category/sources'
          },
          {
            to: '/docs/connectors/overview',
            from: '/docs/category/sources-connectors'
          },
          {
            to: '/docs/writers/overview',
            from: '/docs/category/writers-destinations'
          },
          {
            to: '/docs/core/configs/source',
            from: '/docs/configs/source'
          },
          {
            to: '/docs/core/configs/state',
            from: '/docs/configs/state'
          },
          {
            to: '/docs/core/configs/writer',
            from: '/docs/configs/writer'
          },
          {
            to: '/docs/connectors/mongodb/config',
            from: '/docs/connectors/mongodb/state'
          },
          {
            to: '/docs/release/ingestion/overview',
            from: '/docs/release-notes'
          },
          {
            to: '/docs',
            from: '/shared/commands/DockerDiscover'
          },
          {
            to: '/docs',
            from: '/shared/commands/DockerSync'
          },
          {
            to: '/docs',
            from: '/shared/commands/DockerSyncWithState'
          },
          {
            to: '/docs',
            from: '/shared/commands/LocalDiscover'
          },
          {
            to: '/docs',
            from: '/shared/commands/LocalSync'
          },
          {
            to: '/docs',
            from: '/shared/commands/LocalSyncWithState'
          },
          {
            to: '/docs',
            from: '/docs/troubleshooting'
          },

          {
            to: '/docs/writers/iceberg/catalog/overview',
            from: '/docs/writers/catalog/overview'
          },
          {
            to: '/docs/getting-started/quickstart',
            from: '/docs/writers/getting-started/overview'
          },
          {
            to: '/docs/writers/iceberg/overview',
            from: '/docs/writers/iceberg/'
          },
          {
            to: '/docs/writers/parquet/partitioning',
            from: '/docs/writers/parquet/s3/partitioning'
          },
          {
            to: '/docs/writers/parquet/s3',
            from: '/docs/writers/s3/'
          },
          {
            to: '/docs/writers/iceberg/catalog/glue/',
            from: '/docs/connectors/glue-catalog'
          },
          {
            to: '/docs/writers/iceberg/partitioning/',
            from: '/docs/understanding/iceberg-partitioning'
          },
          {
            to: '/docs/writers/iceberg/catalog/overview/',
            from: '/docs/connectors/iceberg'
          },
          {
            to: '/docs/install/docker-cli/',
            from: '/docs/getting-started/docker-cli'
          },
          {
            to: '/docs/install/docker-cli/',
            from: '/docs/getting-started/olake-cli'
          },
          {
            to: '/docs/connectors/overview/',
            from: '/docs/connectors'
          },
          {
            to: '/docs/core/configs/catalog/',
            from: '/iceberg/docs/core/configs/catalog/'
          },
          {
            to: '/docs/connectors/oracle#configuration',
            from: '/docs/writers/connectors/oracle/config/'
          },
          {
            to: '/docs/connectors/mongodb#configuration',
            from: '/docs/core/connectors/mongodb/config/'
          },
          {
            to: '/docs/connectors/oracle#configuration',
            from: '/docs/core/connectors/oracle/config/'
          },
          {
            to: '/docs/writers/iceberg/catalog/glue/',
            from: '/iceberg/docs/writers/iceberg/catalog/glue/'
          },
          {
            to: '/docs/connectors/overview/',
            from: '/docs/writers/connectors/overview/'
          },
          {
            to: '/docs/writers/parquet/partitioning/',
            from: '/docs/writers/parquet/parquet/partitioning/'
          },
          {
            to: '/docs/writers/iceberg/overview/',
            from: '/docs/writers/parquet/iceberg/overview/'
          },
          {
            to: '/docs/writers/overview/',
            from: '/docs/connectors/writers/overview/'
          },
          {
            to: '/docs/connectors/mysql#configuration',
            from: '/docs/core/connectors/mysql/config/'
          },
          {
            to: '/docs/writers/iceberg/catalog/glue/',
            from: '/writers/iceberg/catalog/glue/'
          },
          {
            to: '/docs/writers/parquet/gcs/',
            from: '/docs/writers/parquet/gcs/config/'
          },
          {
            to: '/docs/writers/iceberg/catalog/overview/',
            from: '/docs/core/writers/iceberg/catalog/overview/'
          },
          {
            to: '/docs/connectors/mysql#configuration',
            from: '/docs/writers/connectors/mysql/config/'
          },
          {
            to: '/docs/writers/parquet/s3/',
            from: '/docs/writers/writers/parquet/s3/'
          },
          {
            to: '/docs/connectors/postgres#configuration',
            from: '/iceberg/docs/connectors/postgres/config/'
          },
          {
            to: '/docs/writers/iceberg/catalog/overview/',
            from: '/iceberg/docs/writers/iceberg/catalog/overview/'
          },
          {
            to: '/docs/connectors/mongodb#configuration',
            from: '/docs/writers/connectors/mongodb/config/'
          },
          {
            to: '/docs/connectors/postgres#configuration',
            from: '/docs/core/connectors/postgres/config/'
          },
          {
            to: '/docs/jobs/overview/',
            from: '/docs/writers/jobs/overview/'
          },
          {
            to: '/docs/connectors/postgres#configuration',
            from: '/docs/writers/connectors/postgres/config/'
          },
          {
            to: '/docs/getting-started/quickstart/',
            from: '/docs/connectors/getting-started/olake-ui/'
          },
          {
            to: 'https://github.com/datazip-inc/olake',
            from: '/github'
          }
        ]
      }
    ],
    '@docusaurus/theme-live-codeblock'
  ]

  // Removed render-blocking stylesheets - fonts now loaded asynchronously via head tags
}

export default config
