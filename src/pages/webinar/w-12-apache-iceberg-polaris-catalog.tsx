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

const hosts = [
  {
    name: "Alex Merced",
    role: "Head of DevRel @ Dremio",
    bio: "Alex Merced is a leading voice in the data lakehouse ecosystem and a prolific contributor to the Apache Iceberg community. He is the co-author of O'Reilly's Definitive Guide to Apache Iceberg and Polaris, and author of Manning's Architecting an Iceberg Lakehouse. As Head of Developer Relations at Dremio, Alex champions open-source data technologies and helps organizations navigate modern data architectures. He's also a LinkedIn Learning instructor and creator of DataLakehouseHub.com, where he shares insights on building scalable data platforms. Through his extensive blog contributions, conference talks, and hands-on tutorials, Alex has helped countless data engineers adopt Apache Iceberg and implement production-ready lakehouse solutions.",
    image: "/img/authors/alex-merced.webp",
    linkedin: "https://www.linkedin.com/in/alexmerced",
  },
  {
    name: "Akshay Kumar Sharma",
    role: "DevRel @ OLake",
    bio: "OLake DevRel and community advocate, passionate about open-source data engineering and lakehouse architectures.",
    image: "/img/authors/akshay.webp",
    linkedin: "https://www.linkedin.com/in/akshay-kumar-sharma-devvoyager",
  },
];

const WebinarPage = () => {
  const webinarData = {
    title: 'Apache Iceberg + Polaris: Breaking Catalog Vendor Lock-in',
    summary: 'This session explores the evolution of metadata catalogs in the lakehouse era, the challenges organizations face with traditional solutions, and why open catalog standards are critical for interoperability. The focus will be on Apache Polaris, an Iceberg-native, open catalog designed to eliminate vendor lock-in and standardize metadata access. Attendees will gain both foundational understanding and technical insights into Polaris\'s architecture, setup flow, and adoption journey.',
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
          tag="Webinar"
        />

        <Hr />
        <br />

        <div className="flex justify-center mb-12">
          <YouTubeEmbed videoId="dXy09gmo5O0" className="max-w-6xl" />
        </div>

        <WebinarOverview
          date="October 9, 2025"
          time="8:00 AM PST, 8:30 PM IST"
          duration="60 mins"
          summary={webinarData.summary}
          bulletPoints={[
            "Introduction to Data Catalogs in the Lakehouse Era - Understanding the role of metadata management in modern data architectures",
            "Challenges with Traditional Metadata Catalogs - Vendor lock-in, limited interoperability, and scalability concerns",
            "The Case for Open Catalog Standards - Why open standards matter for building flexible, future-proof data platforms",
            "Apache Polaris: An Open, Iceberg-Native Catalog - Vendor neutrality, open governance, and native support for Iceberg schema evolution and table versioning",
            "Why Polaris Was Created - Filling the gap for a community-driven, Iceberg-first, open catalog that's engine-agnostic",
            "Architecture Overview - Catalog service, metadata store, API layer, and engine connectors explained",
            "Quick Setup and Adoption Journey - Running Polaris locally, configuring with Iceberg, connecting Dremio for first queries",
            "Common Pitfalls and Troubleshooting - Setup/migration challenges and how to avoid them, lessons from early adopters",
            "Adoption Perspective - Incremental rollout strategies (local → dev → production) and best practices"
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

