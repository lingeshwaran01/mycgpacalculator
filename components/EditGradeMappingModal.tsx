import React, { useState, useEffect } from 'react';
import { GradeOption, GradingScale } from '../types';
import Button from './shared/Button';
import Input from './shared/Input';

interface EditGradeMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGradeOptions: GradeOption[];
  defaultGradeOptions: GradeOption[]; // For reset functionality
  onSave: (updatedOptions: GradeOption[]) => void;
  scale: GradingScale;
}

const EditGradeMappingModal: React.FC<EditGradeMappingModalProps> = ({
  isOpen,
  onClose,
  currentGradeOptions,
  defaultGradeOptions,
  onSave,
  scale,
}) => {
  const [editableOptions, setEditableOptions] = useState<GradeOption[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({}); // { gradeValue: errorMessage }

  useEffect(() => {
    // Deep copy to prevent direct mutation of props
    setEditableOptions(JSON.parse(JSON.stringify(currentGradeOptions)));
    setErrors({}); // Clear errors when modal opens or options change
  }, [currentGradeOptions, isOpen]);

  if (!isOpen) return null;

  const handlePointChange = (gradeValue: string, newPoints: string) => {
    const point = parseFloat(newPoints);
    setEditableOptions(prevOptions =>
      prevOptions.map(opt =>
        opt.value === gradeValue ? { ...opt, points: isNaN(point) ? opt.points : point } : opt
      )
    );
    if (isNaN(point) || point < 0) {
        setErrors(prev => ({...prev, [gradeValue]: "Must be a non-negative number."}));
    } else {
        setErrors(prev => { const newErr = {...prev}; delete newErr[gradeValue]; return newErr;});
    }
  };

  const handleSave = () => {
    if (Object.keys(errors).length > 0) {
        alert("Please correct the errors before saving.");
        return;
    }
    onSave(editableOptions);
  };

  const handleResetToDefault = () => {
    setEditableOptions(JSON.parse(JSON.stringify(defaultGradeOptions)));
    setErrors({});
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="grade-editor-title"
    >
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 id="grade-editor-title" className="text-xl font-semibold text-mercury-black font-serif">
            Edit Grade Points ({scale} Scale)
          </h2>
          <button
            onClick={onClose}
            className="text-mercury-grey hover:text-mercury-black"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          Adjust the points for each grade according to your university's system. Changes are saved locally in your browser.
        </p>

        <div className="overflow-y-auto flex-grow pr-2 space-y-3">
          {editableOptions.map(option => (
            <div key={option.value} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-2 bg-slate-50 rounded">
              <span className="font-medium text-slate-700">{option.label.split(' (')[0]} ({option.value})</span>
              <span className="text-slate-500">=</span>
              <Input
                id={`grade-points-${option.value}`}
                type="number"
                value={option.points.toString()} // Input expects string
                onChange={e => handlePointChange(option.value, e.target.value)}
                className="text-sm"
                step="0.01"
                min="0"
                aria-label={`Points for grade ${option.value}`}
                error={errors[option.value]}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 border-t pt-4">
          <Button onClick={handleResetToDefault} variant="secondary">
            Reset to Default
          </Button>
          <Button onClick={handleSave} variant="primary" disabled={Object.keys(errors).length > 0}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditGradeMappingModal;