import React from 'react'
import SectionLayout from './SectionLayout'
import Link from '@docusaurus/Link'
const CommunityAbout = () => {
    return (
        <SectionLayout className='flex flex-col items-center justify-center ' >
            <div className='flex flex-col items-center justify-center space-y-6 text-center mx-60'>
                <h1 ><span className='text-blue-500' >About</span>  our community</h1>
                <div className='text-[20px]'>This is an inclusive place where engineers can find or lend support and discover new ways to contribute to the community.</div>

                <Link legacyBehavior href={"https://olake.io/webinar"} className='p-4 bg-blue-600 w-fit text-center  rounded-full text-white font-bold'>Code of Conduct</Link>
            </div>
           
        </SectionLayout>
    )
}

export default CommunityAbout