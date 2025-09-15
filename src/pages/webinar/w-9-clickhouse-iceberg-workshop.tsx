import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage';

import CTAButton from '../../components/webinars/CTAButton';
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';

import Layout from '@theme/Layout';
import CentralizedBreadcrumbs from '../../components/Breadcrumbs/CentralizedBreadcrumbs';
import React from "react";
import Hr from '../../components/Hr';

const hosts = [
  {
    name: "Shivji Kumar Jha",
    role: "Staff Engineer @ Nutanix",
    bio: "Founding engineer of Nutanix's data platform team with 30+ conference talks at Apache and CNCF events. Apache Pulsar committer with deep expertise in ClickHouse, distributed systems, and open-source database technologies. Contributed to ClickHouse, MySQL, Apache Pulsar. ",
    image: "/img/authors/shivji.jpeg",
    linkedin: "https://www.linkedin.com/in/shivjijha/",
  },
  {
    name: "Saurabh Kumar Ojha",
    role: "Software Engineer @ Nutanix",
    bio: "Database internals expert with hands-on experience in lakehouse integrations. Open-source enthusiast with contributions to ClickHouse server and ecosystem, Nats, Transferia and more.",
    image: "/img/authors/saurabh.jpeg",
    linkedin: "https://www.linkedin.com/in/ojhasaurabh2099/",
  },
  {
    name: "Akshay Kumar Sharma",
    role: "DevRel @ OLake",
    bio: "OLake DevRel and community advocate, passionate about open-source data engineering and lakehouse architectures.",
    image: "/img/authors/akshay.jpg",
    linkedin: "https://www.linkedin.com/in/akshay-kumar-sharma-devvoyager",
  },
];

const WebinarPage = () => {
  const webinarData = {
    title: 'ClickHouse Iceberg Workshop: Read & Write to Lakehouse',
    summary: 'In this seminar we discussed ClickHouse\'s experimental Iceberg support and how open table formats are revolutionizing data engineering workflows. This hands-on session demonstrated unified lakehouse architectures with cross-engine compatibility.',
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
          <YouTubeEmbed videoId="G4egXodf4DM" className="max-w-6xl" />
        </div>

        <WebinarOverview
          date="August 28, 2025"
          time="11:00 AM EST, 08:30 PM IST"
          duration="60 mins"
          summary={webinarData.summary}
          bulletPoints={[
            "Open Format Strategies: We explored Apache Iceberg's role in eliminating vendor lock-in",
            "Cross-Engine Compatibility: Covered practical patterns for unified data access across ClickHouse, Spark, and other engines",
            "Production Implementation: Discussed real-world considerations for ClickHouse Iceberg deployments",
            "CDC Integration: Demonstrated how OLake enables seamless MySQL to Iceberg replication workflows",
            "Time Travel Capabilities: Showcased leveraging Iceberg's versioning with ClickHouse queries",
            "Hands-on Demo: Presented end-to-end lakehouse workflow with ClickHouse, Spark, and OLake CDC"
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
