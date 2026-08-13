export interface NavLink {
  label: string
  href: string
}

/** A submenu that opens to the side of its parent panel (the design's `▸`). */
export interface NavFlyout {
  label: string
  items: NavLink[]
}

export interface NavEntry {
  label: string
  href?: string
  /** Panel contents. Omit for a plain link. */
  items?: (NavLink | NavFlyout)[]
}

export const isFlyout = (item: NavLink | NavFlyout): item is NavFlyout =>
  Array.isArray((item as NavFlyout).items)

/** A mobile drawer row: either a plain link, or a group that expands in place. */
export type MobileNavItem = NavLink | NavEntry

export const isMobileGroup = (item: MobileNavItem): item is NavEntry =>
  Array.isArray((item as NavEntry).items)

/**
 * Information architecture for the site-wide navbar. `themeConfig.navbar.items`
 * is not read for these, but must stay non-empty: theme-common disables the
 * mobile burger entirely when `navbar.items.length === 0`.
 */
export const NAV_ENTRIES: NavEntry[] = [
  {
    label: 'Product',
    items: [
      { label: 'OLake Go', href: '/olake-go' },
      { label: 'OLake Fusion', href: '/olake-fusion' }
    ]
  },
  {
    // A dropdown rather than the design's plain link: the two products have
    // separate doc sets, and a bare /docs lands you in Go's with no way over.
    label: 'Docs',
    items: [
      { label: 'OLake Go', href: '/docs' },
      { label: 'OLake Fusion', href: '/docs/fusion/getting-started/overview' }
    ]
  },
  {
    label: 'Resources',
    items: [
      { label: 'Blog', href: '/blog' },
      { label: 'Customer Stories', href: '/customer-stories' },
      { label: 'Webinars & Events', href: '/webinar' },
      {
        label: 'Community',
        items: [
          { label: 'OLake Community', href: '/community' },
          { label: 'Top Contributors', href: '/community/contributors' },
          { label: 'Contributor Program', href: '/community/contributor-program' }
        ]
      },
      {
        label: 'Iceberg',
        items: [
          { label: 'Iceberg Blogs', href: '/iceberg' },
          { label: 'Query Engine', href: '/iceberg/query-engine' }
        ]
      }
    ]
  }
]

export const PRICING_LINK: NavLink = { label: 'Pricing', href: '/contact' }

/**
 * The mobile drawer: one flat list, stopping at section level — the pages under
 * Community and Iceberg are reached from those pages. Docs is the exception,
 * expanding in place to mirror the desktop dropdown.
 */
export const MOBILE_LINKS: MobileNavItem[] = [
  { label: 'OLake Go', href: '/olake-go' },
  { label: 'OLake Fusion', href: '/olake-fusion' },
  {
    label: 'Docs',
    items: [
      { label: 'OLake Go', href: '/docs' },
      { label: 'OLake Fusion', href: '/docs/fusion/getting-started/overview' }
    ]
  },
  { label: 'Blog', href: '/blog' },
  { label: 'Customer Stories', href: '/customer-stories' },
  { label: 'Webinars & Events', href: '/webinar' },
  { label: 'Community', href: '/community' },
  { label: 'Iceberg', href: '/iceberg' },
  PRICING_LINK
]

export const GITHUB_REPO_URL = 'https://github.com/datazip-inc/olake'
export const FUSION_GITHUB_REPO_URL = 'https://github.com/datazip-inc/olake-fusion'
export const SLACK_URL = '/slack'
export const CTA = { label: "Try, it's free!", href: '/docs/getting-started/quickstart/' }
