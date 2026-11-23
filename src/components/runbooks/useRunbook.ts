import { useDoc } from '@docusaurus/plugin-content-docs/client'
import { FAMILIES, PEOPLE, type Person, type RunbookFamily, type RunbookFrontMatter } from '@site/src/data/runbooks'

export interface Runbook {
  frontMatter: RunbookFrontMatter
  family: RunbookFamily
  author: Person | undefined
  reviewer: Person | undefined
}

/** The page's `runbook:` front matter, resolved against the data layer. */
export function useRunbook(): Runbook {
  const { frontMatter } = useDoc()
  const fm = (frontMatter as { runbook?: RunbookFrontMatter }).runbook
  if (!fm) {
    throw new Error('This component needs a `runbook:` block in the page front matter.')
  }
  const family = FAMILIES[fm.family]
  if (!family) {
    throw new Error(`Unknown runbook family: ${fm.family}`)
  }
  return {
    frontMatter: fm,
    family,
    author: PEOPLE[fm.author],
    reviewer: fm.reviewer ? PEOPLE[fm.reviewer] : undefined
  }
}
