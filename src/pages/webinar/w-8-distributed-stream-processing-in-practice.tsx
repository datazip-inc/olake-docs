import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'

import YouTubeEmbed from '../../components/webinars/YouTubeEmbed'

import React from 'react'
import { HOSTS } from '../../data/webinarHosts'

const hosts = [HOSTS.HARSHA_KALBALIA, HOSTS.HASAN_GEREN]

const WebinarPage = () => {
  const webinarData = {
    title: 'Distributed Stream Processing in Practice',
    summary:
      'This technical session examines real-world challenges and patterns in building distributed stream processing systems. We focus on scalability, fault tolerance, and latency trade-offs through a concrete case study, using specific frameworks like Apache Storm as supporting tools to illustrate production concepts.'
  }

  return (
    <DetailPage
      title={webinarData.title}
      description='Distributed stream processing in practice: scalability, fault tolerance and latency trade-offs in real-time pipelines, explained through a case study.'
      heading={webinarData.title}
      tag='Webinar'
      breadcrumb='webinar'
    >
      <div className='flex justify-center'>
        <YouTubeEmbed videoId='urLdGYaMadM' className='max-w-6xl' />
      </div>

      <WebinarOverview
        date='June 19, 2025'
        time='11:00 AM EST, 08:30 PM [IST]'
        duration='60 mins'
        summary={webinarData.summary}
        bulletPoints={[
          'Master real-world challenges - Understand scalability, fault tolerance, and latency trade-offs in production',
          'See architectural patterns - Stateless vs. stateful processing, event time vs. processing time decisions',
          'Handle scale bottlenecks - Partitioning strategies, backpressure handling, and scheduling challenges',
          'Learn from concrete examples - Real ML feature generation pipeline using Storm and Kafka'
        ]}
      />

      <WebinarHosts hosts={hosts} />

      <WebinarCTA CTAText={'Ready to Join our next webinar?'} />
    </DetailPage>
  )
}

export default WebinarPage
