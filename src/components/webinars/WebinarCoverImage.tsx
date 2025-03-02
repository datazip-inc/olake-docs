import React from 'react';
import Image from '@theme/IdealImage';

type WebinarHeroProps = {
  src: string;
  alt: string;
};

const WebinarCoverImage: React.FC<WebinarHeroProps> = ({ src, alt }) => {
  return (
    <div className="relative w-full  rounded-lg overflow-hidden">
      <Image
        img={src}
        alt={alt}
        priority
        className="w-full h-full"
      />
    </div>
  );
};

export default WebinarCoverImage;
