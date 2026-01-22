import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage';
import CentralizedBreadcrumbs from '../../components/Breadcrumbs/CentralizedBreadcrumbs';
import Layout from '@theme/Layout';
import React from "react";
import Hr from '../../components/Hr';
import YouTubeEmbed from '@site/src/components/webinars/YouTubeEmbed';
import { HOSTS } from '../../data/webinarHosts';

const hosts = [
  HOSTS.AMIT_GILAD,
  HOSTS.YONATAN_DOLAN,
  HOSTS.VISHWAS_NARAYAN,
  HOSTS.HARSHA_KALBALIA,
];


const WebinarPage = () => {
  const webinarData = {
    title: 'Best Practices for Migrating to Apache Iceberg',
    summary: 'Join us for an in-depth session on planning your Iceberg project. We will cover the best practices, tools, and strategies to ensure a smooth and efficient migration.',
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
            <WebinarCoverImage src="/img/webinars/webinar-iceberg.webp" alt="Live chat on best practices for migrating to Apache Iceberg with Yonatan Dolan and Amit Gilad, November 21, 2024" />
          </div>

        </div>

        <Hr />
        <br />

        <div className="flex justify-center mb-12">
          <YouTubeEmbed videoId="8gnkqmrbGeY" className="max-w-6xl" />

          {/* comming soon */}
        </div>

        <WebinarOverview
          date="December 15, 2024"
          time="10:00 AM - 11:30 AM"
          duration="1.5 hours"
          summary={webinarData.summary}
          bulletPoints={[
            "Understanding Apache Iceberg",
            "Migration strategies and best practices",
            "Tools and technologies involved",
            "Common challenges and how to overcome them",
            "Real-world case studies",
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
