import React, { useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import HelmetWrapper from '@site/src/components/olake/HelmetWrapper'
import { olakeProductData } from '@site/src/components/olake/metaDeta'
import GetStarted from '@site/src/components/olake/GetStarted'
import Benchmarks from '@site/src/components/olake/Benchmarks'
import OLakeBlogList from '@site/src/components/olake/Blog'
import Faq from '@site/src/components/olake/Faq'
// import useIsMobile from '@site/utils/hooks/useMobile'
import Layout from '@theme/Layout'
import AwesomeButton from '../components/AwesomeButton'
import { FaGithub } from 'react-icons/fa'
import AlternatingRows from '../components/AlternatingRows'
import SectionHeader from '../components/SectionHeader'
import HeroHeading from '../components/HeroHeading'
import CTAComponent from '../components/CTA'
import { FaWalkieTalkie } from 'react-icons/fa6'
import ArchitectureImage from '../components/olake/ArchitectureImage'

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

const sampleItems = [
  {
    title: 'Faster Parallel &  Full Load',
    description:
      'Full load performance is improved by splitting large collections into smaller virtual chunks, processed in parallel.',
    image: '/img/olake/why-us-1.svg'
  },
  {
    title: 'CDC Cursor Preservation',
    description:
      'When you add new big tables after a long time of setting up the ETL, we do full load for it, in parallel to already running incremental sync. So CDC cursors are never lost. We manage overhead of data ingestion order and deduplication.',
    image: '/img/olake/why-us-2.svg'
  },
  {
    title: 'Optimized Data Pull',
    description:
      "Instead of directly transforming data from Databases during extraction, we first pull it in its native format (BSON, MongoDB's native data format, which stores JSON-like documents more efficiently). Once we have the data, we decode it on the ETL side",
    image: '/img/olake/why-us-3.svg'
  },
  {
    title: 'Efficient Incremental Sync',
    description:
      'Using Databases change stream logs (binglogs for MySQL, oplogs for mongoDB, WAL logs for Postgres), OLake enables parallel updates for each collection. This method facilitates rapid synchronisation and ensures that data is consistently updated with near real-time updates.',
    image: '/img/olake/why-us-4.svg'
  }
]

const OLakeProduct = () => {
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
      <HelmetWrapper {...olakeProductData} />

      <div className='mx-auto flex w-full max-w-[1440px] flex-col items-center p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12'>
        {/* OLake Brand */}
        {/* <div className='flex justify-center'>
          <img src='/img/olake/olake-logo.svg' alt='olake logo' className='w-24 md:w-32' />
        </div> */}

        <HeroHeading containerClassName='px-4' headingClassName='mb-2' subheadingClassName='mb-6' />

        <div className='column mt-10 flex gap-8'>
          <AwesomeButton
            variant='dark'
            icon={<FaGithub />}
            iconPosition='left'
            size='medium'
            href='/github?utm_source=hero_join_us_btn'
            target='_blank'
          >
            Join us
          </AwesomeButton>  

          <AwesomeButton
            href='?utm_source=hero_talk_to_us#olake-form-product'
            icon={<FaWalkieTalkie />}
            size='medium'
          >
            Talk to us
          </AwesomeButton>
        </div>

        <br />
        {/* Architecture Image */}

        <ArchitectureImage />

        {/* {isMobile ? (
          <img
            src='/img/olake/cta-mobile.svg'
            alt='olake-architecture'
            className='z-10 my-4 mt-[46px] h-auto min-w-[220px] max-w-[520px]'
          />
        ) : (
          <img
            src='/img/olake/cta.svg'
            alt='olake-architecture'
            className='z-10 my-4 mt-[86px] h-auto min-w-[220px] max-w-[920px]'
          />
        )} */}

        {/* Benchmarks */}
        <div className='my-8 w-full'>
          <Benchmarks />
        </div>

        {/* Get Started */}
        <div className='my-8 w-full'>
          <GetStarted />
        </div>

        {/* Form Container */}
        <div
          id='olake-form-product'
          ref={formRef}
          className='flex w-full flex-col md:my-8 md:max-w-[90%] md:flex-row'
        >
          <div className='flex-1 shrink-0 pl-[50px] pt-[50px] md:w-1/2'>
            {/* Logo and Title Row */}
            <div className='flex items-center gap-2 text-[24px] font-semibold text-gray-900 dark:text-white'>
              {/* Light Mode Logo */}
              <img
                src='/img/logo/olake-black.svg'
                alt='OLake logo (light)'
                className='h-auto w-12 dark:hidden'
              />

              {/* Dark Mode Logo */}
              <img
                src='/img/logo/olake-white.svg'
                alt='OLake logo (dark)'
                className='hidden h-auto w-12 dark:block'
              />

              <span>OLake</span>
            </div>

            {/* Headline */}
            <div className='mt-4 text-4xl font-normal text-gray-900 dark:text-white'>
              Interested?
              <br /> Get Early Access.
            </div>
          </div>

          <div className='m-8 min-h-[300px] flex-1 shrink-0 rounded border border-[#f5f5f5] p-5 dark:bg-white md:w-1/2 md:p-10'>
            <div id='olake-product-form'></div>
          </div>
        </div>

        {/* Why join us */}
        <SectionHeader heading={<>Why choose us?</>} />
        <AlternatingRows items={sampleItems} />

        {/* Blog List */}
        <div className='my-8 w-full'>
          <OLakeBlogList />
        </div>
        {/* FAQ */}
        <div className='my-8 w-full max-w-[90%]'>
          <Faq data={OLakeFaqs} showHeading={true} />
        </div>

        {/* final cta  */}
        <CTAComponent
          title='Are you excited to join us in our amazing journey and fast forward your data pipeline, contact us on one of these options!'
          mailButtonText='Mail us'
          callButtonText='Get on a Call '
          mail='hello@olake.io'
          phone='+917978307903'
          containerClassName='my-8 max-w-[1000px]'
        />
      </div>
    </Layout>
  )
}

export default OLakeProduct
