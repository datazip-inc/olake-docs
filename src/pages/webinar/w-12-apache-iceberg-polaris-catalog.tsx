import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage'

import CTAButton from '../../components/webinars/CTAButton'
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed'

import React from 'react'
import { HOSTS } from '../../data/webinarHosts'

const hosts = [HOSTS.ALEX_MERCED, HOSTS.AKSHAY_KUMAR_SHARMA]

const WebinarPage = () => {
  const webinarData = {
    title: 'Iceberg + Polaris: Breaking Catalog Vendor Lock-in',
    summary:
      "This session explores the evolution of metadata catalogs in the lakehouse era, the challenges organizations face with traditional solutions, and why open catalog standards are critical for interoperability. The focus will be on Apache Polaris, an Iceberg-native, open catalog designed to eliminate vendor lock-in and standardize metadata access. Attendees will gain both foundational understanding and technical insights into Polaris's architecture, setup flow, and adoption journey."
  }

  return (
    <DetailPage
      title={webinarData.title}
      description='Apache Polaris explained: why open, Iceberg-native catalogs matter, how Polaris avoids vendor lock-in, and a look at its architecture and setup.'
      heading={webinarData.title}
      tag='Webinar'
      breadcrumb='webinar'
    >
      <div className='flex justify-center'>
        <YouTubeEmbed videoId='dXy09gmo5O0' className='max-w-6xl' />
      </div>

      <WebinarOverview
        date='October 9, 2025'
        time='8:00 AM PST, 8:30 PM IST'
        duration='60 mins'
        summary={webinarData.summary}
        bulletPoints={[
          'Introduction to Data Catalogs in the Lakehouse Era - Understanding the role of metadata management in modern data architectures',
          'Challenges with Traditional Metadata Catalogs - Vendor lock-in, limited interoperability, and scalability concerns',
          'The Case for Open Catalog Standards - Why open standards matter for building flexible, future-proof data platforms',
          'Apache Polaris: An Open, Iceberg-Native Catalog - Vendor neutrality, open governance, and native support for Iceberg schema evolution and table versioning',
          "Why Polaris Was Created - Filling the gap for a community-driven, Iceberg-first, open catalog that's engine-agnostic",
          'Architecture Overview - Catalog service, metadata store, API layer, and engine connectors explained',
          'Quick Setup and Adoption Journey - Running Polaris locally, configuring with Iceberg, connecting Dremio for first queries',
          'Common Pitfalls and Troubleshooting - Setup/migration challenges and how to avoid them, lessons from early adopters',
          'Adoption Perspective - Incremental rollout strategies (local → dev → production) and best practices'
        ]}
      />

      <WebinarHosts hosts={hosts} />

      <WebinarCTA CTAText={'Ready to Join our next webinar?'} />
    </DetailPage>
  )
}

export default WebinarPage
