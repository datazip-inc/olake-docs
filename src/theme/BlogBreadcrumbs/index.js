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

  // Normalize pathname by removing trailing slash and query params for comparison
  const normalizedPath = location.pathname.replace(/\/$/, '').split('?')[0];
  
  // Helper to capitalize first letter
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // Helper to get readable name from slug
  const getReadableName = (slug) => {
    return slug
      .split('-')
      .map(word => capitalize(word))
      .join(' ');
  };

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
      </Link>
      {/* Schema.org markup for breadcrumb item */}
      <meta itemProp="name" content={item.fullLabel || item.label} />
      <meta itemProp="position" content={String(index + 1)} />
    </li>
  );

  // Reusable breadcrumb nav wrapper
  const renderBreadcrumbNav = (breadcrumbItems) => (
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

  // Section configurations for listing pages, tags, and authors
  const sections = {
    blog: { label: 'Blog', path: '/blog' },
    iceberg: { label: 'Iceberg', path: '/iceberg' },
    'customer-stories': { label: 'Customer Stories', path: '/customer-stories' },
  };

  // Helper to build breadcrumb items for tags/authors pages
  const buildSubPageBreadcrumbs = (section, subPageType) => {
    const subPageLabel = capitalize(subPageType);
    const pathParts = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems = [
      { label: 'Home', href: baseUrl },
      { label: section.label, href: section.path },
      { label: subPageLabel, href: `${section.path}/${subPageType}` }
    ];

    // If it's a specific item page (e.g., /blog/tags/react or /blog/authors/john)
    if (pathParts.length > 2 && pathParts[2]) {
      const itemName = getReadableName(pathParts[2]);
      breadcrumbItems.push({ label: itemName, href: location.pathname, current: true });
    } else {
      breadcrumbItems[breadcrumbItems.length - 1].current = true;
    }

    return breadcrumbItems;
  };

  // Don't show breadcrumbs on home page
  if (normalizedPath === '/') {
    return null;
  }

  // Handle listing pages (blog, iceberg, customer-stories)
  for (const section of Object.values(sections)) {
    if (normalizedPath === section.path || normalizedPath.startsWith(`${section.path}/page/`)) {
      return renderBreadcrumbNav([
        { label: 'Home', href: baseUrl },
        { label: section.label, href: section.path, current: true },
      ]);
    }
  }

  // Handle tags and authors pages using sections directly
  for (const section of Object.values(sections)) {
    // Handle tags pages
    if (location.pathname.startsWith(`${section.path}/tags`)) {
      return renderBreadcrumbNav(buildSubPageBreadcrumbs(section, 'tags'));
    }

    // Handle authors pages
    if (location.pathname.startsWith(`${section.path}/authors`)) {
      return renderBreadcrumbNav(buildSubPageBreadcrumbs(section, 'authors'));
    }
  }

  // Helper to check if it's a post page (not listing, tags, or authors)
  const isPostPage = (prefix) => {
    return location.pathname.startsWith(`${prefix}/`) &&
      location.pathname !== prefix &&
      !location.pathname.includes('/page/') &&
      !location.pathname.includes('/tags/') &&
      !location.pathname.includes('/authors/');
  };

  // Handle individual post pages
  const postConfigs = [
    { check: isPostPage('/iceberg'), label: 'Iceberg', path: '/iceberg', fallbackTitle: 'Blog Post' },
    { check: isPostPage('/customer-stories'), label: 'Customer Stories', path: '/customer-stories', fallbackTitle: 'Customer Story' },
    { check: isPostPage('/blog'), label: 'Blog', path: '/blog', fallbackTitle: 'Blog Post' },
  ];

  for (const config of postConfigs) {
    if (config.check) {
      const blogTitle = blogPostMetadata?.title || config.fallbackTitle;
      const truncatedTitle = truncateTitle(blogTitle, 70);

      return renderBreadcrumbNav([
        { label: 'Home', href: baseUrl },
        { label: config.label, href: config.path },
        { label: truncatedTitle, fullLabel: blogTitle, href: location.pathname, current: true },
      ]);
    }
  }

  return null;
}
