import React from 'react'
import { PiDownloadSimple } from 'react-icons/pi'
import Card from '../ui/Card'
import Section from '../ui/Section'
import SectionHeading from '../ui/SectionHeading'
import { cn } from '@site/src/lib/utils'
import {
  LOGO_BASE_PATH,
  LOGO_GROUPS,
  type Logo,
  type LogoShape
} from '@site/src/data/landing/branding'

/** Display size of the preview per logo shape (the width and height attributes carry the real size). */
const PREVIEW: Record<LogoShape, string> = {
  mark: 'h-[64px] w-[64px]',
  horizontal: 'h-auto w-[230px] max-w-[80%]',
  stacked: 'h-[130px] w-auto max-w-[80%]'
}

const DOWNLOAD =
  'inline-flex h-[34px] items-center gap-[8px] rounded-[8px] border border-solid border-olake-btn-border bg-olake-surface px-[12px] text-[13px] font-medium text-olake-btn-secondary transition-colors hover:border-olake-blue hover:text-olake-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olake-blue'

function DownloadLink({ logo, ext, label }: { logo: Logo; ext: 'svg' | 'webp'; label: string }) {
  return (
    <a
      href={`${LOGO_BASE_PATH}${logo.file}.${ext}`}
      download
      className={DOWNLOAD}
      aria-label={`Download ${logo.name} as ${label}`}
    >
      <PiDownloadSimple size={16} aria-hidden='true' />
      {label}
    </a>
  )
}

function LogoCard({ logo, shape }: { logo: Logo; shape: LogoShape }) {
  const dark = logo.background === 'dark'
  return (
    <Card as='li' className='flex flex-col'>
      <div
        className={cn(
          'flex h-[190px] items-center justify-center border-0 border-b border-solid border-olake-line lg:h-[210px]',
          dark ? 'bg-olake-surface-dark' : 'bg-olake-surface-alt'
        )}
      >
        <img
          src={`${LOGO_BASE_PATH}${logo.file}.svg`}
          alt={logo.name}
          width={logo.width}
          height={logo.height}
          loading='lazy'
          decoding='async'
          className={cn('block object-contain', PREVIEW[shape])}
        />
      </div>
      <div className='flex flex-1 flex-col px-[20px] pb-[20px] pt-[18px]'>
        <h4 className='mb-0 text-[16px] font-medium leading-[1.3] text-olake-ink'>{logo.name}</h4>
        <p className='mb-0 mt-[6px] flex-1 text-[13px] leading-[1.6] text-olake-text-2'>
          {logo.description}
        </p>
        <div className='mt-[16px] flex flex-wrap gap-[8px]'>
          <DownloadLink logo={logo} ext='svg' label='SVG' />
          <DownloadLink logo={logo} ext='webp' label='WEBP' />
        </div>
      </div>
    </Card>
  )
}

export default function LogoSection() {
  return (
    <Section id='logos' className='scroll-mt-[90px]'>
      <SectionHeading eyebrow='Logos' title='Logo Assets' />
      <div className='mt-[32px] flex flex-col gap-[48px] lg:mt-[44px] lg:gap-[64px]'>
        {LOGO_GROUPS.map((group) => (
          <div key={group.id}>
            <h3 className='mb-0 text-[17px] font-normal leading-[1.3] text-olake-ink lg:text-[22px]'>
              {group.title}
            </h3>
            <p className='mb-0 mt-[6px] text-[13px] leading-[1.6] text-olake-text-2 lg:text-[15px]'>
              {group.body}
            </p>
            <ul className='m-0 mt-[18px] list-none p-0 grid gap-[16px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-[20px]'>
              {group.logos.map((logo) => (
                <LogoCard key={logo.file} logo={logo} shape={group.shape} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
