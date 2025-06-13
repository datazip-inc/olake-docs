// components/Iceberg/SupportIcon.tsx
import React from 'react';
import { 
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Zap } from 'lucide-react';
import { SupportLevel } from '../../types/iceberg';
import { SUPPORT_ICON_COLORS } from '../../data/constants/supportLevels';

interface SupportIconProps {
  level: SupportLevel;
  className?: string;
}

const SupportIcon: React.FC<SupportIconProps> = ({ level, className }) => {
  const iconClass = className || SUPPORT_ICON_COLORS[level];

  switch (level) {
    case 'full':
      return <CheckIcon className={iconClass} />;
    case 'partial':
      return <ExclamationTriangleIcon className={iconClass} />;
    case 'preview':
      return <Zap className={iconClass} />;
    case 'none':
      return <XMarkIcon className={iconClass} />;
  }
};

export default SupportIcon;