import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage';
import CentralizedBreadcrumbs from '../../components/Breadcrumbs/CentralizedBreadcrumbs';
// import WebinarForm from '../../components/forms/WebinarForm';
// import MeetupNotes from '../../components/MeetupNotes';
// import meetupData from '../../data/webinar/6th.json'

import CTAButton from '../../components/webinars/CTAButton';
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';

import Layout from '@theme/Layout';
import React from "react";
import Hr from '../../components/Hr';
// import { FaRegCalendarAlt } from 'react-icons/fa';

const hosts = [

  {
    name: "Harsha Kalbalia",
    role: " [Moderator] GTM & Founding Member @ Datazip ",
    bio: "Harsha is a user-first GTM specialist at Datazip, transforming early-stage startups from zero to one. With a knack for technical market strategy and a startup enthusiast's mindset, she bridges the gap between innovative solutions and meaningful market adoption.",
    image: "/img/authors/harsha.webp",
    linkedin: "https://www.linkedin.com/in/harsha-kalbalia/",
  },
  {
    name: "Hasan Geren",
    role: "Data Engineer @ ProcurePro",
    bio: "Hasan's career includes Data Engineering, where he has: • Designed and optimised 𝘀𝗰𝗮𝗹𝗮𝗯𝗹𝗲 𝗱𝗮𝘁𝗮𝗯𝗮𝘀𝗲𝘀 and cloud storage architectures. • Built 𝗹𝗼𝘄-𝗹𝗮𝘁𝗲𝗻𝗰𝘆 𝗱𝗮𝘁𝗮 𝗽𝗶𝗽𝗲𝗹𝗶𝗻𝗲𝘀 to support real-time applications and analytics dashboards. • Developed AI/ML-based solutions, including 𝗟𝗦𝗧𝗠 𝗺𝗼𝗱𝗲𝗹𝘀 and 𝗿𝗲𝗰𝗼𝗺𝗺𝗲𝗻𝗱𝗮𝘁𝗶𝗼𝗻 𝘀𝘆𝘀𝘁𝗲𝗺𝘀 to enhance user engagement. • Collaborated across teams to drive actionable insights, ensuring data solutions align with business goals.",
    image: "/img/authors/hasan.jpg",
    linkedin: "https://www.linkedin.com/in/hasan-geren/",
  },
];

const WebinarPage = () => {
  const webinarData = {
    title: 'Distributed Stream Processing in Practice [Scalable, Real-time Data Pipelines]',
    summary: 'This technical session examines real-world challenges and patterns in building distributed stream processing systems. We focus on scalability, fault tolerance, and latency trade-offs through a concrete case study, using specific frameworks like Apache Storm as supporting tools to illustrate production concepts.',
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
          title={webinarData.title}
          tag="Webinar"
        />

        <div className="flex flex-col items-center justify-center lg:flex-row md:items-start">
          {/* <div className="w-full md:w-2/3 flex justify-center">
            <WebinarCoverImage src="/img/webinars/w-8-distributed-stream-processing-in-practice-cover.jpg" alt="Webinar Cover Image" />
          </div> */}


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
          <YouTubeEmbed videoId="urLdGYaMadM" className="max-w-6xl" />
        </div>


        <WebinarOverview
          date="June 19, 2025"
          time="11:00 AM EST, 08:30 PM [IST]"
          duration="60 mins"
          summary={webinarData.summary}
          bulletPoints={[
            "Master real-world challenges - Understand scalability, fault tolerance, and latency trade-offs in production",
            "See architectural patterns - Stateless vs. stateful processing, event time vs. processing time decisions",
            "Handle scale bottlenecks - Partitioning strategies, backpressure handling, and scheduling challenges",
            "Learn from concrete examples - Real ML feature generation pipeline using Storm and Kafka",
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
