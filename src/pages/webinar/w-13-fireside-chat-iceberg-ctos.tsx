import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage';
import CentralizedBreadcrumbs from '../../components/Breadcrumbs/CentralizedBreadcrumbs';

import CTAButton from '../../components/webinars/CTAButton';
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';

import Layout from '@theme/Layout';
import React from "react";
import Hr from '../../components/Hr';
import { HOSTS } from '../../data/webinarHosts';

const hosts = [
  HOSTS.JACOPO_TAGLIABUE,
  HOSTS.SHUBHAM_SATISH_BALDAVA,
];

const WebinarPage = () => {
  const webinarData = {
    title: 'Fireside Chat: Apache Iceberg in Production',
    summary: 'A candid CTO-to-CTO conversation exploring how Apache Iceberg is reshaping real-world data engineering. Jacopo Tagliabue (Bauplan) and Shubham Satish Baldava (OLake) compare notes on CDC pipelines, treating data like code, and the operational lessons that make Iceberg deployments succeed.',
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
          title={`${webinarData.title} `}
          tag="Fireside Chat"
        />

        <Hr />
        <br />

        <div className="flex justify-center mb-12">
          <YouTubeEmbed videoId="XOVkaY5MmiQ" className="max-w-6xl" />
        </div>

        <WebinarOverview
          date="October 30, 2025"
          time="On-demand"
          duration="58 mins"
          summary={webinarData.summary}
          bulletPoints={[
            "Pain points in production environments and the gaps in existing tooling",
            "CDC pipeline design, parallel processing techniques, and performance considerations",
            "Treating data like code with branching, testing, and controlled deployments",
            "Deletion vectors, REST catalogs, and why Iceberg V3 changes how teams operate",
            "Real challenges, benchmarks, and lessons learned while scaling data infrastructure",
            "Roadmaps that combine ML and analytics requirements on a single Iceberg foundation",
            "Practical tips for tackling implementation snags and improving developer velocity",
            "Audience Q&A touching on architecture trade-offs and day-two operations"
          ]}
        />

        <Hr />
        <br />

        <WebinarHosts hosts={hosts} />

        <WebinarCTA
          CTAText={"This one was a bit different—ready for more deep dives?"}
        />

      </main>
    </Layout>
  );
};

export default WebinarPage;


