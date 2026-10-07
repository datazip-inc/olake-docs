import Head from '@docusaurus/Head' // or 'next/head' if you're using Next.js

import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'
import React from 'react'
import YouTubeEmbed from '@site/src/components/webinars/YouTubeEmbed'

const hosts = [
  {
    name: 'Shubham Satish Baldava',
    role: 'CTO @ Datazip',
    bio: ' Technologies Shubham has worked extensively in: AWS, GCP, NoSql (Dynamodb, Cassandra), relational databases, Redshift, Databricks, Snowflake, spark, kafka, hudi, airflow, airbyte, python, scala',
    image: '/img/authors/shubham.webp',
    linkedin: 'https://www.linkedin.com/in/shubham-baldava/'
  }
]

const WebinarPage = () => {
  const webinarData = {
    title: 'Fastest Apache Iceberg Native CDC: Introducing OLake',
    summary: 'OLake v0 launch webinar',
    description:
      'Launch webinar for OLake v0 (June 2025): problems with current CDC tools, OLake architecture, a live demo, the roadmap and beta access.',
    image_url: '/img/events/olake-v0-launch-cover.webp',
    event_url: 'https://olake.io/event/olake-v0-launch/'
    // register_link: 'https://linuxfoundation.regfox.com/prestocon-day-2025',
  }

  return (
    <>
      <Head>
        <title>{webinarData.title}</title>

        <meta name='description' content={webinarData.description} />

        {/* Open Graph / Facebook */}
        <meta property='og:type' content='website' />

        <meta property='og:title' content={webinarData.title} />

        <meta property='og:description' content={webinarData.description} />
        <meta property='og:image' content={`https://olake.io${webinarData.image_url}`} />

        <meta property='og:url' content={webinarData.event_url} />

        {/* Twitter */}
        <meta name='twitter:card' content='summary_large_image' />

        <meta name='twitter:title' content={webinarData.title} />

        <meta name='twitter:description' content={webinarData.description} />

        <meta name='twitter:image' content={`https://olake.io${webinarData.image_url}`} />
      </Head>

      <DetailPage
        title={webinarData.title}
        description={webinarData.description}
        heading={webinarData.title}
        tag='Event'
      >
        <section className='flex justify-center'>
          <YouTubeEmbed videoId='q1nO_X3ZTeU' className='max-w-6xl' />
        </section>

        <WebinarOverview
          date='June 26, 2025 (IST)'
          time='08:30 PM - 09:30PM '
          duration='1 hours'
          summary={webinarData.summary}
          bulletPoints={[
            'Problems with Current CDC Tools (10 minutes)',
            'OLake Technical Architecture (15 minutes)',
            'Live Demo (25 minutes)',
            'Roadmap and Beta Access (5 minutes)',
            'Q&A (5 minutes)'
          ]}
        />

        <WebinarHosts hosts={hosts} />

        <WebinarCTA CTAText={'Ready to Join our next event?'} />
      </DetailPage>
    </>
  )
}

export default WebinarPage
