/**
 * Navigation model for the lakeside pill navbar.
 *
 * The hrefs are the site's existing routes: this file only re-shapes the
 * information architecture that `landing/Navbar/navData.ts` already describes
 * (that file stays the source for the current site-wide navbar).
 */
import { GITHUB_REPO_URL, PRICING_LINK, SLACK_URL } from '../Navbar/navData'

export interface LakesideNavLink {
  label: string
  href: string
  /** External links open in a new tab and get rel="noopener noreferrer". */
  external?: boolean
}

export interface LakesideNavEntry {
  label: string
  href?: string
  items?: LakesideNavLink[]
}

export const LAKESIDE_NAV: LakesideNavEntry[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Products',
    items: [
      { label: 'OLake Go', href: '/olake-go' },
      { label: 'OLake Fusion', href: '/olake-fusion' }
    ]
  },
  {
    label: 'Resources',
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
