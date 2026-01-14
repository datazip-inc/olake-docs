import React from 'react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  imageSrc: string;
  imageAlt?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  title,
  imageSrc,
  imageAlt
}) => {
  return (
    <div className="bg-[#1e40af] rounded-xl p-8 my-6 text-white max-w-[800px] mx-auto">
      <p className="text-xl font-medium leading-relaxed mb-6">
        "{quote}"
      </p>
      <div className="flex items-center gap-4 mt-4">
        <img 
          src={imageSrc} 
          alt={imageAlt || name}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <p className="m-0 font-semibold text-base">
            {name}
          </p>
          <p className="m-1 mt-1 text-sm opacity-90">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;

