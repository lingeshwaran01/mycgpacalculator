export enum GradingScale {
  SCALE_4 = "4.0",
  SCALE_10 = "10.0",
}

export interface GradeOption {
  label: string;
  value: string; // The grade itself, e.g., "A+", "O"
  points: number; // Now potentially editable
}

export interface Course {
  id: string;
  courseName: string; // New field for course name
  credits: string; // Store as string for input field compatibility, parse to number for calculation
  grade: string; // Value from GradeOption
}

export interface Semester {
  id: string;
  name: string; // e.g., "Semester 1", editable
  courses: Course[];
  sgpa?: number | null; // Calculated Semester Grade Point Average
}

export enum CalculatorMode {
  CGPA_TO_PERCENTAGE = "cgpaToPercentage",
  PERCENTAGE_TO_CGPA = "percentageToCgpa",
  GRADE_POINT_CALCULATOR = "gradePointCalculator",
}

// For storing custom conversion factors
export interface ConversionFactors {
  cgpaToPercentage: { [key in GradingScale]?: number };
  percentageToCgpa: { [key in GradingScale]?: number };
}
