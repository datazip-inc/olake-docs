import React from 'react'
import { PARTIALS, type PartialId } from '@site/docs/shared/integrations/registry'

/**
 * Renders a shared block from docs/shared/integrations by its registry id, for example
 * `<Partial id="sources/postgres/prereqs" />`. Props after `id` are passed to the partial
 * (partials read them as `props.<name>`). An unknown id fails the build, never renders empty.
 */
export default function Partial({ id, ...props }: { id: PartialId } & Record<string, unknown>) {
  const Component = PARTIALS[id]
  if (!Component) {
    throw new Error(`Unknown integration partial "${id}". Add it to docs/shared/integrations/registry.ts.`)
  }
  return <Component {...props} />
}
