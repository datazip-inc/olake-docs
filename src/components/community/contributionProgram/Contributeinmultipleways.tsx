import React from 'react'
import image1 from './image1.svg'
import { Card } from '../../../components/ui/card'
import SectionLayout from './SectionLayout'
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
          image={image1}
        />
        <ContributeWayCard
          title={'Write Docs'}
          subtitle={
            'Write tutorials, improve getting started guides, and clarify connector features.'
          }
          image={image1}
        />
        <ContributeWayCard
          title={'Make Improvements'}
          subtitle={'Complete feature requests, squash bugs, and improve connector performance.'}
          image={image1}
        />
      </div>
    </SectionLayout>
  )
}
export default HeroSection

const ContributeWayCard = ({ title, subtitle, image }) => {
  return (
    <Card className='flex flex-col items-center bg-white p-8 text-center text-black'>
      {image && <img src={image} alt={title} />}
      <h2>{title}</h2>
      <div>{subtitle}</div>
    </Card>
  )
}
