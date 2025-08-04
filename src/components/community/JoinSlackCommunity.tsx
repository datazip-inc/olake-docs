import React from 'react'
import Slack from "@site/static/img/icon/slack.svg";
import SectionLayout from './SectionLayout'
import Link from '@docusaurus/Link'
const JoinSlack = () => {
  
const SlackChannels = [
    {
        name: 'contributing-to-olake',
        description: 'Get support on starting to contribute to OLake.'
      },
      {
        name: 'discussions',
        description: 'Share articles and resources that youve found helpful'
      },
      {
        name: 'general',
        description: 'All major things related to community members gets shared here by community members.'
      },
      {
        name: 'help',
        description: 'Stuck somewhere? Just ask us on this channel.'
      },
      {
        name: 'introduce-yourself',
        description: 'Best way to say that you have joined this community.'
      },
      {
        name: 'social-an-events',
        description: 'Everything related to socials about OLake goes here.'
      }
]
  return (
    <SectionLayout className='flex flex-row items-center justify-center '>
      <div className='flex flex-col items-center justify-center space-y-6 text-center'>
        <div className=''> </div>
        <h1>Join the data engineering <span className='text-blue-500'>community</span>  on Slack</h1>
        <h6 className='font-semibold text-[20px]'>Join over 205+ passionate data engineering practitioners like you.
            Share ideas and get advice. Below are some popular channels. We can't wait to sea you out there!
        </h6>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {SlackChannels.map((channel, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-lg hover:shadow-2xl">
              <h3 className="text-lg font-bold  text-blue-500">#{channel.name}</h3>
              <p className="mt-2 text-gray-600">{channel.description}</p>
            </div>
          ))}
        </div>
        <Link legacyBehavior href={"https://olake.io/slack"} className='p-4 bg-blue-600 w-fit text-center  rounded-full text-white '> Join OLake community Slack</Link>
        <div>Need direct access to our team and SLAs for support?
              <span className='text-blue-500 font-semibold cursor-pointer'> Talk to our team</span></div>
      </div>  
    </SectionLayout>
  )
}
export default JoinSlack
