import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  id,
  className = '',
  icon: Icon,
  ...props 
}, ref) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-textSecondary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-textSecondary">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          className={`
            w-full bg-surface border rounded-lg px-4 py-3 text-textPrimary 
            transition-all duration-300 placeholder-textSecondary/50
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-border'}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
