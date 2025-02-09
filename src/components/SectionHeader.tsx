import React from "react";

export interface SectionHeaderProps {
  /** The main heading content; can be a string or JSX element */
  heading?: React.ReactNode;
  /** The subheading content; can be a string or JSX element */
  subheading?: React.ReactNode;
  /** Additional container classes, if needed */
  containerClassName?: string;
  /** Additional classes for the heading */
  headingClassName?: string;
  /** Additional classes for the subheading */
  subheadingClassName?: string;
  /** Additional classes for the horizontal rule */
  hrClassName?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  heading = (
    <>
      Get Started with <span className="font-normal">O</span>Lake
    </>
  ),
  subheading = "",
  containerClassName = "",
  headingClassName = "",
  subheadingClassName = "",
  hrClassName = "",
}) => {
  // Default container styles: center content, margin at the top, max width, and vertical stacking.
  const defaultContainerClasses = "mx-auto flex max-w-[90%] flex-col";
  // Default heading: a gradient text with responsive font sizes and transparent fill (to reveal the gradient)
  const defaultHeadingClasses =
    "z-10 bg-gradient-to-r from-white to-[#bdbdbd] bg-clip-text text-center text-[36px] md:text-[46px] lg:text-[56px] md:leading-[80px] text-transparent";
  // Default horizontal rule: no border, fixed height, and vertical margin
  const defaultHrClasses = "border-0 bg-gray-800 h-px my-4";
  // Default subheading: centered text with responsive font size and blue color
  const defaultSubheadingClasses =
    "text-center text-[16px] md:text-[18px] font-normal leading-normal text-blue-600";

  return (
    <div className={`${defaultContainerClasses} ${containerClassName}`}>
      <div className={`${defaultHeadingClasses} ${headingClassName}`}>
        {heading}
      </div>
      <hr className={`${defaultHrClasses} ${hrClassName}`} />
      <div className={`${defaultSubheadingClasses} ${subheadingClassName}`}>
        {subheading}
      </div>
    </div>
  );
};

export default SectionHeader;
