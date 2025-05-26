import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-mercury-black via-gray-700 to-mercury-grey text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-5 flex items-center justify-center sm:justify-between">
        <div className="flex items-center space-x-2">
          {/* Mercury Planet SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className="w-10 h-10 text-academic-blue-light"
          >
            <circle cx="32" cy="32" r="20" fill="#b0b0b0" />
            <circle cx="30" cy="28" r="2" fill="#888" />
            <circle cx="36" cy="36" r="3" fill="#888" />
            <circle cx="24" cy="36" r="1.5" fill="#aaa" />
            <circle cx="40" cy="28" r="1" fill="#aaa" />
          </svg>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight">
            <span className="text-white"></span> <span className="text-academic-blue-light">My CGPA Calculator</span>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;

