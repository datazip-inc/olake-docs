import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

interface LogoProps {
  className?: string;
  linkClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "", linkClassName = "" }) => {
  const { theme } = useTheme();

  return (
    <Link to="/" className={`inline-flex items-center ${linkClassName}`}>
      <span className={`text-primary-blue font-bold text-2xl ${className}`}>
        OLake
      </span>
    </Link>
  );
};

export default Logo;
