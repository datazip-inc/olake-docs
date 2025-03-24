import React from 'react'
import image1 from './image.png'
import SectionLayout from './SectionLayout'
const HeroSection = () => {
  return (
    <SectionLayout className='flex flex-row items-center justify-center'>
      <div className='flex flex-col items-center justify-center space-y-2 md:flex-row'>
        <div className='w-full space-y-4 md:w-1/2'>
          <h1 className='text-[42px] md:text-[52px]'>
            Join the <br></br> ‍<span className='text-blue-600'>Contributor</span> Program
          </h1>
          <div>
            Give back to the community and receive benefits and rewards for helping contribute to
            Olake’s connector ecosystem. We can't wait to have you join us.
          </div>
          <div className='w-fit rounded bg-blue-500 p-2 font-bold text-white hover:shadow-sm'>
            Apply here
          </div>
        </div>
        <div className='w-full md:w-1/2 flex justify-center'>
         
            <svg
              width="300"
              height="200"
              xmlns="http://www.w3.org/2000/svg"
              className="bg-gray-200"
            >
              <rect width="100%" height="100%" fill="#e5e7eb" />
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="20"
              >
                Placeholder Image
              </text>
            </svg>
        
        </div>
      </div>
    </SectionLayout>
  )
}
export default HeroSection
