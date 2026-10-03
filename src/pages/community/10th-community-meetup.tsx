import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'
import React from 'react'
import Link from '@docusaurus/Link'
import { SubHeading } from '@site/src/components/community/lakeside/primitives'
import MeetupNotes from '../../components/MeetupNotes'
import meetupData from '../../data/meetup/10th-meetup.json'
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed'
import { HOSTS } from '../../data/webinarHosts'

const hosts = [HOSTS.AKSHAY_KUMAR_SHARMA]

const videoId = '0Hv5ja3NVtc'

const CommunityPage = () => {
  const communityData = {
    title: 'OLake 10th Community Meetup',
    summary:
      "OLake Community Call | Engineers, Contributors & What's Next. We moved into double digits with these calls. We talked openly about where OLake is headed next, how we're thinking about bringing in more contributors, and what new integrations we've been working on. We also shared updates around our documentation and recent blogs so you can stay in sync."
  }

  return (
    <DetailPage
      title={communityData.title}
      description='OLake 10th community meetup: new S3, MSSQL and DB2 sources, MOR to COW changes, Kubernetes updates, SWOC contributor spotlights and the roadmap.'
      heading={communityData.title}
      tag='Community Meetup'
      breadcrumb='community'
    >
      {videoId && (
        <section className='flex justify-center'>
          <YouTubeEmbed videoId={videoId} className='max-w-6xl' />
        </section>
      )}

      <WebinarOverview
        date='January 28, 2026'
        time='04:30 PM - 05:30 PM IST'
        duration='1 hour'
        summary={communityData.summary}
        bulletPoints={[
          'New Sources: S3 Source (CSV, JSON, Parquet; AWS S3, MinIO, LocalStack; IAM auth, glob patterns), MSSQL Source (native Microsoft SQL Server to Iceberg), DB2 Source (IBM DB2 to Iceberg). Documentation added for all.',
          'S3 Connector Architecture Deep Dive by Ankit Singhal — Contributor at OLake.',
          "MOR → COW: Compaction script to convert Merge-on-Read tables to Copy-on-Write for engines that don't support equality deletes (e.g. Databricks, Snowflake). WAP checkpointing, idempotent re-runs, failure recovery.",
          'Kubernetes & Jobs: Transition to Job Profiles, zero-based mapping, full control via NodeSelector, Tolerations, Affinity. Backward compatible with existing job mappings.',
          'Community: Contributor spotlights, SWOC updates, new contributor recognition, recent blogs and case studies.'
        ]}
      />

      <section>
        <SubHeading as='h2' className='lg:text-[30px]'>
          Related blogs
        </SubHeading>
        <p className='mt-[14px] text-[15px] leading-[1.65] text-olake-text-2'>
          Documentation for the new sources covered in this call:
        </p>
        <ul className='mt-[14px] ml-[20px] list-disc text-[15px] leading-[1.65] marker:text-olake-muted [&>li]:list-disc [&>li+li]:mt-[8px]'>
          <li>
            <Link
              to='/blog/ingesting-files-from-s3-with-olake-turn-buckets-into-reliable-streams/'
              className='text-olake-blue hover:text-olake-blue-hover'
            >
              Ingesting Files from S3 with OLake: Turn Buckets into Reliable Streams
            </Link>
          </li>
          <li>
            <Link
              to='/blog/sync-mssql-to-your-lakehouse-with-olake/'
              className='text-olake-blue hover:text-olake-blue-hover'
            >
              Sync MSSQL to Your Lakehouse with OLake
            </Link>
          </li>
          <li>
            <Link
              to='/blog/ibm-db2-luw-to-lakehouse-sync-apache-iceberg-olake/'
              className='text-olake-blue hover:text-olake-blue-hover'
            >
              IBM Db2 LUW to Lakehouse: Sync to Apache Iceberg Using OLake
            </Link>
          </li>
        </ul>
      </section>

      <WebinarHosts hosts={hosts} />

      <MeetupNotes data={meetupData} />

      <WebinarCTA CTAText={'Ready to Join our next OLake community meetup?'} />
    </DetailPage>
  )
}

export default CommunityPage
