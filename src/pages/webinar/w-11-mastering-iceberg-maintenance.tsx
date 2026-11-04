import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage'

import CTAButton from '../../components/webinars/CTAButton'
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed'

import React from 'react'
import { HOSTS } from '../../data/webinarHosts'

const hosts = [HOSTS.AMIT_GILAD, HOSTS.AKSHAY_KUMAR_SHARMA]

const WebinarPage = () => {
  const webinarData = {
    title: 'Mastering Iceberg Maintenance: Compaction to Cost',
    summary:
      'Apache Iceberg has quickly become the backbone of modern data lakes, but maintaining tables efficiently is just as critical as building them. This session dives into the art of Iceberg table maintenance, from compaction strategies to metadata cleanup, with a focus on balancing query performance and compute cost. Attendees will walk away with actionable strategies and best practices to keep their Iceberg tables lean, fast, and future-proof.'
  }

  return (
    <DetailPage
      title={webinarData.title}
      description='Iceberg table maintenance explained: compaction strategies, metadata cleanup, and how to balance query performance against compute cost.'
      heading={webinarData.title}
      tag='Webinar'
      breadcrumb='webinar'
    >
      <div className='flex justify-center'>
        <YouTubeEmbed videoId='cB-fgNDPGJs' className='max-w-6xl' />
      </div>

      <WebinarOverview
        date='January 15, 2025'
        time='11:00 AM EST, 08:30 PM IST'
        duration='60 mins'
        summary={webinarData.summary}
        bulletPoints={[
          'Introduction & The Maintenance Challenge - Why Iceberg table maintenance is critical for production data lakes',
          'Compaction Strategies Deep Dive - Bin-packing vs. Sorting vs. Z-ordering and when to use each approach',
          'Metadata & Snapshot Management - Snapshot expiration policies, orphan file cleanup, and manifest rewrites',
          'File Layout Optimization - Solving the small file problem and right-sizing files for optimal performance',
          'Cost-Performance Optimization Framework - Measuring ROI of maintenance operations and scheduling strategies',
          'Q&A and Best Practices - Interactive session with actionable insights for data engineering teams'
        ]}
      />

      <WebinarHosts hosts={hosts} />

      <WebinarCTA CTAText={'Ready to Join our next webinar?'} />
    </DetailPage>
  )
}

export default WebinarPage
