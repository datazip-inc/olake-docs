import React from 'react'
import CommunityPage from './CommunityPage'
import PageHero from './PageHero'
import Breadcrumbs, { type BreadcrumbType } from './Breadcrumbs'

/**
 * Shell for one webinar, event or community-meetup page: breadcrumb, type tag and title in the
 * hero, then the page's blocks (cover, player, overview, hosts, notes, CTA) stacked in one column.
 * `title` and `description` are the page's SEO title and meta description.
 */
export default function DetailPage({
  title,
  description,
  heading,
  tag,
  breadcrumb,
  activePath,
  children
}: {
  title: string
  description: string
  /** The visible h1. */
  heading: string
  /** "Webinar", "Event" or "Community Meetup". */
  tag?: string
  breadcrumb?: BreadcrumbType
  activePath?: string
  children: React.ReactNode
}) {
  const path =
    activePath ??
    (breadcrumb === 'community' || tag === 'Community Meetup' ? '/community' : '/webinar')
  return (
    <CommunityPage
      title={title}
      description={description}
      activePath={path}
      hero={
        <PageHero
          size='md'
          badge={tag}
          breadcrumbs={breadcrumb ? <Breadcrumbs type={breadcrumb} title={heading} /> : undefined}
          title={heading}
        />
      }
    >
      <div className='px-[32px] pt-[8px] pb-[56px] lg:px-[24px] lg:pb-[96px]'>
        <div className='mx-auto flex w-full max-w-[1016px] flex-col gap-[36px] lg:gap-[56px]'>
          {children}
        </div>
      </div>
    </CommunityPage>
  )
}
