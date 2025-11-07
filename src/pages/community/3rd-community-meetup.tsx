import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import React from "react";
import Layout from '@theme/Layout';
import CentralizedBreadcrumbs from '../../components/Breadcrumbs/CentralizedBreadcrumbs';
import Hr from '../../components/Hr';
import MeetupNotes from '../../components/MeetupNotes';
import meetupData from '../../data/meetup/3rd-meetup.json'
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';

import SlidesCarousel, { Slide } from '../../components/SlidesCarousel';

const decks: Slide[] = [
  { title: '3rd Community Meetup', url: 'https://docs.google.com/presentation/d/1AnnyJZlDSdwQULd0pHZ9UWm3NNMWB7bK3DASV9GVouM/edit#slide=id.g330c4f6be02_0_0' }
];


const hosts = [
  {
    name: "Priyansh Khodiyar",
    role: "Ex DevRel",
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
  {
    name: "Ankit Kumar",
    role: "Senior backend dev and OLake Maintainer",
    bio: "",
    image: "/img/authors/ankit.webp",
    linkedin: "https://www.linkedin.com/in/hashcode-ankit/",
  },
];

const CommunityPage = () => {
  const communityData = {
    title: 'OLake 3rd Community Meetup',
    summary: 'OLake 3rd Community Meetup',
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

        <div className="flex flex-col items-center justify-center lg:flex-row md:items-start">


        </div>

        <section className="flex justify-center mb-12">
          <YouTubeEmbed videoId="V2ouyKSjxzg" className="max-w-6xl" />
        </section>

        <Hr />

        <br />

        <WebinarOverview
          date="February 13, 2025"
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