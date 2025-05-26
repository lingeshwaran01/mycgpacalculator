
import React from 'react';

interface ResultCardProps {
  title: string;
  value: string | number | null;
  unit?: string;
  isLoading?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, value, unit, isLoading }) => {
  if (value === null && !isLoading) return null;

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-academic-blue to-academic-blue-dark rounded-xl shadow-xl text-white transition-all duration-300 ease-in-out transform hover:scale-105">
      <h3 className="text-lg font-medium text-academic-blue-light mb-1">{title}</h3>
      {isLoading ? (
        <div className="h-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <p className="text-4xl font-bold tracking-tight">
          {value}
          {unit && <span className="text-2xl font-normal ml-1">{unit}</span>}
        </p>
      )}
    </div>
  );
};

export default ResultCard;
