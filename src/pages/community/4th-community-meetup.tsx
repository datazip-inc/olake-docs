import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'
import React from 'react'
import MeetupNotes from '../../components/MeetupNotes'
import meetupData from '../../data/meetup/4th-meetup.json'
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed'
import SlidesCarousel, { Slide } from '../../components/SlidesCarousel'
import { HOSTS } from '../../data/webinarHosts'

const decks: Slide[] = [
  {
    title: '4th Community Meetup',
    url: 'https://docs.google.com/presentation/d/1zU4lkoEoX9ilHfxgU7nlq5mGC_CW52uBgz-ZtEEFJJE/edit#slide=id.g330c4f6be02_0_0'
  }
]

const hosts = [HOSTS.PRIYANSH_KHODIYAR, HOSTS.SHUBHAM_SATISH_BALDAVA, HOSTS.ANKIT_KUMAR]

const CommunityPage = () => {
  const communityData = {
    title: 'OLake 4th Community Meetup',
    summary: 'OLake 4th Community Meetup'
  }
  return (
    <DetailPage
      title={communityData.title}
      description='OLake 4th community meetup (February 2025): Split Vector strategy, stats file, MySQL and Postgres sources, Iceberg writer and a MongoDB replica set demo.'
      heading={communityData.title}
      tag='Community Meetup'
      breadcrumb='community'
    >
      <section className='flex justify-center'>
        <YouTubeEmbed videoId='dP1jnSfgs9Q' className='max-w-6xl' />
      </section>

      <WebinarOverview
        date='February 28, 2025'
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
