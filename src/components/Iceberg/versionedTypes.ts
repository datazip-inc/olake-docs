import { EngineVersion, QueryEngine } from '../../types/iceberg';

export interface ResolvedEngineView {
  key: string;
  id: string;
  name: string;
  baseName: string;
  category: QueryEngine['category'];
  website: string;
  documentation: string;
  quickStart: string;
  bestPractices: string[];
  version: EngineVersion;
  features: QueryEngine['features'];
  description: string;
  score: number | null;
}
