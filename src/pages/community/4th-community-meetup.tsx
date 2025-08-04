import WebinarTitle from '../../components/webinars/WebinarTitle';
// import WebinarCoverImage from '../../components/webinars/WebinarCoverImage';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
// import WebinarForm from "../../components/forms/WebinarForm";
import React from "react";
import Layout from '@theme/Layout';
import Hr from '../../components/Hr';
import MeetupNotes from '../../components/MeetupNotes';
import meetupData from '../../data/meetup/4th-meetup.json'
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';

import SlidesCarousel, { Slide } from '../../components/SlidesCarousel';

const decks: Slide[] = [
  { title: '4th Community Meetup', url: 'https://docs.google.com/presentation/d/1zU4lkoEoX9ilHfxgU7nlq5mGC_CW52uBgz-ZtEEFJJE/edit#slide=id.g330c4f6be02_0_0' }
];


const hosts = [
  {
    name: "Priyansh Khodiyar",
    role: "DevRel and OLake Maintainer",
    bio: "",
    image: "/img/authors/priyansh.jpg",
    linkedin: "https://www.linkedin.com/in/zriyansh/",
  },
  {
    name: "Shubham Satish Baldava",
    role: "Co-founder @ Datazip and OLake Maintainer",
    bio: "",
    image: "/img/authors/shubham.jpg",
    linkedin: "https://www.linkedin.com/in/rohan-khameshra/",
  },
  {
    name: "Ankit Kumar",
    role: "Senior backend dev and OLake Maintainer",
    bio: "",
    image: "/img/authors/ankit.jpg",
    linkedin: "https://www.linkedin.com/in/hashcode-ankit/",
  },
];

const CommunityPage = () => {

  const communityData = {
    title: 'OLake 4th Community Meetup',
    summary: 'OLake 4th Community Meetup',
  };
  return (
    <Layout
      title={communityData.title}
      description={communityData.summary}
    >

      <main className="container mx-auto lg:px-36 py-12">
        <WebinarTitle
          title={communityData.title}
          tag="Community Meetup"
        />

        <section className="flex justify-center mb-12">
          <YouTubeEmbed videoId="dP1jnSfgs9Q" className="max-w-6xl" />
        </section>

        <Hr />

        <br />

        <WebinarOverview
          date="February 28, 2025"
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