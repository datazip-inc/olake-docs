import React from 'react'
import LakesidePage from '@site/src/components/landing/ui/LakesidePage'
import Section from '@site/src/components/landing/ui/Section'
import PageHero from './PageHero'
import './pages-misc.css'

/**
 * Shell for the privacy policy and terms of use: Lakeside navbar and footer, a compact hero with
 * the title and the last-updated line, and the legal text as a readable ~720px prose column.
 */
export default function LegalPage({
  title,
  description,
  lastUpdated,
  heading,
  children
}: {
  /** <title> of the page. */
  title: string
  description: string
  lastUpdated: string
  /** Visible h1. */
  heading: string
  children: React.ReactNode
}) {
  return (
    <LakesidePage
      title={title}
      description={description}
      activePath='/legal'
      heroBackground={
        <PageHero title={heading}>
          <p className='mb-0 font-medium text-olake-ink'>{lastUpdated}</p>
        </PageHero>
      }
    >
      <Section flush className='pb-[56px] pt-[24px] lg:pb-[96px] lg:pt-[40px]'>
        <article className='olake-prose'>{children}</article>
      </Section>
    </LakesidePage>
  )
}
