import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useLocation } from '@docusaurus/router';
import clsx from 'clsx';

export default function BlogBreadcrumbs({ articleTitle, articleUrl }) {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const baseUrl = useBaseUrl('/');

  // Function to truncate long titles
  const truncateTitle = (title, maxLength = 50) => {
    if (!title) return '';
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength).trim() + '...';
  };

  // Function to extract title from URL path
  const getTitleFromPath = (pathname) => {
    if (!pathname) return '';
    
    // Extract the last part of the path (after the last slash)
    const pathParts = pathname.split('/').filter(part => part);
    const lastPart = pathParts[pathParts.length - 1];
    
    if (!lastPart) return '';
    
    // Convert kebab-case to title case
    const title = lastPart
      .split('-')
      .map(word => {
        // Handle common abbreviations and special cases
        const lowerWord = word.toLowerCase();
        if (lowerWord === 'api') return 'API';
        if (lowerWord === 'ui') return 'UI';
        if (lowerWord === 'etl') return 'ETL';
        if (lowerWord === 'cdc') return 'CDC';
        if (lowerWord === 'rds') return 'RDS';
        if (lowerWord === 'aws') return 'AWS';
        if (lowerWord === 'mysql') return 'MySQL';
        if (lowerWord === 'postgresql') return 'PostgreSQL';
        if (lowerWord === 'mongodb') return 'MongoDB';
        if (lowerWord === 'iceberg') return 'Iceberg';
        if (lowerWord === 'olake') return 'OLake';
        if (lowerWord === 'vs') return 'vs';
        if (lowerWord === 'to') return 'to';
        if (lowerWord === 'and') return 'and';
        if (lowerWord === 'or') return 'or';
        if (lowerWord === 'in') return 'in';
        if (lowerWord === 'on') return 'on';
        if (lowerWord === 'at') return 'at';
        if (lowerWord === 'for') return 'for';
        if (lowerWord === 'with') return 'with';
        if (lowerWord === 'by') return 'by';
        if (lowerWord === 'of') return 'of';
        if (lowerWord === 'the') return 'the';
        if (lowerWord === 'a') return 'a';
        if (lowerWord === 'an') return 'an';
        
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
    
    return title;
  };

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

  if (!isBlogPost && !isIcebergPost) {
    return null;
  }

  const breadcrumbItems = [
    {
      label: 'Home',
      href: baseUrl,
    },
    {
      label: isBlogPost ? 'Blog' : 'Iceberg',
      href: isBlogPost ? '/blog' : '/iceberg',
    },
  ];

  // Add article title if available and we're on a blog post page
  if ((isBlogPost || isIcebergPost)) {
    const title = articleTitle || getTitleFromPath(location.pathname);
    if (title) {
      breadcrumbItems.push({
        label: truncateTitle(title),
        href: articleUrl || location.pathname,
        isCurrentPage: true
      });
    }
  }

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
            {item.isCurrentPage ? (
              <span
                className="text-gray-900 dark:text-gray-100 font-medium"
                itemProp="name"
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-600 dark:text-gray-400"
                itemProp="item"
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            )}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
