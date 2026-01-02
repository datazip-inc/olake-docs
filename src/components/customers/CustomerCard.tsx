import React from 'react';
import { useHistory } from "react-router-dom";
import Image from '@theme/IdealImage';
import { FaArrowRight } from 'react-icons/fa';
import clsx from 'clsx';
import { CustomerCategory } from '../../types/customer';

interface CustomerCardProps {
  title: string;
  description: string;
  route: string;
  img: string;
  alt: string;
  companyName: string;
  category: CustomerCategory;
}

const CustomerCard: React.FC<CustomerCardProps> = ({
  title,
  description,
  route,
  img,
  alt,
  companyName,
  category
}) => {
  const router = useHistory();

  const handleNavigation = () => {
    router.push(route);
  };

  // Category pill colors
  const categoryColors = {
    [CustomerCategory.B2B]: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    [CustomerCategory.CustomerInternet]: 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    [CustomerCategory.Fintech]: 'bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  };

  const pillColor = categoryColors[category];

  return (
    <article
      className="group flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border-0 transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer relative"
      onClick={handleNavigation}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
          <Image
            img={img}
            alt={alt}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
          />
          {/* Company Logo/Name Overlay */}
          <div className="absolute bottom-4 left-4 z-10">
            <span className="text-white font-bold text-xl drop-shadow-lg">
              {companyName}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-6 space-y-4">
        {/* Category Pill */}
        <div className="flex items-start">
          <span className={clsx(
            'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
            pillColor
          )}>
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-50 leading-tight line-clamp-2 group-hover:text-[#193ae6] dark:group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 flex-grow">
          {description}
        </p>

        {/* CTA Section */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Read Story
            </span>
            <div className="flex items-center text-[#193ae6] dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-300">
              <FaArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-[#193ae6] to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left" />
    </article>
  );
};

export default CustomerCard;







