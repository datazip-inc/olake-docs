// components/CTAButton.jsx

import React from 'react';
import PropTypes from 'prop-types';
import Link from '@docusaurus/Link'

const CTAButton = ({
  title,
  buttonText,
  icon: Icon,
  href = '#',
  onClick,
  variant = 'primary',
  className = '',
}) => {
  const baseClasses =
    'inline-flex items-center px-8 py-4 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';

    const variants = {
      primary:
        'bg-blue-600 text-white hover:bg-blue-700 border-none dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-blue-500',
      secondary:
        'bg-green-600 text-white hover:bg-green-800 border-none dark:bg-green-700 dark:hover:bg-green-800 focus:ring-green-800',
      outline:
        'text-blue-600 hover:bg-blue-300 border-2 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900 focus:ring-blue-500',
    };
    

  return (
    <div className="flex flex-col items-center space-y-2">
      {title && (
        <h3 className="text-lg font-semibol text-black dark:text-white">
          {title}
        </h3>
      )}
      <Link legacyBehavior href={href}>
        <a
          onClick={onClick}
          target="_blank"
          className={`${baseClasses} ${variants[variant]} ${className}`}
        >
          {Icon && <Icon className="mr-4 text-white" />}
          <span className='text-white'>{buttonText}</span>
        </a>
      </Link>
    </div>
  );
};

CTAButton.propTypes = {
  /** Optional title displayed above the button */
  title: PropTypes.string,
  /** Text displayed inside the button */
  buttonText: PropTypes.string.isRequired,
  /** Icon component from react-icons/fa or similar */
  icon: PropTypes.elementType,
  /** URL or path the button links to */
  href: PropTypes.string,
  /** Optional click handler */
  onClick: PropTypes.func,
  /** Variant of the button ('primary', 'secondary', 'outline') */
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  /** Additional Tailwind CSS classes */
  className: PropTypes.string,
};

export default CTAButton;
