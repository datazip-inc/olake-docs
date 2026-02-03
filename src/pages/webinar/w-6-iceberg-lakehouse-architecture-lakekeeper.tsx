import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage';
import MeetupNotes from '../../components/MeetupNotes';
import meetupData from '../../data/webinar/6th.json'

import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';

import Layout from '@theme/Layout';
import CentralizedBreadcrumbs from '../../components/Breadcrumbs/CentralizedBreadcrumbs';
import React from "react";
import Hr from '../../components/Hr';
import { HOSTS } from '../../data/webinarHosts';

const hosts = [
  HOSTS.HARSHA_KALBALIA,
  HOSTS.VIKTOR_KESSLER,
];

const WebinarPage = () => {
  const webinarData = {
    title: 'Iceberg Lakehouse Architecture: Game-Changing Capabilities and the Critical Function of REST Catalog',
    summary: 'Join Viktor Kessler, co-founder of Vakamo and former technical leader at MongoDB and Dremio, for an in-depth technical exploration of how Apache Iceberg is fundamentally transforming the data engineering landscape.',
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
            <WebinarCoverImage src="/img/webinars/w-6-iceberg-lakehouse-architecture-lakekeeper-cover.webp" alt="Iceberg Lakehouse webinar with Vakamo co-founder Viktor Kessler" />
          </div>


          <div className="w-full md:w-1/3 flex mt-4 md:mt-0 justify-center pl-0 md:pl-20">


          </div>
        </div>

        <Hr />
        <br />


        <div className="flex justify-center mb-12">
          <YouTubeEmbed videoId="Z0tEClkIT_8" className="max-w-6xl" />
        </div>


        <WebinarOverview
          date="May 15, 2025"
          time="11:00 AM EST, 08:30 PM [IST]"
          duration="60 mins"
          summary={webinarData.summary}
          bulletPoints={[
            "Lakehouse Architecture Components: Understand the technical foundations that enable Iceberg to deliver both data lake flexibility and data warehouse performance",
            "REST Catalog Deep Dive: Explore the critical role of distributed metadata management through REST Catalog and how it enables multi-engine compatibility",
            "Metadata Optimisation Techniques: Learn how Iceberg's advanced metadata layer delivers substantial query performance improvements and scales efficiently",
            "Enterprise-Grade Governance: Discover how Iceberg's fine-grained access controls provide robust security that satisfies even the most demanding CISO requirements",
          ]}
        />

        <Hr />
        <br />

        <WebinarHosts hosts={hosts} />

        <MeetupNotes data={meetupData} />

        <WebinarCTA
          CTAText={"Ready to Join our next webinar?"}
        />

      </main>
    </Layout>

  );
};


export default WebinarPage;
