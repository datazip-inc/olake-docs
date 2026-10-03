import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import { PageMetadata, HtmlClassNameProvider, ThemeClassNames, listTagsByLetters } from '@docusaurus/theme-common'
import BlogLayout from '@theme/BlogLayout'
import SearchMetadata from '@theme/SearchMetadata'
import useBlogInstance from '@theme/Blog/useBlogInstance'
import PageHeader from '@site/src/components/blog/PageHeader'

// Swizzled from @docusaurus/theme-classic so each blog instance gets its own
// title, description and h1 (stock text is the identical "Tags" everywhere).
const TAGS_DESCRIPTIONS = {
  blog: 'Browse OLake blog posts by topic tag, from CDC and data replication to Apache Iceberg, catalogs and query engines.',
  iceberg:
    'Browse OLake Apache Iceberg articles by topic tag, including partitioning, catalogs, query engines and migrations.',
  'customer-stories':
    'Browse OLake customer stories by topic tag to find case studies for your database, catalog or query engine.'
}

export default function BlogTagsListPage({ tags, sidebar }) {
  const { key, label } = useBlogInstance()
  const title = `${label} Tags`
  const description = TAGS_DESCRIPTIONS[key]
  return (
    <HtmlClassNameProvider
      className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogTagsListPage)}
    >
      <PageMetadata title={title} description={description} />
      <SearchMetadata tag='blog_tags_list' />
      <BlogLayout sidebar={sidebar}>
        <PageHeader title={title} description={description} />
        {listTagsByLetters(tags).map(({ letter, tags: letterTags }) => (
          <section key={letter} className='ob-year'>
            <div className='ob-year__head'>
              <h2 id={letter} className='ob-year__label'>
                {letter}
              </h2>
            </div>
            <ul className='ob-taglist'>
              {letterTags.map((tag) => (
                <li key={tag.permalink}>
                  <Link to={tag.permalink} rel='tag' title={tag.description} className='ob-chip ob-chip--lg'>
                    {tag.label}
                    <span className='ob-chip__count'>{tag.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </BlogLayout>
    </HtmlClassNameProvider>
  )
}
