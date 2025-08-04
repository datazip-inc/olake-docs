// components/Iceberg/FeatureView.tsx
import React from 'react';
import { QueryEngine } from '../../types/iceberg';
import { FEATURE_NAMES, FEATURE_FOCUS_LIST } from '../../data/constants/features';
import { SUPPORT_BADGE_STYLES } from '../../data/constants/supportLevels';
import { LAYOUT, STYLES } from '../../data/constants/ui';
import SupportIcon from './SupportIcon';
import CategoryBadge from './CategoryBadge';

interface FeatureViewProps {
  engines: QueryEngine[];
}

const FeatureView: React.FC<FeatureViewProps> = ({ engines }) => {
  const handleEngineClick = (engineId: string) => {
    window.open(`/iceberg/query-engine/${engineId}`, '_blank');
  };

  return (
    <div className="space-y-8 w-full">
      {FEATURE_FOCUS_LIST.map((feature) => (
        <div key={feature} className={`${STYLES.ROUNDED_CONTAINER} p-6`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {feature.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {FEATURE_NAMES[feature]} Support
            </h3>
          </div>
          
          <div className={LAYOUT.FEATURE_GRID}>
            {engines
              .filter(engine => engine.features[feature].support !== 'none')
              .map((engine) => (
                <div
                  key={`${feature}-${engine.id}`}
                  className="group border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer bg-gray-50/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700"
                  onClick={() => handleEngineClick(engine.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                        {engine.name}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SupportIcon level={engine.features[feature].support} />
                      <span className={SUPPORT_BADGE_STYLES[engine.features[feature].support]}>
                        {engine.features[feature].support}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <CategoryBadge category={engine.category} showIcon />
                  </div>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                    {engine.features[feature].details}
                  </p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureView;