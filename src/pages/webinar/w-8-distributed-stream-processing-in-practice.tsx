import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';

import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';

import Layout from '@theme/Layout';
import CentralizedBreadcrumbs from '../../components/Breadcrumbs/CentralizedBreadcrumbs';
import React from "react";
import Hr from '../../components/Hr';
import { HOSTS } from '../../data/webinarHosts';

const hosts = [
  HOSTS.HARSHA_KALBALIA,
  HOSTS.HASAN_GEREN,
];

const WebinarPage = () => {
  const webinarData = {
    title: 'Distributed Stream Processing in Practice [Scalable, Real-time Data Pipelines]',
    summary: 'This technical session examines real-world challenges and patterns in building distributed stream processing systems. We focus on scalability, fault tolerance, and latency trade-offs through a concrete case study, using specific frameworks like Apache Storm as supporting tools to illustrate production concepts.',
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



          <div className="w-full md:w-1/3 flex mt-4 md:mt-0 justify-center pl-0 md:pl-20">

          </div>
        </div>

        <Hr />
        <br />

        <div className="flex justify-center mb-12">
          <YouTubeEmbed videoId="urLdGYaMadM" className="max-w-6xl" />
        </div>


        <WebinarOverview
          date="June 19, 2025"
          time="11:00 AM EST, 08:30 PM [IST]"
          duration="60 mins"
          summary={webinarData.summary}
          bulletPoints={[
            "Master real-world challenges - Understand scalability, fault tolerance, and latency trade-offs in production",
            "See architectural patterns - Stateless vs. stateful processing, event time vs. processing time decisions",
            "Handle scale bottlenecks - Partitioning strategies, backpressure handling, and scheduling challenges",
            "Learn from concrete examples - Real ML feature generation pipeline using Storm and Kafka",
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
