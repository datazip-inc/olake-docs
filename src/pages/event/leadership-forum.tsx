import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import Image from '@theme/IdealImage'
import LeadershipForumEventDetails from '../../components/events/LeadershipForumEventDetails';
import CTAButton from '../../components/webinars/CTAButton';
import CentralizedBreadcrumbs from '../../components/Breadcrumbs/CentralizedBreadcrumbs';
import { FaRegCalendarAlt } from 'react-icons/fa';

import Layout from '@theme/Layout';
import React from "react";
import Hr from '../../components/Hr';

const hosts = [
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
    linkedin: "https://www.linkedin.com/in/harsha-kalbalia/",
  },
];

const WebinarPage = () => {


  return (

    <Layout
      title='A Leadership Forum for Data Engineers and MLOps'
      description='Join us for an intensive session bringing together senior data engineers and ML practitioners. We will explore the intersection of modern data architecture and ML operations, focusing on building scalable platforms that serve both analytics and machine learning needs'
    >

      <main className="container mx-auto px-16 md:px-36 py-12">
        <CentralizedBreadcrumbs
          type="webinar"
          title="A Leadership Forum for Data Engineers and MLOps"
        />
        
        <WebinarTitle
          title="A Leadership Forum for Data Engineers and MLOps"
          tag="Event"
        />

        <div className="flex flex-col md:flex-row ">

          <div className=" md:w-1/2 ">


            <Image img={`/img/events/e-1-leadership-forum.webp`} alt="events Cover Image" />
          </div>

          <div className="md:w-1/3 md:relative md:left-56 p-4">

            <div className="flex justify-center items-center p-10 bg-gray-100 dark:bg-gray-800">
              <CTAButton
                title="Join Our Upcoming Event"
                buttonText="Registrations Over"
                icon={FaRegCalendarAlt}
                href="https://lu.ma/z80xycc7"
                variant="secondary"
              />
            </div>

          </div>
        </div>

        <Hr /> <br />

        <WebinarOverview
          date="December 21, 2024"
          time="11:00 - 14:00 IST Bengaluru, Karnataka"
          duration="3 hours"
          summary="Join us for an intensive session bringing together senior data engineers and ML practitioners. We'll explore the intersection of modern data architecture and ML operations, focusing on building scalable platforms that serve both analytics and machine learning needs."

          bulletPoints={[
            "Current state of data & ML platforms",
            "Key challenges in serving both analytics and ML workloads",
            "Data lakehouse architectures for ML workloads",
            "Feature store implementation patterns",
            "Bridging the gap between data engineering and ML pipelines",
            "CDC and real-time feature engineering",
            "ML model monitoring and data quality",
            "Building reliable data pipelines for both BI and ML",
            "Data versioning and experiment tracking",
            "Enjoy refreshments while networking with like-minded professionals.",
            "Unified metrics layer implementation",
            "MLOps pipeline automation",
            "Data mesh and feature democratization",
            "Performance optimization for ML workloads",
            "Emerging trends in data platforms and MLOps",
            "Building collaborative data and ML teams"
          ]}

        />
        <Hr />
        <br />

        <div className="min-h-screen  p-4">
          <LeadershipForumEventDetails />
        </div>


        <WebinarHosts hosts={hosts} />

        <WebinarCTA
          CTAText={"Ready to Join our next?"}
        />

      </main>
    </Layout>

  );
};

export default WebinarPage;