import React from 'react'
import Head from '@docusaurus/Head'
import LakesidePage from '@site/src/components/landing/ui/LakesidePage'
import Section from '@site/src/components/landing/ui/Section'
import Card from '@site/src/components/landing/ui/Card'
import SectionHeading from '@site/src/components/landing/ui/SectionHeading'
import PageHero from '@site/src/components/pages-misc/PageHero'

import { serializeJsonLd } from '@site/src/components/JsonLd'
const teamMembers = [
  {
    name: 'Shubham Satish Baldava',
    designation: 'CTO',
    linkedin: 'https://linkedin.com/in/shubham-baldava',
    image: '/img/authors/shubham.webp',
    size: 800
  },
  {
    name: 'Rohan Khameshra',
    designation: 'CEO',
    linkedin: 'https://linkedin.com/in/rohan-khameshra',
    image: '/img/authors/rohan.webp',
    size: 800
  }

  // Add more team members as needed...
]

const AboutTeam = () => {
  const primaryUrl = 'https://olake.io/'

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OLake',
    url: primaryUrl,
    logo: {
      '@type': 'ImageObject',
      url: 'https://olake.io/img/logo/olake-blue.svg',
      width: 32,
      height: 32
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'hello@olake.io'
      }
    ],
    sameAs: [
      'https://github.com/datazip-inc/olake',
      'https://x.com/_olake',
      'https://www.linkedin.com/company/datazipio/',
      'https://www.youtube.com/@olakeio'
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '16192 COASTAL HWY',
      addressLocality: 'LEWES',
      addressRegion: 'DE',
      postalCode: '19958',
      addressCountry: 'US'
    }
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: primaryUrl,
    name: 'Fastest Open Source Data Replication Tool',
    description:
      'Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.',
    publisher: {
      '@type': 'Organization',
      name: 'OLake'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://olake.io/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: 'https://olake.io/about-us/',
    name: 'About Us',
    description:
      'OLake is the fastest open-source, Iceberg-first EL engine that removes the pain of brittle scripts and one-off pipelines. We make database → Apache Iceberg simple, fast, and observable — with benchmarks showing up to 500× faster ingest than common alternatives.',
    publisher: {
      '@type': 'Organization',
      name: 'OLake',
      url: primaryUrl
    },
    mainEntity: {
      '@type': 'Organization',
      name: 'OLake',
      url: primaryUrl,
      description:
        'Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.'
    }
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: primaryUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About Us',
        item: 'https://olake.io/about-us/'
      }
    ]
  }

  const leadershipGraphSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: 'Shubham Satish Baldava',
        jobTitle: 'CTO',
        worksFor: {
          '@type': 'Organization',
          name: 'OLake'
        },
        image: 'https://olake.io/img/authors/shubham.webp'
      },
      {
        '@type': 'Person',
        name: 'Rohan Khameshra',
        jobTitle: 'CEO',
        worksFor: {
          '@type': 'Organization',
          name: 'OLake'
        },
        image: 'https://olake.io/img/authors/rohan.webp'
      }
    ]
  }

  const jsonLdSchemas = [
    { id: 'organization', data: organizationSchema },
    { id: 'website', data: websiteSchema },
    { id: 'aboutPage', data: aboutPageSchema },
    { id: 'breadcrumb', data: breadcrumbSchema },
    { id: 'leadership', data: leadershipGraphSchema }
  ]

  return (
    <LakesidePage
      title="About Us"
      description="Meet the OLake team behind the fastest open-source data replication tool. Learn about our mission to simplify database to Apache Iceberg workflows."
      activePath='/about-us'
      heroBackground={
        <PageHero title='About OLake - Fastest Open Source Data Replication Tool'>
          <p>
            OLake is the fastest open-source, Iceberg-first EL engine that removes the pain of brittle scripts and one-off pipelines. We make "database → Apache Iceberg" simple, fast, and observable—with recent benchmarks showing up to 500× faster ingest than common alternatives—so your team can stop handling connectors and start focusing on models, products, and impact.
          </p>
          <p>
            Born from real-world issues with slow, fragile ingestion, OLake gives you a clean UI/CLI, resilient CDC, and a path that keeps getting faster with every release—and we're actively pushing those benchmarks even further. No vendor lock-in, no plumbing issues—just a reliable way to move data into Iceberg for your modern analytics.
          </p>
        </PageHero>
      }
    >
      <Head>
        {jsonLdSchemas.map((schema) => (
          <script key={schema.id} type='application/ld+json'>{serializeJsonLd(schema.data)}</script>
        ))}
      </Head>
      <Section flush className='pb-[56px] pt-[16px] lg:pb-[96px] lg:pt-[24px]'>
        <SectionHeading title='Our Team' align='center' />
        <ul className='mb-0 list-none p-0 mt-[28px] grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:mt-[44px] lg:gap-[24px] mx-auto max-w-[680px]'>
          {teamMembers.map((member) => (
            <Card as='li' key={member.name} className='flex flex-col items-center px-[24px] py-[32px] text-center'>
              <img
                src={member.image}
                alt={`${member.name.trim()} | Olake ${member.designation}`}
                width={member.size}
                height={member.size}
                loading='lazy'
                decoding='async'
                className='size-[112px] rounded-full border border-solid border-olake-line object-cover lg:size-[128px]'
              />
              <h3 className='mb-0 mt-[20px] text-[18px] font-normal leading-[1.3] text-olake-ink lg:text-[20px]'>
                {member.name.trim()}
              </h3>
              <p className='mb-0 mt-[4px] text-[14px] text-olake-muted'>{member.designation}</p>
              <a
                href={member.linkedin}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={`${member.name.trim()} on LinkedIn`}
                className='mt-[14px] rounded-[4px] text-[14px] text-olake-blue underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olake-blue'
              >
                LinkedIn
              </a>
            </Card>
          ))}
        </ul>
      </Section>
    </LakesidePage>
  )
}

export default AboutTeam
