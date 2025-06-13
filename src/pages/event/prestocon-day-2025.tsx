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

const hosts = [
  {
    name: "Presto Foundation",
    role: "",
    bio: " Presto",
    image: "/img/authors/presto.jpg",
    linkedin: "https://www.linkedin.com/company/presto-foundation/",
  },
  {
    name: "Rohan Khameshra",
    role: "Co-Founder ",
    bio: " at OLake by Datazip.",
    image: "/img/authors/rohan.webp",
    linkedin: "https://www.linkedin.com/in/rohan-khameshra/",
  }
];

const WebinarPage = () => {
  const webinarData = {
    title: 'From Source to Presto: Developer Playground for Fast Analytics',
    summary: 'This talk introduces a lightweight developer playground that demonstrates how to ingest change data from a transactional database (like Postgres or MySQL), register it via an open-source REST catalog (e.g., Polaris or LakeKeeper), and instantly make it queryable in Presto. The demo will walk through the setup, tools, and real-time experience of how quickly one can go from source data to interactive Presto queries using open standards and pluggable components. Ideal for developers and data engineers exploring modern lakehouse and federated query patterns',
    image_url: '/img/events/prestocon-day-2025-cover.jpg',
    event_url: 'https://olake.io/event/prestocon-day-2025',
    register_link: 'https://linuxfoundation.regfox.com/prestocon-day-2025',
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
        <meta property="og:image" content={`https://olake.io${image_url}`} />

        <meta property="og:url" content={webinarData.event_url} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        
        <meta name="twitter:title" content={webinarData.title} />
        
        <meta name="twitter:description" content={webinarData.summary} />
        
        <meta name="twitter:image" content={`https://olake.io${image_url}`} />
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
            <div className=" md:w-1/2 ">
              <Image img={webinarData.image_url} alt="events Cover Image" />
            </div>


            <div className="md:w-1/3 md:relative md:left-56 p-4">

              <div className="flex justify-center items-center p-10 bg-gray-100 dark:bg-gray-800">

                <CTAButton
                  title="Join the Upcoming Event"
                  buttonText="Register Now"
                  icon={FaRegCalendarAlt}
                  href={webinarData.register_link}
                  variant="primary"
                />
              </div>

            </div>
          </div>

          <Hr /> <br />

          <WebinarOverview
            date="June 17, 2023 (PDT) | June 18, 2023 (IST)"
            time="02:00PM - 05:00 PM PDT | 02:30 AM - 05:30AM IST"
            duration="3 hours"
            summary={webinarData.summary}

            bulletPoints={[
              'Learn how to ingest change data from Postgres or MySQL in real time',
              'Explore open-source REST catalogs like Polaris or LakeKeeper for seamless data registration',
              'Instantly query ingested data in Presto using open standards',
              'Walk through a live developer playground showcasing the full setup',
              'See how pluggable components enable fast, flexible data pipelines',
              'Ideal for developers and data engineers working with lakehouse and federated query architectures'
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