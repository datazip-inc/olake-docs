// src/components/Iceberg/StatusIndicator.tsx
import React from 'react';

export type StatusLevel = 'full' | 'partial' | 'preview' | 'none';

interface StatusIndicatorProps {
  level: StatusLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  full: {
    color: 'bg-green-500',
    label: 'Full Support',
    ringColor: 'ring-green-500/20',
    textColor: 'text-green-700 dark:text-green-300'
  },
  partial: {
    color: 'bg-yellow-500',
    label: 'Partial Support',
    ringColor: 'ring-yellow-500/20',
    textColor: 'text-yellow-700 dark:text-yellow-300'
  },
  preview: {
    color: 'bg-blue-500',
    label: 'Preview',
    ringColor: 'ring-blue-500/20',
    textColor: 'text-blue-700 dark:text-blue-300'
  },
  none: {
    color: 'bg-gray-400',
    label: 'Not Supported',
    ringColor: 'ring-gray-400/20',
    textColor: 'text-gray-700 dark:text-gray-300'
  }
};

const sizeConfig = {
  sm: {
    dot: 'w-2 h-2',
    ring: 'w-4 h-4',
    text: 'text-xs'
  },
  md: {
    dot: 'w-3 h-3',
    ring: 'w-5 h-5',
    text: 'text-sm'
  },
  lg: {
    dot: 'w-4 h-4',
    ring: 'w-6 h-6',
    text: 'text-base'
  }
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  level, 
  showLabel = false,
  size = 'md' 
}) => {
  const status = statusConfig[level];
  const sizes = sizeConfig[size];

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className={`${sizes.ring} rounded-full ring-4 ${status.ringColor} flex items-center justify-center`}>
          <div className={`${sizes.dot} rounded-full ${status.color} ${level === 'full' ? 'animate-pulse' : ''}`} />
        </div>
      </div>
      {showLabel && (
        <span className={`font-medium ${sizes.text} ${status.textColor}`}>
          {status.label}
        </span>
      )}
    </div>
  );
};