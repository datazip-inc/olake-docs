// types/iceberg.ts
export type SupportLevel = 'full' | 'partial' | 'preview' | 'none' | string;

export interface ExternalLink {
  label: string;
  url: string;
}

export interface Feature {
  support: SupportLevel;
  details: string;
  externalLinks?: ExternalLink[];
}

export type EngineVersion = 'v2' | 'v3';

export interface EngineVersionData {
  features: QueryEngine['features'];
  score?: number | null;
  description?: string | null;
}

export interface QueryEngine {
  id: string;
  name: string;
  description: string;
  category: 'general-purpose' | 'streaming' | 'analytics' | 'cloud-native' | 'embedded' | string;
  website: string;
  documentation: string;
  features: {
    catalogs: Feature;
    readWrite: Feature;
    dml: Feature;
    morCow: Feature;
    streaming: Feature;
    formatV3: Feature;
    timeTravel: Feature;
    security: Feature;
  };
  versions: {
    v2?: EngineVersionData | null;
    v3?: EngineVersionData | null;
  };
  quickStart: string;
  bestPractices: string[];
}

export interface FilterOptions {
  searchTerm: string;
  category: QueryEngine['category'] | 'all';
}

export type ViewType = 'table' | 'cards' | 'features';

export interface EngineVersionSelection {
  engine: string;
  version: EngineVersion;
}

export type VersionMode = 'v2' | 'v3';