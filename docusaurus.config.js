import { themes as prismThemes } from 'prism-react-renderer';
// import type { Config } from '@docusaurus/types';
// import type * as Preset from '@docusaurus/preset-classic';
// import tailwindPlugin from "./plugins/tailwind-config.cjs"; 

// const CustomSolutionsNavbarItem = require('./src/components/CustomSolutionsNavbarItem').default;

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'OLake',
  tagline: 'Fastest way to replicate MongoDB data in Apache Iceberg',
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
  trailingSlash: false,

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  future: {
    experimental_faster: true
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/docs',
          sidebarPath: './sidebars.js',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,

          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/datazip-inc/olake-docs/tree/master/',
        },

        theme: {
          customCss: './src/css/custom.css',
        },
        blog: false,

        googleTagManager: {
          containerId: 'GTM-TFZ2GXJP',
        },
        gtag: {
          trackingID: 'G-GTNTGHDNZW',
          anonymizeIP: true,
        },

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

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/logo/olake-blue.svg',

      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: true
        },
      },

      navbar: {
        hideOnScroll: true,
        // style: 'dark',
        title: 'OLake',
        logo: {
          alt: 'OLake Logo',
          src: 'img/logo/olake-blue.svg',
        },
        items: [
          // {
          //   type: 'docSidebar',
          //   // sidebarId: 'tutorialSidebar',
          //   position: 'left',
          //   label: 'Docs',
          // },


          { to: '/docs', label: 'Docs', position: 'left' },
          { to: '/iceberg', label: 'Iceberg', position: 'right' },
          { to: '/blog', label: 'Blogs', position: 'right' },
          { to: '/webinar', label: 'Webinars & Events', position: 'right' },

          // {
          //   type: 'html',
          //   position: 'right',
          //   component: CustomSolutionsNavbarItem,

          //   // label: 'Dropdown'
          // },


          {
            href: 'https://join.slack.com/t/getolake/shared_invite/zt-2utw44do6-g4XuKKeqBghBMy2~LcJ4ag',
            // label: 'Join Slack',
            position: 'right',
            className: 'header-slack-link',
          },

          // {
          //   href: 'https://olake.io#olake-product-form',
          //   label: 'Join Waitlist',
          //   position: 'left',
          // },
          {
            href: 'https://github.com/datazip-inc/olake',
            // label: 'GitHub',
            position: 'right',
            // position: 'right',
            className: 'header-github-link',

          },
          {
            label: 'Talk to us',
            href: 'https://olake.io/#olake-form-product',
            position: 'right',
            className: 'dev-portal-signup dev-portal-link',
          },
          // {
          //   type: 'html',
          //   position: 'right',
          //   value: '<Button>Talk to us</Button>',
          // },
        ],
      },

      metadata: [
        // { name: 'robots', content: 'noindex, nofollow' },
        { name: 'OLake', content: 'ETL tool, ELT tool, open source' },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@olake.io" },
      ],
      headTags: [
        {
          tagName: 'link',
          attributes: {
            rel: 'preconnect',
            sizes: "any",
            href: 'https://olake.io',
            href: "/img/logo/olake-blue.svg",
          },
        },
        // Declare some json-ld structured data
        {
          tagName: 'script',
          attributes: {
            type: 'application/ld+json',
          },
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Organization',
            name: 'OLake',
            url: 'https://olake.io/',
            logo: 'https://olake.io/img/logo/olake-blue.svg',
          }),
        },
      ],

      announcementBar: {
        content:
          'Support us by giving us a ⭐️ on <a target="_blank" rel="noopener noreferrer" href="https://github.com/datazip-inc/olake">GitHub</a>! ',
        backgroundColor: 'white',
        textColor: 'black',
        isCloseable: true,
      },

      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },

      imageZoom: {
        // CSS selector to apply the plugin to, defaults to '.markdown img'
        selector: '.markdown img',
        // Optional medium-zoom options
        // see: https://www.npmjs.com/package/medium-zoom#options
        options: {
          margin: 24,
          background: '#000000',
          // scrollOffset: 0,
          // container: '#zoom-container',
          // template: '#zoom-template',
        },
      },

      // algolia: {
      //   // The application ID provided by Algolia
      //   appId: '7WDJ7VSHHG',

      //   // Public API key: it is safe to commit it
      //   apiKey: '64650072b9b1c25cb21b6cd0e10a5a87',

      //   indexName: 'datazip',

      //   // Optional: see doc section below
      //   contextualSearch: true,

      //   // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      //   externalUrlRegex: 'external\\.com|domain\\.com',

      //   // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      //   // replaceSearchResultPathname: {
      //   //   from: '/docs/', // or as RegExp: /\/docs\//
      //   //   to: '/',
      //   // },

      //   // Optional: Algolia search parameters
      //   searchParameters: {},

      //   // Optional: path for search page that enabled by default (`false` to disable it)
      //   searchPagePath: 'search',

      //   // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      //   insights: true,

      //   //... other Algolia params
      // },

      footer: {
        style: 'dark',
        links: [
          {
            title: 'Socials',
            items: [
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/company/datazipio',
              },
              {
                label: 'X (Twitter)',
                href: 'https://x.com/_olake',
              },
              {
                label: 'YouTube',
                href: 'https://www.youtube.com/@olakeio',
              },
              {
                label: 'Slack Community',
                href: 'https://join.slack.com/t/getolake/shared_invite/zt-2utw44do6-g4XuKKeqBghBMy2~LcJ4ag',
              },
              {
                label: 'Instagram',
                href: 'https://instagram.com/olake_io',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'Docs',
                to: '/docs',
              },
              {
                label: 'Blogs',
                to: '/blog',
              },
              {
                label: 'Search',
                to: '/search',
              },
              {
                label: 'Slack Archive',
                href: 'https://meetwaves.com/library/olake',
              },
            ],
          },
          {
            title: 'Top Reads',
            items: [
              {
                label: 'Issues with Debezium ',
                to: '/blog/issues-debezium-kafka',
              },
              {
                label: 'OLake Architecture',
                to: '/blog/olake-architecture',
              },
            ],
          },
          {
            title: 'Company',
            items: [
              {
                label: 'About us',
                to: '/about-us',
              },
              {
                label: 'Contact us',
                to: '/contact',
              },
              {
                label: 'Branding',
                to: '/branding',
              },
              {
                label: 'Terms of Use',
                href: 'https://datazip.io/terms-of-use',
              },
              {
                label: 'Privacy (Visitors)',
                href: 'https://datazip.io/privacy-policy',
              },
              {
                label: 'Privacy (Customers)',
                href: 'https://datazip.io/privacy-policy-customer',
              },
            ],
          },
        ],
        // logo: {
        //   alt: 'name',
        //   src: 'img/logo-blue.svg',
        //   srcDark: 'img/logo-white.svg',
        //   width: 200,
        // },
        copyright: `Copyright © ${new Date().getFullYear()} Datazip. All rights reserved. <br> Datazip, Inc. 16192 COASTAL HWY LEWES, DE 19958, USA`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['java', 'bash', 'yaml', 'regex', 'mongodb', 'docker'],

      },
    }),
  // satisfies Preset.ThemeConfig,

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        indexPages: true,
        docsRouteBasePath: '/docs',
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: false,
        searchResultContextMaxLength: 50,
        searchResultLimits: 8,
        searchBarShortcut: true,
        searchBarShortcutHint: true
      }
    ]
  ],

  plugins: [
    'plugin-image-zoom',
    // 'docusaurus-plugin-sass',
    // tailwindPlugin,
    ['./src/plugins/tailwind-config.js', {}],
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
      './src/plugins/blog-plugin',
      {
        path: 'blog',
        id: 'olake-blog',
        editLocalizedFiles: false,
        blogTitle: 'Blog',
        blogDescription: 'Blogs on Database CDC, Debezium, CDC strategies, JSON Flattening ...',
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
        editUrl:
          'https://github.com/datazip-inc/olake/tree/master/',
        remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]]
      }
    ],
    [
      './src/plugins/blog-plugin',
      {
        path: 'iceberg',
        id: 'iceberg-blog',
        editLocalizedFiles: false,
        blogTitle: 'Blogs on Apache Iceberg',
        blogDescription: 'Blogs on everything related to Apache Iceberg',
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
          'https://github.com/datazip-inc/olake/tree/master/',
        remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]]
      }
    ],
    // '@gracefullight/docusaurus-plugin-tailwind',
    // {
    //   includePaths: ["node_modules/infima/scss"],
    // },
    [
      '@docusaurus/plugin-client-redirects',
      {
        // fromExtensions: ['html', 'htm'], // /myPage.html -> /myPage
        // toExtensions: ['exe', 'zip'], // /myAsset -> /myAsset.zip (if latter exists)
        redirects: [
          // /docs/oldDoc -> /docs/newDoc
          // write path after the base path URL
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
            to: '/docs/connectors/mongodb/benchmarks',
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
            to: '/docs/category/mongodb',
            from: '/olake/drivers/mongodb-poc',
          },
          {
            to: '/docs/category/resources',
            from: '/olake/resources/terminologies',
          },
          {
            to: 'https://join.slack.com/t/getolake/shared_invite/zt-2utw44do6-g4XuKKeqBghBMy2~LcJ4ag',
            from: '/slack',
          },
          {
            to: 'https://github.com/datazip-inc/olake',
            from: '/github',
          },
          // Redirect from multiple old paths to the new path
          // {
          //   to: '/docs/newDoc2',
          //   from: ['/docs/oldDocFrom2019', '/docs/legacyDocFrom2016'],
          // },
        ],
        // createRedirects(existingPath) {
        //   if (existingPath.includes('/community')) {
        //     // Redirect from /docs/team/X to /community/X and /docs/support/X to /community/X
        //     return [
        //       existingPath.replace('/community', '/docs/team'),
        //       existingPath.replace('/community', '/docs/support'),
        //     ];
        //   }
        //   return undefined; // Return a falsy value: no redirect created
        // },
      },
    ],
    '@docusaurus/theme-live-codeblock',
  ],
};

export default config;
