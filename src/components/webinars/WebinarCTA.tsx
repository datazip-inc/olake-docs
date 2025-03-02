// components/WebinarCTA.jsx

import React from 'react';
import { FaVideo } from 'react-icons/fa';
import CTAButton from './CTAButton';

// const BASE_PATH = process.env.NEXT_PUBLIC_BASE_URL || '';

type WebinarCTAProps = {
  CTAText: string;
};

const WebinarCTA: React.FC<WebinarCTAProps> = ({ CTAText }) => {
  return (
    <div className="bg-blue-600 text-white py-12 px-6 md:px-12 text-center rounded-lg shadow-lg">
      {/* CTA Title */}
      <h3 className="text-2xl md:text-3xl font-semibold mb-4">
        {CTAText}
      </h3>
      
      {/* Description */}
      <p className="text-lg mb-6">
        Secure your spot by registering below.
      </p>
      
      {/* CTA Button */}
      <CTAButton
        buttonText="Watch Our Webinar & Events Page!"
        icon={FaVideo}
        href= '/webinar'
        variant="outline"
        className="mx-auto text-white text-sm"
      />
    </div>
  );
};

export default WebinarCTA;
