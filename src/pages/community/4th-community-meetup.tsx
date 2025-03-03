import WebinarTitle from '../../components/webinars/WebinarTitle';
import WebinarCoverImage from '../../components/webinars/WebinarCoverImage';
import WebinarHosts from '../../components/webinars/WebinarHosts';
import WebinarCTA from '../../components/webinars/WebinarCTA';
import WebinarOverview from '../../components/webinars/WebinarOverview';
import WebinarForm from "../../components/forms/WebinarForm";
import React = require('react');
import Layout from '@theme/Layout';
import Hr from '../../components/Hr';
import MeetupNotes from '../../components/MeetupNotes';
import meetupData from '../../data/meetup/4th-meetup.json'
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
  {
    name: "Ankit Kumar",
    role: "Senior backend dev and OLake Maintainer",
    bio: "",
    image: "/img/authors/ankit.jpg",
    linkedin: "https://www.linkedin.com/in/hashcode-ankit/",
  },
];

const CommunityPage = () => {

  return (
    <Layout
      title='OLake 4th Community Meetup'
      description='OLake 4th Community Meetup.'
    >

      <main className="container mx-auto lg:px-36 py-12">
        <WebinarTitle
          title="OLake 4th Community Meetup"
          tag="Community Meetup"
        />

        <div className="flex flex-col items-center justify-center lg:flex-row md:items-start">
          
          {/* <div className="w-full md:w-2/3 flex justify-center">
            <WebinarCoverImage src="/img/community/4th-community-meetup-cover.png" alt="Meetup Cover Image" />
          </div> */}



          {/* <div className="w-full md:w-1/3 flex mt-4 md:mt-0 justify-center pl-0 md:pl-20">
            <WebinarForm
              source="w-1-intro-iceberg"
              nexturl="w-1-intro-iceberg-confirmation"
            />
          </div> */}
        </div>
        
        <section className="flex justify-center mb-12">
          <YouTubeEmbed videoId="dP1jnSfgs9Q" className="max-w-6xl" />
        </section>

        <Hr />

        <br />

        <WebinarOverview
          date="February 28, 2025"
          time="04:30 PM - 05:30 PM IST"
          duration="1 hours"
          summary="OLake 4th Community Meetup."
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