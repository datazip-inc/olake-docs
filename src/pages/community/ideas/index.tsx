// src/pages/community/ideas/index.tsx
import React, { useState } from 'react'
import Layout from '@theme/Layout'
import Head from '@docusaurus/Head'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'
import Link from '@docusaurus/Link'
import { FaLightbulb, FaCode, FaDatabase, FaChartLine } from 'react-icons/fa'
import { HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi'

import Button from '../../../components/community/improved/Button'
import PageHeader from '../../../components/community/improved/PageHeader'
import SectionHeader from '../../../components/community/improved/SectionHeader'
import SectionLayout from '../../../components/community/SectionLayout'
import CentralizedBreadcrumbs from '../../../components/Breadcrumbs/CentralizedBreadcrumbs'

const IDEAS = [
  {
    id: 'prometheus-metrics',
    title: 'Prometheus Metrics for OLake',
    shortDesc: 'Add a Prometheus-compatible /metrics endpoint so users can monitor job health, throughput, and failures.',
    size: 'Small (~90 hours)',
    difficulty: 'Easy',
    techStack: 'Go',
    mentors: ['Vaibhav', 'Vikash', 'Akshay', 'Nayan'],
    icon: <FaChartLine className="h-8 w-8" />,
    summary: 'Add a Prometheus-compatible HTTP endpoint (GET /metrics) to OLake so users can monitor job health and throughput using Prometheus and Grafana.',
    problem: 'Today, operators have limited standardized observability into per-job sync throughput, job success/failure counts, and request volume trends. Prometheus-style metrics are the de-facto standard for production monitoring and alerting.',
    deliverables: [
      'A /metrics endpoint: configurable enable/disable, bind address/port; works with existing OLake deployment modes (local + containerized)',
      'Core metrics: olake_rows_synced_total{job="..."}, olake_job_runs_total{job="...",status="success|failed"}, olake_requests_total{job="..."}',
      'Documentation: how to enable metrics, example Prometheus scrape config, example PromQL queries (throughput, error rate, request rate)',
      'Tests: /metrics returns metrics text format; at least one test that verifies counters increment on lifecycle events'
    ],
    stretchGoals: 'Additional metrics (to be finalized with mentors): start/finish timestamps, per-stream table counts, lag metrics for CDC.',
    implementation: 'Use Prometheus Go client; register counters in a small metrics package; update counters from job lifecycle events and request-handling paths; expose via existing HTTP server or dedicated metrics server (configurable).',
    timeline: 'Community Bonding: validate metric names/labels with mentors, locate job lifecycle hooks and request paths in code, draft docs and example dashboards. Coding: Weeks 1–2 endpoint + scaffolding; Weeks 3–4 job lifecycle counters (rows + run status); Weeks 5–6 (midterm) request counter + first docs + basic tests; Weeks 7–8 CI polish, more tests, docs + examples, optional stretch metrics.'
  },
  {
    id: 'postgres-toast',
    title: 'PostgreSQL TOAST Support in OLake',
    shortDesc: 'Correctly ingest UPDATE/DELETE events when pgoutput omits unchanged TOASTed values (byte \'u\').',
    size: 'Medium (~175 hours)',
    difficulty: 'Medium',
    techStack: 'Go (CDC ingest/decoder) + Java (Iceberg writer via gRPC)',
    mentors: ['Vaibhav', 'Vikash'],
    icon: <FaDatabase className="h-8 w-8" />,
    summary: 'Implement correct handling of PostgreSQL logical decoding events where unchanged TOASTed values are omitted (pgoutput marks them as unchanged using byte `u`). OLake should reconstruct missing values (or fail explicitly, depending on config).',
    problem: 'Postgres stores large values out-of-line using TOAST. In logical replication, unchanged TOASTed values may not be included in UPDATE/DELETE messages unless the table is configured with REPLICA IDENTITY FULL. For OLake CDC, this can cause partial row images and incorrect sink state.',
    deliverables: [
      'Correct handling of TOAST "unchanged" markers: detect in decoding, treat as missing values requiring resolution',
      'Configurable behavior modes: STRICT (fail with clear error when missing values cannot be resolved), REUSE_LAST (reuse last ingested TOAST value for same primary key), DB_RECOMMENDED (detect impacted tables; recommend REPLICA IDENTITY FULL)',
      'Observability: logs and counters for toast_miss, toast_filled_from_cache, toast_filled_from_destination',
      'Tests: unit tests for decoding and marker detection; integration test with Postgres table containing TOAST-able column (INSERT full value, UPDATE different column with TOAST unchanged, verify OLake writes correct full row downstream)'
    ],
    stretchGoals: null,
    implementation: 'Step 1: Detect missing TOAST values in Go decoder (u => unchanged TOASTed value). Step 2: Reconstruct via local TOAST state store (KV keyed by table+primary_key); update on INSERT/UPDATE with full TOAST; on UPDATE with missing TOAST, fill from store before sending to writer. Fallback: query destination (Iceberg) if cache misses; cache fetched value back. Document operational implications.',
    timeline: 'Community Bonding: reproduce issue locally, identify pgoutput decode paths and record model changes, draft KV store design + failure semantics. Weeks 1–2 detection + config modes; Weeks 3–5 local state store + fill logic + unit tests; Weeks 6–8 (midterm) destination lookup fallback + caching + metrics/logs; Weeks 9–10 end-to-end integration tests + correctness validation; Weeks 11–12 docs (including DB-side mitigation tradeoffs) + polish + CI.'
  },
  {
    id: 'iceberg-v3-deletion-vectors',
    title: 'Apache Iceberg v3 Support with Deletion Vector–based CDC',
    shortDesc: 'Upgrade OLake to Iceberg v3 and implement CDC updates/deletes using deletion vectors stored in Puffin files.',
    size: 'Large (~350 hours)',
    difficulty: 'Hard',
    techStack: 'Go (ingest/planning) + Java (Iceberg writer via gRPC)',
    mentors: ['Vaibhav', 'Vikash', 'Ankit'],
    icon: <FaCode className="h-8 w-8" />,
    summary: 'Upgrade OLake\'s Iceberg destination to support Iceberg v3 and implement CDC deletes/updates using deletion vectors (DV) as the primary row-level delete mechanism.',
    problem: 'OLake ingests from DBs/Kafka in Go and writes to Iceberg via a Java gRPC writer. Today the pipeline targets Iceberg v2 semantics. Iceberg v3 introduces deletion vectors stored in Puffin files and new writer constraints (at most one DV per data file per snapshot; merge new deletes with existing DVs; no new position delete files for v3).',
    deliverables: [
      'Iceberg v3 compatibility in the Java writer: upgrade Iceberg Java dependencies (v3-capable); ensure metadata read/write and commit behavior works for v3 tables',
      'DV-based CDC deletes and updates: Delete = write/merge deletion vectors per impacted data file; Update = delete old row (via DV) + append new row, within one commit flow when possible',
      'Correctness: enforce at most one deletion vector per data file per snapshot; merge new deletes with existing DVs (and any legacy position deletes from upgraded v2 tables)',
      'Design documentation: DV lifecycle (creation, merge, replace), commit flow and idempotency expectations, table maintenance implications and operational guardrails',
      'End-to-end tests: validate correctness via a query engine (e.g., Spark); include cases: multiple updates to same key, retries/partial failures, schema evolution interactions'
    ],
    stretchGoals: 'Explore v3 extended types if relevant to OLake (variant, geometry/geography) and define a minimal support story.',
    implementation: 'Java writer: implement DV writing and merging logic stored as Puffin blobs; update manifest/snapshot metadata correctly; expose DV apply primitives via gRPC (new RPCs or extended proto). gRPC contract: add or extend RPC methods to apply row changes (inserts + deletes/updates); return commit metadata to Go. Position planning for CDC: provide a defined strategy for mapping incoming CDC keys to file+position; first-cut reference implementation; document future optimizations.',
    timeline: 'Community Bonding: design doc draft, local setup and baseline v2 writer understanding, establish integration test harness. Weeks 1–3 dependency bump + v3 append/commit happy path; Weeks 4–9 DV writer implementation (Puffin blob handling, manifest updates); Weeks 10–15 CDC apply path + position planning reference; Weeks 16–19 integration tests + correctness + edge cases; Weeks 20–22 polish + docs + final design doc + performance notes.'
  }
]

const IdeaCard = ({ idea, isExpanded, onToggle }: { idea: typeof IDEAS[0]; isExpanded: boolean; onToggle: () => void }) => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-all dark:border-gray-700 dark:bg-gray-800/50">
    <div
      className="flex cursor-pointer flex-wrap items-start justify-between gap-4 p-6 md:p-8"
      onClick={onToggle}
      onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#193ae6]/10 text-[#193ae6] dark:bg-blue-400/20 dark:text-blue-400">
          {idea.icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">{idea.title}</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{idea.shortDesc}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-[#193ae6] dark:bg-blue-900/40 dark:text-blue-300">
              {idea.size}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {idea.difficulty}
            </span>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
              {idea.techStack}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Mentors: {idea.mentors.join(', ')}
          </p>
        </div>
      </div>
      <div className="shrink-0 text-gray-400">
        {isExpanded ? <HiOutlineChevronUp className="h-6 w-6" /> : <HiOutlineChevronDown className="h-6 w-6" />}
      </div>
    </div>
    {isExpanded && (
      <div className="border-t border-gray-200 px-6 pb-8 pt-4 dark:border-gray-700 md:px-8">
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Summary</h3>
            <p className="text-gray-700 dark:text-gray-300">{idea.summary}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Problem statement</h3>
            <p className="text-gray-700 dark:text-gray-300">{idea.problem}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Goals and deliverables</h3>
            <ul className="list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
              {idea.deliverables.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
            {idea.stretchGoals && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                <strong>Optional stretch:</strong> {idea.stretchGoals}
              </p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Implementation sketch</h3>
            <p className="text-gray-700 dark:text-gray-300">{idea.implementation}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Timeline (example)</h3>
            <p className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">{idea.timeline}</p>
          </div>
        </div>
      </div>
    )}
  </div>
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
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://olake.io/' },
      { '@type': 'ListItem', position: 2, name: 'Community', item: 'https://olake.io/community/' },
      { '@type': 'ListItem', position: 3, name: 'GSoC Project Ideas', item: canonicalUrl }
    ]
  }

  return (
    <Layout
      title="GSoC Project Ideas"
      description="Browse OLake GSoC project ideas: Prometheus metrics, PostgreSQL TOAST support, and Iceberg v3 deletion vectors."
    >
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="GSoC Project Ideas | OLake" />
        <meta property="og:description" content="Browse OLake GSoC project ideas: Prometheus metrics, PostgreSQL TOAST support, and Iceberg v3 deletion vectors." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://olake.io/img/logo/olake-blue.webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <main>
        <div className="container mx-auto px-4 lg:px-8">
          <CentralizedBreadcrumbs type="community" title="GSoC Project Ideas" />
        </div>

        <PageHeader
          title={
            <>
              GSoC <span className="text-[#193ae6] dark:text-blue-400">Project Ideas</span>
            </>
          }
          subtitle="Community / Ideas"
          description="Browse project ideas for Google Summer of Code at OLake. Pick a Small, Medium, or Large project and discuss with mentors before submitting your proposal."
          cta={
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/community/proposal-guidelines" size="lg">
                How to write a proposal
              </Button>
              <Button href="/community/gsoc" variant="outline" size="lg">
                GSoC at OLake
              </Button>
            </div>
          }
        />

        <SectionLayout className="py-12">
          <div className="mx-auto max-w-4xl rounded-2xl border border-[#193ae6]/30 bg-blue-50 p-6 dark:border-blue-400/30 dark:bg-blue-950/30">
            <p className="text-center text-gray-700 dark:text-gray-300">
              <strong>Looking for how to create a proposal?</strong> Make sure to read our{' '}
              <Link to="/community/proposal-guidelines" className="font-semibold text-[#193ae6] hover:underline dark:text-blue-400">
                proposal guidelines
              </Link>{' '}
              page for expectations, evaluation criteria, and where to ask questions.
            </p>
          </div>
        </SectionLayout>

        <SectionLayout className="py-8">
          <SectionHeader
            title="Project ideas"
            subtitle="Click a card to expand and see full description, deliverables, and timeline."
          />
          <div className="space-y-6">
            {IDEAS.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                isExpanded={expandedId === idea.id}
                onToggle={() => setExpandedId(expandedId === idea.id ? null : idea.id)}
              />
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/community/proposal-guidelines" size="lg">
              Proposal Guidelines
            </Button>
            <Button href="/community/proposal-template" variant="outline" size="lg">
              Proposal Template
            </Button>
            <Button href="/community/gsoc" variant="outline" size="lg">
              Back to GSoC
            </Button>
          </div>
        </SectionLayout>
      </main>
    </Layout>
  )
}

export default IdeasPage
