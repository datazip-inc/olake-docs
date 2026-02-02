// src/pages/community/gsoc/index.tsx
import React from 'react'
import Layout from '@theme/Layout'
import Head from '@docusaurus/Head'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'
import Link from '@docusaurus/Link'
import { FaGraduationCap, FaLightbulb, FaFileAlt, FaCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa'

import Button from '../../../components/community/improved/Button'
import PageHeader from '../../../components/community/improved/PageHeader'
import SectionHeader from '../../../components/community/improved/SectionHeader'
import SectionLayout from '../../../components/community/SectionLayout'
import CentralizedBreadcrumbs from '../../../components/Breadcrumbs/CentralizedBreadcrumbs'

const GSoCLandingPage = () => {
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
      { '@type': 'ListItem', position: 3, name: 'Google Summer of Code', item: canonicalUrl }
    ]
  }

  return (
    <Layout
      title="Google Summer of Code at OLake"
      description="How to apply, proposal template, and project ideas for OLake GSoC."
    >
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Google Summer of Code at OLake" />
        <meta property="og:description" content="How to apply, proposal template, and project ideas for OLake GSoC." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://olake.io/img/logo/olake-blue.webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <main>
        <div className="container mx-auto px-4 lg:px-8">
          <CentralizedBreadcrumbs type="community" title="Google Summer of Code at OLake" />
        </div>

        <PageHeader
          title={
            <>
              Google Summer of <span className="text-[#193ae6] dark:text-blue-400">Code</span> at OLake
            </>
          }
          subtitle="GSoC 2026"
          description="Work with OLake on a 12+ week open source project, guided by mentors. Apply with a strong proposal and build the future of data lakehouse replication."
          cta={
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/community/ideas" size="lg">
                <FaLightbulb className="mr-2" /> View Project Ideas
              </Button>
              <Button href="/community/proposal-guidelines" variant="outline" size="lg">
                <FaFileAlt className="mr-2" /> Proposal Guidelines
              </Button>
              <Button href="/community/proposal-template" variant="outline" size="lg">
                <FaFileAlt className="mr-2" /> Proposal Template
              </Button>
            </div>
          }
        />

        <SectionLayout className="py-16">
          <SectionHeader
            title={
              <>
                What is <span className="text-[#193ae6] dark:text-blue-400">GSoC?</span>
              </>
            }
            subtitle="Google Summer of Code is a global program where contributors work with open source organizations on a 12+ week project, guided by mentors."
          />
          <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-gray-700 dark:text-gray-300">
              At OLake, GSoC contributors help us improve the fastest open-source data replication tool—adding
              observability, improving CDC semantics, and extending our Apache Iceberg integration. You&apos;ll work
              alongside maintainers and ship code that powers real data pipelines.
            </p>
          </div>
        </SectionLayout>

        <SectionLayout className="bg-gray-50 py-16 dark:bg-gray-900/50">
          <SectionHeader
            title="Where to start"
            subtitle="Before writing a proposal, we recommend:"
          />
          <ul className="mx-auto max-w-2xl list-inside list-disc space-y-3 text-gray-700 dark:text-gray-300">
            <li>Read OLake docs (especially the architecture and contributor docs)</li>
            <li>Set up the OLake dev environment locally</li>
            <li>Join the OLake community channels (Slack, GitHub)</li>
            <li>Pick a project idea (Small / Medium / Large) and talk to the mentors early</li>
          </ul>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="https://olake.io/docs" size="md" external>
              OLake Docs <FaExternalLinkAlt className="ml-2 inline h-3 w-3" />
            </Button>
            <Button href="https://olake.io/slack" variant="outline" size="md" external>
              Join Slack
            </Button>
            <Button href="/community/ideas" variant="outline" size="md">
              Project Ideas
            </Button>
          </div>
        </SectionLayout>

        <SectionLayout className="py-16">
          <SectionHeader
            title={
              <>
                GSoC 2026 <span className="text-[#193ae6] dark:text-blue-400">timeline</span>
              </>
            }
            subtitle="Use the official GSoC timeline as the source of truth."
          />
          <div className="mx-auto max-w-2xl space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              <a
                href="https://developers.google.com/open-source/gsoc/timeline"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#193ae6] hover:underline dark:text-blue-400"
              >
                Official GSoC timeline →
              </a>
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Org list published:</strong> Feb 19, 2026</li>
              <li><strong>Contributor applications:</strong> Mar 16–Mar 31, 2026</li>
              <li><strong>Community Bonding:</strong> May 1–May 24, 2026</li>
              <li><strong>Coding starts:</strong> May 25, 2026</li>
            </ul>
          </div>
        </SectionLayout>

        <SectionLayout className="bg-gray-50 py-16 dark:bg-gray-900/50">
          <SectionHeader
            title="Proposal requirements"
            subtitle="Your proposal must include:"
          />
          <ul className="mx-auto max-w-2xl list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
            <li>Title + short synopsis</li>
            <li>Detailed technical plan (design + implementation approach)</li>
            <li>Deliverables (required vs optional)</li>
            <li>Timeline with milestones (include midterm + final evaluation readiness)</li>
            <li>Your background + links to relevant work</li>
            <li>Your availability and other commitments</li>
          </ul>
          <p className="mx-auto mt-6 max-w-2xl rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            <strong>Important:</strong> Many orgs will reject proposals that look auto-generated. Use our template as
            structure, but write and own the content.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/community/proposal-guidelines" size="lg">
              Proposal Guidelines
            </Button>
            <Button href="/community/proposal-template" variant="outline" size="lg">
              Copy Proposal Template
            </Button>
          </div>
        </SectionLayout>

        <SectionLayout className="py-16">
          <SectionHeader title="Quick links" subtitle="Everything you need to apply." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/community/ideas"
              className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-[#193ae6] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-400"
            >
              <FaLightbulb className="mt-1 h-6 w-6 shrink-0 text-[#193ae6] dark:text-blue-400" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Project Ideas</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Browse Small, Medium, and Large projects and pick one to propose.
                </p>
              </div>
            </Link>
            <Link
              to="/community/proposal-guidelines"
              className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-[#193ae6] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-400"
            >
              <FaFileAlt className="mt-1 h-6 w-6 shrink-0 text-[#193ae6] dark:text-blue-400" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Proposal Guidelines</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  How we evaluate proposals and how to engage with mentors.
                </p>
              </div>
            </Link>
            <Link
              to="/community/proposal-template"
              className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-[#193ae6] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-400"
            >
              <FaGraduationCap className="mt-1 h-6 w-6 shrink-0 text-[#193ae6] dark:text-blue-400" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Proposal Template</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Copy this template and fill it in with your own project plan.
                </p>
              </div>
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="https://summerofcode.withgoogle.com/how-it-works" variant="outline" size="md" external>
              GSoC How it works
            </Button>
            <Button href="https://google.github.io/gsocguides/student/writing-a-proposal" variant="outline" size="md" external>
              Writing a proposal (official guide)
            </Button>
            <Button href="https://summerofcode.withgoogle.com/" variant="outline" size="md" external>
              Submit at summerofcode.withgoogle.com
            </Button>
          </div>
        </SectionLayout>
      </main>
    </Layout>
  )
}

export default GSoCLandingPage
