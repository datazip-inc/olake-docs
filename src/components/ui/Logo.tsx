import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  linkClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "", linkClassName = "" }) => {

  return (
    <Link to="/" className={`inline-flex items-center ${linkClassName}`}>
      <span className={`text-primary-blue font-bold text-2xl ${className}`}>
        OLake
      </span>
    </Link>
  );
};

export default Logo;
