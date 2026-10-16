import { useDoc } from '@docusaurus/plugin-content-docs/client'
import {
  CATALOGS,
  ENGINES,
  PEOPLE,
  SOURCES,
  sortCatalogs,
  type Catalog,
  type CatalogId,
  type Engine,
  type IntegrationFrontMatter,
  type Person,
  type Source
} from '@site/src/data/integrations'

export interface Integration {
  frontMatter: IntegrationFrontMatter
  source: Source
  engine: Engine
  /** Catalogs offered on this page, in display order. */
  catalogs: Catalog[]
  defaultCatalog: Catalog
  author: Person | undefined
  reviewer: Person | undefined
}

/**
 * The page's `integration:` front matter, resolved against the data layer. Components call this
 * instead of taking props, so the page body never repeats what the front matter already says.
 */
export function useIntegration(): Integration {
  const { frontMatter } = useDoc()
  const fm = (frontMatter as { integration?: IntegrationFrontMatter }).integration
  if (!fm) {
    throw new Error('This component needs an `integration:` block in the page front matter.')
  }
  const source = SOURCES[fm.source]
  const engine = ENGINES[fm.engine]
  if (!source || !engine) {
    throw new Error(`Unknown integration source or engine: ${fm.source} -> ${fm.engine}`)
  }
  const catalogIds: CatalogId[] = sortCatalogs(fm.catalogs ?? [])
  const catalogs = catalogIds.map((id) => CATALOGS[id]).filter(Boolean)
  const defaultCatalog = CATALOGS[fm.default] ?? catalogs[0]
  return {
    frontMatter: fm,
    source,
    engine,
    catalogs,
    defaultCatalog,
    author: PEOPLE[fm.author],
    reviewer: PEOPLE[fm.reviewer]
  }
}
