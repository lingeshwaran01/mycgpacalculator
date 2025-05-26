
import React, { useState } from 'react';

interface InfoTooltipProps {
  text: string;
}

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </svg>
);


const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-2">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="text-academic-blue hover:text-academic-blue-dark focus:outline-none"
        aria-label="Information"
      >
        <InfoIcon className="w-5 h-5" />
      </button>
      {isVisible && (
        <div
          className="absolute z-10 w-64 p-3 -mt-2 text-sm leading-tight text-white transform -translate-x-1/2 -translate-y-full bg-mercury-black rounded-lg shadow-lg left-1/2"
          role="tooltip"
        >
          {text}
          <div className="absolute w-3 h-3 bg-mercury-black transform rotate-45 -bottom-1.5 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
