// data/constants/supportLevels.ts
import { SupportLevel } from '../../types/iceberg';

export const SUPPORT_BADGE_STYLES: Record<SupportLevel, string> = {
  full: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  partial: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  preview: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  none: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
};

export const SUPPORT_ICON_COLORS: Record<SupportLevel, string> = {
  full: "w-5 h-5 text-emerald-600 dark:text-emerald-400",
  partial: "w-5 h-5 text-amber-600 dark:text-amber-400", 
  preview: "w-5 h-5 text-blue-600 dark:text-blue-400",
  none: "w-5 h-5 text-red-500 dark:text-red-400"
};