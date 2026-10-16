import React from 'react'
import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import { useIntegration } from './useIntegration'
import type { Person } from '@site/src/data/integrations'

function PersonBox({ person, label }: { person: Person | undefined; label: string }) {
  const photo = useBaseUrl(person?.avatar ?? '')
  if (!person) return null
  return (
    <div className='flex items-center gap-[12px] rounded-[8px] border border-solid border-olake-line bg-olake-surface px-[12px] py-[8px] leading-[1.35]'>
      <img
        src={photo}
        alt=''
        width={40}
        height={40}
        loading='lazy'
        decoding='async'
        className='h-[40px] w-[40px] flex-none rounded-[6px] object-cover'
        style={{ margin: 0 }}
      />
      <div className='min-w-0'>
        <span className='block text-[12px] text-olake-muted'>{label}</span>
        <span className='block text-[14px] font-medium text-olake-ink'>
          {person.page ? (
            <Link to={person.page} className='text-olake-ink'>
              {person.name}
            </Link>
          ) : (
            person.name
          )}
        </span>
        <span className='block text-[12px] text-olake-muted'>{person.title}</span>
      </div>
    </div>
  )
}

/**
 * At the end of the page: who wrote the page and who tested it, from the `integration:` front matter.
 */
export default function IntegrationByline() {
  const { author, reviewer } = useIntegration()
  return (
    <div className='olake-integration-byline my-[24px] grid gap-[8px] rounded-[12px] border border-solid border-olake-line bg-olake-surface-alt p-[8px] sm:grid-cols-2'>
      <PersonBox person={author} label='Written by' />
      <PersonBox person={reviewer} label='Tested by' />
    </div>
  )
}
