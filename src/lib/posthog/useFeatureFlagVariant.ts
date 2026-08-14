import { useEffect, useState } from 'react'
import posthog from './client'

/** Picks a variant from a PostHog multivariate flag. `variants` keys must
 * match the flag's variant keys in the PostHog UI; unmatched/loading state
 * falls back to `defaultVariant`. */
export function useFeatureFlagVariant<T extends Record<string, string>>(
  flagKey: string,
  variants: T,
  defaultVariant: keyof T
): string {
  const [variantKey, setVariantKey] = useState<keyof T>(defaultVariant)
  useEffect(
    () =>
      posthog.onFeatureFlags(() => {
        const flag = posthog.getFeatureFlag(flagKey)
        setVariantKey(typeof flag === 'string' && flag in variants ? flag : defaultVariant)
      }),
    [flagKey]
  )
  return variants[variantKey]
}
