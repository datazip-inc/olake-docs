import React from "react";

interface HrProps {
  className?: string;
}

const Hr: React.FC<HrProps> = ({ className = "" }) => {
  return <hr className={`dark:bg-gray-800 ${className}`} />;
};

export default Hr;
