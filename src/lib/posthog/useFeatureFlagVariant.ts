import { useEffect, useState } from 'react'
import { loadPosthog } from './client'

/** Picks a variant from a PostHog multivariate flag. `variants` keys must
 * match the flag's variant keys in the PostHog UI; unmatched/loading state
 * falls back to `defaultVariant`. PostHog itself is loaded lazily (dynamic
 * import, and only on the routes listed in client.ts), so the default variant
 * renders on the server, during hydration and until the flags arrive. */
export function useFeatureFlagVariant<T extends Record<string, string>>(
  flagKey: string,
  variants: T,
  defaultVariant: keyof T
): string {
  const [variantKey, setVariantKey] = useState<keyof T>(defaultVariant)
  useEffect(() => {
    let cancelled = false
    let unsubscribe: (() => void) | undefined
    loadPosthog()
      .then((posthog) => {
        if (cancelled) return
        unsubscribe = posthog.onFeatureFlags(() => {
          const flag = posthog.getFeatureFlag(flagKey)
          setVariantKey(typeof flag === 'string' && flag in variants ? flag : defaultVariant)
        })
      })
      .catch(() => {
        // Blocked or offline: keep the default variant.
      })
    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [flagKey])
  return variants[variantKey]
}
