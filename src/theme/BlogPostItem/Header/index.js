import React from 'react'
import { useBlogPost } from '@docusaurus/plugin-content-blog/client'
import BlogPostItemHeaderTitle from '@theme/BlogPostItem/Header/Title'

/**
 * Header of a blog post: the title (h1) and a quiet reading-time line. The author and the date are
 * at the end of the post (BlogPostItem/Footer). Replaces the stock header, whose Infima margin
 * utilities (!important) cannot be overridden from the site CSS.
 */
export default function BlogPostItemHeader() {
  const { metadata } = useBlogPost()
  const { readingTime } = metadata

  return (
    <header className='ob-post-header'>
      <BlogPostItemHeaderTitle className='ob-post-title' />
      {typeof readingTime !== 'undefined' && (
        <p className='ob-post-header__read'>{Math.max(1, Math.ceil(readingTime))} min read</p>
      )}
    </header>
  )
}
