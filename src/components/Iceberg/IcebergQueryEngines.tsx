// // components/Iceberg/IcebergQueryEngines.tsx
// import React, { useState, useMemo } from 'react';
// import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// import { QueryEngine, FilterOptions, ViewType } from '../../types/iceberg';
// import { QUERY_ENGINES } from '../../data/query-engines';
// import { LAYOUT } from '../../data/constants/ui';
// import FilterControls from './FilterControls';
// import ViewTabs from './ViewTabs';
// import TableView from './TableView';
// import CardView from './CardView';
// import FeatureView from './FeatureView';

// const IcebergQueryEngines: React.FC = () => {
//   const [viewType, setViewType] = useState<ViewType>('table');
//   const [filters, setFilters] = useState<FilterOptions>({
//     searchTerm: '',
//     category: 'all'
//   });

//   // Filtered engines
//   const filteredEngines = useMemo(() => {
//     if (!QUERY_ENGINES || QUERY_ENGINES.length === 0) {
//       return [];
//     }

//     return QUERY_ENGINES.filter(engine => {
//       // Search term filter
//       if (filters.searchTerm && !engine.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
//         return false;
//       }
      
//       // Category filter
//       if (filters.category !== 'all' && engine.category !== filters.category) {
//         return false;
//       }
      
//       return true;
//     });
//   }, [filters]);

//   // JSON-LD structured data for SEO
//   const structuredData = {
//     "@context": "https://schema.org",
//     "@type": "Article",
//     "headline": "Apache Iceberg Query Engine Support Matrix",
//     "description": "Comprehensive comparison of query engines supporting Apache Iceberg table format",
//     "author": {
//       "@type": "Organization",
//       "name": "Olake.io"
//     },
//     "datePublished": new Date().toISOString(),
//     "about": {
//       "@type": "SoftwareApplication",
//       "name": "Apache Iceberg",
//       "applicationCategory": "Data Lake Technology"
//     }
//   };

//   const renderContent = () => {
//     switch (viewType) {
//       case 'table':
//         return <TableView engines={filteredEngines} />;
//       case 'cards':
//         return <CardView engines={filteredEngines} />;
//       case 'features':
//         return <FeatureView engines={filteredEngines} />;
//       default:
//         return <TableView engines={filteredEngines} />;
//     }
//   };

//   // Show loading state if no engines are loaded
//   if (!QUERY_ENGINES || QUERY_ENGINES.length === 0) {
//     return (
//       <div className={LAYOUT.CONTAINER}>
//         <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
//             Loading Query Engines...
//           </h3>
//           <p className="text-gray-500 dark:text-gray-400">
//             Please ensure the query engine data files are properly configured.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* SEO structured data */}
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
//       />
      
//       <div className={LAYOUT.CONTAINER}>
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
//             Apache Iceberg Query Engine Support Matrix
//           </h1>
//           <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
//             Comprehensive comparison of {QUERY_ENGINES.length} query engines supporting Apache Iceberg table format with detailed feature analysis
//           </p>
//         </div>

//         {/* Filter Controls */}
//         <FilterControls
//           filters={filters}
//           onFiltersChange={setFilters}
//           resultsCount={filteredEngines.length}
//           totalCount={QUERY_ENGINES.length}
//         />

//         {/* View Tabs */}
//         <div className="mb-8">
//           <ViewTabs 
//             activeView={viewType} 
//             onViewChange={setViewType} 
//           />
//         </div>

//         {/* Content */}
//         <div className="transition-all duration-500 ease-in-out max-w-4xl mx-auto">
//           {renderContent()}
//         </div>

//         {/* No Results */}
//         {filteredEngines.length === 0 && QUERY_ENGINES.length > 0 && (
//           <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 w-full">
//             <div className="max-w-md mx-auto">
//               <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
//                 No engines found
//               </h3>
//               <p className="text-gray-500 dark:text-gray-400 mb-6">
//                 No query engines match your current filter criteria. Try adjusting your filters or search terms.
//               </p>
//               <button
//                 onClick={() => setFilters({
//                   searchTerm: '',
//                   category: 'all'
//                 })}
//                 className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Clear All Filters
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default IcebergQueryEngines;

// components/Iceberg/IcebergQueryEngines.tsx
import React, { useState, useMemo } from 'react';
import { 
  MagnifyingGlassIcon, 
  ScaleIcon,
  ChartBarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { QueryEngine, FilterOptions, ViewType } from '../../types/iceberg';
import { QUERY_ENGINES } from '../../data/query-engines';
import FilterControls from './FilterControls';
import ViewTabs from './ViewTabs';
import TableView from './TableView';
import CardView from './CardView';
import FeatureView from './FeatureView';
import ComparisonView from './ComparisonView';

interface IcebergQueryEnginesProps {
  fullWidth?: boolean;
  showComparison?: boolean;
  maxEngines?: number;
  defaultView?: ViewType;
}

const IcebergQueryEngines: React.FC<IcebergQueryEnginesProps> = ({ 
  fullWidth = true,
  showComparison = true,
  maxEngines,
  defaultView = 'table'
}) => {
  const [viewType, setViewType] = useState<ViewType>(defaultView);
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [selectedEngines, setSelectedEngines] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    category: 'all'
  });

  // Filtered engines
  const filteredEngines = useMemo(() => {
    if (!QUERY_ENGINES || QUERY_ENGINES.length === 0) {
      return [];
    }

    let engines = QUERY_ENGINES.filter(engine => {
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

    // Apply max engines limit if specified
    if (maxEngines && engines.length > maxEngines) {
      engines = engines.slice(0, maxEngines);
    }

    return engines;
  }, [filters, maxEngines]);

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

  const handleEngineSelection = (engineId: string, selected: boolean) => {
    setSelectedEngines(prev => 
      selected 
        ? [...prev, engineId]
        : prev.filter(id => id !== engineId)
    );
  };

  const toggleComparisonMode = () => {
    setIsComparisonMode(!isComparisonMode);
    setSelectedEngines([]);
  };

  const renderContent = () => {
    if (isComparisonMode) {
      return (
        <ComparisonView 
          engines={filteredEngines}
          selectedEngines={selectedEngines}
          onEngineSelect={handleEngineSelection}
        />
      );
    }

    switch (viewType) {
      case 'table':
        return (
          <TableView 
            engines={filteredEngines} 
            fullWidth={fullWidth}
            selectionMode={isComparisonMode}
            selectedEngines={selectedEngines}
            onEngineSelect={handleEngineSelection}
          />
        );
      case 'cards':
        return (
          <CardView 
            engines={filteredEngines}
            selectionMode={isComparisonMode}
            selectedEngines={selectedEngines}
            onEngineSelect={handleEngineSelection}
          />
        );
      case 'features':
        return (
          <FeatureView 
            engines={filteredEngines}
            selectionMode={isComparisonMode}
            selectedEngines={selectedEngines}
            onEngineSelect={handleEngineSelection}
          />
        );
      default:
        return (
          <TableView 
            engines={filteredEngines} 
            fullWidth={fullWidth}
          />
        );
    }
  };

  // Show loading state if no engines are loaded
  if (!QUERY_ENGINES || QUERY_ENGINES.length === 0) {
    return (
      <div className={`w-full ${fullWidth ? '' : 'max-w-4xl mx-auto'} p-4 sm:p-6 lg:p-8`}>
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
      
      <div className={`w-full ${fullWidth ? '' : 'max-w-4xl mx-auto'} p-4 sm:p-6 lg:p-8`}>
        {/* Enhanced Header with Stats */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Apache Iceberg Query Engine Support Matrix
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
            Comprehensive comparison of {QUERY_ENGINES.length} query engines supporting Apache Iceberg table format with detailed feature analysis
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredEngines.length} of {QUERY_ENGINES.length} engines
                </span>
              </div>
            </div>
            
            {isComparisonMode && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-4 py-2 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center space-x-2">
                  <ScaleIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    {selectedEngines.length} selected for comparison
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Filter Controls */}
        <div className="mb-6">
          <FilterControls
            filters={filters}
            onFiltersChange={setFilters}
            resultsCount={filteredEngines.length}
            totalCount={QUERY_ENGINES.length}
          />
        </div>

        {/* View Controls with Comparison Toggle */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <ViewTabs 
              activeView={viewType} 
              onViewChange={setViewType}
              disabled={isComparisonMode}
            />
            
            {showComparison && (
              <button
                onClick={toggleComparisonMode}
                className={`
                  inline-flex items-center px-4 py-2 rounded-lg border font-medium transition-all duration-200
                  ${isComparisonMode 
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
              >
                <ScaleIcon className="w-4 h-4 mr-2" />
                {isComparisonMode ? 'Exit Comparison' : 'Compare Engines'}
              </button>
            )}
          </div>

          {isComparisonMode && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <div className="flex items-start space-x-3">
                <FunnelIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Comparison Mode Active
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Select engines from the list below to compare their features side-by-side. 
                    You can select up to 4 engines for detailed comparison.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="transition-all duration-500 ease-in-out">
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