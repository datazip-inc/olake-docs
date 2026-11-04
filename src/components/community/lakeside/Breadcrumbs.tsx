import React from 'react'
import Link from '@docusaurus/Link'
import { useLocation } from '@docusaurus/router'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { truncateTitle } from '@site/src/lib/utils'

export type BreadcrumbType = 'webinar' | 'community'

const PARENT: Record<BreadcrumbType, { label: string; href: string }> = {
  webinar: { label: 'Webinars & Events', href: '/webinar' },
  community: { label: 'Community', href: '/community' }
}

const Chevron = () => (
  <svg
    width='6'
    height='10'
    viewBox='0 0 6 10'
    fill='none'
    aria-hidden='true'
    className='mx-[8px] shrink-0 text-olake-line-strong'
  >
    <path
      d='M1 1l4 4-4 4'
      stroke='currentColor'
      strokeWidth='1.3'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

const HomeMark = () => (
  <svg viewBox='0 0 24 24' width='15' height='15' fill='currentColor' aria-hidden='true'>
    <path d='M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z' />
  </svg>
)

/**
 * Home > parent > page trail with schema.org microdata (the same markup as the shared
 * CentralizedBreadcrumbs, restyled with the Lakeside tokens).
 */
export default function Breadcrumbs({ type, title }: { type: BreadcrumbType; title: string }) {
  const { siteConfig } = useDocusaurusContext()
  const location = useLocation()
  const siteUrl = siteConfig.url || 'https://olake.io'
  const parent = PARENT[type]
  const items = [
    { label: 'Home', fullLabel: 'Home', href: '/', current: false },
    { label: parent.label, fullLabel: parent.label, href: parent.href, current: false },
    { label: truncateTitle(title, 70), fullLabel: title, href: undefined, current: true }
  ]

  return (
    <nav
      aria-label='Breadcrumb'
      className='mb-[20px] lg:mb-[24px]'
      itemScope
      itemType='https://schema.org/BreadcrumbList'
    >
      <ol className='m-0 flex list-none flex-wrap items-center p-0 text-[13px] text-olake-muted lg:justify-center'>
        {items.map((item, index) => (
          <li
            key={item.fullLabel}
            className='flex items-center'
            itemProp='itemListElement'
            itemScope
            itemType='https://schema.org/ListItem'
          >
            {index > 0 && <Chevron />}
            {item.current ? (
              <>
                <span aria-label={item.fullLabel} title={item.fullLabel} className='text-olake-ink'>
                  {item.label}
                </span>
                <meta itemProp='name' content={item.fullLabel} />
                <link itemProp='item' href={`${siteUrl}${location.pathname}`} />
              </>
            ) : (
              <>
                <Link
                  to={item.href}
                  itemProp='item'
                  aria-label={item.fullLabel}
                  title={item.fullLabel}
                  className='flex items-center text-olake-muted transition-colors hover:text-olake-ink'
                >
                  {index === 0 ? <HomeMark /> : item.label}
                </Link>
                <meta itemProp='name' content={item.fullLabel} />
              </>
            )}
            <meta itemProp='position' content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  )
}
