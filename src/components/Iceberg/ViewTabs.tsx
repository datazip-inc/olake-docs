// // components/Iceberg/ViewTabs.tsx
// import React, { useState, useRef, useLayoutEffect } from 'react';
// import {
//   TableCellsIcon,
//   Squares2X2Icon,
//   ListBulletIcon
// } from '@heroicons/react/24/outline';
// import { ViewType } from '../../types/iceberg';
// import { VIEW_TYPES } from '../../data/constants/ui';

// interface ViewTabsProps {
//   activeView: ViewType;
//   onViewChange: (view: ViewType) => void;
// }

// // FIX: Define the 'tabs' array outside the component.
// // This ensures it is only created once and its reference remains stable
// // across re-renders, preventing an infinite loop in the useLayoutEffect.
// const tabs = [
//   { id: VIEW_TYPES.TABLE, label: 'Table', icon: TableCellsIcon },
//   { id: VIEW_TYPES.CARDS, label: 'Cards', icon: Squares2X2Icon },
//   { id: VIEW_TYPES.FEATURES, label: 'Features', icon: ListBulletIcon }
// ];

// /**
//  * A visually enhanced tab component for switching between different views.
//  * Features a modern, cohesive design with a smooth, animated indicator
//  * that slides between selected tabs, and spans the full width of its container.
//  */
// const ViewTabs: React.FC<ViewTabsProps> = ({ activeView, onViewChange }) => {
//   // Refs to hold the DOM elements of the tabs for positioning the indicator
//   const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
//   // State to hold the dynamic style for the animated indicator
//   const [indicatorStyle, setIndicatorStyle] = useState({});

//   // useLayoutEffect ensures that the indicator style is calculated
//   // after the layout has been painted, preventing any flicker on load.
//   useLayoutEffect(() => {
//     const activeTabIndex = tabs.findIndex((tab) => tab.id === activeView);
//     const activeTabNode = tabsRef.current[activeTabIndex];

//     if (activeTabNode) {
//       // Set the position and width of the indicator based on the active tab's dimensions
//       setIndicatorStyle({
//         left: activeTabNode.offsetLeft,
//         width: activeTabNode.clientWidth,
//       });
//     }
//     // Re-calculate whenever the active view changes. The 'tabs' dependency is now stable.
//   }, [activeView]); // FIX: Removed 'tabs' from dependencies as it's now a stable constant.

//   return (
//     <div className="w-full">
//       {/* Main container for the tabs, styled as a single cohesive unit */}
//       <div className="relative flex w-full items-center bg-gray-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-gray-200 dark:border-zinc-700">
        
//         {/* The animated "pill" that slides to highlight the active tab */}
//         <span
//           className="absolute h-[calc(100%-0.5rem)] rounded-lg bg-white dark:bg-zinc-700 shadow-sm transition-all duration-300 ease-in-out"
//           style={indicatorStyle}
//         />

//         {/* Navigation container for the tab buttons, distributed evenly */}
//         <nav className="flex w-full items-center justify-around">
//           {tabs.map((tab, index) => {
//             const Icon = tab.icon;
//             const isActive = activeView === tab.id;

//             return (
//               <button
//                 key={tab.id}
//                 // Store the ref for each button to calculate its position
//                 ref={(el) => (tabsRef.current[index] = el)}
//                 onClick={() => onViewChange(tab.id as ViewType)}
//                 // Dynamic styling for each tab button (active vs. inactive)
//                 className={`
//                   relative z-10 flex flex-1 items-center justify-center gap-2 border-none 
//                   rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-300 
//                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
//                   ${
//                     isActive
//                       ? 'text-gray-900 dark:text-gray-100' // Active text color
//                       : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200' // Inactive text color
//                   }
//                 `}
//                 aria-current={isActive ? 'page' : undefined}
//               >
//                 <Icon className="w-4 h-4" />
//                 <span>{tab.label}</span>
//               </button>
//             );
//           })}
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default ViewTabs;

// components/Iceberg/ViewTabs.tsx
import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  TableCellsIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';
import { ViewType } from '../../types/iceberg';
import { VIEW_TYPES } from '../../data/constants/ui';

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
  };

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
                  relative z-10 flex items-center justify-center space-x-2 px-6 py-3 text-sm font-medium border-none bg-gray-200 dark:bg-slate-700 rounded-lg transition-all duration-200 flex-1
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