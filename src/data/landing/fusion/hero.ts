/** Hero copy, calls to action and the "how it fits" diagram on the OLake Fusion page. */

/** PostHog multivariate flag that A/B tests the hero headline. */
export const HERO_HEADLINE_FLAG = 'fusion-hero-headline'

/** Variant keys must match the flag's variants in the PostHog UI. 'performance' is the SSR default. */
export const HERO_HEADLINES = {
  performance: 'Keep your Iceberg tables fast with less compute',
  simplicity: 'Simplify your Iceberg table maintenance'
}

export const HERO = {
  eyebrow: 'OLake Fusion',
  primary: { label: 'Get Started', href: '/docs/fusion/getting-started/quickstart/' },
  secondary: { label: 'Visit Docs', href: '/docs/fusion/getting-started/overview/' }
}

/** Iceberg tables in, OLake Fusion in the middle, optimized Iceberg tables out. */
export const FLOW = {
  inputLabel: 'Iceberg Tables',
  engineName: { brand: 'OLake', product: 'Fusion' },
  outputLabel: 'Optimized Iceberg Tables',
  capabilities: [
    { label: 'Compaction' },
    { label: 'Cleanup', badge: 'Soon' },
    { label: 'Logs & Metrics' }
  ] as { label: string; badge?: string }[]
}
