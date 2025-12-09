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

  const isIcebergListing = permalink.startsWith('/iceberg')

  const primaryUrl = 'https://olake.io/'
  const blogUrl = `${siteUrl}${permalink}`

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OLake',
    url: primaryUrl,
    logo: {
      '@type': 'ImageObject',
      url: 'https://olake.io/img/logo/olake-blue.svg',
      width: 32,
      height: 32
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'hello@olake.io'
      }
    ],
    sameAs: [
      'https://github.com/datazip-inc/olake',
      'https://x.com/_olake',
      'https://www.linkedin.com/company/datazipio/',
      'https://www.youtube.com/@olakeio'
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '16192 COASTAL HWY',
      addressLocality: 'LEWES',
      addressRegion: 'DE',
      postalCode: '19958',
      addressCountry: 'US'
    }
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: primaryUrl,
    name: 'Fastest Open Source Data Replication Tool',
    description:
      'Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.',
    publisher: {
      '@type': 'Organization',
      name: 'OLake'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://olake.io/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  const blogCollectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: blogUrl,
    name: 'Blog | OLake',
    description:
      'Read in-depth technical guides and product updates from the OLake team — covering Apache Iceberg, data lakehouse architecture, connectors, and open-source replication.',
    isPartOf: {
      '@type': 'WebSite',
      url: primaryUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'OLake',
      url: primaryUrl
    }
  }

  const blogBreadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: primaryUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: blogUrl
      }
    ]
  }

  const blogItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Blogs on OLake',
    url: blogUrl,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        url: 'https://olake.io/blog/iceberg-vs-parquet-table-format-vs-file-format/',
        name: 'Parquet vs. Iceberg: From File Format to Data Lakehouse King'
      },
      {
        '@type': 'ListItem',
        position: 2,
        url: 'https://olake.io/blog/apache-polaris-lakehouse/',
        name: 'Building a Scalable Lakehouse with Iceberg, Trino, OLake & Apache Polaris'
      },
      {
        '@type': 'ListItem',
        position: 3,
        url: 'https://olake.io/blog/2025/10/03/iceberg-metadata/',
        name: 'Apache Iceberg Metadata Explained: Snapshots & Manifests'
      },
      {
        '@type': 'ListItem',
        position: 4,
        url: 'https://olake.io/blog/apache-iceberg-hive-comparison/',
        name: 'Apache Iceberg vs Hive: Data Lakehouse Comparison Guide'
      },
      {
        '@type': 'ListItem',
        position: 5,
        url: 'https://olake.io/blog/how-to-set-up-mongodb-apache-iceberg/',
        name: 'How to Set Up MongoDB Apache Iceberg Replication Guide'
      },
      {
        '@type': 'ListItem',
        position: 6,
        url: 'https://olake.io/blog/mysql-apache-iceberg-replication/',
        name: 'MySQL to Apache Iceberg Replication | Modern Analytics Pipeline'
      }
    ]
  }

  const icebergMainEntity = {
    '@type': 'ItemList',
    name: 'Iceberg posts',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Article',
          name: 'All about Iceberg Partitioning and Partitioning Writing Strategies',
          url: 'https://olake.io/iceberg/iceberg-partitioning-and-writing-strategies/',
          author: { '@type': 'Person', name: 'Badal Prasad Singh' },
          datePublished: '2025-06-24',
          timeRequired: 'PT9M'
        }
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Article',
          name: 'OLake + Glue + Snowflake - A Deep Dive into Modern Data Partitioning',
          url: 'https://olake.io/iceberg/olake-glue-snowflake/',
          author: { '@type': 'Person', name: 'Merlyn Mathew' },
          datePublished: '2025-05-28',
          timeRequired: 'PT10M'
        }
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Article',
          name: 'Iceberg Partitioning vs. Hive Partitioning',
          url: 'https://olake.io/iceberg/hive-partitioning-vs-iceberg-partitioning/',
          author: { '@type': 'Person', name: 'Sandeep Devarapalli' },
          datePublished: '2025-05-13',
          timeRequired: 'PT30M'
        }
      },
      {
        '@type': 'ListItem',
        position: 4,
        item: {
          '@type': 'Article',
          name: 'OLake for Simple Iceberg Ingestion using Glue Catalog, Athena for Query',
          url: 'https://olake.io/iceberg/olake-iceberg-athena/',
          author: { '@type': 'Person', name: 'Merlyn Mathew' },
          datePublished: '2025-05-08',
          timeRequired: 'PT7M'
        }
      },
      {
        '@type': 'ListItem',
        position: 5,
        item: {
          '@type': 'Article',
          name: 'OLake for Simple Iceberg Ingestion using Glue Catalog, Trino for Query',
          url: 'https://olake.io/iceberg/olake-iceberg-trino/',
          author: { '@type': 'Person', name: 'Merlyn Mathew' },
          datePublished: '2025-05-08',
          timeRequired: 'PT12M'
        }
      },
      {
        '@type': 'ListItem',
        position: 6,
        item: {
          '@type': 'Article',
          name: 'Step-by-Step Guide - Replicating PostgreSQL to Iceberg with OLake & AWS Glue',
          url: 'https://olake.io/iceberg/postgres-to-iceberg-using-glue/',
          author: { '@type': 'Person', name: 'Rohan Khameshra' },
          datePublished: '2025-04-11',
          timeRequired: 'PT11M'
        }
      }
    ]
  }

  const icebergCollectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: blogUrl,
    name: 'Blogs on Apache Iceberg',
    description:
      'Collection of OLake blog posts about Apache Iceberg: partitioning, query engines, Glue/Athena/Trino integration, and migration guides.',
    isPartOf: {
      '@type': 'WebSite',
      url: primaryUrl,
      name: 'OLake'
    },
    publisher: {
      '@type': 'Organization',
      name: 'OLake',
      url: primaryUrl,
      logo: {
        '@type': 'ImageObject',
        url: 'https://olake.io/img/logo/olake-blue.svg',
        width: 32,
        height: 32
      }
    },
    mainEntity: icebergMainEntity
  }

  const icebergBreadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: primaryUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Iceberg',
        item: blogUrl
      }
    ]
  }

  const icebergItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Explore Iceberg Query Engines',
    url: blogUrl,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Explore Query Engines',
        item: 'https://olake.io/iceberg/query-engine/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'View Feature Matrix',
        item: 'https://olake.io/iceberg/query-engine/'
      }
    ]
  }

  const baseSchemas = [
    { id: 'organization', data: organizationSchema },
    { id: 'website', data: websiteSchema }
  ]

  const jsonLdSchemas = isIcebergListing
    ? [
        ...baseSchemas,
        { id: 'collectionPage', data: icebergCollectionPageSchema },
        { id: 'breadcrumb', data: icebergBreadcrumbSchema },
        { id: 'itemList', data: icebergItemListSchema }
      ]
    : [
        ...baseSchemas,
        { id: 'collectionPage', data: blogCollectionPageSchema },
        { id: 'breadcrumb', data: blogBreadcrumbSchema },
        { id: 'itemList', data: blogItemListSchema }
      ]

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
        {jsonLdSchemas.map((schema) => (
          <script
            key={schema.id}
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema.data)
            }}
          />
        ))}
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




