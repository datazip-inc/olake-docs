import React from 'react'
import Layout from '@theme/Layout'
import Head from '@docusaurus/Head'
import LazyComponent from '../components/LazyComponent'

const GlaceLake: React.FC = () => {
  const primaryUrl = 'https://olake.io/'

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

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: 'https://olake.io/ai-lake/',
    name: 'AI Lake by OLake',
    description:
      'AI Lake by OLake is designed to unify data and AI workloads. It simplifies ingestion into Apache Iceberg, enabling faster model training, analytics, and cost-efficient storage in open data formats.',
    isPartOf: {
      '@type': 'WebSite',
      url: primaryUrl,
      name: 'OLake'
    },
    publisher: {
      '@type': 'Organization',
      name: 'OLake',
      url: primaryUrl
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://olake.io/img/site/glace-cards.svg',
      width: 960,
      height: 540
    }
  }

  const breadcrumbSchema = {
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
        name: 'AI Lake',
        item: 'https://olake.io/ai-lake/'
      }
    ]
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'AI Lake',
    description:
      'OLake AI Lake enables unified data and AI pipelines over open formats like Apache Iceberg. It supports ingestion, transformation, and model training on shared metadata layers.',
    provider: {
      '@type': 'Organization',
      name: 'OLake',
      url: primaryUrl
    },
    serviceType: 'Data Lakehouse and AI Integration',
    termsOfService: 'https://olake.io/terms-of-use',
    url: 'https://olake.io/ai-lake/'
  }

  const jsonLdSchemas = [
    { id: 'organization', data: organizationSchema },
    { id: 'website', data: websiteSchema },
    { id: 'webpage', data: webPageSchema },
    { id: 'breadcrumb', data: breadcrumbSchema },
    { id: 'service', data: serviceSchema }
  ]

  return (
    <Layout 
      title="AI Lake - OLake"
      description="Explore OLake's AI-powered data lake capabilities for intelligent data processing and analytics with Apache Iceberg."
    >
      <Head>
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
      <main>
        <LazyComponent component='Glace' />
      </main>
    </Layout>
  )
}

export default GlaceLake
