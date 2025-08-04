import React from "react";
import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "outline" | "text";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  fullWidth?: boolean;
  isExternal?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  href,
  fullWidth = false,
  isExternal = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none";

  const variantClasses = {
    primary: "bg-primary-blue text-white hover:bg-blue-700",
    outline:
      "border border-primary-blue text-primary-blue hover:bg-blue-50 dark:hover:bg-blue-900/20",
    text: "text-primary-blue hover:bg-blue-50 dark:hover:bg-blue-900/20",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const allClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  if (href) {
    if (isExternal) {
      return (
        <a
          href={href}
          className={allClasses}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link to={href} className={allClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={allClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
