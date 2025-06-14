// types/iceberg.ts
export type SupportLevel = 'full' | 'partial' | 'preview' | 'none';

export interface ExternalLink {
  label: string;
  url: string;
}

export interface Feature {
  support: SupportLevel;
  details: string;
  externalLinks?: ExternalLink[];
}

export interface QueryEngine {
  id: string;
  name: string;
  description: string;
  category: 'general-purpose' | 'streaming' | 'analytics' | 'cloud-native' | 'embedded';
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
  quickStart: string;
  bestPractices: string[];
}

export interface FilterOptions {
  searchTerm: string;
  category: QueryEngine['category'] | 'all';
}

export type ViewType = 'table' | 'cards' | 'features';