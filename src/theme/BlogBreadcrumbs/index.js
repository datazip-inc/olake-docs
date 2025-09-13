import React from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function BlogBreadcrumbs() {
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig.url;

  // Check if we're on a blog post page
  const isBlogPost = location.pathname.startsWith('/blog/') && 
                     location.pathname !== '/blog' &&
                     !location.pathname.includes('/page/');

  // Check if we're on an iceberg post page
  const isIcebergPost = location.pathname.startsWith('/iceberg/') && 
                        location.pathname !== '/iceberg' &&
                        !location.pathname.includes('/page/');

  if (!isBlogPost && !isIcebergPost) {
    return null;
  }

  // Show custom breadcrumbs for iceberg posts
  if (isIcebergPost) {
    // Try to get the actual post title from document title or use URL fallback
    const getPostTitle = () => {
      // First try to get from document title
      if (typeof document !== 'undefined') {
        const docTitle = document.title;
        if (docTitle && docTitle !== 'OLake') {
          // Remove site name and clean up
          return docTitle.replace(' | OLake', '').replace(' - OLake', '').trim();
        }
      }
      
      // Fallback: convert URL slug to readable title
      const postSlug = location.pathname.replace('/iceberg/', '').replace(/\/$/, '');
      return postSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const postTitle = getPostTitle();

    const icebergBreadcrumbItems = [
      {
        label: 'Home',
        href: baseUrl,
      },
      {
        label: 'Iceberg',
        href: '/iceberg',
      },
      {
        label: postTitle,
        href: location.pathname,
        current: true
      },
    ];

    return (
      <nav 
        className="mb-4" 
        aria-label="Breadcrumb"
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          {icebergBreadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              {index > 0 && (
                <svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {item.current ? (
                <span className="font-medium text-gray-900 dark:text-gray-100" itemProp="name">
                  {item.label}
                </span>
              ) : (
                <a 
                  href={item.href} 
                  className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </a>
              )}
              <meta itemProp="position" content={index + 1} />
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  // Regular blog post breadcrumbs
  const breadcrumbItems = [
    {
      label: 'Home',
      href: baseUrl,
    },
    {
      label: 'Blog',
      href: '/blog',
    },
  ];

  return (
    <nav 
      className="mb-4" 
      aria-label="Breadcrumb"
      itemScope 
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            {index > 0 && (
              <svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            <a 
              href={item.href} 
              className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              itemProp="item"
            >
              <span itemProp="name">{item.label}</span>
            </a>
            <meta itemProp="position" content={index + 1} />
          </li>
        ))}
      </ol>
    </nav>
  );
}