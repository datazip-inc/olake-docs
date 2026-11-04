import React from 'react'

/**
 * Compact streak hero for the about, contact and legal pages (rendered inside `.lakeside-hero-bg`
 * by LakesidePage). Same type scale as the home and branding heroes, with less bottom space.
 */
export default function PageHero({
  title,
  children
}: {
  title: React.ReactNode
  /** Intro copy under the title; each paragraph is a child element. */
  children?: React.ReactNode
}) {
  return (
    <section className='relative px-[32px] pb-[40px] pt-[150px] lg:px-[24px] lg:pb-[56px] lg:pt-[170px]'>
      <div className='mx-auto w-full max-w-[1016px] lg:text-center'>
        <h1 className='olake-h1 mb-0 lg:mx-auto lg:max-w-[820px]'>
          {title}
        </h1>
        {children && (
          <div className='mt-[12px] flex flex-col gap-[14px] [&_p]:mb-0 text-[13px] leading-[1.6] text-olake-text lg:mx-auto lg:mt-[22px] lg:max-w-[620px] lg:text-[15px] lg:leading-[1.65]'>
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
