
import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  Icon?: React.ElementType;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', Icon, className, ...props }) => {
  const baseStyles = "font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-academic-blue hover:bg-academic-blue-dark text-white focus:ring-academic-blue",
    secondary: "bg-slate-200 hover:bg-slate-300 text-mercury-black focus:ring-slate-400",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default Button;
