// components/Iceberg/FeatureView.tsx
import React from 'react';
import { QueryEngine } from '../../types/iceberg';
import { FEATURE_NAMES, FEATURE_FOCUS_LIST } from '../../data/constants/features';
import { SUPPORT_BADGE_STYLES } from '../../data/constants/supportLevels';
import { LAYOUT, STYLES } from '../../data/constants/ui';
import SupportIcon from './SupportIcon';
import CategoryBadge from './CategoryBadge';
import { buildEngineDetailUrl } from './versionState';

interface FeatureViewProps {
  engines: QueryEngine[];
  versionMode: 'v2' | 'v3';
}

const FeatureView: React.FC<FeatureViewProps> = ({ engines, versionMode }) => {
  const handleEngineClick = (engineId: string) => {
    window.open(buildEngineDetailUrl(engineId, versionMode), '_blank');
  };

  const getSupport = (engine: QueryEngine, feature: keyof QueryEngine['features'], version: 'v2' | 'v3') =>
    (version === 'v2'
      ? engine.versions?.v2?.features?.[feature]?.support
      : engine.versions?.v3?.features?.[feature]?.support) ?? 'none';

  const getDetails = (engine: QueryEngine, feature: keyof QueryEngine['features'], version: 'v2' | 'v3') =>
    (version === 'v2'
      ? engine.versions?.v2?.features?.[feature]?.details
      : engine.versions?.v3?.features?.[feature]?.details) ?? 'N/A';

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
            {(() => {
              const enginesForFeature = engines
                .filter((engine) => {
                  const support = getSupport(engine, feature, versionMode);
                  return support !== 'none' && support !== 'unknown' && support !== '';
                })
                .map((engine) => {
                const v2Support = getSupport(engine, feature, 'v2');
                const v3Support = getSupport(engine, feature, 'v3');
                const activeSupport = versionMode === 'v2' ? v2Support : v3Support;
                return (
                  <div
                    key={`${feature}-${engine.id}`}
                    className="group border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer bg-gray-50/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700"
                    onClick={() => handleEngineClick(engine.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                            {engine.name}
                          </h4>
                          <div className="mt-1 text-[10px]">
                            <span className={`px-1.5 py-0.5 rounded ${versionMode === 'v2' ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100' : 'bg-blue-200 text-blue-900 dark:bg-blue-900/40 dark:text-blue-100'}`}>
                              {versionMode.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <SupportIcon level={activeSupport} />
                        <span className={SUPPORT_BADGE_STYLES[activeSupport]}>
                          {activeSupport}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <CategoryBadge category={engine.category} showIcon />
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                      {getDetails(engine, feature, versionMode)}
                    </p>
                  </div>
                );
                });

              if (enginesForFeature.length === 0) {
                return (
                  <div className="col-span-full rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4 text-sm text-gray-500 dark:text-gray-400">
                    No engines currently show support for this feature in {versionMode.toUpperCase()}.
                  </div>
                );
              }

              return enginesForFeature;
            })()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureView;