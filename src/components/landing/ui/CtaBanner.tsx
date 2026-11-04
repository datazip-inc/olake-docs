import React from 'react'
import Button from './Button'
import Section from './Section'

/** Closing call-to-action card: eyebrow, headline, copy and one primary button. */
export default function CtaBanner({
  eyebrow,
  title,
  body,
  cta,
  image
}: {
  eyebrow?: string
  title: React.ReactNode
  body?: React.ReactNode
  cta: { label: string; href: string }
  /** Decorative image under the copy (the dotted artwork on the home page). */
  image?: { src: string; width: number; height: number }
}) {
  return (
    <Section flush className='pb-[56px] lg:pb-[96px]'>
      <div className='overflow-hidden rounded-[16px] border border-solid border-olake-line bg-olake-surface'>
        <div className='px-[24px] pt-[36px] text-left lg:px-[64px] lg:pt-[56px]'>
          {eyebrow && <p className='text-[13px] text-olake-muted lg:text-[14px]'>{eyebrow}</p>}
          <h2 className='mt-[8px] max-w-[520px] text-[26px] font-normal leading-[1.15] tracking-[-0.01em] text-olake-ink lg:text-[40px]'>
            {title}
          </h2>
          {body && (
            <p className='mt-[14px] max-w-[640px] text-[13px] leading-[1.6] text-olake-text-2 lg:text-[15px]'>
              {body}
            </p>
          )}
          <Button href={cta.href} className='mt-[22px] lg:mt-[28px]'>
            {cta.label}
          </Button>
        </div>
        {image ? (
          <img
            src={image.src}
            alt=''
            width={image.width}
            height={image.height}
            loading='lazy'
            decoding='async'
            className='mx-auto mt-[18px] block w-full max-w-[860px] lg:mt-[24px]'
          />
        ) : (
          <div className='h-[36px] lg:h-[56px]' />
        )}
      </div>
    </Section>
  )
}
