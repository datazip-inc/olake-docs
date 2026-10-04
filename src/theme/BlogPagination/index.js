import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'

/**
 * Page numbers to show: the first and last page, the current page and its neighbours, with
 * 'ellipsis' markers for the gaps. Up to 7 pages are listed in full.
 */
function pageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, total, current - 1, current, current + 1])
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p))
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((p) => pages.add(p))
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('ellipsis')
    out.push(p)
  })
  return out
}

const Arrow = ({ dir }) => (
  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d={dir === 'prev' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
  </svg>
)

/**
 * Numbered pagination for list pages, tag pages and author pages. Everything comes from the
 * page metadata (permalink, page, totalPages), so it works the same in every blog instance
 * and renders identically on the server and in the browser.
 */
export function BlogPagination({ metadata }) {
  if (!metadata || !metadata.totalPages || metadata.totalPages <= 1) return null

  const { page, totalPages } = metadata
  // The page-1 permalink of this list, e.g. /blog, /blog/tags/trino or /blog/authors/akshay
  const base = (metadata.permalink || '/').replace(/\/page\/\d+\/?$/, '').replace(/\/$/, '')
  const pagePath = (n) => (n === 1 ? base || '/' : `${base}/page/${n}`)

  const hasPrev = page > 1
  const hasNext = page < totalPages

  return (
    <nav className='ob-pager' aria-label='Blog list page navigation'>
      {hasPrev ? (
        <Link to={pagePath(page - 1)} rel='prev' className='ob-pager__item ob-pager__step' aria-label='Previous page'>
          <Arrow dir='prev' />
          <span className='ob-pager__text'>Previous</span>
        </Link>
      ) : (
        <span className='ob-pager__item ob-pager__step ob-pager__item--disabled' aria-hidden='true'>
          <Arrow dir='prev' />
          <span className='ob-pager__text'>Previous</span>
        </span>
      )}

      <ul className='ob-pager__pages'>
        {pageList(page, totalPages).map((p, i) => (
          <li key={`${p}-${i}`}>
            {p === 'ellipsis' ? (
              <span className='ob-pager__gap' aria-hidden='true'>
                …
              </span>
            ) : (
              <Link
                to={pagePath(p)}
                className={clsx('ob-pager__item', p === page && 'ob-pager__item--current')}
                aria-current={p === page ? 'page' : undefined}
                aria-label={`Page ${p}`}
              >
                {p}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {hasNext ? (
        <Link to={pagePath(page + 1)} rel='next' className='ob-pager__item ob-pager__step' aria-label='Next page'>
          <span className='ob-pager__text'>Next</span>
          <Arrow dir='next' />
        </Link>
      ) : (
        <span className='ob-pager__item ob-pager__step ob-pager__item--disabled' aria-hidden='true'>
          <span className='ob-pager__text'>Next</span>
          <Arrow dir='next' />
        </span>
      )}
    </nav>
  )
}

export default BlogPagination
