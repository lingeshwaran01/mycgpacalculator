
import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  id: string;
  options: { value: string | number; label: string }[];
  error?: string;
}

const Select: React.FC<SelectProps> = ({ label, id, options, error, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={id}
        {...props}
        className={`
          block w-full px-3 py-2.5 border
          ${error ? 'border-red-500 text-red-700' : 'border-slate-300 focus:border-academic-blue'}
          rounded-lg shadow-sm
          focus:ring-1 focus:ring-academic-blue focus:outline-none
          transition duration-150 ease-in-out
          sm:text-sm
          bg-slate-50
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
