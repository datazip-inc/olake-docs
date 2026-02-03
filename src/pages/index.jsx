import Layout from '@theme/Layout'
import Head from '@docusaurus/Head'
import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'

import Faq from '@site/src/components/site/Faq'
import DataWarehouseToLakes from '../components/site/DataWarehouseToLakes'
import WorkflowSection from '../components/site/WorkflowSection'
import Footer from '@theme/DocItem/Footer'
import LazyComponent from '../components/LazyComponent'
import LightModeEnforcer from '../components/LightModeEnforcer'

export default function New3Page() {
  const { siteConfig } = useDocusaurusContext()
  const location = useLocation()
  const siteUrl = siteConfig?.url || 'https://olake.io'
  const canonicalUrl = `${siteUrl}${location.pathname || '/'}`
  const ogTitle = 'Fastest Open Source Data Replication Tool'
  const ogDescription =
    'Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.'
  const ogImage = 'https://olake.io/img/logo/olake-blue.webp'
  const primaryUrl = 'https://olake.io/'

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'OLake',
    'url': primaryUrl,
    'logo': {
      '@type': 'ImageObject',
      'url': 'https://olake.io/img/logo/olake-blue.svg',
      'width': 32,
      'height': 32
    },
    'contactPoint': [
      {
        '@type': 'ContactPoint',
        'contactType': 'customer support',
        'email': 'hello@olake.io'
      }
    ],
    'sameAs': [
      'https://github.com/datazip-inc/olake',
      'https://x.com/_olake',
      'https://www.linkedin.com/company/datazipio/',
      'https://www.youtube.com/@olakeio'
    ],
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '16192 COASTAL HWY',
      'addressLocality': 'LEWES',
      'addressRegion': 'DE',
      'postalCode': '19958',
      'addressCountry': 'US'
    }
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'url': primaryUrl,
    'name': 'Fastest Open Source Data Replication Tool',
    'description':
      'Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.',
    'publisher': {
      '@type': 'Organization',
      'name': 'OLake'
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://olake.io/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'url': primaryUrl,
    'name': 'OLake - Fastest Open Source Data Replication Tool',
    'isPartOf': {
      '@type': 'WebSite',
      'name': 'OLake'
    },
    'description': ogDescription,
    'publisher': {
      '@type': 'Organization',
      'name': 'OLake',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://olake.io/img/site/hero-section.svg'
      }
    },
    'primaryImageOfPage': {
      '@type': 'ImageObject',
      'url': 'https://olake.io/img/site/hero-section.svg',
      'width': 516,
      'height': 605
    }
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': primaryUrl
      }
    ]
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How to Get Started?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':
            'Check the Quickstart Guide. With a single Docker command you can spin up OLake and access the UI.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Is OLake Really Open Source?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':
            'Yes. OLake is fully open source under the Apache 2.0 license. You can explore the GitHub repository (already starred by 1k+ developers) and use it freely without hidden costs.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Is There Any Enterprise Plan?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':
            "We're actively working on providing enterprise support from professional assistance and pilot programs to helping teams scale OLake in production. You can reach out at hello@olake.io to learn more."
        }
      },
      {
        '@type': 'Question',
        'name': 'How Can I Contribute?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':
            'Join our slack community, review the Contribution Guide, and explore "Good First Issues" on GitHub. Contributors can get their pull requests merged and be part of building the fastest open-source Iceberg-native ingestion tool.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Why Should I Use OLake?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':
            'OLake makes data replication into Apache Iceberg seamless, faster, and cost-efficient. It handles real-time CDC, schema and partition evolution, full and incremental syncs, and compaction all without vendor lock-in, so your Iceberg tables stay open, scalable, and ready for analytics.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What data platforms and tools does OLake integrate with?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':
            'As of now, we are integrating with Apache Iceberg as a destination. You can query this from most of the big data platform like Snowflake, Databricks, Redshift and BigQuery'
        }
      }
    ]
  }

  const jsonLdSchemas = [
    { id: 'organization', data: organizationSchema },
    { id: 'website', data: websiteSchema },
    { id: 'webpage', data: webPageSchema },
    { id: 'breadcrumb', data: breadcrumbSchema },
    { id: 'faq', data: faqSchema }
  ]

  const OLakeFaqs = [
    {
      question: 'How to Get Started?',
      answer: (
        <>
          Check the{' '}
          <a href='/docs/getting-started/quickstart' className='text-primary-600 hover:underline'>
            Quickstart Guide
          </a>
          . With a single Docker command you can spin up OLake and access the UI.
        </>
      )
    },
    {
      question: 'Is OLake Really Open Source?',
      answer:
        'Yes. OLake is fully open source under the Apache 2.0 license. You can explore the GitHub repository (already starred by 1K+ developers) and use it freely without hidden costs.'
    },
    {
      question: 'Is There Any Enterprise Plan?',
      answer:
        "We're actively working on providing enterprise support from professional assistance and pilot programs to helping teams scale OLake in production. You can reach out at hello@olake.io to learn more."
    },
    {
      question: 'How Can I Contribute?',
      answer:
        'Join our slack community, review the Contribution Guide, and explore "Good First Issues" on GitHub. Contributors can get their pull requests merged and be part of building the fastest open-source Iceberg-native ingestion tool.'
    },
    {
      question: 'Why Should I Use OLake?',
      answer:
        'OLake makes data replication into Apache Iceberg seamless, faster, and cost-efficient. It handles real-time CDC, schema and partition evolution, full and incremental syncs, and compaction all without vendor lock-in, so your Iceberg tables stay open, scalable, and ready for analytics.'
    },
    {
      question: 'What data platforms and tools does OLake integrate with?',
      answer:
        'As of now, we are integrating with Apache Iceberg as a destination. You can query this from most of the big data platform like Snowflake, Databricks, Redshift and BigQuery'
    }
  ]

  return (
    <Layout
      title='Fastest Open Source Data Replication Tool'
      wrapperClassName='landing-page'
      description='Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.'
    >
      <Head>
        <meta
          name='description'
          content='Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.'
        />
        {/* Open Graph */}
        <meta property='og:type' content='website' />
        <meta property='og:title' content={ogTitle} />
        <meta property='og:description' content={ogDescription} />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:site_name' content='OLake' />
        <meta property='og:locale' content='en_US' />
        <meta property='og:image' content={ogImage} />
        <meta property='og:image:type' content='image/webp' />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />

        {jsonLdSchemas.map((schema) => (
          <script
            key={schema.id}
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema.data)
            }}
          />
        ))}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
        <link
          rel='preload'
          as='image'
          href='/img/site/hero-section.svg'
          imagesizes='(max-width: 1023px) 80vw, 0px'
        />
      </Head>
      {/* Force light mode on landing page */}
      <LightModeEnforcer />
      <div className='w-full overflow-x-hidden bg-white dark:bg-gray-900'>
        {/* Main heading for SEO and accessibility */}
        <h1 className='sr-only'>OLake - Fastest Open Source Data Replication Tool</h1>
        <main id='main-content' role='main'>
          <DataWarehouseToLakes />
          <WorkflowSection />
          <LazyComponent component='IcebergHero' />
          <LazyComponent component='BenchmarkSection' />
          <LazyComponent component='BenchmarkOlakeSection' />
          <LazyComponent component='FeatureShowcase' />
          <LazyComponent component='SetupStepsSection' />
          <div id='olake-form-product' className='min-h-[80vh]'>
            <LazyComponent component='RegistrationSection' />
          </div>
          <LazyComponent component='TestimonialsSection' />
          <LazyComponent component='BlogShowcase' />
          <section
            className='container mx-auto my-8 w-full max-w-[90%]'
            aria-labelledby='faq-heading'
          >
            <Faq data={OLakeFaqs} showHeading={true} />
          </section>
        </main>
      </div>
    </Layout>
  )
}
