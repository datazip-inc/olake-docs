import React from 'react'
import { useDateTimeFormat } from '@site/src/lib/docusaurus'
import PostCard from '@site/src/components/blog/PostCard'

/**
 * The grid of post cards used by every blog list (list pages, tag pages, author pages).
 * Props: `items` (the page's posts) and `featured` (list page 1: the first card spans the row).
 * The first card's cover is the priority image; see PostCard.
 */
export default function BlogPostItems({ items, featured = false }) {
  // Fixed locale and UTC: server and browser must render the same date text
  const dateFormat = useDateTimeFormat({
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  })
  const formatDate = (date) => dateFormat.format(new Date(date))

  // On desktop the grid has three columns; when the last row would hold two cards, they split it
  const rest = featured ? items.length - 1 : items.length
  const halfFrom = rest % 3 === 2 ? items.length - 2 : items.length

  return (
    <div className='ob-grid'>
      {items.map((post, index) => (
        <PostCard
          key={post.content.metadata.permalink}
          post={post}
          priority={index === 0}
          featured={featured && index === 0}
          half={index >= halfFrom}
          formatDate={formatDate}
        />
      ))}
    </div>
  )
}
