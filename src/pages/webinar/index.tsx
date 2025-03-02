import WebinarGrid from '../../components/webinars/WebinarGrid';

import React = require('react');
import Layout from '@theme/Layout';

// Define the webinar type directly here if not using a separate types file
type Webinar = {
  title: string;
  subtitle: string;
  route: string;
  img: string;
  alt: string;
  status: string;
  button: string;
  CTA: string;
  date: string;
};


const WebinarsPage = () => {
  // Define webinars data directly
  const webinars: Webinar[] = [
    {
      title: 'CDC Unplugged - Modern Data Integration with Real World Insights',
      subtitle: 'Join us for a deep dive into Change Data Capture (CDC), a vital technique for enabling real-time data integration and streaming. We will trace CDCs evolution from traditional methods to its role in modern data lakehouses, while introducing key tools to help you get started. Expect actionable best practices and insightful case studies to tie everything together',
      route: '/webinar/w-3-cdc-unplugged',
      img: `/img/webinars/webinar-cdc-unplugged.webp`,
      alt: 'CDC Unplugged Webinar',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '09 January 2025',
    },
    {
      title: 'A Leadership Forum for Data Engineers and MLOps',
      subtitle: 'Join us for an intensive session bringing together senior data engineers and ML practitioners. We will explore the intersection of modern data architecture and ML operations, focusing on building scalable platforms that serve both analytics and machine learning needs.',
      route: '/event/leadership-forum',
      img: `/img/events/e-1-leadership-forum.webp`,
      alt: 'A Leadership Forum for Data Engineers and MLOps',
      status: 'archived',
      button: 'outline',
      CTA: 'Registrations Over',
      date: '21 December 2024',
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
      date: '15 December 2024',
    },
    {
      title: 'A Journey into Data Lake: Introducing Apache Iceberg',
      subtitle: 'Learn how to set up OLAP system/platform for analysis from NoSQL Databases (MongoDB & DynamoDB) using Apache Iceberg.',
      // summary: 'Join us for an exclusive webinar where we discuss Apache Iceberg...',
      route: '/webinar/w-1-intro-iceberg',
      img: `/img/webinars/webinar-intro-iceberg.webp`,
      alt: 'Introduction to Apache Iceberg',
      status: 'archived',
      button: 'secondary',
      CTA: 'Watch Now',
      date: '03 October 2024',
    },
  ];

  return (
    <Layout
      title='OLake Webinars'
      description='Join our upcoming events and webinars to learn about the latest in ETL, Apache Iceberg and more'
    >

      <div className="container items-center mx-auto py-12 px-12">
        <h1 className="text-4xl font-bold mb-8">Events & Webinars</h1>
        <WebinarGrid webinars={webinars} />

      </div>
    </Layout>

  );
};


export default WebinarsPage;
