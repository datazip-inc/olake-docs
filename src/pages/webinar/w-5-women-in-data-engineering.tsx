import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage';
import MeetupNotes from '../../components/MeetupNotes';
import meetupData from '../../data/webinar/5th.json'

import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';

import Layout from '@theme/Layout';
import CentralizedBreadcrumbs from '../../components/Breadcrumbs/CentralizedBreadcrumbs';
import React from "react";
import Hr from '../../components/Hr';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { HOSTS } from '../../data/webinarHosts';

const hosts = [
  HOSTS.HARSHA_KALBALIA,
  HOSTS.JYOTI,
  HOSTS.RIYA_KHANDELWAL,
  HOSTS.ADITI_FATWANI,
  HOSTS.TULSI_THAKUR,
  HOSTS.MITALI_GUPTA,
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
            <WebinarCoverImage src="/img/webinars/w-5-women-in-data-engineering-cover.webp" alt="Panel of women in data engineering, event on April 30, 2025" />
          </div>


          <div className="w-full md:w-1/3 flex mt-4 md:mt-0 justify-center pl-0 md:pl-20">

          </div>
        </div>

        <Hr />
        <br />


        <div className="flex justify-center mb-12">
          <YouTubeEmbed videoId="7fuvICHBvbc" className="max-w-6xl" />

          {/* comming soon */}
        </div>


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
