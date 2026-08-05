export interface NavLink {
  label: string
  href: string
}

export interface NavDropdown {
  label: string
  items: NavLink[]
}

/**
 * Information architecture for the shared site-wide navbar.
 *
 * Styling/structure follow the v2 homepage design, but the design's nav only
 * covers Products / Docs / Resources / Pricing. Everything that existed in
 * docusaurus.config.js is preserved here so no destination is lost:
 *
 *   config item                     -> where it lives now
 *   --------------------------------------------------------------
 *   Docs (dropdown)                 -> Docs (unchanged)
 *   Blogs                           -> Resources > Blog
 *   Customer Stories                -> Resources > Customer Stories
 *   Community > Webinars & Events   -> Resources > Webinars & Events
 *   Community > OLake Community     -> Community > OLake Community
 *   Community > Top Contributors    -> Community > Top Contributors
 *   Community > Contributor's Prog. -> Community > Contributor's Program
 *   Community > GSoC                -> Community > GSoC
 *   Iceberg (dropdown)              -> Iceberg (kept top-level, as requested)
 *   Pricing                         -> Pricing
 *
 * NOTE: `themeConfig.navbar.items` is not read for these — the design's
 * dropdown panels can't be expressed as plain Docusaurus `dropdown` items.
 * That config must still stay non-empty: theme-common disables the mobile
 * burger entirely when `navbar.items.length === 0`.
 */
export const NAV_DROPDOWNS: NavDropdown[] = [
  {
    label: 'Products',
    items: [
      { label: 'OLake Go', href: '/olake-go' },
      { label: 'OLake Fusion', href: '/olake-fusion' }
    ]
  },
  {
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
      { label: 'Webinars & Events', href: '/webinar' }
    ]
  },
  {
    label: 'Community',
    items: [
      { label: 'OLake Community', href: '/community' },
      { label: 'Top Contributors', href: '/community/contributors' },
      { label: 'Contributor Program', href: '/community/contributor-program' },
      { label: 'GSoC', href: '/community/gsoc' }
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

export const PRICING_LINK: NavLink = { label: 'Pricing', href: '/contact' }

export const GITHUB_REPO_URL = 'https://github.com/datazip-inc/olake'
export const SLACK_URL = '/slack'
export const CTA = { label: "Try, it's free!", href: '/docs/getting-started/quickstart/' }
