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
import Head from '@docusaurus/Head'

function BlogListPageMetadata(props) {
  const { metadata } = props
  const {
    siteConfig: { title: siteTitle, url: siteUrl }
  } = useDocusaurusContext()
  const { blogDescription, blogTitle, permalink } = metadata
  const isBlogOnlyMode = permalink === '/'
  const title = isBlogOnlyMode ? siteTitle : blogTitle
  const location = useLocation()
  
  // Check if this is a pagination page (page/2, page/3, etc.)
  const isPaginationPage = /\/page\/\d+/.test(location.pathname)

  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag='blog_posts_list' />
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        {blogDescription && <meta property="og:description" content={blogDescription} />}
        <meta property="og:url" content={`${siteUrl}${permalink}`} />
        <meta property="og:site_name" content="OLake" />
        <meta property="og:locale" content="en_US" />
        {isPaginationPage && <meta name="robots" content="noindex, follow" />}
      </Head>
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
      {/* Preload first blog card image to improve LCP on listing */}
      {items && items[0]?.content?.metadata?.frontMatter?.image && (
        <Head>
          <link
            rel='preload'
            as='image'
            href={useBaseUrl(items[0].content.metadata.frontMatter.image)}
            imagesizes='(max-width: 1024px) 100vw, 33vw'
            fetchpriority='high'
          />
        </Head>
      )}
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




