import React from 'react'
import Link from '@docusaurus/Link'
import { useIntegration } from './useIntegration'

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

/**
 * One line under the title: the author and the date of the run behind the page. Both come from
 * the `integration:` front matter, so the byline cannot drift from the page. The reviewer and the
 * OLake Go version are in the "How we tested this" box at the end, not here.
 */
export default function IntegrationByline() {
  const { author, frontMatter } = useIntegration()
  const tested = frontMatter.tested
  if (!author && !tested) return null
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
    <p className='olake-integration-byline mb-[20px] mt-[-4px] text-[14px] leading-[1.5] text-olake-muted'>
      {name ? <>By {name}</> : null}
      {name && tested ? <span aria-hidden='true'> &middot; </span> : null}
      {tested ? <>Updated {formatDate(tested.date)}</> : null}
    </p>
  )
}
