// components/webinars/EnhancedWebinarCard.tsx
import React from 'react';
import { useHistory } from "react-router-dom";
import Image from '@theme/IdealImage';
import { FaArrowRight, FaVideo, FaRegCalendarAlt, FaClock, FaUsers } from 'react-icons/fa';
import clsx from 'clsx';

interface EnhancedWebinarCardProps {
  title: string;
  subtitle: string;
  route: string;
  img: string;
  alt: string;
  status: 'upcoming' | 'live' | 'archived' | 'featured';
  date: string;
  duration?: string;
  attendees?: number;
  speakers?: string[];
  category?: 'webinar' | 'meetup' | 'event' | 'workshop';
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

const statusConfig = {
  upcoming: {
    badge: 'bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300',
    text: 'Upcoming',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  live: {
    badge: 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-300',
    text: 'Live Now',
    borderColor: 'border-red-200 dark:border-red-800'
  },
  archived: {
    badge: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',
    text: 'Watch Recording',
    borderColor: 'border-gray-200 dark:border-gray-700'
  },
  featured: {
    badge: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    text: 'Featured',
    borderColor: 'border-purple-200 dark:border-purple-800'
  }
};

const categoryIcons = {
  webinar: FaVideo,
  meetup: FaUsers,
  event: FaRegCalendarAlt,
  workshop: FaClock
};

const EnhancedWebinarCard: React.FC<EnhancedWebinarCardProps> = ({
  title,
  subtitle,
  route,
  img,
  alt,
  status,
  date,
  duration,
  attendees,
  speakers = [],
  category = 'webinar',
  variant = 'default',
  className
}) => {
  const router = useHistory();
  const statusStyle = statusConfig[status];
  const CategoryIcon = categoryIcons[category];

  const handleNavigation = () => {
    router.push(route);
  };

  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';

  return (
    <article
      className={clsx(
        'group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer',
        'border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600',
        'shadow-sm hover:shadow-xl hover:-translate-y-1',
        {
          'shadow-lg border-purple-200 dark:border-purple-800': isFeatured,
          'h-full flex flex-col': !isCompact,
          'flex flex-row items-center p-4': isCompact,
        },
        className
      )}
      onClick={handleNavigation}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            ⭐ Featured
          </span>
        </div>
      )}

      {/* Image Section */}
      <div className={clsx(
        'relative overflow-hidden',
        {
          'aspect-[16/9]': !isCompact,
          'w-24 h-24 rounded-lg flex-shrink-0': isCompact,
        }
      )}>
        <Image
          img={img}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay with play button for non-compact */}
        {!isCompact && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <FaVideo className="w-6 h-6 text-[#193ae6] ml-1" />
            </div>
          </div>
        )}

        {/* Status badge on image */}
        {!isCompact && (
          <div className="absolute top-4 right-4">
            <span className={clsx(
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              statusStyle.badge
            )}>
              {status === 'live' && <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />}
              {statusStyle.text}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={clsx(
        'flex-1 flex flex-col',
        {
          'p-6': !isCompact,
          'ml-4': isCompact,
        }
      )}>
        {/* Category and Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <CategoryIcon className="w-4 h-4 mr-1" />
            <span className="capitalize">{category}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <FaRegCalendarAlt className="w-3 h-3 mr-1" />
            <span>{date}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className={clsx(
          'font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-[#193ae6] dark:group-hover:text-blue-400 transition-colors line-clamp-2',
          {
            'text-xl': !isCompact,
            'text-lg': isCompact,
          }
        )}>
          {title}
        </h3>

        {/* Subtitle */}
        {!isCompact && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            {duration && (
              <div className="flex items-center">
                <FaClock className="w-3 h-3 mr-1" />
                <span>{duration}</span>
              </div>
            )}
            {attendees && (
              <div className="flex items-center">
                <FaUsers className="w-3 h-3 mr-1" />
                <span>{attendees}+ attendees</span>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="flex items-center text-[#193ae6] dark:text-blue-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
            <span className="mr-1">
              {status === 'upcoming' ? 'Register' : 'Watch Now'}
            </span>
            <FaArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Speakers */}
        {speakers.length > 0 && !isCompact && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Speakers:</span>
              <div className="flex -space-x-1">
                {speakers.slice(0, 3).map((speaker, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 border-2 border-white dark:border-gray-900"
                    title={speaker}
                  >
                    {speaker.charAt(0).toUpperCase()}
                  </div>
                ))}
                {speakers.length > 3 && (
                  <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 border-2 border-white dark:border-gray-900">
                    +{speakers.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Featured glow effect */}
      {isFeatured && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 pointer-events-none rounded-xl" />
      )}
    </article>
  );
};

export default EnhancedWebinarCard;