// components/LeadershipForumEventDetails.jsx

import React from 'react'
import { PiCalendarBlank } from 'react-icons/pi'
import CTAButton from '../webinars/CTAButton'
import { SubHeading } from '../community/lakeside/primitives'

type Highlight = {
  time: string
  title: string
  lead?: string
  items?: string[]
  text?: string
}

const HIGHLIGHTS: Highlight[] = [
  {
    time: '11:00 - 11:15 AM',
    title: 'Welcome & Introduction',
    items: [
      'Current state of data & ML platforms',
      'Key challenges in serving both analytics and ML workloads'
    ]
  },
  {
    time: '11:15 AM - 12:00 PM',
    title: 'Keynote Session: Unified Data Platforms',
    items: [
      'Data lakehouse architectures for ML workloads',
      'Feature store implementation patterns',
      'Bridging the gap between data engineering and ML pipelines'
    ]
  },
  {
    time: '12:00 - 12:45 PM',
    title: 'Expert Panel: Production Data & ML Systems',
    items: [
      'CDC and real-time feature engineering',
      'ML model monitoring and data quality',
      'Building reliable data pipelines for both BI and ML',
      'Data versioning and experiment tracking'
    ]
  },
  {
    time: '12:45 - 1:15 PM',
    title: 'Connect with Peers',
    text: 'Enjoy refreshments while networking with like-minded professionals.'
  },
  {
    time: '1:15 - 1:45 PM',
    title: 'Interactive Breakout Discussions',
    lead: 'Choose from focused sessions on:',
    items: [
      'Unified metrics layer implementation',
      'MLOps pipeline automation',
      'Data mesh and feature democratization',
      'Performance optimization for ML workloads'
    ]
  },
  {
    time: '1:45 - 2:00 PM',
    title: 'Closing Session',
    items: [
      'Emerging trends in data platforms and MLOps',
      'Building collaborative data and ML teams'
    ]
  }
]

const WHO = [
  'Senior Data Engineers',
  'ML Platform Engineers',
  'Data Platform Architects',
  'MLOps Engineers',
  'Principal Engineers working on data/ML systems'
]

const WHY = [
  'Learn how leading companies build unified data and ML platforms',
  'Discover patterns for scaling ML in production',
  'Network with practitioners solving similar challenges',
  'Stay ahead of data platform evolution'
]

const Bullets = ({ items }: { items: string[] }) => (
  <ul className='mt-[10px] ml-[20px] list-disc text-[14px] leading-[1.6] text-olake-text-2 marker:text-olake-muted lg:text-[15px] [&>li]:list-disc [&>li+li]:mt-[6px]'>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
)

const LeadershipForumEventDetails = () => {
  return (
    <section className='flex flex-col gap-[36px] lg:gap-[48px]'>
      {/* Header Section */}
      <SubHeading as='h2' className='lg:text-[30px]'>
        About the Leadership Forum
      </SubHeading>

      {/* Event Highlights */}
      <div>
        <SubHeading as='h2'>Event Highlights</SubHeading>
        <ol className='mt-[14px] border-0 border-t border-solid border-olake-line-rule'>
          {HIGHLIGHTS.map((item) => (
            <li
              key={item.time}
              className='grid grid-cols-1 gap-[4px] border-0 border-b border-solid border-olake-line-rule py-[18px] lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:gap-[24px] lg:py-[22px]'
            >
              <p className='text-[13px] leading-[1.6] text-olake-muted lg:text-[14px]'>
                {item.time}
              </p>
              <div>
                <h3 className='text-[16px] leading-[1.4] font-normal text-olake-ink lg:text-[18px]'>
                  {item.title}
                </h3>
                {item.text && (
                  <p className='mt-[6px] text-[14px] leading-[1.6] text-olake-text-2 lg:text-[15px]'>
                    {item.text}
                  </p>
                )}
                {item.lead && (
                  <p className='mt-[6px] text-[14px] leading-[1.6] text-olake-text-2 lg:text-[15px]'>
                    {item.lead}
                  </p>
                )}
                {item.items && <Bullets items={item.items} />}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Who Should Attend */}
      <div>
        <SubHeading as='h2'>Who Should Attend</SubHeading>
        <Bullets items={WHO} />
      </div>

      {/* Why Attend */}
      <div>
        <SubHeading as='h2'>Why Attend</SubHeading>
        <Bullets items={WHY} />
      </div>

      {/* CTA Button */}
      <div className='flex items-center justify-center rounded-[16px] border border-solid border-olake-line bg-olake-surface-alt p-[24px] lg:p-[40px]'>
        <CTAButton
          title=''
          buttonText='Registrations Over'
          icon={PiCalendarBlank}
          href='https://luma.com/z80xycc7'
          variant='primary'
        />
      </div>
    </section>
  )
}

export default LeadershipForumEventDetails
