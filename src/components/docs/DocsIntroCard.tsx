import React from 'react'
import { PiGithubLogo, PiLightning } from 'react-icons/pi'
import Button from '../landing/ui/Button'
import { GITHUB_REPO_URL } from '../landing/chrome/navItems'

/**
 * The introduction card at the top of the docs home page: the OLake mark, the one-line description of
 * the product and the two ways to start. It replaces the bare centred logo and tagline.
 */
export default function DocsIntroCard() {
  return (
    <section
      aria-label='About OLake'
      className='olake-intro-card relative my-[24px] overflow-hidden rounded-[20px] border border-solid border-olake-line p-[24px] lg:p-[36px]'
    >
      <div className='relative flex flex-col items-start gap-[20px] sm:flex-row sm:items-center sm:gap-[28px]'>
        <span
          aria-hidden='true'
          className='flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[18px] bg-olake-blue shadow-[0_8px_24px_-10px_var(--olake-blue),inset_0_1px_0_rgba(255,255,255,0.2)] lg:h-[88px] lg:w-[88px] lg:rounded-[22px]'
        >
          <img
            data-no-zoom
            src='/img/landing/shared/olake-mark-small.svg'
            alt=''
            width={40}
            height={40}
            className='h-[36px] w-[36px] lg:h-[44px] lg:w-[44px]'
          />
        </span>
        <div className='min-w-0'>
          <p className='m-0 text-[18px] font-medium leading-[1.4] text-olake-ink lg:text-[20px]'>
            Fastest open-source tool for replicating Databases to Apache Iceberg or Data Lakehouse.
          </p>
          <p className='mb-0 mt-[8px] flex items-start gap-[6px] text-[15px] leading-[1.6] text-olake-text-2 lg:text-[16px]'>
            <PiLightning size={18} className='mt-[3px] shrink-0 text-olake-blue dark:text-olake-blue-on-dark' aria-hidden='true' />
            <span>Efficient, quick and scalable data ingestion for real-time analytics.</span>
          </p>
        </div>
      </div>
      <div className='relative mt-[22px] flex flex-wrap items-center gap-[10px]'>
        <Button
          href='/docs/getting-started/quickstart/'
          size='md'
          className='text-olake-on-blue! no-underline hover:text-white! hover:no-underline'
        >
          Quickstart
        </Button>
        <Button
          href={GITHUB_REPO_URL}
          variant='secondary'
          size='md'
          external
          className='text-olake-btn-secondary! no-underline hover:text-olake-ink! hover:no-underline'
        >
          <PiGithubLogo size={18} aria-hidden='true' />
          GitHub
        </Button>
      </div>
    </section>
  )
}
