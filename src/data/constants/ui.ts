// data/constants/ui.ts
export const LAYOUT = {
    CONTAINER: "w-full p-4 sm:p-6 lg:p-8",
    CARD_GRID: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full",
    FEATURE_GRID: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
  } as const;
  
  export const ANIMATIONS = {
    CARD_HOVER: "group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-600",
    TABLE_ROW_HOVER: "group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30 transition-all duration-200 cursor-pointer",
    ICON_HOVER: "group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors"
  } as const;
  
  export const STYLES = {
    GRADIENT_HEADER: "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800",
    ROUNDED_CONTAINER: "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700",
    INPUT_FIELD: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    SEARCH_INPUT: "w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
  } as const;
  
  export const VIEW_TYPES = {
    TABLE: 'table',
    CARDS: 'cards', 
    FEATURES: 'features'
  } as const;
  
  export const TOOLTIP = {
    CONTAINER: "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 max-w-xs",
    ARROW: "absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"
  } as const;