import React from 'react';
import Link from '@docusaurus/Link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface CentralizedBreadcrumbsProps {
  type: 'iceberg' | 'query-engine' | 'webinar' | 'community' | 'blog';
  title: string;
  customItems?: BreadcrumbItem[];
}

const CentralizedBreadcrumbs: React.FC<CentralizedBreadcrumbsProps> = ({
  type,
  title,
  customItems
}) => {
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    if (customItems) {
      return customItems;
    }

    const baseItems: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];

    switch (type) {
      case 'iceberg':
        return [
          ...baseItems,
          { label: 'Iceberg', href: '/iceberg' },
          { label: title, current: true }
        ];

      case 'query-engine':
        return [
          ...baseItems,
          { label: 'Iceberg', href: '/iceberg' },
          { label: 'Query Engine', href: '/iceberg/query-engine' },
          { label: title, current: true }
        ];

      case 'webinar':
        return [
          ...baseItems,
          { label: 'Webinars & Events', href: '/webinar' },
          { label: title, current: true }
        ];

      case 'community':
        return [
          ...baseItems,
          { label: 'Community', href: '/community' },
          { label: title, current: true }
        ];

      case 'blog':
        return [
          ...baseItems,
          { label: 'Blog', href: '/blog' },
          { label: title, current: true }
        ];

      default:
        return baseItems;
    }
  };

  const items = getBreadcrumbItems();

  return (
    <nav className="mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />
            )}
            
            {item.href && !item.current ? (
              <Link
                to={item.href}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-600 dark:text-gray-400"
              >
                {index === 0 ? (
                  <span className="flex items-center">
                    <HomeIcon className="w-4 h-4" />
                  </span>
                ) : (
                  item.label
                )}
              </Link>
            ) : (
              <span className={`${
                item.current 
                  ? 'text-gray-900 dark:text-gray-100 font-medium' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {index === 0 ? (
                  <span className="flex items-center">
                    <HomeIcon className="w-4 h-4" />
                  </span>
                ) : (
                  item.label
                )}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default CentralizedBreadcrumbs;
