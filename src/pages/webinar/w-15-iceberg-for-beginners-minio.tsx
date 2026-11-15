import DetailPage from '@site/src/components/community/lakeside/DetailPage'
import WebinarHosts from '../../components/webinars/WebinarHosts'
import WebinarCTA from '../../components/webinars/WebinarCTA'
import WebinarOverview from '../../components/webinars/WebinarOverview'

import YouTubeEmbed from '../../components/webinars/YouTubeEmbed'

import React from 'react'
import { HOSTS } from '../../data/webinarHosts'

const hosts = [HOSTS.BRENNA_BUUCK]

const WebinarPage = () => {
  const webinarData = {
    title: 'Apache Iceberg for Beginners: Build a Lakehouse Anywhere ft. MinIO',
    summary:
      'Apache Iceberg explained for beginners: what a data lakehouse is, how Iceberg tables and the Iceberg REST catalog work, and how to run a high-performance lakehouse on cloud, on-prem, or hybrid infrastructure. In this OLake Community Call, Brenna Buuck, Developer Evangelist at MinIO and a data engineer for 11 years, covers the foundations of building Apache Iceberg data platforms, based on her work with teams running Iceberg lakehouses in production.'
  }

  return (
    <DetailPage
      title={webinarData.title}
      description='Apache Iceberg for beginners: lakehouse layers, Iceberg metadata, the REST catalog, Iceberg v3 and running a lakehouse on cloud, on-prem or hybrid with MinIO.'
      heading={webinarData.title}
      tag='Webinar'
      breadcrumb='webinar'
    >
      <div className='flex justify-center'>
        <YouTubeEmbed videoId='ayoF9cu1ji0' className='max-w-6xl' />
      </div>

      <WebinarOverview
        date='September 22, 2026'
        time='On-demand'
        duration='50 mins'
        summary={webinarData.summary}
        bulletPoints={[
          'The three layers of a data lakehouse: object storage, an open table format and a query engine, each decoupled from the others',
          'How a lakehouse differs from a data warehouse and a data lake',
          'How Apache Iceberg handles schema evolution, hidden partitioning and engine independence',
          'How Iceberg metadata files, manifest lists and manifests let query engines skip files',
          'Why object storage sits on the performance-critical path for Iceberg queries',
          'How the Iceberg REST catalog tracks snapshots, enables time travel and handles concurrent writes',
          "What's new in Iceberg v3: deletion vectors, row lineage, variant types and geospatial types",
          'Three ways to run an Iceberg catalog: standalone, embedded in object storage and federated'
        ]}
      />

      <WebinarHosts hosts={hosts} />

      <WebinarCTA CTAText={'Ready to Join our next webinar?'} />
    </DetailPage>
  )
}

export default WebinarPage
