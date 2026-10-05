import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import { BLOG_CATEGORIES, categoryPermalink } from './categories'

/**
 * Filter row for the blog list: "All" plus one link per category. Each link goes to a real page
 * (the blog home or the category's tag page), so filtering is paginated and crawlable.
 * `active` is a category slug, or undefined for "All".
 */
export default function CategoryFilter({ active }) {
  return (
    <nav aria-label='Blog categories' className='ob-cats'>
      <ul className='ob-cats__list'>
        <li>
          <Link
            to='/blog/'
            className={clsx('ob-chip ob-chip--lg', !active && 'ob-chip--active')}
            aria-current={!active ? 'page' : undefined}
          >
            All
          </Link>
        </li>
        {BLOG_CATEGORIES.map((c) => (
          <li key={c.slug}>
            <Link
              to={categoryPermalink(c.slug)}
              className={clsx('ob-chip ob-chip--lg', active === c.slug && 'ob-chip--active')}
              aria-current={active === c.slug ? 'page' : undefined}
            >
              {c.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
