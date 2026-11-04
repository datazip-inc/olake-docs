import React from 'react'
import Link from '@docusaurus/Link'
import { PiRocketLaunch, PiSlackLogo } from 'react-icons/pi'
import { cn } from '@site/src/lib/utils'
import { SLACK_URL } from '@site/src/components/landing/chrome/navItems'

const QUICKSTART_URL = '/docs/getting-started/quickstart/'

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
 * The call to action on an integration page: two actions only, the quickstart and Slack. Used
 * once in the middle of the page (after the first successful query) and once at the end.
 */
export default function IntegrationCta({
  title = 'Try it on your own database',
  body = 'OLake Go is open source. The quickstart brings up the UI with Docker Compose in a few minutes; the Slack community answers setup questions the same day.'
}: {
  title?: string
  body?: string
}) {
  return (
    <aside className='not-prose my-[32px] rounded-[16px] border border-solid border-olake-line bg-olake-surface p-[24px]'>
      <p className='m-0 text-[20px] leading-[1.25] tracking-[-0.01em] text-olake-ink'>{title}</p>
      <p className='m-0 mt-[8px] max-w-[620px] text-[15px] leading-[1.6] text-olake-text-2'>{body}</p>
      <div className='mt-[18px] flex flex-wrap gap-[10px]'>
        <Link to={QUICKSTART_URL} className={PRIMARY}>
          <PiRocketLaunch aria-hidden='true' size={15} />
          Quickstart
        </Link>
        <a href={SLACK_URL} target='_blank' rel='noopener noreferrer' className={SECONDARY}>
          <PiSlackLogo aria-hidden='true' size={15} />
          Join Slack
        </a>
      </div>
    </aside>
  )
}
