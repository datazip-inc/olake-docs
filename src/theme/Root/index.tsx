import React from 'react'
import '@site/src/lib/posthog/client'

export default function Root({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
