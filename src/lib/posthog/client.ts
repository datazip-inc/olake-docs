import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'

type PostHog = typeof import('posthog-js').default

let loading: Promise<PostHog> | null = null

/** Routes that read PostHog feature flags. PostHog is only loaded on these (the Fusion landing page
 * runs a hero headline A/B test); every other page ships without it. Add a route here when a new
 * page starts calling useFeatureFlagVariant. */
const POSTHOG_ROUTES = ['/olake-fusion']

/** True for a pathname that needs PostHog (with or without a trailing slash). */
export function routeNeedsPosthog(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '')
  return POSTHOG_ROUTES.includes(path)
}

/**
 * Loads and initialises posthog-js on demand. The library is a dynamic import so it
 * lives in its own chunk instead of the main bundle. Safe to call many times: init
 * runs once. Called by src/clientModules/deferredPosthog.ts when a route that needs flags is
 * entered, and directly by useFeatureFlagVariant. Client-side only.
 */
export function loadPosthog(): Promise<PostHog> {
  if (!ExecutionEnvironment.canUseDOM) return new Promise<PostHog>(() => {})
  if (!loading) {
    loading = import('posthog-js').then(({ default: posthog }) => {
      posthog.init('phc_nT2syEvyPUz7FYFgbpadiAFyd7NHBu7W9ewdQ4ciVfac', {
        api_host: 'https://us.i.posthog.com',
        defaults: '2026-05-30',
        // Only analytics and feature flags are used. These keep posthog-js from fetching the
        // surveys, product tours and conversations extension scripts (e.g. surveys.js).
        disable_surveys: true,
        disable_product_tours: true,
        disable_conversations: true
      })
      return posthog
    })
  }
  return loading
}
