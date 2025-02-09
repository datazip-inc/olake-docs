import React from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "dark";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  href?: string;
  target?: string;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const AwesomeButton: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  icon,
  iconPosition = "left",
  loading = false,
  onClick,
  href,
  target,
  children,
  className = "",
}) => {
  // Base styling: we build from scratch using a <div> with role="button" for full control.
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg focus:outline-none transition-colors duration-200";

  // Variants: Adjust background, text colors, and hover states.
  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-[#040cdb] text-white hover:bg-[#030896]",
    secondary: "bg-green-600 text-white hover:bg-green-700",
    outline: "bg-transparent text-blue-600 hover:bg-blue-100",
    dark: "bg-gray-800 text-white hover:bg-gray-900",
  };

  // Sizes: Adjust padding and font size.
  const sizeClasses: Record<ButtonSize, string> = {
    small: "px-3 py-1 text-sm font-bold",
    medium: "px-6 py-1 text-sm font-bold",
    large: "px-8 py-4 text-lg font-bold",
  };

  // Combine classes with additional custom className if provided.
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
    className || ""
  }`;

  const handleClick = () => {
    if (loading) return;
    if (href) {
      if (target) {
        window.open(href, target);
      } else {
        window.location.href = href;
      }
    } else if (onClick) {
      onClick();
    }
  };

  
  // Render our custom button using a <div> with role="button" and accessibility props.
  return (
    <div
      role="button"
      tabIndex={0}
      className={classes}
      onClick={handleClick}

      onKeyPress={(e) => {
        if (!loading && (e.key === "Enter" || e.key === " ")) {
          onClick && onClick();
        }
      }}
      style={{ cursor: loading ? "not-allowed" : "pointer" }}
    >
      {loading ? (
        // Simple spinner SVG (adjust size with Tailwind classes if needed)
        <svg
          className="animate-spin h-5 w-5 mr-2 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      ) : null}
      {icon && iconPosition === "left" && !loading && (
        <span className="mr-2 text-2xl mt-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </div>
  );
};

export default AwesomeButton;
