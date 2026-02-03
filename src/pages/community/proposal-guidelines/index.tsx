// src/pages/community/proposal-guidelines/index.tsx
import React from 'react'
import Layout from '@theme/Layout'
import Head from '@docusaurus/Head'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'
import Link from '@docusaurus/Link'
import { FaComments, FaCodeBranch, FaCheckCircle, FaQuestionCircle, FaExternalLinkAlt } from 'react-icons/fa'

import Button from '../../../components/community/improved/Button'
import PageHeader from '../../../components/community/improved/PageHeader'
import SectionHeader from '../../../components/community/improved/SectionHeader'
import SectionLayout from '../../../components/community/SectionLayout'
import CentralizedBreadcrumbs from '../../../components/Breadcrumbs/CentralizedBreadcrumbs'

const ProposalGuidelinesPage = () => {
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
      { '@type': 'ListItem', position: 3, name: 'Proposal Guidelines', item: canonicalUrl }
    ]
  }

  return (
    <Layout
      title="Proposal Submission Guidelines"
      description="How to engage with OLake mentors and submit a strong GSoC proposal."
    >
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Proposal Submission Guidelines | OLake GSoC" />
        <meta property="og:description" content="How to engage with OLake mentors and submit a strong GSoC proposal." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://olake.io/img/logo/olake-blue.webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <main>
        <div className="container mx-auto px-4 lg:px-8">
          <CentralizedBreadcrumbs type="community" title="Proposal Submission Guidelines" />
        </div>

        <PageHeader
          title={
            <>
              Proposal <span className="text-[#193ae6] dark:text-blue-400">Submission Guidelines</span>
            </>
          }
          subtitle="GSoC at OLake"
          description="How to engage with OLake mentors and submit a strong GSoC proposal. Follow these guidelines to increase your chances of acceptance."
          cta={
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/community/proposal-template" size="lg">
                Open Proposal Template
              </Button>
              <Button href="/community/ideas" variant="outline" size="lg">
                View Project Ideas
              </Button>
              <Button href="/community/gsoc" variant="outline" size="lg">
                Back to GSoC
              </Button>
            </div>
          }
        />

        <SectionLayout className="py-16">
          <SectionHeader
            title={
              <>
                Communicate <span className="text-[#193ae6] dark:text-blue-400">early</span> and in public
              </>
            }
            subtitle="Start discussions early in the community discussion period and keep technical discussion public."
          />
          <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-gray-700 dark:text-gray-300">
              Use GitHub issues/discussions and public Slack channels. Be respectful and concise. Introduce yourself,
              share your interest in a project, and ask clarifying questions before the application window closes.
            </p>
          </div>
        </SectionLayout>

        <SectionLayout className="bg-gray-50 py-16 dark:bg-gray-900/50">
          <SectionHeader
            title="Align with OLake contribution workflow"
            subtitle="If you submit any code before selection:"
          />
          <ul className="mx-auto max-w-2xl list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
            <li>Follow OLake&apos;s PR guide</li>
            <li>Target the <strong>staging</strong> branch (feature branches should be created from staging)</li>
            <li>Prefer small, reviewable PRs (docs, tests, bugfixes)</li>
            <li>Link your PR(s) in your proposal</li>
          </ul>
          <div className="mt-6 flex justify-center">
            <Button href="/docs/community/contributing" variant="outline" size="md">
              Contributing Guide <FaExternalLinkAlt className="ml-2 inline h-3 w-3" />
            </Button>
          </div>
        </SectionLayout>

        <SectionLayout className="py-16">
          <SectionHeader
            title="Demonstrate that you can run OLake locally"
            subtitle="Your proposal should state:"
          />
          <ul className="mx-auto max-w-2xl list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
            <li>Which source + destination you used locally (e.g., Postgres → Iceberg)</li>
            <li>How you reproduced or tested the scenario locally</li>
            <li>Any scripts or docker-compose you used</li>
          </ul>
          <div className="mt-6 flex justify-center">
            <Button href="/docs/community/setting-up-a-dev-env" variant="outline" size="md">
              Dev environment guide
            </Button>
          </div>
        </SectionLayout>

        <SectionLayout className="bg-gray-50 py-16 dark:bg-gray-900/50">
          <SectionHeader
            title="Proposal format expectations"
            subtitle="We strongly recommend you follow the official Writing a proposal guide."
          />
          <p className="mx-auto max-w-3xl text-gray-700 dark:text-gray-300">
            Your proposal must clearly include:
          </p>
          <ul className="mx-auto mt-4 max-w-2xl list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
            <li>Required deliverables vs optional stretch goals</li>
            <li>Risks + mitigation</li>
            <li>Testing strategy (unit + integration where relevant)</li>
            <li>Documentation plan</li>
          </ul>
          <div className="mt-6 flex justify-center">
            <Button href="/community/proposal-template" size="md">
              Use our Proposal Template
            </Button>
          </div>
        </SectionLayout>

        <SectionLayout className="py-16">
          <SectionHeader
            title="How we evaluate proposals"
            subtitle="We prioritize:"
          />
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <FaCheckCircle className="mt-1 h-5 w-5 shrink-0 text-[#193ae6] dark:text-blue-400" />
              <div>
                <strong className="text-gray-900 dark:text-white">Clear understanding of OLake&apos;s architecture and constraints</strong>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Show that you&apos;ve read the docs and understand the Go → gRPC → Java writer flow.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <FaCheckCircle className="mt-1 h-5 w-5 shrink-0 text-[#193ae6] dark:text-blue-400" />
              <div>
                <strong className="text-gray-900 dark:text-white">A realistic scope for the project size</strong>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Small (~90h), Medium (~175h), Large (~350h)—match your plan to the size.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <FaCheckCircle className="mt-1 h-5 w-5 shrink-0 text-[#193ae6] dark:text-blue-400" />
              <div>
                <strong className="text-gray-900 dark:text-white">Strong milestone planning</strong>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Midterm should show meaningful progress; include buffer time and a &quot;code freeze&quot; period for tests/docs.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <FaCheckCircle className="mt-1 h-5 w-5 shrink-0 text-[#193ae6] dark:text-blue-400" />
              <div>
                <strong className="text-gray-900 dark:text-white">Evidence you can ship</strong>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Prior OSS work or early OLake contributions (even a small PR or doc fix) strengthen your application.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <FaCheckCircle className="mt-1 h-5 w-5 shrink-0 text-[#193ae6] dark:text-blue-400" />
              <div>
                <strong className="text-gray-900 dark:text-white">Good communication habits</strong>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Responsive, clear, and collaborative in public channels.
                </p>
              </div>
            </div>
          </div>
        </SectionLayout>

        <SectionLayout className="bg-gray-50 py-16 dark:bg-gray-900/50">
          <SectionHeader
            title="Where to ask questions"
            subtitle="Reach out before and during the application period."
          />
          <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-6">
            <a
              href="https://olake.io/slack"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 transition-all hover:border-[#193ae6] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-400"
            >
              <FaComments className="h-6 w-6 text-[#193ae6] dark:text-blue-400" />
              <span className="font-medium">OLake Slack community</span>
            </a>
            <a
              href="https://github.com/datazip-inc/olake/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 transition-all hover:border-[#193ae6] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-400"
            >
              <FaCodeBranch className="h-6 w-6 text-[#193ae6] dark:text-blue-400" />
              <span className="font-medium">GitHub issues / discussions</span>
            </a>
          </div>
        </SectionLayout>

        <SectionLayout className="py-16">
          <div className="mx-auto max-w-2xl rounded-2xl border-2 border-[#193ae6] bg-blue-50 p-8 text-center dark:border-blue-400 dark:bg-blue-950/30">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Submit your proposal</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Submit your proposal via the GSoC web application before Google&apos;s deadline.
            </p>
            <Button href="https://summerofcode.withgoogle.com/" size="lg" external>
              summerofcode.withgoogle.com <FaExternalLinkAlt className="ml-2 inline h-4 w-4" />
            </Button>
          </div>
        </SectionLayout>
      </main>
    </Layout>
  )
}

export default ProposalGuidelinesPage
