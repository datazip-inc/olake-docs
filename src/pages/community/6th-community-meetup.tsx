import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'
import React from 'react'
import MeetupNotes from '../../components/MeetupNotes'
import meetupData from '../../data/meetup/6th-meetup.json'
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed'

import SlidesCarousel, { Slide } from '../../components/SlidesCarousel'
import { HOSTS } from '../../data/webinarHosts'

const decks: Slide[] = [
  {
    title: '6th Community Meetup',
    url: 'https://docs.google.com/presentation/d/15vg09t-JY2uLn4H3uGHRCDtRDS1JeUnkfwVraCiD8Gw/edit#slide=id.g330c4f6be02_0_0'
  },
  {
    title: 'PhysicsWallah with OLake',
    url: 'https://docs.google.com/presentation/d/1Kbwjh7MMc-6pWMEH6Fat7K9us-Osiygf-NNXOxwYStI/edit?slide=id.g3531bdb1a28_2_75#slide=id.g3531bdb1a28_2_75'
  }
]

const hosts = [HOSTS.PRIYANSH_KHODIYAR, HOSTS.SHUBHAM_SATISH_BALDAVA]

const CommunityPage = () => {
  const communityData = {
    title: 'OLake 6th Community Meetup',
    summary: 'OLake 6th Community Meetup'
  }
  return (
    <DetailPage
      title={communityData.title}
      description="OLake 6th community meetup (April 2025): PhysicsWallah's Redshift to Iceberg lakehouse story, Debezium pain points, a MongoDB demo and the roadmap."
      heading={communityData.title}
      tag='Community Meetup'
      breadcrumb='community'
    >
      <section className='flex justify-center'>
        <YouTubeEmbed videoId='B8ApTbZ5Py4' className='max-w-6xl' />
      </section>

      <WebinarOverview
        date='April 28, 2025'
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
