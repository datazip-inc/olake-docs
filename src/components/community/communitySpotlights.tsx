import React from 'react'
import SectionLayout from './SectionLayout'
import Link from '@docusaurus/Link'
const CommunitySpotlights = () => {
    return (
        <SectionLayout className='items-center w-full  ' >
            <div className='flex flex-col w-full items-center justify-center space-y-6 text-center'>
                <h1 ><span className='text-blue-500' >Community</span> Spotlights</h1>
                <div className='text-[20px]'>Our 3 latest data champions</div>

                <Link legacyBehavior href={"https://olake.io/webinar"} className='p-4 bg-blue-600 w-fit text-center  rounded-full text-white font-bold'>See all our Events</Link>
            </div>
        </SectionLayout>
    )
}

export default CommunitySpotlights