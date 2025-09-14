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
    name: "Arsham Eslami",
    role: "Co-Founder @ Greybeam",
    bio: "Arsham Eslami is Co-Founder of Greybeam, where he builds automated workload routing systems to optimize Snowflake costs and performance. With extensive experience in data infrastructure automation, Arsham has architected scalable data platforms across multiple startups. His technical expertise spans distributed systems, real-time analytics, and cost optimization for cloud-native data architectures.",
    image: "/img/authors/arsham.jpeg",
    linkedin: "https://www.linkedin.com/in/arsham-eslami/",
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
    title: 'Deep Dive on Catalogs: Apache Iceberg Catalog Landscape & Performance Analysis',
    summary: 'As Apache Iceberg continues its rapid evolution and the catalog ecosystem expands, data engineers must make pivotal decisions about metadata management that directly influence query performance, costs, and operational complexity. Join this technical deep dive into the current catalog landscape, complete with live implementations, performance comparisons, and insights into leading solutions including the newly GA\'d Polaris v1.0 and emerging innovators reshaping the field.',
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
          <YouTubeEmbed videoId="0MejdgCax3w" className="max-w-6xl" />
        </div>

        <WebinarOverview
          date="September 4, 2025"
          time="11:00 AM EST, 08:30 PM IST"
          duration="60 mins"
          summary={webinarData.summary}
          bulletPoints={[
            "Why Iceberg? - Break down its underlying architecture including storage, metadata, and catalog layers",
            "Why You Need Catalogs? - The limitations of raw Iceberg usage without catalogs alongside a live demo",
            "Demo Time - Catalog Setup Differences and Unique Features across Glue, Polaris, LakeKeeper, and Nessie",
            "Ecosystem Update Since February 2025 - Review recent developments like Polaris v1.0 going live and Snowflake's write support",
            "Live Performance Comparisons - Real-world implementations and cost optimization strategies",
            "Q&A and Conclusion - Interactive session with industry expert insights"
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
