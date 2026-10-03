import React, { useState } from 'react'
import Head from '@docusaurus/Head'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'
import LakesidePage from '@site/src/components/landing/ui/LakesidePage'
import Section from '@site/src/components/landing/ui/Section'
import CustomerGrid from '../../components/customers/CustomerGrid'
import { CustomerCategory } from '../../types/customer'
import { CUSTOMER_STORIES } from '@site/src/data/customers/stories'
import JsonLd from '@site/src/components/JsonLd'
import { cn } from '@site/src/lib/utils'

const TITLE = 'Customer Stories - OLake'
const DESCRIPTION =
  'Hear more stories of teams across industries using OLake to securely sync their data and build modern data lakehouses.'

type Filter = 'All Stories' | CustomerCategory

const FILTERS: Filter[] = ['All Stories', CustomerCategory.B2B, CustomerCategory.CustomerInternet]

/** Hero of the list. Its wrapper (`.lakeside-hero-bg`) lives in LakesidePage. */
const StoriesHero = () => (
  <section className='relative px-[32px] pb-[40px] pt-[150px] lg:px-[24px] lg:pb-[56px] lg:pt-[170px]'>
    <div className='mx-auto w-full max-w-[1016px] lg:text-center'>
      <h1 className='olake-h1 mb-0'>
        Customer stories
      </h1>
      <p className='mb-0 mt-[12px] text-[13px] leading-[1.55] text-olake-text lg:mx-auto lg:mt-[18px] lg:max-w-[640px] lg:text-[15px]'>
        Hear more stories of teams across industries using OLake to securely sync their data.
      </p>
    </div>
  </section>
)

export default function CustomersPage() {
  const { siteConfig } = useDocusaurusContext()
  const location = useLocation()
  const siteUrl = siteConfig?.url || 'https://olake.io'
  const canonicalUrl = `${siteUrl}${location.pathname || '/'}`

  const [activeFilter, setActiveFilter] = useState<Filter>('All Stories')

  // CollectionPage + ItemList of the stories the grid shows by default ("All Stories").
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Customer Stories',
    description: DESCRIPTION,
    url: `${siteUrl}/customer-stories/`,
    isPartOf: { '@type': 'WebSite', name: 'OLake', url: `${siteUrl}/` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: CUSTOMER_STORIES.length,
      itemListElement: CUSTOMER_STORIES.map((story, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: story.title,
        url: `${siteUrl}${story.route.replace(/\/?$/, '/')}`
      }))
    }
  }

  return (
    <LakesidePage title='Customer Stories' description={DESCRIPTION} activePath='/customer-stories' heroBackground={<StoriesHero />}>
      <Head>
        <meta property='og:type' content='website' />
        <meta property='og:title' content={TITLE} />
        <meta property='og:description' content={DESCRIPTION} />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:site_name' content='OLake' />
        <meta property='og:locale' content='en_US' />
        <meta property='og:image' content='https://olake.io/img/logo/olake-og-card.png' />
        <meta name='twitter:image' content='https://olake.io/img/logo/olake-og-card.png' />
      </Head>
      <JsonLd data={collectionSchema} />

      {/* Infima gives headings, paragraphs and lists bottom margins and lists a left padding;
          the lakeside reset is zero-specificity and loses, so it is undone here for the whole list. */}
      <div className='[&_:is(h2,h3,p,ul)]:mb-0 [&_ul]:pl-0'>
        <Section flush className='pb-[56px] pt-[8px] lg:pb-[96px] lg:pt-[8px]'>
          <div role='group' aria-label='Filter stories' className='mb-[24px] flex flex-wrap gap-[8px] lg:mb-[32px]'>
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type='button'
                aria-pressed={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'h-[34px] cursor-pointer rounded-[8px] border border-solid px-[14px] text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olake-blue',
                  activeFilter === filter
                    ? 'border-olake-ink bg-olake-ink text-olake-surface'
                    : 'border-olake-btn-border bg-olake-surface text-olake-btn-secondary hover:bg-olake-surface-alt hover:text-olake-ink'
                )}
              >
                {filter}
              </button>
            ))}
          </div>
          <CustomerGrid customers={CUSTOMER_STORIES} activeFilter={activeFilter} />
        </Section>
      </div>
    </LakesidePage>
  )
}
