import React, { useState } from "react";
// @ts-ignore
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'
import CustomerGrid, { CustomerStory } from '../../components/customers/CustomerGrid';

const stripTrailingSlash = (value?: string) => {
  if (!value) {
    return '';
  }
  return value.endsWith('/') ? value.slice(0, -1) : value;
};

const ensureTrailingSlash = (value: string) => {
  if (!value) {
    return '/';
  }
  return value.endsWith('/') ? value : `${value}/`;
};

const CustomersPage = () => {
  const { siteConfig } = useDocusaurusContext()
  const location = useLocation()
  const siteUrl = stripTrailingSlash(siteConfig?.url || 'https://olake.io')
  const canonicalUrl = ensureTrailingSlash(`${siteUrl}${location.pathname || '/'}`)
  
  const [activeFilter, setActiveFilter] = useState<'All Stories' | 'B2B' | 'Customers' | 'Fintech'>('All Stories');

  // Customer stories data
  const customerStories: CustomerStory[] = [
    {
      title: "Cordial's Path to an AI-Ready Lakehouse: Large scale Multi-Cluster MongoDB Ingestion with OLake",
      description: 'Cordial, a leading marketing automation platform, is unifying thousands of MongoDB collections into a single Apache Iceberg based lakehouse architecture to power its next generation of AI agents.',
      route: '/blog/customer-stories/cordial-real-time-data-sync',
      img: '/img/customers/cover-image-cordial.svg',
      alt: 'Cordial customer story',
      companyName: 'Cordial',
      category: 'B2B'
    },
    {
      title: "Astrotalk's Migration to Databricks: How OLake Replaced Google Datastream for Large-Scale Database Replication",
      description: 'Astrotalk runs one of India\'s largest astrology platforms, serving millions of users and handling large volumes of transactional data across PostgreSQL and MySQL. As the company began shifting from Google BigQuery to a Databricks-based lakehouse, they needed a reliable way to replicate databases to S3.',
      route: '/blog/customer-stories/astro-talk-lakehouse-transformation',
      img: '/img/customers/cover-image-astro.svg',
      alt: 'Astro Talk customer story',
      companyName: 'Astro Talk',
      category: 'Customers'
    }
  ];

  const filters: Array<'All Stories' | 'B2B' | 'Customers' | 'Fintech'> = ['All Stories', 'B2B', 'Customers'];

  return (
    <Layout
      title='Customer Stories - OLake'
      description='Hear more stories of teams across industries using OLake to securely sync their data and build modern data lakehouses.'
    >
      <Head>
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Customer Stories - OLake' />
        <meta property='og:description' content='Hear more stories of teams across industries using OLake to securely sync their data and build modern data lakehouses.' />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:site_name' content='OLake' />
        <meta property='og:locale' content='en_US' />
        <meta property='og:image' content='https://olake.io/img/logo/olake-blue.webp' />
        <meta name='twitter:image' content='https://olake.io/img/logo/olake-blue.webp' />
      </Head>

      {/* Hero Section */}
      <section className='relative bg-white py-16 dark:bg-gray-900 lg:py-24'>
        <div className='container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='space-y-8 text-center'>
            {/* Main heading */}
            <div className='space-y-4'>
              <h1 className='text-4xl font-bold leading-tight text-gray-900 dark:text-gray-50 sm:text-5xl lg:text-6xl'>
                Customer stories
              </h1>
              <p className='mx-auto max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-300'>
                Hear more stories of teams across industries using OLake to securely sync their data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className='bg-white dark:bg-gray-900 py-8'>
        <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-wrap justify-center gap-3'>
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Stories Grid */}
      <section className='bg-gray-50 dark:bg-gray-950 min-h-screen py-16 lg:py-20'>
        <div className='container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <CustomerGrid customers={customerStories} activeFilter={activeFilter} />
        </div>
      </section>
    </Layout>
  );
};

export default CustomersPage;







