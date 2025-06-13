// data/constants/features.ts
import { QueryEngine } from '../../types/iceberg';

export const FEATURE_NAMES: Record<keyof QueryEngine['features'], string> = {
  catalogs: 'Catalog Support',
  readWrite: 'Read/Write',
  dml: 'DML Operations',
  morCow: 'MoR/CoW',
  streaming: 'Streaming',
  formatV3: 'Format V3',
  timeTravel: 'Time Travel',
  security: 'Security'
};

export const FEATURE_SHORT_NAMES: Record<keyof QueryEngine['features'], string> = {
  catalogs: 'Catalogs',
  readWrite: 'R/W',
  dml: 'DML',
  morCow: 'MoR/CoW',
  streaming: 'Stream',
  formatV3: 'V3',
  timeTravel: 'Time Travel',
  security: 'Security'
};

export const FEATURE_FOCUS_LIST: (keyof QueryEngine['features'])[] = [
  'catalogs',
  'dml', 
  'streaming',
  'formatV3'
];

export const SUPPORT_WEIGHTS = {
  full: 4,
  partial: 2,
  preview: 1,
  none: 0
} as const;