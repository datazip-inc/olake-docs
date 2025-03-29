import React from 'react'
import SectionLayout from './SectionLayout'
const CommunityHeroSection = () => {
    return (
        <SectionLayout className='items-center w-full  bg-blue-900  ' >
            <div className='flex flex-col text-white'>
                <div className='w-full md:h-1/2 h-full  flex justify-center'>
            
                    <svg

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
                <div className='h-1/2  mx-auto text-center'>
                    <h1 className='font-bold text-[52px]'><span className='text-blue-500'>Made</span> by engineers,<br></br> for engineers.</h1>
                    <div className='flex items-center justify-center space-x-4 mx-auto font-semibold'>  
                        <div>Slack</div>
                        <div>Discourse</div>
                        <div>Contribute</div>
                        <div>Events</div>
                        <div>Contributors</div>
                        <div>Champions</div>
                    </div>
                </div>
            </div>
        </SectionLayout>
    )
}

export default CommunityHeroSection