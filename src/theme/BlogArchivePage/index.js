import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import Head from '@docusaurus/Head'
import { PageMetadata, HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common'
import { useDateTimeFormat } from '@site/src/lib/docusaurus'
import BlogLayout from '@theme/BlogLayout'
import useBlogInstance from '@theme/Blog/useBlogInstance'
import PageHeader from '@site/src/components/blog/PageHeader'

// Swizzled from @docusaurus/theme-classic so each blog instance gets its own
// title, description and h1 (stock text is the identical "Archive" everywhere).
const ARCHIVE_DESCRIPTIONS = {
  blog: 'Browse every OLake blog post by year: data replication, CDC, Apache Iceberg and lakehouse guides from the OLake team.',
  iceberg:
    'Browse all OLake Apache Iceberg articles by year: partitioning, catalogs, query engines and lakehouse how-to guides.',
  'customer-stories':
    'Browse all OLake customer stories and case studies by year, from teams replicating databases to Apache Iceberg.'
}

// The plugin hands posts over newest first; keep that order inside each year
function listPostsByYears(blogPosts) {
  const postsByYear = blogPosts.reduce((years, post) => {
    const year = post.metadata.date.split('-')[0]
    const posts = years.get(year) ?? []
    posts.push(post)
    return years.set(year, posts)
  }, new Map())
  return Array.from(postsByYear, ([year, posts]) => ({ year, posts }))
}

function Year({ year, posts, formatDate }) {
  return (
    <section className='ob-year'>
      <div className='ob-year__head'>
        <h2 id={year} className='ob-year__label'>
          {year}
        </h2>
        <p className='ob-year__count'>{posts.length === 1 ? '1 post' : `${posts.length} posts`}</p>
      </div>
      <ul className='ob-year__list'>
        {posts.map((post) => (
          <li key={post.metadata.permalink}>
            <Link to={post.metadata.permalink} className='ob-row'>
              <time className='ob-row__date' dateTime={post.metadata.date}>
                {formatDate(post.metadata.date)}
              </time>
              <span className='ob-row__title'>{post.metadata.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function BlogArchive({ archive }) {
  const { key, label } = useBlogInstance()
  const title = `${label} Archive`
  const description = ARCHIVE_DESCRIPTIONS[key]
  const years = listPostsByYears(archive.blogPosts)
  // Fixed locale and UTC: same text on the server and in the browser
  const dateFormat = useDateTimeFormat({ day: 'numeric', month: 'short', timeZone: 'UTC' })
  const formatDate = (date) => dateFormat.format(new Date(date))

  return (
    <HtmlClassNameProvider
      className={clsx(ThemeClassNames.wrapper.blogPages, 'blog-archive-page')}
    >
      <PageMetadata title={title} description={description} />
      {/* The archive only repeats the post list the blog already links: crawlable, not indexed */}
      <Head>
        <meta name='robots' content='noindex, follow' />
      </Head>
      <BlogLayout>
        <PageHeader title={title} description={description} />
        {years.map((props) => (
          <Year key={props.year} {...props} formatDate={formatDate} />
        ))}
      </BlogLayout>
    </HtmlClassNameProvider>
  )
}
