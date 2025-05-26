import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  error?: string;
  Icon?: React.ElementType;
  labelClassName?: string; // New prop
}

const Input: React.FC<InputProps> = ({ label, id, error, Icon, labelClassName, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className={`block text-sm font-medium text-slate-700 mb-1 ${labelClassName || ''}`}>
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
        )}
        <input
          id={id}
          {...props}
          className={`
            block w-full px-4 py-2.5 border
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 text-red-700 placeholder-red-400 focus:border-red-500' : 'border-slate-300 focus:border-academic-blue'}
            rounded-lg shadow-sm
            focus:ring-1 focus:ring-academic-blue focus:outline-none
            transition duration-150 ease-in-out
            sm:text-sm
            bg-slate-50
            disabled:bg-slate-200 disabled:cursor-not-allowed
            ${props.className || ''}
          `}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;