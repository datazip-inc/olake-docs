import React, {useId, useState} from 'react'
import Link from '@docusaurus/Link'
import {useLocation} from '@docusaurus/router'
import {
  PiArrowUpRight,
  PiBugBeetle,
  PiCheckCircle,
  PiLightbulb,
  PiSlackLogo,
  PiThumbsDown,
  PiThumbsUp
} from 'react-icons/pi'
import {SLACK_URL} from '../landing/chrome/navItems'

const ISSUE_BASE = 'https://github.com/datazip-inc/olake-docs/issues/new?assignees=&labels=&template='

const PILL =
  'lk-press inline-flex h-[36px] cursor-pointer items-center gap-[8px] rounded-[999px] border border-solid ' +
  'border-olake-btn-border bg-olake-surface px-[14px] text-[14px] text-olake-btn-secondary no-underline ' +
  'transition-colors hover:bg-olake-surface-alt hover:text-olake-ink'

/**
 * End of every docs page: "Was this topic helpful?" (sends the same GA `feedback` event as before)
 * and the "Join the OLake Community" call to action, in one quiet card.
 */
export default function DocsFeedback({label}: {label: string}) {
  const {pathname} = useLocation()
  const titleId = useId()
  const [vote, setVote] = useState<null | 'up' | 'down'>(null)

  const reportUrl = `${ISSUE_BASE}---doc-error-report.md&title=Issue with olake.io${pathname}`
  const enhanceUrl = `${ISSUE_BASE}---doc-site-enhancement-request.md&title=Doc enhancement request for olake.io${pathname}`

  const send = (value: 1 | 0) => {
    const gtag = typeof window !== 'undefined' ? (window as any).gtag : undefined
    if (gtag) {
      gtag('event', 'feedback', {event_category: 'button', event_label: label, value})
    }
    setVote(value === 1 ? 'up' : 'down')
  }

  return (
    <section
      aria-label="Feedback and community"
      className="olake-doc-feedback mt-[40px] overflow-hidden rounded-[16px] border border-solid border-olake-line bg-olake-surface"
    >
      <div className="p-[20px] lg:px-[24px] lg:py-[22px]">
        {vote === null ? (
          <div
            role="group"
            aria-labelledby={titleId}
            className="flex flex-wrap items-center justify-between gap-[14px]"
          >
            <p id={titleId} className="m-0 text-[16px] font-medium text-olake-ink">
              Was this topic helpful?
            </p>
            <div className="flex items-center gap-[10px]">
              <button type="button" className={PILL} onClick={() => send(1)}>
                <PiThumbsUp size={18} aria-hidden="true" />
                Yes
              </button>
              <button type="button" className={PILL} onClick={() => send(0)}>
                <PiThumbsDown size={18} aria-hidden="true" />
                No
              </button>
            </div>
          </div>
        ) : (
          <div role="status" className="olake-doc-feedback__thanks">
            <p className="m-0 flex items-center gap-[8px] text-[16px] font-medium text-olake-ink">
              <PiCheckCircle size={20} className="text-olake-blue dark:text-olake-blue-on-dark" aria-hidden="true" />
              Thanks for letting us know!
            </p>
            {vote === 'down' && (
              <div className="mt-[14px]">
                <p className="m-0 text-[15px] leading-[1.6] text-olake-text-2">
                  If you have a specific question about how to use OLake, ask it on our Slack channel, or open an
                  issue in the GitHub repo.
                </p>
                <div className="mt-[12px] flex flex-wrap gap-[10px]">
                  <Link to={SLACK_URL} className={PILL}>
                    <PiSlackLogo size={18} aria-hidden="true" />
                    Ask on Slack
                  </Link>
                  <a href={reportUrl} className={PILL} target="_blank" rel="noopener noreferrer">
                    <PiBugBeetle size={18} aria-hidden="true" />
                    Report a problem
                  </a>
                  <a href={enhanceUrl} className={PILL} target="_blank" rel="noopener noreferrer">
                    <PiLightbulb size={18} aria-hidden="true" />
                    Suggest an improvement
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[14px] border-0 border-t border-solid border-olake-line bg-olake-surface-alt p-[20px] sm:flex-row sm:items-center sm:justify-between lg:px-[24px] lg:py-[22px]">
        <div className="flex items-start gap-[14px]">
          <span
            aria-hidden="true"
            className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px] border border-solid border-olake-line bg-olake-surface text-olake-ink"
          >
            <PiSlackLogo size={20} />
          </span>
          <div>
            <p className="m-0 text-[16px] font-medium text-olake-ink">Join the OLake Community!</p>
            <p className="mb-0 mt-[4px] max-w-[520px] text-[14px] leading-[1.6] text-olake-text-2">
              Got questions, ideas, or just want to connect with other data engineers? Get real-time support, share
              feedback, and shape the future of OLake together. Your success with OLake is our priority.
            </p>
          </div>
        </div>
        <Link to={SLACK_URL} className={PILL + ' shrink-0 self-start sm:self-center'}>
          Join our Slack Community
          <PiArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
