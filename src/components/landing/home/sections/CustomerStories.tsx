import React from 'react'
import Link from '@docusaurus/Link'
import SectionHeading from '../ui/SectionHeading'
import { STORIES, STORIES_INTRO } from '@site/src/data/landing/home/stories'

const StoryCard = ({
  story,
  featured
}: {
  story: (typeof STORIES)[number]
  featured?: boolean
}) => (
  <Link
    to={story.href}
    className='flex h-full flex-col overflow-hidden rounded-[14px] border border-solid border-[#ececec] bg-white text-[#202020] transition-shadow hover:shadow-[0_18px_40px_-28px_rgba(16,24,64,0.4)]'
  >
    <img
      src={story.cover}
      alt={story.company}
      loading='lazy'
      decoding='async'
      className={
        featured
          ? 'block h-[220px] w-full object-cover lg:h-[310px]'
          : 'block h-[150px] w-full object-cover lg:h-[168px]'
      }
    />
    <div className='flex flex-1 flex-col px-[16px] pb-[18px] pt-[16px] lg:px-[20px] lg:pb-[20px]'>
      <img
        src={story.logo}
        alt={story.company}
        loading='lazy'
        decoding='async'
        className='block h-[18px] w-auto object-contain'
        style={{ maxWidth: '120px' }}
      />
      <p
        className={
          featured
            ? 'mt-[12px] text-[18px] leading-[1.3] text-[#202020] lg:text-[24px]'
            : 'mt-[10px] text-[15px] leading-[1.3] text-[#202020] lg:text-[18px]'
        }
      >
        {story.title}
      </p>
      <span className='mt-auto pt-[16px] text-[13px] text-[#8a8a8a]'>Read More</span>
    </div>
  </Link>
)

export default function CustomerStories() {
  const [featured, ...rest] = STORIES

  return (
    <section className='px-[32px] py-[56px] lg:px-[24px] lg:py-[96px]'>
      <div className='mx-auto w-full max-w-[1016px]'>
        <SectionHeading
          eyebrow={STORIES_INTRO.eyebrow}
          title={STORIES_INTRO.title}
          align='center'
        />

        <div className='mt-[28px] grid grid-cols-1 gap-[20px] lg:mt-[44px] lg:grid-cols-2 lg:gap-[24px]'>
          <StoryCard story={featured} featured />
          <div className='flex flex-col gap-[20px] lg:gap-[24px]'>
            {rest.map((story) => (
              <StoryCard key={story.href} story={story} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
