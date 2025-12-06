import React from 'react'
import Layout from '@theme/Layout'
import Head from '@docusaurus/Head'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaSlack, FaLinkedin } from 'react-icons/fa'

const stripTrailingSlash = (value?: string) => {
  if (!value) {
    return ''
  }

  return value.endsWith('/') ? value.slice(0, -1) : value
}

const ensureTrailingSlash = (value: string) => {
  if (!value) {
    return '/'
  }

  return value.endsWith('/') ? value : `${value}/`
}

const ContactPage = () => {
  const { siteConfig } = useDocusaurusContext()
  const location = useLocation()
  const siteUrl = stripTrailingSlash(siteConfig?.url || 'https://olake.io')
  const canonicalUrl = ensureTrailingSlash(`${siteUrl}${location.pathname || '/'}`)

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OLake',
    alternateName: 'Datazip, Inc. (OLake project)',
    url: 'https://olake.io/',
    logo: 'https://olake.io/img/logo/olake-blue.svg',
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
    url: 'https://olake.io/',
    name: 'Fastest Open Source Data Replication Tool',
    description:
      'Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.',
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

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: canonicalUrl,
    name: 'Contact Us',
    description:
      'Get in touch with OLake for product questions, community, or support. Email hello@olake.io or call +91 9748485583. Join our Slack for community discussions.',
    isPartOf: {
      '@type': 'WebSite',
      url: 'https://olake.io/',
      name: 'OLake'
    },
    publisher: {
      '@type': 'Organization',
      name: 'OLake',
      url: 'https://olake.io/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://olake.io/img/logo/olake-blue.svg',
        width: 32,
        height: 32
      }
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9748485583',
      contactType: 'customer support',
      email: 'hello@olake.io',
      availableLanguage: ['English']
    },
    mainEntity: [
      {
        '@type': 'ContactPoint',
        contactType: 'general inquiries',
        email: 'hello@olake.io',
        telephone: '+91-9748485583'
      },
      {
        '@type': 'WebSite',
        name: 'Join Slack',
        url: 'https://olake.io/slack/'
      }
    ]
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://olake.io/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact Us',
        item: canonicalUrl
      }
    ]
  }

  const jsonLdSchemas = [
    { id: 'organization', data: organizationSchema },
    { id: 'website', data: websiteSchema },
    { id: 'contactPage', data: contactPageSchema },
    { id: 'breadcrumb', data: breadcrumbSchema }
  ]

  return (
    <Layout
      title="Contact Us - OLake"
      description="Get in touch with the OLake team. Contact us for support, partnerships, or questions about our fastest open-source data replication tool."
    >
      <Head>
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Contact Us - OLake' />
        <meta
          property='og:description'
          content='Get in touch with the OLake team. Contact us for support, partnerships, or questions about our fastest open-source data replication tool.'
        />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:site_name' content='OLake' />
        <meta property='og:locale' content='en_US' />
        <meta property='og:image' content='https://olake.io/img/logo/olake-blue.webp' />
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
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center mb-10">Contact Us</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Info Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-3">Get in Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <FaEnvelope className="text-2xl" />
                    <a href="mailto:hello@olake.io" className="hover:underline">
                      hello@olake.io
                    </a>
                  </div>
                  <div className="flex items-center space-x-4">
                    <FaPhone className="text-2xl" />
                    <a href="tel:+919748485583" className="hover:underline">
                      +91 9748485583
                    </a>
                  </div>
                  <div className="flex items-start space-x-4">
                    <FaMapMarkerAlt className="text-2xl mt-1" />
                    <div>
                      <p className="font-semibold">Headquarters</p>
                      <p>Datazip, Inc. 16192 COASTAL HWY LEWES, DE 19958, USA</p>
                      <p className="font-semibold mt-2">Working Address</p>
                      <p>
                        2nd floor, Monte carlo building, 27th Main Rd, Parangi Palaya, Sector 2, HSR Layout,
                        Bengaluru, Karnataka 560102
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <FaSlack className="text-2xl" />
                    <a
                      href="https://olake.io/slack"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Join our Slack
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Links Section */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold mb-3">Connect with Our Team on LinkedIn</h2>
              <ul className="space-y-4">
                <li className="flex items-center space-x-4">
                  <FaLinkedin className="text-2xl" />
                  <a
                    href='https://www.linkedin.com/in/sandeepdevarapalli/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:underline'
                  >
                    Sandeep
                  </a>
                </li>
                <li className="flex items-center space-x-4">
                  <FaLinkedin className="text-2xl" />
                  <a
                    href='https://www.linkedin.com/in/rohan-khameshra/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:underline'
                  >
                    Rohan
                  </a>
                </li>
                <li className="flex items-center space-x-4">
                  <FaLinkedin className="text-2xl" />
                  <a
                    href='https://www.linkedin.com/in/shubham-baldava/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:underline'
                  >
                    Shubham
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ContactPage

