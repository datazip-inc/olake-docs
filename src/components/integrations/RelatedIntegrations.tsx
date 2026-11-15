import React from 'react'
import Link from '@docusaurus/Link'
import { ENGINES, PAIRS, SOURCES } from '@site/src/data/integrations'
import { useIntegration } from './useIntegration'

interface Card {
  title: string
  text: string
  to: string
}

/**
 * Links at the end of the page: the other live pages for the same source and the same engine
 * (from pairs.ts), then the reference docs behind this page. Draft and planned pairs are not
 * linked, so the page never points at a URL that is not there.
 */
export default function RelatedIntegrations() {
  const { source, engine } = useIntegration()
  const live = PAIRS.filter((p) => p.status === 'live')
  const sameSource = live.filter((p) => p.source === source.id && p.engine !== engine.id)
  const sameEngine = live.filter((p) => p.engine === engine.id && p.source !== source.id)
  const cards: Card[] = [
    ...sameSource.map((p) => ({
      title: `${source.label} to ${ENGINES[p.engine].label}`,
      text: `Same source, read from ${ENGINES[p.engine].label}.`,
      to: `/docs/integrations/${p.slug}/`
    })),
    ...sameEngine.map((p) => ({
      title: `${SOURCES[p.source].label} to ${engine.label}`,
      text: `Same engine, replicated from ${SOURCES[p.source].label}.`,
      to: `/docs/integrations/${p.slug}/`
    })),
    {
      title: `${source.label} connector reference`,
      text: 'Every field, sync mode and troubleshooting note for the source.',
      to: source.docsPath
    },
    {
      title: 'Query engine compatibility',
      text: 'Which engines read which catalogs and delete formats.',
      to: '/docs/understanding/compatibility-engines/'
    },
    {
      title: 'All integrations',
      text: 'Every source and engine pair with a tested guide.',
      to: '/docs/integrations/'
    }
  ]
  return (
    <div className='olake-related grid grid-cols-1 gap-[12px] md:grid-cols-2'>
      {cards.map((c) => (
        <Link
          key={c.to + c.title}
          to={c.to}
          className='lk-lift flex flex-col gap-[4px] rounded-[12px] border border-solid border-olake-line bg-olake-surface p-[16px] no-underline hover:border-olake-line-strong'
        >
          <span className='text-[15px] font-medium text-olake-ink'>{c.title}</span>
          <span className='text-[13px] text-olake-muted'>{c.text}</span>
        </Link>
      ))}
    </div>
  )
}
