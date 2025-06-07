// src/components/NotFound.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-5xl font-bold text-academic-blue mb-4">404</h1>
      <p className="text-lg text-slate-600 mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-academic-blue text-white rounded-lg hover:bg-academic-blue-dark transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
