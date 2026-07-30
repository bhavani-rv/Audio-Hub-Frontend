import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  fullWidth = false,
  isLoading = false,
  disabled = false,
  className = ''
}) => {
  const baseClasses = "flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";
  
  const variants = {
    primary: "bg-primary text-background hover:bg-opacity-90 focus:ring-primary shadow-[0_0_15px_rgba(102,252,241,0.2)] hover:shadow-[0_0_20px_rgba(102,252,241,0.4)]",
    secondary: "bg-surface border border-border text-textPrimary hover:bg-card focus:ring-border",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    ghost: "bg-transparent text-textPrimary hover:bg-surface focus:ring-surface"
  };

  const widthClass = fullWidth ? "w-full" : "";
  const sizeClass = "px-6 py-3";
  const disabledClass = disabled || isLoading ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

  return (
    <motion.button
      whileTap={!(disabled || isLoading) ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variants[variant]} ${widthClass} ${sizeClass} ${disabledClass} ${className}`}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </motion.button>
  );
};

export default Button;
