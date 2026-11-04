import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage'
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed'

import React from 'react'
import { HOSTS } from '../../data/webinarHosts'

const hosts = [HOSTS.SACHIN_TRIPATHI, HOSTS.HARSHA_KALBALIA]

const WebinarPage = () => {
  const webinarData = {
    title: 'Practical Apache Iceberg Session by Sachin Tripathi',
    summary:
      'The session will examine Icebergs ACID-like transaction model, time travel capabilities, schema evolution mechanisms, hidden partitioning system, and catalog architecture. Sachin will demonstrate how these features enable cross-engine compatibility for true data democracy while breaking free from vendor lock-in. We will analyze how Icebergs architecture reduces cloud costs through intelligent pruning and optimized file management without sacrificing transactional guarantees.'
  }

  return (
    <DetailPage
      title={webinarData.title}
      description='Practical Apache Iceberg session with Sachin Tripathi: ACID-like transactions, time travel, schema evolution, hidden partitioning and catalogs.'
      heading={webinarData.title}
      tag='Webinar'
      breadcrumb='webinar'
    >
      <WebinarCoverImage
        src='/img/webinars/w-4-pratical-session-on-apache-iceberg-cover.webp'
        alt='Apache Iceberg webinar by Sachin Tripathi at EarnIn, March 28, 2025'
      />
      {/* </div> */}

      <div className='flex justify-center'>
        <YouTubeEmbed videoId='rkYXBdp7uSw' className='max-w-6xl' />

        {/* comming soon */}
      </div>

      <WebinarOverview
        date='March 28, 2025'
        time='06:00 AM EST, 04:00 PM [IST]'
        duration='45 mins'
        summary={webinarData.summary}
        bulletPoints={[
          "Covers key features such as iceberg's ACID-like transactions ,time travel, schema evolution, hidden partitioning, and catalogs",
          'Achieving data democracy with cross-engine compatibility',
          'Break free from vendor lock-in while having ACID transactions and schema evolution',
          'Reduce cloud costs through intelligent pruning and optimized file management'
        ]}
      />

      <WebinarHosts hosts={hosts} />

      <WebinarCTA CTAText={'Ready to Join our next webinar?'} />
    </DetailPage>
  )
}

export default WebinarPage
