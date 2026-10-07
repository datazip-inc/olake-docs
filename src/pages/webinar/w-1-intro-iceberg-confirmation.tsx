import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed'
import React from 'react'
import Head from '@docusaurus/Head'
import { HOSTS } from '../../data/webinarHosts'

const hosts = [HOSTS.VARUN_BAINSLA, HOSTS.ROHAN_KHAMESHRA, HOSTS.HARSHA_KALBALIA]

const WebinarPage = () => {
  const webinarData = {
    title: 'A Journey into Data Lake: Introducing Apache Iceberg',
    summary:
      'Learn how to set up OLAP system/platform for analysis from NoSQL Databases (MongoDB & DynamoDB) using Apache Iceberg.'
  }
  return (
    <>
      <Head>
        {/* Thank-you page after registering: reachable by link, not worth indexing */}
        <meta name='robots' content='noindex, follow' />
      </Head>
      <DetailPage
        title={webinarData.title}
        description='Thanks for registering for A Journey into Data Lake. Watch the recording on Apache Iceberg and OLAP analysis of MongoDB and DynamoDB data.'
        heading={webinarData.title}
        tag='Webinar'
        breadcrumb='webinar'
      >
        <section className='text-center'>
          <h2 className='text-[24px] leading-[1.2] font-normal tracking-[-0.01em] text-olake-ink lg:text-[38px]'>
            Thank You for Registering!
          </h2>
        </section>

        <section className='flex justify-center'>
          <YouTubeEmbed videoId='TO2W-5cTI6I' className='max-w-6xl' />
        </section>

        <WebinarOverview
          date='October 03, 2024'
          time='08:30 PM - 09:30 PM IST'
          duration='1 hours'
          summary={webinarData.summary}
          bulletPoints={[
            'The Data Landscape - OLTP -> ETL -> OLAP',
            'Traditional ETL Process',
            'Brief about Features of Iceberg',
            'Benefits and Impact: How Iceberg Transformed Our Data Strategy'
          ]}
        />

        <WebinarHosts hosts={hosts} />

        <WebinarCTA CTAText={'Ready to Join our next webinar?'} />
      </DetailPage>
    </>
  )
}

export default WebinarPage
