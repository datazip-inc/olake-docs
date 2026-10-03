import React from 'react'
import clsx from 'clsx'
import { useBlogPost } from '@docusaurus/plugin-content-blog/client'
import BlogPostItemContainer from '@theme/BlogPostItem/Container'
import BlogPostItemHeader from '@theme/BlogPostItem/Header'
import BlogPostItemContent from '@theme/BlogPostItem/Content'
import BlogPostItemFooter from '@theme/BlogPostItem/Footer'
import PostToc from '@site/src/components/blog/PostToc'

/**
 * One blog post (always the post page: lists use PostCard). Same parts as the stock component
 * (header, content, footer) with the collapsible table of contents between header and body; it is
 * outside the `.markdown` container, so the image zoom and the feed content never see it.
 */
export default function BlogPostItem({ children, className }) {
  const { metadata, toc } = useBlogPost()
  const {
    hide_table_of_contents: hideToc,
    toc_min_heading_level: minLevel,
    toc_max_heading_level: maxLevel
  } = metadata.frontMatter

  return (
    <BlogPostItemContainer className={clsx('ob-post', className)}>
      <BlogPostItemHeader />
      {!hideToc && <PostToc toc={toc} minLevel={minLevel} maxLevel={maxLevel} />}
      <BlogPostItemContent>{children}</BlogPostItemContent>
      <BlogPostItemFooter />
    </BlogPostItemContainer>
  )
}
