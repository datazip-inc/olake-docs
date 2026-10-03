import React from 'react'
import Link from '@docusaurus/Link'
import { useBlogPost } from '@docusaurus/plugin-content-blog/client'
import { useDateTimeFormat } from '@site/src/lib/docusaurus'
import PostCard from './PostCard'
import usePostEnd from './PostEndContext'

const Arrow = ({ dir }) => (
  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d={dir === 'prev' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
  </svg>
)

function StepLink({ item, label, dir }) {
  return (
    <Link to={item.permalink} rel={dir === 'prev' ? 'prev' : 'next'} className={`ob-step ob-step--${dir}`}>
      <span className='ob-step__label'>
        {dir === 'prev' && <Arrow dir='prev' />}
        {label}
        {dir === 'next' && <Arrow dir='next' />}
      </span>
      <span className='ob-step__title'>{item.title}</span>
    </Link>
  )
}

/**
 * "Next steps" below the article: the newer and older post (stock paginator data) and three
 * related posts from the same blog (build-time data, see src/plugins/blog-plugin.js).
 */
export default function NextSteps() {
  const { metadata } = useBlogPost()
  const { prevItem, nextItem } = metadata
  const { cards } = usePostEnd()
  // Fixed locale and UTC: server and browser must render the same date text
  const dateFormat = useDateTimeFormat({ day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
  const formatDate = (date) => dateFormat.format(new Date(date))

  if (!prevItem && !nextItem && cards.length === 0) return null

  return (
    <section className='ob-next' aria-labelledby='ob-next-title'>
      <h2 id='ob-next-title' className='ob-next__title'>
        Next steps
      </h2>

      {(prevItem || nextItem) && (
        <nav className='ob-steps' aria-label='Blog post page navigation'>
          {prevItem ? <StepLink item={prevItem} label='Newer post' dir='prev' /> : <span />}
          {nextItem ? <StepLink item={nextItem} label='Older post' dir='next' /> : <span />}
        </nav>
      )}

      {cards.length > 0 && (
        <>
          <h3 className='ob-next__sub'>Related posts</h3>
          <div className='ob-grid ob-grid--related'>
            {cards.map((card) => (
              <PostCard
                key={card.permalink}
                post={{ content: { metadata: card } }}
                headingLevel='h4'
                formatDate={formatDate}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
