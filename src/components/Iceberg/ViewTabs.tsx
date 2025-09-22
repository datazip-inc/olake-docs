import React, { useState, useRef, useLayoutEffect } from 'react'
import { TableCellsIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline'
import { ViewType } from '../../types/iceberg'
import { VIEW_TYPES } from '../../data/constants/ui'

interface ViewTabsProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  disabled?: boolean;
}

// Define the 'tabs' array outside the component.
// This ensures it is only created once and its reference remains stable
// across re-renders, preventing an infinite loop in the useLayoutEffect.
const tabs = [
  { id: VIEW_TYPES.TABLE, label: 'Table', icon: TableCellsIcon, shortLabel: 'Table' },
  { id: VIEW_TYPES.CARDS, label: 'Cards', icon: Squares2X2Icon, shortLabel: 'Cards' },
  { id: VIEW_TYPES.FEATURES, label: 'Features', icon: ListBulletIcon, shortLabel: 'Features' }
];

/**
 * A visually enhanced tab component for switching between different views.
 * Features a modern, cohesive design with a smooth, animated indicator
 * that slides between selected tabs, responsive design for all screen sizes,
 * and support for disabled state during comparison mode.
 */
const ViewTabs: React.FC<ViewTabsProps> = ({ activeView, onViewChange, disabled = false }) => {
  // Refs to hold the DOM elements of the tabs for positioning the indicator
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  // State to hold the dynamic style for the animated indicator
  const [indicatorStyle, setIndicatorStyle] = useState({});

  // useLayoutEffect ensures that the indicator style is calculated
  // after the layout has been painted, preventing any flicker on load.
  useLayoutEffect(() => {
    if (disabled) return; // Don't update indicator when disabled
    
    const activeTabIndex = tabs.findIndex((tab) => tab.id === activeView);
    const activeTabNode = tabsRef.current[activeTabIndex];

    if (activeTabNode) {
      // Set the position and width of the indicator based on the active tab's dimensions
      setIndicatorStyle({
        left: activeTabNode.offsetLeft,
        width: activeTabNode.clientWidth,
      });
    }
  }, [activeView, disabled]);

  const handleTabClick = (viewType: ViewType) => {
    if (!disabled) {
      onViewChange(viewType);
    }
  }

  return (
    <div className="w-full">
      {/* Desktop/Tablet View */}
      <div className="hidden sm:block">
        <div className={`
          relative flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1  border-none dark:border-gray-700
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}>
          {/* Animated background indicator */}
          {!disabled && (
            <div
              className="absolute top-1 bottom-1 bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-all duration-300 ease-out border border-gray-200 dark:border-gray-600"
              style={indicatorStyle}
            />
          )}

          {/* Tab buttons */}
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeView;

            return (
              <button
                key={tab.id}
                ref={(el) => (tabsRef.current[index] = el)}
                onClick={() => handleTabClick(tab.id as ViewType)}
                disabled={disabled}
                className={`
                  relative z-10 flex items-center justify-center space-x-2 px-6 py-3 text-sm font-medium border-none bg-gray-200 dark:bg-slate-700 rounded-lg transition-all duration-200 flex-1 cursor-pointer
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-800
                  ${disabled 
                    ? 'cursor-not-allowed' 
                    : isActive
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }
                  ${!disabled && 'hover:bg-white/50 dark:hover:bg-gray-700/50'}
                `}
                aria-pressed={isActive}
                aria-label={`Switch to ${tab.label} view`}
              >
                <Icon className={`w-4 h-4 ${disabled ? '' : 'transition-transform group-hover:scale-110'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div className={`
          relative flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}>
          {/* Animated background indicator for mobile */}
          {!disabled && (
            <div
              className="absolute top-1 bottom-1 bg-white dark:bg-gray-700 rounded-md shadow-sm transition-all duration-300 ease-out border border-gray-200 dark:border-gray-600"
              style={indicatorStyle}
            />
          )}

          {/* Mobile tab buttons (icon only) */}
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeView;

            return (
              <button
                key={tab.id}
                ref={(el) => (tabsRef.current[index] = el)}
                onClick={() => handleTabClick(tab.id as ViewType)}
                disabled={disabled}
                className={`
                  relative z-10 flex items-center justify-center p-3 text-sm font-medium rounded-md transition-all duration-200 flex-1
                  ${disabled 
                    ? 'cursor-not-allowed' 
                    : isActive
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }
                  ${!disabled && 'hover:bg-white/50 dark:hover:bg-gray-700/50'}
                `}
                aria-pressed={isActive}
                aria-label={`Switch to ${tab.label} view`}
                title={tab.label}
              >
                <Icon className={`w-5 h-5 ${disabled ? '' : 'transition-transform hover:scale-110'}`} />
              </button>
            );
          })}
        </div>

        {/* Mobile label indicator */}
        {!disabled && (
          <div className="mt-2 text-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {tabs.find(tab => tab.id === activeView)?.label} View
            </span>
          </div>
        )}
      </div>

      {/* Disabled state message */}
      {disabled && (
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            View switching disabled in comparison mode
          </span>
        </div>
      )}
    </div>
  );
};

export default ViewTabs;