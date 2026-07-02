import React, { useState } from 'react';
import { EngineVersionSelection } from '../../types/iceberg';
import { FEATURE_SHORT_NAMES, FEATURE_NAMES, SUPPORT_WEIGHTS } from '../../data/constants/features';
import { STYLES } from '../../data/constants/ui';
import SupportIcon from './SupportIcon';
import CategoryBadge from './CategoryBadge';
import { ResolvedEngineView } from './versionedTypes';
import { buildEngineDetailUrl } from './versionState';

interface TableViewProps {
  engines: ResolvedEngineView[];
  fullWidth?: boolean;
  selectionMode?: boolean;
  selectedComparisons?: EngineVersionSelection[];
  onEngineSelect?: (selection: EngineVersionSelection, selected: boolean) => void;
}

const TableView: React.FC<TableViewProps> = ({ engines, fullWidth = false, selectionMode = false, selectedComparisons = [], onEngineSelect }) => {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: string } | null>(null);

  if (!engines.length) {
    return <div className={`${STYLES.ROUNDED_CONTAINER} p-8 text-center text-gray-500 dark:text-gray-400`}>No engines to display</div>;
  }
  const featureKeys = Object.keys(engines[0].features);
  const score = (e: ResolvedEngineView) => e.score ?? Object.values(e.features).reduce((s, f) => s + (SUPPORT_WEIGHTS[f?.support] ?? 0), 0);
  const selected = (e: ResolvedEngineView) => selectedComparisons.some((x) => x.engine === e.baseName && x.version === e.version);

  return (
    <div className={`w-full ${fullWidth ? '' : 'max-w-6xl mx-auto'}`}>
      <div className={`${STYLES.ROUNDED_CONTAINER} overflow-x-auto`}>
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              {selectionMode && <th className="px-3 py-3">Select</th>}
              <th className="px-4 py-3 text-left">Query Engine</th>
              {featureKeys.map((f) => (
                <th key={f} className="px-3 py-3 text-center">
                  {FEATURE_SHORT_NAMES[f as keyof typeof engines[0]['features']]}
                </th>
              ))}
              <th className="px-3 py-3 text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {engines.map((engine, rowIndex) => (
              <tr key={engine.key} className={`${engine.version === 'v2' ? 'bg-gray-50/70 dark:bg-gray-800/40' : 'bg-blue-50/50 dark:bg-blue-950/20'} border-t border-gray-200 dark:border-gray-700`}>
                {selectionMode && (
                  <td className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selected(engine)}
                      onChange={() => onEngineSelect?.({ engine: engine.baseName, version: engine.version }, !selected(engine))}
                    />
                  </td>
                )}
                <td className="px-4 py-3">
                  <button className="border-none bg-transparent p-0 text-left cursor-pointer" onClick={() => window.open(buildEngineDetailUrl(engine.id, engine.version), '_self')}>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{engine.baseName} ({engine.version.toUpperCase()})</div>
                    <div className="mt-1"><CategoryBadge category={engine.category} /></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{engine.description || 'N/A'}</p>
                  </button>
                </td>
                {featureKeys.map((f, colIndex) => {
                  const feature = engine.features[f as keyof typeof engine.features];
                  const details = feature?.details;
                  const featureName = FEATURE_NAMES[f as keyof typeof engines[0]['features']];
                  const isHovered = hoveredCell?.row === rowIndex && hoveredCell?.col === f;

                  const isLastCols = colIndex >= featureKeys.length - 2;
                  const isFirstCols = colIndex <= 1;
                  const isFirstRow = rowIndex === 0;

                  const hAlign = isLastCols ? 'right-0' : isFirstCols ? 'left-0' : 'left-1/2 -translate-x-1/2';
                  const arrowHAlign = isLastCols ? 'right-3' : isFirstCols ? 'left-3' : 'left-1/2 -translate-x-1/2';

                  // Flip below for first row to avoid top-of-table clipping
                  const vPos = isFirstRow ? 'top-full pt-1' : 'bottom-full pb-1';
                  const arrowVPos = isFirstRow ? 'top-[-4px]' : 'bottom-[-4px]';

                  return (
                    <td
                      key={f}
                      className="px-3 py-3 text-center"
                      onMouseEnter={() => details && setHoveredCell({ row: rowIndex, col: f })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div className="inline-block relative">
                        <SupportIcon level={feature?.support ?? 'none'} />

                        {isHovered && details && (
                          <div className={`absolute z-50 ${vPos} ${hAlign} pointer-events-none`}>
                            <div className="bg-gray-900 dark:bg-gray-800 text-white rounded-xl shadow-2xl px-4 py-2 relative w-64">
                              <div className={`absolute ${arrowVPos} ${arrowHAlign} w-3 h-3 bg-gray-900 dark:bg-gray-800 transform rotate-45`}></div>
                              <p className="font-semibold text-white text-sm mb-0.5">{featureName}</p>
                              <p className="text-gray-300 text-sm">{details}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
                <td className="px-3 py-3 text-center font-semibold">{score(engine)}/32</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;
