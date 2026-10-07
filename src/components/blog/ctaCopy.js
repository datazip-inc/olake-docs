import { GITHUB_REPO_URL } from '@site/src/components/landing/chrome/navItems'

/**
 * Wording and links of the OLake Go call to action on blog posts (the sticky card and the band at
 * the end). The description is the one the BlogCTA card at the end of most posts already uses, so
 * the blog says the same thing everywhere and adds no claim of its own.
 */
export const POST_CTA = {
  title: 'OLake Go',
  bandTitle: 'OLake Go',
  text: 'Replicate databases, Kafka, and S3 into Apache Iceberg with OLake Go, an open source EL engine built for Iceberg from the ground up.',
  primary: { label: 'Try OLake Go', href: '/docs/getting-started/quickstart/' },
  secondary: { label: 'Star on GitHub', href: GITHUB_REPO_URL, external: true }
}
