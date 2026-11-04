import React, { useId, useState } from 'react'
import clsx from 'clsx'

/**
 * "On this page": a compact collapsible card above the article body (`variant='card'`) and, on wide
 * screens, below the sticky call-to-action card (`variant='rail'`). Collapsed by default (the
 * same on the server and in the browser, so nothing shifts when the page hydrates); the headings
 * stay in the HTML either way. `toc` is Docusaurus' table of contents of the post
 * ({ value (HTML), id, level }); the links are plain in-page anchors.
 */
export default function PostToc({ toc, minLevel = 2, maxLevel = 3, variant = 'card', label = 'Table of contents' }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const items = (toc || []).filter((item) => item.level >= minLevel && item.level <= maxLevel)
  if (items.length === 0) return null

  return (
    <nav className={clsx('ob-toc', variant === 'rail' && 'ob-toc--rail', open && 'ob-toc--open')} aria-label={label}>
      <button
        type='button'
        className='ob-toc__toggle'
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className='ob-toc__label'>On this page</span>
        <span className='ob-toc__count'>{items.length} sections</span>
        <svg
          className='ob-toc__chevron'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          aria-hidden='true'
        >
          <path d='M6 9l6 6 6-6' />
        </svg>
      </button>
      <div id={panelId} className='ob-toc__panel'>
        <div className='ob-toc__clip'>
          <ul className='ob-toc__list'>
            {items.map((item) => (
              <li key={item.id} className={clsx(item.level > minLevel && 'ob-toc__item--sub')}>
                {/* value is the heading's rendered HTML (it may contain <code>), as in the stock TOC */}
                <a href={`#${item.id}`} dangerouslySetInnerHTML={{ __html: item.value }} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
