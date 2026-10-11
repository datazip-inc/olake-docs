import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import { usePluginData } from '@docusaurus/useGlobalData'
import useBlogInstance from '@theme/Blog/useBlogInstance'
import { CATEGORY_SETS, categoryPermalink } from './categories'

// Docusaurus plugin id of each blog instance (docusaurus.config.js)
const PLUGIN_IDS = {
  blog: 'olake-blog',
  'customer-stories': 'customer-stories-blog',
  learn: 'learn-blog',
  compare: 'compare-blog'
}

const trimSlash = (p) => p.replace(/\/+$/, '')

/**
 * Filter row for a blog list: "All" plus one link per category of the current blog instance. Each
 * link goes to a real page (the list or the category's tag page), so filtering is paginated and
 * crawlable. `active` is a category slug, or undefined for "All". A category whose tag has no posts
 * has no page (Docusaurus builds a tag page only for a tag in use), so its chip is left out; with no
 * chip left, or for an instance without categories, the row is not rendered.
 */
export default function CategoryFilter({ active }) {
  const { key } = useBlogInstance()
  const { base, categories: all } = CATEGORY_SETS[key]
  const { tagPermalinks = [] } = usePluginData('docusaurus-plugin-content-blog', PLUGIN_IDS[key]) ?? {}
  const withPosts = new Set(tagPermalinks.map(trimSlash))
  const categories = all.filter((c) => withPosts.has(trimSlash(categoryPermalink(key, c.slug))))
  if (categories.length === 0) return null
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
