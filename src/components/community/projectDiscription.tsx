import React from 'react'
import SectionLayout from './SectionLayout'

const ProjectDisciption = () => {
  return (
    <SectionLayout className='items-center justify-center  md:mx-80'>
      <div className='flex flex-col'>
        <h1 className='text-center md:text-[42px] text-[36px]'>Program description</h1>

        <h2 className='text-blue-500'>Overview</h2>
        <p>
          The OLake Contributor Program is a collaboration with the community with the goal to
          improve the quality of connectors by sponsoring various tasks around the features,
          usability, and reliability of our connectors including building in-demand connectors.
          Through this program, we hope to empower and recognize veteran and newcomers alike!
        </p>
        <h2 className='text-blue-500'> How it works</h2>
        <p>
          Start by checking out our guide for contributors. After you've spent some time reviewing
          that guide, you're ready to get started. Fill out the form listed in the guide and we'll
          reach out. You'll be invited to a private Slack channel where you can ask questions and
          receive support from our team. In addition to becoming an official OLake project
          Contributor, you will also receive additional benefits including cash rewards, custom
          branded swag, peer networking and education opportunities, access to beta updates, and
          more! Visit the contributors guide to get started. We can wait to have you join us!
        </p>
      </div>
    </SectionLayout>
  )
}

export default ProjectDisciption
