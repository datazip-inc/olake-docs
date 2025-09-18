import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';

import WebinarCoverImage from '../../components/webinars/WebinarCoverImage';

import Layout from '@theme/Layout';
import React from "react";
import Hr from '../../components/Hr';
import YouTubeEmbed from '@site/src/components/webinars/YouTubeEmbed';

const hosts = [
  {
    name: "Rajesh Rout",
    role: "[Guest] Lead Data Engineer @ Kipi",
    bio: ".",
    image: "/img/authors/rajesh.webp",
    linkedin: "https://www.linkedin.com/in/rajeshrout97/",
  },
  {
    name: "Varun Saraogi",
    role: "[Guest] Engineering Unit Head @ MathCo",
    bio: ".",
    image: "/img/authors/varun-saraogi.webp",
    linkedin: "https://www.linkedin.com/in/varunsaraogi/",
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
    title: 'CDC Unplugged: Modern Data Integration with Real-World Insights',
    summary: 'Join us for a deep dive into Change Data Capture (CDC), a vital technique for enabling real-time data integration and streaming. We will trace CDCs evolution from traditional methods to its role in modern data lakehouses, while introducing key tools to help you get started. Through real-world examples, we will offer practical guidance on implementing CDC pipelines, overcoming common challenges, and ensuring robust data governance in todays cloud-native and hybrid environments. Expect actionable best practices and insightful case studies to tie everything together.',
  };

  return (

    <Layout
      title={webinarData.title}
      description='Join us for a deep dive into Change Data Capture (CDC), a vital technique for enabling real-time data integration and streaming.'
    >


      <main className="container mx-auto lg:px-36 py-12">
        <WebinarTitle
          title={webinarData.title}
          tag="Webinar"
        />

        <div className="flex flex-col items-center justify-center lg:flex-row md:items-start">
          <div className="w-full md:w-2/3 flex justify-center">
            <WebinarCoverImage src="/img/webinars/webinar-cdc-unplugged.webp" alt="Webinar Cover Image" />
          </div>

        </div>

        <Hr />
        <br />

        <div className="flex justify-center mb-12">
          <YouTubeEmbed videoId="iCEXVkvDVjI" className="max-w-6xl" />

          {/* comming soon */}
        </div>

        <WebinarOverview
          date="January 09, 2025"
          time="10:00 AM - 10:45 AM [EST], 08:30 PM - 09:15 PM [IST]"
          duration="45 mins"
          summary={webinarData.summary}
          bulletPoints={[
            "Comprehensive Exploration of CDC",
            "Practical Guidance and Best Practices",
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
