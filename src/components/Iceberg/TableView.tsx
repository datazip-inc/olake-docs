// components/Iceberg/TableView.tsx
import React from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { QueryEngine } from '../../types/iceberg';
import { FEATURE_SHORT_NAMES, FEATURE_NAMES, SUPPORT_WEIGHTS } from '../../data/constants/features';
import { SUPPORT_BADGE_STYLES } from '../../data/constants/supportLevels';
import { STYLES, ANIMATIONS, TOOLTIP } from '../../data/constants/ui';
import SupportIcon from './SupportIcon';
import CategoryBadge from './CategoryBadge';

interface TableViewProps {
  engines: QueryEngine[];
}

const TableView: React.FC<TableViewProps> = ({ engines }) => {
  const calculateSupportScore = (engine: QueryEngine): number => {
    return Object.values(engine.features).reduce(
      (score, feature) => score + SUPPORT_WEIGHTS[feature.support], 0
    );
  };

  const handleEngineClick = (engineId: string) => {
    window.open(`/iceberg/query-engine/${engineId}`, '_self');
  };

  // Safety check for empty engines array
  if (!engines || engines.length === 0) {
    return (
      <div className={`${STYLES.ROUNDED_CONTAINER} p-8 text-center`}>
        <p className="text-gray-500 dark:text-gray-400">No engines to display</p>
      </div>
    );
  }

  const sampleEngine = engines[0];
  const featureKeys = sampleEngine ? Object.keys(sampleEngine.features) : [];

  return (
    <div className={`${STYLES.ROUNDED_CONTAINER} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${STYLES.GRADIENT_HEADER} border-b border-gray-200 dark:border-gray-700`}>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                    Query Engine
                  </span>
                </div>
              </th>
              {featureKeys.map((feature) => (
                <th key={feature} className="px-3 py-4 text-center min-w-[100px]">
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                      {FEATURE_SHORT_NAMES[feature as keyof QueryEngine['features']]}
                    </span>
                  </div>
                </th>
              ))}
              <th className="px-4 py-4 text-center">
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Score
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {engines.map((engine, index) => (
              <tr 
                key={engine.id} 
                className={`${ANIMATIONS.TABLE_ROW_HOVER} ${
                  index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'
                }`}
                onClick={() => handleEngineClick(engine.id)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <p className={`text-sm font-semibold text-gray-900 dark:text-gray-100 ${ANIMATIONS.ICON_HOVER}`}>
                          {engine.name}
                        </p>
                        <ArrowTopRightOnSquareIcon className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <CategoryBadge category={engine.category} />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {engine.description}
                      </p>
                    </div>
                  </div>
                </td>
                {Object.entries(engine.features).map(([key, feature]) => (
                  <td key={key} className="px-3 py-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="group/tooltip relative">
                        <SupportIcon level={feature.support} />
                        <div className={TOOLTIP.CONTAINER}>
                          <div className="font-medium mb-1">
                            {FEATURE_NAMES[key as keyof QueryEngine['features']]}
                          </div>
                          <div className="text-gray-300 dark:text-gray-400">
                            {feature.details}
                          </div>
                          <div className={TOOLTIP.ARROW}></div>
                        </div>
                      </div>
                      <span className={SUPPORT_BADGE_STYLES[feature.support]}>
                        {feature.support}
                      </span>
                    </div>
                  </td>
                ))}
                <td className="px-4 py-4 text-center">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {calculateSupportScore(engine)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      / 32
                    </div>
                    <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(calculateSupportScore(engine) / 32) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;
