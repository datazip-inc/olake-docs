import React, { useState, useRef, useEffect } from 'react'
import Head from '@docusaurus/Head'
import { serializeJsonLd } from '@site/src/components/JsonLd'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'
import SectionHeading from '@site/src/components/landing/ui/SectionHeading'
import Section from '@site/src/components/landing/ui/Section'
import Card from '@site/src/components/landing/ui/Card'
import Button from '@site/src/components/landing/ui/Button'
import { PiArrowUpRight, PiCalendarBlank, PiClock, PiMapPin } from 'react-icons/pi'
import CommunityPage from '@site/src/components/community/lakeside/CommunityPage'
import PageHero from '@site/src/components/community/lakeside/PageHero'
import { StatBand } from '@site/src/components/community/lakeside/primitives'
import WebinarGrid from '../../components/webinars/WebinarGrid'

// Custom hook for dynamic iframe height
const useDynamicIframeHeight = (src) => {
  const [height, setHeight] = useState(200)
  const iframeRef = useRef(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    // Method 2: Listen for postMessage from iframe
    const handleMessage = (event) => {
      if (event.origin === 'https://app.livestorm.co' && event.data?.type === 'resize') {
        setHeight(Math.max(200, event.data.height))
      }
    }

    const updateHeight = () => {
      // Try multiple approaches to get the right height
      try {
        // Method 1: Try to access iframe content (may fail due to CORS)
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (iframeDoc) {
          const bodyHeight = iframeDoc.body?.scrollHeight || iframeDoc.documentElement?.scrollHeight
          if (bodyHeight && bodyHeight > 0) {
            setHeight(Math.max(200, bodyHeight + 20))
            return
          }
        }
      } catch (e) {
        // CORS restrictions - use fallback methods
      }

      // Method 3: Set a reasonable default based on content type
      // For Livestorm embeds, we'll use a responsive height optimized for 2 events
      const updateResponsiveHeight = () => {
        const viewportWidth = window.innerWidth
        let responsiveHeight = 300

        if (viewportWidth < 640) {
          responsiveHeight = 400 // Mobile: more space for 2 events
        } else if (viewportWidth < 1024) {
          responsiveHeight = 450 // Tablet: medium height for 2 events
        } else {
          responsiveHeight = 500 // Desktop: larger height for 2 events
        }

        setHeight(responsiveHeight)
      }

      updateResponsiveHeight()
    }

    // Add event listeners
    window.addEventListener('message', handleMessage)
    window.addEventListener('resize', updateHeight)

    // Update height on load with a single timeout
    const timeout = setTimeout(updateHeight, 1000)

    // Cleanup function
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('message', handleMessage)
      window.removeEventListener('resize', updateHeight)
    }
  }, [src])

  return { height, iframeRef }
}

// Events we register people for outside Livestorm. Each one shows under "Active Events" until
// `endsAt` passes; when none is left, the Livestorm upcoming-events embed shows instead.
const activeEvents = [
  {
    title: 'Hacktoberfest Hack Day Bengaluru x OLake',
    description:
      'A one-day, in-person hackathon at the OLake office in HSR Layout, focused on open-source AI. Pick one of two paths at check-in and build it solo: Ask OLake, a chat assistant for the OLake docs, or OLake MCP, an MCP server that lets an AI agent operate OLake. Open to working professionals and university students.',
    date: 'Sunday, 18 October 2026',
    time: '10:00 AM – 9:00 PM IST',
    location: 'OLake office, HSR Layout, Bengaluru',
    img: '/img/events/hacktoberfest-hack-day-bengaluru-2026.webp',
    alt: 'Hacktoberfest 2026 Hack Day: Ask OLake, build an open-source AI assistant for OLake',
    registerUrl: 'https://events.mlh.com/events/15468-hacktoberfest-hack-day-bengaluru-x-olake',
    registerLabel: 'Register on MLH',
    endsAt: '2026-10-18T21:00:00+05:30'
  }
]

const WebinarsPage = () => {
  const { siteConfig } = useDocusaurusContext()
  const location = useLocation()
  const siteUrl = siteConfig?.url || 'https://olake.io'
  const canonicalUrl = `${siteUrl}${location.pathname}`
  // Filtered after mount so the static build and the first render agree.
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => setNow(Date.now()), [])
  const upcomingEvents = activeEvents.filter(
    (event) => now === null || Date.parse(event.endsAt) > now
  )

  // Use the dynamic iframe height hook
  const { height: iframeHeight, iframeRef } = useDynamicIframeHeight(
    'https://app.livestorm.co/datazip-inc/upcoming?limit=2'
  )

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

  const webinarPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'url': canonicalUrl,
    'name': 'Events & Webinars',
    'description':
      'Join our upcoming events and webinars to learn about the latest in ETL, Apache Iceberg, and modern data engineering practices.',
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
        'name': 'Webinars',
        'item': canonicalUrl
      }
    ]
  }

  const jsonLdSchemas = [
    { id: 'organization', data: organizationSchema },
    { id: 'website', data: websiteSchema },
    { id: 'webPage', data: webinarPageSchema },
    { id: 'breadcrumb', data: breadcrumbSchema }
  ]

  // Define webinars data directly
  const webinars = [
    {
      title: 'Iceberg for Agents: Building AI-Ready Data Pipelines',
      subtitle:
        "AI agents fail in production because they're overwhelmed with data but starved for context. LLM models aren't the problem. The bottleneck is the data stack: fragmented silos, inconsistent definitions, and logic hidden in tribal knowledge. In this session, Andrew Madsen shows how Apache Iceberg becomes the backbone of AI-ready pipelines, elevating your implementation from a storage format to a live context layer that powers structured RAG, schema-aware agents, and autonomous reasoning.",
      route: '/webinar/w-14-iceberg-for-agents',
      img: `/img/webinars/w-14-iceberg-for-agents.webp`,
      alt: 'Iceberg for Agents: Building AI-Ready Data Pipelines',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '8 January 2025'
    },
    {
      title: 'Fireside Chat: Apache Iceberg in Production',
      subtitle:
        'Join Jacopo Tagliabue (Co-founder/CTO, Bauplan) and Shubham Satish Baldava (CTO, OLake) for a candid discussion on how Apache Iceberg is reshaping data engineering—from CDC pipelines and branching strategies to deletion vectors and REST catalogs.',
      route: '/webinar/w-13-fireside-chat-iceberg-ctos',
      img: `/img/webinars/w-13-fireside-chat-placeholder.webp`,
      alt: 'Fireside Chat: Apache Iceberg in Production',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '30 October 2025'
    },
    {
      title: 'Apache Iceberg + Polaris: Breaking Catalog Vendor Lock-in',
      subtitle:
        'This session explores the evolution of metadata catalogs in the lakehouse era, the challenges organizations face with traditional solutions, and why open catalog standards are critical for interoperability. Featuring Apache Polaris, an Iceberg-native, open catalog designed to eliminate vendor lock-in.',
      route: '/webinar/w-12-apache-iceberg-polaris-catalog',
      img: `/img/webinars/w-12-alex-merced-polaris.webp`,
      alt: 'Apache Iceberg + Polaris: Breaking Catalog Vendor Lock-in',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '9 October 2025'
    },
    {
      title: 'Mastering Iceberg Maintenance: From Compaction to Cost Optimization',
      subtitle:
        'Apache Iceberg has quickly become the backbone of modern data lakes, but maintaining tables efficiently is just as critical as building them. This session dives into the art of Iceberg table maintenance, from compaction strategies to metadata cleanup, with a focus on balancing query performance and compute cost.',
      route: '/webinar/w-11-mastering-iceberg-maintenance',
      img: `/img/webinars/w-11-mastering-iceberg-maintenance.webp`,
      alt: 'Mastering Iceberg Maintenance: From Compaction to Cost Optimization',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '15 January 2025'
    },
    {
      title: 'Deep Dive on Catalogs: Apache Iceberg Catalog Landscape & Performance Analysis',
      subtitle:
        'As Apache Iceberg continues its rapid evolution and the catalog ecosystem expands, data engineers must make pivotal decisions about metadata management that directly influence query performance, costs, and operational complexity.',
      route: '/webinar/w-10-deep-dive-on-catalogs',
      img: `/img/webinars/w-10-catalogs-deep-dive.webp`,
      alt: 'Deep Dive on Catalogs: Apache Iceberg Catalog Landscape & Performance Analysis',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '4 September 2025'
    },
    {
      title: 'ClickHouse Iceberg Workshop: Unified Lakehouse Architectures',
      subtitle:
        "Join us for a comprehensive technical workshop exploring ClickHouse's experimental Iceberg support and how open table formats are revolutionizing data engineering workflows.",
      route: '/webinar/w-9-clickhouse-iceberg-workshop',
      img: `/img/webinars/w-9-clickhouse-iceberg-write.webp`,
      alt: 'ClickHouse Iceberg Workshop: Unified Lakehouse Architectures',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '28 August 2025'
    },
    {
      title: 'Fastest Apache Iceberg Native CDC: Introducing OLake',
      subtitle: 'Introducing OLake v0.',
      route: '/event/olake-v0-launch',
      img: `/img/events/olake-v0-launch-cover.webp`,
      alt: 'Fastest Apache Iceberg Native CDC: Introducing OLake',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '26 June 2025'
    },
    {
      title: 'Distributed Stream Processing in Practice [Scalable, Real-time Data Pipelines]',
      subtitle:
        'This technical session examines real-world challenges and patterns in building distributed stream processing systems. We focus on scalability, fault tolerance, and latency trade-offs through a concrete case study, using specific frameworks like Apache Storm as supporting tools to illustrate production concepts',
      route: '/webinar/w-8-distributed-stream-processing-in-practice',
      img: `/img/webinars/w-8-distributed-stream-processing-in-practice-cover.webp`,
      alt: 'Distributed Stream Processing in Practice [Scalable, Real-time Data Pipelines',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '19 June 2025'
    },
    {
      title: 'From Source to Presto: Developer Playground for Fast Analytics',
      subtitle:
        'This talk introduces a lightweight developer playground that demonstrates how to ingest change data from a transactional database (like Postgres or MySQL), register it via an open-source REST catalog (e.g., Polaris or LakeKeeper), and instantly make it queryable in Presto. The demo will walk through the setup, tools, and real-time experience of how quickly one can go from source data to interactive Presto queries using open standards and pluggable components. Ideal for developers and data engineers exploring modern lakehouse and federated query patterns',
      route: '/event/prestocon-day-2025',
      img: `/img/events/prestocon-day-2025-cover.webp`,
      alt: 'From Source to Presto: Developer Playground for Fast Analytics',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '17 June 2025'
    },
    {
      title: 'Demystifying Lakehouse Architecture: From Theory to Practice',
      subtitle:
        'Join Akshat Mathur, Senior Software Engineer at Cloudera and Apache Hive contributor, as he delivers a comprehensive technical exploration of lakehouse architecture. This session will bridge theoretical concepts with practical implementation strategies based on Akshats extensive experience with Apache Iceberg and data platform optimization',
      route: '/webinar/w-7-demystifying-lakehouse-architecture',
      img: `/img/webinars/w-7-demystifying-lakehouse-architecture-cover.webp`,
      alt: 'Demystifying Lakehouse Architecture: From Theory to Practice',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '29 May 2025'
    },
    {
      title:
        'Iceberg Lakehouse Architecture: Game-Changing Capabilities and the Critical Function of REST Catalog',
      subtitle:
        'Join Viktor Kessler, co-founder of Vakamo and former technical leader at MongoDB and Dremio, for an in-depth technical exploration of how Apache Iceberg is fundamentally transforming the data engineering landscape',
      route: '/webinar/w-6-iceberg-lakehouse-architecture-lakekeeper',
      img: `/img/webinars/w-6-iceberg-lakehouse-architecture-lakekeeper-cover.webp`,
      alt: 'Iceberg Lakehouse Architecture: Game-Changing Capabilities and the Critical Function of REST Catalog',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '15 May 2025'
    },
    {
      title: 'Women in Data: Building Technical Expertise and Career Pathways in Data Engineering',
      subtitle:
        'Join us for an in-depth technical discussion with six accomplished women data engineers who are architecting the backbone of modern data-driven organizations. This 60-minute session brings together specialists from healthcare, retail, cloud platforms, and enterprise data systems to share their technical approaches to solving complex data engineering challenges',
      route: '/webinar/w-5-women-in-data-engineering',
      img: `/img/webinars/w-5-women-in-data-engineering-cover.webp`,
      alt: 'Women in Data Engineering',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '30 April 2025'
    },
    {
      title: 'Pratical Session on Apache Iceberg by Sachin Tripathi',
      subtitle:
        'Join us on Friday, March 28th at 4 PM IST for a technical session on Apache Iceberg with Sachin Tripathi, Senior Data Engineer at EarnIn. The session will examine Icebergs ACID-like transaction model, time travel capabilities, schema evolution mechanisms, hidden partitioning system, and catalog architecture',
      route: '/webinar/w-4-pratical-session-on-apache-iceberg',
      img: `/img/webinars/w-4-pratical-session-on-apache-iceberg-cover.webp`,
      alt: 'Pratical Session on Apache Iceberg by Sachin Tripathi Webinar',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '28 March 2025'
    },
    {
      title: 'CDC Unplugged - Modern Data Integration with Real World Insights',
      subtitle:
        'Join us for a deep dive into Change Data Capture (CDC), a vital technique for enabling real-time data integration and streaming. We will trace CDCs evolution from traditional methods to its role in modern data lakehouses, while introducing key tools to help you get started. Expect actionable best practices and insightful case studies to tie everything together',
      route: '/webinar/w-3-cdc-unplugged',
      img: `/img/webinars/webinar-cdc-unplugged.webp`,
      alt: 'CDC Unplugged Webinar',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '09 January 2025'
    },
    {
      title: 'A Leadership Forum for Data Engineers and MLOps',
      subtitle:
        'Join us for an intensive session bringing together senior data engineers and ML practitioners. We will explore the intersection of modern data architecture and ML operations, focusing on building scalable platforms that serve both analytics and machine learning needs.',
      route: '/event/leadership-forum',
      img: `/img/events/e-1-leadership-forum.webp`,
      alt: 'A Leadership Forum for Data Engineers and MLOps',
      status: 'archived',
      button: 'outline',
      CTA: 'Registrations Over',
      date: '21 December 2024'
    },

    {
      title: 'Best Practices for Migrating to Apache Iceberg',
      subtitle: 'Learn how to optimize your data migration process with Apache Iceberg.',
      // summary: 'Join us for an exclusive webinar where we discuss the best practices for migrating to Apache Iceberg...',
      route: '/webinar/w-2-best-practices-iceberg',
      img: `/img/webinars/webinar-iceberg.webp`,
      alt: 'Apache Iceberg Migration',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '15 December 2024'
    },
    {
      title: 'A Journey into Data Lake: Introducing Apache Iceberg',
      subtitle:
        'Learn how to set up OLAP system/platform for analysis from NoSQL Databases (MongoDB & DynamoDB) using Apache Iceberg.',
      // summary: 'Join us for an exclusive webinar where we discuss Apache Iceberg...',
      route: '/webinar/w-1-intro-iceberg',
      img: `/img/webinars/webinar-intro-iceberg.webp`,
      alt: 'Introduction to Apache Iceberg',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '03 October 2024'
    }
  ]

  const SEO_DESCRIPTION =
    'Join our upcoming events and webinars to learn about the latest in ETL, Apache Iceberg, and modern data engineering practices'

  return (
    <CommunityPage
      title='OLake Events & Webinars'
      description={SEO_DESCRIPTION}
      activePath='/webinar'
      hero={
        <PageHero
          badge='Learn from Industry Experts'
          title='Events & Webinars'
          description='Join our community of data engineers and learn about the latest in Apache Iceberg, Change Data Capture, and modern data architecture practices'
        />
      }
    >
      <Head>
        <meta property='og:type' content='website' />
        <meta property='og:title' content='OLake Events & Webinars' />
        <meta property='og:description' content={SEO_DESCRIPTION} />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:site_name' content='OLake' />
        <meta property='og:locale' content='en_US' />
        <meta property='og:image' content='https://olake.io/img/logo/olake-og-card.png' />
        <meta name='twitter:image' content='https://olake.io/img/logo/olake-og-card.png' />
        {jsonLdSchemas.map((schema) => (
          <script key={schema.id} type='application/ld+json'>
            {serializeJsonLd(schema.data)}
          </script>
        ))}
      </Head>

      {/* Stats */}
      <Section flush className='pt-[8px]'>
        <StatBand
          items={[
            { value: '25+', label: 'Technical Sessions' },
            { value: '500+', label: 'Community Members' },
            { value: '12+', label: 'Months Running' }
          ]}
        />
      </Section>

      {/* Upcoming Events Embed with Dynamic Sizing */}
      <Section className='pt-[56px] pb-0 lg:pt-[96px] lg:pb-0'>
        <p className='text-center text-[15px] font-medium tracking-wide text-olake-muted lg:text-[16px]'>
          Active Events
        </p>
        {upcomingEvents.length > 0 ? (
          // Same frame as the Livestorm embed: an "Upcoming events" heading row, then one row per event.
          <Card className='mt-[16px] w-full lg:mt-[20px]'>
            <h3 className='m-0 border-0 border-b border-solid border-olake-line px-[20px] py-[16px] text-[17px] font-semibold text-olake-ink lg:px-[24px] lg:py-[20px] lg:text-[18px]'>
              Upcoming events
            </h3>
            <ul className='m-0 list-none p-0'>
              {upcomingEvents.map((event) => (
                <li
                  key={event.registerUrl}
                  className='flex flex-col gap-[16px] border-0 border-solid border-olake-line p-[12px] not-last:border-b md:flex-row md:items-center md:gap-[28px] lg:p-[16px]'
                >
                  <a
                    href={event.registerUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    tabIndex={-1}
                    aria-hidden='true'
                    className='block shrink-0 md:w-[46%]'
                  >
                    <img
                      src={event.img}
                      alt={event.alt}
                      width={1200}
                      height={600}
                      decoding='async'
                      className='block aspect-[2/1] h-auto w-full rounded-[10px] border border-solid border-olake-line object-cover'
                    />
                  </a>
                  <div className='flex flex-col px-[4px] pb-[4px] md:py-[8px] md:pr-[12px]'>
                    <p className='text-[13px] font-medium tracking-wide text-olake-blue'>
                      Hacktoberfest 2026 · In person
                    </p>
                    <h4 className='mt-[10px] text-[20px] leading-[1.3] font-normal text-olake-ink lg:text-[24px]'>
                      {event.title}
                    </h4>
                    <ul className='mt-[14px] flex flex-col gap-[6px] text-[14px] text-olake-text-2'>
                      <li className='flex items-center gap-[8px]'>
                        <PiCalendarBlank aria-hidden='true' className='shrink-0 text-olake-muted' />
                        <span>{event.date}</span>
                      </li>
                      <li className='flex items-center gap-[8px]'>
                        <PiClock aria-hidden='true' className='shrink-0 text-olake-muted' />
                        <span>{event.time}</span>
                      </li>
                      <li className='flex items-center gap-[8px]'>
                        <PiMapPin aria-hidden='true' className='shrink-0 text-olake-muted' />
                        <span>{event.location}</span>
                      </li>
                    </ul>
                    <p className='mt-[14px] text-[14px] leading-[1.6] text-olake-text-2 lg:text-[15px]'>
                      {event.description}
                    </p>
                    <div className='mt-[20px]'>
                      <Button href={event.registerUrl} external>
                        {event.registerLabel}
                        <PiArrowUpRight aria-hidden='true' />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          // The Livestorm embed draws its own 1px square frame at the iframe edge; the 1px negative margin
          // pushes it out of the Card's overflow clip so only the shared 16px outline shows.
          <Card className='mt-[16px] w-full lg:mt-[20px]'>
            <iframe
              ref={iframeRef}
              width='100%'
              height={iframeHeight}
              frameBorder='0'
              src='https://app.livestorm.co/datazip-inc/upcoming?limit=2'
              title='OLake by Datazip events | Livestorm'
              className='-m-px block w-[calc(100%+2px)] max-w-none'
              style={{
                height: 'auto',
                transition: 'height 0.3s ease-in-out',
                border: 'none',
                overflow: 'hidden'
              }}
            />
          </Card>
        )}
      </Section>

      {/* Featured Events & Webinars Section */}
      <Section>
        <SectionHeading
          eyebrow='Technical Sessions'
          title='Featured Events & Webinars'
          body='Deep dive into Apache Iceberg, CDC strategies, and modern data engineering practices with industry experts and practitioners'
          align='center'
        />
        <div className='mt-[28px] lg:mt-[44px]'>
          <WebinarGrid webinars={webinars} />
        </div>
      </Section>
    </CommunityPage>
  )
}

export default WebinarsPage
