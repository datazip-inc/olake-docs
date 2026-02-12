import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import React from "react";
import Layout from '@theme/Layout';
import CentralizedBreadcrumbs from '../../components/Breadcrumbs/CentralizedBreadcrumbs';
import Hr from '../../components/Hr';
import MeetupNotes from '../../components/MeetupNotes';
import meetupData from '../../data/meetup/9th-meetup.json';
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';
import { HOSTS } from '../../data/webinarHosts';

const hosts = [HOSTS.AKSHAY_KUMAR_SHARMA, HOSTS.DUKE, HOSTS.NAYAN_JOSHI];

const CommunityPage = () => {
  const communityData = {
    title: 'OLake 9th Community Meetup',
    summary: 'Introducing Kafka-Powered CDC Pipelines and Smarter Ingestion Controls Across the Open Lakehouse. This meetup showcases the next wave of advancements expanding OLake\'s CDC ecosystem and refining user control, performance, and reliability.',
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
          <YouTubeEmbed videoId="k-aBmymRIR0" className="max-w-6xl" />
        </section>

        <Hr />
        <br />

        <WebinarOverview
          date="November 12, 2025"
          time="04:30 PM - 05:30 PM IST"
          duration="1 hour"
          summary={communityData.summary}
          bulletPoints={[
            "Kafka Support: Introducing Kafka support for data ingestion from Kafka topics directly into Iceberg, ideal for modern architectures",
            "Architecture Deep Dive: Duke showcased the architecture of Kafka and OLake working together for seamless data pipelines",
            "Live Demo: Nayan demonstrated the Kafka integration with practical examples and real-world use cases",
            "Smarter Sync Management: Clear Destination, Cancel Job, and Flexible Ingestion Modes (Append/Upsert) for better control",
            "Simplified Iceberg Destination: Table/Column normalization and flexible database/namespace options for compatibility",
            "Secure Connectivity: IAM Integration for MongoDB with passwordless AWS IAM-based authentication",
            "Documentation Updates: Revamped documentation with new blogs around Apache Iceberg and tutorials with Polaris and Bauplan",
            "Community Spotlight: Celebrating contributions from Hacktoberfest participants and ongoing open-source efforts"
          ]}
        />

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

