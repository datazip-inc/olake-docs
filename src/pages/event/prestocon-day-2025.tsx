import Head from '@docusaurus/Head' // or 'next/head' if you're using Next.js

import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage'
import React from 'react'
import YouTubeEmbed from '@site/src/components/webinars/YouTubeEmbed'

const hosts = [
  {
    name: 'Presto Foundation',
    role: '',
    bio: ' Presto',
    image: '/img/authors/presto.webp',
    linkedin: 'https://www.linkedin.com/company/presto-foundation/'
  },
  {
    name: 'Rohan Khameshra',
    role: 'Co-Founder ',
    bio: ' at OLake by Datazip.',
    image: '/img/authors/rohan.webp',
    linkedin: 'https://www.linkedin.com/in/rohan-khameshra/'
  }
]

const WebinarPage = () => {
  const webinarData = {
    title: 'Source to Presto: Developer Playground for Analytics',
    summary:
      'This talk introduces a lightweight developer playground that demonstrates how to ingest change data from a transactional database (like Postgres or MySQL), register it via an open-source REST catalog (e.g., Polaris or LakeKeeper), and instantly make it queryable in Presto. The demo will walk through the setup, tools, and real-time experience of how quickly one can go from source data to interactive Presto queries using open standards and pluggable components. Ideal for developers and data engineers exploring modern lakehouse and federated query patterns',
    image_url: '/img/events/prestocon-day-2025-cover.webp',
    event_url: 'https://olake.io/event/prestocon-day-2025/',
    register_link: 'https://linuxfoundation.regfox.com/prestocon-day-2025'
  }

  return (
    <>
      <Head>
        <title>{webinarData.title}</title>

        <meta
          name='description'
          content='A developer playground for Presto: stream CDC from Postgres or MySQL into Iceberg through an open REST catalog and query it in Presto.'
        />

        {/* Open Graph / Facebook */}
        <meta property='og:type' content='website' />

        <meta property='og:title' content={webinarData.title} />

        <meta
          property='og:description'
          content='A developer playground for Presto: stream CDC from Postgres or MySQL into Iceberg through an open REST catalog and query it in Presto.'
        />
        <meta property='og:image' content={`https://olake.io${webinarData.image_url}`} />

        <meta property='og:url' content={webinarData.event_url} />

        {/* Twitter */}
        <meta name='twitter:card' content='summary_large_image' />

        <meta name='twitter:title' content={webinarData.title} />

        <meta
          name='twitter:description'
          content='A developer playground for Presto: stream CDC from Postgres or MySQL into Iceberg through an open REST catalog and query it in Presto.'
        />

        <meta name='twitter:image' content={`https://olake.io${webinarData.image_url}`} />
      </Head>

      <DetailPage
        title={webinarData.title}
        description='A developer playground for Presto: stream CDC from Postgres or MySQL into Iceberg through an open REST catalog and query it in Presto.'
        heading={webinarData.title}
        tag='Event'
      >
        <WebinarCoverImage
          src={webinarData.image_url}
          alt='PrestoCon Day session on fast analytics with Presto, speaker from Datazip'
          width={800}
          height={418}
        />

        {/* Registration (webinarData.register_link) is closed. */}

        <section className='flex justify-center'>
          <YouTubeEmbed videoId='lKCrXyAEubU' className='max-w-6xl' />
        </section>

        <WebinarOverview
          date='June 17, 2023 (PDT) | June 18, 2023 (IST)'
          time='02:00PM - 05:00 PM PDT | 02:30 AM - 05:30AM IST'
          duration='3 hours'
          summary={webinarData.summary}
          bulletPoints={[
            'Learn how to ingest change data from Postgres or MySQL in real time',
            'Explore open-source REST catalogs like Polaris or LakeKeeper for seamless data registration',
            'Instantly query ingested data in Presto using open standards',
            'Walk through a live developer playground showcasing the full setup',
            'See how pluggable components enable fast, flexible data pipelines',
            'Ideal for developers and data engineers working with lakehouse and federated query architectures'
          ]}
        />

        <WebinarHosts hosts={hosts} />

        <WebinarCTA CTAText={'Ready to Join our next event?'} />
      </DetailPage>
    </>
  )
}

export default WebinarPage
