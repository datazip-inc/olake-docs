// components/Iceberg/IcebergQueryEngines.tsx
import React, { useState, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { QueryEngine, FilterOptions, ViewType } from '../../types/iceberg';
import { QUERY_ENGINES } from '../../data/query-engines';
import { LAYOUT } from '../../data/constants/ui';
import FilterControls from './FilterControls';
import ViewTabs from './ViewTabs';
import TableView from './TableView';
import CardView from './CardView';
import FeatureView from './FeatureView';

const IcebergQueryEngines: React.FC = () => {
  const [viewType, setViewType] = useState<ViewType>('table');
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    category: 'all'
  });

  // Filtered engines
  const filteredEngines = useMemo(() => {
    if (!QUERY_ENGINES || QUERY_ENGINES.length === 0) {
      return [];
    }

    return QUERY_ENGINES.filter(engine => {
      // Search term filter
      if (filters.searchTerm && !engine.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (filters.category !== 'all' && engine.category !== filters.category) {
        return false;
      }
      
      return true;
    });
  }, [filters]);

  // JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Apache Iceberg Query Engine Support Matrix",
    "description": "Comprehensive comparison of query engines supporting Apache Iceberg table format",
    "author": {
      "@type": "Organization",
      "name": "Olake.io"
    },
    "datePublished": new Date().toISOString(),
    "about": {
      "@type": "SoftwareApplication",
      "name": "Apache Iceberg",
      "applicationCategory": "Data Lake Technology"
    }
  };

  const renderContent = () => {
    switch (viewType) {
      case 'table':
        return <TableView engines={filteredEngines} />;
      case 'cards':
        return <CardView engines={filteredEngines} />;
      case 'features':
        return <FeatureView engines={filteredEngines} />;
      default:
        return <TableView engines={filteredEngines} />;
    }
  };

  // Show loading state if no engines are loaded
  if (!QUERY_ENGINES || QUERY_ENGINES.length === 0) {
    return (
      <div className={LAYOUT.CONTAINER}>
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Loading Query Engines...
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Please ensure the query engine data files are properly configured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className={LAYOUT.CONTAINER}>
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Apache Iceberg Query Engine Support Matrix
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Comprehensive comparison of {QUERY_ENGINES.length} query engines supporting Apache Iceberg table format with detailed feature analysis
          </p>
        </div>

        {/* Filter Controls */}
        <FilterControls
          filters={filters}
          onFiltersChange={setFilters}
          resultsCount={filteredEngines.length}
          totalCount={QUERY_ENGINES.length}
        />

        {/* View Tabs */}
        <div className="mb-8">
          <ViewTabs 
            activeView={viewType} 
            onViewChange={setViewType} 
          />
        </div>

        {/* Content */}
        <div className="transition-all duration-500 ease-in-out max-w-4xl mx-auto">
          {renderContent()}
        </div>

        {/* No Results */}
        {filteredEngines.length === 0 && QUERY_ENGINES.length > 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 w-full">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No engines found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                No query engines match your current filter criteria. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => setFilters({
                  searchTerm: '',
                  category: 'all'
                })}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default IcebergQueryEngines;