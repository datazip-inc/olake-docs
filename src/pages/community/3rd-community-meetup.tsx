import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'
import React from 'react'
import MeetupNotes from '../../components/MeetupNotes'
import meetupData from '../../data/meetup/3rd-meetup.json'
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed'
import SlidesCarousel, { Slide } from '../../components/SlidesCarousel'
import { HOSTS } from '../../data/webinarHosts'

const decks: Slide[] = [
  {
    title: '3rd Community Meetup',
    url: 'https://docs.google.com/presentation/d/1AnnyJZlDSdwQULd0pHZ9UWm3NNMWB7bK3DASV9GVouM/edit#slide=id.g330c4f6be02_0_0'
  }
]

const hosts = [HOSTS.PRIYANSH_KHODIYAR, HOSTS.SHUBHAM_SATISH_BALDAVA, HOSTS.ANKIT_KUMAR]

const CommunityPage = () => {
  const communityData = {
    title: 'OLake 3rd Community Meetup',
    summary: 'OLake 3rd Community Meetup'
  }
  return (
    <DetailPage
      title={communityData.title}
      description='OLake 3rd community meetup (February 2025): Parquet writer and MongoDB updates, Iceberg writer roadmap and a CLI demo syncing MongoDB to S3.'
      heading={communityData.title}
      tag='Community Meetup'
      breadcrumb='community'
    >
      <section className='flex justify-center'>
        <YouTubeEmbed videoId='V2ouyKSjxzg' className='max-w-6xl' />
      </section>

      <WebinarOverview
        date='February 13, 2025'
        time='04:30 PM - 05:30 PM IST'
        duration='1 hours'
        summary={communityData.summary}
        bulletPoints={[]}
      />

      <SlidesCarousel slides={decks} />

      <WebinarHosts hosts={hosts} />

      <MeetupNotes data={meetupData} />

      <WebinarCTA CTAText={'Ready to Join our next OLake community meetup?'} />
    </DetailPage>
  )
}

export default CommunityPage
