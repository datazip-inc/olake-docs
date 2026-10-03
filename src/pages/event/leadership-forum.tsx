import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'
import LeadershipForumEventDetails from '../../components/events/LeadershipForumEventDetails'
import CTAButton from '../../components/webinars/CTAButton'
import { PiCalendarBlank } from 'react-icons/pi'

import React from 'react'

const hosts = [
  {
    name: 'Vishwas Narayan',
    role: '[Host] Sr. Solution Engineer ',
    bio: ' at InnateMetrics.',
    image: '/img/authors/author.webp',
    linkedin: 'https://www.linkedin.com/in/vishwas-narayana/'
  },
  {
    name: 'Harsha Kalbalia',
    role: ' [Moderator] GTM & Founding Member @ Datazip ',
    bio: "Harsha is a user-first GTM specialist at Datazip, transforming early-stage startups from zero to one. With a knack for technical market strategy and a startup enthusiast's mindset, she bridges the gap between innovative solutions and meaningful market adoption.",
    image: '/img/authors/harsha.webp',
    linkedin: 'https://www.linkedin.com/in/harsha-kalbalia/'
  }
]

const WebinarPage = () => {
  return (
    <DetailPage
      title='A Leadership Forum for Data Engineers and MLOps'
      description='A leadership forum for senior data engineers and ML practitioners on building scalable data platforms that serve both analytics and machine learning.'
      heading='A Leadership Forum for Data Engineers and MLOps'
      tag='Event'
    >
      <div className='grid grid-cols-1 items-stretch gap-[16px] lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] lg:gap-[24px]'>
        <div className='overflow-hidden rounded-[16px] border border-solid border-olake-line'>
          <img
            src='/img/events/e-1-leadership-forum.webp'
            alt='Data Engineers and MLOps Connect event, December 21, 2024'
            width={800}
            height={800}
            loading='eager'
            decoding='async'
            fetchPriority='high'
            className='block h-auto w-full'
          />
        </div>

        <div className='flex items-center justify-center rounded-[16px] border border-solid border-olake-line bg-olake-surface-alt p-[24px] lg:p-[40px]'>
          <CTAButton
            title='Join Our Upcoming Event'
            buttonText='Registrations Over'
            icon={PiCalendarBlank}
            href='https://lu.ma/z80xycc7'
            variant='secondary'
          />
        </div>
      </div>

      <WebinarOverview
        date='December 21, 2024'
        time='11:00 - 14:00 IST Bengaluru, Karnataka'
        duration='3 hours'
        summary="Join us for an intensive session bringing together senior data engineers and ML practitioners. We'll explore the intersection of modern data architecture and ML operations, focusing on building scalable platforms that serve both analytics and machine learning needs."
        bulletPoints={[
          'Current state of data & ML platforms',
          'Key challenges in serving both analytics and ML workloads',
          'Data lakehouse architectures for ML workloads',
          'Feature store implementation patterns',
          'Bridging the gap between data engineering and ML pipelines',
          'CDC and real-time feature engineering',
          'ML model monitoring and data quality',
          'Building reliable data pipelines for both BI and ML',
          'Data versioning and experiment tracking',
          'Enjoy refreshments while networking with like-minded professionals.',
          'Unified metrics layer implementation',
          'MLOps pipeline automation',
          'Data mesh and feature democratization',
          'Performance optimization for ML workloads',
          'Emerging trends in data platforms and MLOps',
          'Building collaborative data and ML teams'
        ]}
      />

      <LeadershipForumEventDetails />

      <WebinarHosts hosts={hosts} />

      <WebinarCTA CTAText={'Ready to Join our next?'} />
    </DetailPage>
  )
}

export default WebinarPage
