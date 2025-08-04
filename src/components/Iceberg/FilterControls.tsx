// components/Iceberg/FilterControls.tsx
import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { FilterOptions } from '../../types/iceberg';
import { CATEGORY_OPTIONS } from '../../data/constants/categories';
import { STYLES } from '../../data/constants/ui';

interface FilterControlsProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  resultsCount: number;
  totalCount: number;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFiltersChange,
  resultsCount,
  totalCount
}) => {
  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm });
  };

  const handleCategoryChange = (category: FilterOptions['category']) => {
    onFiltersChange({ ...filters, category });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      category: 'all'
    });
  };

  return (
    <div className={`${STYLES.ROUNDED_CONTAINER} p-6 mb-8`}>
      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search Input */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute  left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search query engines..."
            className={STYLES.SEARCH_INPUT}
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        
        {/* Category Filter */}
        <div className="sm:w-64">
          <select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value as FilterOptions['category'])}
            className={STYLES.INPUT_FIELD}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count and Clear Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Showing <span className="font-bold text-gray-900 dark:text-gray-100">{resultsCount}</span> of{' '}
            <span className="font-bold text-gray-900 dark:text-gray-100">{totalCount}</span> engines
          </span>
          
          {(filters.searchTerm || filters.category !== 'all') && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors border-none rounded-lg px-3 py-1.5 mouse-hover:bg-blue-50 dark:mouse-hover:bg-blue-900 cursor-pointer"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' } /* Tailwind's bg-blue-100 */ }
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterControls;