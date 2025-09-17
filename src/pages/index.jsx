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
      question: 'What is OLake, and how does it handle MongoDB data?',
      answer:
        'OLake is a data engineering tool designed to simplify and automate the real-time ingestion & normalization of complex MongoDB data. It handles the entire process — from parsing and extraction to flattening/extrapolating and transforming raw, semi-structured data into relational streams — without the need for coding.'
    },
    {
      question: 'How does OLake ensure data accuracy and prevent data loss during transformation?',
      answer:
        'OLake provides monitoring and alerts for schema evolution, helping you detect changes and prevent data loss and inaccuracies caused by transformation logic errors. Custom alerts can be set up to notify you of schema changes, ensuring continuous data accuracy.'
    },
    {
      question: 'What data platforms and tools does OLake integrate with?',
      answer:
        'As of now, we are integrating with Apache Iceberg as a destination. You can query this from most of the big data platform like Snowflake, Databricks, Redshift and BigQuery'
    },
    {
      question: 'How does OLake handle large data volumes and maintain performance?',
      answer:
        'OLake is designed to process millions of rows in minutes using a configuration-based approach, which reduces processing time from months to minutes. It supports efficient data pipelines by connecting to streaming platforms like Kafka and dynamically generating SQL code to optimize data handling.'
    },
    {
      question: 'Can OLake be customized to fit my specific data pipeline needs?',
      answer:
        'OLake provides a highly customizable, code-free interface for tailoring data extraction, transformation, and normalization processes to your specific data pipeline requirements. It allows you to adjust settings and automate tasks to match your unique use cases.'
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
    <>
      {/* Announcement Banner - Above Layout */}
      <div className='bg-[#193ae6] text-white py-3 px-4 fixed top-0 left-0 right-0 z-50'>
        <div className='max-w-7xl mx-auto text-center'>
          <p className='text-sm font-medium'>
            Monthly events are here. Check out{' '}
            <a 
              href="https://app.livestorm.co/#/events" 
              target="_blank" 
              rel="noopener noreferrer"
              className='underline hover:text-blue-200 transition-colors'
            >
              here
            </a>
            🎉
          </p>
        </div>
      </div>
      
      {/* Add top padding to account for fixed banner */}
      <div className='pt-12'>
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
      </div>
    </>
  )
}
