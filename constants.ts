import { GradingScale, GradeOption } from './types';

export const SCALES = [
  { value: GradingScale.SCALE_4, label: "4.0 Scale" },
  { value: GradingScale.SCALE_10, label: "10.0 Scale" },
];

const BASE_GRADE_OPTIONS_4_0: Readonly<GradeOption[]> = [
  { label: "A+ (4.0)", value: "A+", points: 4.0 },
  { label: "A (4.0)", value: "A", points: 4.0 },
  { label: "A- (3.7)", value: "A-", points: 3.7 },
  { label: "B+ (3.3)", value: "B+", points: 3.3 },
  { label: "B (3.0)", value: "B", points: 3.0 },
  { label: "B- (2.7)", value: "B-", points: 2.7 },
  { label: "C+ (2.3)", value: "C+", points: 2.3 },
  { label: "C (2.0)", value: "C", points: 2.0 },
  { label: "C- (1.7)", value: "C-", points: 1.7 },
  { label: "D+ (1.3)", value: "D+", points: 1.3 },
  { label: "D (1.0)", value: "D", points: 1.0 },
  { label: "F (0.0)", value: "F", points: 0.0 },
];

const BASE_GRADE_OPTIONS_10_0: Readonly<GradeOption[]> = [
  { label: "O (10)", value: "O", points: 10 },
  { label: "A+ (9)", value: "A+", points: 9 },
  { label: "A (8)", value: "A", points: 8 },
  { label: "B+ (7)", value: "B+", points: 7 },
  { label: "B (6)", value: "B", points: 6 },
  { label: "C (5)", value: "C", points: 5 },
  { label: "P (4)", value: "P", points: 4 }, // P for Pass
  { label: "F (0)", value: "F", points: 0 }, // F for Fail
];

export const getDefaultGradeOptions = (scale: GradingScale): GradeOption[] => {
  const options = scale === GradingScale.SCALE_4 ? BASE_GRADE_OPTIONS_4_0 : BASE_GRADE_OPTIONS_10_0;
  return JSON.parse(JSON.stringify(options)); // Deep copy
};

export const DEFAULT_GRADE_4_0 = BASE_GRADE_OPTIONS_4_0[1].value; // Default to 'A'
export const DEFAULT_GRADE_10_0 = BASE_GRADE_OPTIONS_10_0[1].value; // Default to 'A+'

export const DEFAULT_CONVERSION_FACTORS = {
  CGPA_TO_PERCENTAGE_4_0: 25,
  CGPA_TO_PERCENTAGE_10_0: 9.5,
  PERCENTAGE_TO_CGPA_4_0: 25,
  PERCENTAGE_TO_CGPA_10_0: 9.5,
};
