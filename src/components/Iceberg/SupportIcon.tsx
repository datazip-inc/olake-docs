// components/Iceberg/SupportIcon.tsx
import React from 'react';
import { PiCheck, PiLightning, PiWarning, PiX } from 'react-icons/pi'
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
      return <PiCheck aria-hidden="true" className={iconClass} />;
    case 'partial':
      return <PiWarning aria-hidden="true" className={iconClass} />;
    case 'preview':
      return <PiLightning aria-hidden="true" className={iconClass} />;
    case 'none':
      return <PiX aria-hidden="true" className={iconClass} />;
  }
};

export default SupportIcon;