// components/Iceberg/CategoryBadge.tsx
import React from 'react';
import { Database, Zap, Cloud, Cpu, BarChart3 } from 'lucide-react';
import { QueryEngine } from '../../types/iceberg';
import { CATEGORY_STYLES, CATEGORY_LABELS } from '../../data/constants/categories';

interface CategoryBadgeProps {
  category: QueryEngine['category'];
  showIcon?: boolean;
  className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  category, 
  showIcon = false, 
  className 
}) => {
  const badgeClass = className || CATEGORY_STYLES[category];
  const iconClass = "w-5 h-5 text-gray-600 dark:text-gray-400";

  const getCategoryIcon = () => {
    switch (category) {
      case 'general-purpose':
        return <Database className={iconClass} />;
      case 'streaming':
        return <Zap className={iconClass} />;
      case 'analytics':
        return <BarChart3 className={iconClass} />;
      case 'cloud-native':
        return <Cloud className={iconClass} />;
      case 'embedded':
        return <Cpu className={iconClass} />;
      default:
        return <Database className={iconClass} />;
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {showIcon && getCategoryIcon()}
      <span className={badgeClass}>
        {CATEGORY_LABELS[category]}
      </span>
    </div>
  );
};

export default CategoryBadge;