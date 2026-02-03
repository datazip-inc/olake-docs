import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';
import CentralizedBreadcrumbs from '../../components/Breadcrumbs/CentralizedBreadcrumbs';
import Layout from '@theme/Layout';
import React from "react";
import Hr from '../../components/Hr';
import { HOSTS } from '../../data/webinarHosts';

const hosts = [
  HOSTS.VARUN_BAINSLA,
  HOSTS.ROHAN_KHAMESHRA,
  HOSTS.HARSHA_KALBALIA,
];

const WebinarPage = () => {
  const webinarData = {
    title: 'A Journey into Data Lake: Introducing Apache Iceberg',
    summary: 'Learn how to set up OLAP system/platform for analysis from NoSQL Databases (MongoDB & DynamoDB) using Apache Iceberg.',
  };
  return (
    <Layout
      title={webinarData.title}
      description={webinarData.summary}
    >

      <main className="container mx-auto lg:px-36 py-12">
        <CentralizedBreadcrumbs
          type="webinar"
          title={webinarData.title}
        />

        <WebinarTitle
          title={webinarData.title}
          tag="Webinar"
        />

        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Thank You for Registering!
          </h2>

        </section>

        <section className="flex justify-center mb-12">
          <YouTubeEmbed videoId="TO2W-5cTI6I" className="max-w-6xl" />
        </section>

        <WebinarOverview
          date="October 03, 2024"
          time="08:30 PM - 09:30 PM IST"
          duration="1 hours"
          summary={webinarData.summary}
          bulletPoints={[
            "The Data Landscape - OLTP -> ETL -> OLAP",
            "Traditional ETL Process",
            "Brief about Features of Iceberg",
            "Benefits and Impact: How Iceberg Transformed Our Data Strategy"
          ]}
        />

        <Hr /> <br />

        <WebinarHosts hosts={hosts} />

        <WebinarCTA
          CTAText={"Ready to Join our next webinar?"}
        />

      </main>

    </Layout>
  );
};

export default WebinarPage;