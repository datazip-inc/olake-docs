// data/constants/ui.ts
export const LAYOUT = {
  // Container classes - now supports full-width option
  CONTAINER: "w-full p-4 sm:p-6 lg:p-8",
  CONTAINER_CONSTRAINED: "w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8",
  CONTAINER_WIDE: "w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8",
  CONTAINER_FULL: "w-full p-4 sm:p-6 lg:p-8",
  
  // Grid layouts for different content types
  CARD_GRID: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-6 w-full",
  CARD_GRID_FULL: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 w-full",
  FEATURE_GRID: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full",
  FEATURE_GRID_FULL: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full"
} as const;

export const ANIMATIONS = {
  // Card hover effects
  CARD_HOVER: "group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-600",
  
  // Table row hover effects
  TABLE_ROW_HOVER: "group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30 transition-all duration-200 cursor-pointer",
  
  // Icon hover effects
  ICON_HOVER: "group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors",
  
  // Button hover effects
  BUTTON_HOVER: "transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg",
  
  // Scale hover for interactive elements
  SCALE_HOVER: "transition-transform duration-200 hover:scale-105",
  
  // Fade transitions
  FADE_IN: "transition-opacity duration-300 ease-in-out",
  
  // Loading spinner
  SPIN: "animate-spin",
  
  // Pulse for loading states
  PULSE: "animate-pulse"
} as const;

export const STYLES = {
  // Background gradients
  GRADIENT_HEADER: "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800",
  GRADIENT_BLUE: "bg-gradient-to-r from-blue-600 to-indigo-600",
  GRADIENT_FEATURE: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
  
  // Container styles
  ROUNDED_CONTAINER: "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700",
  ROUNDED_CONTAINER_LARGE: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700",
  
  // Form input styles
  INPUT_FIELD: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
  SEARCH_INPUT: "w-full pl-10 pr-4 py-3 border border-none bg-gray-200 rounded-lg  dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ",
  
  // Button styles
  BUTTON_PRIMARY: "inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors",
  BUTTON_SECONDARY: "inline-flex items-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors",
  BUTTON_OUTLINE: "inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
  
  // Text styles
  TEXT_GRADIENT: "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",
  TEXT_MUTED: "text-gray-600 dark:text-gray-400",
  TEXT_PRIMARY: "text-gray-900 dark:text-gray-100",
  TEXT_SECONDARY: "text-gray-700 dark:text-gray-300"
} as const;

export const VIEW_TYPES = {
  TABLE: 'table',
  CARDS: 'cards', 
  FEATURES: 'features'
} as const;

export const TOOLTIP = {
  // Tooltip container with improved positioning
  CONTAINER: "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 max-w-xs shadow-lg",
  
  // Tooltip arrow
  ARROW: "absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700",
  
  // Tooltip for larger content
  CONTAINER_LARGE: "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-sm shadow-xl"
} as const;

export const BREAKPOINTS = {
  // Responsive breakpoints matching Tailwind CSS
  SM: 640,   // sm: small devices (phones)
  MD: 768,   // md: medium devices (tablets)
  LG: 1024,  // lg: large devices (laptops)
  XL: 1280,  // xl: extra large devices (desktops)
  XXL: 1536  // 2xl: extra extra large devices (large desktops)
} as const;

export const COMPARISON = {
  // Comparison mode specific styles
  SELECTION_BORDER: "border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/30",
  SELECTION_CHECKBOX: "w-5 h-5 rounded border-2 flex items-center justify-center",
  SELECTION_CHECKBOX_CHECKED: "bg-blue-600 border-blue-600",
  SELECTION_CHECKBOX_UNCHECKED: "border-gray-300 dark:border-gray-600",
  
  // Maximum number of engines that can be compared
  MAX_ENGINES: 4,
  
  // Comparison view styles
  COMPARISON_CARD: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-8 border border-blue-200 dark:border-blue-800",
  COMPARISON_TABLE: "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
} as const;

export const SPACING = {
  // Consistent spacing values
  XS: "0.25rem",   // 4px
  SM: "0.5rem",    // 8px
  MD: "1rem",      // 16px
  LG: "1.5rem",    // 24px
  XL: "2rem",      // 32px
  XXL: "3rem",     // 48px
  XXXL: "4rem"     // 64px
} as const;

export const COLORS = {
  // Brand colors
  PRIMARY: "#193ae6",
  PRIMARY_DARK: "#1529b8",
  
  // Support level colors
  SUPPORT_FULL: "text-green-600 dark:text-green-400",
  SUPPORT_PARTIAL: "text-yellow-600 dark:text-yellow-400", 
  SUPPORT_PREVIEW: "text-blue-600 dark:text-blue-400",
  SUPPORT_NONE: "text-gray-400 dark:text-gray-500",
  
  // Category colors
  CATEGORY_GENERAL: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  CATEGORY_STREAMING: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  CATEGORY_ANALYTICS: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  CATEGORY_CLOUD: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  CATEGORY_EMBEDDED: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
} as const;

export const Z_INDEX = {
  // Z-index layers for proper stacking
  DROPDOWN: 10,
  TOOLTIP: 50,
  MODAL: 100,
  NOTIFICATION: 200
} as const;

/**
 * Helper functions for responsive design
 */
export const getContainerClass = (fullWidth: boolean, wide?: boolean): string => {
  if (fullWidth) return LAYOUT.CONTAINER_FULL;
  if (wide) return LAYOUT.CONTAINER_WIDE;
  return LAYOUT.CONTAINER_CONSTRAINED;
};

export const getCardGridClass = (fullWidth: boolean): string => {
  return fullWidth ? LAYOUT.CARD_GRID_FULL : LAYOUT.CARD_GRID;
};

export const getFeatureGridClass = (fullWidth: boolean): string => {
  return fullWidth ? LAYOUT.FEATURE_GRID_FULL : LAYOUT.FEATURE_GRID;
};