// components/Iceberg/CardView.tsx
import React from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { QueryEngine } from '../../types/iceberg';
import { FEATURE_NAMES, SUPPORT_WEIGHTS } from '../../data/constants/features';
import { SUPPORT_BADGE_STYLES } from '../../data/constants/supportLevels';
import { LAYOUT, ANIMATIONS } from '../../data/constants/ui';
import SupportIcon from './SupportIcon';
import CategoryBadge from './CategoryBadge';
import { ResolvedEngineView } from './versionedTypes';
import { buildEngineDetailUrl } from './versionState';

interface CardViewProps {
  engines: QueryEngine[];
  resolvedEngines: ResolvedEngineView[];
  versionMode: 'v2' | 'v3';
  onQuickCompare: (engineName: string) => void;
}

const CardView: React.FC<CardViewProps> = ({ engines, resolvedEngines, versionMode, onQuickCompare }) => {
  const calculateSupportScore = (features: QueryEngine['features']): number => {
    return Object.values(features).reduce(
      (score, feature) => score + SUPPORT_WEIGHTS[feature.support], 0
    );
  };

  const handleEngineClick = (engineId: string) => {
    window.open(buildEngineDetailUrl(engineId, versionMode), '_blank');
  };

  return (
    <div className={LAYOUT.CARD_GRID}>
      {engines.map((engine) => {
        const engineVersions = resolvedEngines.filter((item) => item.id === engine.id);
        const visibleVersions = engineVersions.filter((item) => item.version === versionMode);

        return (
        <div
          key={engine.id}
          className={ANIMATIONS.CARD_HOVER}
          onClick={() => handleEngineClick(engine.id)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="min-w-0 flex-1">
                <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${ANIMATIONS.ICON_HOVER} line-clamp-1`}>
                  {engine.name}
                </h3>
                <div className="mt-2">
                  <CategoryBadge category={engine.category} />
                </div>
              </div>
            </div>
            <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
          
          {visibleVersions.map((entry) => (
            <div key={entry.key} className={`mb-3 p-2.5 rounded-lg border ${entry.version === 'v2' ? 'bg-gray-50 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700' : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'}`}>
              <div className="mb-2">
                <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${entry.version === 'v2' ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100' : 'bg-blue-200 text-blue-900 dark:bg-blue-900/40 dark:text-blue-100'}`}>
                  {entry.version.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                {entry.description || 'N/A'}
              </p>
              <div className="space-y-2">
                {Object.entries(entry.features).slice(0, 4).map(([key, feature]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {FEATURE_NAMES[key as keyof QueryEngine['features']]}
                    </span>
                    <div className="flex items-center space-x-2">
                      <SupportIcon level={feature?.support ?? 'none'} />
                      <span className={SUPPORT_BADGE_STYLES[feature?.support ?? 'none']}>
                        {feature?.support ?? 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-right text-xs text-gray-500 dark:text-gray-400">
                Score: {entry.score ?? calculateSupportScore(entry.features)}/32
              </div>
            </div>
          ))}

          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Compare</span>
            <button
              onClick={(event) => {
                event.stopPropagation();
                onQuickCompare(engine.name);
              }}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 border-none cursor-pointer"
            >
              Add to Compare
            </button>
          </div>
        </div>
      )})}
    </div>
  );
};

export default CardView;