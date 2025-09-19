import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage';
// import WebinarForm from '../../components/forms/WebinarForm';
import MeetupNotes from '../../components/MeetupNotes';
import meetupData from '../../data/webinar/6th.json'

import CTAButton from '../../components/webinars/CTAButton';
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';

import Layout from '@theme/Layout';
import React from "react";
import Hr from '../../components/Hr';
import { FaRegCalendarAlt } from 'react-icons/fa';

const hosts = [

  {
    name: "Harsha Kalbalia",
    role: " [Moderator] GTM & Founding Member @ Datazip ",
    bio: "Harsha is a user-first GTM specialist at Datazip, transforming early-stage startups from zero to one. With a knack for technical market strategy and a startup enthusiast's mindset, she bridges the gap between innovative solutions and meaningful market adoption.",
    image: "/img/authors/harsha.webp",
    linkedin: "https://www.linkedin.com/in/harsha-kalbalia/",
  },
  {
    name: "Akshat Mathur",
    role: "Senior Software Engineer @ Cloudera",
    bio: "As a senior software engineer at Cloudera, Akshat Mathur works on developing and maintaining scalable, reliable, and secure data solutions using Apache Iceberg, Hive, Tez, Trino, and other big data technologies. He collaborates with cross-functional teams to deliver high-quality products and services that meet the needs and expectations of clients and users. He also contributes to the open source community actively as an Apache contributor, where he helps to improve the performance, functionality, and usability of the projects.",
    image: "/img/authors/akshat.webp",
    linkedin: "https://www.linkedin.com/in/devakshatmathur/",
  },
];

const WebinarPage = () => {
  const webinarData = {
    title: 'Demystifying Lakehouse Architecture: From Theory to Practice',
    summary: 'Join Akshat Mathur, Senior Software Engineer at Cloudera and Apache Hive contributor, as he delivers a comprehensive technical exploration of lakehouse architecture. This session will bridge theoretical concepts with practical implementation strategies based on Akshats extensive experience with Apache Iceberg and data platform optimization.',
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

        <div className="flex flex-col items-center justify-center lg:flex-row md:items-start">
          <div className="w-full md:w-2/3 flex justify-center">
            <WebinarCoverImage src="/img/webinars/w-7-demystifying-lakehouse-architecture-cover.webp" alt="Webinar Cover Image" />
          </div>


          <div className="w-full md:w-1/3 flex mt-4 md:mt-0 justify-center pl-0 md:pl-20">

            {/* <WebinarForm
              source="w-4-pratical-session-on-apache-iceberg"
              nexturl="w-3-cdc-unplugged-confirmation"
            /> */}


            {/* remove this button with email collection form that leads to confirmation page of this webinar */}

            {/* <div className="flex justify-center items-center p-10 bg-gray-100 dark:bg-gray-800">
              <CTAButton
                title="Join Our Upcoming Event"
                buttonText="Register Now!"
                icon={FaRegCalendarAlt}
                href="https://app.livestorm.co/datazip-inc/lakehouse-architectures"
                variant="secondary"
              />
            </div> */}

          </div>
        </div>

        <Hr />
        <br />


        {/* <div className="flex justify-center mb-12">
          Video Coming soon!
        </div> */}

        <div className="flex justify-center mb-12">
          <YouTubeEmbed videoId="9ZG_XBwIXYY" className="max-w-6xl" />
        </div>


        <WebinarOverview
          date="May 29, 2025"
          time="11:00 AM EST, 08:30 PM [IST]"
          duration="60 mins"
          summary={webinarData.summary}
          bulletPoints={[
            "Explore the fundamental concepts and components of modern lakehouse architecture",
            "Examine key design considerations that drive successful lakehouse implementations",
            "Present a practical migration framework for transitioning from traditional systems (like Hive tables) to Apache Iceberg",
            "Demonstrate implementation strategies that address real-world challenges in production environments",
            "Share insights from his experience with near-zero downtime migration approaches and handling complex data scenarios",
          ]}
        />

        <Hr />
        <br />

        <WebinarHosts hosts={hosts} />

        {/* <MeetupNotes data={meetupData} /> */}

        <WebinarCTA
          CTAText={"Ready to Join our next webinar?"}
        />

      </main>
    </Layout>

  );
};


export default WebinarPage;
