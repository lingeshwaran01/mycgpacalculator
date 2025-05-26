import React, { useState, useCallback, useEffect } from 'react';
import Input from './shared/Input';
import Select from './shared/Select';
import Button from './shared/Button';
import ResultCard from './shared/ResultCard';
import InfoTooltip from './shared/InfoTooltip';
import { GradingScale } from '../types';
import { SCALES, DEFAULT_CONVERSION_FACTORS } from '../constants';

const PercentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3c-.005 0-.01 0-.014 0H7.514a3 3 0 0 0-2.986 1.935A3.001 3.001 0 0 0 5.039 9H5.25V7.5h1.499a3 3 0 0 0 2.986-1.935A3.001 3.001 0 0 0 9.25 3H9Zm0 0h3v.008H9V3Zm0 3.75h3v.008H9V6.75Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.5 7.5-6.75 6.75m0 0L16.5 21" />
    </svg>
);

const PercentageToCgpaConverter: React.FC = () => {
  const [percentage, setPercentage] = useState<string>('');
  const [scale, setScale] = useState<GradingScale>(GradingScale.SCALE_4);
  const [cgpa, setCgpa] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [conversionDivisor, setConversionDivisor] = useState<string>(
    String(DEFAULT_CONVERSION_FACTORS.PERCENTAGE_TO_CGPA_4_0)
  );

  const getLocalStorageKey = useCallback(() => `conversionFactor_percToCgpa_${scale}`, [scale]);

  useEffect(() => {
    const storedDivisor = localStorage.getItem(getLocalStorageKey());
    const defaultDivisor = scale === GradingScale.SCALE_4
      ? DEFAULT_CONVERSION_FACTORS.PERCENTAGE_TO_CGPA_4_0
      : DEFAULT_CONVERSION_FACTORS.PERCENTAGE_TO_CGPA_10_0;
    setConversionDivisor(storedDivisor || String(defaultDivisor));
    setCgpa(null); // Reset result when scale or factor changes
    setError('');
  }, [scale, getLocalStorageKey]);

  const handleDivisorChange = (value: string) => {
    setConversionDivisor(value);
    const divisor = parseFloat(value);
    if (!isNaN(divisor) && divisor > 0) {
      localStorage.setItem(getLocalStorageKey(), value);
      setError('');
    } else {
      setError('Divisor must be a positive number.');
    }
    setCgpa(null);
  };

  const handleCalculate = useCallback(() => {
    setError('');
    setCgpa(null);
    const percentageValue = parseFloat(percentage);
    const divisor = parseFloat(conversionDivisor);

    if (isNaN(percentageValue) || percentageValue < 0 || percentageValue > 100) {
      setError('Please enter a valid percentage between 0 and 100.');
      return;
    }
    if (isNaN(divisor) || divisor <= 0) {
      setError('Divisor must be a positive number.');
      return;
    }

    let calculatedCgpa: number;
    calculatedCgpa = percentageValue / divisor;

    if (scale === GradingScale.SCALE_4) {
      if (calculatedCgpa > 4.0) calculatedCgpa = 4.0; // Cap at 4.0
    } else { // SCALE_10
      if (calculatedCgpa > 10.0) calculatedCgpa = 10.0; // Cap at 10.0
    }

    setCgpa(parseFloat(calculatedCgpa.toFixed(2)));
  }, [percentage, scale, conversionDivisor]);

  const tooltipText = `The conversion divisor. Default for ${scale} scale is ${scale === GradingScale.SCALE_4 ? DEFAULT_CONVERSION_FACTORS.PERCENTAGE_TO_CGPA_4_0 : DEFAULT_CONVERSION_FACTORS.PERCENTAGE_TO_CGPA_10_0}. You can customize this. CGPA = Percentage / Divisor (capped at scale max).`;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-mercury-black mb-1 font-serif">Percentage to CGPA</h2>
      <p className="text-sm text-slate-600 mb-6">Convert your percentage into an equivalent CGPA. You can customize the conversion divisor.</p>
      
      <div className="space-y-6">
        <Input
          label="Your Percentage"
          id="percentage"
          type="number"
          placeholder="e.g., 85 or 76.5"
          value={percentage}
          onChange={(e) => { setPercentage(e.target.value); setCgpa(null); setError(prev => prev.includes('percentage') ? '' : prev);}}
          error={error && error.includes('percentage') ? error : undefined}
          Icon={PercentIcon}
        />
         <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4 items-end">
            <Select
              label="Target Grading Scale"
              id="targetScale"
              options={SCALES}
              value={scale}
              onChange={(e) => { setScale(e.target.value as GradingScale);}}
            />
            <div></div>
        </div>
        <div className="flex items-end">
            <Input
              label="Conversion Divisor"
              id="conversionDivisor"
              type="number"
              placeholder="e.g., 25 or 9.5"
              value={conversionDivisor}
              onChange={(e) => handleDivisorChange(e.target.value)}
              error={error && error.includes('Divisor') ? error : undefined}
            />
            <InfoTooltip text={tooltipText} />
        </div>
        <Button onClick={handleCalculate} className="w-full" size="lg" disabled={!!(error && error.includes('Divisor'))}>
          Calculate CGPA
        </Button>
      </div>

      {cgpa !== null && (
        <ResultCard title="Equivalent CGPA" value={cgpa} unit={`on ${scale} scale`} />
      )}
      {error && !error.includes('percentage') && !error.includes('Divisor') &&(
         <p className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
      )}
    </div>
  );
};

export default PercentageToCgpaConverter;