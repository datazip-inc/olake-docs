import { CustomerCategory, CustomerStory } from '@site/src/types/customer'

/** Customer stories for the /customer-stories/ list, most recent first (same order as the blog). */
export const CUSTOMER_STORIES: CustomerStory[] = [
  {
    title:
      'Reliable Lakehouse Ingestion at Scale: How LendingKart Improved Data Correctness and Compressed Lake Ingestion Volume by 100×',
    description:
      "How LendingKart reduced daily MongoDB data movement from gigabytes to megabytes while completing an 11 years historical backfill that their Debezium + Spark setup couldn't deliver reliably.",
    route: '/customer-stories/lendingkart-Improved-Data-Correctness',
    img: '/img/customers/lendingkart/cover-image-lendingkart.webp',
    imgWidth: 1824,
    imgHeight: 824,
    alt: 'LendingKart customer story',
    companyName: 'LendingKart',
    category: CustomerCategory.B2B,
    date: '2026-02-11'
  },
  {
    title: 'PhysicsWallah Evaluates MongoDB CDC Ingestion into a Lakehouse with Apache Iceberg and OLake',
    description:
      'At PhysicsWallah, the Data Engineering team operates a large-scale lakehouse platform that powers analytics, reporting, and AI-driven use cases. A significant portion of operational data originates from MongoDB, making reliable and scalable CDC ingestion a foundational requirement.',
    route: '/customer-stories/physicswallah-mongodb-cdc-iceberg',
    img: '/img/customers/physicswallah/cover-image-pw.webp',
    imgWidth: 1630,
    imgHeight: 810,
    alt: 'PhysicsWallah customer story',
    companyName: 'PhysicsWallah',
    category: CustomerCategory.CustomerInternet,
    date: '2026-01-30'
  },
  {
    title:
      'From 40-Minute to Sub-Minute Segmentation Queries: How Bitespeed rebuilt its customer segmentation engine using OLake and Apache Iceberg',
    description:
      'Bitespeed is a customer engagement and messaging platform built for modern commerce brands. Learn how they rebuilt their segmentation engine using OLake and Apache Iceberg without breaking their budget.',
    route: '/customer-stories/bitespeed-segmentation-queries',
    img: '/img/customers/bitespeed/cover-image-bitespeed.webp',
    imgWidth: 1934,
    imgHeight: 964,
    alt: 'Bitespeed customer story',
    companyName: 'Bitespeed',
    category: CustomerCategory.CustomerInternet,
    date: '2026-01-13'
  },
  {
    title: "Cordial's Path to an AI-Ready Lakehouse: Large scale Multi-Cluster MongoDB Ingestion with OLake",
    description:
      'Cordial, a leading marketing automation platform, is unifying thousands of MongoDB collections into a single Apache Iceberg based lakehouse architecture to power its next generation of AI agents.',
    route: '/customer-stories/cordial-real-time-data-sync',
    img: '/img/customers/cordial/cover-image-cordial.webp',
    imgWidth: 1580,
    imgHeight: 666,
    alt: 'Cordial customer story',
    companyName: 'Cordial',
    category: CustomerCategory.B2B,
    date: '2025-12-15'
  },
  {
    title: "Astrotalk's Migration to Databricks: How OLake Replaced Google Datastream for Large-Scale Database Replication",
    description:
      "Astrotalk runs one of India's largest astrology platforms, serving millions of users and handling large volumes of transactional data across PostgreSQL and MySQL. As the company began shifting from Google BigQuery to a Databricks-based lakehouse, they needed a reliable way to replicate databases to S3.",
    route: '/customer-stories/astro-talk-lakehouse-transformation',
    img: '/img/customers/astrotalk/cover-image-astro.webp',
    imgWidth: 1670,
    imgHeight: 852,
    alt: 'Astro Talk customer story',
    companyName: 'Astro Talk',
    category: CustomerCategory.CustomerInternet,
    date: '2025-12-15'
  },
  {
    title: 'Zero Pipeline Failures, 50% Faster Loads: How Xeno Rebuilt Their Data Foundation on OLake',
    description:
      'Xeno, an AI-powered customer engagement platform for retailers, kept hitting broken replication on AWS DMS whenever its MySQL schema changed. After migrating MySQL CDC to OLake on Kubernetes, full-load time dropped nearly 50% and schema changes stopped breaking pipelines.',
    route: '/customer-stories/xeno-aws-dms-alternative-mysql-cdc',
    img: '/img/customers/xeno/cover-image-xeno.webp',
    imgWidth: 1454,
    imgHeight: 686,
    alt: 'Xeno customer story',
    companyName: 'Xeno',
    category: CustomerCategory.B2B,
    date: '2026-06-14'
  }
].sort((a, b) => b.date.localeCompare(a.date))
