import Head from '@docusaurus/Head'; // or 'next/head' if you're using Next.js

import Layout from '@theme/Layout';
import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';
import React from "react";
import Hr from '../../components/Hr';

const hosts = [
  {
    name: "Amit Gilad",
    role: "[Guest] Data Engineer",
    bio: " Amit Gilad, a Data Engineer who's been actively working with Apache Iceberg and data lakes. Currently leading data engineering in stealth, he previously worked as a data engineer at Cloudinary. He has hands-on experience with EMR, Athena, and Spark, and recently shared insights about Iceberg implementations without Spark at the Chill Data Summit.",
    image: "/img/authors/amit.webp",
    linkedin: "https://www.linkedin.com/in/amit-gilad-45763433/",
  },
  {
    name: "Yonatan Dolan",
    role: "[Guest] Principal Analytics Specialist @ AWS",
    bio: " Yonatan Dolan, a Principal Analytics Specialist at AWS, focusing on Big Data & Analytics in Israel. He's an Apache Iceberg evangelist and actively drives data lake innovations. Before AWS, he led Intel's Pharma Analytics Platform, developing edge-to-cloud AI solutions for clinical trials, and spent 9 years driving advanced analytics projects at Intel.",
    image: "/img/authors/yonatan.webp",
    linkedin: "https://www.linkedin.com/in/ydolan/",
  },
  {
    name: "Vishwas Narayan",
    role: "[Host] Sr. Solution Engineer ",
    bio: " at InnateMetrics.",
    image: "/img/authors/author.webp",
    linkedin: "https://www.linkedin.com/in/vishwas-narayana/",
  },
  {
    name: "Harsha Kalbalia",
    role: " [Moderator] GTM & Founding Member @ Datazip ",
    bio: "Harsha is a user-first GTM specialist at Datazip, transforming early-stage startups from zero to one. With a knack for technical market strategy and a startup enthusiast's mindset, she bridges the gap between innovative solutions and meaningful market adoption.",
    image: "/img/authors/harsha.webp",
    linkedin: "https://www.linkedin.com/in/harsha-kalbalia/",
  },
];

const WebinarPage = () => {
  const webinarData = {
    title: 'Best Practices for Migrating to Apache Iceberg',
    summary: 'Join us for an in-depth session on planning your Iceberg project. We will cover the best practices, tools, and strategies to ensure a smooth and efficient migration.',
    image_url: '/img/webinars/webinar-iceberg.webp',
    event_url: 'https://olake.io/webinar/w-2-best-practices-iceberg-confirmation',
  };
  return (
    <>
      <Head>
        <title>{webinarData.title}</title>

        <meta name="description" content={webinarData.summary} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />

        <meta property="og:title" content={webinarData.title} />

        <meta property="og:description" content={webinarData.summary} />
        <meta property="og:image" content={`https://olake.io${webinarData.image_url}`} />

        <meta property="og:url" content={webinarData.event_url} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        <meta name="twitter:title" content={webinarData.title} />

        <meta name="twitter:description" content={webinarData.summary} />

        <meta name="twitter:image" content={`https://olake.io${webinarData.image_url}`} />
      </Head>

      <Layout
        title={webinarData.title}
        description={webinarData.summary}
      >

        <main className="container mx-auto lg:px-36 py-12">

          <WebinarTitle
            title="Best Practices for Migrating to Apache Iceberg"
            tag="Webinar"
          />

          <section className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Thank You for Registering!
            </h1>

          </section>

          {/* Embedded YouTube Video */}
          <section className="flex justify-center mb-12">
            <YouTubeEmbed videoId="8gnkqmrbGeY" className="max-w-6xl" />
          </section>

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
    </>
  );
};


export default WebinarPage;
