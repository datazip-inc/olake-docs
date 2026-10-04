/**
 * Navigation model for the Lakeside navbar (pill on the landing pages, bar everywhere else) and for
 * the docs mobile drawer. The hrefs are the site's existing routes.
 */
export const GITHUB_REPO_URL = 'https://github.com/datazip-inc/olake'
export const FUSION_GITHUB_REPO_URL = 'https://github.com/datazip-inc/olake-fusion'
export const SLACK_URL = '/slack/'
export const PRICING_LINK = { label: 'Pricing', href: '/contact/' }

export interface LakesideNavLink {
  label: string
  href: string
  /** External links open in a new tab and get rel="noopener noreferrer". */
  external?: boolean
}

export interface MegaColumn {
  title: string
  subtitle: string
  icon: 'go' | 'fusion' | 'learn' | 'customers' | 'community'
  links: LakesideNavLink[]
}

/** Wide desktop panel: a featured card, link columns and a help band. Mobile uses `items`. */
export interface MegaMenu {
  /** Optional blue card on the left; menus without one use the full width for their columns. */
  feature?: { eyebrow: string; title: string; text: string; cta: LakesideNavLink }
  columns: MegaColumn[]
  band: { title: string; text: string; cta: LakesideNavLink; icon: 'slack' | 'github' | 'arrow' }
}

export interface LakesideNavEntry {
  label: string
  href?: string
  items?: LakesideNavLink[]
  mega?: MegaMenu
}

/** Docs mega menu. Every href is an existing docs route. */
const DOCS_MEGA: MegaMenu = {
  columns: [
    {
      title: 'OLake Go',
      subtitle: 'Database replication',
      icon: 'go',
      links: [
        { label: 'Overview', href: '/docs' },
        { label: 'Quickstart', href: '/docs/getting-started/quickstart/' },
        { label: 'Architecture', href: '/docs/core/architecture/' },
        { label: 'Install', href: '/docs/install/docker-cli/' },
        { label: 'Release notes', href: '/docs/release/ingestion/overview/' }
      ]
    },
    {
      title: 'OLake Fusion',
      subtitle: 'Iceberg table maintenance',
      icon: 'fusion',
      links: [
        { label: 'Overview', href: '/docs/fusion/getting-started/overview' },
        { label: 'Quickstart', href: '/docs/fusion/getting-started/quickstart/' },
        { label: 'Architecture', href: '/docs/fusion/core/architecture/' },
        { label: 'Install', href: '/docs/fusion/install/kubernetes-compaction/' },
        { label: 'Release notes', href: '/docs/fusion/release/maintenance/overview/' }
      ]
    }
  ],
  band: {
    title: 'Stuck on something?',
    text: 'Ask the OLake community on Slack, or open an issue on GitHub.',
    cta: { label: 'Join the Slack community', href: SLACK_URL },
    icon: 'slack'
  }
}

/** Products mega menu. */
const PRODUCTS_MEGA: MegaMenu = {
  feature: {
    eyebrow: 'Two products',
    title: 'Replicate, then maintain',
    text: 'OLake Go replicates databases into Apache Iceberg. OLake Fusion runs compaction and maintenance on Iceberg tables.',
    cta: { label: 'Try OLake Go', href: '/docs/getting-started/quickstart/' }
  },
  columns: [
    {
      title: 'OLake Go',
      subtitle: 'Database replication',
      icon: 'go',
      links: [
        { label: 'Overview', href: '/olake-go' },
        { label: 'Documentation', href: '/docs' },
        { label: 'Quickstart', href: '/docs/getting-started/quickstart/' },
        { label: 'GitHub', href: GITHUB_REPO_URL, external: true }
      ]
    },
    {
      title: 'OLake Fusion',
      subtitle: 'Iceberg table maintenance',
      icon: 'fusion',
      links: [
        { label: 'Overview', href: '/olake-fusion' },
        { label: 'Documentation', href: '/docs/fusion/getting-started/overview' },
        { label: 'Quickstart', href: '/docs/fusion/getting-started/quickstart/' },
        { label: 'GitHub', href: FUSION_GITHUB_REPO_URL, external: true }
      ]
    }
  ],
  band: {
    title: 'Not sure where to start?',
    text: 'Tell the OLake team about your setup.',
    cta: { label: 'Contact us', href: '/contact/' },
    icon: 'arrow'
  }
}

/** Resources mega menu. Customer names are the story routes that exist on the site. */
const RESOURCES_MEGA: MegaMenu = {
  feature: {
    eyebrow: 'From the blog',
    title: 'Read the OLake blog',
    text: 'Guides and comparisons on moving data into Apache Iceberg.',
    cta: { label: 'Browse the blog', href: '/blog' }
  },
  columns: [
    {
      title: 'Learn',
      subtitle: 'Guides and talks',
      icon: 'learn',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'Iceberg blogs', href: '/iceberg' },
        { label: 'Webinars & events', href: '/webinar' },
        { label: 'Documentation', href: '/docs' }
      ]
    },
    {
      title: 'Customers',
      subtitle: 'How teams use OLake',
      icon: 'customers',
      links: [
        { label: 'All customer stories', href: '/customer-stories' },
        { label: 'Xeno', href: '/customer-stories/xeno-aws-dms-alternative-mysql-cdc/' },
        { label: 'Bitespeed', href: '/customer-stories/bitespeed-segmentation-queries/' },
        { label: 'PhysicsWallah', href: '/customer-stories/physicswallah-mongodb-cdc-iceberg/' },
        { label: 'Cordial', href: '/customer-stories/cordial-real-time-data-sync/' }
      ]
    },
    {
      title: 'Community',
      subtitle: 'Open source, together',
      icon: 'community',
      links: [
        { label: 'OLake community', href: '/community' },
        { label: 'Contributing guide', href: '/docs/community/contributing/' },
        { label: 'Slack', href: SLACK_URL },
        { label: 'About us', href: '/about-us' }
      ]
    }
  ],
  band: {
    title: 'OLake is open source',
    text: 'Star the repo, report an issue or send a pull request.',
    cta: { label: 'Star on GitHub', href: GITHUB_REPO_URL, external: true },
    icon: 'github'
  }
}

export const LAKESIDE_NAV: LakesideNavEntry[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Products',
    mega: PRODUCTS_MEGA,
    items: [
      { label: 'OLake Go', href: '/olake-go' },
      { label: 'OLake Fusion', href: '/olake-fusion' }
    ]
  },
  {
    label: 'Resources',
    mega: RESOURCES_MEGA,
    items: [
      { label: 'Blog', href: '/blog' },
      { label: 'Customer Stories', href: '/customer-stories' },
      { label: 'Webinars & Events', href: '/webinar' },
      { label: 'OLake Community', href: '/community' },
      { label: 'Iceberg Blogs', href: '/iceberg' }
    ]
  },
  {
    label: 'Docs',
    mega: DOCS_MEGA,
    items: [
      { label: 'OLake Go', href: '/docs' },
      { label: 'OLake Fusion', href: '/docs/fusion/getting-started/overview' }
    ]
  },
  { label: PRICING_LINK.label, href: PRICING_LINK.href }
]

export const LAKESIDE_CTA: LakesideNavLink = {
  label: "Try, It's Free",
  href: '/docs/getting-started/quickstart/'
}

export const LAKESIDE_GITHUB: LakesideNavLink = {
  label: 'GitHub',
  href: GITHUB_REPO_URL,
  external: true
}

export const LAKESIDE_SLACK: LakesideNavLink = {
  label: 'Slack community',
  href: SLACK_URL
}
