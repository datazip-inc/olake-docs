import React from 'react';
import DocBreadcrumbs from '@theme-original/DocBreadcrumbs';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
// Using Docusaurus home icon SVG instead of Heroicons

export default function DocBreadcrumbsWrapper(props) {
  const { siteConfig } = useDocusaurusContext();
  const siteUrl = siteConfig.url || 'https://olake.io';
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
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" />
          </svg>
        )
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
      <nav 
        className="flex" 
        aria-label="Breadcrumb"
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        <ol className="flex items-center space-x-2 text-sm">
          {customItems.map((item, index) => (
            <li 
              key={index} 
              className="flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
              
              {item.href ? (
                <>
                  <Link
                    to={item.href}
                    className="flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    itemProp="item"
                  >
                    <span className="flex items-center">
                      {item.icon && <span className="mr-1 text-gray-900 dark:text-gray-100">{item.icon}</span>}
                      {index === 0 ? "Home" : item.label}
                    </span>
                  </Link>
                  <meta itemProp="name" content={index === 0 ? "Home" : item.label} />
                </>
              ) : (
                <>
                  <span 
                    className="flex items-center text-gray-900 dark:text-gray-100 font-medium"
                  >
                    {item.icon && <span className="mr-1 text-gray-900 dark:text-gray-100">{item.icon}</span>}
                    {index === 0 ? "Home" : item.label}
                  </span>
                  <meta itemProp="name" content={index === 0 ? "Home" : item.label} />
                </>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  // For other pages, use the default breadcrumbs
  return <DocBreadcrumbs {...props} />;
}
