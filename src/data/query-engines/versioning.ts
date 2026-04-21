import { EngineVersionData, QueryEngine } from '../../types/iceberg';
import { SUPPORT_WEIGHTS } from '../constants/features';

type LegacyEngine = Omit<QueryEngine, 'versions'> & {
  versions?: QueryEngine['versions'];
};

const calculateScore = (features: QueryEngine['features']): number =>
  Object.values(features).reduce((sum, feature) => sum + (SUPPORT_WEIGHTS[feature?.support] ?? 0), 0);

const createV2FromFeatures = (features: QueryEngine['features'], engineDescription: string): EngineVersionData => {
  const v2Features: QueryEngine['features'] = {
    ...features,
    formatV3: {
      support: 'none',
      details: 'Iceberg Format V3 features are not applicable to V2 tables.',
      externalLinks: features.formatV3?.externalLinks ?? []
    }
  };

  return {
    features: v2Features,
    score: calculateScore(v2Features),
    description: engineDescription
  };
};

export const createVersionedEngine = (engine: LegacyEngine): QueryEngine => {
  const legacyV3: EngineVersionData = {
    features: engine.features,
    score: calculateScore(engine.features),
    description: engine.description
  };

  const v2 = engine.versions?.v2 ?? createV2FromFeatures(engine.features, engine.description);
  const v3 = engine.versions?.v3 ?? legacyV3;

  return {
    ...engine,
    versions: {
      v2,
      v3
    }
  };
};
