import React from 'react'
import type { ReactNode } from 'react'
import type { Props } from '@theme/DocBreadcrumbs/StructuredData'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import JsonLd from '@site/src/components/JsonLd'

/**
 * BreadcrumbList for a docs page. The stock component lists only the sidebar trail, so a doc that
 * sits at the top of the sidebar produced a one-item list (Google needs two or more), and it left
 * out the home page. This one starts with Home and gives every item the trailing-slash URL the
 * site is served from (trailingSlash: true), the same URLs as the canonical.
 */
export default function DocBreadcrumbsStructuredData({ breadcrumbs }: Props): ReactNode {
  const { siteConfig } = useDocusaurusContext()
  const withSlash = (href: string) => `${siteConfig.url}${href.replace(/\/?$/, '/')}`
  const trail = breadcrumbs
    // An item without a link is not allowed in the list
    .filter((breadcrumb) => breadcrumb.href)
    .map((breadcrumb) => ({ name: breadcrumb.label, item: withSlash(breadcrumb.href as string) }))
  const items = [{ name: 'Home', item: `${siteConfig.url}/` }, ...trail]
  if (items.length < 2) return null

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': items.map((entry, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': entry.name,
          'item': entry.item
        }))
      }}
    />
  )
}
