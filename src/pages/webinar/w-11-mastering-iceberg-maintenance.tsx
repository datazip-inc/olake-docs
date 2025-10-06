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
    name: "Amit Gilad",
    role: "CTO @ Lakeops",
    bio: "Apache Iceberg enthusiast and ex-data engineer at Cloudinary. Amit focus revolves around leveraging the power of data lakes and diving into Apache Iceberg. He's deeply focused on harnessing the potential of data lakes, orchestrating the organization and management of vast datasets to extract valuable insights.",
    image: "/img/authors/amit.webp",
    linkedin: "https://www.linkedin.com/in/amitgilad",
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
    title: 'Mastering Iceberg Maintenance: From Compaction to Cost Optimization',
    summary: 'Apache Iceberg has quickly become the backbone of modern data lakes, but maintaining tables efficiently is just as critical as building them. This session dives into the art of Iceberg table maintenance, from compaction strategies to metadata cleanup, with a focus on balancing query performance and compute cost. Attendees will walk away with actionable strategies and best practices to keep their Iceberg tables lean, fast, and future-proof.',
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
          <YouTubeEmbed videoId="cB-fgNDPGJs" className="max-w-6xl" />
        </div>

        <WebinarOverview
          date="January 15, 2025"
          time="11:00 AM EST, 08:30 PM IST"
          duration="60 mins"
          summary={webinarData.summary}
          bulletPoints={[
            "Introduction & The Maintenance Challenge - Why Iceberg table maintenance is critical for production data lakes",
            "Compaction Strategies Deep Dive - Bin-packing vs. Sorting vs. Z-ordering and when to use each approach",
            "Metadata & Snapshot Management - Snapshot expiration policies, orphan file cleanup, and manifest rewrites",
            "File Layout Optimization - Solving the small file problem and right-sizing files for optimal performance",
            "Cost-Performance Optimization Framework - Measuring ROI of maintenance operations and scheduling strategies",
            "Q&A and Best Practices - Interactive session with actionable insights for data engineering teams"
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
