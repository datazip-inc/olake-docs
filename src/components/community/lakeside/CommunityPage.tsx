import React from 'react'
import LakesidePage from '@site/src/components/landing/ui/LakesidePage'

/**
 * Shell for the community, webinar and event pages: the Lakeside page (pill navbar, footer, light
 * palette) with the page hero behind the navbar. Infima gives headings, paragraphs and lists
 * margins and lists a left padding; the lakeside reset is zero-specificity and loses, so it is
 * undone here for the whole page (as on the OLake Go page). Because of that, spacing inside
 * `children` is done with top margins and gaps, never bottom margins on these elements.
 */
export default function CommunityPage({
  title,
  description,
  activePath = '/community',
  hero,
  children
}: {
  title: string
  description: string
  /** Nav entry to mark as current. */
  activePath?: string
  hero: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <LakesidePage
      title={title}
      description={description}
      activePath={activePath}
      heroBackground={hero}
    >
      <div className='[&_:is(h1,h2,h3,h4,p,ul,ol)]:mb-0 [&_:is(ul,ol)]:pl-0'>{children}</div>
    </LakesidePage>
  )
}
