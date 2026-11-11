import React, { useEffect } from 'react'
import { useHistory } from '@docusaurus/router'

/**
 * Lets the browser paint before a client-side page change starts.
 *
 * A tap on an internal link calls `history.push` inside the click handler, and React then renders
 * the whole next page before the browser can paint. On a mid-range phone that is 300 to 400 ms with
 * no visible reaction, which is what Interaction to Next Paint (INP) measures.
 *
 * Here a `history.push` to another page that is made during a real click waits for the next frame.
 * The browser paints the pressed state first and the page change starts right after. The time to
 * the new page is the same; the tap is answered at once.
 *
 * Left alone on purpose: `history.replace` (tabs write `?catalog=` with it), pushes that stay on the
 * same page (anchors, query strings), and pushes made outside a click (search results chosen with
 * the keyboard, redirects in code).
 */
function useYieldBeforeNavigation() {
  const history = useHistory()

  useEffect(() => {
    let inClick = false
    const onClick = (event: MouseEvent) => {
      if (!event.isTrusted) return
      inClick = true
      // A timer runs after the whole click dispatch, so the flag covers every click handler
      window.setTimeout(() => {
        inClick = false
      }, 0)
    }

    const pathnameOf = (to: unknown): string | undefined => {
      if (typeof to === 'string') return to.split(/[?#]/)[0] || undefined
      if (to && typeof to === 'object') return (to as { pathname?: string }).pathname
      return undefined
    }

    const push = history.push
    const yieldingPush = ((...args: Parameters<typeof push>) => {
      const pathname = pathnameOf(args[0])
      if (!inClick || !pathname || pathname === history.location.pathname) return push(...args)

      let done = false
      const run = () => {
        if (done) return
        done = true
        push(...args)
      }
      // After the next paint. The second timer covers a tab that gets no animation frame.
      window.requestAnimationFrame(() => window.setTimeout(run, 0))
      window.setTimeout(run, 150)
    }) as typeof push

    history.push = yieldingPush
    window.addEventListener('click', onClick, true)
    return () => {
      window.removeEventListener('click', onClick, true)
      if (history.push === yieldingPush) history.push = push
    }
  }, [history])
}

export default function Root({ children }: { children: React.ReactNode }) {
  useYieldBeforeNavigation()
  return <>{children}</>
}
