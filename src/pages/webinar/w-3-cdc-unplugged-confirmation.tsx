import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';
import Layout from '@theme/Layout';
import React from "react";
import Hr from '../../components/Hr';


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
      description={webinarData.summary}
    >

      <main className="container mx-auto lg:px-36 py-12">
        <WebinarTitle
          title={webinarData.title}
          tag="Webinar"
        />

        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Thank You for Registering!
          </h1>

        </section>


        {/* Embedded YouTube Video */}
        <section className="flex justify-center mb-12">
          <YouTubeEmbed videoId="iCEXVkvDVjI" className="max-w-6xl" />

          {/* comming soon */}
        </section>

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
