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

const hosts = [

  {
    name: "Harsha Kalbalia",
    role: " [Moderator] GTM & Founding Member @ Datazip ",
    bio: "Harsha is a user-first GTM specialist at Datazip, transforming early-stage startups from zero to one. With a knack for technical market strategy and a startup enthusiast's mindset, she bridges the gap between innovative solutions and meaningful market adoption.",
    image: "/img/authors/harsha.webp",
    linkedin: "https://www.linkedin.com/in/harsha-kalbalia/",
  },
  {
    name: "Jyoti",
    role: "Senior Data Engineer @ Pharma MNC",
    bio: "She's a Senior Data Engineer at GSK with over six years of experience in building cloud-native data platforms and delivering impact across the healthcare and life sciences domain. She brings strong domain knowledge in clinical trials and regulatory data, with hands-on experience in PII data anonymization and curation, which are crucial for compliance and data sharing in this space",
    image: "/img/authors/jyoti.webp",
    linkedin: "https://www.linkedin.com/in/connect-jyoti/",
  },
  {
    name: "Riya Khandelwal",
    role: "Senior Data Engineer @ KPMG",
    bio: "Experienced Data Engineer with over 5 years of expertise in designing and developing large-scale data pipelines, ETL workflows, analytics solutions, and data warehouse architectures. She has successfully delivered multi-terabyte, scalable big data solutions for leading organizations, leveraging technologies such as Python, SQL, Spark, Databricks, and Microsoft Azure",
    image: "/img/authors/riya.webp",
    linkedin: "https://www.linkedin.com/in/riyakhandelwal/",
  },
  {
    name: "Aditi Fatwani",
    role: "Data Engineer @ Evernorth, Cigna Group",
    bio: "Aditi designs systems that move and transforms data at scale, optimizes costs on the cloud, and creates real impact for businesses across healthcare, retail, and agriculture. She works primarily with AWS and tools like Glue and Spark, but what drives her every day is solving complex problems that help teams make better, faster decisions",
    image: "/img/authors/aditi.webp",
    linkedin: "https://www.linkedin.com/in/aditifatwani/",
  },
  {
    name: "Tulsi Thakur",
    role: "Data Engineer @ Amazon",
    bio: "Results-driven professional with expertise in Python, SQL, database management, data visualization. Contributed to Redshift migration project at Amazon, saving significant AWS storage costs, focusing on optimizing storage and enhancing data processing efficiency and successfully onboarded Source-to-Sink Views pipeline",
    image: "/img/authors/tulsi.webp",
    linkedin: "https://www.linkedin.com/in/tulsi-thakur/",
  },
  {
    name: "Mitali Gupta",
    role: "Business Systems @ Eczachly Inc",
    bio: "At EcZachly Inc, Mitali is the jack-of-all-trades, mastering the art of systems admin, dabbling in marketing strategies and project development",
    image: "/img/authors/mitali.webp",
    linkedin: "https://www.linkedin.com/in/mitaliz/",
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
