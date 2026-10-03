const imageFetchPriorityRehypePlugin = require('./src/plugins/image-fetchpriority-rehype-plugin')
const imageDimensionsRemarkPlugin = require('./src/plugins/image-dimensions-remark-plugin')
const releaseNotesRemarkPlugin = require('./src/plugins/release-notes-remark-plugin')
const fs = require('fs')
const path = require('path')

// Content problems (broken links/anchors, duplicate routes, undefined tags) fail the build in CI
// (GitHub Actions sets CI=true) so they are caught on the PR, but only warn locally so dev
// servers and half-finished edits keep working.
const ON_CONTENT_ERROR = process.env.CI ? 'throw' : 'warn'

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
  title: 'OLake',
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

  onBrokenLinks: ON_CONTENT_ERROR,
  onBrokenAnchors: ON_CONTENT_ERROR,
  onDuplicateRoutes: ON_CONTENT_ERROR,
  trailingSlash: true,

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  future: {
    // All Docusaurus v4 behaviours. This includes strict MDX (mdx1CompatDisabledByDefault), so
    // content must use MDX 3 syntax: `{/* comments */}`, `## Title {/* #id */}` heading ids and
    // `:::note[Title]` admonition titles. The legacy forms (`<!-- -->`, `{#id}`, `:::note Title`)
    // no longer compile. Also namespaces browser storage keys (siteStorageNamespacing), so each
    // visitor's saved theme preference resets once.
    v4: true,
    // Renamed from `experimental_faster` in 3.10 (the old key is now a hard config error).
    faster: true
  },

  // Client modules for handling client-side functionality
  clientModules: [
    require.resolve('./src/clientModules/hashScroll.ts'),
    // Smooth (animated) scrolling for in-page links only; honours reduced motion
    require.resolve('./src/clientModules/smoothAnchors.ts'),
    // Image fade-in, theme-toggle fade and navbar scroll shadow (all honour reduced motion)
    require.resolve('./src/clientModules/imageFade.ts'),
    require.resolve('./src/clientModules/uiFeel.ts'),
    require.resolve('./src/clientModules/deferredGtag.ts'),
    require.resolve('./src/clientModules/deferredReo.ts'),
    require.resolve('./src/clientModules/deferredPosthog.ts'),
    // Click-to-zoom on content images (replaced the unmaintained plugin-image-zoom package)
    require.resolve('./src/clientModules/imageZoom.ts'),
    // Keyboard access to tables that scroll sideways (tabindex + label, only when they overflow)
    require.resolve('./src/clientModules/tableScroll.ts')
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,

        theme: {
          // fonts.css: self-hosted @font-face rules. tokens.css: design tokens and the Infima/shadcn bridges.
          // Both must load before custom.css.
          customCss: ['./src/css/fonts.css', './src/css/tokens.css', './src/css/custom.css', './src/css/docs-content.css', './src/css/blog.css', './src/css/content-elements.css', './src/css/code-search.css', './src/css/motion.css', './src/css/typography.css', './src/css/print.css']
        },
        blog: false,

        // GA is loaded by src/clientModules/deferredGtag.ts instead of the preset, so the
        // 166KB script stays off the critical path. Re-enabling this would double-load it.
        gtag: undefined,

        sitemap: {
          lastmod: 'date',
          // changefreq/priority are ignored by Google, so they are left at the plugin defaults.
          // The patterns must be prefixed with /** because tags, authors and archive pages live
          // under each blog instance (/blog/tags, /iceberg/tags, /customer-stories/tags, ...).
          ignorePatterns: [
            '/**/tags/**',
            '/**/authors/**',
            // Blog archive pages only. A broader /**/archive/** would also hide /docs/archive/.
            '/blog/archive/**',
            '/iceberg/archive/**',
            '/customer-stories/archive/**',
            '/search/**',
            '/docs/shared/**',
            '/webinar/**-confirmation/**',
            // Redirect-only pages (they forward to an external URL, so they cannot be client redirects)
            '/slack',
            '/slack/',
            '/slack-archive',
            '/slack-archive/'
          ],
          filename: 'sitemap.xml',
          createSitemapItems: async (params) => {
            const { defaultCreateSitemapItems, ...rest } = params
            const items = await defaultCreateSitemapItems(rest)
            // Skip paginated listings (/page/2, /authors/akshay/authors/2) and the redirect-only
            // roadmap stub (it forwards to GitHub, so it cannot be a client redirect)
            return items.filter(
              (item) =>
                !item.url.includes('/page/') &&
                !/\/authors\/[^/]+\/authors\/\d+/.test(item.url) &&
                !/\/docs\/roadmap\/?$/.test(item.url)
            )
          }
        }
      })
      //  satisfies Preset.Options,
    ]
  ],

  scripts: [
    {
      // Suppresses the benign ResizeObserver loop error. Not render-critical, so it must not
      // compete with the LCP image at high priority (it used to, as two separate scripts).
      src: '/ignore-resize-observer-error.js',
      defer: true,
      fetchpriority: 'low'
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
    // No global robots meta: Docusaurus already emits the right one per page, and a site-wide
    // "index" tag contradicted the per-page noindex on paginated lists, /search/ and 404.
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
    // Fonts are self-hosted (src/css/fonts.css, static/fonts). Geist is the text font of every page,
    // so it is preloaded and does not wait for the stylesheet to discover it.
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        href: '/fonts/geist-latin-wght-normal.woff2',
        as: 'font',
        type: 'font/woff2',
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
    }
    // No OpenSearch <link> here: the Algolia theme already emits
    // <link rel="search" href="/opensearch.xml"> on every page, so a second one was a duplicate.
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      // Default share card (1200x630) for any page that does not set its own image
      image: 'img/logo/olake-og-card.png',

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
        // The navbar is rendered by src/theme/Navbar/Content from components/landing/chrome/navItems.ts.
        // This list is not displayed, but must stay non-empty: theme-common turns the mobile
        // burger (and with it the docs sidebar drawer) off when navbar.items is empty. The check lives
        // in the unexported context of NavbarMobileSidebarProvider (theme-common
        // contexts/navbarMobileSidebar.js), so a wrapper cannot override it; keep this item.
        items: [{ to: '/docs', label: 'Docs', position: 'left' }]
      },

      colorMode: {
        defaultMode: 'light', // dark or light
        disableSwitch: false,
        respectPrefersColorScheme: false
      },

      // The default Prism bundle has no bash/java/etc., so those fences rendered unhighlighted.
      prism: {
        theme: require('./src/theme/prism/olake-light'),
        darkTheme: require('./src/theme/prism/olake-dark'),
        additionalLanguages: ['bash', 'java', 'properties', 'ini', 'docker', 'protobuf']
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
    mermaid: true,
    hooks: {
      // Moved here from the deprecated top-level `onBrokenMarkdownLinks`
      onBrokenMarkdownLinks: ON_CONTENT_ERROR
    }
  },
  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    ['./src/plugins/tailwind-config.js', {}],

    ['./src/plugins/navbar-breakpoint/index.js', {}],

    ['./src/plugins/indexnow/index.js', {}],

    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'main-docs', // must be unique
        path: 'docs', // folder on disk
        routeBasePath: 'docs', // URL => /docs/…
        // docs/shared holds reusable MDX snippets that other pages import. Keep them out of the
        // docs build so they are not published (or listed in the sitemap) as standalone pages.
        exclude: [
          '**/_*.{js,jsx,ts,tsx,md,mdx}',
          '**/_*/**',
          '**/*.test.{js,jsx,ts,tsx}',
          '**/__tests__/**',
          'shared/**',
          // Internal pages that must not be published as routes
          'drafts/**'
        ],
        sidebarPath: require.resolve('./sidebars.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        // Adds width/height to local images so they reserve space (no layout shift); the release notes
        // plugin strips emoji from docs/release headings and keeps their ids
        beforeDefaultRemarkPlugins: [imageDimensionsRemarkPlugin, releaseNotesRemarkPlugin],
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
        beforeDefaultRemarkPlugins: [imageDimensionsRemarkPlugin],
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
        // Real last-modified dates (from git) for the sitemap lastmod and the page metadata
        showLastUpdateTime: true,
        editLocalizedFiles: false,
        blogTitle: 'Blogs on OLake',
        // Distinct per-blog feed titles; all three feeds used to be titled just "OLake".
        feedOptions: { title: 'Blogs on OLake' },
        blogDescription:
          'Engineering posts from the OLake team on database replication, CDC, Apache Iceberg, lakehouse tooling and OLake release news.',
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
        // Tags used in a post but missing from this instance's tags.yml
        onInlineTags: ON_CONTENT_ERROR,
        // Remove this to remove the "edit this page" links.
        editUrl: 'https://github.com/datazip-inc/olake-docs/tree/master/',
        remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]],
        rehypePlugins: [imageFetchPriorityRehypePlugin],
        // Adds width/height to local images so they reserve space (no layout shift)
        beforeDefaultRemarkPlugins: [imageDimensionsRemarkPlugin]
      }
    ],

    [
      './src/plugins/blog-plugin',
      {
        path: 'iceberg',
        id: 'iceberg-blog',
        // Real last-modified dates (from git) for the sitemap lastmod and the page metadata
        showLastUpdateTime: true,
        editLocalizedFiles: false,
        blogTitle: 'Blogs on Apache Iceberg',
        feedOptions: { title: 'Blogs on Apache Iceberg' },
        blogDescription:
          'Guides on Apache Iceberg: table format internals, catalogs, partitioning, query engines and how to replicate databases into Iceberg.',
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
        // Tags used in a post but missing from this instance's tags.yml
        onInlineTags: ON_CONTENT_ERROR,
        // Remove this to remove the "edit this page" links.
        editUrl: 'https://github.com/datazip-inc/olake-docs/tree/master/',
        remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]],
        rehypePlugins: [imageFetchPriorityRehypePlugin],
        // Adds width/height to local images so they reserve space (no layout shift)
        beforeDefaultRemarkPlugins: [imageDimensionsRemarkPlugin]
      }
    ],
    [
      './src/plugins/blog-plugin',
      {
        path: 'customer-stories',
        id: 'customer-stories-blog',
        // Real last-modified dates (from git) for the sitemap lastmod and the page metadata
        showLastUpdateTime: true,
        editLocalizedFiles: false,
        blogTitle: 'Customer Stories',
        feedOptions: { title: 'OLake Customer Stories' },
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
        // Tags used in a post but missing from this instance's tags.yml
        onInlineTags: ON_CONTENT_ERROR,
        editUrl: 'https://github.com/datazip-inc/olake-docs/tree/master/',
        remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]],
        rehypePlugins: [imageFetchPriorityRehypePlugin],
        // Adds width/height to local images so they reserve space (no layout shift)
        beforeDefaultRemarkPlugins: [imageDimensionsRemarkPlugin]
      }
    ],
    [
      // Local wrapper around @docusaurus/plugin-client-redirects: keeps the trailing slash in front
      // of #anchor / ?query targets, which Docusaurus strips (see src/plugins/client-redirects-slash)
      './src/plugins/client-redirects-slash/index.js',
      {
        // Disable auto trailing-slash redirects to avoid conflicts with static servers
        // that force directory slashes
        createRedirects() {
          return undefined
        },
        redirects: [
          // /ai-lake was a client-side redirect page to /contact/; now a real redirect (not in the sitemap)
          { to: '/contact', from: '/ai-lake' },
          // URLs that still get search traffic (Search Console) but had no redirect
          // Author pages removed for authors without posts
          { to: '/blog/authors', from: '/blog/authors/aakash' },
          { to: '/blog/authors', from: '/blog/authors/pavan' },
          { to: '/blog/authors', from: '/blog/authors/arsham' },
          { to: '/iceberg/authors', from: '/iceberg/authors/ankit' },
          // Duplicate blog tags merged into one each (apache-iceberg -> iceberg, data-lake -> lake)
          { to: '/blog/tags/iceberg', from: '/blog/tags/apache-iceberg' },
          { to: '/blog/tags/lake', from: '/blog/tags/data-lake' },
          // Blog tags that no post uses any more: send them to the nearest tag page that exists
          {
            to: '/blog/tags/compaction',
            from: [
              '/blog/tags/binpack-compaction',
              '/blog/tags/sort-compaction',
              '/blog/tags/manifest-rewrite'
            ]
          },
          { to: '/blog/tags/metadata', from: '/blog/tags/metadata-optimization' },
          { to: '/blog/tags/iceberg-maintenance', from: '/blog/tags/iceberg-tables' },
          // Old author-page pagination (/blog/authors/<author>/authors/N) now lives at /page/N
          { to: '/blog/authors/akshay/page/2', from: '/blog/authors/akshay/authors/2' },
          { to: '/blog/authors/anshika/page/2', from: '/blog/authors/anshika/authors/2' },
          { to: '/blog/authors/anshika/page/3', from: '/blog/authors/anshika/authors/3' },
          { to: '/blog/authors/nayan/page/2', from: '/blog/authors/nayan/authors/2' },
          { to: '/blog/authors/priyansh/page/2', from: '/blog/authors/priyansh/authors/2' },
          { to: '/blog/authors/shruti/page/2', from: '/blog/authors/shruti/authors/2' },
          // Tag pages that Google still knows under /blog/tags but that live in customer stories
          {
            to: '/customer-stories/tags/data-sync',
            from: '/blog/tags/data-sync'
          },
          {
            to: '/customer-stories/tags/customer-stories',
            from: '/blog/tags/customer-stories'
          },
          {
            to: '/customer-stories/tags/b2b',
            from: '/blog/tags/b2b'
          },
          {
            to: '/customer-stories/tags/customers',
            from: '/blog/tags/customers'
          },
          {
            to: '/blog/tags',
            from: ['/blog/tags/geography', '/blog/tags/g-rpc']
          },
          {
            to: '/docs/fusion/release/maintenance/v0.1.0',
            from: '/docs/release/optimization/v0.1.0'
          },
          {
            to: '/blog/apache-iceberg-metadata-explained',
            from: '/blog/2025/10/03/iceberg-metadata'
          },
          {
            to: '/docs/install/olake-ui/offline-environments-generic',
            from: '/docs/install/olake-ui/offline-environments'
          },
          {
            to: '/docs/release/ingestion/28-04-2025',
            from: '/docs/release/28-04-2025'
          },
          // Stub pages that used a meta-refresh .mdx file, now real redirects
          {
            to: '/docs/connectors/mongodb/#configuration',
            from: '/docs/connectors/mongodb/config'
          },
          {
            to: '/docs/connectors/mongodb',
            from: '/docs/connectors/mongodb/overview'
          },
          {
            to: '/docs/connectors/mongodb/#troubleshooting',
            from: '/docs/connectors/mongodb/troubleshooting'
          },
          {
            to: '/docs/connectors/mysql/#configuration',
            from: '/docs/connectors/mysql/config'
          },
          {
            to: '/docs/connectors/mysql',
            from: '/docs/connectors/mysql/overview'
          },
          {
            to: '/docs/connectors/mysql/#troubleshooting',
            from: '/docs/connectors/mysql/troubleshooting'
          },
          {
            to: '/docs/connectors/oracle/#configuration',
            from: '/docs/connectors/oracle/config'
          },
          {
            to: '/docs/connectors/oracle',
            from: '/docs/connectors/oracle/overview'
          },
          {
            to: '/docs/connectors/oracle/#troubleshooting',
            from: '/docs/connectors/oracle/troubleshooting'
          },
          {
            to: '/docs/connectors/postgres/#configuration',
            from: '/docs/connectors/postgres/config'
          },
          {
            to: '/docs/connectors/postgres',
            from: '/docs/connectors/postgres/overview'
          },
          {
            to: '/docs/connectors/postgres/#troubleshooting',
            from: '/docs/connectors/postgres/troubleshooting'
          },
          {
            to: '/docs/connectors/s3/#configuration',
            from: '/docs/connectors/s3/config'
          },
          {
            to: '/docs/connectors/s3',
            from: '/docs/connectors/s3/overview'
          },
          {
            to: '/docs/connectors/s3/#troubleshooting',
            from: '/docs/connectors/s3/troubleshooting'
          },
          {
            to: '/docs/install/docker-cli/#discover-command',
            from: '/docs/core/cli'
          },
          {
            to: '/docs/install/docker-cli/#sync',
            from: '/docs/core/state-controller'
          },
          {
            to: '/docs/install/docker-cli/#logs',
            from: '/docs/features/logs'
          },
          {
            to: '/docs/connectors/mongodb/setup/local',
            from: '/docs/getting-started/mongodb'
          },
          {
            to: '/docs/connectors/mysql/setup/local',
            from: '/docs/getting-started/mysql'
          },
          {
            to: '/docs/connectors/oracle/setup/generic',
            from: '/docs/getting-started/oracle'
          },
          {
            to: '/docs/getting-started/quickstart',
            from: '/docs/getting-started/overview'
          },
          {
            to: '/docs/connectors/postgres/setup/local',
            from: '/docs/getting-started/postgres'
          },
          {
            to: '/docs/install/olake-ui',
            from: '/docs/install/setup'
          },
          {
            to: '/docs/getting-started/creating-first-pipeline',
            from: '/docs/jobs/create-jobs'
          },
          {
            to: '/docs/getting-started/creating-first-pipeline',
            from: '/docs/jobs/edit-jobs'
          },
          {
            to: '/docs/getting-started/creating-first-pipeline',
            from: '/docs/jobs/overview'
          },
          {
            to: '/docs/understanding/terminologies/olake',
            from: '/docs/resources/olake-terminologies'
          },
          {
            to: '/docs/understanding/terminologies/general',
            from: '/docs/resources/terminologies'
          },
          {
            to: '/docs/writers/iceberg/catalog/rest',
            from: '/docs/writers/iceberg/catalog/overview'
          },
          {
            to: '/docs/writers/iceberg/troubleshooting-local/?view=local#local-testing',
            from: '/docs/writers/iceberg/docker-compose'
          },
          {
            to: '/docs/writers/iceberg/gcp',
            from: '/docs/writers/iceberg/gcs'
          },
          {
            to: '/docs/writers/iceberg/catalog/rest',
            from: '/docs/writers/iceberg/overview'
          },
          {
            to: '/docs/writers/iceberg/catalog/rest/?rest-catalog=s3-tables',
            from: '/docs/writers/iceberg/s3-tables'
          },
          {
            to: '/docs/writers/iceberg/troubleshooting-local',
            from: '/docs/writers/iceberg/troubleshooting'
          },
          {
            to: '/docs/writers/iceberg/catalog/rest/?rest-catalog=unity',
            from: '/docs/writers/iceberg/unity-catalog'
          },
          {
            to: '/docs/writers/iceberg/catalog/rest',
            from: '/docs/writers/overview'
          },
          {
            to: '/docs/writers/parquet/config',
            from: '/docs/writers/parquet/s3'
          },

          // Features page replaced by intro (intro.mdx has slug: / so it lives at /docs/)
          {
            to: '/docs/',
            from: '/docs/features'
          },
          // Release notes index has no category page; point it at the overview
          {
            to: '/docs/release/ingestion/overview',
            from: '/docs/release/ingestion'
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
            to: '/docs/benchmarks/ingestion/?tab=mongodb',
            from: '/docs/connectors/mongodb/benchmarks'
          },
          {
            to: '/docs/benchmarks/ingestion/?tab=postgres',
            from: '/docs/connectors/postgres/benchmarks'
          },
          {
            to: '/docs/benchmarks/ingestion/?tab=mysql',
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
            to: '/docs/install/docker-cli/#sync',
            from: '/olake/mongodb/colake-state-management'
          },
          {
            to: '/docs/core/architecture',
            from: '/olake/mongodb/framework'
          },
          {
            to: '/docs/benchmarks/ingestion/?tab=mongodb',
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
            to: '/docs/connectors/mongodb',
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
          // Post deprecated 2026-08-04; content superseded by the maintained MongoDB
          // troubleshooting section in the connector docs.
          {
            to: '/docs/connectors/mongodb/#troubleshooting',
            from: '/blog/troubleshooting-common-issues-and-solutions-to-mongodb-etl-errors/'
          },
          // Post deprecated 2026-08-04; superseded by the newer schema-evolution post
          // covering the same ground (polymorphic/changing types) in more depth.
          {
            to: '/blog/schema-evolution-without-breaking-pipelines',
            from: '/blog/handling-changing-data-type-during-semi-structured-data-ingestion/'
          },
          // Post deprecated 2026-08-04; content superseded by the maintained MongoDB
          // connector overview.
          {
            to: '/docs/connectors/mongodb',
            from: '/blog/mongodb-etl-challenges/'
          },
          // Post deprecated 2026-08-04; superseded by the flatten-array post covering
          // the same flatten/nested-JSON querying ground.
          {
            to: '/blog/flatten-array',
            from: '/blog/querying-json-in-snowflake/'
          },
          {
            to: '/',
            from: '/docs/community/sheet'
          },
          {
            to: '/docs/writers/iceberg/catalog/rest',
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
            to: '/docs/writers/iceberg/catalog/rest',
            from: '/docs/category/apache-iceberg'
          },
          {
            to: '/docs/connectors/mongodb',
            from: '/docs/category/mongodb'
          },

          {
            to: '/docs/connectors/postgres',
            from: '/docs/category/postgres'
          },

          {
            to: '/docs/connectors/mysql',
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
            to: '/docs/writers/iceberg/gcp',
            from: '/docs/writers/gcs/overview'
          },

          {
            to: '/docs/writers/parquet/config',
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

          // Search Console still shows impressions for these (the docs/shared snippets were once
          // published as pages). Only those with 5+ impressions are redirected to the page that
          // renders the same content; the rest are left to 404.
          {
            to: '/docs/dmsvsolake',
            from: '/blog/olake-vs-aws-dms-benchmark'
          },
          {
            to: '/docs/understanding/terminologies/olake',
            from: '/docs/shared/streams/StreamsConfiguration'
          },
          {
            to: '/docs/understanding/terminologies/olake',
            from: '/docs/shared/streams/StreamsOnly'
          },
          {
            to: '/docs/understanding/terminologies/olake',
            from: '/docs/shared/streams/StreamsOnlyDetails'
          },
          {
            to: '/docs/understanding/terminologies/olake',
            from: '/docs/shared/streams/StreamsFull'
          },
          {
            to: '/docs/writers/parquet/config',
            from: '/docs/shared/config/S3ConfigUIDetails'
          },
          {
            to: '/docs/writers/parquet/config',
            from: '/docs/shared/config/S3Config'
          },
          {
            to: '/docs/writers/parquet/config',
            from: '/docs/shared/config/S3ConfigDetails'
          },
          {
            to: '/docs/connectors/oracle',
            from: '/docs/shared/config/OracleToIcebergDatatypes'
          },
          {
            to: '/docs/connectors/mysql',
            from: '/docs/shared/config/MySQLToIcebergDatatypes'
          },
          {
            to: '/docs/connectors/s3',
            from: '/docs/shared/config/S3ToIcebergDatatypes'
          },
          {
            to: '/docs/connectors/mssql',
            from: '/docs/shared/config/MSSQLSourceConfig'
          },
          {
            to: '/docs/writers/iceberg/catalog/hive',
            from: '/docs/shared/config/HiveIcebergWriterUIConfigDetails'
          },
          {
            to: '/docs/writers/iceberg/catalog/hive',
            from: '/docs/shared/config/HiveIcebergWriterCLIConfigDetails'
          },
          {
            to: '/docs/writers/iceberg/catalog/hive',
            from: '/docs/shared/config/HiveIcebergWriterConfigDetails'
          },
          {
            to: '/docs/writers/iceberg/catalog/rest',
            from: '/docs/shared/config/RESTIcebergWriterConfigDetails'
          },
          {
            to: '/docs/understanding/compatibility-catalogs',
            from: '/docs/shared/SupportedIcebergCatalogs'
          },
          {
            to: '/docs',
            from: '/docs/shared/OLakeFeaturesTLDR'
          },
          {
            to: '/docs',
            from: '/docs/shared/SupportedDestinations'
          },
          {
            to: '/docs/install/docker-cli',
            from: '/docs/shared/commands/DockerDiscoverMySQL'
          },
          {
            to: '/docs/install/docker-cli',
            from: '/docs/shared/commands/DockerSyncPostgres'
          },

          // START - 404 redirects

          {
            to: '/docs/core/architecture',
            from: '/docs/category/understanding-olake'
          },

          // docs/features/overview.mdx was a meta-refresh stub (to /docs/); the only page left in
          // the features section is Schema Evolution
          {
            to: '/docs/features/schema',
            from: '/docs/category/features'
          },
          {
            to: '/docs/features/schema',
            from: '/docs/features/overview'
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
            to: '/docs/connectors/mongodb/#configuration',
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
            to: '/docs/writers/parquet/config',
            from: '/docs/category/aws-s3'
          },
          {
            to: '/docs/connectors/overview',
            from: '/docs/olake/drivers'
          },
          {
            to: '/docs/connectors/mongodb',
            from: '/docs/olake/drivers/mongodb-poc'
          },
          {
            to: '/docs/connectors/mongodb',
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
            to: '/docs/writers/iceberg/catalog/rest',
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
            to: '/docs/writers/iceberg/catalog/rest',
            from: '/docs/category/destinations-writers'
          },
          {
            to: '/docs/understanding/terminologies/olake',
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
            to: '/docs/writers/iceberg/catalog/rest',
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
            to: '/docs/connectors/mongodb/#configuration',
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
            to: '/docs/writers/iceberg/catalog/rest',
            from: '/docs/writers/catalog/overview'
          },
          {
            to: '/docs/getting-started/quickstart',
            from: '/docs/writers/getting-started/overview'
          },
          {
            to: '/docs/writers/iceberg/catalog/rest',
            from: '/docs/writers/iceberg/'
          },
          {
            to: '/docs/writers/parquet/partitioning',
            from: '/docs/writers/parquet/s3/partitioning'
          },
          {
            to: '/docs/writers/parquet/config',
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
            to: '/docs/writers/iceberg/catalog/rest',
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
            to: '/docs/connectors/oracle/#configuration',
            from: '/docs/writers/connectors/oracle/config/'
          },
          {
            to: '/docs/connectors/mongodb/#configuration',
            from: '/docs/core/connectors/mongodb/config/'
          },
          {
            to: '/docs/connectors/oracle/#configuration',
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
            to: '/docs/writers/iceberg/catalog/rest',
            from: '/docs/writers/parquet/iceberg/overview/'
          },
          {
            to: '/docs/writers/iceberg/catalog/rest',
            from: '/docs/connectors/writers/overview/'
          },
          {
            to: '/docs/connectors/mysql/#configuration',
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
            to: '/docs/writers/iceberg/catalog/rest',
            from: '/docs/core/writers/iceberg/catalog/overview/'
          },
          {
            to: '/docs/connectors/mysql/#configuration',
            from: '/docs/writers/connectors/mysql/config/'
          },
          {
            to: '/docs/writers/parquet/config',
            from: '/docs/writers/writers/parquet/s3/'
          },
          {
            to: '/docs/connectors/postgres/#configuration',
            from: '/iceberg/docs/connectors/postgres/config/'
          },
          {
            to: '/docs/writers/iceberg/catalog/rest',
            from: '/iceberg/docs/writers/iceberg/catalog/overview/'
          },
          {
            to: '/docs/connectors/mongodb/#configuration',
            from: '/docs/writers/connectors/mongodb/config/'
          },
          {
            to: '/docs/connectors/postgres/#configuration',
            from: '/docs/core/connectors/postgres/config/'
          },
          {
            to: '/docs/getting-started/creating-first-pipeline',
            from: '/docs/writers/jobs/overview/'
          },
          {
            to: '/docs/connectors/postgres/#configuration',
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
    ]
  ]

  // Removed render-blocking stylesheets - fonts now loaded asynchronously via head tags
}

export default config
