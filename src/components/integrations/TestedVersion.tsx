import React from 'react'
import { useIntegration } from './useIntegration'

/**
 * The OLake Go version of the page's tested run (`integration.tested.olake`), for shared blocks
 * that need to name it inline. Imported by path, not from the index, because the index imports
 * the partial registry and a partial importing the index would make a cycle.
 */
export default function TestedVersion() {
  return <>{useIntegration().frontMatter.tested.olake}</>
}
