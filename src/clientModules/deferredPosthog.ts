// PostHog is only used for the feature flag on the Fusion landing page (useFeatureFlagVariant), so
// it is loaded only on the routes listed in src/lib/posthog/client.ts, not on every page. Entering
// such a route (first load or SPA navigation) starts the dynamic import of posthog-js, which ships
// as its own chunk. Pages that never need flags never request the chunk.

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import { loadPosthog, routeNeedsPosthog } from '@site/src/lib/posthog/client'

type RouteUpdate = { location: { pathname: string } }

export function onRouteDidUpdate({ location }: RouteUpdate): void {
  if (!ExecutionEnvironment.canUseDOM) return
  if (!routeNeedsPosthog(location.pathname)) return
  loadPosthog().catch(() => {
    // Blocked by an ad blocker or offline: analytics are optional, stay silent.
  })
}
