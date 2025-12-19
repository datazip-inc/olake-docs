import React from 'react'
import Layout from '@theme/Layout'
import Head from '@docusaurus/Head'

const teamMembers = [
  {
    name: 'Shubham Satish Baldava',
    designation: 'CTO',
    linkedin: 'https://linkedin.com/in/shubham-baldava',
    image: '/img/authors/shubham.webp'
  },
  {
    name: 'Rohan Khameshra',
    designation: 'CEO',
    linkedin: 'https://linkedin.com/in/rohan-khameshra',
    image: '/img/authors/rohan.webp'
  },  
  {
    name: 'Sandeep Devarapalli ',
    designation: 'CMO',
    linkedin: 'https://linkedin.com/in/sandeepdevarapalli',
    image: '/img/authors/sandeep.webp'
  },

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
      },
      {
        '@type': 'Person',
        name: 'Sandeep Devarapalli',
        jobTitle: 'CMO',
        worksFor: {
          '@type': 'Organization',
          name: 'OLake'
        },
        image: 'https://olake.io/img/authors/sandeep.webp'
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
    <Layout 
      title="About Us - OLake Team"
      description="Meet the OLake team behind the fastest open-source data replication tool. Learn about our mission to simplify database to Apache Iceberg workflows."
    >
      <Head>
        {jsonLdSchemas.map((schema) => (
          <script
            key={schema.id}
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema.data)
            }}
          />
        ))}
      </Head>
      <div className='bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
          {/* About Us Section */}
          <section className='mb-16'>
            <h2 className='mb-4 text-center text-3xl font-extrabold' style={{ color: '#193AE6' }}>
              About Us
            </h2>
            <p className='mx-auto max-w-2xl text-center text-lg'>
              OLake is the fastest open-source, Iceberg-first EL engine that removes the pain of brittle scripts and one-off pipelines. We make "database → Apache Iceberg" simple, fast, and observable—with recent benchmarks showing up to 500× faster ingest than common alternatives—so your team can stop handling connectors and start focusing on models, products, and impact.
            </p>
            <p className='mx-auto max-w-2xl text-center text-lg mt-6'>
              Born from real-world issues with slow, fragile ingestion, OLake gives you a clean UI/CLI, resilient CDC, and a path that keeps getting faster with every release—and we're actively pushing those benchmarks even further. No vendor lock-in, no plumbing issues—just a reliable way to move data into Iceberg for your modern analytics.
            </p>
          </section>

          {/* Our Team Section */}
          <section>
            <h2 className='mb-8 text-center text-3xl font-extrabold' style={{ color: '#193AE6' }}>
              Our Team
            </h2>
            <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
              {teamMembers.map((member, index) => (
                <div key={index} className='text-center'>
                  <div className='mx-auto h-40 w-40'>
                    <img
                      src={member.image}
                      alt={`${member.name} | Olake ${member.designation}`}
                      className='h-40 w-40 rounded-full object-cover transition duration-300 hover:border hover:border-gray-300'
                      loading="lazy" decoding="async"
                    />
                  </div>
                  <h3 className='mt-4 text-xl font-medium'>{member.name}</h3>
                  <p className='text-gray-500 dark:text-gray-400'>{member.designation}</p>
                  <div className='mt-2'>
                    <a
                      href={member.linkedin}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[#193AE6] hover:underline'
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}

export default AboutTeam
