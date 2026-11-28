// src/pages/community/ideas/index.tsx
import React, { useState } from 'react'
import Head from '@docusaurus/Head'
import { serializeJsonLd } from '@site/src/components/JsonLd'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'
import Link from '@docusaurus/Link'
import { PiChartLineUp, PiCaretDown, PiCaretUp } from 'react-icons/pi'

import Button from '@site/src/components/landing/ui/Button'
import Section from '@site/src/components/landing/ui/Section'
import SectionHeading from '@site/src/components/landing/ui/SectionHeading'
import CommunityPage from '@site/src/components/community/lakeside/CommunityPage'
import PageHero from '@site/src/components/community/lakeside/PageHero'
import Breadcrumbs from '@site/src/components/community/lakeside/Breadcrumbs'
import { Chip, Note, SubHeading } from '@site/src/components/community/lakeside/primitives'

const IDEAS = [
  {
    id: 'prometheus-metrics',
    title: 'Prometheus Metrics for OLake',
    shortDesc:
      'Add a Prometheus-compatible /metrics endpoint so users can monitor job health, throughput, and failures.',
    size: 'Small (~90 hours)',
    difficulty: 'Easy',
    techStack: ['Go'] as const,
    mentors: ['Vaibhav', 'Vikash', 'Akshay', 'Nayan'],
    icon: <PiChartLineUp />,
    summary:
      'Add a Prometheus-compatible HTTP endpoint (GET /metrics) to OLake so users can monitor job health and throughput using Prometheus and Grafana.',
    problem:
      'Today, operators have limited standardized observability into per-job sync throughput, job success/failure counts, and request volume trends. Prometheus-style metrics are the de-facto standard for production monitoring and alerting.',
    deliverables: [
      <li key='d1'>
        <span className='font-medium text-olake-ink'>A /metrics endpoint: </span>configurable
        enable/disable, bind address/port; works with existing OLake deployment modes (local +
        containerized)
      </li>,
      <li key='d2'>
        <span className='font-medium text-olake-ink'>Core metrics: </span>olake_rows_synced_total
        {'{job="..."}'}, olake_job_runs_total{'{job="...",status="success|failed"}'},
        olake_requests_total{'{job="..."}'}
      </li>,
      <li key='d3'>
        <span className='font-medium text-olake-ink'>Documentation: </span>how to enable metrics,
        example Prometheus scrape config, example PromQL queries (throughput, error rate, request
        rate)
      </li>,
      <li key='d4'>
        <span className='font-medium text-olake-ink'>Tests: </span>/metrics returns metrics text
        format; at least one test that verifies counters increment on lifecycle events
      </li>
    ],
    stretchGoals:
      'Additional metrics (to be finalized with mentors): start/finish timestamps, per-stream table counts, lag metrics for CDC.',
    implementation: [
      <li key='i1'>Use Prometheus Go client; register counters in a small metrics package.</li>,
      <li key='i2'>Update counters from job lifecycle events and request-handling paths.</li>,
      <li key='i3'>Expose via existing HTTP server or dedicated metrics server (configurable).</li>
    ],
    timeline: [
      'Community Bonding: validate metric names/labels with mentors, locate job lifecycle hooks and request paths in code, draft docs and example dashboards.',
      'Week 1–2: endpoint + scaffolding',
      'Week 3–4: job lifecycle counters (rows + run status)',
      'Week 5–6 (midterm): request counter + first docs + basic tests',
      'Week 7–8: CI polish, more tests, docs + examples, optional stretch metrics'
    ]
  }
]

const BLOCK_LIST =
  'mt-[10px] ml-[20px] list-disc [&>li]:list-disc [&>li+li]:mt-[8px] text-[14px] leading-[1.65] text-olake-text-2 marker:text-olake-muted lg:text-[15px]'

const IdeaCard = ({
  idea,
  isExpanded,
  onToggle
}: {
  idea: (typeof IDEAS)[0]
  isExpanded: boolean
  onToggle: () => void
}) => (
  <li className='rounded-[16px] border border-solid border-olake-line bg-olake-surface'>
    <div
      className='flex cursor-pointer flex-wrap items-start justify-between gap-[16px] p-[20px] lg:p-[32px]'
      onClick={onToggle}
      onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      role='button'
      tabIndex={0}
      aria-expanded={isExpanded}
    >
      <div className='flex min-w-0 flex-1 items-start gap-[16px]'>
        <span className='mt-[4px] shrink-0 text-[28px] text-olake-ink' aria-hidden='true'>
          {idea.icon}
        </span>
        <div className='min-w-0'>
          <h2 className='text-[20px] leading-[1.3] font-normal text-olake-ink lg:text-[24px]'>
            {idea.title}
          </h2>
          <p className='mt-[8px] text-[14px] leading-[1.6] text-olake-text-2 lg:text-[15px]'>
            {idea.shortDesc}
          </p>
          <div className='mt-[14px] flex flex-wrap gap-[8px]'>
            <Chip>{idea.size}</Chip>
            <Chip>{idea.difficulty}</Chip>
            {idea.techStack.map((tech, i) => (
              <Chip key={i}>{tech}</Chip>
            ))}
          </div>
          <p className='mt-[10px] text-[13px] text-olake-muted'>
            Mentors: {idea.mentors.join(', ')}
          </p>
        </div>
      </div>
      <span className='shrink-0 text-[22px] text-olake-muted' aria-hidden='true'>
        {isExpanded ? <PiCaretUp /> : <PiCaretDown />}
      </span>
    </div>
    {isExpanded && (
      <div className='flex flex-col gap-[28px] border-0 border-t border-solid border-olake-line px-[20px] pt-[24px] pb-[28px] lg:px-[32px] lg:pb-[36px]'>
        <div>
          <SubHeading as='h3'>Summary</SubHeading>
          <p className='mt-[10px] text-[14px] leading-[1.65] text-olake-text-2 lg:text-[15px]'>
            {idea.summary}
          </p>
        </div>
        <div>
          <SubHeading as='h3'>Problem statement</SubHeading>
          <p className='mt-[10px] text-[14px] leading-[1.65] text-olake-text-2 lg:text-[15px]'>
            {idea.problem}
          </p>
        </div>
        <div>
          <SubHeading as='h3'>Goals and deliverables</SubHeading>
          <ul className={BLOCK_LIST}>{idea.deliverables}</ul>
          {idea.stretchGoals && (
            <p className='mt-[14px] text-[14px] leading-[1.6] text-olake-text-2'>
              <strong className='font-medium text-olake-ink'>Optional stretch:</strong>{' '}
              {idea.stretchGoals}
            </p>
          )}
        </div>
        <div>
          <SubHeading as='h3'>Implementation sketch</SubHeading>
          <ul className={BLOCK_LIST}>{idea.implementation}</ul>
        </div>
        <div>
          <SubHeading as='h3'>Timeline (example)</SubHeading>
          <ul className='mt-[10px] flex flex-col gap-[6px] text-[14px] leading-[1.6] text-olake-text-2'>
            {idea.timeline.map((line, i) => (
              <li key={i} className='flex gap-[10px]'>
                <span className='text-olake-muted'>•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </li>
)

const IdeasPage = () => {
  const [expandedId, setExpandedId] = useState<string | null>(IDEAS[0].id)
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
      { '@type': 'ListItem', 'position': 3, 'name': 'GSoC Project Ideas', 'item': canonicalUrl }
    ]
  }

  return (
    <CommunityPage
      title='GSoC Project Ideas'
      description='OLake GSoC project ideas: the open Prometheus metrics idea, plus PostgreSQL TOAST and Iceberg v3 deletion vector ideas that have since shipped.'
      activePath='/community'
      hero={
        <PageHero
          badge='Community / Ideas'
          breadcrumbs={<Breadcrumbs type='community' title='GSoC Project Ideas' />}
          title='GSoC Project Ideas'
          description='Project ideas from Google Summer of Code at OLake. Applications for GSoC 2026 are closed, and the ideas stay up as reference for future rounds.'
          actions={
            <>
              <Button href='/community/proposal-template' size='lg'>
                Proposal Template
              </Button>
              <Button href='/community/gsoc' variant='secondary' size='lg'>
                GSoC at OLake
              </Button>
            </>
          }
        />
      }
    >
      <Head>
        <meta property='og:type' content='website' />
        <meta property='og:title' content='GSoC Project Ideas | OLake' />
        <meta
          property='og:description'
          content='OLake GSoC project ideas: the open Prometheus metrics idea, plus PostgreSQL TOAST and Iceberg v3 deletion vector ideas that have since shipped.'
        />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:image' content='https://olake.io/img/logo/olake-og-card.png' />
        <script type='application/ld+json'>{serializeJsonLd(breadcrumbSchema)}</script>
      </Head>

      <div>
        <Section flush className='pt-[8px]'>
          <Note className='mx-auto max-w-[860px] text-center'>
            <strong className='font-medium text-olake-ink'>
              Looking for how to create a proposal?
            </strong>{' '}
            Make sure to read our{' '}
            <Link
              to='/community/proposal-guidelines'
              className='text-olake-blue hover:text-olake-blue-hover'
            >
              proposal guidelines
            </Link>{' '}
            page for expectations, evaluation criteria, and where to ask questions.
          </Note>
          <Note className='mx-auto mt-[12px] max-w-[860px] text-center'>
            <strong className='font-medium text-olake-ink'>Shipped since the 2026 list:</strong>{' '}
            PostgreSQL TOAST value preservation (
            <Link
              to='/docs/release/ingestion/v1.2.0/'
              className='text-olake-blue hover:text-olake-blue-hover'
            >
              OLake Go v1.2.0
            </Link>
            ) and Iceberg v3 deletion vectors (
            <Link
              to='/docs/release/ingestion/v0.11.0/'
              className='text-olake-blue hover:text-olake-blue-hover'
            >
              OLake Go v0.11.0
            </Link>
            ), so those two ideas are no longer listed.
          </Note>
        </Section>

        <Section>
          <SectionHeading
            title='Project ideas'
            body='Click a card to expand and see full description, deliverables, and timeline.'
            align='center'
          />
          <ul className='mt-[28px] flex flex-col gap-[12px] lg:mt-[44px] lg:gap-[16px]'>
            {IDEAS.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                isExpanded={expandedId === idea.id}
                onToggle={() => setExpandedId(expandedId === idea.id ? null : idea.id)}
              />
            ))}
          </ul>
          <div className='mt-[28px] flex flex-wrap justify-center gap-[8px] lg:mt-[40px] lg:gap-[12px]'>
            <Button href='/community/proposal-guidelines' size='lg'>
              Proposal Guidelines
            </Button>
            <Button href='/community/proposal-template' variant='secondary' size='lg'>
              Proposal Template
            </Button>
            <Button href='/community/gsoc' variant='secondary' size='lg'>
              Back to GSoC
            </Button>
          </div>
        </Section>
      </div>
    </CommunityPage>
  )
}

export default IdeasPage
