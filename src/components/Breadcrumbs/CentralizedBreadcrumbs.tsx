import React from 'react';
import Link from '@docusaurus/Link';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

export interface BreadcrumbItem {
  label: string;
  fullLabel?: string; // Complete title for search engines (schema.org)
  href?: string;
  current?: boolean;
}

export interface CentralizedBreadcrumbsProps {
  type: 'iceberg' | 'iceberg-blog' | 'query-engine' | 'webinar' | 'community' | 'blog';
  title: string;
  customItems?: BreadcrumbItem[];
  maxTitleLength?: number;
}

// Helper function to truncate long titles
function truncateTitle(title: string, maxLength: number = 50): string {
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

const CentralizedBreadcrumbs: React.FC<CentralizedBreadcrumbsProps> = ({
  type,
  title,
  customItems,
  maxTitleLength = 50
}) => {
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    if (customItems) {
      return customItems;
    }

    const baseItems: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];

    // Truncate the title
    const displayTitle = truncateTitle(title, maxTitleLength);

    switch (type) {
      case 'iceberg':
        return [
          ...baseItems,
          { label: 'Iceberg', href: '/iceberg' },
          { label: displayTitle, fullLabel: title, current: true }
        ];

      case 'iceberg-blog':
        return [
          ...baseItems,
          { label: 'Iceberg', href: '/iceberg' },
          { label: displayTitle, fullLabel: title, current: true }
        ];

      case 'query-engine':
        return [
          ...baseItems,
          { label: 'Iceberg', href: '/iceberg' },
          { label: 'Query Engine', href: '/iceberg/query-engine' },
          { label: displayTitle, fullLabel: title, current: true }
        ];

      case 'webinar':
        return [
          ...baseItems,
          { label: 'Webinars & Events', href: '/webinar' },
          { label: displayTitle, fullLabel: title, current: true }
        ];

      case 'community':
        return [
          ...baseItems,
          { label: 'Community', href: '/community' },
          { label: displayTitle, fullLabel: title, current: true }
        ];

      case 'blog':
        return [
          ...baseItems,
          { label: 'Blog', href: '/blog' },
          { label: displayTitle, fullLabel: title, current: true }
        ];

      default:
        return baseItems;
    }
  };

  const items = getBreadcrumbItems();

  return (
    <nav 
      className="mb-4" 
      aria-label="Breadcrumb"
      itemScope 
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        {items.map((item, index) => (
          <li 
            key={index} 
            className="flex items-center"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {index > 0 && (
              <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />
            )}
            
            {item.href && !item.current ? (
              <Link
                to={item.href}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-600 dark:text-gray-400"
                itemProp="item"
                aria-label={item.fullLabel || item.label}
                title={item.fullLabel || item.label}
              >
                <span className="flex items-center">
                  {index === 0 ? (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-900 dark:text-gray-100" fill="currentColor">
                      <path d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" />
                    </svg>
                  ) : (
                    item.label
                  )}
                </span>
                {/* Hidden full title for search engines in schema.org markup */}
                <meta itemProp="name" content={item.fullLabel || item.label} />
              </Link>
            ) : (
              <span 
                className={`${
                  item.current 
                    ? 'text-gray-900 dark:text-gray-100 font-medium' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                aria-label={item.fullLabel || item.label}
                title={item.fullLabel || item.label}
              >
                {index === 0 ? (
                  <span className="flex items-center">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-900 dark:text-gray-100" fill="currentColor">
                      <path d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" />
                    </svg>
                  </span>
                ) : (
                  item.label
                )}
                {/* Hidden full title for search engines in schema.org markup */}
                <meta itemProp="name" content={item.fullLabel || item.label} />
              </span>
            )}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default CentralizedBreadcrumbs;
