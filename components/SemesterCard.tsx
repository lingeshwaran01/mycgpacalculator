
import React from 'react';
import Input from './shared/Input';
import Button from './shared/Button';
import CourseRow from './CourseRow';
import { Semester, GradeOption, Course } from '../types';

interface SemesterCardProps {
  semester: Semester;
  semesterIndex: number;
  onNameChange: (semesterId: string, newName: string) => void;
  onRemoveSemester: (semesterId: string) => void;
  onAddCourse: (semesterId: string) => void;
  onRemoveCourse: (semesterId: string, courseId: string) => void;
  onCourseChange: (semesterId: string, courseId: string, field: keyof Course, value: string) => void;
  gradeOptions: GradeOption[];
  errors: Record<string, { courseName?: string; credits?: string }>; // Errors for courses in this semester
}

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}> {/* Increased strokeWidth */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);


const SemesterCard: React.FC<SemesterCardProps> = ({
  semester,
  semesterIndex,
  onNameChange,
  onRemoveSemester,
  onAddCourse,
  onRemoveCourse,
  onCourseChange,
  gradeOptions,
  errors,
}) => {
  const semesterDisplayName = semester.name || `Semester ${semesterIndex + 1}`;
  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-slate-200 relative">
      <button
        onClick={() => onRemoveSemester(semester.id)}
        className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded-full hover:bg-red-100 flex items-center justify-center" // Adjusted position and padding
        aria-label={`Remove ${semesterDisplayName} and all its courses`}
        title={`Remove ${semesterDisplayName}`}
      >
        <CloseIcon className="w-6 h-6" /> {/* Increased size */}
      </button>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 pr-10"> {/* Increased pr to avoid overlap with larger X icon button area */}
        <Input
          id={`semester-name-${semester.id}`}
          value={semester.name}
          onChange={(e) => onNameChange(semester.id, e.target.value)}
          className="text-xl font-semibold text-academic-blue-dark border-0 border-b-2 border-transparent focus:border-academic-blue p-1 flex-grow"
          aria-label={`${semesterDisplayName} name`}
          labelClassName="sr-only"
          placeholder={`Semester ${semesterIndex + 1} Name`}
        />
        <div className="flex items-center space-x-2 self-start sm:self-center mt-2 sm:mt-0">
            {semester.sgpa !== undefined && semester.sgpa !== null && semester.courses.length > 0 && (
                <span className="text-sm font-semibold text-academic-blue bg-academic-blue-light px-3 py-1 rounded-full whitespace-nowrap">
                    SGPA: {semester.sgpa.toFixed(2)}
                </span>
            )}
        </div>
      </div>

      <div className="space-y-1 mb-4">
        {semester.courses.map((course, courseIdx) => (
          <CourseRow
            key={course.id}
            course={course}
            semesterId={semester.id}
            courseIndex={courseIdx}
            gradeOptions={gradeOptions}
            onCourseChange={onCourseChange}
            onRemoveCourse={onRemoveCourse}
            error={errors[course.id]}
          />
        ))}
        {semester.courses.length === 0 && (
            <p className="text-sm text-slate-500 py-2 px-1">No courses added to this semester yet. Click "Add Course" to begin.</p>
        )}
      </div>

      <Button 
        onClick={() => onAddCourse(semester.id)} 
        variant="secondary" 
        Icon={PlusIcon}
        size="md"
        className="w-full sm:w-auto"
      >
        Add Course to {semesterDisplayName}
      </Button>
    </div>
  );
};

export default SemesterCard;
