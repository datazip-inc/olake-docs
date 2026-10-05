import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'

/**
 * One post in a list. The whole card is clickable through the title link (a stretched ::after),
 * so there are no nested anchors; the author link sits above it.
 * `priority` marks the first card of the page: its cover is loaded eagerly and at high priority
 * (it is the largest contentful paint element), every other cover is lazy.
 * `headingLevel` is the title's tag ('h2' in lists, 'h3' under a section heading).
 * `showDescription` is false for the related posts at the end of a post (title and cover are enough there).
 */
export default function PostCard({
  post,
  priority = false,
  featured = false,
  half = false,
  headingLevel: Heading = 'h2',
  showDescription = true,
  formatDate
}) {
  const { permalink, title, date, description, frontMatter, authors } =
    post.content.metadata
  const cover = useBaseUrl(frontMatter.image || '')
  const author = authors[0]
  const extraAuthors = authors.length - 1
  const authorLink = author?.page?.permalink

  const authorName = author && (
    <span className='ob-card__author-name' translate='no'>
      {author.name}
    </span>
  )

  return (
    <article className={clsx('ob-card', featured && 'ob-card--featured', half && 'ob-card--half')}>
      <div className='ob-card__media'>
        {frontMatter.image ? (
          <img
            src={cover}
            alt={title}
            width='1280'
            height='720'
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding='async'
          />
        ) : null}
      </div>

      <div className='ob-card__body'>
        <Heading className='ob-card__title'>
          <Link to={permalink}>{title}</Link>
        </Heading>

        {showDescription && description && <p className='ob-card__excerpt'>{description}</p>}

        <div className='ob-meta'>
          {author && (
            <span className='ob-meta__author' title={authors.map((a) => a.name).join(', ')}>
              {authorLink ? (
                <Link to={authorLink} className='ob-card__author-link'>
                  {authorName}
                </Link>
              ) : (
                authorName
              )}
              {extraAuthors > 0 && <span className='ob-meta__more'>+{extraAuthors}</span>}
            </span>
          )}
          <time dateTime={date}>{formatDate(date)}</time>
        </div>
      </div>
    </article>
  )
}
