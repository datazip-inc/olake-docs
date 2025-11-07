// components/WebinarGrid.tsx - Enhanced UX Version

import React from 'react';
import { useHistory } from "react-router-dom";
import Image from '@theme/IdealImage';
import { FaArrowRight, FaVideo, FaFileVideo, FaRegCalendarAlt, FaPlay } from 'react-icons/fa';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {webinars.map((webinar, index) => {
        // Default to FaArrowRight if webinar.icon is falsy
        const iconToUse = webinar.icon || FaArrowRight;

        return (
          <article
            key={index}
            className="group flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-800 transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer"
            onClick={() => handleNavigation(webinar.route)}
          >
            {/* Enhanced Image Section */}
            <div className="relative overflow-hidden">
              <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                <Image
                  img={webinar.img}
                  alt={webinar.alt}
                  className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                />
                
                {/* Overlay with play button on hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <FaPlay className="w-6 h-6 text-[#193ae6] ml-1" />
                  </div>
                </div>
              </div>
              
              
            </div>

            {/* Enhanced Content Section */}
            <div className="flex flex-col flex-grow p-6 space-y-4">
              {/* Date Section - Improved styling */}
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <FaRegCalendarAlt className="w-3 h-3 mr-2" />
                  <span>{webinar.date}</span>
                </div>
              </div>

              {/* Title - Enhanced typography */}
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-50 leading-tight line-clamp-2 group-hover:text-[#193ae6] dark:group-hover:text-blue-400 transition-colors duration-300">
                {webinar.title}
              </h3>

              {/* Subtitle - Improved readability */}
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 flex-grow">
                {webinar.subtitle}
              </p>

              {/* Enhanced CTA Section */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  {/* Action text */}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {webinar.status === 'upcoming' ? 'Register Now' : 'Watch Recording'}
                  </span>
                  
                  {/* Arrow with hover effect */}
                  <div className="flex items-center text-[#193ae6] dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-300">
                    {typeof iconToUse === 'string' ? (
                      <FaArrowRight className="w-4 h-4" />
                    ) : (
                      React.createElement(iconToUse, { className: "w-4 h-4" })
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle bottom accent line */}
            <div className="h-1 bg-gradient-to-r from-[#193ae6] to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left" />
          </article>
        );
      })}
    </div>
  );
};

export default WebinarGrid;