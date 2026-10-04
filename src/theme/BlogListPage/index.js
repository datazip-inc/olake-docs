import React from 'react'
import clsx from 'clsx'
import { HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common'
import BlogLayout from '@theme/BlogLayout'
import BlogPostItems from '@theme/BlogPostItems'
import useBaseUrl from '@docusaurus/useBaseUrl'
import Head from '@docusaurus/Head'

import BlogListPageMetadata from './Metadata'
import { BlogPagination } from '../BlogPagination'
import PageHeader from '@site/src/components/blog/PageHeader'

function BlogListPageContent(props) {
  const { metadata, items, sidebar } = props

  // The first card's cover is the largest contentful paint element: preload it
  const firstImage = items?.[0]?.content?.metadata?.frontMatter?.image
  const firstImageUrl = useBaseUrl(firstImage || '')

  return (
    <BlogLayout sidebar={sidebar} hideBreadcrumbs>
      {firstImage && (
        <Head>
          <link
            rel='preload'
            as='image'
            href={firstImageUrl}
            imagesizes='(max-width: 1024px) 100vw, 33vw'
            fetchpriority='high'
          />
        </Head>
      )}
      <PageHeader title={metadata.blogTitle} description={metadata.blogDescription} />
      <BlogPostItems items={items} featured={metadata.page === 1} />
      <BlogPagination metadata={metadata} />
    </BlogLayout>
  )
}

export default function BlogListPage(props) {
  return (
    <HtmlClassNameProvider
      className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogListPage)}
    >
      <BlogListPageMetadata {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  )
}
