import React from 'react'
import clsx from 'clsx'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { PageMetadata, HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common'
import BlogLayout from '@theme/BlogLayout'
import SearchMetadata from '@theme/SearchMetadata'
import BlogPostItems from '@theme/BlogPostItems'
import Image from '@theme/IdealImage'
import useBaseUrl from '@docusaurus/useBaseUrl'
import { useLocation } from '@docusaurus/router'

import { BlogPagination } from '../BlogPagination'
import QueryEngineAdvertisement from '../../components/Iceberg/QueryEngineAdvertisement'
import BlogBreadcrumbs from '../BlogBreadcrumbs'

function BlogListPageMetadata(props) {
  const { metadata } = props
  const {
    siteConfig: { title: siteTitle }
  } = useDocusaurusContext()
  const { blogDescription, blogTitle, permalink } = metadata
  const isBlogOnlyMode = permalink === '/'
  const title = isBlogOnlyMode ? siteTitle : blogTitle

  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag='blog_posts_list' />
    </>
  )
}

function BlogHomepageBanner(props) {
  const blogMetadata = props.metadata

  // Hero_Visual
  return (
    <div className='blog'>

      <div className='text-center'>
        <h2 className='mb-2 text-xl font-bold md:text-2xl lg:text-3xl'>{blogMetadata.blogTitle}</h2>
        <p className=''>{blogMetadata.blogDescription}</p>
      </div>
    </div>
  )
}

// Updated BlogListPageContent with conditional advertisement
function BlogListPageContent(props) {
  const { metadata, items, sidebar } = props
  const location = useLocation()

  // Check if we're on the iceberg route
  const isIcebergRoute = location.pathname === '/iceberg' || location.pathname === '/iceberg/'

  return (
    <BlogLayout sidebar={sidebar}>
      <div className="container mx-auto px-4 py-6">
        <BlogBreadcrumbs />
      </div>
      <BlogHomepageBanner {...props} />
      {/* Conditionally render Query Engine Advertisement */}
      {isIcebergRoute && <QueryEngineAdvertisement />}
      <BlogPostItems items={items} />
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




