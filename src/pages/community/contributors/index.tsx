// src/pages/community/contributors/index.tsx
import React, { useEffect, useState, useMemo } from 'react'
import Head from '@docusaurus/Head'
import { serializeJsonLd } from '@site/src/components/JsonLd'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'
import { PiStar, PiGithubLogo, PiMagnifyingGlass, PiGitBranch } from 'react-icons/pi'

import contributorPoints from '../../../data/contributor-points.json'

import ImprovedContributorCard from '../../../components/community/improved/ContributorCard'
import type { ContributorProps } from '../../../components/community/improved/ContributorCard'
import Button from '@site/src/components/landing/ui/Button'
import Section from '@site/src/components/landing/ui/Section'
import SectionHeading from '@site/src/components/landing/ui/SectionHeading'
import CommunityPage from '@site/src/components/community/lakeside/CommunityPage'
import PageHero from '@site/src/components/community/lakeside/PageHero'
import { ActionButton, StatBand } from '@site/src/components/community/lakeside/primitives'

const ContributorsPage = () => {
  const { siteConfig } = useDocusaurusContext()
  const location = useLocation()
  const siteUrl = siteConfig?.url || 'https://olake.io'
  const canonicalUrl = `${siteUrl}${location.pathname}`
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'OLake',
    'alternateName': 'Datazip, Inc. (OLake project)',
    'url': 'https://olake.io/',
    'logo': 'https://olake.io/img/logo/olake-blue.svg',
    'sameAs': [
      'https://github.com/datazip-inc/olake',
      'https://x.com/_olake',
      'https://www.linkedin.com/company/datazipio/',
      'https://www.youtube.com/@olakeio'
    ],
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '16192 COASTAL HWY',
      'addressLocality': 'LEWES',
      'addressRegion': 'DE',
      'postalCode': '19958',
      'addressCountry': 'US'
    }
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'url': 'https://olake.io/',
    'name': 'Fastest Open Source Data Replication Tool',
    'description':
      'Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.',
    'publisher': {
      '@type': 'Organization',
      'name': 'OLake'
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://olake.io/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  const contributorsPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'url': canonicalUrl,
    'name': 'Hall of Fame - Our Amazing Contributors',
    'description':
      'Meet the amazing contributors who make OLake possible. Join them in building the future of data lakehouse technology.',
    'isPartOf': {
      '@type': 'WebSite',
      'url': 'https://olake.io/',
      'name': 'OLake'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'OLake',
      'url': 'https://olake.io/',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://olake.io/img/logo/olake-blue.svg',
        'width': 32,
        'height': 32
      }
    }
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://olake.io/'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Community',
        'item': 'https://olake.io/community/'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': 'Contributors',
        'item': canonicalUrl
      }
    ]
  }

  const callsToActionList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Join our Amazing Contributors',
    'url': canonicalUrl,
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Become a Contributor',
        'item': 'https://olake.io/community/contributor-program/'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'View on GitHub',
        'item': 'https://github.com/datazip-inc/olake'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': 'Find Good First Issues',
        'item': 'https://github.com/datazip-inc/olake/issues'
      }
    ]
  }

  const jsonLdSchemas = [
    { id: 'organization', data: organizationSchema },
    { id: 'website', data: websiteSchema },
    { id: 'webPage', data: contributorsPageSchema },
    { id: 'breadcrumb', data: breadcrumbSchema },
    { id: 'itemList', data: callsToActionList }
  ]
  const [contributors, setContributors] = useState<ContributorProps[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'points' | 'contributions' | 'name'>('points')

  const excludedContributors = [
    'zriyanshdz',
    'hash-data',
    'piyushsingariya',
    'piyushdatazip',
    'shubham19may',
    'vikash390',
    'vaibhav-datazip',
    'vishalm0509',
    'schitizsharma',
    'ImDoubD-datazip',
    'rkhameshra',
    'tanishaAtDatazip'
  ]

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          'https://api.github.com/repos/datazip-inc/olake/contributors?per_page=100'
        )

        if (!response.ok) {
          throw new Error(`Error fetching contributors: ${response.status}`)
        }

        const data = await response.json()
        setContributors(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contributors')
        console.error('Error fetching contributors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchContributors()
  }, [])

  const filteredAndSortedContributors = useMemo(() => {
    let filtered = contributors.filter(
      (contributor) => !excludedContributors.includes(contributor.login)
    )

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((contributor) =>
        contributor.login.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort
    if (sortBy === 'points') {
      filtered.sort((a, b) => {
        const pointsA = contributorPoints.contributors[a.login]?.points || a.contributions
        const pointsB = contributorPoints.contributors[b.login]?.points || b.contributions
        return pointsB - pointsA
      })
    } else if (sortBy === 'contributions') {
      filtered.sort((a, b) => b.contributions - a.contributions)
    } else {
      filtered.sort((a, b) => a.login.localeCompare(b.login))
    }

    return filtered
  }, [contributors, searchTerm, sortBy])

  const topContributors = filteredAndSortedContributors.slice(0, 3)
  const otherContributors = filteredAndSortedContributors.slice(3)

  const contributorStats = {
    total: filteredAndSortedContributors.length,
    totalContributions: filteredAndSortedContributors.reduce((sum, c) => sum + c.contributions, 0),
    totalPoints: filteredAndSortedContributors.reduce(
      (sum, c) => sum + (contributorPoints.contributors[c.login]?.points || c.contributions),
      0
    ),
    averagePoints: filteredAndSortedContributors.length
      ? Math.round(
          filteredAndSortedContributors.reduce(
            (sum, c) => sum + (contributorPoints.contributors[c.login]?.points || c.contributions),
            0
          ) / filteredAndSortedContributors.length
        )
      : 0
  }

  const SEO_DESCRIPTION =
    'Meet the amazing contributors who make OLake possible. Join them in building the future of data lakehouse technology.'

  const fieldCls =
    'h-[44px] w-full rounded-[8px] border border-solid border-olake-line-strong bg-olake-surface px-[14px] text-[15px] text-olake-ink focus:border-olake-blue focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olake-blue'

  return (
    <CommunityPage
      title='OLake Contributors'
      description={SEO_DESCRIPTION}
      activePath='/community'
      hero={
        <PageHero
          badge='Hall of Fame'
          title='Our Amazing Contributors'
          description='Meet the brilliant minds building OLake. Every contribution, big or small, makes a difference.'
          actions={
            <>
              <Button href='/community/contributor-program' size='lg'>
                <PiStar aria-hidden='true' /> Become a Contributor
              </Button>
              <Button
                href='https://github.com/datazip-inc/olake'
                variant='secondary'
                size='lg'
                external
              >
                <PiGithubLogo aria-hidden='true' /> View on GitHub
              </Button>
            </>
          }
        />
      }
    >
      <Head>
        <meta property='og:type' content='website' />
        <meta property='og:title' content='OLake Contributors' />
        <meta property='og:description' content={SEO_DESCRIPTION} />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:site_name' content='OLake' />
        <meta property='og:locale' content='en_US' />
        <meta property='og:image' content='https://olake.io/img/logo/olake-og-card.png' />
        {jsonLdSchemas.map((schema) => (
          <script key={schema.id} type='application/ld+json'>
            {serializeJsonLd(schema.data)}
          </script>
        ))}
      </Head>

      {/* Stats Section */}
      {!error && (
        <Section flush className='pt-[8px]'>
          <StatBand
            items={[
              { value: contributorStats.total, label: 'Contributors' },
              {
                value: contributorStats.totalContributions.toLocaleString('en-US'),
                label: 'Total PRs'
              },
              {
                value: contributorStats.totalPoints.toLocaleString('en-US'),
                label: 'Total Points'
              },
              { value: contributorStats.averagePoints, label: 'Avg. Points' }
            ]}
          />
        </Section>
      )}

      {/* Search and Filter */}
      <Section flush className='pt-[40px] lg:pt-[64px]'>
        <div className='mx-auto flex max-w-[760px] flex-col gap-[12px] md:flex-row'>
          <div className='relative flex-1'>
            <PiMagnifyingGlass
              aria-hidden='true'
              className='pointer-events-none absolute top-1/2 left-[14px] -translate-y-1/2 text-[18px] text-olake-muted'
            />
            <label htmlFor='search-contributors' className='sr-only'>
              Search contributors
            </label>
            <input
              id='search-contributors'
              type='text'
              placeholder='Search contributors...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${fieldCls} pl-[42px]`}
            />
          </div>
          <div className='md:w-[200px]'>
            <label htmlFor='sort-contributors' className='sr-only'>
              Sort contributors
            </label>
            <select
              id='sort-contributors'
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'points' | 'contributions' | 'name')}
              className={fieldCls}
              aria-label='Sort contributors by points, contributions, or name'
            >
              <option value='points'>Sort by Points</option>
              <option value='contributions'>Sort by PRs</option>
              <option value='name'>Sort by Name</option>
            </select>
          </div>
        </div>
      </Section>

      {/* Top Contributors Section */}
      {!loading && !error && topContributors.length > 0 && (
        <Section flush className='pt-[56px] lg:pt-[96px]'>
          <SectionHeading
            title='Top Contributors'
            body='Our most active contributors leading the way'
            align='center'
          />

          <ul className='mx-auto mt-[28px] grid grid-cols-1 gap-[12px] sm:grid-cols-3 lg:mt-[44px] lg:gap-[16px]'>
            {topContributors.map((contributor, index) => (
              <li key={contributor.id} className='relative'>
                <span className='absolute top-[12px] right-[12px] z-10 inline-flex h-[28px] min-w-[28px] items-center justify-center rounded-[8px] border border-solid border-olake-line bg-olake-surface-alt px-[8px] text-[13px] text-olake-ink'>
                  #{index + 1}
                </span>
                <ImprovedContributorCard contributor={contributor} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* All Contributors Section */}
      <Section>
        <SectionHeading
          title='All Contributors'
          body={`${otherContributors.length} amazing developers making OLake better every day`}
          align='center'
        />

        {loading && (
          <div
            className='mt-[28px] h-[260px] animate-pulse rounded-[16px] border border-solid border-olake-line bg-olake-surface-alt lg:mt-[44px]'
            role='status'
            aria-label='Loading contributors'
          />
        )}

        {error && (
          <div className='mt-[28px] flex flex-col items-center gap-[16px] text-center lg:mt-[44px]'>
            <p className='text-[15px] text-olake-ink'>Error loading contributors: {error}</p>
            <ActionButton onClick={() => window.location.reload()}>Try Again</ActionButton>
          </div>
        )}

        {!loading && !error && (
          <>
            <ul className='mt-[28px] grid grid-cols-1 gap-[12px] sm:grid-cols-2 md:grid-cols-3 lg:mt-[44px] lg:grid-cols-4 lg:gap-[16px]'>
              {otherContributors.map((contributor) => (
                <li key={contributor.id}>
                  <ImprovedContributorCard contributor={contributor} />
                </li>
              ))}
            </ul>

            {filteredAndSortedContributors.length === 0 && (
              <p className='mt-[28px] text-center text-[15px] text-olake-text-2 lg:mt-[44px]'>
                No contributors found matching your search.
              </p>
            )}
          </>
        )}
      </Section>

      {/* CTA Section */}
      <Section flush className='pb-[56px] lg:pb-[96px]'>
        <div className='rounded-[16px] border border-solid border-olake-line bg-olake-surface px-[24px] py-[36px] text-left lg:px-[64px] lg:py-[56px]'>
          <h2 className='max-w-[560px] text-[26px] leading-[1.15] font-normal tracking-[-0.01em] text-olake-ink lg:text-[40px]'>
            Join These Amazing Contributors
          </h2>
          <p className='mt-[14px] max-w-[640px] text-[13px] leading-[1.6] text-olake-text-2 lg:text-[15px]'>
            Every contribution matters. Whether it&apos;s your first open source contribution or
            you&apos;re a seasoned developer, we welcome you to join our community.
          </p>
          <div className='mt-[22px] flex flex-wrap gap-[8px] lg:mt-[28px] lg:gap-[12px]'>
            <Button href='/docs/community/contributing' size='lg'>
              <PiGitBranch aria-hidden='true' /> Start Contributing
            </Button>
            <Button
              href='https://github.com/datazip-inc/olake/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22'
              variant='secondary'
              size='lg'
              external
            >
              Find Good First Issues
            </Button>
          </div>
        </div>
      </Section>
    </CommunityPage>
  )
}

export default ContributorsPage
