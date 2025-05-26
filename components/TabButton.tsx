
import React from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-academic-blue
        ${
          isActive
            ? 'bg-academic-blue text-white shadow-md scale-105'
            : 'bg-slate-200 text-mercury-black hover:bg-slate-300'
        }
      `}
    >
      {label}
    </button>
  );
};

export default TabButton;
