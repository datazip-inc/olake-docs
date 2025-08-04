// data/constants/categories.ts
import { QueryEngine } from '../../types/iceberg';

export const CATEGORY_STYLES = {
  'general-purpose': "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  'streaming': "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  'analytics': "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  'cloud-native': "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  'embedded': "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
} as const;

export const CATEGORY_LABELS: Record<QueryEngine['category'], string> = {
  'general-purpose': 'General Purpose',
  'streaming': 'Streaming',
  'analytics': 'Analytics', 
  'cloud-native': 'Cloud Native',
  'embedded': 'Embedded'
};

export const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'general-purpose', label: 'General Purpose' },
  { value: 'streaming', label: 'Streaming' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'cloud-native', label: 'Cloud Native' },
  { value: 'embedded', label: 'Embedded' }
] as const;