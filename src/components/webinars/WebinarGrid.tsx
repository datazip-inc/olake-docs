// components/WebinarGrid.tsx

import React from 'react';
import { useHistory } from "react-router-dom";
import Image from '@theme/IdealImage';
import { FaArrowRight, FaVideo, FaFileVideo, FaRegCalendarAlt } from 'react-icons/fa';

import StatusBadge from './StatusBadge';
import CTAButton from './CTAButton';

interface Webinar {
  title: string;
  subtitle: string;
  route: string;
  img: string;
  alt: string;
  status: string;
  button: string;
  CTA: string;
  date: string;
  /**
   * Either a string or a React icon component.
   * If no icon is provided, we'll default to FaArrowRight.
   */
  icon?: string | typeof FaArrowRight;
}

interface WebinarGridProps {
  webinars: Webinar[];
}

const WebinarGrid: React.FC<WebinarGridProps> = ({ webinars }) => {
  const router = useHistory();

  // Handle navigation programmatically
  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {webinars.map((webinar, index) => {
        // Default to FaArrowRight if webinar.icon is falsy
        const iconToUse = webinar.icon || FaArrowRight;

        return (
          <div
            key={index}
            className="flex flex-col h-full rounded overflow-hidden bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handleNavigation(webinar.route)}
          >
            {/* Image Section */}
            <div className="relative w-full h-64 overflow-hidden">
              <Image
                img={webinar.img}
                alt={webinar.alt}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-grow px-4">
              {/* Status and Date */}
              <div className="flex items-center">
                <StatusBadge status={webinar.status} />
                <p className="text-gray-500 dark:text-gray-400 pt-4 text-sm ml-3 flex items-center">
                  <FaRegCalendarAlt className="mr-1" />
                  {webinar.date}
                </p>
              </div>

              {/* Webinar Title */}
              <h3 className="font-bold text-lg mb-1 text-gray-800 dark:text-white">
                {webinar.title}
              </h3>

              {/* Webinar Subtitle */}
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {webinar.subtitle}
              </p>

              {/* CTA Button */}
              <div className="mt-auto mb-4">
                <CTAButton
                  title=""
                  buttonText={webinar.CTA}
                  icon={iconToUse}
                  href={webinar.route}
                  variant={webinar.button}
                  className="w-full text-center"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WebinarGrid;
