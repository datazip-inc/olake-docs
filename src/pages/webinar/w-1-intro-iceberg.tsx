import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import CentralizedBreadcrumbs from '../../components/Breadcrumbs/CentralizedBreadcrumbs';
import React from "react";
import Layout from '@theme/Layout';
import Hr from '../../components/Hr';
import YouTubeEmbed from '@site/src/components/webinars/YouTubeEmbed';
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

        <div className="flex flex-col items-center justify-center lg:flex-row md:items-start">
          <div className="w-full md:w-2/3 flex justify-center">
            <WebinarCoverImage src="/img/webinars/webinar-intro-iceberg.webp" alt="Webinar on setting up OLAP analysis from NoSQL databases using Apache Iceberg, hosted by Varun Bainsla from Nira Finance" />
          </div>
        </div>


        <Hr />

        <br />

        <div className="flex justify-center mb-12">
          <YouTubeEmbed videoId="TO2W-5cTI6I" className="max-w-6xl" />

          {/* comming soon */}
        </div>


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
        <Hr />
        <br />

        <WebinarHosts hosts={hosts} />

        <WebinarCTA
          CTAText={"Ready to Join our next webinar?"}
        />

      </main>
    </Layout>
  );
};

export default WebinarPage;