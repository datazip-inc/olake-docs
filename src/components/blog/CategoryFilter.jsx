import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import useBlogInstance from '@theme/Blog/useBlogInstance'
import { CATEGORY_SETS, categoryPermalink } from './categories'

/**
 * Filter row for a blog list: "All" plus one link per category of the current blog instance. Each
 * link goes to a real page (the list or the category's tag page), so filtering is paginated and
 * crawlable. `active` is a category slug, or undefined for "All".
 */
export default function CategoryFilter({ active }) {
  const { key } = useBlogInstance()
  const { base, categories } = CATEGORY_SETS[key]
  return (
    <nav aria-label='Categories' className='ob-cats'>
      <ul className='ob-cats__list'>
        <li>
          <Link
            to={base}
            className={clsx('ob-chip ob-chip--lg', !active && 'ob-chip--active')}
            aria-current={!active ? 'page' : undefined}
          >
            All
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              to={categoryPermalink(key, c.slug)}
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
