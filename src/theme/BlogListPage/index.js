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
  const imageDefault = {
    urlBannerBg:
      '/img/olake/olake-home.svg',
    urlBannerBgWhite:
      '/img/olake/olake-home-white.svg',
    urlAvatar:
      '/img/logo/olake-blue.svg'
  }
  // Hero_Visual
  return (
    <div className='blog'>
      <div className='relative'>
        <Image
          img={useBaseUrl(imageDefault.urlBannerBg)}
          alt='Blog banner'
          className='rounded-lg dark:block hidden'
          loading='lazy'
        />

        <Image
          img={useBaseUrl(imageDefault.urlBannerBgWhite)}
          alt='Blog banner'
          className='rounded-lg dark:hidden block'
          loading='lazy'
        />

        <Image
          img={useBaseUrl(imageDefault.urlAvatar)}
          alt='avatar blog'
          className='absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 transform rounded-full p-2'
          width={100}
          height={100}
          loading='lazy'
        />
      </div>
      <div className='my-20 text-center'>
        <h2 className='mb-2 text-xl font-bold md:text-2xl lg:text-3xl'>{blogMetadata.blogTitle}</h2>
        <p className=''>{blogMetadata.blogDescription}</p>
      </div>
    </div>
  )
}

// function BlogListPageContent(props) {
//   const { metadata, items, sidebar } = props

//   return (
//     <BlogLayout sidebar={sidebar}>
//       <BlogHomepageBanner {...props} />
//       <BlogPostItems items={items} />
//       <BlogPagination metadata={metadata} />
//     </BlogLayout>
//   )
// }

// Updated BlogListPageContent with conditional advertisement
function BlogListPageContent(props) {
  const { metadata, items, sidebar } = props
  const location = useLocation()
  
  // Check if we're on the iceberg route
  const isIcebergRoute = location.pathname === '/iceberg' || location.pathname === '/iceberg/'

  return (
    <BlogLayout sidebar={sidebar}>
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




