import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { PageMetadata } from '@docusaurus/theme-common'
import SearchMetadata from '@theme/SearchMetadata'
import { useLocation } from '@docusaurus/router'
import Head from '@docusaurus/Head'
import { serializeJsonLd } from '@site/src/components/JsonLd'
import useBlogInstance from '@theme/Blog/useBlogInstance'

// Head metadata of the blog list pages: title, Open Graph, robots for /page/N, and the
// JSON-LD schemas. Moved verbatim out of index.js, which now only renders the page.
function BlogMetadata(props) {
  const { metadata } = props
  const {
    siteConfig: { title: siteTitle, url: siteUrl }
  } = useDocusaurusContext()
  const { blogDescription, blogTitle, permalink } = metadata
  const isBlogOnlyMode = permalink === '/'
  const location = useLocation()

  // Check if this is a pagination page (page/2, page/3, etc.)
  const isPaginationPage = /\/page\/\d+/.test(location.pathname)
  const pageNumber = Number(metadata.page) || Number(/\/page\/(\d+)/.exec(location.pathname)?.[1]) || 1

  // Paginated list pages get a unique title ("Blogs on OLake - Page 2"); page 1 keeps the plain title.
  const baseTitle = isBlogOnlyMode ? siteTitle : blogTitle
  const title = pageNumber > 1 ? `${baseTitle} - Page ${pageNumber}` : baseTitle

  const primaryUrl = 'https://olake.io/'
  const blogUrl = `${siteUrl}${permalink}`.replace(/\/?$/, '/')

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
        url: 'https://olake.io/blog/apache-iceberg-metadata-explained/',
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

  const baseSchemas = [
    { id: 'organization', data: organizationSchema },
    { id: 'website', data: websiteSchema }
  ]

  const jsonLdSchemas = [
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
        <meta property="og:url" content={blogUrl} />
        <meta property="og:site_name" content="OLake" />
        <meta property="og:locale" content="en_US" />
        {isPaginationPage && <meta name="robots" content="noindex, follow" />}
        {jsonLdSchemas.map((schema) => (
          <script key={schema.id} type='application/ld+json'>{serializeJsonLd(schema.data)}</script>
        ))}
      </Head>
    </>
  )
}

const LIST_OG_IMAGE = 'https://olake.io/img/logo/olake-og-card.png'

// The list of a blog instance that is not the main blog (customer stories, learn): a CollectionPage
// with the posts on the page, Open Graph and the social card. (The blog's schemas above describe
// the blog, so they are not reused here.) `instance.listTitle` overrides the <title> when the h1
// ("Learn") is too short to be one.
function InstanceListMetadata({ metadata, items, instance }) {
  const {
    siteConfig: { url: siteUrl }
  } = useDocusaurusContext()
  const { blogDescription, blogTitle, permalink } = metadata
  const location = useLocation()
  const isPaginationPage = /\/page\/\d+/.test(location.pathname)
  const pageNumber = Number(metadata.page) || Number(/\/page\/(\d+)/.exec(location.pathname)?.[1]) || 1
  const baseTitle = instance.listTitle ?? blogTitle
  const title = pageNumber > 1 ? `${baseTitle} - Page ${pageNumber}` : baseTitle
  const listUrl = `${siteUrl}${permalink}`.replace(/\/?$/, '/')

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: instance.label,
    description: blogDescription,
    url: listUrl,
    isPartOf: { '@type': 'WebSite', name: 'OLake', url: `${siteUrl}/` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.content.metadata.title,
        url: `${siteUrl}${item.content.metadata.permalink.replace(/\/?$/, '/')}`
      }))
    }
  }

  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag='blog_posts_list' />
      <Head>
        <meta property='og:type' content='website' />
        <meta property='og:title' content={title} />
        {blogDescription && <meta property='og:description' content={blogDescription} />}
        <meta property='og:url' content={listUrl} />
        <meta property='og:site_name' content='OLake' />
        <meta property='og:locale' content='en_US' />
        <meta property='og:image' content={LIST_OG_IMAGE} />
        <meta name='twitter:image' content={LIST_OG_IMAGE} />
        {isPaginationPage && <meta name='robots' content='noindex, follow' />}
        <script type='application/ld+json'>{serializeJsonLd(collectionSchema)}</script>
      </Head>
    </>
  )
}

export default function BlogListPageMetadata(props) {
  const instance = useBlogInstance()
  return instance.key === 'blog' ? (
    <BlogMetadata {...props} />
  ) : (
    <InstanceListMetadata {...props} instance={instance} />
  )
}
