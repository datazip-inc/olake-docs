import React from 'react'

import { FaFileVideo, FaVideo } from 'react-icons/fa';
import SectionLayout from './SectionLayout'

import WebinarGrid from '../webinars/WebinarGrid';
import Link from '@docusaurus/Link'
const CommunityEvents = () => {
     const webinars = [
        {
          title: 'Pratical Session on Apache Iceberg by Sachin Tripathi',
          subtitle: 'Join us on Friday, March 28th at 4 PM IST for a technical session on Apache Iceberg with Sachin Tripathi, Senior Data Engineer at EarnIn. The session will examine Icebergs ACID-like transaction model, time travel capabilities, schema evolution mechanisms, hidden partitioning system, and catalog architecture',
          route: '/webinar/w-4-pratical-session-on-apache-iceberg',
          img: `/img/webinars/w-4-pratical-session-on-apache-iceberg-cover.webp`,
          alt: 'Pratical Session on Apache Iceberg by Sachin Tripathi Webinar',
          status: 'archived',
          button: 'secondary',
          CTA: 'Watch Now',
          date: '28 March 2025',
          // icon: FaVideo
        },
        {
          title: 'CDC Unplugged - Modern Data Integration with Real World Insights',
          subtitle: 'Join us for a deep dive into Change Data Capture (CDC), a vital technique for enabling real-time data integration and streaming. We will trace CDCs evolution from traditional methods to its role in modern data lakehouses, while introducing key tools to help you get started. Expect actionable best practices and insightful case studies to tie everything together',
          route: '/webinar/w-3-cdc-unplugged',
          img: `/img/webinars/webinar-cdc-unplugged.webp`,
          alt: 'CDC Unplugged Webinar',
          status: 'archived',
          button: 'secondary',
          CTA: 'Watch Now',
          date: '09 January 2025',
          icon: FaVideo
        },
        {
          title: 'A Leadership Forum for Data Engineers and MLOps',
          subtitle: 'Join us for an intensive session bringing together senior data engineers and ML practitioners. We will explore the intersection of modern data architecture and ML operations, focusing on building scalable platforms that serve both analytics and machine learning needs.',
          route: '/event/leadership-forum',
          img: `/img/events/e-1-leadership-forum.webp`,
          alt: 'A Leadership Forum for Data Engineers and MLOps',
          status: 'archived',
          button: 'outline',
          CTA: 'Registrations Over',
          date: '21 December 2024',
    
        },
    
       
      ];
    return (
        <SectionLayout className='flex w-full flex-row items-center justify-center bg-blue-950'>
            <div className='flex flex-col w-full items-center justify-center space-y-6 text-center'>
                <h1 className='text-white' >Community Events</h1>
                <WebinarGrid webinars={webinars} />

                <Link legacyBehavior href={"https://olake.io/webinar"} className='p-4 bg-blue-600 w-fit text-center  rounded-full text-white font-bold'>See all our Events</Link>
            </div>
        </SectionLayout>
    )
}


export default CommunityEvents
