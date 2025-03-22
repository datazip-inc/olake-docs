import React from 'react'
import image1 from './image.png'
import SectionLayout from './SectionLayout'
const HeroSection = () => {
  return (
    <SectionLayout className='flex flex-row items-center justify-center'>
      <div className='flex flex-col items-center justify-center space-y-2 md:flex-row'>
        <div className='w-full md:w-1/2'>
          <h1 className='text-[52px] text-'>
            Join the <br></br> ‍<span className='text-blue-600'>Contributor</span> Program
          </h1>
          <div>
            Give back to the community and receive benefits and rewards for helping contribute to
            Airbyte’s connector ecosystem. We can't wait to have you join us.
          </div>
        </div>
        <img src={image1} alt={''} className='object-cover' />
      </div>
    </SectionLayout>
  )
}
export default HeroSection
