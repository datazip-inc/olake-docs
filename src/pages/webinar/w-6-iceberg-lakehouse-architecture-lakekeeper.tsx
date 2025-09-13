import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage';
import CentralizedBreadcrumbs from '../../components/Breadcrumbs/CentralizedBreadcrumbs';
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
    name: "Viktor Kessler",
    role: "Co-founder @ Vakamo",
    bio: "Viktor Kessler is the Co-Founder of Vakamo (founded December 2024), where he focuses on Apache Iceberg and Lakekeeper Catalog technologies. His technical expertise spans modern data infrastructure with a particular emphasis on open-source technologies and lakehouse architectures. Prior to founding Vakamo, Viktor built his technical expertise through roles at Dremio, MongoDB, ERGO Group. Viktor is actively involved in the data infrastructure community, particularly around Apache Iceberg implementations. His current focus appears to be on transforming data analytics from cost centers to profit centers through innovative data products and open technologies like Apache Iceberg and Lakekeeper Catalog.",
    image: "/img/authors/viktor.png",
    linkedin: "https://www.linkedin.com/in/viktor-kessler/",
  },
  
];

const WebinarPage = () => {
  const webinarData = {
    title: 'Iceberg Lakehouse Architecture: Game-Changing Capabilities and the Critical Function of REST Catalog',
    summary: 'Join Viktor Kessler, co-founder of Vakamo and former technical leader at MongoDB and Dremio, for an in-depth technical exploration of how Apache Iceberg is fundamentally transforming the data engineering landscape.',
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
          <div className="w-full md:w-2/3 flex justify-center">
            <WebinarCoverImage src="/img/webinars/w-6-iceberg-lakehouse-architecture-lakekeeper-cover.png" alt="Webinar Cover Image" />
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
                href="https://app.livestorm.co/datazip-inc/women-in-data"
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
          <YouTubeEmbed videoId="Z0tEClkIT_8" className="max-w-6xl" />
        </div>


        <WebinarOverview
          date="May 15, 2025"
          time="11:00 AM EST, 08:30 PM [IST]"
          duration="60 mins"
          summary={webinarData.summary}
          bulletPoints={[
            "Lakehouse Architecture Components: Understand the technical foundations that enable Iceberg to deliver both data lake flexibility and data warehouse performance",
            "REST Catalog Deep Dive: Explore the critical role of distributed metadata management through REST Catalog and how it enables multi-engine compatibility",
            "Metadata Optimisation Techniques: Learn how Iceberg's advanced metadata layer delivers substantial query performance improvements and scales efficiently",
            "Enterprise-Grade Governance: Discover how Iceberg's fine-grained access controls provide robust security that satisfies even the most demanding CISO requirements",
          ]}
        />

        <Hr />
        <br />

        <WebinarHosts hosts={hosts} />

        <MeetupNotes data={meetupData} />

        <WebinarCTA
          CTAText={"Ready to Join our next webinar?"}
        />

      </main>
    </Layout>

  );
};


export default WebinarPage;
