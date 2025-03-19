import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage';
// import WebinarForm from '../../components/forms/WebinarForm';

import CTAButton from '../../components/webinars/CTAButton';

import Layout from '@theme/Layout';
import React = require('react');
import Hr from '../../components/Hr';
import { FaRegCalendarAlt } from 'react-icons/fa';

const hosts = [
  {
    name: "Sachin Tripathi",
    role: "[Guest] Senior Data Engineer @ EarnIn",
    bio: "Seasoned data software engineer with a track record spanning over 7 years in the Financial Products sector. Specialised in designing cost-effective and efficient data stacks for diverse teams",
    image: "/img/authors/sachin.jpg",
    linkedin: "https://www.linkedin.com/in/tripathisachin/",
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
    title: 'Pratical Session on Apache Iceberg by Sachin Tripathi',
    summary: 'The session will examine Icebergs ACID-like transaction model, time travel capabilities, schema evolution mechanisms, hidden partitioning system, and catalog architecture. Sachin will demonstrate how these features enable cross-engine compatibility for true data democracy while breaking free from vendor lock-in. We will analyze how Icebergs architecture reduces cloud costs through intelligent pruning and optimized file management without sacrificing transactional guarantees.',
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
            <WebinarCoverImage src="/img/webinars/w-4-pratical-session-on-apache-iceberg-cover.webp" alt="Webinar Cover Image" />
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
                href="https://app.livestorm.co/datazip-inc/apache-iceberg-webinar4"
                variant="secondary"
              />
            </div>

          </div>
        </div>

        <Hr />
        <br />

        <WebinarOverview
          date="March 28, 2025"
          time="06:00 AM EST, 04:00 PM [IST]"
          duration="45 mins"
          summary={webinarData.summary}
          bulletPoints={[
            "Covers key features such as iceberg's ACID-like transactions ,time travel, schema evolution, hidden partitioning, and catalogs",
            "Achieving data democracy with cross-engine compatibility",
            "Break free from vendor lock-in while having ACID transactions and schema evolution",
            "Reduce cloud costs through intelligent pruning and optimized file management",
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
