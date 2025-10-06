import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useLocation } from '@docusaurus/router';
import clsx from 'clsx';

// Try to import useBlogPost, handle gracefully if not available
let useBlogPost;
try {
  useBlogPost = require('@docusaurus/plugin-content-blog/client').useBlogPost;
} catch (e) {
  // Hook not available, we'll handle this case below
}

// Helper function to truncate long titles
function truncateTitle(title, maxLength = 50) {
  if (!title || title.length <= maxLength) {
    return title;
  }
  // Find the last space before maxLength to avoid cutting words
  const truncated = title.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.7) { // Only use last space if it's not too far back
    return truncated.substring(0, lastSpace) + '...';
  }
  return truncated + '...';
}

export default function BlogBreadcrumbs() {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const baseUrl = useBaseUrl('/');

  // Try to get blog post metadata if available
  let blogPostMetadata = null;
  if (useBlogPost) {
    try {
      const blogPost = useBlogPost();
      blogPostMetadata = blogPost?.metadata;
    } catch (e) {
      // Not in a blog post context
    }
  }

  // Don't show breadcrumbs on the main blog listing page
  if (location.pathname === '/blog' || location.pathname === '/') {
    return null;
  }

  const isBlogPost =
    location.pathname.startsWith('/blog/') &&
    location.pathname !== '/blog' &&
    !location.pathname.includes('/page/');

  const isIcebergPost =
    location.pathname.startsWith('/iceberg/') &&
    location.pathname !== '/iceberg' &&
    !location.pathname.includes('/page/');

  // Helper renderer for breadcrumb items
  const renderBreadcrumbItem = (item, index) => (
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
        itemScope
        itemType="https://schema.org/Thing" 
      >
        <span itemProp="name" className="flex items-center">
          {index === 0 ? (
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-gray-900 dark:text-gray-100"
              fill="currentColor"
            >
              <path d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" />
            </svg>
          ) : (
            item.label
          )}
        </span>
        <meta itemProp="@id" content={item.href} /> 
      </Link>
      <meta itemProp="position" content={String(index + 1)} />
    </li>
  );

  if (isIcebergPost) {
    // Get the blog post title if available
    const blogTitle = blogPostMetadata?.title || 'Blog Post';
    const truncatedTitle = truncateTitle(blogTitle, 50);

    const icebergBreadcrumbItems = [
      { label: 'Home', href: baseUrl },
      { label: 'Iceberg', href: '/iceberg' },
      { label: 'Blog', href: '/iceberg' },
      { label: truncatedTitle, href: location.pathname, current: true },
    ];

    return (
      <nav
        className="mb-4"
        aria-label="Breadcrumb"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          {icebergBreadcrumbItems.map(renderBreadcrumbItem)}
        </ol>
      </nav>
    );
  }

  if (!isBlogPost) {
    return null;
  }

  // Get the blog post title if available
  const blogTitle = blogPostMetadata?.title || 'Blog Post';
  const truncatedTitle = truncateTitle(blogTitle, 50);

  const breadcrumbItems = [
    { label: 'Home', href: baseUrl },
    { label: 'Blog', href: '/blog' },
    { label: truncatedTitle, href: location.pathname, current: true },
  ];

  return (
    <nav
      className="mb-4"
      aria-label="Breadcrumb"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        {breadcrumbItems.map(renderBreadcrumbItem)}
      </ol>
    </nav>
  );
}
