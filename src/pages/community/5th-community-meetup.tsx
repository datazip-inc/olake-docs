import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
// import WebinarForm from "../../components/forms/WebinarForm";
import React = require('react');
import Layout from '@theme/Layout';
import Hr from '../../components/Hr';
import MeetupNotes from '../../components/MeetupNotes';
import meetupData from '../../data/meetup/5th-meetup.json'
import YouTubeEmbed from '../../components/webinars/YouTubeEmbed';

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
];

const CommunityPage = () => {

  const communityData = {
    title: 'OLake 5th Community Meetup',
    summary: 'OLake 5th Community Meetup',
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
          <YouTubeEmbed videoId="dgxEBp9qWOQ" className="max-w-6xl" />
        </section>

        <Hr />
        <br />

        <WebinarOverview
          date="March 27, 2025"
          time="09:00 PM - 10:00 PM IST"
          duration="1 hours"
          summary={communityData.summary}
          bulletPoints={[

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