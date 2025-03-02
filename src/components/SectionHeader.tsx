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
  // Container: center content, set a max width, and stack them vertically
  const defaultContainerClasses =
    "mx-auto flex max-w-[90%] flex-col";

  // Heading:
  // - Light mode gradient: gray-900 → black
  // - Dark mode gradient: gray-100 → gray-300
  // - text-transparent with bg-clip-text ensures the gradient is visible through the text
  const defaultHeadingClasses = `
    z-10
    bg-gradient-to-r
    from-gray-900
    to-black
    dark:from-gray-100
    dark:to-gray-300
    bg-clip-text
    text-center
    text-transparent
    text-[36px]
    md:text-[46px]
    lg:text-[56px]
    md:leading-[80px]
  `;

  // Horizontal rule: subtle background color, with a dark mode variant
  const defaultHrClasses = `
    border-0
    bg-gray-800
    dark:bg-gray-600
    h-px
    my-4
  `;

  // Subheading: centered text, toggles color in dark mode
  const defaultSubheadingClasses = `
    text-center
    text-[16px]
    md:text-[18px]
    font-normal
    leading-normal
    text-blue-600
    dark:text-blue-400
  `;

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
