// src/components/Iceberg/InteractiveTable.tsx
import React, { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';

import { useLocation } from "react-router-dom";
import useBaseUrl from "@docusaurus/useBaseUrl";


export interface TableColumn {
  key: string;
  header: string;
  tooltip?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableRow {
  [key: string]: {
    value: string | React.ReactNode;
    className?: string;
    tooltip?: string;
    badge?: {
      text: string;
      variant: 'success' | 'warning' | 'error' | 'info';
    };
  };
}

export interface InteractiveTableProps {
  columns: TableColumn[];
  rows: TableRow[];
  title?: string;
  description?: string;
  variant?: 'default' | 'compact' | 'spacious';
}


const badgeStyles = {
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
};



export const InteractiveTable: React.FC<InteractiveTableProps> = ({
  columns,
  rows,
  title,
  description,
  variant = 'default'
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: string } | null>(null);
  const [hoveredHeader, setHoveredHeader] = useState<string | null>(null);
  const bugIconUrl = useBaseUrl("img/icon/bug-icon.svg");
  const paddingStyles = {
    default: 'px-6 py-4',
    compact: 'px-4 py-2',
    spacious: 'px-8 py-6'
  };
  const location = useLocation();
  const padding = paddingStyles[variant];
  const openDocIssueURL =
    "https://github.com/datazip-inc/olake-docs/issues/new?assignees=&labels=&template=---doc-error-report.md&title=Issue with olake.io" +
    location.pathname;

  return (
    <div className="w-full">
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-gray-200/50 dark:bg-gray-900 dark:shadow-gray-900/50">
        <div className="overflow-x-auto">
          <table
            className="w-full"
            role="table"
            aria-label={title || "Data table"}
          >
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`${padding} text-${column.align || "left"} ${column.width || ""} group relative`}
                    scope="col"
                    aria-sort="none"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                        {column.header}
                      </span>
                      {column.tooltip && (
                        <div className="relative">
                          <button
                            onMouseEnter={() => setHoveredHeader(column.key)}
                            onMouseLeave={() => setHoveredHeader(null)}
                            className="rounded-lg border-none p-1 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-700"
                            aria-label={`Information about ${column.header}`}
                            aria-describedby={`tooltip-${column.key}`}
                          >
                            <InformationCircleIcon className="w-4 h-4 text-blue-400 hover:text-gray-600 dark:hover:text-gray-300" />
                          </button>

                          <Transition
                            show={hoveredHeader === column.key}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <div
                              id={`tooltip-${column.key}`}
                              className="absolute -top-2 left-8 z-50 w-64 transform p-3"
                              role="tooltip"
                            >
                              <div className="relative rounded-xl bg-gray-900 p-4 text-sm text-white shadow-xl dark:bg-gray-800">
                                <div className="absolute -left-2 top-3 h-3 w-3 rotate-45 transform bg-gray-900 dark:bg-gray-800"></div>
                                {column.tooltip}
                              </div>
                            </div>
                          </Transition>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="group transition-all duration-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50/50 dark:hover:from-gray-800/50 dark:hover:to-gray-800/30"
                >
                  {columns.map((column) => {
                    const cell = row[column.key];
                    if (!cell) return <td key={column.key} className={padding}></td>;

                    const isHovered = hoveredCell?.row === rowIndex && hoveredCell?.col === column.key;

                    return (
                      <td
                        key={column.key}
                        className={`${padding} text-sm ${cell.className || ''} text-${column.align || 'left'} relative`}
                        onMouseEnter={() => cell.tooltip && setHoveredCell({ row: rowIndex, col: column.key })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-700 dark:text-gray-300">
                            {cell.value}
                          </span>
                          {cell.badge && (
                            <span className={`
                              inline-flex items-center px-2.5 py-0.5  text-xs font-medium border
                              ${badgeStyles[cell.badge.variant]}
                            `}>
                              {cell.badge.text}
                            </span>
                          )}
                        </div>

                        <Transition
                          show={isHovered && !!cell.tooltip}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <div className="absolute z-20 bottom-full left-0 mb-2 w-72 p-0">
                            <div className="bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-xl shadow-2xl p-4 relative">
                              <div className="absolute bottom-[-6px] left-6 w-3 h-3 bg-gray-900 dark:bg-gray-800 transform rotate-45"></div>
                              <div className="flex items-start space-x-2">
                                <InformationCircleIcon className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div className="text-gray-100">{cell.tooltip}</div>
                              </div>
                            </div>
                          </div>
                        </Transition>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer with summary */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {rows.length} {rows.length === 1 ? 'entry' : 'entries'}
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Live data</span>
              <a
                href={openDocIssueURL}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500"
              >
                <img src={bugIconUrl} alt="Bug icon" className="w-4 h-4" loading="lazy" decoding="async" />
                <span className="text-gray-400">For issues, click here (GitHub)</span>
              </a>
              {/* <span className="text-xs text-gray-500 dark:text-gray-400">For any issues click here (GitHub)</span> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};