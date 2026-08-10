// components/Iceberg/ComparisonView.tsx
import React from 'react';
import { XCircleIcon, ArrowTopRightOnSquareIcon, ScaleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { EngineVersionSelection, QueryEngine } from '../../types/iceberg';
import { FEATURE_NAMES, SUPPORT_WEIGHTS } from '../../data/constants/features';
import SupportIcon from './SupportIcon';
import CategoryBadge from './CategoryBadge';
import { buildEngineDetailUrl } from './versionState';

interface ComparisonViewProps {
  engines: QueryEngine[];
  selectedComparisons: EngineVersionSelection[];
  versionMode: 'v2' | 'v3';
  onEngineSelect: (selection: EngineVersionSelection, selected: boolean) => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ engines, selectedComparisons, versionMode, onEngineSelect }) => {
  const maxComparisons = 4;
  const options = engines.map((engine) => ({ engine, version: versionMode }));
  const selected = selectedComparisons
    .map((item) => {
      const engine = engines.find((entry) => entry.name === item.engine);
      if (!engine) return null;
      const data = engine.versions?.[item.version];
      return {
        key: `${engine.id}-${item.version}`,
        engine,
        version: item.version,
        features: data?.features ?? engine.features,
        description: data?.description ?? engine.description ?? 'N/A',
        score: data?.score
      };
    })
    .filter(Boolean) as Array<{ key: string; engine: QueryEngine; version: 'v2' | 'v3'; features: QueryEngine['features']; description: string; score?: number | null }>;

  const score = (features: QueryEngine['features']) => Object.values(features).reduce((sum, f) => sum + (SUPPORT_WEIGHTS[f?.support] ?? 0), 0);
  const featureKeys = Object.keys(selected[0]?.features ?? {});
  const selectedKeys = new Set(selected.map((item) => item.key));
  const available = options.filter((option) => !selectedKeys.has(`${option.engine.id}-${option.version}`));
  const canAddMore = selected.length < maxComparisons;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-6 text-center border border-blue-200 dark:border-blue-800">
        <ScaleIcon className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Select Engines to Compare ({versionMode.toUpperCase()})</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{selected.length}/{maxComparisons} selected</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Selected Engines</h4>
        {selected.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No engines selected yet. Pick engines from the Available Engines section below.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {selected.map((item) => (
              <button
                key={item.key}
                onClick={() => onEngineSelect({ engine: item.engine.name, version: item.version }, false)}
                className={`text-left rounded-lg border p-3 cursor-pointer ${item.version === 'v2' ? 'bg-gray-50 border-gray-300 dark:bg-gray-800/70 dark:border-gray-600' : 'bg-blue-50 border-blue-300 dark:bg-blue-950/20 dark:border-blue-700'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{item.engine.name}</span>
                  <XCircleIcon className="w-4 h-4 text-gray-500" />
                </div>
                <CategoryBadge category={item.engine.category} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Available Engines</h4>
          {!canAddMore && <span className="text-xs text-amber-600 dark:text-amber-400">Maximum 4 engines selected</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {available.map((option) => (
            <button
              key={`${option.engine.id}-${option.version}`}
              disabled={!canAddMore}
              onClick={() => onEngineSelect({ engine: option.engine.name, version: option.version }, true)}
              className={`text-left bg-white dark:bg-gray-800 rounded-xl border p-4 border-solid ${canAddMore ? 'hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer border-gray-200 dark:border-gray-700' : 'opacity-60 cursor-not-allowed border-gray-200 dark:border-gray-700'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{option.engine.name}</span>
                <PlusIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="mb-2"><CategoryBadge category={option.engine.category} /></div>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{option.engine.versions?.[versionMode]?.description ?? option.engine.description ?? 'N/A'}</p>
            </button>
          ))}
          {available.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 col-span-full">All engines are already selected for this version.</p>
          )}
        </div>
      </div>

      {selected.length > 0 && (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full">
            <thead>
              <tr className="bg-black text-white">
                <th className="px-4 py-3 text-left text-white">Feature</th>
                {selected.map((item) => (
                  <th key={item.key} className="px-4 py-3 text-center min-w-[220px] text-white">
                    <button onClick={() => window.open(buildEngineDetailUrl(item.engine.id, item.version), '_blank')} className="border-none bg-transparent p-0 cursor-pointer text-white">
                      {item.engine.name} ({item.version.toUpperCase()}) <ArrowTopRightOnSquareIcon className="w-3 h-3 inline" />
                    </button>
                    <div className="text-xs text-gray-300 mt-1">Score: {item.score ?? score(item.features)}/32</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureKeys.map((feature) => (
                <tr key={feature} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 font-medium">{FEATURE_NAMES[feature as keyof QueryEngine['features']]}</td>
                  {selected.map((item) => {
                    const value = item.features?.[feature as keyof QueryEngine['features']];
                    return (
                      <td key={`${item.key}-${feature}`} className={`px-4 py-3 text-center ${item.version === 'v2' ? 'bg-gray-50/60 dark:bg-gray-800/30' : 'bg-blue-50/60 dark:bg-blue-950/20'}`}>
                        <div className="flex justify-center mb-1"><SupportIcon level={value?.support ?? 'none'} /></div>
                        <div className="text-xs">{value?.support ?? 'N/A'}</div>
                        <div className="text-xs text-gray-500 mt-1">{value?.details ?? 'N/A'}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-3 font-medium">Description</td>
                {selected.map((item) => <td key={`${item.key}-desc`} className="px-4 py-3 text-sm">{item.description || 'N/A'}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComparisonView;