import React from 'react'
import Link from '@docusaurus/Link'
import { useBlogPost } from '@docusaurus/plugin-content-blog/client'
import { useDateTimeFormat } from '@site/src/lib/docusaurus'
import EditMetaRow from '@theme/EditMetaRow'
import AuthorCards from '@site/src/components/blog/AuthorCards'
import PostCtaBand from '@site/src/components/blog/PostCtaBand'
import usePostEnd from '@site/src/components/blog/PostEndContext'
import { isCategoryTag } from '@site/src/components/blog/categories'

/**
 * End of a post: author bio cards, the publish date, the tags, the edit / last-updated row, and a short OLake call
 * to action. The band is left out when the post already ends with <BlogCTA /> in its MDX (most
 * do), so the reader does not get the same card twice. "Next steps" (older/newer post, related
 * posts) follows below the article, see BlogLayout.
 */
export default function BlogPostItemFooter() {
  const { metadata } = useBlogPost()
  const { tags: allTags, editUrl, lastUpdatedBy, lastUpdatedAt, date } = metadata
  // Category tags (How-To, ...) drive the blog filter; only topic tags are listed here
  const tags = allTags.filter((tag) => !isCategoryTag(tag))
  // Fixed locale and UTC: same text on the server and in the browser
  const dateFormat = useDateTimeFormat({ day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  const { bodyCta } = usePostEnd()
  const hasEditRow = Boolean(editUrl || lastUpdatedAt || lastUpdatedBy)

  return (
    <footer className='ob-post-footer'>
      <AuthorCards />

      <p className='ob-post-footer__date'>
        Published <time dateTime={date}>{dateFormat.format(new Date(date))}</time>
      </p>

      {tags.length > 0 && (
        <div className='ob-post-footer__tags'>
          <p className='ob-post-footer__label'>Tags</p>
          <ul className='ob-taglist'>
            {tags.map((tag) => (
              <li key={tag.permalink}>
                <Link to={tag.permalink} rel='tag' title={tag.description} className='ob-chip'>
                  {tag.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasEditRow && (
        <EditMetaRow
          className='ob-post-footer__meta'
          editUrl={editUrl}
          lastUpdatedAt={lastUpdatedAt}
          lastUpdatedBy={lastUpdatedBy}
        />
      )}

      {!bodyCta && <PostCtaBand />}
    </footer>
  )
}
