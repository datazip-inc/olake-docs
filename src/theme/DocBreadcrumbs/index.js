import React from 'react';
import DocBreadcrumbs from '@theme-original/DocBreadcrumbs';
import Link from '@docusaurus/Link';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function DocBreadcrumbsWrapper(props) {
  // Check if this is a query engine page
  const isQueryEnginePage = props.items && props.items.some(item => 
    item.href && item.href.includes('/iceberg/query-engine')
  );

  if (isQueryEnginePage) {
    // Custom breadcrumb structure for query engine pages
    const customItems = [
      {
        label: 'Home',
        href: '/',
        icon: <HomeIcon className="w-4 h-4" />
      },
      {
        label: 'Iceberg',
        href: '/iceberg'
      },
      {
        label: 'Query Engine',
        href: '/iceberg/query-engine'
      },
      // Add the current page as the last item
      ...props.items.slice(-1)
    ];

    return (
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm">
          {customItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
              
              {item.href ? (
                <Link
                  to={item.href}
                  className="flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {index === 0 ? "" : item.label}
                </Link>
              ) : (
                <span className="flex items-center text-gray-900 dark:text-gray-100 font-medium">
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {index === 0 ? "" : item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  // For other pages, use the default breadcrumbs
  return <DocBreadcrumbs {...props} />;
}
