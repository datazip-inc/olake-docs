// components/common/EnhancedSection.tsx
import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface Badge {
  icon?: React.ComponentType<any>;
  text: string;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'red';
}

interface EnhancedSectionProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  badge?: Badge;
  containerSize?: 'small' | 'medium' | 'large' | 'full';
  spacing?: 'compact' | 'normal' | 'relaxed';
  background?: 'none' | 'subtle' | 'elevated' | 'gradient';
  className?: string;
  id?: string;
  centered?: boolean;
}

const badgeColors = {
  blue: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300',
  purple: 'bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300',
  green: 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300',
  orange: 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300',
  red: 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300'
};

const containerSizes = {
  small: 'max-w-4xl',
  medium: 'max-w-6xl',
  large: 'max-w-7xl',
  full: 'w-full'
};

const spacingClasses = {
  compact: 'py-8 lg:py-12',
  normal: 'py-12 lg:py-16',
  relaxed: 'py-16 lg:py-24'
};

const backgroundClasses = {
  none: '',
  subtle: 'bg-gray-50 dark:bg-gray-950',
  elevated: 'bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800',
  gradient: 'bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl'
};

const EnhancedSection: React.FC<EnhancedSectionProps> = ({
  children,
  title,
  subtitle,
  description,
  badge,
  containerSize = 'large',
  spacing = 'normal',
  background = 'none',
  className,
  id,
  centered = true
}) => {
  const hasHeader = title || subtitle || description || badge;

  return (
    <section
      id={id}
      className={clsx(
        spacingClasses[spacing],
        background !== 'none' && background !== 'elevated' && backgroundClasses[background],
        className
      )}
    >
      <div className={clsx(
        'mx-auto px-4 sm:px-6 lg:px-8',
        containerSizes[containerSize]
      )}>
        {/* Header */}
        {hasHeader && (
          <div className={clsx(
            'mb-12 lg:mb-16',
            centered && 'text-center'
          )}>
            {/* Badge */}
            {badge && (
              <div className={clsx(
                'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4',
                badgeColors[badge.color || 'blue']
              )}>
                {badge.icon && <badge.icon className="w-4 h-4 mr-2" />}
                {badge.text}
              </div>
            )}

            {/* Title */}
            {title && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {title}
                {subtitle && (
                  <span className="block mt-2 bg-gradient-to-r from-[#193ae6] via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {subtitle}
                  </span>
                )}
              </h2>
            )}

            {/* Description */}
            {description && (
              <p className={clsx(
                'text-lg text-gray-600 dark:text-gray-400 leading-relaxed',
                centered ? 'max-w-3xl mx-auto' : 'max-w-3xl'
              )}>
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className={clsx(
          background === 'elevated' && backgroundClasses.elevated,
          background === 'elevated' && 'p-8 lg:p-12'
        )}>
          {background === 'gradient' && (
            <div className="relative">
              <div className={clsx(backgroundClasses.gradient, 'absolute inset-0 -m-4')} />
              <div className="relative">
                {children}
              </div>
            </div>
          )}
          {background !== 'gradient' && children}
        </div>
      </div>
    </section>
  );
};

export default EnhancedSection;