import WebinarTitle from '../../components/webinars/WebinarTitle';
// import WebinarCoverImage from '../../components/webinars/WebinarCoverImage';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
// import WebinarForm from "../../components/forms/WebinarForm";
import React from "react";
import Layout from '@theme/Layout';
import CentralizedBreadcrumbs from '../../components/Breadcrumbs/CentralizedBreadcrumbs';
import Hr from '../../components/Hr';
import MeetupNotes from '../../components/MeetupNotes';
import meetupData from '../../data/meetup/6th-meetup.json';
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';

import SlidesCarousel, { Slide } from '../../components/SlidesCarousel';

const decks: Slide[] = [
  { title: '6th Community Meetup', url: 'https://docs.google.com/presentation/d/15vg09t-JY2uLn4H3uGHRCDtRDS1JeUnkfwVraCiD8Gw/edit#slide=id.g330c4f6be02_0_0' },
  { title: 'PhysicsWallah with OLake', url: 'https://docs.google.com/presentation/d/1Kbwjh7MMc-6pWMEH6Fat7K9us-Osiygf-NNXOxwYStI/edit?slide=id.g3531bdb1a28_2_75#slide=id.g3531bdb1a28_2_75' },
];



const hosts = [
  {
    name: "Priyansh Khodiyar",
    role: "Ex Devrel",
    bio: "",
    image: "/img/authors/priyansh.webp",
    linkedin: "https://www.linkedin.com/in/zriyansh/",
  },
  {
    name: "Shubham Satish Baldava",
    role: "Co-founder @ Datazip and OLake Maintainer",
    bio: "",
    image: "/img/authors/shubham.webp",
    linkedin: "https://www.linkedin.com/in/rohan-khameshra/",
  },
];

const CommunityPage = () => {
  const communityData = {
    title: 'OLake 6th Community Meetup',
    summary: 'OLake 6th Community Meetup',
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
          title={communityData.title}
          tag="Community Meetup"
        />

        <section className="flex justify-center mb-12">
          <YouTubeEmbed videoId="B8ApTbZ5Py4" className="max-w-6xl" />
        </section>

        <Hr />
        <br />

        <WebinarOverview
          date="April 28, 2025"
          time="04:30 PM - 05:30 PM IST"
          duration="1 hours"
          summary={communityData.summary}
          bulletPoints={[

          ]}
        />
        <Hr />
        <br />


        <SlidesCarousel slides={decks} />

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

