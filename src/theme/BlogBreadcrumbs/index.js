import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useLocation } from '@docusaurus/router';
import clsx from 'clsx';

export default function BlogBreadcrumbs() {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const baseUrl = useBaseUrl('/');

  // Don't show breadcrumbs on the main blog listing page
  if (location.pathname === '/blog' || location.pathname === '/') {
    return null;
  }

  // Check if we're on a blog post page
  const isBlogPost = location.pathname.startsWith('/blog/') && 
                     location.pathname !== '/blog' &&
                     !location.pathname.includes('/page/');

  // Check if we're on an iceberg post page
  const isIcebergPost = location.pathname.startsWith('/iceberg/') && 
                        location.pathname !== '/iceberg' &&
                        !location.pathname.includes('/page/');

  // Show custom breadcrumbs for iceberg posts
  if (isIcebergPost) {
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
        label: 'Blog',
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
            <li 
              key={item.href}
              className="flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && (
                <svg 
                  className="w-4 h-4 mx-2 text-gray-400" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              )}
              <Link
                to={item.href}
                className={clsx(
                  "hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
                  item.current 
                    ? "text-gray-900 dark:text-gray-100 font-medium" 
                    : "text-gray-600 dark:text-gray-400"
                )}
                itemProp="item"
              >
                <span itemProp="name">{item.label}</span>
              </Link>
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  if (!isBlogPost) {
    return null;
  }

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
          <li 
            key={item.href}
            className="flex items-center"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {index > 0 && (
              <svg 
                className="w-4 h-4 mx-2 text-gray-400" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            )}
            <Link
              to={item.href}
              className={clsx(
                "hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
                index === breadcrumbItems.length - 1 
                  ? "text-gray-900 dark:text-gray-100 font-medium" 
                  : "text-gray-600 dark:text-gray-400"
              )}
              itemProp="item"
            >
              <span itemProp="name">{item.label}</span>
            </Link>
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
