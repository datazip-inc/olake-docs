import React = require('react')
import Layout from '@theme/Layout'

import CommunityHeroSection from '../../components/community/commutityHeroSection'
import JoinSlack from '../../components/community/JoinSlackCommunity'
import CommunityForum from '../../components/community/forum'
import CommunityContribute from '../../components/community/communityContribute'
import CommunityEvents from '../../components/community/CommunityEvents'
import ActiveContributors from '../../components/community/activeContributors'
// import CommunitySpotlights from '../../components/community/communitySpotlights'
import CommunityAbout from '../../components/community/communityAbout'

interface Contributor {
  id: number
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}

const CommunityPage = () => {
  
  return (
    <Layout title='OLake' description='Fastest Database to Data Lakehouse data replication tool, open sourced'>   
        <div>
          <CommunityHeroSection/>
          <JoinSlack/>
          <CommunityForum/>
          <CommunityContribute/>
          <CommunityEvents/>
          <ActiveContributors/>
          {/* <CommunitySpotlights/> */}
          <CommunityAbout/>
        </div>
    </Layout>
  )
}

export default CommunityPage
