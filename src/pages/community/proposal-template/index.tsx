// src/pages/community/proposal-template/index.tsx
import React, { useState } from 'react'
import Head from '@docusaurus/Head'
import { serializeJsonLd } from '@site/src/components/JsonLd'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'

import Button from '@site/src/components/landing/ui/Button'
import Card from '@site/src/components/landing/ui/Card'
import Section from '@site/src/components/landing/ui/Section'
import CommunityPage from '@site/src/components/community/lakeside/CommunityPage'
import PageHero from '@site/src/components/community/lakeside/PageHero'
import Breadcrumbs from '@site/src/components/community/lakeside/Breadcrumbs'
import { ActionButton, Note } from '@site/src/components/community/lakeside/primitives'

const TEMPLATE_PLAINTEXT = `## Contributor information
- Name:
- Email:
- Timezone:
- GitHub:
- LinkedIn / portfolio:
- Resume (optional link):
- Primary languages/stack:

## Project selection
- Project title:
- Project size: Small (~90h) / Medium (~175h) / Large (~350h)
- Difficulty: Easy / Medium / Hard
- Proposed mentor(s):
- Repos likely involved (olake / olake-ui / olake-docs / other):

## Synopsis (short)
1–2 paragraphs. What are you building and why?

## Problem statement and motivation
- What problem exists today?
- Who is affected (users/operators/maintainers)?
- Why is this worth solving in OLake?

## Background and current state
- Show that you understand how OLake works (data flow, relevant components).
- Link to relevant code paths or docs you reviewed.

## Proposed solution
### Technical design
Describe: new components/modules; API changes; data model implications; backward compatibility and rollout plan.
### Implementation plan
Break down into concrete steps. Mention how you will validate correctness and performance.

## Deliverables
### Required
List the exact artifacts: code changes; tests; documentation updates; benchmarks (if relevant); example configs / sample pipelines.
### Optional stretch goals
Clearly mark stretch goals as optional.

## Timeline and milestones
Include: Community Bonding plan; week-by-week milestones; midterm milestone; final "code freeze" period for testing/docs/polish.

## Testing plan
- Unit tests:
- Integration tests:
- How you will reproduce failure cases locally:
- CI considerations:

## Risks and mitigations
List realistic risks and how you will reduce them.

## Communication plan
- Weekly written updates (where you will post them)
- Meeting cadence with mentors
- How quickly you will respond to review feedback

## Availability and other commitments
- Estimated hours/week during coding:
- Exams/internships/vacations:
- Any known no-work periods:

## Prior work / proof you can execute
- OSS contributions (links)
- Any OLake PRs/issues you participated in (links)
- Relevant projects (short summary + links)`

const ProposalTemplatePage = () => {
  const [copied, setCopied] = useState(false)
  const { siteConfig } = useDocusaurusContext()
  const location = useLocation()
  const siteUrl = siteConfig?.url || 'https://olake.io'
  const canonicalUrl = `${siteUrl}${location.pathname}`

  const handleCopyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(TEMPLATE_PLAINTEXT)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback not needed in modern browsers
    }
  }

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
      { '@type': 'ListItem', 'position': 3, 'name': 'GSoC Proposal Template', 'item': canonicalUrl }
    ]
  }

  return (
    <CommunityPage
      title='GSoC Proposal Template'
      description='GSoC proposal template for OLake: copy the structure into your proposal and write your own project plan, with no AI-generated boilerplate.'
      activePath='/community'
      hero={
        <PageHero
          badge='Copy and personalize'
          breadcrumbs={<Breadcrumbs type='community' title='GSoC Proposal Template' />}
          title='GSoC Proposal Template'
          description='Copy this template into your proposal and fill it in with your own project plan. Use it as structure—write and own the content. Do not submit AI-generated boilerplate.'
          actions={
            <>
              <ActionButton onClick={handleCopyTemplate}>
                {copied ? 'Copied!' : 'Copy template'}
              </ActionButton>
              <Button href='/community/proposal-guidelines' variant='secondary' size='lg'>
                Proposal Guidelines
              </Button>
              <Button href='/community/ideas' variant='secondary' size='lg'>
                Project Ideas
              </Button>
              <Button href='/community/gsoc' variant='secondary' size='lg'>
                Back to GSoC
              </Button>
            </>
          }
        />
      }
    >
      <Head>
        <meta property='og:type' content='website' />
        <meta property='og:title' content='GSoC Proposal Template | OLake' />
        <meta
          property='og:description'
          content='GSoC proposal template for OLake: copy the structure into your proposal and write your own project plan, with no AI-generated boilerplate.'
        />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:image' content='https://olake.io/img/logo/olake-og-card.png' />
        <script type='application/ld+json'>{serializeJsonLd(breadcrumbSchema)}</script>
      </Head>

      <div>
        <Section flush className='pt-[8px] pb-[56px] lg:pb-[96px]'>
          <div className='mx-auto max-w-[860px]'>
            <Card className='p-[24px] lg:p-[40px]'>
              <Note className='mb-0'>
                <strong className='font-medium text-olake-ink'>Important:</strong> Many orgs will
                reject proposals that look auto-generated. Use this template as structure only—write
                and own the content.
              </Note>

              <div className='mt-[32px] flex flex-col gap-[32px] lg:gap-[40px]'>
                <section>
                  <h2 className='text-[20px] leading-[1.3] font-normal text-olake-ink lg:text-[26px]'>
                    Contributor information
                  </h2>
                  <ul className='mt-[14px] ml-[20px] list-disc text-[14px] leading-[1.65] text-olake-text-2 marker:text-olake-muted lg:text-[15px] [&>li]:list-disc [&>li+li]:mt-[8px]'>
                    <li>Name:</li>
                    <li>Email:</li>
                    <li>Timezone:</li>
                    <li>GitHub:</li>
                    <li>LinkedIn / portfolio:</li>
                    <li>Resume (optional link):</li>
                    <li>Primary languages/stack:</li>
                  </ul>
                </section>

                <section>
                  <h2 className='text-[20px] leading-[1.3] font-normal text-olake-ink lg:text-[26px]'>
                    Project selection
                  </h2>
                  <ul className='mt-[14px] ml-[20px] list-disc text-[14px] leading-[1.65] text-olake-text-2 marker:text-olake-muted lg:text-[15px] [&>li]:list-disc [&>li+li]:mt-[8px]'>
                    <li>Project title:</li>
                    <li>Project size: Small (~90h) / Medium (~175h) / Large (~350h)</li>
                    <li>Difficulty: Easy / Medium / Hard</li>
                    <li>Proposed mentor(s):</li>
                    <li>Repos likely involved (olake / olake-ui / olake-docs / other):</li>
                  </ul>
                </section>

                <section>
                  <h2 className='text-[20px] leading-[1.3] font-normal text-olake-ink lg:text-[26px]'>
                    Synopsis (short)
                  </h2>
                  <p className='mt-[10px] text-[14px] leading-[1.65] text-olake-text-2 lg:text-[15px]'>
                    1–2 paragraphs. What are you building and why?
                  </p>
                </section>

                <section>
                  <h2 className='text-[20px] leading-[1.3] font-normal text-olake-ink lg:text-[26px]'>
                    Problem statement and motivation
                  </h2>
                  <ul className='mt-[14px] ml-[20px] list-disc text-[14px] leading-[1.65] text-olake-text-2 marker:text-olake-muted lg:text-[15px] [&>li]:list-disc [&>li+li]:mt-[8px]'>
                    <li>What problem exists today?</li>
                    <li>Who is affected (users/operators/maintainers)?</li>
                    <li>Why is this worth solving in OLake?</li>
                  </ul>
                </section>

                <section>
                  <h2 className='text-[20px] leading-[1.3] font-normal text-olake-ink lg:text-[26px]'>
                    Background and current state
                  </h2>
                  <ul className='mt-[14px] ml-[20px] list-disc text-[14px] leading-[1.65] text-olake-text-2 marker:text-olake-muted lg:text-[15px] [&>li]:list-disc [&>li+li]:mt-[8px]'>
                    <li>
                      Show that you understand how OLake works (data flow, relevant components).
                    </li>
                    <li>Link to relevant code paths or docs you reviewed.</li>
                  </ul>
                </section>

                <section>
                  <h2 className='text-[20px] leading-[1.3] font-normal text-olake-ink lg:text-[26px]'>
                    Proposed solution
                  </h2>
                  <h3 className='mt-[20px] text-[16px] leading-[1.3] font-normal text-olake-ink lg:text-[18px]'>
                    Technical design
                  </h3>
                  <p className='mt-[10px] text-[14px] leading-[1.65] text-olake-text-2 lg:text-[15px]'>
                    Describe: new components/modules; API changes (CLI flags, config changes,
                    endpoints, gRPC/protobuf if any); data model implications (Iceberg schema,
                    metrics labels, state store schema); backward compatibility and rollout plan.
                  </p>
                  <h3 className='mt-[20px] text-[16px] leading-[1.3] font-normal text-olake-ink lg:text-[18px]'>
                    Implementation plan
                  </h3>
                  <p className='mt-[10px] text-[14px] leading-[1.65] text-olake-text-2 lg:text-[15px]'>
                    Break down into concrete steps. Mention how you will validate correctness and
                    performance.
                  </p>
                </section>

                <section>
                  <h2 className='text-[20px] leading-[1.3] font-normal text-olake-ink lg:text-[26px]'>
                    Deliverables
                  </h2>
                  <h3 className='mt-[20px] text-[16px] leading-[1.3] font-normal text-olake-ink lg:text-[18px]'>
                    Required
                  </h3>
                  <p className='mt-[10px] text-[14px] leading-[1.65] text-olake-text-2 lg:text-[15px]'>
                    List the exact artifacts: code changes; tests (unit/integration); documentation
                    updates; benchmarks (if relevant); example configs / sample pipelines.
                  </p>
                  <h3 className='mt-[20px] text-[16px] leading-[1.3] font-normal text-olake-ink lg:text-[18px]'>
                    Optional stretch goals
                  </h3>
                  <p className='mt-[10px] text-[14px] leading-[1.65] text-olake-text-2 lg:text-[15px]'>
                    Clearly mark stretch goals as optional.
                  </p>
                </section>

                <section>
                  <h2 className='text-[20px] leading-[1.3] font-normal text-olake-ink lg:text-[26px]'>
                    Timeline and milestones
                  </h2>
                  <p className='mt-[10px] text-[14px] leading-[1.65] text-olake-text-2 lg:text-[15px]'>
                    Use the official GSoC 2026 timeline:{' '}
                    <a
                      href='https://developers.google.com/open-source/gsoc/timeline'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-olake-blue hover:text-olake-blue-hover'
                    >
                      developers.google.com/open-source/gsoc/timeline
                    </a>
                  </p>
                  <p className='mt-[10px] text-[14px] leading-[1.65] text-olake-text-2 lg:text-[15px]'>
                    Include: Community Bonding plan (what you will do before coding starts);
                    week-by-week milestones; midterm milestone (must be meaningful and
                    demonstrable); final &quot;code freeze&quot; period for testing/docs/polish.
                  </p>
                </section>

                <section>
                  <h2 className='text-[20px] leading-[1.3] font-normal text-olake-ink lg:text-[26px]'>
                    Testing plan
                  </h2>
                  <ul className='mt-[14px] ml-[20px] list-disc text-[14px] leading-[1.65] text-olake-text-2 marker:text-olake-muted lg:text-[15px] [&>li]:list-disc [&>li+li]:mt-[8px]'>
                    <li>Unit tests:</li>
                    <li>Integration tests:</li>
                    <li>How you will reproduce failure cases locally:</li>
                    <li>CI considerations:</li>
                  </ul>
                </section>

                <section>
                  <h2 className='text-[20px] leading-[1.3] font-normal text-olake-ink lg:text-[26px]'>
                    Risks and mitigations
                  </h2>
                  <p className='mt-[10px] text-[14px] leading-[1.65] text-olake-text-2 lg:text-[15px]'>
                    List realistic risks (unknowns in the codebase, performance risks, schema
                    evolution edge cases, etc.) and how you will reduce them.
                  </p>
                </section>

                <section>
                  <h2 className='text-[20px] leading-[1.3] font-normal text-olake-ink lg:text-[26px]'>
                    Communication plan
                  </h2>
                  <ul className='mt-[14px] ml-[20px] list-disc text-[14px] leading-[1.65] text-olake-text-2 marker:text-olake-muted lg:text-[15px] [&>li]:list-disc [&>li+li]:mt-[8px]'>
                    <li>Weekly written updates (where you will post them)</li>
                    <li>Meeting cadence with mentors</li>
                    <li>How quickly you will respond to review feedback</li>
                  </ul>
                </section>

                <section>
                  <h2 className='text-[20px] leading-[1.3] font-normal text-olake-ink lg:text-[26px]'>
                    Availability and other commitments
                  </h2>
                  <ul className='mt-[14px] ml-[20px] list-disc text-[14px] leading-[1.65] text-olake-text-2 marker:text-olake-muted lg:text-[15px] [&>li]:list-disc [&>li+li]:mt-[8px]'>
                    <li>Estimated hours/week during coding:</li>
                    <li>Exams/internships/vacations:</li>
                    <li>Any known no-work periods:</li>
                  </ul>
                </section>

                <section>
                  <h2 className='text-[20px] leading-[1.3] font-normal text-olake-ink lg:text-[26px]'>
                    Prior work / proof you can execute
                  </h2>
                  <ul className='mt-[14px] ml-[20px] list-disc text-[14px] leading-[1.65] text-olake-text-2 marker:text-olake-muted lg:text-[15px] [&>li]:list-disc [&>li+li]:mt-[8px]'>
                    <li>OSS contributions (links)</li>
                    <li>Any OLake PRs/issues you participated in (links)</li>
                    <li>Relevant projects (short summary + links)</li>
                  </ul>
                </section>
              </div>
            </Card>

            <div className='mt-[28px] flex flex-wrap justify-center gap-[8px] lg:mt-[36px] lg:gap-[12px]'>
              <Button href='/community/proposal-guidelines' size='lg'>
                Proposal Guidelines
              </Button>
              <Button href='/community/ideas' variant='secondary' size='lg'>
                Project Ideas
              </Button>
              <Button
                href='https://summerofcode.withgoogle.com/'
                variant='secondary'
                size='lg'
                external
              >
                Submit at GSoC
              </Button>
            </div>
          </div>
        </Section>
      </div>
    </CommunityPage>
  )
}

export default ProposalTemplatePage
