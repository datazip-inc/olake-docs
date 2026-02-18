/**
 * Custom useWindowSize hook that overrides the default Docusaurus breakpoint
 * from 996px to 1279px (Tailwind xl) so the mobile navbar activates earlier.
 *
 * This file is aliased in place of the original
 * @docusaurus/theme-common/lib/hooks/useWindowSize.js
 * via the navbar-breakpoint plugin.
 */
import { useEffect, useState } from 'react'
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'

const windowSizes = {
  desktop: 'desktop',
  mobile: 'mobile',
  ssr: 'ssr'
}

// Custom breakpoint: Tailwind xl = 1280px, so mobile is <= 1279px
const DesktopBreakpoint = 1279

function getWindowSize(desktopBreakpoint) {
  if (!ExecutionEnvironment.canUseDOM) {
    throw new Error('getWindowSize() should only be called after React hydration')
  }
  return window.innerWidth > desktopBreakpoint ? windowSizes.desktop : windowSizes.mobile
}

export function useWindowSize({ desktopBreakpoint = DesktopBreakpoint } = {}) {
  const [windowSize, setWindowSize] = useState(() => 'ssr')

  useEffect(() => {
    function updateWindowSize() {
      setWindowSize(getWindowSize(desktopBreakpoint))
    }
    updateWindowSize()
    window.addEventListener('resize', updateWindowSize)
    return () => {
      window.removeEventListener('resize', updateWindowSize)
    }
  }, [desktopBreakpoint])

  return windowSize
}
