import { FUSION_GITHUB_REPO_URL } from '@site/src/components/landing/chrome/navItems'

/** Hero copy and calls to action of the OLake Fusion page. */

/** PostHog multivariate flag that A/B tests the hero headline. */
export const HERO_HEADLINE_FLAG = 'fusion-hero-headline'

/** Variant keys must match the flag's variants in the PostHog UI. 'performance' is the SSR default. */
export const HERO_HEADLINES = {
  performance: 'Keep your Iceberg tables fast with less compute',
  simplicity: 'Simplify your Iceberg table maintenance'
}

/** The headline comes from the A/B test above. */
export const HERO = {
  eyebrow: 'OLake Fusion',
  body: 'OLake Fusion helps keep your Iceberg tables performant, by automating compaction and reducing manual overhead.',
  primary: { label: 'Github', href: FUSION_GITHUB_REPO_URL },
  secondary: { label: 'Visit Docs', href: '/docs/fusion/getting-started/overview/' }
}
