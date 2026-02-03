import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage';
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';

import Layout from '@theme/Layout';
import CentralizedBreadcrumbs from '../../components/Breadcrumbs/CentralizedBreadcrumbs';
import React from "react";
import Hr from '../../components/Hr';
import { HOSTS } from '../../data/webinarHosts';
//centralized component for hosts 

const hosts = [
  HOSTS.HARSHA_KALBALIA,
  HOSTS.AKSHAT_MATHUR,
];

const WebinarPage = () => {
  const webinarData = {
    title: 'Demystifying Lakehouse Architecture: From Theory to Practice',
    summary: 'Join Akshat Mathur, Senior Software Engineer at Cloudera and Apache Hive contributor, as he delivers a comprehensive technical exploration of lakehouse architecture. This session will bridge theoretical concepts with practical implementation strategies based on Akshats extensive experience with Apache Iceberg and data platform optimization.',
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
            <WebinarCoverImage src="/img/webinars/w-7-demystifying-lakehouse-architecture-cover.webp" alt="Webinar on lakehouse architectures with Cloudera product manager" />
          </div>


          <div className="w-full md:w-1/3 flex mt-4 md:mt-0 justify-center pl-0 md:pl-20">

          </div>
        </div>

        <Hr />
        <br />


        <div className="flex justify-center mb-12">
          <YouTubeEmbed videoId="9ZG_XBwIXYY" className="max-w-6xl" />
        </div>


        <WebinarOverview
          date="May 29, 2025"
          time="11:00 AM EST, 08:30 PM [IST]"
          duration="60 mins"
          summary={webinarData.summary}
          bulletPoints={[
            "Explore the fundamental concepts and components of modern lakehouse architecture",
            "Examine key design considerations that drive successful lakehouse implementations",
            "Present a practical migration framework for transitioning from traditional systems (like Hive tables) to Apache Iceberg",
            "Demonstrate implementation strategies that address real-world challenges in production environments",
            "Share insights from his experience with near-zero downtime migration approaches and handling complex data scenarios",
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
