// src/pages/community/gsoc/index.tsx
import React from 'react'
import Head from '@docusaurus/Head'
import { serializeJsonLd } from '@site/src/components/JsonLd'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'
import { PiGraduationCap, PiLightbulb, PiFileText, PiArrowUpRight } from 'react-icons/pi'

import Button from '@site/src/components/landing/ui/Button'
import Card from '@site/src/components/landing/ui/Card'
import Section from '@site/src/components/landing/ui/Section'
import SectionHeading from '@site/src/components/landing/ui/SectionHeading'
import CommunityPage from '@site/src/components/community/lakeside/CommunityPage'
import PageHero from '@site/src/components/community/lakeside/PageHero'
import Breadcrumbs from '@site/src/components/community/lakeside/Breadcrumbs'
import {
  BulletList,
  Column,
  LinkCard,
  Note
} from '@site/src/components/community/lakeside/primitives'

const GSoCLandingPage = () => {
  const { siteConfig } = useDocusaurusContext()
  const location = useLocation()
  const siteUrl = siteConfig?.url || 'https://olake.io'
  const canonicalUrl = `${siteUrl}${location.pathname}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://olake.io/' },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Community',
        'item': 'https://olake.io/community/'
      },
      { '@type': 'ListItem', 'position': 3, 'name': 'Google Summer of Code', 'item': canonicalUrl }
    ]
  }

  return (
    <CommunityPage
      title='Google Summer of Code at OLake'
      description='Apply to Google Summer of Code at OLake: a 12+ week open source project guided by mentors, with project ideas, proposal guidelines and a template.'
      activePath='/community'
      hero={
        <PageHero
          badge='GSoC 2026'
          breadcrumbs={<Breadcrumbs type='community' title='Google Summer of Code at OLake' />}
          title='Google Summer of Code at OLake'
          description='Work with OLake on a 12+ week open source project, guided by mentors. Apply with a strong proposal and build the future of data lakehouse replication.'
          actions={
            <>
              <Button href='/community/ideas' size='lg'>
                <PiLightbulb aria-hidden='true' /> View Project Ideas
              </Button>
              <Button href='/community/proposal-guidelines' variant='secondary' size='lg'>
                <PiFileText aria-hidden='true' /> Proposal Guidelines
              </Button>
              <Button href='/community/proposal-template' variant='secondary' size='lg'>
                <PiFileText aria-hidden='true' /> Proposal Template
              </Button>
            </>
          }
        />
      }
    >
      <Head>
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Google Summer of Code at OLake' />
        <meta
          property='og:description'
          content='Apply to Google Summer of Code at OLake: a 12+ week open source project guided by mentors, with project ideas, proposal guidelines and a template.'
        />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:image' content='https://olake.io/img/logo/olake-og-card.png' />
        <script type='application/ld+json'>{serializeJsonLd(breadcrumbSchema)}</script>
      </Head>

      <div>
        <Section flush className='pt-[8px]'>
          <SectionHeading
            title='What is GSoC?'
            body='Google Summer of Code is a global program where contributors work with open source organizations on a 12+ week project, guided by mentors.'
            align='center'
          />
          <Column>
            <Card className='p-[24px] lg:p-[32px]'>
              <p className='text-[14px] leading-[1.65] text-olake-text-2 lg:text-[15px]'>
                At OLake, GSoC contributors help us improve the fastest open-source data replication
                tool—adding observability, improving CDC semantics, and extending our Apache Iceberg
                integration. You&apos;ll work alongside maintainers and ship code that powers real
                data pipelines.
              </p>
            </Card>
          </Column>
        </Section>

        <Section>
          <SectionHeading
            title='Where to start'
            body='Before writing a proposal, we recommend:'
            align='center'
          />
          <Column width={680}>
            <BulletList>
              <li>Read OLake docs (especially the architecture and contributor docs)</li>
              <li>Set up the OLake dev environment locally</li>
              <li>Join the OLake community channels (Slack, GitHub)</li>
              <li>Pick a project idea (Small / Medium / Large) and talk to the mentors early</li>
            </BulletList>
          </Column>
          <div className='mt-[28px] flex flex-wrap justify-center gap-[8px] lg:mt-[36px] lg:gap-[12px]'>
            <Button href='https://olake.io/docs/' size='lg' external>
              OLake Docs <PiArrowUpRight aria-hidden='true' />
            </Button>
            <Button href='https://olake.io/slack/' variant='secondary' size='lg' external>
              Join Slack
            </Button>
            <Button href='/community/ideas' variant='secondary' size='lg'>
              Project Ideas
            </Button>
          </div>
        </Section>

        <Section>
          <SectionHeading
            title='GSoC 2026 timeline'
            body='Use the official GSoC timeline as the source of truth.'
            align='center'
          />
          <Column width={680}>
            <p className='text-[14px] lg:text-[15px]'>
              <a
                href='https://developers.google.com/open-source/gsoc/timeline'
                target='_blank'
                rel='noopener noreferrer'
                className='text-olake-blue hover:text-olake-blue-hover'
              >
                Official GSoC timeline →
              </a>
            </p>
            <ul className='mt-[16px] border-0 border-t border-solid border-olake-line-rule'>
              {[
                ['Org list published:', 'Feb 19, 2026'],
                ['Contributor applications:', 'Mar 16–Mar 31, 2026'],
                ['Community Bonding:', 'May 1–May 24, 2026'],
                ['Coding starts:', 'May 25, 2026']
              ].map(([label, value]) => (
                <li
                  key={label}
                  className='flex flex-wrap items-baseline justify-between gap-x-[16px] gap-y-[2px] border-0 border-b border-solid border-olake-line-rule py-[14px] text-[14px] lg:text-[15px]'
                >
                  <strong className='font-normal text-olake-ink'>{label}</strong>
                  <span className='text-olake-text-2'>{value}</span>
                </li>
              ))}
            </ul>
          </Column>
        </Section>

        <Section>
          <SectionHeading
            title='Proposal requirements'
            body='Your proposal must include:'
            align='center'
          />
          <Column width={680}>
            <BulletList>
              <li>Title + short synopsis</li>
              <li>Detailed technical plan (design + implementation approach)</li>
              <li>Deliverables (required vs optional)</li>
              <li>Timeline with milestones (include midterm + final evaluation readiness)</li>
              <li>Your background + links to relevant work</li>
              <li>Your availability and other commitments</li>
            </BulletList>
            <Note className='mt-[24px]'>
              <strong className='font-medium text-olake-ink'>Important:</strong> Many orgs will
              reject proposals that look auto-generated. Use our template as structure, but write
              and own the content.
            </Note>
          </Column>
          <div className='mt-[28px] flex flex-wrap justify-center gap-[8px] lg:mt-[36px] lg:gap-[12px]'>
            <Button href='/community/proposal-guidelines' size='lg'>
              Proposal Guidelines
            </Button>
            <Button href='/community/proposal-template' variant='secondary' size='lg'>
              Proposal Template
            </Button>
          </div>
        </Section>

        <Section>
          <SectionHeading title='Quick links' body='Everything you need to apply.' align='center' />
          <div className='mt-[28px] grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:mt-[44px] lg:grid-cols-3 lg:gap-[16px]'>
            <LinkCard href='/community/ideas' icon={<PiLightbulb />} title='Project Ideas'>
              Browse Small, Medium, and Large projects and pick one to propose.
            </LinkCard>
            <LinkCard
              href='/community/proposal-guidelines'
              icon={<PiFileText />}
              title='Proposal Guidelines'
            >
              How we evaluate proposals and how to engage with mentors.
            </LinkCard>
            <LinkCard
              href='/community/proposal-template'
              icon={<PiGraduationCap />}
              title='Proposal Template'
            >
              Copy this template and fill it in with your own project plan.
            </LinkCard>
          </div>
          <div className='mt-[28px] flex flex-wrap justify-center gap-[8px] lg:mt-[36px] lg:gap-[12px]'>
            <Button
              href='https://summerofcode.withgoogle.com/how-it-works'
              variant='secondary'
              size='lg'
              external
            >
              GSoC How it works
            </Button>
            <Button
              href='https://google.github.io/gsocguides/student/writing-a-proposal'
              variant='secondary'
              size='lg'
              external
            >
              Writing a proposal (official guide)
            </Button>
            <Button
              href='https://summerofcode.withgoogle.com/'
              variant='secondary'
              size='lg'
              external
            >
              Submit at summerofcode.withgoogle.com
            </Button>
          </div>
        </Section>
      </div>
    </CommunityPage>
  )
}

export default GSoCLandingPage
