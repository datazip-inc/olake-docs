import React = require('react')
import Layout from '@theme/Layout'
import { useEffect, useState } from 'react'
import HeroSection from '../../../components/community/contributionProgram/HeroSection'
import Contributeinmultipleways from '../../../components/community/contributionProgram/Contributeinmultipleways'
import ProjectDisciption from '../../../components/community/contributionProgram/projectDiscription'
import Whyjointheprogram from '../../../components/community/contributionProgram/Why-join-the-program'


const ContributorsProgramPage = () => {
  return (
    <Layout title='OLake Contributors' description='OLake Contributors'>
      <div className='flex flex-col'>
        <HeroSection />
        <Contributeinmultipleways />

        <ProjectDisciption />
        <Whyjointheprogram />
      </div>
    </Layout>
  )
}

export default ContributorsProgramPage
