import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage';
import WebinarForm from '../../components/forms/WebinarForm';
import Layout from '@theme/Layout';
import React = require('react');
import Hr from '../../components/Hr';

const hosts = [
  {
    name: "Amit Gilad",
    role: "[Guest] Data Engineer",
    bio: " Amit Gilad, a Data Engineer who's been actively working with Apache Iceberg and data lakes. Currently leading data engineering in stealth, he previously worked as a data engineer at Cloudinary. He has hands-on experience with EMR, Athena, and Spark, and recently shared insights about Iceberg implementations without Spark at the Chill Data Summit.",
    image: "/img/authors/amit.webp",
    linkedin: "https://www.linkedin.com/in/amit-gilad-45763433/",
  },
  {
    name: "Yonatan Dolan",
    role: "[Guest] Principal Analytics Specialist @ AWS",
    bio: " Yonatan Dolan, a Principal Analytics Specialist at AWS, focusing on Big Data & Analytics in Israel. He's an Apache Iceberg evangelist and actively drives data lake innovations. Before AWS, he led Intel's Pharma Analytics Platform, developing edge-to-cloud AI solutions for clinical trials, and spent 9 years driving advanced analytics projects at Intel.",
    image: "/img/authors/yonatan.webp",
    linkedin: "https://www.linkedin.com/in/ydolan/",
  },
  {
    name: "Vishwas Narayan",
    role: "[Host] Sr. Solution Engineer ",
    bio: " at InnateMetrics.",
    image: "/img/authors/author.webp",
    linkedin: "https://www.linkedin.com/in/vishwas-narayana/",
  },
  {
    name: "Harsha Kalbalia",
    role: " [Moderator] GTM & Founding Member @ Datazip ",
    bio: "Harsha is a user-first GTM specialist at Datazip, transforming early-stage startups from zero to one. With a knack for technical market strategy and a startup enthusiast's mindset, she bridges the gap between innovative solutions and meaningful market adoption.",
    image: "/img/authors/harsha.webp",
    linkedin: "https://www.linkedin.com/in/harsha-kalbalia//",
  },
];


const Webinar2Page = () => {
  return (

    <Layout
      title='Best Practices for Migrating to Apache Iceberg'
      description='Join us for an in-depth session on planning your Iceberg project. We will cover the best practices, tools, and strategies to ensure a smooth and efficient migration.'
    >
    
      <main className="container mx-auto px-16 md:px-36 py-12">
        <WebinarTitle
          title="Best Practices for Migrating to Apache Iceberg"
          tag="Webinar"
        />

       

        <div className="flex flex-col items-center justify-center lg:flex-row md:items-start">
          <div className="w-full md:w-2/3 flex justify-center">
          <WebinarCoverImage src="/img/webinars/webinar-iceberg.webp" alt="Webinar Cover Image" />
          </div>

          <div className="w-full md:w-1/3 flex mt-4 md:mt-0 justify-center pl-0 md:pl-20">
          <WebinarForm
              source="w2-best-practices-iceberg"
              nexturl="w-2-best-practices-iceberg-confirmation"
            />
          </div>
        </div>
        
        <Hr />
        <br />

        <WebinarOverview
          date="December 15, 2024"
          time="10:00 AM - 11:30 AM"
          duration="1.5 hours"
          summary="Join us for an in-depth session on planning your Iceberg project. We'll cover the best practices, tools, and strategies to ensure a smooth and efficient migration."
          bulletPoints={[
            "Understanding Apache Iceberg",
            "Migration strategies and best practices",
            "Tools and technologies involved",
            "Common challenges and how to overcome them",
            "Real-world case studies",
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


export default Webinar2Page;
