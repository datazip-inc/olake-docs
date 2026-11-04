import React from 'react'
import { PiArrowSquareOut, PiGithubLogo, PiSlackLogo } from 'react-icons/pi'
import { cn } from '@site/src/lib/utils'

interface PostCtaProps {
  title: string
  body: string
  slackUrl: string
  githubUrl: string
  githubLabel: string
}

// `!` (important) on the colors: `.markdown a { color }` in the content CSS has higher specificity
// than a single utility class and would turn the button labels link-blue.
const BTN =
  'lk-press inline-flex h-[38px] items-center justify-center gap-[8px] rounded-[8px] border border-solid px-[16px] text-[14px] no-underline transition-colors'
const PRIMARY = cn(
  BTN,
  'border-olake-blue-ring bg-olake-blue text-olake-on-blue! hover:border-olake-blue-hover hover:bg-olake-blue-hover hover:text-white!'
)
const SECONDARY = cn(
  BTN,
  'border-olake-btn-border bg-olake-surface text-olake-btn-secondary! hover:bg-olake-surface-alt hover:text-olake-ink!'
)

/**
 * The call-to-action card at the end of a blog post (BlogCTA, FusionBlogCTA): title, one line,
 * three actions and the contact address. Lakeside card styling, light and dark through tokens.
 */
export default function PostCta({ title, body, slackUrl, githubUrl, githubLabel }: PostCtaProps) {
  return (
    <aside className='not-prose my-10 rounded-[16px] border border-solid border-olake-line bg-olake-surface p-[24px] lg:p-[32px]'>
      <p className='m-0 text-[22px] leading-[1.2] tracking-[-0.01em] text-olake-ink lg:text-[26px]'>
        {title}
      </p>
      <p className='m-0 mt-[10px] max-w-[620px] text-[15px] leading-[1.6] text-olake-text-2'>
        {body}
      </p>
      <div className='mt-[20px] flex flex-wrap gap-[10px]'>
        <a href='/contact/' className={PRIMARY}>
          <PiArrowSquareOut aria-hidden='true' size={13} />
          Signup
        </a>
        <a href={slackUrl} target='_blank' rel='noopener noreferrer' className={SECONDARY}>
          <PiSlackLogo aria-hidden='true' size={15} />
          Join Slack
        </a>
        <a href={githubUrl} target='_blank' rel='noopener noreferrer' className={SECONDARY}>
          <PiGithubLogo aria-hidden='true' size={15} />
          {githubLabel}
        </a>
      </div>
      <p className='m-0 mt-[16px] text-[13px] text-olake-muted'>
        Contact us at <strong className='font-medium text-olake-text-2'>hello@olake.io</strong>
      </p>
    </aside>
  )
}
