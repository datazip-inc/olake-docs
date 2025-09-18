import Head from '@docusaurus/Head'; // or 'next/head' if you're using Next.js

import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import Image from '@theme/IdealImage'
import LeadershipForumEventDetails from '../../components/events/LeadershipForumEventDetails';
import CTAButton from '../../components/webinars/CTAButton';
import { FaRegCalendarAlt } from 'react-icons/fa';

import Layout from '@theme/Layout';
import React from "react";
import Hr from '../../components/Hr';
import YouTubeEmbed from '@site/src/components/webinars/YouTubeEmbed';

const hosts = [
  {
    name: "Shubham Satish Baldava",
    role: "CTO @ Datazip",
    bio: " Technologies Shubham has worked extensively in: AWS, GCP, NoSql (Dynamodb, Cassandra), relational databases, Redshift, Databricks, Snowflake, spark, kafka, hudi, airflow, airbyte, python, scala",
    image: "/img/authors/shubham.jpg",
    linkedin: "https://www.linkedin.com/in/shubham-baldava/",
  }
];

const WebinarPage = () => {
  const webinarData = {
    title: 'Fastest Apache Iceberg Native CDC: Introducing OLake',
    summary: 'OLake v0 launch webinar',
    image_url: '/img/events/olake-v0-launch-cover.jpg',
    event_url: 'https://olake.io/event/olake-v0-launch',
    // register_link: 'https://linuxfoundation.regfox.com/prestocon-day-2025',
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
        <main className="container mx-auto px-16 md:px-36 py-12">
          <WebinarTitle
            title={webinarData.title}
            tag="Event"
          />

          <div className="flex flex-col md:flex-row ">
            {/* <div className=" md:w-1/2 ">
              <Image img={webinarData.image_url} alt="events Cover Image" />
            </div> */}


            <div className="md:w-1/3 md:relative md:left-56 p-4">

              {/* <div className="flex justify-center items-center p-10 bg-gray-100 dark:bg-gray-800">

                <CTAButton
                  title="Join the Upcoming Event"
                  buttonText="Register Now"
                  icon={FaRegCalendarAlt}
                  href={webinarData.register_link}
                  variant="primary"
                />
              </div> */}

            </div>
          </div>

          <Hr /> <br />


          <section className="flex justify-center mb-12">
            <YouTubeEmbed videoId="q1nO_X3ZTeU" className="max-w-6xl" />

            {/* comming soon */}
          </section>

          <WebinarOverview
            date="June 26, 2025 (IST)"
            time="08:30 PM - 09:30PM "
            duration="1 hours"
            summary={webinarData.summary}

            bulletPoints={[
              'Problems with Current CDC Tools (10 minutes)',
              'OLake Technical Architecture (15 minutes)',
              'Live Demo (25 minutes)',
              'Roadmap and Beta Access (5 minutes)',
              'Q&A (5 minutes)',
            ]}

          />
          <Hr />
          <br />

          {/* <div className="min-h-screen  p-4">
          <LeadershipForumEventDetails />
        </div> */}

          <WebinarHosts hosts={hosts} />

          <WebinarCTA
            CTAText={"Ready to Join our next event?"}
          />

        </main>
      </Layout>
    </>
  );
};

export default WebinarPage;