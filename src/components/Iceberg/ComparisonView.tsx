// components/Iceberg/ComparisonView.tsx
import React from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon,
  ScaleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { QueryEngine } from '../../types/iceberg';
import { FEATURE_NAMES, SUPPORT_WEIGHTS } from '../../data/constants/features';
import { SUPPORT_BADGE_STYLES } from '../../data/constants/supportLevels';
import CategoryBadge from './CategoryBadge';
import SupportIcon from './SupportIcon';

interface ComparisonViewProps {
  engines: QueryEngine[];
  selectedEngines: string[];
  onEngineSelect: (engineId: string, selected: boolean) => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ 
  engines, 
  selectedEngines, 
  onEngineSelect 
}) => {
  const maxComparisons = 4;
  const selectedEngineData = engines.filter(engine => selectedEngines.includes(engine.id));
  const availableEngines = engines.filter(engine => !selectedEngines.includes(engine.id));

  const calculateSupportScore = (engine: QueryEngine): number => {
    return Object.values(engine.features).reduce(
      (score, feature) => score + SUPPORT_WEIGHTS[feature.support], 0
    );
  };

  const handleEngineClick = (engineId: string) => {
    window.open(`/iceberg/query-engine/${engineId}`, '_blank');
  };

  const getComparisonColor = (support: string) => {
    switch (support) {
      case 'full': return 'text-green-600 dark:text-green-400';
      case 'partial': return 'text-yellow-600 dark:text-yellow-400';
      case 'preview': return 'text-blue-600 dark:text-blue-400';
      case 'none': return 'text-gray-400 dark:text-gray-500';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (selectedEngines.length === 0) {
    return (
      <div className="space-y-8">
        {/* Selection Instructions */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-8 text-center border border-blue-200 dark:border-blue-800">
          <ScaleIcon className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Select Engines to Compare
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Choose up to {maxComparisons} query engines to compare their features, capabilities, and support levels side-by-side.
          </p>
        </div>

        {/* Engine Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {engines.map((engine) => (
            <div
              key={engine.id}
              className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-600"
              onClick={() => onEngineSelect(engine.id, true)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    {engine.name}
                  </h4>
                  <CategoryBadge category={engine.category} />
                </div>
                <PlusIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {engine.description}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Support Score: {calculateSupportScore(engine)}/32
                </div>
                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                    style={{ width: `${(calculateSupportScore(engine) / 32) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Selected Engines Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Comparing {selectedEngines.length} Engine{selectedEngines.length > 1 ? 's' : ''}
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {selectedEngineData.map((engine) => (
              <button
                key={engine.id}
                onClick={() => onEngineSelect(engine.id, false)}
                className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                {engine.name}
                <XCircleIcon className="w-4 h-4 ml-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Add More */}
        {selectedEngines.length < maxComparisons && availableEngines.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add more engines (up to {maxComparisons}):
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableEngines.slice(0, 6).map((engine) => (
                <button
                  key={engine.id}
                  onClick={() => onEngineSelect(engine.id, true)}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <PlusIcon className="w-3 h-3 mr-1" />
                  {engine.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-left">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                    Features
                  </span>
                </th>
                {selectedEngineData.map((engine) => (
                  <th key={engine.id} className="px-6 py-4 text-center min-w-[200px]">
                    <div className="space-y-2">
                      <button
                        onClick={() => handleEngineClick(engine.id)}
                        className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>{engine.name}</span>
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      </button>
                      <CategoryBadge category={engine.category} />
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Score: {calculateSupportScore(engine)}/32
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Basic Info Row */}
              <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                  Description
                </td>
                {selectedEngineData.map((engine) => (
                  <td key={engine.id} className="px-6 py-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {engine.description}
                    </p>
                  </td>
                ))}
              </tr>

              {/* Website Row */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                  Website
                </td>
                {selectedEngineData.map((engine) => (
                  <td key={engine.id} className="px-6 py-4 text-center">
                    <a
                      href={engine.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm inline-flex items-center space-x-1"
                    >
                      <span>Visit Site</span>
                      <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                    </a>
                  </td>
                ))}
              </tr>

              {/* Feature Comparison Rows */}
              {Object.keys(selectedEngineData[0]?.features || {}).map((feature) => (
                <tr key={feature} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                    {FEATURE_NAMES[feature as keyof QueryEngine['features']]}
                  </td>
                  {selectedEngineData.map((engine) => {
                    const featureData = engine.features[feature as keyof QueryEngine['features']];
                    return (
                      <td key={engine.id} className="px-6 py-4 text-center">
                        <div className="space-y-2">
                          <div className="flex justify-center">
                            <SupportIcon level={featureData.support} />
                          </div>
                          <div className={`text-xs ${getComparisonColor(featureData.support)}`}>
                            {featureData.support}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 max-w-[180px] mx-auto">
                            {featureData.details}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Best Practices Row */}
              <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                  Best Practices
                </td>
                {selectedEngineData.map((engine) => (
                  <td key={engine.id} className="px-6 py-4">
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 text-left">
                      {engine.bestPractices.slice(0, 3).map((practice, idx) => (
                        <li key={idx} className="flex items-start space-x-1">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>{practice}</span>
                        </li>
                      ))}
                      {engine.bestPractices.length > 3 && (
                        <li className="text-gray-400 italic">
                          +{engine.bestPractices.length - 3} more...
                        </li>
                      )}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed View Links */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
          View Detailed Information
        </h4>
        <div className="flex flex-wrap gap-3">
          {selectedEngineData.map((engine) => (
            <button
              key={engine.id}
              onClick={() => handleEngineClick(engine.id)}
              className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {engine.name} Details
              <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;