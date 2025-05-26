import React from 'react';

interface AdPlaceholderProps {
  type: string;
  className?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ type, className }) => {
  let style: React.CSSProperties = {
    border: '2px dashed #e0e0e0', // Lighter dashed border (light grey)
    backgroundColor: '#f8f9fa',  // Very light, near-white background
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6c757d',           // Softer text color (medium grey)
    fontSize: '0.875rem',
    textAlign: 'center',
    margin: '1rem auto',
    padding: '1rem',
    borderRadius: '0.375rem', // Equivalent to rounded-md
  };

  if (type === "Top Banner" || type === "Bottom Banner") {
    style = { ...style, minHeight: '90px', width: '100%', maxWidth: '728px' };
  } else if (type === "Post-Calculation Square") {
     style = { ...style, minHeight: '250px', width: '100%', maxWidth: '300px', marginTop: '2rem' };
  }

  return (
    <div style={style} className={className} aria-label={`${type} Ad Placeholder`}>
      {type} Ad Placeholder
    </div>
  );
};

export default AdPlaceholder;
