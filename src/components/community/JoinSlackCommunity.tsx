import React from 'react'
import Slack from "@site/static/img/icon/slack.svg";
import SectionLayout from './SectionLayout'
import Link from '@docusaurus/Link'
const JoinSlack = () => {
  
const SlackChannels = [
    {
        name: 'good-reads',
        description: 'Share articles and resources that youve found helpful.'
      },
      {
        name: 'help-connection-issues',
        description: 'Get support from the community on your connection issues'
      },
      {
        name: 'help-infrastructure-deployment',
        description: 'Discuss best practices with the community on Airbyte deployment.'
      },
      {
        name: 'events-and-conferences',
        description: 'Hype talks, promote your favorite local conferences, see CFPs.'
      },
      {
        name: 'help-connector-development',
        description: 'Discuss about the best way to leverage Airbytes Connector Development Kit.'
      },
      {
        name: 'help-api-cli-orchestration',
        description: 'Share best practices on how to leverage Airbyte API, CLI and more.'
      }
]
  return (
    <SectionLayout className='flex flex-row items-center justify-center '>
      <div className='flex flex-col items-center justify-center space-y-6 text-center'>
        <div className=''> </div>
        <h1>Join the data engineering <span className='text-blue-500'>community</span>  on Slack</h1>
        <h6 className='font-semibold text-[20px]'>Join over 20,000+ passionate data engineering practitioners like you.
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
        <Link legacyBehavior href={"https://join.slack.com/t/getolake/shared_invite/zt-2utw44do6-g4XuKKeqBghBMy2~LcJ4ag"} className='p-4 bg-blue-600 w-fit text-center  rounded-full text-white '> Join Olake community Slack</Link>
        <div>Need direct access to our team and SLAs for support?
              <span className='text-blue-500 font-semibold cursor-pointer'> Talk to our team</span></div>
      </div>  
    </SectionLayout>
  )
}
export default JoinSlack
