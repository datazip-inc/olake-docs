import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage'
import MeetupNotes from '../../components/MeetupNotes'
import meetupData from '../../data/webinar/5th.json'

import YouTubeEmbed from '../../components/webinars/YouTubeEmbed'

import React from 'react'
import { HOSTS } from '../../data/webinarHosts'

const hosts = [
  HOSTS.HARSHA_KALBALIA,
  HOSTS.JYOTI,
  HOSTS.RIYA_KHANDELWAL,
  HOSTS.ADITI_FATWANI,
  HOSTS.TULSI_THAKUR,
  HOSTS.MITALI_GUPTA
]

const WebinarPage = () => {
  const webinarData = {
    title: 'Women in Data: Technical Expertise and Career Paths',
    summary:
      'Join us for an in-depth technical discussion with six accomplished women data engineers who are architecting the backbone of modern data-driven organizations. This 60-minute session brings together specialists from healthcare, retail, cloud platforms, and enterprise data systems to share their technical approaches to solving complex data engineering challenges.'
  }

  return (
    <DetailPage
      title={webinarData.title}
      description='Six women data engineers from healthcare, retail, cloud platforms and enterprise data share technical approaches and career paths in a 60-minute panel.'
      heading={webinarData.title}
      tag='Webinar'
      breadcrumb='webinar'
    >
      <WebinarCoverImage
        src='/img/webinars/w-5-women-in-data-engineering-cover.webp'
        alt='Panel of women in data engineering, event on April 30, 2025'
      />

      <div className='flex justify-center'>
        <YouTubeEmbed videoId='7fuvICHBvbc' className='max-w-6xl' />

        {/* comming soon */}
      </div>

      <WebinarOverview
        date='April 30, 2025'
        time='11:00 AM EST, 08:30 PM [IST]'
        duration='60 mins'
        summary={webinarData.summary}
        bulletPoints={[
          'Domain-Specific Technical Solutions: Discover specialized approaches for healthcare compliance pipelines, retail real-time analytics, and optimizing cloud data architectures',
          'Performance Engineering: Technical strategies that have achieved measurable results, including how to design systems that move from batch to real-time with minimal latency',
          "The Engineer's Technical Toolkit: Practical progression from foundational skills (SQL/Python) to advanced distributed systems design, with guidance on specialization vs. generalization",
          'Business Impact Focus: How technical decisions in data engineering directly influence organizational outcomes, cost optimization, and scalability'
        ]}
      />

      <WebinarHosts hosts={hosts} />

      <MeetupNotes data={meetupData} />

      <WebinarCTA CTAText={'Ready to Join our next webinar?'} />
    </DetailPage>
  )
}

export default WebinarPage
