import React from 'react'
import Link from '@docusaurus/Link'
import StatsSection from './StatsSection'
import { FaGithub, FaRegStar } from 'react-icons/fa'
import { useNumberTicker } from '../../hooks/useNumberTicker'
import useGetReleases from '../../hooks/useGetReleases'
import { formatCompactNumber } from '@site/utils/tools'

const HeroSection: React.FC = () => {
  const { stargazersCount, slackCount } = useGetReleases()

  const animatedStarCount = useNumberTicker(stargazersCount || 0)
  const animatedSlackCount = useNumberTicker(slackCount)

  return (
    <div className='mx-auto flex w-full flex-col-reverse items-center justify-between overflow-hidden py-8 xl:container md:px-6 md:py-16 lg:flex-row lg:px-0 lg:py-20'>
      {/* Left Column - contains 2 rows */}
      <div className='container mt-0 flex w-full flex-col lg:mt-0'>
        {/* Row 1: "Fastest way to replicate..." section */}
        <div className='mt-8 flex w-full flex-col justify-center sm:items-center'>
          <div className='flex gap-x-3'>
            <a
              href='https://github.com/datazip-inc/olake'
              target='_blank'
              rel='noopener noreferrer'
              className='flex w-fit items-center gap-x-1 rounded-full border border-solid border-brand-gray-300 bg-brand-gray-100 px-2 py-1 font-space text-[8px] font-medium text-inherit hover:text-inherit hover:no-underline sm:gap-x-2 sm:px-4 sm:py-2 sm:text-sm'
            >
              <FaGithub />
              <div>
                Live on Github.{' '}
                <span className='ml-0.5 inline-block min-w-[1.3rem] whitespace-nowrap text-left sm:min-w-[2.25rem]'>
                  {stargazersCount !== 0 ? formatCompactNumber(animatedStarCount) : '1.3K'}
                </span>
              </div>
              <FaRegStar />
            </a>
            <a
              href='/slack'
              className='flex w-fit items-center rounded-full border border-solid border-brand-gray-300 bg-brand-gray-100 px-2 py-1 font-space text-[8px] font-medium text-inherit hover:text-inherit hover:no-underline sm:gap-x-2 sm:px-4 sm:py-2 sm:text-sm'
            >
              <img src='/img/icon/slack.svg' alt='Slack' className='size-2 sm:size-4' />
              <div className='flex items-center'>
                <span className='ml-1 inline-block min-w-[1.4rem] whitespace-nowrap text-left sm:min-w-[2.5rem]'>
                  {animatedSlackCount !== 0
                    ? formatCompactNumber(animatedSlackCount, { suffix: '+' })
                    : '500+'}
                </span>
                Active Community Members
              </div>
            </a>
          </div>

          <div className='mt-8 text-2xl font-light leading-tight sm:text-center sm:text-5xl sm:leading-normal'>
            <h1 className='leading-inherit font-inherit m-0 mb-0 font-medium text-inherit'>
              Fastest Database & Kafka Replication to S3 and Iceberg
            </h1>
          </div>
          <div className='mt-4 font-sans text-xs font-normal leading-normal text-neutral-700 sm:text-xl'>
            Open-source EL (Extract & Load) engine built for Apache Iceberg
          </div>

          <div className='mx-auto mt-10 text-[10px] font-medium text-brand-gray-600 sm:text-sm'>
            Open Source / Apache 2.0 License
          </div>

          <div className='mt-3 flex flex-col items-center gap-2 font-helvetica text-sm sm:flex-row sm:text-base'>
            <Link
              to='/docs/getting-started/quickstart'
              className='flex h-8 w-full items-center justify-center rounded-lg bg-brand-blue-500 px-4 py-1 text-center font-medium text-white hover:text-white hover:no-underline sm:h-12 sm:w-40'
            >
              Try OLake
            </Link>
            <Link
              to='/#olake-form-product'
              className='flex h-8 w-full items-center justify-center rounded-lg !border !border-solid !border-brand-blue-500 bg-white px-4 py-1 text-center font-medium text-brand-blue-500 hover:no-underline sm:h-12 sm:w-40'
            >
              Talk to us
            </Link>
          </div>

          <div className='relative mt-12 hidden max-h-[50vh] overflow-hidden rounded-xl sm:block'>
            <img
              src='/img/site/jobs-page.webp'
              alt='OLake Jobs Page'
              fetchPriority='high'
              className='w-full rounded-xl border-2 border-[#DDDDDD] object-cover object-top shadow-[0_0_14px_0_rgba(0,0,0,0.07)]'
            />
            {/* Fade to white gradient overlay */}
            <div className='pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-white to-transparent' />
          </div>

          {/* Row 2: Stats Section */}
          <div className='w-full justify-center lg:w-3/5 lg:justify-start'>
            <StatsSection />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
