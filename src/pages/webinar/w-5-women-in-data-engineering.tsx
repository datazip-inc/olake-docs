import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage';
// import WebinarForm from '../../components/forms/WebinarForm';
import MeetupNotes from '../../components/MeetupNotes';
import meetupData from '../../data/webinar/5th.json'

import CTAButton from '../../components/webinars/CTAButton';

import Layout from '@theme/Layout';
import React = require('react');
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
];

const WebinarPage = () => {
  const webinarData = {
    title: 'Women in Data: Building Technical Expertise and Career Pathways in Data Engineering',
    summary: 'Join us for an in-depth technical discussion with six accomplished women data engineers who are architecting the backbone of modern data-driven organizations. This 60-minute session brings together specialists from healthcare, retail, cloud platforms, and enterprise data systems to share their technical approaches to solving complex data engineering challenges.',
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
            <WebinarCoverImage src="/img/webinars/w-5-women-in-data-engineering-cover.png" alt="Webinar Cover Image" />
          </div>


          <div className="w-full md:w-1/3 flex mt-4 md:mt-0 justify-center pl-0 md:pl-20">

            {/* <WebinarForm
              source="w-4-pratical-session-on-apache-iceberg"
              nexturl="w-3-cdc-unplugged-confirmation"
            /> */}


            {/* remove this button with email collection form that leads to confirmation page of this webinar */}

            <div className="flex justify-center items-center p-10 bg-gray-100 dark:bg-gray-800">
              <CTAButton
                title="Join Our Upcoming Event"
                buttonText="Register Now!"
                icon={FaRegCalendarAlt}
                href="https://app.livestorm.co/datazip-inc/women-in-data"
                variant="secondary"
              />
            </div>

          </div>
        </div>

        <Hr />
        <br />

        <WebinarOverview
          date="April 30, 2025"
          time="11:00 AM EST, 08:30 PM [IST]"
          duration="60 mins"
          summary={webinarData.summary}
          bulletPoints={[
            "Domain-Specific Technical Solutions: Discover specialized approaches for healthcare compliance pipelines, retail real-time analytics, and optimizing cloud data architectures",
            "Performance Engineering: Technical strategies that have achieved measurable results, including how to design systems that move from batch to real-time with minimal latency",
            "The Engineer's Technical Toolkit: Practical progression from foundational skills (SQL/Python) to advanced distributed systems design, with guidance on specialization vs. generalization",
            "Business Impact Focus: How technical decisions in data engineering directly influence organizational outcomes, cost optimization, and scalability",
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
