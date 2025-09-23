import Layout from '@theme/Layout'
import Head from '@docusaurus/Head'
import React, { useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import Faq from '@site/src/components/site/Faq'
import DataWarehouseToLakes from '../components/site/DataWarehouseToLakes'
import WorkflowSection from '../components/site/WorkflowSection'
import Footer from '../components/site/Footer.tsx'
import LazyComponent from '../components/LazyComponent'

export default function New3Page() {
  const OLakeFaqs = [
    {
      question: 'How to Get Started?',
      answer:
        'Check the Quickstart Guide. With a single Docker command you can spin up OLake and access the UI.'
    },
    {
      question: 'Is OLake Really Open Source?',
      answer:
        'Yes. OLake is fully open source under the Apache 2.0 license. You can explore the GitHub repository (already starred by 1K+ developers) and use it freely without hidden costs.'
    },
    {
      question: 'Is There Any Enterprise Plan?',
      answer:
        'We\'re actively working on providing enterprise support from professional assistance and pilot programs to helping teams scale OLake in production. You can reach out at hello@olake.io to learn more.'
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

  const childRef = useRef()
  const formRef = useRef(null)
  const history = useHistory()
  // const isMobile = useIsMobile()

  useEffect(() => {
    if (childRef.current && childRef.current.init) {
      childRef.current.init()
    }
    const script = document.createElement('script')
    script.src = 'https://js.hsforms.net/forms/v2.js'
    script.async = true
    script.onload = () => {
      window.hbspt.forms.create({
        target: '#olake-product-form',
        portalId: '21798546',
        formId: '86391f69-48e0-4b35-8ffd-13ac212d8208'
      })
    }
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    if (window.location.hash === '#olake-product-form') {
      setTimeout(() => {
        window.scrollTo(0, formRef.current.offsetTop)
      }, 0)
      history.replace({
        pathname: window.location.pathname,
        search: window.location.search
      })
    }
  }, [history, history.location.hash])

  return (
    <Layout
      title='Fastest Open Source Data Replication Tool'
      description='Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.'
    >
      <Head>
      <meta
          name='description'
          content='Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.'
        />
 
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org/',
              '@type': 'Organization',
              name: 'OLake',
              url: 'https://olake.io/',
              logo: 'https://olake.io/img/logo/olake-blue.svg',
              description: 'Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.',
              foundingDate: '2023',
              contactPoint: {
                '@type': 'ContactPoint',
                'contactType': 'customer service',
                'email': 'hello@olake.io'
              },
              sameAs: [
                'https://github.com/datazip-inc/olake',
                'https://join.slack.com/t/getolake/shared_invite/zt-2uyphqf69-KQxih9Gwd4GCQRD_XFcuyw'
              ]
            })
          }}
        />
      </Head>
      <div className='w-full overflow-x-hidden bg-white dark:bg-gray-900'>
        {/* Main heading for SEO and accessibility */}
        <h1 className='sr-only'>OLake - Fastest Open Source Data Replication Tool</h1>
        <main id='main-content' role='main'>
          <DataWarehouseToLakes />
          <WorkflowSection />
          <LazyComponent component='IcebergHero' />
          <LazyComponent component='BenchmarkSection' />
          <LazyComponent component='FeatureShowcase' />
          <LazyComponent component='SetupStepsSection' />
          <LazyComponent component='RegistrationSection' />
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
