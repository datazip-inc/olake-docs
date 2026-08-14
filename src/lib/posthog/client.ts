import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import posthog from 'posthog-js'

// Side-effect import: initializes on load, client-side only. Root/index.tsx
// imports this so init runs before any page mounts.
if (ExecutionEnvironment.canUseDOM) {
  posthog.init('phc_nT2syEvyPUz7FYFgbpadiAFyd7NHBu7W9ewdQ4ciVfac', {
    api_host: 'https://us.i.posthog.com',
    defaults: '2026-05-30'
  })
}

export default posthog
