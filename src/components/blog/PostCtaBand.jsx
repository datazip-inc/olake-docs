import React from 'react'
import { PiArrowUpRight, PiGithubLogo } from 'react-icons/pi'
import Button from '@site/src/components/landing/ui/Button'
import Card from '@site/src/components/landing/ui/Card'
import { POST_CTA } from './ctaCopy'

/** The short call-to-action band at the end of a post (same message as the sticky card). */
export default function PostCtaBand() {
  return (
    <Card className='ob-band'>
      <p className='ob-band__title'>{POST_CTA.bandTitle}</p>
      <div className='ob-band__actions'>
        <Button href={POST_CTA.primary.href}>
          <PiArrowUpRight size={16} aria-hidden='true' />
          {POST_CTA.primary.label}
        </Button>
        <Button href={POST_CTA.secondary.href} variant='secondary' external>
          <PiGithubLogo size={17} aria-hidden='true' />
          {POST_CTA.secondary.label}
        </Button>
      </div>
    </Card>
  )
}
