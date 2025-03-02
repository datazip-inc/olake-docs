// HeroHeading.tsx

import React from 'react';

export interface HeroHeadingProps {
  /**
   * The main (large) heading content.
   * You can pass a string or JSX.
   */
  heading?: React.ReactNode;
  /**
   * The secondary subheading content.
   * You can pass a string or JSX.
   */
  subheading?: React.ReactNode;
  /**
   * Additional classes for the container
   */
  containerClassName?: string;
  /**
   * Additional classes for the main heading
   */
  headingClassName?: string;
  /**
   * Additional classes for the subheading
   */
  subheadingClassName?: string;
}

/**
 * HeroHeading Component
 * A hero section that displays a large gradient heading
 * and a smaller gradient subheading for maximum emphasis
 */
const HeroHeading: React.FC<HeroHeadingProps> = ({
  heading = (
    <>
      <span className="italic">Fastest</span> way to Replicate your{' '}
      <span className="font-bold">Database</span> data in Data Lake
    </>
  ),
  subheading = (
    <>
      OLake makes data replication faster by parallelizing full loads, leveraging change
      streams for real-time sync, and pulling data in a database-native format for efficient
      ingestion.
    </>
  ),
  containerClassName = '',
  headingClassName = '',
  subheadingClassName = '',
}) => {
  return (
    <div className={`relative z-10 mt-24 md:mt-36 ${containerClassName}`}>
      {/* Main Heading with gradient */}
      <h1
        className={`
          bg-gradient-to-r 
          from-slate-900 to-black 
          dark:from-gray-100 dark:to-gray-300 
          bg-clip-text
          text-transparent
          text-center
          text-[36px]
          leading-[36px]
          md:text-[46px]
          md:leading-[56px]
          lg:text-[66px]
          lg:leading-[72px]
          font-light
          ${headingClassName}
        `}
      >
        {heading}
      </h1>

      {/* Subheading with (slightly lighter) gradient */}
      <h2
        className={`
          mt-4
          bg-gradient-to-r 
          from-slate-700 to-slate-500
          dark:from-gray-300 dark:to-gray-500
          bg-clip-text
          text-transparent
          text-center
          text-[15px]
          leading-[20px]
          md:text-[14px]
          md:leading-[32px]
          lg:text-[18px]
          lg:leading-[28px]
          font-normal
          max-w-[800px]
          mx-auto
          ${subheadingClassName}
        `}
      >
        {subheading}
      </h2>
    </div>
  );
};

export default HeroHeading;
