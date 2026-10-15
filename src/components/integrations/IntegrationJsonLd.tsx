import React from 'react'
import { useDoc } from '@docusaurus/plugin-content-docs/client'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import JsonLd from '@site/src/components/JsonLd'
import { useIntegration } from './useIntegration'

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim()
}

/**
 * HowTo structured data built from the page's own "Step N" headings, so it always matches the
 * visible steps. TechArticle and BreadcrumbList are already emitted for every docs page.
 */
export default function IntegrationJsonLd() {
  const { metadata, toc } = useDoc()
  const { siteConfig } = useDocusaurusContext()
  const { source, engine, frontMatter } = useIntegration()
  const steps = toc.filter((h) => h.level === 2 && /^Step\s+\d/i.test(stripTags(h.value)))
  if (!steps.length) return null
  const pageUrl = `${siteConfig.url}${metadata.permalink.replace(/\/?$/, '/')}`
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: metadata.title,
    description: metadata.description,
    tool: [
      { '@type': 'HowToTool', name: `OLake Go ${frontMatter.tested?.olake ?? ''}`.trim() },
      { '@type': 'HowToTool', name: source.formalLabel },
      { '@type': 'HowToTool', name: engine.label }
    ],
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: stripTags(s.value),
      url: `${pageUrl}#${s.id}`
    }))
  }
  return <JsonLd data={schema} />
}
