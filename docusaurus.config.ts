import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'OLake',
  tagline: 'Fastest way to replicate MongoDB data in Apache Iceberg',
  favicon: 'img/logo/olake.png',

  // Set the production url of your site here
  url: 'https://datazip.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/olake/docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'datazip-inc', // Usually your GitHub org/user name.
  projectName: 'olake-docs', // Usually your repo name.
  deploymentBranch: 'master',

  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: false,

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          // async contentLoaded({ actions }) {
          //   actions.setGlobalData({
          //     seo: {
          //       meta: [
          //         {
          //           name: "robots",
          //           content: "noindex, nofollow",
          //         },
          //       ],
          //     },
          //   });
          // },
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/datazip-inc/olake-docs/tree/master/',
        },
        blog: false
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/logo/olake.png',
    navbar: {
      title: 'OLake Docs',
      logo: {
        alt: 'Olake Logo',
        src: 'img/logo/olake.png',
      },
      items: [
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'tutorialSidebar',
        //   position: 'left',
        //   label: 'Docs',
        // },
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://join.slack.com/t/getolake/shared_invite/zt-2utw44do6-g4XuKKeqBghBMy2~LcJ4ag',
          label: 'Slack',
          position: 'right',
        },
        {
          href: 'https://datazip.io/blog',
          label: 'Blogs',
          position: 'right',
        },
        {
          href: 'https://github.com/datazip-inc/olake',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    
    metadata: [
      { name: 'robots', content: 'noindex, nofollow' },
    ],


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



    algolia: {
      // The application ID provided by Algolia
      appId: '7WDJ7VSHHG',

      // Public API key: it is safe to commit it
      apiKey: '64650072b9b1c25cb21b6cd0e10a5a87',

      indexName: 'datazip',

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      externalUrlRegex: 'external\\.com|domain\\.com',

      // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      // replaceSearchResultPathname: {
      //   from: '/docs/', // or as RegExp: /\/docs\//
      //   to: '/',
      // },

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',

      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: true,

      //... other Algolia params
    },




    footer: {
      style: 'dark',
      links: [
        {
          title: 'Resources',
          items: [
            {
              label: 'Docs',
              to: '/',
            },
            {
              label: 'Blogs',
              href: 'https://datazip.io/blog',
            },
          ],
        },
        {
          title: 'Company',
          items: [
            {
              label: 'About us',
              href: 'https://datazip.io/about-us',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
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
      copyright: `Copyright © ${new Date().getFullYear()} Datazip. All rights reserved. <br> Datazip, Inc. 16192 COASTAL HWY LEWES, DE 19958, USA`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    'plugin-image-zoom',
    [
      '@docusaurus/plugin-client-redirects',
      {
        // fromExtensions: ['html', 'htm'], // /myPage.html -> /myPage
        // toExtensions: ['exe', 'zip'], // /myAsset -> /myAsset.zip (if latter exists)
        redirects: [
          // /docs/oldDoc -> /docs/newDoc
          // write path after the base path URL
          {
            to: '/',
            from: '/olake/mongodb',
          },
          {
            to: '/',
            from: '/olake/mongodb/colake-connectors-for-olake',
          },
          {
            to: '/core/state-controller',
            from: '/olake/mongodb/colake-state-management',
          },
          {
            to: '/core/architecture',
            from: '/olake/mongodb/framework',
          },
          {
            to: '/connectors/mongodb/benchmarks',
            from: '/olake/mongodb/benchmark',
          },
          {
            to: '/getting-started',
            from: '/olake/mongodb/how-to-start-contributing-on-olake',
          },
          {
            to: '/category/mongodb',
            from: '/olake/drivers/mongodb-poc',
          },
          {
            to: '/category/resources',
            from: '/olake/resources/terminologies',
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
  ],
};

export default config;
