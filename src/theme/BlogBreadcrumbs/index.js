import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useLocation } from '@docusaurus/router';
import clsx from 'clsx';
import { truncateTitle } from '../../lib/utils';

// Try to import useBlogPost, handle gracefully if not available
let useBlogPost;
try {
  useBlogPost = require('@docusaurus/plugin-content-blog/client').useBlogPost;
} catch (e) {
  // Hook not available, we'll handle this case below
}

export default function BlogBreadcrumbs() {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const baseUrl = useBaseUrl('/');
  const siteUrl = siteConfig.url || 'https://olake.io';

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

  // Helper to capitalize first letter
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // Helper to get readable name from slug
  const getReadableName = (slug) => {
    return slug
      .split('-')
      .map(word => capitalize(word))
      .join(' ');
  };

  const isBlogPost =
    location.pathname.startsWith('/blog/') &&
    location.pathname !== '/blog' &&
    !location.pathname.includes('/page/') &&
    !location.pathname.includes('/tags/') &&
    !location.pathname.includes('/authors/');

  const isIcebergPost =
    location.pathname.startsWith('/iceberg/') &&
    location.pathname !== '/iceberg' &&
    !location.pathname.includes('/page/') &&
    !location.pathname.includes('/tags/') &&
    !location.pathname.includes('/authors/');

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
        aria-label={item.fullLabel || item.label}
        title={item.fullLabel || item.label}
      >
        <span className="flex items-center">
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
        {/* Hidden full title for search engines in schema.org markup */}
        <meta itemProp="name" content={item.fullLabel || item.label} />
        <meta itemProp="@id" content={`${siteUrl}${item.href}`} /> 
      </Link>
      <meta itemProp="position" content={String(index + 1)} />
    </li>
  );

  // Handle Iceberg tags pages
  if (location.pathname.startsWith('/iceberg/tags')) {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems = [
      { label: 'Home', href: baseUrl },
      { label: 'Iceberg', href: '/iceberg' },
      { label: 'Tags', href: '/iceberg/tags' }
    ];

    // If it's a specific tag page
    if (pathParts.length > 2 && pathParts[2]) {
      const tagName = getReadableName(pathParts[2]);
      breadcrumbItems.push({ label: tagName, href: location.pathname, current: true });
    } else {
      breadcrumbItems[breadcrumbItems.length - 1].current = true;
    }

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

  // Handle Iceberg authors pages
  if (location.pathname.startsWith('/iceberg/authors')) {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems = [
      { label: 'Home', href: baseUrl },
      { label: 'Iceberg', href: '/iceberg' },
      { label: 'Authors', href: '/iceberg/authors' }
    ];

    // If it's a specific author page
    if (pathParts.length > 2 && pathParts[2]) {
      const authorName = getReadableName(pathParts[2]);
      breadcrumbItems.push({ label: authorName, href: location.pathname, current: true });
    } else {
      breadcrumbItems[breadcrumbItems.length - 1].current = true;
    }

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

  // Handle Blog tags pages
  if (location.pathname.startsWith('/blog/tags')) {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems = [
      { label: 'Home', href: baseUrl },
      { label: 'Blog', href: '/blog' },
      { label: 'Tags', href: '/blog/tags' }
    ];

    // If it's a specific tag page
    if (pathParts.length > 2 && pathParts[2]) {
      const tagName = getReadableName(pathParts[2]);
      breadcrumbItems.push({ label: tagName, href: location.pathname, current: true });
    } else {
      breadcrumbItems[breadcrumbItems.length - 1].current = true;
    }

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

  // Handle Blog authors pages
  if (location.pathname.startsWith('/blog/authors')) {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems = [
      { label: 'Home', href: baseUrl },
      { label: 'Blog', href: '/blog' },
      { label: 'Authors', href: '/blog/authors' }
    ];

    // If it's a specific author page
    if (pathParts.length > 2 && pathParts[2]) {
      const authorName = getReadableName(pathParts[2]);
      breadcrumbItems.push({ label: authorName, href: location.pathname, current: true });
    } else {
      breadcrumbItems[breadcrumbItems.length - 1].current = true;
    }

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

  if (isIcebergPost) {
    // Get the blog post title if available
    const blogTitle = blogPostMetadata?.title || 'Blog Post';
    const truncatedTitle = truncateTitle(blogTitle, 70);

    const icebergBreadcrumbItems = [
      { label: 'Home', href: baseUrl },
      { label: 'Iceberg', href: '/iceberg' },
      { label: truncatedTitle, fullLabel: blogTitle, href: location.pathname, current: true },
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

  // Check if this is a customer story
  const isCustomerStory = location.pathname.startsWith('/customers/') && 
                          location.pathname !== '/customers';

  // Get the blog post title if available
  const blogTitle = blogPostMetadata?.title || 'Blog Post';
  const truncatedTitle = truncateTitle(blogTitle, 70);

  const breadcrumbItems = [
    { label: 'Home', href: baseUrl },
    { label: isCustomerStory ? 'Customer Stories' : 'Blog', href: isCustomerStory ? '/customers' : '/blog' },
    { label: truncatedTitle, fullLabel: blogTitle, href: location.pathname, current: true },
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
