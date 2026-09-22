import React from 'react'
import Link from '@docusaurus/Link'
import SectionHeading from '../ui/SectionHeading'
import { STORIES, STORIES_INTRO } from '@site/src/data/landing/home/stories'

const StoryCard = ({
  story,
  layout = 'standard'
}: {
  story: (typeof STORIES)[number]
  layout?: 'featured' | 'horizontal' | 'standard'
}) => {
  const baseCard = 'group flex overflow-hidden rounded-[20px] border border-solid border-[#ececec] bg-white p-[12px] lg:p-[16px] text-[#202020] transition-shadow hover:shadow-[0_18px_40px_-28px_rgba(16,24,64,0.4)]'
  
  const logoHeight = story.company === 'Xeno' ? 'h-[14px]' : story.company === 'Cordial' ? 'h-[22px]' : 'h-[18px]'

  if (layout === 'horizontal') {
    return (
      <Link to={story.href} className={`${baseCard} flex-col sm:flex-row gap-[16px] lg:gap-[24px]`}>
        <img
          src={story.cover}
          alt={story.company}
          loading='lazy'
          decoding='async'
          className='block h-[280px] w-full rounded-[10px] object-cover sm:h-full lg:h-[254px] sm:w-[50%]'
        />
        <div className='flex flex-1 flex-col pt-[4px] lg:pt-[8px]'>
          <img
            src={story.logo}
            alt={story.company}
            loading='lazy'
            decoding='async'
            className={`block w-auto object-contain ${logoHeight}`}
            style={{ maxWidth: '120px', alignSelf: 'flex-start' }}
          />
          <p className='mt-[16px] text-[16px] leading-[1.3] text-[#202020] lg:text-[20px]'>
            {story.title}
          </p>
          <span className='mt-auto pt-[16px] text-[14px] lg:text-[15px] font-medium text-[#a0a0a0] transition-colors group-hover:text-[#6b8afd]'>Read More</span>
        </div>
      </Link>
    )
  }

  return (
    <Link to={story.href} className={`${baseCard} flex-col gap-[16px] lg:gap-[20px] ${layout === 'featured' ? 'h-full' : ''}`}>
      <img
        src={story.cover}
        alt={story.company}
        loading='lazy'
        decoding='async'
        className={
          layout === 'featured'
            ? 'block h-[280px] w-full rounded-[10px] object-cover lg:h-[310px]'
            : 'block h-[200px] w-full rounded-[10px] object-cover lg:h-[200px]'
        }
      />
      <div className='flex flex-1 flex-col'>
        <img
          src={story.logo}
          alt={story.company}
          loading='lazy'
          decoding='async'
          className={`block w-auto object-contain ${logoHeight}`}
          style={{ maxWidth: '120px', alignSelf: 'flex-start' }}
        />
        <p
          className={
            layout === 'featured'
              ? 'mt-[16px] text-[18px] leading-[1.3] text-[#202020] lg:text-[26px]'
              : 'mt-[16px] text-[16px] leading-[1.3] text-[#202020] lg:text-[20px]'
          }
        >
          {story.title}
        </p>
        <span className='mt-auto pt-[16px] text-[14px] lg:text-[15px] font-medium text-[#a0a0a0] transition-colors group-hover:text-[#6b8afd]'>Read More</span>
      </div>
    </Link>
  )
}

export default function CustomerStories() {
  const [xeno, cordial, bitespeed] = STORIES

  return (
    <section className='px-[32px] py-[56px] lg:px-[24px] lg:py-[96px]'>
      <div className='mx-auto w-full max-w-[1016px]'>
        <SectionHeading
          eyebrow={STORIES_INTRO.eyebrow}
          title={STORIES_INTRO.title}
          align='center'
        />

        <div className='mt-[28px] grid grid-cols-1 gap-[20px] lg:mt-[44px] lg:grid-cols-2 lg:gap-[24px]'>
          <StoryCard story={xeno} layout='featured' />
          <div className='flex flex-col gap-[20px] lg:gap-[24px]'>
            <StoryCard story={cordial} layout='horizontal' />
            <StoryCard story={bitespeed} layout='standard' />
          </div>
        </div>
      </div>
    </section>
  )
}
