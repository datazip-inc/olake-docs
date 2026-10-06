import React from 'react'
import clsx from 'clsx'
import Translate from '@docusaurus/Translate'
import { PageMetadata, HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common'
import Link from '@docusaurus/Link'
import Head from '@docusaurus/Head'
import BlogLayout from '@theme/BlogLayout'
import SearchMetadata from '@theme/SearchMetadata'
import BlogPostItems from '@theme/BlogPostItems'
import BlogPagination from '@theme/BlogPagination'
import Unlisted from '@theme/ContentVisibility/Unlisted'
import useBlogInstance, {
  isPaginatedPage,
  postCountLabel,
  tagPageTitle
} from '@theme/Blog/useBlogInstance'
import PageHeader from '@site/src/components/blog/PageHeader'
import CategoryFilter from '@site/src/components/blog/CategoryFilter'
import { categoryOf } from '@site/src/components/blog/categories'

// Swizzled from @docusaurus/theme-classic. The stock title/description
// ('One post tagged with "Trino"' / 'Blogs on the topic Trino') is identical
// across the three blog instances, so it is made instance-specific here. The title has no post
// count (it would change with every new post); the description keeps it.
function useTagPageText({ tag, listMetadata }) {
  const instance = useBlogInstance()
  const { phrase } = instance
  const title = tagPageTitle(tag.label, instance, listMetadata)
  const description = `Read ${postCountLabel(tag.count)} tagged "${tag.label}" on ${phrase}, with guides and technical write-ups from the OLake team.`
  return { title, description }
}

function BlogTagsPostsPageMetadata(props) {
  const { title, description } = useTagPageText(props)
  return (
    <>
      <PageMetadata title={title} description={description} />
      <SearchMetadata tag='blog_tags_posts' />
      {/* Page 2 and later are thin continuations of page 1: crawlable, not indexed */}
      {isPaginatedPage(props.listMetadata) && (
        <Head>
          <meta name='robots' content='noindex, follow' />
        </Head>
      )}
    </>
  )
}

function BlogTagsPostsPageContent(props) {
  const { tag, items, sidebar, listMetadata } = props
  // The stock title has straight quotes, which Geist draws as a closing quote at display size;
  // show typographic quotes in the visible heading (the <title> tag keeps straight quotes).
  // No count and no blog name in the heading: 'Posts tagged “Trino”'.
  const heading = `Posts tagged “${tag.label}”`
  // A category page (How-To, Benchmarks, ...) is headed by the category name and shows the filter row
  const { key: instanceKey } = useBlogInstance()
  const category = categoryOf(tag, instanceKey)
  return (
    <BlogLayout sidebar={sidebar} breadcrumbLabel={tag.label}>
      {tag.unlisted && <Unlisted />}
      <PageHeader title={category ? category.label : heading} description={tag.description}>
        {category ? (
          <CategoryFilter active={category.slug} />
        ) : (
          <Link href={tag.allTagsPath} className='ob-textlink'>
            <Translate
              id='theme.tags.tagsPageLink'
              description='The label of the link targeting the tag list page'
            >
              View All Tags
            </Translate>
          </Link>
        )}
      </PageHeader>
      <BlogPostItems items={items} />
      <BlogPagination metadata={listMetadata} />
    </BlogLayout>
  )
}

export default function BlogTagsPostsPage(props) {
  return (
    <HtmlClassNameProvider
      className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogTagPostListPage)}
    >
      <BlogTagsPostsPageMetadata {...props} />
      <BlogTagsPostsPageContent {...props} />
    </HtmlClassNameProvider>
  )
}
