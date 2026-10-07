import React from 'react'
import { PiArrowUpRight, PiGithubLogo } from 'react-icons/pi'
import { useBlogPost } from '@docusaurus/plugin-content-blog/client'
import PostToc from './PostToc'
import Button from '@site/src/components/landing/ui/Button'
import Card from '@site/src/components/landing/ui/Card'
import { POST_CTA } from './ctaCopy'

/**
 * The sticky card beside the article (desktop only, hidden by CSS below 1100px): the OLake call to
 * action for OLake Go, with a collapsed "On this page" under it.
 */
export default function PostAside() {
  const { metadata, toc } = useBlogPost()
  const {
    hide_table_of_contents: hideToc,
    toc_min_heading_level: minLevel,
    toc_max_heading_level: maxLevel
  } = metadata.frontMatter

  return (
    <aside className='ob-aside' aria-label='Try OLake Go'>
      <div className='ob-aside__inner'>
        <Card className='ob-cta'>
          <p className='ob-cta__title'>{POST_CTA.title}</p>
          <p className='ob-cta__text'>{POST_CTA.text}</p>
          <div className='ob-cta__actions'>
            <Button href={POST_CTA.primary.href} className='ob-cta__btn'>
              <PiArrowUpRight size={16} aria-hidden='true' />
              {POST_CTA.primary.label}
            </Button>
            <Button href={POST_CTA.secondary.href} variant='secondary' external className='ob-cta__btn'>
              <PiGithubLogo size={17} aria-hidden='true' />
              {POST_CTA.secondary.label}
            </Button>
          </div>
        </Card>
        {!hideToc && (
          <PostToc
            toc={toc}
            minLevel={minLevel}
            maxLevel={maxLevel}
            variant='rail'
            label='Table of contents (sidebar)'
          />
        )}
      </div>
    </aside>
  )
}
