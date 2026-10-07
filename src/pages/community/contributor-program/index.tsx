// src/pages/community/contributor-program/index.tsx
import React, { useEffect, useState } from 'react'
import Head from '@docusaurus/Head'
import { serializeJsonLd } from '@site/src/components/JsonLd'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'
import Link from '@docusaurus/Link'
import {
  PiGithubLogo,
  PiHandshake,
  PiPlugsConnected,
  PiFeather,
  PiBug,
  PiCurrencyCircleDollar,
  PiGitBranch,
  PiSparkle,
  PiLinkedinLogo,
  PiX
} from 'react-icons/pi'

import Button from '@site/src/components/landing/ui/Button'
import Card from '@site/src/components/landing/ui/Card'
import Section from '@site/src/components/landing/ui/Section'
import SectionHeading from '@site/src/components/landing/ui/SectionHeading'
import CommunityPage from '@site/src/components/community/lakeside/CommunityPage'
import PageHero from '@site/src/components/community/lakeside/PageHero'
import { Chip, SubHeading, Tick } from '@site/src/components/community/lakeside/primitives'
import { cn } from '@site/src/lib/utils'

const ContributorProgramPage = () => {
  const { siteConfig } = useDocusaurusContext()
  const location = useLocation()
  const siteUrl = siteConfig?.url || 'https://olake.io'
  const canonicalUrl = `${siteUrl}${location.pathname}`

  const resolveUrl = (value: string) => {
    if (!value) {
      return canonicalUrl
    }

    if (value.startsWith('http')) {
      return value
    }

    return `${siteUrl}${value}`
  }

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

  const contributionTypes = [
    {
      icon: <PiPlugsConnected />,
      title: 'Build New Connectors',
      description:
        "Create connectors to expand OLake's ecosystem. We provide tools and support to make it easy.",
      points: '30-50',
      difficulty: 'Intermediate'
    },
    {
      icon: <PiFeather />,
      title: 'Write Documentation',
      description:
        'Improve guides, write tutorials, and help others learn with clear documentation.',
      points: '10-20',
      difficulty: 'Beginner'
    },
    {
      icon: <PiBug />,
      title: 'Fix Bugs & Improve',
      description: 'Squash bugs, optimize performance, and enhance existing features.',
      points: '5-30',
      difficulty: 'All Levels'
    }
  ]

  const benefits = [
    {
      icon: <PiCurrencyCircleDollar />,
      title: 'Rewards & Recognition',
      description: 'Get paid for select contributions and earn recognition in our community.'
    },
    {
      icon: <PiGitBranch />,
      title: 'Learning & Growth',
      description: 'Level up your skills, learn from experts, and grow your professional network.'
    },
    {
      icon: <PiSparkle />,
      title: 'Early Access',
      description: 'Get beta access to new features, tools, and participate in product decisions.'
    }
  ]

  const rewardTiers = [
    {
      name: 'Bronze',
      points: '0-49',
      benefits: ['OLake stickers', 'Community badge', 'Slack recognition']
    },
    {
      name: 'Silver',
      points: '50-149',
      benefits: ['OLake t-shirt', 'Featured contributor', 'Beta access', 'Monthly swag']
    },
    {
      name: 'Gold',
      points: '150-499',
      benefits: ['Premium swag kit', 'Internships', 'Mentorship access', 'Cash rewards']
    },
    {
      name: 'Platinum',
      points: '500+',
      benefits: [
        'Chance to get hired',
        'Executive mentorship',
        'Project leadership',
        'Maximum rewards'
      ]
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Read the Guide',
      description:
        'Start by reading our contributing guide to understand the process and requirements.',
      link: '/docs/community/contributing'
    },
    {
      number: '02',
      title: 'Join Slack',
      description:
        'Connect with other contributors in our dedicated Slack channel for support and guidance.',
      link: 'https://olake.io/slack/'
    },
    {
      number: '03',
      title: 'Pick an Issue',
      description:
        'Browse open issues labeled "good first issue" or "help wanted" to find your first contribution.',
      link: 'https://github.com/datazip-inc/olake/issues'
    },
    {
      number: '04',
      title: 'Start Contributing',
      description:
        'Submit your pull request and earn points. Our maintainers will review and provide feedback.',
      link: 'https://github.com/datazip-inc/olake/pulls'
    }
  ]

  const linkedinPosts = [
    { embedId: 'urn:li:share:7324402000287215616', contributor: 'Aditya SwayamSiddha' }
  ]

  const howToGetStarted = {
    '@type': 'ItemList',
    'name': 'How to Get Started',
    'itemListElement': steps.map((step, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': step.title,
      'item': resolveUrl(step.link)
    }))
  }

  const rewardTiersList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Reward Tiers',
    'url': canonicalUrl,
    'itemListElement': rewardTiers.map((tier, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': `${tier.name} (${tier.points} points)`,
      'description': tier.benefits.join(', ')
    }))
  }

  const contributorProgramPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'url': canonicalUrl,
    'name': 'OLake Contributor Program',
    'description':
      'Join the OLake Contributor Program. Get rewards, recognition, and help shape the future of data lakehouse technology.',
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
    },
    'mainEntity': howToGetStarted
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
        'name': 'Contributor Program',
        'item': canonicalUrl
      }
    ]
  }

  const jsonLdSchemas = [
    { id: 'organization', data: organizationSchema },
    { id: 'website', data: websiteSchema },
    { id: 'webPage', data: contributorProgramPageSchema },
    { id: 'breadcrumb', data: breadcrumbSchema },
    { id: 'rewardTiers', data: rewardTiersList }
  ]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [showLinkedInPanel, setShowLinkedInPanel] = useState(false)

  useEffect(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined') {
      // Set initial state based on screen width
      const handleResize = () => {
        if (window.innerWidth >= 768) {
          // md breakpoint
          setShowLinkedInPanel(true)
        } else {
          setShowLinkedInPanel(false)
        }
      }

      // Set initial state
      handleResize()

      // Add resize listener
      window.addEventListener('resize', handleResize)

      // Cleanup
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  const SEO_DESCRIPTION =
    'Join the OLake Contributor Program. Get rewards, recognition, and help shape the future of data lakehouse technology.'

  return (
    <CommunityPage
      title='OLake Contributor Program'
      description={SEO_DESCRIPTION}
      activePath='/community'
      hero={
        <PageHero
          badge='OLake Contributor Program'
          title='Join the Contributor Program'
          description="Give back to the community and receive rewards for helping build OLake's connector ecosystem. Join 10+ contributors making a difference."
          actions={
            <>
              <Button
                href='https://github.com/datazip-inc/olake/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good%20first%20issue%22'
                size='lg'
                external
              >
                <PiHandshake aria-hidden='true' /> Start Now
              </Button>
              <Button href='/docs/community/contributing' variant='secondary' size='lg'>
                Read Contributing Guide
              </Button>
            </>
          }
        />
      }
    >
      <Head>
        <meta property='og:type' content='website' />
        <meta property='og:title' content='OLake Contributor Program' />
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

      {/* Contribution Types Section */}
      <Section flush className='pt-[8px]'>
        <SectionHeading
          title='Contribute in Multiple Ways'
          body='Choose how you want to contribute based on your skills and interests'
          align='center'
        />

        <ul className='mt-[28px] grid grid-cols-1 gap-[12px] lg:mt-[44px] lg:grid-cols-3 lg:gap-[16px]'>
          {contributionTypes.map((type) => (
            <Card
              as='li'
              key={type.title}
              className='flex flex-col px-[20px] py-[24px] lg:px-[28px] lg:py-[32px]'
            >
              <span className='block text-[26px] text-olake-ink' aria-hidden='true'>
                {type.icon}
              </span>
              <h3 className='mt-[16px] text-[20px] font-normal text-olake-ink'>{type.title}</h3>
              <p className='mt-[8px] grow text-[14px] leading-[1.6] text-olake-text-2'>
                {type.description}
              </p>
              <div className='mt-[20px] flex items-center justify-between gap-[12px]'>
                <span className='text-[14px] text-olake-ink'>{type.points} points</span>
                <Chip>{type.difficulty}</Chip>
              </div>
            </Card>
          ))}
        </ul>
      </Section>

      {/* Program Description */}
      <Section>
        <SectionHeading
          title='Program Overview'
          body='Empowering contributors to shape the future of data engineering'
          align='center'
        />

        <Card className='mx-auto mt-[28px] max-w-[860px] p-[24px] lg:mt-[44px] lg:p-[40px]'>
          <div className='flex flex-col gap-[32px]'>
            <div>
              <SubHeading as='h3'>What is the Contributor Program?</SubHeading>
              <p className='mt-[12px] text-[14px] leading-[1.65] text-olake-text-2 lg:text-[15px]'>
                The OLake Contributor Program is a community collaboration initiative designed to
                improve the quality and expand the ecosystem of OLake connectors. We sponsor various
                tasks around features, usability, and reliability while empowering both veteran
                contributors and newcomers to make meaningful contributions to the project.
              </p>
            </div>

            <div>
              <SubHeading as='h3'>How it Works</SubHeading>
              <p className='mt-[12px] text-[14px] leading-[1.65] text-olake-text-2 lg:text-[15px]'>
                Getting started is simple. After reviewing our contributing guide, explore the good
                first issues and Join our Slack community:
              </p>
              <ul className='mt-[12px] ml-[20px] list-disc text-[14px] leading-[1.6] text-olake-text-2 marker:text-olake-muted lg:text-[15px] [&>li]:list-disc [&>li+li]:mt-[8px]'>
                <li>Get direct support from maintainers</li>
                <li>Collaborate with other contributors</li>
                <li>Access exclusive resources and documentation</li>
                <li>Participate in contributor-only events</li>
                <li>Track your contributions and rewards</li>
              </ul>
            </div>
          </div>
        </Card>
      </Section>

      {/* Benefits Section */}
      <Section>
        <SectionHeading
          title='Why Join the Program?'
          body='Unlock exclusive benefits while making a real impact'
          align='center'
        />

        <ul className='mt-[28px] grid grid-cols-1 gap-[12px] lg:mt-[44px] lg:grid-cols-3 lg:gap-[16px]'>
          {benefits.map((benefit) => (
            <Card
              as='li'
              key={benefit.title}
              className='px-[20px] py-[24px] lg:px-[28px] lg:py-[32px]'
            >
              <span className='block text-[26px] text-olake-ink' aria-hidden='true'>
                {benefit.icon}
              </span>
              <h3 className='mt-[16px] text-[20px] font-normal text-olake-ink'>{benefit.title}</h3>
              <p className='mt-[8px] text-[14px] leading-[1.6] text-olake-text-2'>
                {benefit.description}
              </p>
            </Card>
          ))}
        </ul>
      </Section>

      {/* Reward Tiers */}
      <Section>
        <SectionHeading
          title='Reward Tiers'
          body='Earn points with every contribution and unlock amazing rewards'
          align='center'
        />

        <ul className='mt-[28px] grid grid-cols-1 gap-[12px] md:grid-cols-2 lg:mt-[44px] lg:grid-cols-4 lg:gap-[16px]'>
          {rewardTiers.map((tier) => (
            <Card as='li' key={tier.name} className='px-[20px] py-[24px]'>
              <h3 className='text-[20px] font-normal text-olake-ink'>{tier.name}</h3>
              <p className='mt-[4px] text-[14px] text-olake-muted'>{tier.points} points</p>
              <ul className='mt-[18px] flex flex-col gap-[10px]'>
                {tier.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className='flex items-start gap-[10px] text-[14px] leading-[1.5] text-olake-text-2'
                  >
                    <Tick />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </ul>

        <div className='mt-[28px] flex flex-col items-center gap-[14px] text-center lg:mt-[40px]'>
          <p className='text-[14px] text-olake-text-2'>
            See where you stand among our amazing contributors
          </p>
          <Button href='/community/contributors' variant='secondary' size='lg'>
            View Current Contributor Rankings →
          </Button>
        </div>
      </Section>

      {/* How to Get Started */}
      <Section>
        <SectionHeading
          title='How to Get Started'
          body='Join the program in 4 simple steps'
          align='center'
        />

        <ol className='mt-[28px] grid grid-cols-1 gap-[12px] md:grid-cols-2 lg:mt-[44px] lg:grid-cols-4 lg:gap-[16px]'>
          {steps.map((step) => (
            <Card as='li' key={step.number} className='flex flex-col px-[20px] py-[24px]'>
              <span className='text-[13px] text-olake-muted'>{step.number}</span>
              <h3 className='mt-[10px] text-[18px] font-normal text-olake-ink'>{step.title}</h3>
              <p className='mt-[8px] grow text-[14px] leading-[1.6] text-olake-text-2'>
                {step.description}
              </p>
              <Link
                to={step.link}
                className='mt-[16px] text-[14px] text-olake-blue hover:text-olake-blue-hover'
              >
                Learn more →
              </Link>
            </Card>
          ))}
        </ol>
      </Section>

      {/* CTA Section */}
      <Section flush className='pb-[56px] lg:pb-[96px]'>
        <div className='rounded-[16px] border border-solid border-olake-line bg-olake-surface px-[24px] py-[36px] text-left lg:px-[64px] lg:py-[56px]'>
          <h2 className='max-w-[560px] text-[26px] leading-[1.15] font-normal tracking-[-0.01em] text-olake-ink lg:text-[40px]'>
            Ready to Make an Impact?
          </h2>
          <p className='mt-[14px] max-w-[640px] text-[13px] leading-[1.6] text-olake-text-2 lg:text-[15px]'>
            Join hundreds of contributors who are shaping the future of data engineering. Your
            contributions matter, and we can&apos;t wait to have you on board!
          </p>
          <div className='mt-[22px] flex flex-wrap gap-[8px] lg:mt-[28px] lg:gap-[12px]'>
            <Button
              href='https://github.com/datazip-inc/olake/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good%20first%20issue%22'
              size='lg'
              external
            >
              <PiHandshake aria-hidden='true' /> Start Now
            </Button>
            <Button
              href='https://github.com/datazip-inc/olake'
              variant='secondary'
              size='lg'
              external
            >
              <PiGithubLogo aria-hidden='true' /> Explore on GitHub
            </Button>
          </div>
        </div>
      </Section>

      {/* Contributor Spotlights: side panel on desktop, modal on mobile */}
      <div
        className={cn(
          'fixed top-24 right-0 z-40 transition-transform duration-300',
          'hidden md:block', // Hide on mobile completely
          showLinkedInPanel ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <button
          type='button'
          onClick={() => setShowLinkedInPanel(!showLinkedInPanel)}
          className='absolute top-[32px] -left-[48px] flex h-[48px] w-[48px] cursor-pointer items-center justify-center rounded-l-[12px] border border-r-0 border-solid border-olake-line bg-olake-surface text-[24px] text-[#0077b5] shadow-[var(--olake-shadow-menu)]'
          aria-label={showLinkedInPanel ? 'Close LinkedIn feed' : 'Open LinkedIn feed'}
        >
          <PiLinkedinLogo aria-hidden='true' />
        </button>

        <div className='h-[calc(100vh-8rem)] w-[400px] overflow-hidden rounded-l-[16px] border border-r-0 border-solid border-olake-line bg-olake-surface shadow-[var(--olake-shadow-menu)]'>
          <div className='border-0 border-b border-solid border-olake-line px-[20px] py-[16px]'>
            <h3 className='text-[16px] font-normal text-olake-ink'>Contributor Spotlights</h3>
            <p className='mt-[2px] text-[13px] text-olake-muted'>
              Success stories from our community
            </p>
          </div>
          <div className='flex h-[calc(100%-5rem)] flex-col gap-[16px] overflow-y-auto p-[16px]'>
            {linkedinPosts.map((post, index) => (
              <div
                key={post.embedId}
                className='border-0 border-b border-solid border-olake-line pb-[16px] last:border-0'
              >
                <iframe
                  src={`https://www.linkedin.com/embed/feed/update/${post.embedId}`}
                  height='400'
                  width='100%'
                  frameBorder='0'
                  allowFullScreen
                  title={`Contributor Story ${index + 1}`}
                  className='block rounded-[8px]'
                  loading='lazy' // Lazy load for performance
                />
                {post.contributor && (
                  <p className='mt-[8px] text-center text-[13px] text-olake-muted'>
                    - {post.contributor}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile-only floating button */}
      <button
        type='button'
        onClick={() => setShowLinkedInPanel(!showLinkedInPanel)}
        className='fixed right-[24px] bottom-[24px] z-40 flex h-[48px] w-[48px] cursor-pointer items-center justify-center rounded-full border border-solid border-olake-line bg-olake-surface text-[24px] text-[#0077b5] shadow-[var(--olake-shadow-menu)] md:hidden'
        aria-label='View contributor stories'
      >
        <PiLinkedinLogo aria-hidden='true' />
      </button>

      {/* Mobile LinkedIn Modal */}
      {showLinkedInPanel && (
        <div
          className='fixed inset-0 z-50 bg-black/40 md:hidden'
          onClick={() => setShowLinkedInPanel(false)}
        >
          <div
            className='fixed inset-x-[16px] top-[80px] bottom-[16px] overflow-hidden rounded-[16px] border border-solid border-olake-line bg-olake-surface'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between border-0 border-b border-solid border-olake-line px-[16px] py-[12px]'>
              <h3 className='text-[16px] font-normal text-olake-ink'>Contributor Spotlights</h3>
              <button
                type='button'
                onClick={() => setShowLinkedInPanel(false)}
                className='flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[8px] border border-solid border-olake-btn-border bg-olake-surface text-[16px] text-olake-btn-secondary'
                aria-label='Close'
              >
                <PiX aria-hidden='true' />
              </button>
            </div>
            <div className='flex h-[calc(100%-4rem)] flex-col gap-[16px] overflow-y-auto p-[16px]'>
              {linkedinPosts.map((post, index) => (
                <div
                  key={post.embedId}
                  className='border-0 border-b border-solid border-olake-line pb-[16px] last:border-0'
                >
                  <iframe
                    src={`https://www.linkedin.com/embed/feed/update/${post.embedId}`}
                    height='350'
                    width='100%'
                    frameBorder='0'
                    allowFullScreen
                    title={`Contributor Story ${index + 1}`}
                    className='block rounded-[8px]'
                    loading='lazy'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </CommunityPage>
  )
}

export default ContributorProgramPage
