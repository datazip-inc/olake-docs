/**
 * Forces light mode by setting data-theme="light" on <html>.
 * Restores the user's previous theme preference on unmount.
 */

import { useEffect, useRef } from 'react'

export default function LightModeEnforcer() {
  const previousThemeRef = useRef(null)

  useEffect(() => {
    const html = document.documentElement

    // Store the user's current theme preference before overriding
    previousThemeRef.current = html.getAttribute('data-theme') || 'light'

    // Force light mode
    html.setAttribute('data-theme', 'light')

    // Cleanup: restore the user's preference when navigating away
    return () => {
      if (previousThemeRef.current) {
        html.setAttribute('data-theme', previousThemeRef.current)
      }
    }
  }, [])

  return null
}
