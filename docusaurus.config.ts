import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'OLake',
  tagline: 'Fastest way to replicate MongoDB data in Apache Iceberg',
  favicon: 'img/logo/olake.png',

  // Set the production url of your site here
  url: 'https://datazip-inc.github.io/',
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
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/datazip-inc/olake-docs/',
        },
        blog: false
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
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
        // {
        //   title: 'Community',
          // items: [
            // {
            //   label: 'Stack Overflow',
            //   href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            // },
            // {
            //   label: 'Discord',
            //   href: 'https://discordapp.com/invite/docusaurus',
            // },
            // {
            //   label: 'X',
            //   href: 'https://x.com/docusaurus',
            // },
          // ],
        // },
        // {
        //   title: 'More',
        //   items: [
        //     {
        //       label: 'Blog',
        //       to: '/blog',
        //     },
        //     {
        //       label: 'GitHub',
        //       href: 'https://github.com/facebook/docusaurus',
        //     },
        //   ],
        // },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Datazip. All rights reserved. <br> Datazip, Inc. 16192 COASTAL HWY LEWES, DE 19958, USA`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
