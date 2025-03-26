import React from 'react'
import SectionLayout from './SectionLayout'

const ActiveContributors = () => {
  return (
    <SectionLayout className='items-center justify-center text-center'>
      <h1 className='mb-8 text-[36px] font-bold md:text-[42px]'>
        Check out our <span className='text-blue-500'>active contributors</span>
      </h1>
      <div>New connectors, ideas, bug fixes, docs, articles, join the movement!</div>
    </SectionLayout>
  )
}

export default ActiveContributors
