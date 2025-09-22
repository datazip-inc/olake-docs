import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import React from "react";
import Layout from '@theme/Layout';
import CentralizedBreadcrumbs from '../../components/Breadcrumbs/CentralizedBreadcrumbs';
import Hr from '../../components/Hr';
import MeetupNotes from '../../components/MeetupNotes';
import meetupData from '../../data/meetup/8th-meetup.json';
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';
import SlidesCarousel, { Slide } from '../../components/SlidesCarousel';

const hosts = [
  {
    name: "Akshay Kumar Sharma",
    role: "DevRel @ OLake",
    bio: "OLake DevRel and community advocate, passionate about open-source data engineering and lakehouse architectures.",
    image: "/img/authors/akshay.webp",
    linkedin: "https://www.linkedin.com/in/akshay-kumar-sharma-devvoyager",
  },
  {
    name: "Schitiz Sharma",
    role: "DevOps Engineer @ OLake",
    bio: "OLake Maintainer and DevOps engineer with expertise in Kubernetes deployments, Helm charts, and infrastructure automation for data engineering platforms.",
    image: "/img/authors/schitiz.webp",
    linkedin: "https://www.linkedin.com/in/schitizsharma",
  },
];

const decks: Slide[] = [
  { title: '8th OLake Community Meetup', url: 'https://docs.google.com/presentation/d/1QvuMbxpsklrmvE2NVacowKcRDnZEZOmc-9FJGprKHgw/edit?usp=sharing' },
];

const CommunityPage = () => {
  const communityData = {
    title: 'OLake 8th Community Meetup',
    summary: 'In this community meetup we showcased an end-to-end demo of OLake\'s latest features, including Oracle CDC, filtering capabilities, incremental sync, and Helm deployment within the OLake UI.',
  };

  return (
    <Layout
      title={communityData.title}
      description={communityData.summary}
    >
      <main className="container mx-auto lg:px-36 py-12">
        <CentralizedBreadcrumbs
          type="community"
          title={communityData.title}
        />
        <WebinarTitle
          title={`${communityData.title}`}
          tag="Community Meetup"
        />

       

        <section className="flex justify-center mb-12">
          <YouTubeEmbed videoId="V-Kj66coGhE" className="max-w-6xl" />
        </section>

        <Hr />
        <br />

        <WebinarOverview
          date="August 29, 2025"
          time="04:30 PM - 05:30 PM IST"
          duration="1 hour"
          summary={communityData.summary}
          bulletPoints={[
            "Oracle CDC Demo: We demonstrated real-time change capture directly from Oracle databases into OLake pipelines",
            "Filtering Capabilities: Showcased applying flexible ingestion filters to control data flow and ensure cleaner datasets",
            "Incremental Sync: Explained syncing only changes since the last run for faster and more efficient pipeline executions",
            "Helm Deployment: Demonstrated deploying OLake seamlessly to Kubernetes using Helm charts for simplified setup and scaling",
            "Unified Demo: Presented how OLake connects ingestion, storage, and analytics in a production-ready open lakehouse environment",
            "Latest Features: Explored the newest advancements in OLake and their role in the evolving open data ecosystem"
          ]}
        />

        <Hr />
        <br />

        <SlidesCarousel slides={decks} />

        <Hr />
        <br />

        <WebinarHosts hosts={hosts} />

        <MeetupNotes data={meetupData} />

        <WebinarCTA
          CTAText={"Ready to Join our next OLake community meetup?"}
        />

      </main>
    </Layout>
  );
};

export default CommunityPage;
