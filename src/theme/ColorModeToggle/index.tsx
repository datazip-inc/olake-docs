import React from 'react'
import { flushSync } from 'react-dom'
import ColorModeToggle from '@theme-original/ColorModeToggle'
import type { Props } from '@theme/ColorModeToggle'

// Wrapped so the theme change runs inside a view transition: the browser fades a snapshot of the old
// page into the new one as a single layer (timing in motion.css), so every surface changes together.
// Without the API, or with reduced motion, the theme swaps in one frame (see uiFeel.ts).
export default function ColorModeToggleWrapper(props: Props) {
  const onChange: Props['onChange'] = (colorMode) => {
    const instant =
      typeof document.startViewTransition !== 'function' ||
      document.hidden ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (instant) {
      props.onChange(colorMode)
      return
    }
    // flushSync commits the new theme inside the callback, before the browser takes the new snapshot.
    // `ready` rejects when a second click skips this transition; the theme still changes.
    document
      .startViewTransition(() => flushSync(() => props.onChange(colorMode)))
      .ready.catch(() => {})
  }

  return <ColorModeToggle {...props} onChange={onChange} />
}
