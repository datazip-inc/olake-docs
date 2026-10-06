import React from 'react'
import Head from '@docusaurus/Head'
import { serializeJsonLd } from '@site/src/components/JsonLd'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'
import { PiEnvelopeSimple, PiLinkedinLogo, PiMapPin, PiSlackLogo } from 'react-icons/pi'
import LakesidePage from '@site/src/components/landing/ui/LakesidePage'
import Section from '@site/src/components/landing/ui/Section'
import Card from '@site/src/components/landing/ui/Card'
import PageHero from '@site/src/components/pages-misc/PageHero'
import RegistrationSection from '@site/src/components/site/RegistrationSection'
import '@site/src/components/pages-misc/pages-misc.css'

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
      'Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.',
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

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'url': canonicalUrl,
    'name': 'Contact Us',
    'description':
      'Get in touch with OLake for product questions, community, or support. Email hello@olake.io. Join our Slack for community discussions.',
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
    'contactPoint': {
      '@type': 'ContactPoint',
      'contactType': 'customer support',
      'email': 'hello@olake.io',
      'availableLanguage': ['English']
    },
    'mainEntity': [
      {
        '@type': 'ContactPoint',
        'contactType': 'general inquiries',
        'email': 'hello@olake.io'
      },
      {
        '@type': 'WebSite',
        'name': 'Join Slack',
        'url': 'https://olake.io/slack/'
      }
    ]
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
        'name': 'Contact Us',
        'item': canonicalUrl
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
    <LakesidePage
      title='Contact Us'
      description='Get in touch with the OLake team. Contact us for support, partnerships, or questions about our fastest open-source data replication tool.'
      activePath='/contact'
      heroBackground={
        <PageHero title='Contact Us'>
          <p>
            Get in touch with the OLake team. Contact us for support, partnerships, or questions
            about our open-source data replication tool.
          </p>
        </PageHero>
      }
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
        <meta property='og:image' content='https://olake.io/img/logo/olake-og-card.png' />
        {jsonLdSchemas.map((schema) => (
          <script key={schema.id} type='application/ld+json'>{serializeJsonLd(schema.data)}</script>
        ))}
      </Head>
      <RegistrationSection />
      <Section flush className='pb-[56px] pt-[16px] lg:pb-[96px] lg:pt-[24px]'>
        <div className='grid grid-cols-1 items-start gap-[16px] lg:grid-cols-2 lg:gap-[24px]'>
          <Card className='p-[24px] lg:p-[32px]'>
            <h2 className='mb-0 text-[20px] font-normal leading-[1.25] text-olake-ink lg:text-[24px]'>
              Other ways to reach us
            </h2>
            <ul className='mb-0 list-none p-0 mt-[20px] flex flex-col gap-[20px]'>
              <li className='flex items-center gap-[16px]'>
                <PiEnvelopeSimple aria-hidden='true' className='size-[20px] shrink-0 text-olake-muted' />
                <a href='mailto:hello@olake.io' className='olake-link text-[15px]'>
                  hello@olake.io
                </a>
              </li>
              <li className='flex items-start gap-[16px]'>
                <PiMapPin aria-hidden='true' className='mt-[2px] size-[20px] shrink-0 text-olake-muted' />
                <div className='text-[15px] leading-[1.6] text-olake-text-2'>
                  <p className='mb-0 font-medium text-olake-ink'>Headquarters</p>
                  <p className='mb-0'>Datazip, Inc. 16192 COASTAL HWY LEWES, DE 19958, USA</p>
                  <p className='mb-0 mt-[14px] font-medium text-olake-ink'>Working Address</p>
                  <p className='mb-0'>
                    HustleHub H203, 522, 24th Main Rd, Parangi Palaya, Sector 2, HSR Layout,
                    Bengaluru, Karnataka 560102
                  </p>
                </div>
              </li>
              <li className='flex items-center gap-[16px]'>
                <PiSlackLogo aria-hidden='true' className='size-[20px] shrink-0 text-olake-muted' />
                <a
                  href='https://olake.io/slack/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='olake-link text-[15px]'
                >
                  Join our Slack
                </a>
              </li>
            </ul>
          </Card>

          <Card className='p-[24px] lg:p-[32px]'>
            <h2 className='mb-0 text-[20px] font-normal leading-[1.25] text-olake-ink lg:text-[24px]'>
              Connect with Our Team on LinkedIn
            </h2>
            <ul className='mb-0 list-none p-0 mt-[20px] flex flex-col gap-[20px]'>
              <li className='flex items-center gap-[16px]'>
                <PiLinkedinLogo aria-hidden='true' className='size-[20px] shrink-0 text-olake-muted' />
                <a
                  href='https://www.linkedin.com/in/rohan-khameshra/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='olake-link text-[15px]'
                >
                  Rohan
                </a>
              </li>
              <li className='flex items-center gap-[16px]'>
                <PiLinkedinLogo aria-hidden='true' className='size-[20px] shrink-0 text-olake-muted' />
                <a
                  href='https://www.linkedin.com/in/shubham-baldava/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='olake-link text-[15px]'
                >
                  Shubham
                </a>
              </li>
            </ul>
          </Card>
        </div>
      </Section>
    </LakesidePage>
  )
}

export default ContactPage
