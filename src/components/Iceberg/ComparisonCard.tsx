// src/components/Iceberg/ComparisonCard.tsx
import React from 'react';
import { StatusIndicator, StatusLevel } from './StatusIndicator';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export interface ComparisonFeature {
  name: string;
  engine1Support: StatusLevel;
  engine2Support: StatusLevel;
  description?: string;
}

export interface ComparisonCardProps {
  engine1: {
    name: string;
    logo?: string;
    color: string;
  };
  engine2: {
    name: string;
    logo?: string;
    color: string;
  };
  features: ComparisonFeature[];
  title?: string;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  engine1,
  engine2,
  features,
  title
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 p-6">
        {title && (
          <h3 className="text-xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
            {title}
          </h3>
        )}
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${engine1.color} text-white mb-2`}>
              {engine1.logo ? (
                <img src={engine1.logo} alt={engine1.name} className="w-10 h-10" />
              ) : (
                <span className="text-2xl font-bold">{engine1.name[0]}</span>
              )}
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{engine1.name}</h4>
          </div>
          
          <div className="flex justify-center">
            <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
              <ChevronRightIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
          
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${engine2.color} text-white mb-2`}>
              {engine2.logo ? (
                <img src={engine2.logo} alt={engine2.name} className="w-10 h-10" />
              ) : (
                <span className="text-2xl font-bold">{engine2.name[0]}</span>
              )}
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{engine2.name}</h4>
          </div>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="p-6">
        <div className="space-y-4">
          {features.map((feature, idx) => (
            <div key={idx} className="group">
              <div className="grid grid-cols-3 gap-4 items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex justify-center">
                  <StatusIndicator level={feature.engine1Support} size="md" />
                </div>
                
                <div className="text-center">
                  <h5 className="font-medium text-gray-900 dark:text-gray-100">
                    {feature.name}
                  </h5>
                  {feature.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {feature.description}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-center">
                  <StatusIndicator level={feature.engine2Support} size="md" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {features.filter(f => f.engine1Support === 'full').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Full Support Features
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {features.filter(f => f.engine2Support === 'full').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Full Support Features
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};