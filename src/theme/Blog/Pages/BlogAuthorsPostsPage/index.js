import React from 'react'
import clsx from 'clsx'
import { PageMetadata, HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common'
import { BlogAuthorsListViewAllLabel } from '@docusaurus/theme-common/internal'
import Link from '@docusaurus/Link'
import Head from '@docusaurus/Head'
import { useBlogMetadata } from '@docusaurus/plugin-content-blog/client'
import BlogLayout from '@theme/BlogLayout'
import BlogPagination from '@theme/BlogPagination'
import SearchMetadata from '@theme/SearchMetadata'
import BlogPostItems from '@theme/BlogPostItems'
import AuthorProfile from '@site/src/components/blog/AuthorProfile'
import useBlogInstance, {
  authorPageTitle,
  isPaginatedPage,
  postCountLabel
} from '@theme/Blog/useBlogInstance'

// The stock title ("<name> - N posts") is identical for an author who writes in
// more than one blog instance, and the page had no meta description. Make both
// instance-specific. The title has no post count (it would change with every new post).
function useAuthorPageText({ author, listMetadata }) {
  const instance = useBlogInstance()
  const { phrase, topics } = instance
  const name = author.name || author.key
  const title = authorPageTitle(name, instance, listMetadata)
  const description = `Read ${postCountLabel(author.count)} by ${name} on ${phrase}, covering ${topics}.`
  return { title, description }
}

function Metadata(props) {
  const { title, description } = useAuthorPageText(props)
  // Later pages of an author's list, and an author with no post in this blog, are thin pages:
  // crawlable, links followed, not indexed
  const noindex = isPaginatedPage(props.listMetadata) || !props.author.count
  return (
    <>
      <PageMetadata title={title} description={description} />
      <SearchMetadata tag='blog_authors_posts' />
      {noindex && (
        <Head>
          <meta name='robots' content='noindex, follow' />
        </Head>
      )}
    </>
  )
}

function ViewAllAuthorsLink() {
  const { authorsListPath } = useBlogMetadata()
  return (
    <Link href={authorsListPath} className='ob-textlink'>
      <BlogAuthorsListViewAllLabel />
    </Link>
  )
}

function Content({ author, items, sidebar, listMetadata }) {
  return (
    <BlogLayout sidebar={sidebar} breadcrumbLabel={author.name || undefined}>
      <header className='ob-header ob-header--author'>
        <AuthorProfile as='h1' author={author} />
        {author.description && <p className='ob-lede'>{author.description}</p>}
        <ViewAllAuthorsLink />
      </header>
      <BlogPostItems items={items} />
      <BlogPagination metadata={listMetadata} />
    </BlogLayout>
  )
}

export default function BlogAuthorsPostsPage(props) {
  return (
    <HtmlClassNameProvider
      className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogAuthorsPostsPage)}
    >
      <Metadata {...props} />
      <Content {...props} />
    </HtmlClassNameProvider>
  )
}
