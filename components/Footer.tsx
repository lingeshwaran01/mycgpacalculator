
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-mercury-black text-slate-300 py-6 text-center mt-12">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} My CGPA Calculator. All rights reserved.
        </p>
        <p className="text-xs mt-1 text-mercury-grey">
          Disclaimer: This calculator provides estimates. Always verify with your institution.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
