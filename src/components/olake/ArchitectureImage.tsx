import React from "react";

const ArchitectureImage: React.FC = () => {
  return (
    <picture>
      {/* For extra small screens (xs) */}
      <source
        media="(max-width: 640px)"
        srcSet="/img/olake/cta-mobile.svg"
      />
      {/* For all other sizes (sm and above) */}
      <source
        media="(min-width: 641px)"
        srcSet="/img/olake/cta.svg"
      />
      <img
        src="/img/olake/cta.svg"
        alt="olake-architecture"
        className="z-10 my-4 mt-12 h-auto min-w-[220px] max-w-full"
      />
    </picture>
  );
};

export default ArchitectureImage;
