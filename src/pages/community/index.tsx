// src/pages/community/index.tsx
import React from 'react'
import Head from '@docusaurus/Head'
import { serializeJsonLd } from '@site/src/components/JsonLd'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'
import Link from '@docusaurus/Link'
import {
  PiSlackLogo,
  PiGithubLogo,
  PiUsers,
  PiHandshake,
  PiRocketLaunch,
  PiBookOpen,
  PiCode,
  PiTrophy,
  PiChatsCircle,
  PiLightbulb,
  PiGraduationCap,
  PiCalendarBlank
} from 'react-icons/pi'

import Button from '@site/src/components/landing/ui/Button'
import Card from '@site/src/components/landing/ui/Card'
import Section from '@site/src/components/landing/ui/Section'
import SectionHeading from '@site/src/components/landing/ui/SectionHeading'
import CommunityPage from '@site/src/components/community/lakeside/CommunityPage'
import PageHero from '@site/src/components/community/lakeside/PageHero'
import { StatBand, SubHeading } from '@site/src/components/community/lakeside/primitives'
import LazyComponent from '../../components/LazyComponent'
import WebinarGrid from '../../components/webinars/WebinarGrid'

const CommunityIndexPage = () => {
  const { siteConfig } = useDocusaurusContext()
  const location = useLocation()
  const siteUrl = siteConfig?.url || 'https://olake.io'
  const canonicalUrl = `${siteUrl}${location.pathname}`

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'OLake',
    'url': 'https://olake.io/',
    'logo': {
      '@type': 'ImageObject',
      'url': 'https://olake.io/img/logo/olake-blue.svg',
      'width': 32,
      'height': 32
    },
    'contactPoint': [
      {
        '@type': 'ContactPoint',
        'contactType': 'customer support',
        'email': 'hello@olake.io'
      }
    ],
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

  const communityPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'url': canonicalUrl,
    'name': 'OLake Community',
    'description':
      'Join the fastest growing data engineering community. Connect, learn, and contribute with 500+ passionate practitioners.',
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
        'item': canonicalUrl
      }
    ]
  }

  const jsonLdSchemas = [
    { id: 'organization', data: organizationSchema },
    { id: 'website', data: websiteSchema },
    { id: 'webPage', data: communityPageSchema },
    { id: 'breadcrumb', data: breadcrumbSchema }
  ]

  const communityMeets = [
    {
      title: 'OLake 10th Community Meetup',
      subtitle:
        "OLake Community Call | Engineers, Contributors & What's Next. We're moving into double digits with these calls. We'll talk openly about where OLake is headed next, new integrations (S3, MSSQL, DB2), MOR→COW improvements, Kubernetes enhancements, and community highlights. Join us for an open discussion—questions, ideas, and feedback welcome.",
      route: '/community/10th-community-meetup',
      img: `/img/community/10th-olake-community-call.webp`,
      alt: 'OLake 10th Community Meetup',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '28 January 2025'
    },
    {
      title: 'OLake 9th Community Meetup',
      subtitle:
        'Introducing Kafka-Powered CDC Pipelines and Smarter Ingestion Controls Across the Open Lakehouse. Join us to explore Kafka support, smarter sync management, simplified Iceberg destination handling, and secure connectivity options.',
      route: '/community/9th-community-meetup',
      img: `/img/community/9th-olake-community-call.webp`,
      alt: 'OLake 9th Community Meetup',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '12 November 2025'
    },
    {
      title: 'OLake 8th Community Meetup',
      subtitle:
        "Join us for an end-to-end demo of OLake's latest features, showcasing Oracle CDC, filtering capabilities, incremental sync, and Helm deployment within the OLake UI.",
      route: '/community/8th-community-meetup',
      img: `/img/community/8th-olake-community-call.webp`,
      alt: 'OLake 8th Community Meetup',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '29 August 2025'
    },
    {
      title: 'OLake 6th Community Meetup',
      subtitle:
        "Join us for a real-world production story from PhysicsWallah showcasing their migration from Redshift to Iceberg-based lakehouse, and explore OLake's roadmap including Golang architecture, upcoming UI, and SMT transformations.",
      route: '/community/6th-community-meetup',
      img: `/img/community/6th-community-meetup-cover.webp`,
      alt: 'OLake 6th Community Meetup',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '28 April 2025'
    },
    {
      title: 'OLake 5th Community Meetup',
      subtitle:
        'Join us for a showcase of new features including Apache Iceberg as a destination for AWS S3 and local setups, MongoDB to Iceberg sync capabilities, upcoming MySQL and Postgres sync features, and performance improvements with 2-3x faster syncs.',
      route: '/community/5th-community-meetup',
      img: `/img/community/5th-community-meetup-cover.webp`,
      alt: 'OLake 5th Community Meetup',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '27 March 2025'
    },
    {
      title: 'OLake 4th Community Meetup',
      subtitle:
        'Join us for updates on recent developments including faster target writer for normalization, new stats file for performance metrics, Docker Compose for MongoDB replica sets, Split Vector Strategy, and Iceberg Writer development with schema evolution.',
      route: '/community/4th-community-meetup',
      img: `/img/community/4th-community-meetup-cover.webp`,
      alt: 'OLake 4th Community Meetup',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '28 February 2025'
    },
    {
      title: 'OLake 3rd Community Meetup',
      subtitle:
        "Join us for updates on new features including parquet writer, MongoDB 2.0 connector, Apache Iceberg Writer integration, Postgres Writer development, and a comprehensive demo of OLake's CLI functionality with MongoDB to S3 syncing.",
      route: '/community/3rd-community-meetup',
      img: `/img/community/3rd-community-meetup-cover.webp`,
      alt: 'OLake 3rd Community Meetup',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '13 February 2025'
    }
  ]

  const channels = [
    {
      name: 'contributing-to-olake',
      description: 'Get support on starting to contribute to OLake',
      members: '310+'
    },
    {
      name: 'general',
      description: 'Major community updates and announcements',
      members: '350+'
    },
    {
      name: 'help',
      description: "Get help from the community when you're stuck",
      members: '340+'
    },
    {
      name: 'discussions',
      description: "Share articles and resources you've found helpful",
      members: '340+'
    },
    {
      name: 'introduce-yourself',
      description: 'Best way to say hello to the community',
      members: '300+'
    },
    {
      name: 'social-and-events',
      description: 'Everything related to OLake social events',
      members: '340+'
    }
  ]

  const forumCategories = [
    {
      icon: <PiChatsCircle />,
      name: 'Questions',
      description: 'Ask the community for help on your questions',
      count: '4 topics'
    },
    {
      icon: <PiLightbulb />,
      name: 'Ideas',
      description: 'Share ideas for improvements and upvote others',
      count: '10+ ideas'
    },
    {
      icon: <PiRocketLaunch />,
      name: 'Show and Tell',
      description: "Show off what you've built with OLake",
      count: '3+ projects'
    },
    {
      icon: <PiTrophy />,
      name: 'Kind Words',
      description: 'Share what you love about OLake',
      count: '8+ posts on LinkedIn'
    }
  ]

  const stats = [
    { label: 'Community Members', value: '500+' },
    { label: 'Contributors', value: '35+' },
    { label: 'Pull Requests', value: '500+' },
    { label: 'Issues Resolved', value: '150+' }
  ]

  const SEO_DESCRIPTION =
    'Join the fastest growing data engineering community. Connect, learn, and contribute with 500+ passionate practitioners.'

  return (
    <CommunityPage
      title='OLake Community'
      description={SEO_DESCRIPTION}
      activePath='/community'
      hero={
        <PageHero
          badge='Welcome to OLake Community'
          title={
            <>
              Made by engineers,
              <br />
              for engineers.
            </>
          }
          description='Become part of our community of 500+ builders redefining the future of data lakehouses'
          actions={
            <>
              <Button href='https://olake.io/slack/' size='lg' external>
                <PiSlackLogo aria-hidden='true' /> Join our Slack
              </Button>
              <Button href='/community/contributor-program' variant='secondary' size='lg'>
                <PiHandshake aria-hidden='true' /> Become a Contributor
              </Button>
            </>
          }
        />
      }
    >
      <Head>
        <meta property='og:type' content='website' />
        <meta property='og:title' content='OLake Community' />
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
      <Section flush className='pt-[8px]'>
        <StatBand items={stats.map((stat) => ({ value: stat.value, label: stat.label }))} />
      </Section>

      {/* Slack Community Section */}
      <Section>
        <SectionHeading
          title='Join the data engineering community on Slack'
          body='Connect with passionate data engineering practitioners. Share ideas, get help, and stay updated with the latest in data lakehouse technology.'
          align='center'
        />

        <ul className='mt-[28px] grid grid-cols-1 gap-[12px] md:grid-cols-2 lg:mt-[44px] lg:grid-cols-3 lg:gap-[16px]'>
          {channels.map((channel) => (
            <Card
              as='li'
              key={channel.name}
              className='px-[20px] py-[20px] lg:px-[24px] lg:py-[24px]'
            >
              <div className='flex items-baseline justify-between gap-[12px]'>
                <h3 className='text-[16px] font-normal text-olake-ink'>#{channel.name}</h3>
                <span className='shrink-0 text-[13px] text-olake-muted'>{channel.members}</span>
              </div>
              <p className='mt-[8px] text-[14px] leading-[1.55] text-olake-text-2'>
                {channel.description}
              </p>
            </Card>
          ))}
        </ul>

        <div className='mt-[28px] flex flex-col items-center gap-[16px] text-center lg:mt-[40px]'>
          <Button href='https://olake.io/slack/' size='lg' external>
            <PiSlackLogo aria-hidden='true' /> Join OLake Community Slack
          </Button>
          <p className='text-[14px] text-olake-text-2'>
            Need direct access to our team and SLAs for support?{' '}
            <Link to='/contact/' className='text-olake-blue underline underline-offset-2 hover:text-olake-blue-hover'>
              Talk to our team
            </Link>
          </p>
        </div>
      </Section>

      {/* Forum Section */}
      <Section>
        <SectionHeading
          title='Community Forum & Discussions'
          body='Find answers, share ideas, and showcase your work in our GitHub Discussions'
          align='center'
        />

        <ul className='mt-[28px] grid grid-cols-1 gap-[12px] md:grid-cols-2 lg:mt-[44px] lg:grid-cols-4 lg:gap-[16px]'>
          {forumCategories.map((category) => (
            <Card as='li' key={category.name} className='px-[20px] py-[22px]'>
              <span className='block text-[24px] text-olake-ink' aria-hidden='true'>
                {category.icon}
              </span>
              <h3 className='mt-[14px] text-[18px] font-normal text-olake-ink'>{category.name}</h3>
              <p className='mt-[6px] text-[14px] leading-[1.55] text-olake-text-2'>
                {category.description}
              </p>
              <p className='mt-[12px] text-[13px] text-olake-muted'>{category.count}</p>
            </Card>
          ))}
        </ul>

        <div className='mt-[28px] flex justify-center lg:mt-[40px]'>
          <Button
            href='https://github.com/datazip-inc/olake/discussions'
            variant='secondary'
            size='lg'
            external
          >
            <PiGithubLogo aria-hidden='true' /> Explore OLake Community Forum
          </Button>
        </div>
      </Section>

      {/* How to Contribute Section */}
      <Section>
        <SectionHeading
          title='How to contribute to OLake'
          body="Ready to make your mark? We welcome contributions from everyone, whether you're a seasoned developer or just getting started."
          align='center'
        />

        <ul className='mt-[28px] grid grid-cols-1 gap-[12px] lg:mt-[44px] lg:grid-cols-3 lg:gap-[16px]'>
          {[
            {
              icon: <PiCode />,
              title: 'Code Contributions',
              description:
                'Build new connectors, fix bugs, improve performance, and add features to make OLake better for everyone.'
            },
            {
              icon: <PiBookOpen />,
              title: 'Documentation',
              description:
                'Help others learn by improving our docs, writing tutorials, and creating guides for common use cases.'
            },
            {
              icon: <PiGraduationCap />,
              title: 'Community Support',
              description:
                'Share your knowledge by answering questions, reviewing PRs, and helping newcomers get started.'
            }
          ].map((item) => (
            <Card
              as='li'
              key={item.title}
              className='px-[20px] py-[24px] lg:px-[28px] lg:py-[32px]'
            >
              <span className='block text-[26px] text-olake-ink' aria-hidden='true'>
                {item.icon}
              </span>
              <h3 className='mt-[16px] text-[20px] font-normal text-olake-ink'>{item.title}</h3>
              <p className='mt-[8px] text-[14px] leading-[1.6] text-olake-text-2'>
                {item.description}
              </p>
            </Card>
          ))}
        </ul>

        <Card className='mx-auto mt-[32px] max-w-[640px] px-[20px] py-[28px] lg:mt-[56px] lg:px-[40px] lg:py-[36px]'>
          <SubHeading as='h3' className='text-center'>
            Contributor Rewards Program
          </SubHeading>
          <ul className='mt-[20px] border-0 border-t border-solid border-olake-line-rule'>
            {[
              { label: 'New low-code connector', points: '50 points' },
              { label: 'New tutorial or quick start', points: '20 points' },
              { label: 'Bug fixes and improvements', points: '10-30 points' }
            ].map((row) => (
              <li
                key={row.label}
                className='flex items-center justify-between gap-[16px] border-0 border-b border-solid border-olake-line-rule py-[14px] text-[15px]'
              >
                <span className='text-olake-ink'>{row.label}</span>
                <span className='shrink-0 text-olake-text-2'>{row.points}</span>
              </li>
            ))}
          </ul>
          <div className='mt-[24px] flex flex-col items-center gap-[12px] text-center'>
            <Button href='/community/contributor-program' size='lg'>
              Join the Contributor Program
            </Button>
            <p className='text-[13px] text-olake-muted'>
              Earn swag, recognition, and exclusive benefits
            </p>
          </div>
        </Card>
      </Section>

      {/* Google Summer of Code Section */}
      <Section>
        <SectionHeading
          title='Google Summer of Code at OLake'
          body='Work on a 12+ week open source project with OLake. Browse project ideas, read proposal guidelines, and submit your application.'
          align='center'
        />
        <Card className='mx-auto mt-[28px] max-w-[860px] p-[24px] lg:mt-[44px] lg:p-[40px]'>
          <div className='flex flex-col gap-[20px] sm:flex-row sm:items-start sm:gap-[28px]'>
            <img
              src='/img/logo/olake-blue.svg'
              alt='OLake'
              width={48}
              height={48}
              loading='lazy'
              decoding='async'
              className='block h-[48px] w-[48px] shrink-0'
            />
            <div className='min-w-0 flex-1'>
              <h3 className='text-[22px] font-normal text-olake-ink'>GSoC 2026</h3>
              <p className='mt-[8px] text-[14px] leading-[1.6] text-olake-text-2 lg:text-[15px]'>
                Pick a project idea (Prometheus metrics, PostgreSQL TOAST support, or Iceberg v3
                deletion vectors), discuss with mentors, and submit a strong proposal. We provide
                guidelines and a template to help you.
              </p>
              <div className='mt-[20px] flex flex-wrap gap-[8px] lg:gap-[12px]'>
                <Button href='/community/gsoc' size='lg'>
                  <PiGraduationCap aria-hidden='true' /> GSoC at OLake
                </Button>
                <Button href='/community/ideas' variant='secondary' size='lg'>
                  <PiLightbulb aria-hidden='true' /> Project Ideas
                </Button>
                <Button href='/community/proposal-guidelines' variant='secondary' size='lg'>
                  Proposal Guidelines
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* Events Section */}
      <Section>
        <SectionHeading
          title='Community Events & Meetups'
          body='Join our regular community meetups where we discuss real-world challenges, share experiences, and learn from each other'
          align='center'
        />
        <div className='mt-[28px] lg:mt-[44px]'>
          <WebinarGrid webinars={communityMeets} />
        </div>
        <div className='mt-[28px] flex justify-center lg:mt-[40px]'>
          <Button href='/webinar' size='lg' variant='secondary'>
            <PiCalendarBlank aria-hidden='true' /> View All Webinars
          </Button>
        </div>
      </Section>

      {/* Active Contributors Section */}
      <LazyComponent
        component='ActiveContributors'
        fallback={<div className='h-[480px]' aria-hidden='true' />}
      />

      {/* About Community Section */}
      <Section>
        <SectionHeading
          title='About our community'
          body='An inclusive place where engineers can find support, share knowledge, and contribute to the future of data engineering'
          align='center'
        />

        <ul className='mt-[28px] grid grid-cols-1 gap-[12px] lg:mt-[44px] lg:grid-cols-3 lg:gap-[16px]'>
          {[
            {
              icon: <PiHandshake />,
              title: 'Inclusive',
              description: 'Everyone is welcome, regardless of experience level'
            },
            {
              icon: <PiUsers />,
              title: 'Supportive',
              description: 'Get help when you need it from our amazing community'
            },
            {
              icon: <PiRocketLaunch />,
              title: 'Innovative',
              description: 'Be part of building the future of data technology'
            }
          ].map((item) => (
            <Card
              as='li'
              key={item.title}
              className='px-[20px] py-[24px] lg:px-[28px] lg:py-[32px]'
            >
              <span className='block text-[26px] text-olake-ink' aria-hidden='true'>
                {item.icon}
              </span>
              <h3 className='mt-[16px] text-[20px] font-normal text-olake-ink'>{item.title}</h3>
              <p className='mt-[8px] text-[14px] leading-[1.6] text-olake-text-2'>
                {item.description}
              </p>
            </Card>
          ))}
        </ul>

        <div className='mt-[28px] flex justify-center lg:mt-[40px]'>
          <Button href='/docs/community/code-of-conduct' variant='secondary' size='lg'>
            Read our Code of Conduct
          </Button>
        </div>
      </Section>
    </CommunityPage>
  )
}

export default CommunityIndexPage
