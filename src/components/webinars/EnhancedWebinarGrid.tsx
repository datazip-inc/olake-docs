// components/webinars/EnhancedWebinarGrid.tsx
import React from 'react';
import clsx from 'clsx';
import EnhancedWebinarCard from './EnhancedWebinarCard';

interface WebinarData {
  title: string;
  subtitle: string;
  route: string;
  img: string;
  alt: string;
  status: 'upcoming' | 'live' | 'archived' | 'featured';
  date: string;
  duration?: string;
  attendees?: number;
  speakers?: string[];
  category?: 'webinar' | 'meetup' | 'event' | 'workshop';
}

interface EnhancedWebinarGridProps {
  webinars: WebinarData[];
  columns?: {
    mobile?: 1 | 2;
    tablet?: 1 | 2 | 3;
    desktop?: 1 | 2 | 3 | 4;
  };
  gap?: 'small' | 'medium' | 'large';
  layout?: 'default' | 'masonry' | 'featured-first' | 'compact';
  showEmptyState?: boolean;
  maxItems?: number;
  sortBy?: 'date' | 'status' | 'title' | 'none';
  filterBy?: {
    status?: string[];
    category?: string[];
  };
  className?: string;
}

const gapClasses = {
  small: 'gap-4',
  medium: 'gap-6',
  large: 'gap-8'
};

const getGridColumns = (columns: any) => {
  const mobile = columns?.mobile || 1;
  const tablet = columns?.tablet || 2;
  const desktop = columns?.desktop || 3;

  return clsx(
    `grid-cols-${mobile}`,
    `sm:grid-cols-${tablet}`,
    `lg:grid-cols-${desktop}`
  );
};

const EmptyState: React.FC<{ message?: string }> = ({ message = "No events available" }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
      {message}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 max-w-md">
      Check back soon for upcoming events and webinars
    </p>
  </div>
);

const EnhancedWebinarGrid: React.FC<EnhancedWebinarGridProps> = ({
  webinars: initialWebinars,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'medium',
  layout = 'default',
  showEmptyState = true,
  maxItems,
  sortBy = 'none',
  filterBy,
  className
}) => {
  // Filter webinars
  let filteredWebinars = [...initialWebinars];

  if (filterBy?.status && filterBy.status.length > 0) {
    filteredWebinars = filteredWebinars.filter(webinar => 
      filterBy.status!.includes(webinar.status)
    );
  }

  if (filterBy?.category && filterBy.category.length > 0) {
    filteredWebinars = filteredWebinars.filter(webinar => 
      filterBy.category!.includes(webinar.category || 'webinar')
    );
  }

  // Sort webinars
  if (sortBy !== 'none') {
    filteredWebinars.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'status':
          const statusOrder = { live: 0, upcoming: 1, featured: 2, archived: 3 };
          return statusOrder[a.status] - statusOrder[b.status];
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }

  // Limit items if specified
  if (maxItems) {
    filteredWebinars = filteredWebinars.slice(0, maxItems);
  }

  // Handle different layouts
  const renderGrid = () => {
    if (layout === 'featured-first' && filteredWebinars.length > 0) {
      const featured = filteredWebinars.find(w => w.status === 'featured') || filteredWebinars[0];
      const others = filteredWebinars.filter(w => w !== featured);

      return (
        <div className="space-y-8">
          {/* Featured Item */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <EnhancedWebinarCard
              {...featured}
              variant="featured"
              className="lg:col-span-2"
            />
          </div>
          
          {/* Other Items */}
          {others.length > 0 && (
            <div className={clsx(
              'grid',
              getGridColumns(columns),
              gapClasses[gap]
            )}>
              {others.map((webinar, index) => (
                <EnhancedWebinarCard
                  key={`${webinar.route}-${index}`}
                  {...webinar}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    if (layout === 'compact') {
      return (
        <div className="space-y-4">
          {filteredWebinars.map((webinar, index) => (
            <EnhancedWebinarCard
              key={`${webinar.route}-${index}`}
              {...webinar}
              variant="compact"
            />
          ))}
        </div>
      );
    }

    // Default grid layout
    return (
      <div className={clsx(
        'grid',
        getGridColumns(columns),
        gapClasses[gap]
      )}>
        {filteredWebinars.map((webinar, index) => (
          <EnhancedWebinarCard
            key={`${webinar.route}-${index}`}
            {...webinar}
          />
        ))}
      </div>
    );
  };

  if (filteredWebinars.length === 0 && showEmptyState) {
    return (
      <div className={clsx('grid grid-cols-1', className)}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className={className}>
      {renderGrid()}
    </div>
  );
};

export default EnhancedWebinarGrid;