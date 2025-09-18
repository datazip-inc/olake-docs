import Layout from '@theme/Layout'
import React, { useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import Faq from '@site/src/components/site/Faq'
import DataWarehouseToLakes from '../components/site/DataWarehouseToLakes'
import WorkflowSection from '../components/site/WorkflowSection'
import IcebergHero from '../components/site/IcebergHero'
import BenchmarkSection from '../components/site/BenchmarkSection'
import FeatureShowcase from '../components/site/FeatureShowcase'
import SetupStepsSection from '../components/site/SetupStepsSection'
import RegistrationSection from '../components/site/RegistrationSection'
import BlogShowcase from '../components/site/BlogShowcase'
import Footer from '../components/site/Footer.tsx'

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
      question: 'How Can I Contribute?',
      answer:
        'Join our slack community, review the Contribution Guide, and explore "Good First Issues" on GitHub. Contributors can get their pull requests merged and be part of building the fastest open-source Iceberg-native ingestion tool.'
    },
    {
      question: 'What data platforms and tools does OLake integrate with?',
      answer:
        'As of now, we are integrating with Apache Iceberg as a destination. You can query this from most of the big data platform like Snowflake, Databricks, Redshift and BigQuery'
    },
    {
      question: 'Why Should I Use OLake?',
      answer:
        'OLake makes data replication into Apache Iceberg seamless, faster, and cost-efficient. It handles real-time CDC, schema and partition evolution, full and incremental syncs all without vendor lock-in, so your Iceberg tables stay open, scalable, and ready for analytics.'
    },
    {
      question: 'Is There Any Enterprise Plan?',
      answer:
        'We\'re actively building on that to help teams scale OLake in production. You can reach out at hello@olake.io to learn more.'
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
      console.log('hereee', window.location.pathname, window.location.search)
      history.replace({
        pathname: window.location.pathname,
        search: window.location.search
      })
    }
  }, [history, history.location.hash])

  return (
    <Layout
      title='OLake'
      description='Fastest Database to Data Lakehouse data replication tool, open sourced'
    >
      <div className='w-full overflow-x-hidden bg-white dark:bg-gray-900'>
        <DataWarehouseToLakes />
        <WorkflowSection />
        <IcebergHero />
        <BenchmarkSection />
        <FeatureShowcase />
        <SetupStepsSection />
        <RegistrationSection />
        <BlogShowcase />
        <div className='container mx-auto my-8 w-full max-w-[90%]'>
          <Faq data={OLakeFaqs} showHeading={true} />
        </div>
      </div>
    </Layout>
  )
}
