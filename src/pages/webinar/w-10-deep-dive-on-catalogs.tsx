import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage'

import CTAButton from '../../components/webinars/CTAButton'
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed'

import React from 'react'
import { HOSTS } from '../../data/webinarHosts'

const hosts = [HOSTS.ARSHAM_ESLAMI, HOSTS.AKSHAY_KUMAR_SHARMA]

const WebinarPage = () => {
  const webinarData = {
    title: 'Iceberg Catalog Landscape and Performance Deep Dive',
    summary:
      "As Apache Iceberg continues its rapid evolution and the catalog ecosystem expands, data engineers must make pivotal decisions about metadata management that directly influence query performance, costs, and operational complexity. Join this technical deep dive into the current catalog landscape, complete with live implementations, performance comparisons, and insights into leading solutions including the newly GA'd Polaris v1.0 and emerging innovators reshaping the field."
  }

  return (
    <DetailPage
      title={webinarData.title}
      description='Deep dive into the Apache Iceberg catalog landscape: live implementations, performance comparisons and leading catalogs, including Polaris v1.0.'
      heading={webinarData.title}
      tag='Webinar'
      breadcrumb='webinar'
    >
      <div className='flex justify-center'>
        <YouTubeEmbed videoId='0MejdgCax3w' className='max-w-6xl' />
      </div>

      <WebinarOverview
        date='September 4, 2025'
        time='11:00 AM EST, 08:30 PM IST'
        duration='60 mins'
        summary={webinarData.summary}
        bulletPoints={[
          'Why Iceberg? - Break down its underlying architecture including storage, metadata, and catalog layers',
          'Why You Need Catalogs? - The limitations of raw Iceberg usage without catalogs alongside a live demo',
          'Demo Time - Catalog Setup Differences and Unique Features across Glue, Polaris, LakeKeeper, and Nessie',
          "Ecosystem Update Since February 2025 - Review recent developments like Polaris v1.0 going live and Snowflake's write support",
          'Live Performance Comparisons - Real-world implementations and cost optimization strategies',
          'Q&A and Conclusion - Interactive session with industry expert insights'
        ]}
      />

      <WebinarHosts hosts={hosts} />

      <WebinarCTA CTAText={'Ready to Join our next webinar?'} />
    </DetailPage>
  )
}

export default WebinarPage
