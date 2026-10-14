import React from 'react'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { cn } from '@site/src/lib/utils'
import { MockIcon } from './mock'

/** Rules on the dark section. It goes first in cn(): a later border-0 would drop the side classes. */
export const RULE = 'border-0 border-solid border-olake-line-dark'

/** Focus ring for controls on the dark section. */
export const FOCUS_ON_DARK =
  'focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olake-blue-on-dark'

/** The latest-release strip; the version comes from docusaurus.config.js. */
function ReleaseStrip() {
  const { siteConfig } = useDocusaurusContext()
  const label = siteConfig.customFields?.latestOlakeReleaseLabel as string | undefined
  const path =
    (siteConfig.customFields?.latestOlakeReleasePath as string | undefined) ||
    '/docs/release/ingestion'
  if (!label) return null
  return (
    <div className='flex flex-col gap-[4px] rounded-b-[14px] bg-olake-surface-dark-2 px-[20px] py-[14px] text-[15px] leading-[1.3] lg:h-[64px] lg:flex-row lg:items-center lg:gap-[20px] lg:px-[40px] lg:py-0 lg:text-[16px]'>
      <span className='text-olake-muted-on-dark'>Latest Release</span>
      <span className='text-[#eaeae3]'>We just released our {label}</span>
      <Link
        to={path}
        className={cn(
          'text-[14px] text-olake-blue-on-dark transition-colors hover:text-olake-blue-on-dark-hover lg:ml-auto',
          FOCUS_ON_DARK
        )}
      >
        Read More
      </Link>
    </div>
  )
}

/**
 * The dark, full-bleed benchmark section of a product page: a ruled column with (optionally) the
 * latest-release strip, the eyebrow, title and summary, the page's comparison (`children`), the
 * "how it does this" notes set in Geist Mono, and a bar linking to the detailed benchmarks.
 */
export default function BenchmarkShell({
  release,
  eyebrow,
  title,
  summary,
  how,
  link,
  children
}: {
  /** Show the latest-release strip on top. */
  release?: boolean
  eyebrow: string
  title: string
  summary: React.ReactNode
  how: { title: string; body: React.ReactNode; className?: string }
  link: { label: string; href: string }
  children: React.ReactNode
}) {
  return (
    <section id='benchmarks' className='bg-olake-surface-dark px-[16px] lg:px-[24px]'>
      <div className={cn(RULE, 'mx-auto max-w-[1004px] border-x text-white')}>
        {release && <ReleaseStrip />}

        <div
          className={cn(
            'px-[20px] pt-[40px] lg:px-[31px]',
            release ? 'lg:pt-[49px]' : 'lg:pt-[57px]'
          )}
        >
          <p className='text-[15px] leading-[1.3] text-olake-muted-on-dark lg:text-[16px]'>
            {eyebrow}
          </p>
          <h2 className='mt-[8px] text-[30px] leading-[1.2] font-normal text-balance text-white lg:text-[48px] lg:leading-[1.3]'>
            {title}
          </h2>
          <p className='mt-[10px] max-w-[499px] text-[15px] leading-[1.3] text-[#fdfdfb] lg:text-[16px]'>
            {summary}
          </p>
        </div>

        {children}

        <div
          className={cn(
            'product-mono px-[20px] pt-[33px] pb-[48px] lg:pb-[53px] lg:pl-[41px]',
            how.className
          )}
        >
          <p className='text-[15px] leading-[1.3] text-[#fdfdfd] lg:text-[16px]'>{how.title}</p>
          <div className='mt-[16px] text-[13px] leading-[1.3] font-light text-[#9e9e9e] lg:text-[14px]'>
            {how.body}
          </div>
        </div>

        <Link
          to={link.href}
          className={cn(
            'flex h-[64px] items-center justify-center gap-[9px] rounded-t-[14px] bg-olake-surface-dark-2 text-[15px] leading-[1.3] text-[#eaeae3] transition-colors hover:text-white lg:text-[16px]',
            'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-olake-blue-on-dark'
          )}
        >
          {link.label}
          <MockIcon name='product/link-arrow-square-out' w={18} />
        </Link>
      </div>
    </section>
  )
}
