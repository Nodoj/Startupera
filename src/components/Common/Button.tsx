import Link from "next/link";
import { ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}

const Button = ({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  target,
  rel,
}: ButtonProps) => {
  // Base styles
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Size variants
  const sizeStyles = {
    sm: "px-4 py-2 text-sm rounded-xs",
    md: "px-8 py-4 text-base rounded-md",
    lg: "px-10 py-5 text-lg rounded-md",
  };
  
  // Variant styles
  const variantStyles = {
    primary: "bg-primary text-white shadow-lg hover:bg-primary/80 hover:shadow-xl",
    secondary: "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 hover:border-white/30",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "bg-transparent text-primary hover:bg-primary/10",
  };
  
  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;
  
  // If href is provided, render as Link
  if (href) {
    // External link
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return (
        <a
          href={href}
          className={combinedClassName}
          target={target}
          rel={rel}
          onClick={disabled ? (e) => e.preventDefault() : undefined}
        >
          {children}
        </a>
      );
    }
    
    // Internal link
    return (
      <Link
        href={href}
        className={combinedClassName}
        target={target}
        onClick={disabled ? (e) => e.preventDefault() : undefined}
      >
        {children}
      </Link>
    );
  }
  
  // Regular button
  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
