import React from 'react'
import SectionLayout from './SectionLayout'
import { Card } from '../ui/card'
import { AiOutlineDollarCircle } from 'react-icons/ai'
import { LiaCodeBranchSolid } from 'react-icons/lia'
import { BsStars } from 'react-icons/bs'
const Whyjointheprogram = () => {
  return (
    <SectionLayout className='items-center justify-center bg-gradient-to-b from-blue-500 to-pink-500 text-center'>
      <div className='rounded-md border-2 border-black bg-white p-4 hover:shadow-sm'>
        <h1 className='mb-8 text-[36px] font-bold text-black md:text-[42px]'>
          Why join the program?
        </h1>
        <div className='flex flex-col justify-between gap-10 md:flex-row'>
          <ContributeWayCard
            title={'Rewards + Recognition'}
            subtitle={'Get paid for your work on select issues and new connector contributions.'}
            icon={<AiOutlineDollarCircle className='h-12 w-12 text-orange-500' />}
          />
          <ContributeWayCard
            title={'Learning + Community'}
            subtitle={
              'Contributing is a great way to level up your skills and share your knowledge with your peers.'
            }
            icon={<LiaCodeBranchSolid className='h-12 w-12 text-orange-500' />}
          />
          <ContributeWayCard
            title={'Beta updates'}
            subtitle={
              'Gain early access especially for developer-features like our CDK and connector builder.'
            }
            icon={<BsStars className='h-12 w-12 text-orange-500' />}
          />
        </div>
      </div>
    </SectionLayout>
  )
}

export default Whyjointheprogram

const ContributeWayCard = ({ title, subtitle, icon }) => {
  return (
    <Card className='flex w-72 flex-col space-y-3 border-2 border-blue-500 bg-white p-8 text-start text-black shadow-md transition-shadow duration-300 hover:shadow-lg'>
      <div>{icon}</div>

      <h2 className='mb-2 text-xl font-semibold'>{title}</h2>
      <div className='text-gray-700'>{subtitle}</div>
    </Card>
  )
}
