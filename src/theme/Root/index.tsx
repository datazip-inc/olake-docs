import React from 'react'
import AskOlake from '@site/src/components/AskOlake'

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AskOlake />
    </>
  )
}
