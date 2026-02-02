// src/pages/community/proposal-template/index.tsx
import React from 'react'
import Layout from '@theme/Layout'
import Head from '@docusaurus/Head'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'
import Link from '@docusaurus/Link'

import Button from '../../../components/community/improved/Button'
import PageHeader from '../../../components/community/improved/PageHeader'
import SectionLayout from '../../../components/community/SectionLayout'
import CentralizedBreadcrumbs from '../../../components/Breadcrumbs/CentralizedBreadcrumbs'

const ProposalTemplatePage = () => {
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
      { '@type': 'ListItem', position: 3, name: 'GSoC Proposal Template', item: canonicalUrl }
    ]
  }

  return (
    <Layout
      title="GSoC Proposal Template"
      description="Copy this template into your proposal and fill it in with your own project plan."
    >
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="GSoC Proposal Template | OLake" />
        <meta property="og:description" content="Copy this template into your proposal and fill it in with your own project plan." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://olake.io/img/logo/olake-blue.webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <main>
        <div className="container mx-auto px-4 lg:px-8">
          <CentralizedBreadcrumbs type="community" title="GSoC Proposal Template" />
        </div>

        <PageHeader
          title={
            <>
              GSoC <span className="text-[#193ae6] dark:text-blue-400">Proposal Template</span>
            </>
          }
          subtitle="Copy and personalize"
          description="Copy this template into your proposal and fill it in with your own project plan. Use it as structure—write and own the content. Do not submit AI-generated boilerplate."
          cta={
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/community/proposal-guidelines" variant="outline" size="lg">
                Proposal Guidelines
              </Button>
              <Button href="/community/ideas" variant="outline" size="lg">
                Project Ideas
              </Button>
              <Button href="/community/gsoc" variant="outline" size="lg">
                Back to GSoC
              </Button>
            </div>
          }
        />

        <SectionLayout className="py-12">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
              <p className="mb-8 text-sm text-amber-700 dark:text-amber-300">
                <strong>Important:</strong> Many orgs will reject proposals that look auto-generated. Use this template as structure only—write and own the content.
              </p>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Contributor information</h2>
                <ul className="list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Name:</li>
                  <li>Email:</li>
                  <li>Timezone:</li>
                  <li>GitHub:</li>
                  <li>LinkedIn / portfolio:</li>
                  <li>Resume (optional link):</li>
                  <li>Primary languages/stack:</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Project selection</h2>
                <ul className="list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Project title:</li>
                  <li>Project size: Small (~90h) / Medium (~175h) / Large (~350h)</li>
                  <li>Difficulty: Easy / Medium / Hard</li>
                  <li>Proposed mentor(s):</li>
                  <li>Repos likely involved (olake / olake-ui / olake-docs / other):</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Synopsis (short)</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  1–2 paragraphs. What are you building and why?
                </p>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Problem statement and motivation</h2>
                <ul className="list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                  <li>What problem exists today?</li>
                  <li>Who is affected (users/operators/maintainers)?</li>
                  <li>Why is this worth solving in OLake?</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Background and current state</h2>
                <ul className="list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Show that you understand how OLake works (data flow, relevant components).</li>
                  <li>Link to relevant code paths or docs you reviewed.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Proposed solution</h2>
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">Technical design</h3>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  Describe: new components/modules; API changes (CLI flags, config changes, endpoints, gRPC/protobuf if any); data model implications (Iceberg schema, metrics labels, state store schema); backward compatibility and rollout plan.
                </p>
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">Implementation plan</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Break down into concrete steps. Mention how you will validate correctness and performance.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Deliverables</h2>
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">Required</h3>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  List the exact artifacts: code changes; tests (unit/integration); documentation updates; benchmarks (if relevant); example configs / sample pipelines.
                </p>
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">Optional stretch goals</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Clearly mark stretch goals as optional.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Timeline and milestones</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  Use the official GSoC 2026 timeline: <a href="https://developers.google.com/open-source/gsoc/timeline" target="_blank" rel="noopener noreferrer" className="text-[#193ae6] hover:underline dark:text-blue-400">developers.google.com/open-source/gsoc/timeline</a>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Include: Community Bonding plan (what you will do before coding starts); week-by-week milestones; midterm milestone (must be meaningful and demonstrable); final &quot;code freeze&quot; period for testing/docs/polish.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Testing plan</h2>
                <ul className="list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Unit tests:</li>
                  <li>Integration tests:</li>
                  <li>How you will reproduce failure cases locally:</li>
                  <li>CI considerations:</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Risks and mitigations</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  List realistic risks (unknowns in the codebase, performance risks, schema evolution edge cases, etc.) and how you will reduce them.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Communication plan</h2>
                <ul className="list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Weekly written updates (where you will post them)</li>
                  <li>Meeting cadence with mentors</li>
                  <li>How quickly you will respond to review feedback</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Availability and other commitments</h2>
                <ul className="list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Estimated hours/week during coding:</li>
                  <li>Exams/internships/vacations:</li>
                  <li>Any known no-work periods:</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Prior work / proof you can execute</h2>
                <ul className="list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                  <li>OSS contributions (links)</li>
                  <li>Any OLake PRs/issues you participated in (links)</li>
                  <li>Relevant projects (short summary + links)</li>
                </ul>
              </section>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/community/proposal-guidelines" size="lg">
                Proposal Guidelines
              </Button>
              <Button href="/community/ideas" variant="outline" size="lg">
                Project Ideas
              </Button>
              <Button href="https://summerofcode.withgoogle.com/" variant="outline" size="lg" external>
                Submit at GSoC
              </Button>
            </div>
          </div>
        </SectionLayout>
      </main>
    </Layout>
  )
}

export default ProposalTemplatePage
