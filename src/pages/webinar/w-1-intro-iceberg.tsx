import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'
import React from 'react'
import YouTubeEmbed from '@site/src/components/webinars/YouTubeEmbed'
import { HOSTS } from '../../data/webinarHosts'

const hosts = [HOSTS.VARUN_BAINSLA, HOSTS.ROHAN_KHAMESHRA, HOSTS.HARSHA_KALBALIA]

const WebinarPage = () => {
  const webinarData = {
    title: 'A Journey into Data Lake: Introducing Apache Iceberg',
    summary:
      'Learn how to set up OLAP system/platform for analysis from NoSQL Databases (MongoDB & DynamoDB) using Apache Iceberg.'
  }
  return (
    <DetailPage
      title={webinarData.title}
      description='Introduction to Apache Iceberg: how to set up an OLAP platform for analysis of NoSQL databases such as MongoDB and DynamoDB. Webinar recording.'
      heading={webinarData.title}
      tag='Webinar'
      breadcrumb='webinar'
    >
      <WebinarCoverImage
        src='/img/webinars/webinar-intro-iceberg.webp'
        alt='Webinar on setting up OLAP analysis from NoSQL databases using Apache Iceberg, hosted by Varun Bainsla from Nira Finance'
      />

      <div className='flex justify-center'>
        <YouTubeEmbed videoId='TO2W-5cTI6I' className='max-w-6xl' />

        {/* comming soon */}
      </div>

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
  )
}

export default WebinarPage
