import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'
import React from 'react'
import MeetupNotes from '../../components/MeetupNotes'
import meetupData from '../../data/meetup/5th-meetup.json'
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed'
import { HOSTS } from '../../data/webinarHosts'

const hosts = [HOSTS.PRIYANSH_KHODIYAR, HOSTS.SHUBHAM_SATISH_BALDAVA]

const CommunityPage = () => {
  const communityData = {
    title: 'OLake 5th Community Meetup',
    summary: 'OLake 5th Community Meetup'
  }
  return (
    <DetailPage
      title={communityData.title}
      description='OLake 5th community meetup (March 2025): Apache Iceberg as a destination for S3 and local setups, MongoDB and Postgres syncs, and 2-3x faster syncs.'
      heading={communityData.title}
      tag='Community Meetup'
      breadcrumb='community'
    >
      <section className='flex justify-center'>
        <YouTubeEmbed videoId='dgxEBp9qWOQ' className='max-w-6xl' />
      </section>

      <WebinarOverview
        date='March 27, 2025'
        time='09:00 PM - 10:00 PM IST'
        duration='1 hours'
        summary={communityData.summary}
        bulletPoints={[]}
      />

      <WebinarHosts hosts={hosts} />

      <MeetupNotes data={meetupData} />

      <WebinarCTA CTAText={'Ready to Join our next OLake community meetup?'} />
    </DetailPage>
  )
}

export default CommunityPage
