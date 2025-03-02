import React from "react";

/**
 * ArchitectureImage component
 * Shows 4 different images based on:
 *  - Light vs Dark theme (Tailwind's `.dark` class)
 *  - Mobile vs Desktop (`sm:` breakpoint at 640px)
 */
const ArchitectureImage: React.FC = () => {
  return (
    <div className="relative z-10 my-4 mt-12">
      {/* Light mode + Mobile (<640px) */}
      <img
        src="/img/olake/cta-mobile-light.svg"
        alt="OLake architecture (light mobile)"
        className="
          block
          dark:hidden
          sm:hidden
          h-auto
          w-auto
        "
      />

      {/* Light mode + Desktop (>=640px) */}
      <img
        src="/img/olake/cta-light.svg"
        alt="OLake architecture (light desktop)"
        className="
          hidden
          sm:block
          dark:hidden
          h-auto
          min-w-[220px]
          max-w-full
        "
      />



      {/* Dark mode + Mobile (<640px) */}
      <img
        src="/img/olake/cta-mobile-dark.svg"
        alt="OLake architecture (dark mobile)"
        className="
          dark:block
          dark:sm:hidden     
          hidden
          h-auto
          min-w-[220px]
          max-w-full
        "
      />

      {/* Dark mode + Desktop (>=640px) */}
      <img
        src="/img/olake/cta-dark.svg"
        alt="OLake architecture (dark desktop)"
        className="
          hidden          
          sm:hidden       
          dark:sm:block   
          h-auto
          min-w-[220px]
          max-w-full
        "
      />
    </div>
  );
};

export default ArchitectureImage;


