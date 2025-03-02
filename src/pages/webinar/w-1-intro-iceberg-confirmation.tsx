import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';
import Layout from '@theme/Layout';
import React = require('react');
import Hr from '../../components/Hr';

const hosts = [
  {
    name: "Varun Bainsla",
    role: "[Guest] Data Engineer @ Nira Finance",
    bio: "Varun Bainsla is a skilled data engineer specializing in cloud-native architectures and big data processing. With expertise in Python, PySpark, and AWS, he excels at developing scalable data pipelines and optimizing ETL processes. Varun's experience includes implementing lakehouse architectures and achieving significant cost reductions in OLAP systems, demonstrating his ability to deliver efficient, high-performance data solutions.",
    image: "/img/authors/varun.webp",
    linkedin: "https://www.linkedin.com/in/varunbainsla/",
  },
  {
    name: "Rohan Khameshra",
    role: "[Host] co-founder @ Datazip",
    bio: " Rohan Khameshra is the co-founder and CPO of Datazip. With a strong background in data science and analytics, he brings expertise in machine learning, data modeling, and data-driven problem-solving. His experience spans role of early data team member at Khatabook and Rapido, where he worked on customer analytics, supply analytics, incentive optimization, and customer segmentation.",
    image: "/img/authors/rohan.webp",
    linkedin: "https://www.linkedin.com/in/rohan-khameshra/",
  },
  {
    name: "Harsha Kalbalia",
    role: " [Moderator] GTM & Founding Member @ Datazip ",
    bio: "Harsha is a user-first GTM specialist at Datazip, transforming early-stage startups from zero to one. With a knack for technical market strategy and a startup enthusiast's mindset, she bridges the gap between innovative solutions and meaningful market adoption.",
    image: "/img/authors/harsha.webp",
    linkedin: "https://www.linkedin.com/in/harsha-kalbalia/",
  },
];

const Webinar1Page = () => {

  return (
    <Layout
      title='A Journey into Data Lake: Introducing Apache Iceberg'
      description='Learn how to set up OLAP system/platform for analysis from NoSQL Databases (MongoDB & DynamoDB) using Apache Iceberg.'
    >

      <main className="container mx-auto px-36 md:px-36 py-12">

        <WebinarTitle
          title="A Journey into Data Lake: Introducing Apache Iceberg"
          tag="Webinar"
        />

        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Thank You for Registering!
          </h1>

        </section>

        <section className="flex justify-center mb-12">
          <YouTubeEmbed videoId="3TQgSfbTrn0" className="max-w-6xl" />
        </section>

        <WebinarOverview
          date="October 03, 2024"
          time="08:30 PM - 09:30 PM IST"
          duration="1 hours"
          summary="Learn how to set up OLAP system/platform for analysis from NoSQL Databases (MongoDB & DynamoDB) using Apache Iceberg."
          bulletPoints={[
            "The Data Landscape - OLTP -> ETL -> OLAP",
            "Traditional ETL Process",
            "Brief about Features of Iceberg",
            "Benefits and Impact: How Iceberg Transformed Our Data Strategy"
          ]}
        />

        <Hr /> <br />

        <WebinarHosts hosts={hosts} />

        <WebinarCTA
          CTAText={"Ready to Join our next webinar?"}
        />

      </main>

    </Layout>
  );
};

export default Webinar1Page;