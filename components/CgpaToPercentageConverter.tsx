import React, { useState, useCallback, useEffect } from 'react';
import Input from './shared/Input';
import Select from './shared/Select';
import Button from './shared/Button';
import ResultCard from './shared/ResultCard';
import InfoTooltip from './shared/InfoTooltip';
import { GradingScale } from '../types';
import { SCALES, DEFAULT_CONVERSION_FACTORS } from '../constants';

const CalculatorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM9 7.5h2.25l2.25 2.25V18H9V7.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75v2.25H18V18h-2.25Zm-7.5 0v2.25H6V18h2.25Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9.75A2.25 2.25 0 0 0 19.5 7.5H4.5A2.25 2.25 0 0 0 2.25 9.75v10.5A2.25 2.25 0 0 0 4.5 22.5h15a2.25 2.25 0 0 0 2.25-2.25V9.75Z" />
    </svg>
);

const CgpaToPercentageConverter: React.FC = () => {
  const [cgpa, setCgpa] = useState<string>('');
  const [scale, setScale] = useState<GradingScale>(GradingScale.SCALE_4);
  const [percentage, setPercentage] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [conversionFactor, setConversionFactor] = useState<string>(
    String(DEFAULT_CONVERSION_FACTORS.CGPA_TO_PERCENTAGE_4_0)
  );

  const getLocalStorageKey = useCallback(() => `conversionFactor_cgpaToPerc_${scale}`, [scale]);

  useEffect(() => {
    const storedFactor = localStorage.getItem(getLocalStorageKey());
    const defaultFactor = scale === GradingScale.SCALE_4
      ? DEFAULT_CONVERSION_FACTORS.CGPA_TO_PERCENTAGE_4_0
      : DEFAULT_CONVERSION_FACTORS.CGPA_TO_PERCENTAGE_10_0;
    setConversionFactor(storedFactor || String(defaultFactor));
    setPercentage(null); // Reset result when scale or factor changes
    setError('');
  }, [scale, getLocalStorageKey]);

  const handleFactorChange = (value: string) => {
    setConversionFactor(value);
    const factor = parseFloat(value);
    if (!isNaN(factor) && factor > 0) {
      localStorage.setItem(getLocalStorageKey(), value);
      setError('');
    } else {
      setError('Multiplier must be a positive number.');
    }
    setPercentage(null);
  };

  const handleCalculate = useCallback(() => {
    setError('');
    setPercentage(null);
    const cgpaValue = parseFloat(cgpa);
    const factor = parseFloat(conversionFactor);

    if (isNaN(cgpaValue) || cgpaValue < 0) {
      setError('Please enter a valid non-negative CGPA.');
      return;
    }
    if (isNaN(factor) || factor <= 0) {
      setError('Multiplier must be a positive number.');
      return;
    }

    let calculatedPercentage: number;
    if (scale === GradingScale.SCALE_4) {
      if (cgpaValue > 4.0) {
        setError('CGPA cannot exceed 4.0 for this scale.');
        return;
      }
      calculatedPercentage = cgpaValue * factor;
    } else { // SCALE_10
      if (cgpaValue > 10.0) {
        setError('CGPA cannot exceed 10.0 for this scale.');
        return;
      }
      calculatedPercentage = cgpaValue * factor; 
    }
    
    setPercentage(parseFloat(calculatedPercentage.toFixed(2)));
  }, [cgpa, scale, conversionFactor]);

  const tooltipText = `The conversion multiplier. Default for ${scale} scale is ${scale === GradingScale.SCALE_4 ? DEFAULT_CONVERSION_FACTORS.CGPA_TO_PERCENTAGE_4_0 : DEFAULT_CONVERSION_FACTORS.CGPA_TO_PERCENTAGE_10_0}. You can customize this based on your university's formula. Percentage = CGPA * Multiplier.`;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-mercury-black mb-1 font-serif">CGPA to Percentage</h2>
      <p className="text-sm text-slate-600 mb-6">Convert your CGPA into an equivalent percentage. You can customize the conversion multiplier.</p>
      
      <div className="space-y-6">
        <Input
          label="Your CGPA"
          id="cgpa"
          type="number"
          placeholder="e.g., 3.5 or 8.8"
          value={cgpa}
          onChange={(e) => { setCgpa(e.target.value); setPercentage(null); setError(prev => prev.includes('CGPA') ? '' : prev); }}
          error={error && error.includes('CGPA') ? error : undefined}
          Icon={CalculatorIcon}
        />
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4 items-end">
          <Select
            label="Grading Scale"
            id="scale"
            options={SCALES}
            value={scale}
            onChange={(e) => { setScale(e.target.value as GradingScale); }}
          />
          <div> {/* Placeholder for alignment, or add another element here if needed */} </div>
        </div>
         <div className="flex items-end">
            <Input
              label="Conversion Multiplier"
              id="conversionFactor"
              type="number"
              placeholder="e.g., 25 or 9.5"
              value={conversionFactor}
              onChange={(e) => handleFactorChange(e.target.value)}
              error={error && error.includes('Multiplier') ? error : undefined}
            />
            <InfoTooltip text={tooltipText} />
        </div>
        <Button onClick={handleCalculate} className="w-full" size="lg" disabled={!!(error && error.includes('Multiplier'))}>
          Calculate Percentage
        </Button>
      </div>

      {percentage !== null && (
        <ResultCard title="Equivalent Percentage" value={percentage} unit="%" />
      )}
       {error && !error.includes('CGPA') && !error.includes('Multiplier') && (
        <p className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
      )}
    </div>
  );
};

export default CgpaToPercentageConverter;