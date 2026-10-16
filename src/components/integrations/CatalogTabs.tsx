import React, { type ReactNode } from 'react'
import Tabs from '@theme/Tabs'
import { useIntegration } from './useIntegration'

/**
 * The catalog picker. A plain Docusaurus Tabs with `groupId="catalog"` and `?catalog=` in the
 * URL, so the choice persists across every integration page and deep links work. The tab list
 * and order come from the page front matter through the data layer; the children are
 * `<TabItem value="<catalog id>">` blocks. Every panel is in the HTML (hidden, not removed), so
 * search engines read all of them; the default tab is the engine's native catalog.
 */
export default function CatalogTabs({ children }: { children: ReactNode }) {
  const { catalogs, defaultCatalog } = useIntegration()
  return (
    <Tabs
      groupId='catalog'
      queryString='catalog'
      defaultValue={defaultCatalog.id}
      values={catalogs.map((c) => ({ value: c.id, label: c.label }))}
    >
      {children}
    </Tabs>
  )
}
