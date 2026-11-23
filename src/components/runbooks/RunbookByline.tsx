import React from 'react'
import Link from '@docusaurus/Link'
import { useRunbook } from './useRunbook'

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

/**
 * One line under the title: the author and the date the lab behind the page was last run. Both
 * come from the `runbook:` front matter, so the byline cannot drift from the page.
 */
export default function RunbookByline() {
  const { author, frontMatter } = useRunbook()
  const run = frontMatter.reproduced
  const name = author ? (
    author.page ? (
      <Link to={author.page} className='font-medium text-olake-ink no-underline hover:underline'>
        {author.name}
      </Link>
    ) : (
      <span className='font-medium text-olake-ink'>{author.name}</span>
    )
  ) : null
  return (
    <p className='olake-runbook-byline mb-[20px] mt-[-4px] text-[14px] leading-[1.5] text-olake-muted'>
      {name ? <>By {name}</> : null}
      {name && run ? <span aria-hidden='true'> &middot; </span> : null}
      {run ? <>Reproduced {formatDate(run.date)}</> : null}
    </p>
  )
}
