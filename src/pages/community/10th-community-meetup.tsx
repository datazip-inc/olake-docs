import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import React from "react";
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import CentralizedBreadcrumbs from '../../components/Breadcrumbs/CentralizedBreadcrumbs';
import Hr from '../../components/Hr';
import MeetupNotes from '../../components/MeetupNotes';
import meetupData from '../../data/meetup/10th-meetup.json';
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';
import { HOSTS } from '../../data/webinarHosts';

const hosts = [HOSTS.AKSHAY_KUMAR_SHARMA];

const videoId = "0Hv5ja3NVtc";

const CommunityPage = () => {
  const communityData = {
    title: 'OLake 10th Community Meetup',
    summary: "OLake Community Call | Engineers, Contributors & What's Next. We moved into double digits with these calls. We talked openly about where OLake is headed next, how we're thinking about bringing in more contributors, and what new integrations we've been working on. We also shared updates around our documentation and recent blogs so you can stay in sync.",
  };

  return (
    <Layout
      title={communityData.title}
      description={communityData.summary}
    >
      <main className="container mx-auto lg:px-36 py-12">
        <CentralizedBreadcrumbs
          type="community"
          title={communityData.title}
        />
        <WebinarTitle
          title={`${communityData.title}`}
          tag="Community Meetup"
        />

        {videoId && (
          <section className="flex justify-center mb-12">
            <YouTubeEmbed videoId={videoId} className="max-w-6xl" />
          </section>
        )}

        <Hr />
        <br />

        <WebinarOverview
          date="January 28, 2025"
          time="04:30 PM - 05:30 PM IST"
          duration="1 hour"
          summary={communityData.summary}
          bulletPoints={[
            "New Sources: S3 Source (CSV, JSON, Parquet; AWS S3, MinIO, LocalStack; IAM auth, glob patterns), MSSQL Source (native Microsoft SQL Server to Iceberg), DB2 Source (IBM DB2 to Iceberg). Documentation added for all.",
            "S3 Connector Architecture Deep Dive by Ankit Singhal — Contributor at OLake.",
            "MOR → COW: Compaction script to convert Merge-on-Read tables to Copy-on-Write for engines that don't support equality deletes (e.g. Databricks, Snowflake). WAP checkpointing, idempotent re-runs, failure recovery.",
            "Kubernetes & Jobs: Transition to Job Profiles, zero-based mapping, full control via NodeSelector, Tolerations, Affinity. Backward compatible with existing job mappings.",
            "Community: Contributor spotlights, SWOC updates, new contributor recognition, recent blogs and case studies.",
          ]}
        />

        <section className="mb-10 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
            Related blogs
          </h2>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Documentation for the new sources covered in this call:
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm">
            <li>
              <Link to="/blog/2026/01/25/ingesting-files-from-s3-with-olake-turn-buckets-into-reliable-streams" className="font-medium text-[#193ae6] hover:underline dark:text-blue-400">
                Ingesting Files from S3 with OLake: Turn Buckets into Reliable Streams
              </Link>
            </li>
            <li>
              <Link to="/blog/2026/01/27/sync-mssql-to-your-lakehouse-with-olake" className="font-medium text-[#193ae6] hover:underline dark:text-blue-400">
                Sync MSSQL to Your Lakehouse with OLake
              </Link>
            </li>
            <li>
              <Link to="/blog/2026/01/28/ibm-db2-luw-to-lakehouse-sync-apache-iceberg-olake" className="font-medium text-[#193ae6] hover:underline dark:text-blue-400">
                IBM Db2 LUW to Lakehouse: Sync to Apache Iceberg Using OLake
              </Link>
            </li>
          </ul>
        </section>

        <Hr />
        <br />

        <WebinarHosts hosts={hosts} />

        <MeetupNotes data={meetupData} />

        <WebinarCTA
          CTAText={"Ready to Join our next OLake community meetup?"}
        />

      </main>
    </Layout>
  );
};

export default CommunityPage;
