import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed'
import React from 'react'
import Head from '@docusaurus/Head'
import { HOSTS } from '../../data/webinarHosts'

const hosts = [HOSTS.AMIT_GILAD, HOSTS.YONATAN_DOLAN, HOSTS.VISHWAS_NARAYAN, HOSTS.HARSHA_KALBALIA]

const WebinarPage = () => {
  const webinarData = {
    title: 'Best Practices for Migrating to Apache Iceberg',
    summary:
      'Join us for an in-depth session on planning your Iceberg project. We will cover the best practices, tools, and strategies to ensure a smooth and efficient migration.'
  }
  return (
    <>
      <Head>
        {/* Thank-you page after registering: reachable by link, not worth indexing */}
        <meta name='robots' content='noindex, follow' />
      </Head>
      <DetailPage
        title={webinarData.title}
        description='Thanks for registering for the Apache Iceberg migration webinar. Watch the recording on planning your Iceberg project, tools and strategies.'
        heading={webinarData.title}
        tag='Webinar'
        breadcrumb='webinar'
      >
        <section className='text-center'>
          <h2 className='text-[24px] leading-[1.2] font-normal tracking-[-0.01em] text-olake-ink lg:text-[38px]'>
            Thank You for Registering!
          </h2>
        </section>

        {/* Embedded YouTube Video */}
        <section className='flex justify-center'>
          <YouTubeEmbed videoId='8gnkqmrbGeY' className='max-w-6xl' />
        </section>

        <WebinarOverview
          date='December 15, 2024'
          time='10:00 AM - 11:30 AM'
          duration='1.5 hours'
          summary={webinarData.summary}
          bulletPoints={[
            'Understanding Apache Iceberg',
            'Migration strategies and best practices',
            'Tools and technologies involved',
            'Common challenges and how to overcome them',
            'Real-world case studies'
          ]}
        />

        <WebinarHosts hosts={hosts} />

        <WebinarCTA CTAText={'Ready to Join our next webinar?'} />
      </DetailPage>
    </>
  )
}

export default WebinarPage
