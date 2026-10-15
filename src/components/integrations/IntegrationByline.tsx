import React from 'react'
import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import { useIntegration } from './useIntegration'
import type { Person } from '@site/src/data/integrations'

function PersonChip({ person, role }: { person: Person | undefined; role: string }) {
  const avatar = useBaseUrl(person?.avatar ?? '')
  if (!person) return null
  const body = (
    <>
      <img
        src={avatar}
        alt=''
        width={28}
        height={28}
        loading='lazy'
        decoding='async'
        className='h-[28px] w-[28px] rounded-full object-cover'
      />
      <span className='flex flex-col leading-tight'>
        <span className='text-[12px] text-olake-muted'>{role}</span>
        <span className='text-[14px] font-medium text-olake-ink'>{person.name}</span>
      </span>
    </>
  )
  const className = 'flex items-center gap-[10px] no-underline'
  return person.page ? (
    <Link to={person.page} className={className}>
      {body}
    </Link>
  ) : (
    <span className={className}>{body}</span>
  )
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

/**
 * Under the title: who wrote the page, who checked it, and when the pipeline was last run. Every
 * value comes from the `integration:` front matter, so the byline cannot drift from the page.
 */
export default function IntegrationByline() {
  const { author, reviewer, frontMatter } = useIntegration()
  const tested = frontMatter.tested
  return (
    <div className='olake-integration-byline my-[20px] flex flex-wrap items-center gap-x-[28px] gap-y-[12px] border-y border-solid border-olake-line py-[12px]'>
      <PersonChip person={author} role='Written and tested by' />
      <PersonChip person={reviewer} role='Technical review' />
      {tested ? (
        <span className='flex flex-col leading-tight'>
          <span className='text-[12px] text-olake-muted'>Last tested</span>
          <span className='text-[14px] font-medium text-olake-ink'>
            {formatDate(tested.date)} on OLake Go {tested.olake}
          </span>
        </span>
      ) : null}
    </div>
  )
}
