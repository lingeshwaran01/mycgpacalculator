import React from 'react';
import Input from './shared/Input';
import Select from './shared/Select';
import Button from './shared/Button';
import { Course, GradeOption } from '../types';

interface CourseRowProps {
  course: Course;
  semesterId: string; // For context in change/remove handlers
  courseIndex: number; // Index within the semester's courses array
  gradeOptions: GradeOption[];
  onCourseChange: (semesterId: string, courseId: string, field: keyof Course, value: string) => void;
  onRemoveCourse: (semesterId: string, courseId: string) => void;
  error?: { courseName?: string; credits?: string };
}

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.342.052.682.107 1.022.166m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);


const CourseRow: React.FC<CourseRowProps> = ({ course, semesterId, courseIndex, gradeOptions, onCourseChange, onRemoveCourse, error }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr_1.5fr_auto] gap-3 items-end p-3 mb-3 bg-slate-50 rounded-lg border border-slate-200 relative">
      <Input
        label={`Course ${courseIndex + 1} Name (Optional)`}
        id={`courseName-${course.id}`}
        type="text"
        placeholder="e.g., Intro to Programming"
        value={course.courseName}
        onChange={(e) => onCourseChange(semesterId, course.id, 'courseName', e.target.value)}
        aria-label={`Name for course ${courseIndex + 1}`}
        error={error?.courseName}
      />
      <Input
        label="Credits"
        id={`credits-${course.id}`}
        type="number"
        placeholder="e.g., 3"
        value={course.credits}
        onChange={(e) => onCourseChange(semesterId, course.id, 'credits', e.target.value)}
        min="0"
        step="0.1"
        aria-label={`Credits for course ${courseIndex + 1}`}
        error={error?.credits}
      />
      <Select
        label="Grade"
        id={`grade-${course.id}`}
        options={gradeOptions.map(g => ({ value: g.value, label: g.label }))}
        value={course.grade}
        onChange={(e) => onCourseChange(semesterId, course.id, 'grade', e.target.value)}
        aria-label={`Grade for course ${courseIndex + 1}`}
      />
      <Button 
        onClick={() => onRemoveCourse(semesterId, course.id)} 
        variant="danger" 
        size="md"
        className="sm:mt-0 h-[46px]" // Align height with inputs
        aria-label={`Remove course ${courseIndex + 1}`}
        title="Remove Course"
        Icon={TrashIcon}
        >
        <span className="sr-only sm:hidden">Remove</span>
      </Button>
    </div>
  );
};

export default CourseRow;