import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage'
import MeetupNotes from '../../components/MeetupNotes'
import meetupData from '../../data/webinar/6th.json'

import YouTubeEmbed from '../../components/webinars/YouTubeEmbed'

import React from 'react'
import { HOSTS } from '../../data/webinarHosts'

const hosts = [HOSTS.HARSHA_KALBALIA, HOSTS.VIKTOR_KESSLER]

const WebinarPage = () => {
  const webinarData = {
    title:
      'Iceberg Lakehouse Architecture and the REST Catalog',
    summary:
      'Join Viktor Kessler, co-founder of Vakamo and former technical leader at MongoDB and Dremio, for an in-depth technical exploration of how Apache Iceberg is fundamentally transforming the data engineering landscape.'
  }

  return (
    <DetailPage
      title={webinarData.title}
      description='Viktor Kessler, co-founder of Vakamo, on how Apache Iceberg is transforming data engineering and the critical function of the REST catalog.'
      heading={webinarData.title}
      tag='Webinar'
      breadcrumb='webinar'
    >
      <WebinarCoverImage
        src='/img/webinars/w-6-iceberg-lakehouse-architecture-lakekeeper-cover.webp'
        alt='Iceberg Lakehouse webinar with Vakamo co-founder Viktor Kessler'
      />

      <div className='flex justify-center'>
        <YouTubeEmbed videoId='Z0tEClkIT_8' className='max-w-6xl' />
      </div>

      <WebinarOverview
        date='May 15, 2025'
        time='11:00 AM EST, 08:30 PM [IST]'
        duration='60 mins'
        summary={webinarData.summary}
        bulletPoints={[
          'Lakehouse Architecture Components: Understand the technical foundations that enable Iceberg to deliver both data lake flexibility and data warehouse performance',
          'REST Catalog Deep Dive: Explore the critical role of distributed metadata management through REST Catalog and how it enables multi-engine compatibility',
          "Metadata Optimisation Techniques: Learn how Iceberg's advanced metadata layer delivers substantial query performance improvements and scales efficiently",
          "Enterprise-Grade Governance: Discover how Iceberg's fine-grained access controls provide robust security that satisfies even the most demanding CISO requirements"
        ]}
      />

      <WebinarHosts hosts={hosts} />

      <MeetupNotes data={meetupData} />

      <WebinarCTA CTAText={'Ready to Join our next webinar?'} />
    </DetailPage>
  )
}

export default WebinarPage
