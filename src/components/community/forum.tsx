import React from 'react'

import SectionLayout from './SectionLayout'
const CommunityForum = () => {
    const Channels = [
        {
            name: 'Question',
            description: 'Ask the Community for help on your  questions'
          },
          {
            name: 'Ideas',
            description: 'Share ideas for improvements, or feedback. upvote too'
          },
          {
            name: 'Show and Tell',
            description: 'Show off something you have made, to promote knowledge sharing'
          },
          {
            name: 'Kind Words',
            description: 'Show off something you love about OLake, to foster positive culture   '
          },
          {
            name: 'General',
            description: 'For anything that doesnt fit in the order categories'
          },
          
    ]
    return (
        <SectionLayout className='flex flex-row items-center justify-center bg-blue-950'>
            <div className='flex flex-col items-center justify-center space-y-6 text-center' >
                <h1 className='text-white'>Find the community's questions  questions and ideas</h1>
                <h6  className='text-white font-semibold text-[20px]'>Interested in sharing tips, ideas and asking questions? Want to see what the community built?
                Find everything from guides, troubleshooting resolutions, data stack advice, feature requests in OLake's GitHub Discussions.</h6>
                <div className="grid grid-cols-3 gap-4 mt-8">
                    {Channels.map((channel, index) => (
                        <div key={index} className="p-4 border bg-white rounded-lg shadow-lg hover:shadow-2xl">
                            <h3 className="text-lg font-bold text-blue-500">#{channel.name}</h3>
                            <p className="mt-2 text-gray-600">{channel.description}</p>
                        </div>  
                    ))}
                </div>
                <div className='p-4 bg-blue-600 w-fit text-center  rounded-full text-white font-bold'> Explore  OLake community Forum</div>
            </div>
        </SectionLayout>
    )
}







export default CommunityForum;