import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'

type PostHog = typeof import('posthog-js').default

let loading: Promise<PostHog> | null = null

/**
 * Loads and initialises posthog-js on demand. The library is a dynamic import so it lives in its
 * own chunk instead of the main bundle. Safe to call many times: init runs once. PostHog runs on
 * every route (pageviews, autocapture, feature flags); it is started by the idle / first
 * interaction scheduler in src/clientModules/deferredPosthog.ts and directly by
 * useFeatureFlagVariant. The init options are the same as the ones the site used before the
 * deferred load (api_host and the 2026-05-30 defaults, which also turn on history-change
 * pageviews for SPA navigation). Client-side only.
 */
export function loadPosthog(): Promise<PostHog> {
  if (!ExecutionEnvironment.canUseDOM) return new Promise<PostHog>(() => {})
  if (!loading) {
    loading = import('posthog-js').then(({ default: posthog }) => {
      posthog.init('phc_nT2syEvyPUz7FYFgbpadiAFyd7NHBu7W9ewdQ4ciVfac', {
        api_host: 'https://us.i.posthog.com',
        defaults: '2026-05-30'
      })
      return posthog
    })
  }
  return loading
}
