// components/webinars/EnhancedHeroSection.tsx
import React from 'react';
import { FaBroadcastTower, FaPlay, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import clsx from 'clsx';

interface Stat {
  icon: React.ComponentType<any>;
  value: string;
  label: string;
  color: 'blue' | 'purple' | 'green' | 'indigo';
}

interface EnhancedHeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  badge?: {
    icon?: React.ComponentType<any>;
    text: string;
  };
  stats?: Stat[];
  showNewsletter?: boolean;
  backgroundVariant?: 'gradient' | 'pattern' | 'minimal';
  className?: string;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-950/30',
    text: 'text-blue-600 dark:text-blue-400'
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-950/30',
    text: 'text-purple-600 dark:text-purple-400'
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-950/30',
    text: 'text-green-600 dark:text-green-400'
  },
  indigo: {
    bg: 'bg-indigo-100 dark:bg-indigo-950/30',
    text: 'text-indigo-600 dark:text-indigo-400'
  }
};

const EnhancedHeroSection: React.FC<EnhancedHeroSectionProps> = ({
  title,
  subtitle,
  description,
  badge,
  stats = [],
  showNewsletter = false,
  backgroundVariant = 'gradient',
  className
}) => {
  const defaultStats: Stat[] = [
    {
      icon: FaPlay,
      value: '25+',
      label: 'Technical Sessions',
      color: 'blue'
    },
    {
      icon: FaUsers,
      value: '200+',
      label: 'Community Members',
      color: 'purple'
    },
    {
      icon: FaCalendarAlt,
      value: '12+',
      label: 'Months Running',
      color: 'green'
    }
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  const getBackgroundClasses = () => {
    switch (backgroundVariant) {
      case 'pattern':
        return 'bg-gray-50 dark:bg-gray-900 relative overflow-hidden';
      case 'minimal':
        return 'bg-white dark:bg-gray-950';
      default:
        return 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950/20';
    }
  };

  return (
    <section className={clsx(
      'relative py-16 lg:py-24',
      getBackgroundClasses(),
      className
    )}>
      {/* Background decorative elements */}
      {backgroundVariant === 'gradient' && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
      )}

      {/* Pattern background */}
      {backgroundVariant === 'pattern' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800 bg-[size:20px_20px] opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-gray-900/50"></div>
        </div>
      )}
      
      <div className="relative container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
              {badge.icon && <badge.icon className="w-4 h-4 mr-2" />}
              {badge.text}
            </div>
          )}

          {/* Main content */}
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-50 leading-tight">
              <span className="block">{title}</span>
              {subtitle && (
                <span className="bg-gradient-to-r from-[#193ae6] via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {subtitle}
                </span>
              )}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Newsletter signup */}
          {showNewsletter && (
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#193ae6] focus:border-transparent"
                />
                <button className="px-6 py-3 bg-[#193ae6] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                  Get Notified
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Join our mailing list for event updates
              </p>
            </div>
          )}

          {/* Stats Section */}
          {displayStats.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12">
              {displayStats.map((stat, index) => {
                const colors = colorMap[stat.color];
                return (
                  <div key={index} className="text-center group">
                    <div className={clsx(
                      'flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 transition-transform group-hover:scale-110',
                      colors.bg
                    )}>
                      <stat.icon className={clsx('w-6 h-6', colors.text)} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;