// components/Iceberg/CardView.tsx
import React from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { QueryEngine } from '../../types/iceberg';
import { FEATURE_NAMES, SUPPORT_WEIGHTS } from '../../data/constants/features';
import { SUPPORT_BADGE_STYLES } from '../../data/constants/supportLevels';
import { LAYOUT, ANIMATIONS } from '../../data/constants/ui';
import SupportIcon from './SupportIcon';
import CategoryBadge from './CategoryBadge';

interface CardViewProps {
  engines: QueryEngine[];
}

const CardView: React.FC<CardViewProps> = ({ engines }) => {
  const calculateSupportScore = (engine: QueryEngine): number => {
    return Object.values(engine.features).reduce(
      (score, feature) => score + SUPPORT_WEIGHTS[feature.support], 0
    );
  };

  const handleEngineClick = (engineId: string) => {
    window.open(`/iceberg/query-engine/${engineId}`, '_blank');
  };

  return (
    <div className={LAYOUT.CARD_GRID}>
      {engines.map((engine) => (
        <div
          key={engine.id}
          className={ANIMATIONS.CARD_HOVER}
          onClick={() => handleEngineClick(engine.id)}
        >
          <div className="flex items-start justify-between mb-4">
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
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
            {engine.description}
          </p>
          
          <div className="space-y-3 mb-4">
            {Object.entries(engine.features).slice(0, 4).map(([key, feature]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {FEATURE_NAMES[key as keyof QueryEngine['features']]}
                </span>
                <div className="flex items-center space-x-2">
                  <SupportIcon level={feature.support} />
                  <span className={SUPPORT_BADGE_STYLES[feature.support]}>
                    {feature.support}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Support Score</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {calculateSupportScore(engine)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">/32</span>
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(calculateSupportScore(engine) / 32) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardView;