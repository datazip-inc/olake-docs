import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage'

import CTAButton from '../../components/webinars/CTAButton'
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed'

import React from 'react'
import { HOSTS } from '../../data/webinarHosts'

const hosts = [HOSTS.SHIVJI_KUMAR_JHA, HOSTS.SAURABH_KUMAR_OJHA, HOSTS.AKSHAY_KUMAR_SHARMA]

const WebinarPage = () => {
  const webinarData = {
    title: 'ClickHouse Iceberg Workshop: Read & Write Data',
    summary:
      "In this seminar we discussed ClickHouse's experimental Iceberg support and how open table formats are revolutionizing data engineering workflows. This hands-on session demonstrated unified lakehouse architectures with cross-engine compatibility."
  }

  return (
    <DetailPage
      title={webinarData.title}
      description="ClickHouse Iceberg workshop: a hands-on look at ClickHouse's experimental Iceberg support and cross-engine lakehouse architectures on open table formats."
      heading={webinarData.title}
      tag='Webinar'
      breadcrumb='webinar'
    >
      <div className='flex justify-center'>
        <YouTubeEmbed videoId='G4egXodf4DM' className='max-w-6xl' />
      </div>

      <WebinarOverview
        date='August 28, 2025'
        time='11:00 AM EST, 08:30 PM IST'
        duration='60 mins'
        summary={webinarData.summary}
        bulletPoints={[
          "Open Format Strategies: We explored Apache Iceberg's role in eliminating vendor lock-in",
          'Cross-Engine Compatibility: Covered practical patterns for unified data access across ClickHouse, Spark, and other engines',
          'Production Implementation: Discussed real-world considerations for ClickHouse Iceberg deployments',
          'CDC Integration: Demonstrated how OLake enables seamless MySQL to Iceberg replication workflows',
          "Time Travel Capabilities: Showcased leveraging Iceberg's versioning with ClickHouse queries",
          'Hands-on Demo: Presented end-to-end lakehouse workflow with ClickHouse, Spark, and OLake CDC'
        ]}
      />

      <WebinarHosts hosts={hosts} />

      <WebinarCTA CTAText={'Ready to Join our next webinar?'} />
    </DetailPage>
  )
}

export default WebinarPage
