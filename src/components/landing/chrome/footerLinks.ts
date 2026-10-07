/**
 * Footer model, shared by the home page and every other page (`src/theme/Footer`).
 * Only destinations a visitor actually looks for.
 */
import { GITHUB_REPO_URL, PRICING_LINK, SLACK_URL } from './navItems'

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
    title: 'Products',
    links: [
      { label: 'OLake Go', href: '/olake-go' },
      { label: 'OLake Fusion', href: '/olake-fusion' },
      { label: PRICING_LINK.label, href: PRICING_LINK.href },
      { label: 'GitHub', href: GITHUB_REPO_URL }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: '/docs' },
      { label: 'Blog', href: '/blog' },
      { label: 'Customer stories', href: '/customer-stories' },
      { label: 'Webinars & events', href: '/webinar' },
      { label: 'Community', href: '/community' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '/about-us' },
      { label: 'Contact', href: '/contact/' },
      { label: 'Brand assets', href: '/branding' },
      { label: 'Terms of Use', href: '/terms-of-use' },
      { label: 'Privacy Policy', href: '/privacy-policy' }
    ]
  }
]

export const FOOTER_SOCIALS: (FooterLink & { icon: 'linkedin' | 'x' | 'slack' | 'youtube' })[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/datazipio/', icon: 'linkedin' },
  { label: 'X', href: 'https://x.com/_olake', icon: 'x' },
  { label: 'Slack', href: SLACK_URL, icon: 'slack' },
  { label: 'YouTube', href: 'https://www.youtube.com/@olakeio', icon: 'youtube' }
]

export const FOOTER_WORDMARK = {
  eyebrow: 'OLake',
  headline: 'Apache Iceberg table Ingestion and Maintenance'
}
