import React from 'react'
import clsx from 'clsx'
import { PageMetadata, HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common'
import BlogLayout from '@theme/BlogLayout'
import SearchMetadata from '@theme/SearchMetadata'
import AuthorProfile from '@site/src/components/blog/AuthorProfile'
import useBlogInstance from '@theme/Blog/useBlogInstance'
import PageHeader from '@site/src/components/blog/PageHeader'

// Swizzled from @docusaurus/theme-classic so each blog instance gets its own
// title, description and h1 (stock text is the identical "Authors" everywhere).
const AUTHORS_DESCRIPTIONS = {
  blog: 'Meet the engineers and writers behind the OLake blog, and browse the posts each author has published.',
  iceberg:
    'Meet the authors of the OLake Apache Iceberg blog and browse the Iceberg articles each of them has written.',
  'customer-stories':
    'Meet the authors behind OLake customer stories and browse the case studies each of them has written.'
}

export default function BlogAuthorsListPage({ authors, sidebar }) {
  const { key, label } = useBlogInstance()
  const title = `${label} Authors`
  const description = AUTHORS_DESCRIPTIONS[key]
  return (
    <HtmlClassNameProvider
      className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogAuthorsListPage)}
    >
      <PageMetadata title={title} description={description} />
      <SearchMetadata tag='blog_authors_list' />
      <BlogLayout sidebar={sidebar}>
        <PageHeader title={title} description={description} />
        <ul className='ob-authors'>
          {/* Authors without a page (page: false in authors.yml, e.g. no posts yet) are not listed */}
          {authors.filter((author) => author.page).map((author) => (
            <li key={author.key} className='ob-authors__item'>
              <AuthorProfile as='h2' author={author} count={author.count} link />
            </li>
          ))}
        </ul>
      </BlogLayout>
    </HtmlClassNameProvider>
  )
}
