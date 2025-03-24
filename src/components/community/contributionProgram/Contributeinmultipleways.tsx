import React from 'react'
import { Card } from '../../../components/ui/card'
import SectionLayout from './SectionLayout'
import { LuUnplug } from 'react-icons/lu'
import { FaFeather,FaMagnifyingGlass } from 'react-icons/fa6'
const HeroSection = () => {
  return (
    <SectionLayout backgroundColor='bg-blue-950' className='py-10 text-center'>
      <h1 className='text-white md:text-[42px] text-[36px]'>
        <span className='text-blue-500'>Contribute</span> in multiple ways
      </h1>
      <div className='flex md:flex-row flex-col justify-between gap-10'>
        <ContributeWayCard
          title={'Build New Connectors'}
          subtitle={"We welcome connectors built by the community. It's easy to get started"}
          icon={<LuUnplug className="w-16 h-16 text-blue-500" />}
        />
        <ContributeWayCard
          title={'Write Docs'}
          subtitle={
            'Write tutorials, improve getting started guides, and clarify connector features.'
          }
          icon={<FaFeather className="w-16 h-16 text-blue-500" />}
        />
        <ContributeWayCard
          title={'Make Improvements'}
          subtitle={'Complete feature requests, squash bugs, and improve connector performance.'}
          icon={<FaMagnifyingGlass className="w-16 h-16 text-blue-500" />}
        />
      </div>
    </SectionLayout>
  )
}
export default HeroSection

const ContributeWayCard = ({ title, subtitle, icon }) => {
  return (
    <Card className='flex flex-col space-y-3 items-center bg-white p-8 text-center text-black'>
       <div>{icon}</div>
      <h2>{title}</h2>
      <div>{subtitle}</div>
    </Card>
  )
}
