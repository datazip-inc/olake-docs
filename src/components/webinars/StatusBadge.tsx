// components/StatusBadge.tsx

import React from 'react';
import { FaCircle, FaCheckCircle, FaArchive, FaClock } from 'react-icons/fa';

// type Status = 'upcoming' | 'live' | 'done' | 'archived';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let icon;
  let text;
  let colorClasses;

  switch (status) {
    case 'live':
      icon = (
        <FaCircle className="text-red-500 animate-ping absolute inline-block w-3 h-3 rounded-full" />
      );
      text = 'Live';
      colorClasses = 'text-red-500';
      break;
      
    case 'upcoming2':
        icon = (
          <FaCircle className="text-red-500 animate-ping absolute inline-block w-3 h-3 rounded-full" />
        );
        text = 'Upcoming';
        colorClasses = 'text-red-500';
        break;

    case 'upcoming':
      icon = <FaClock className="text-yellow-500 mr-1" />;
      text = 'Upcoming';
      colorClasses = 'text-yellow-500';
      break;
    case 'done':
      icon = <FaCheckCircle className="text-green-500 mr-1" />;
      text = 'Done';
      colorClasses = 'text-green-500';
      break;
    case 'archived':
      icon = <FaArchive className="text-gray-500 mr-1" />;
      text = 'Archived';
      colorClasses = 'text-gray-500';
      break;
    default:
      icon = <FaCircle className="text-gray-500 mr-1" />;
      text = status;
      colorClasses = 'text-gray-500';
  }

  return (
    <div className="relative inline-flex items-center text-xs font-semibold">
      <span className={`flex items-center ${colorClasses}`}>
        {icon}
        {text}
      </span>
      {status === 'live' && (
        <span className="absolute top-0 right-0">
          <FaCircle className="text-red-500 w-2 h-2" />
        </span>
      )}
    </div>
  );
};

export default StatusBadge;
