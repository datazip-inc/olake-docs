/**
 * Footer model for the lakeside pages. Same destinations as the site-wide
 * footer (`src/theme/Footer/index.tsx`), re-shaped for the new design.
 */
export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Branding', href: '/branding' },
      { label: 'Contact', href: '/contact' },
      { label: 'Terms of Use', href: '/terms-of-use' },
      { label: 'Privacy Policy', href: '/privacy-policy' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blogs', href: '/blog' },
      { label: 'Docs', href: '/docs' },
      { label: 'Search', href: '/search' },
      { label: 'Community Slack Archive', href: '/slack-archive' }
    ]
  },
  {
    title: 'Top Reads',
    links: [
      { label: 'Issues with Debezium', href: '/blog/issues-debezium-kafka' },
      { label: 'OLake Architecture', href: '/blog/olake-architecture' }
    ]
  }
]

export const FOOTER_SOCIALS: (FooterLink & { icon: 'linkedin' | 'x' | 'slack' | 'youtube' })[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/datazipio/', icon: 'linkedin' },
  { label: 'X', href: 'https://x.com/_olake', icon: 'x' },
  { label: 'Slack', href: '/slack', icon: 'slack' },
  { label: 'YouTube', href: 'https://www.youtube.com/@olakeio', icon: 'youtube' }
]

export const FOOTER_WORDMARK = {
  eyebrow: 'OLake',
  headline: 'Fastest Data Replication'
}
