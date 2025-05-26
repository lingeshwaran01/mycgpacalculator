
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Select from './shared/Select';
import Button from './shared/Button';
import ResultCard from './shared/ResultCard';
import InfoTooltip from './shared/InfoTooltip';
// import CourseRow from './CourseRow'; // Will be used by SemesterCard
import SemesterCard from './SemesterCard'; // New component
import EditGradeMappingModal from './EditGradeMappingModal'; // New component
import AdPlaceholder from './shared/AdPlaceholder'; // Import shared component
import { GradingScale, Course, GradeOption, Semester } from '../types';
import { SCALES, getDefaultGradeOptions, DEFAULT_GRADE_4_0, DEFAULT_GRADE_10_0 } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import html2pdf from 'html2pdf.js';

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const TableIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5V7.568c0-.621.504-1.125 1.125-1.125m14.25 13.057V7.568c0-.621-.504-1.125-1.125-1.125M5.25 19.5V7.568M18 19.5V7.568m-4.5 11.932h1.5V4.5h-1.5v15Zm-3.75 0h1.5V4.5h-1.5v15Zm-3.75 0h1.5V4.5h-1.5v15Z" />
    </svg>
);

const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const ClipboardListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.172a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 5.25 6h6.75c.621 0 1.178.248 1.599.659M5.25 6v12m0 0a2.25 2.25 0 0 1-2.25-2.25V6.108c0-1.135.845-2.098 1.976-2.172a48.424 48.424 0 0 1 1.123-.08m-1.123.08a2.251 2.251 0 0 0-1.976 2.172V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V6.108c0-1.135-.845-2.098-1.976-2.172a48.424 48.424 0 0 0-1.123-.08" />
  </svg>
);

const GradePointCalculator: React.FC = () => {
  const [scale, setScale] = useState<GradingScale>(GradingScale.SCALE_4);
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: uuidv4(), name: 'Semester 1', courses: [{ id: uuidv4(), courseName: '', credits: '', grade: DEFAULT_GRADE_4_0 }], sgpa: null },
  ]);
  const [overallCgpa, setOverallCgpa] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, Record<string, { courseName?: string; credits?: string }>>>({}); // { semesterId: { courseId: { creditsError: 'msg' }}}
  
  const [activeGradeOptions, setActiveGradeOptions] = useState<GradeOption[]>(getDefaultGradeOptions(GradingScale.SCALE_4));
  const [isGradeEditorOpen, setIsGradeEditorOpen] = useState<boolean>(false);
  const [showGradeTable, setShowGradeTable] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);


  const getGradeLocalStorageKey = useCallback((currentScale: GradingScale) => `customGradeOptions_${currentScale}`, []);

  useEffect(() => {
    const loadedOptions = localStorage.getItem(getGradeLocalStorageKey(scale));
    if (loadedOptions) {
      setActiveGradeOptions(JSON.parse(loadedOptions));
    } else {
      setActiveGradeOptions(getDefaultGradeOptions(scale));
    }
    // Reset CGPA and errors when scale changes
    setOverallCgpa(null);
    setErrors({});
    // Update default grades for existing courses and reset SGPA if scale changes
     setSemesters(prevSemesters => prevSemesters.map(sem => ({
        ...sem,
        sgpa: null, // Reset SGPA
        courses: sem.courses.map(c => ({
            ...c,
            grade: scale === GradingScale.SCALE_4 ? DEFAULT_GRADE_4_0 : DEFAULT_GRADE_10_0
        }))
     })));

  }, [scale, getGradeLocalStorageKey]);

  const defaultGradeForCurrentScale = useMemo(() => {
    return scale === GradingScale.SCALE_4 ? DEFAULT_GRADE_4_0 : DEFAULT_GRADE_10_0;
  }, [scale]);

  const handleSaveGradeOptions = (updatedOptions: GradeOption[]) => {
    setActiveGradeOptions(updatedOptions);
    localStorage.setItem(getGradeLocalStorageKey(scale), JSON.stringify(updatedOptions));
    setIsGradeEditorOpen(false);
    setOverallCgpa(null); // Force recalculation
    setSemesters(prev => prev.map(s => ({...s, sgpa: null}))); // Reset SGPAs
  };
  
  const addSemester = () => {
    setSemesters([...semesters, { 
      id: uuidv4(), 
      name: `Semester ${semesters.length + 1}`, 
      courses: [{ id: uuidv4(), courseName: '', credits: '', grade: defaultGradeForCurrentScale }],
      sgpa: null
    }]);
    setOverallCgpa(null);
  };

  const removeSemester = (semesterId: string) => {
    setSemesters(prevSemesters => {
        const updatedSemesters = prevSemesters.filter(sem => sem.id !== semesterId);
        // Reset SGPAs and overall CGPA if a semester is removed
        if (updatedSemesters.length < prevSemesters.length) {
            setOverallCgpa(null);
            return updatedSemesters.map(s => ({...s, sgpa: null}));
        }
        return updatedSemesters; // No change if ID not found, though this shouldn't happen
    });
    setErrors(prev => { const newErrors = {...prev}; delete newErrors[semesterId]; return newErrors; });
  };

  const handleSemesterNameChange = (semesterId: string, name: string) => {
    setSemesters(semesters.map(sem => sem.id === semesterId ? { ...sem, name } : sem));
  };

  const addCourseToSemester = (semesterId: string) => {
    setSemesters(semesters.map(sem => 
      sem.id === semesterId 
        ? { ...sem, sgpa: null, courses: [...sem.courses, { id: uuidv4(), courseName: '', credits: '', grade: defaultGradeForCurrentScale }] }
        : sem
    ));
    setOverallCgpa(null);
  };

  const removeCourseFromSemester = (semesterId: string, courseId: string) => {
    setSemesters(semesters.map(sem => 
      sem.id === semesterId 
        ? { ...sem, sgpa: null, courses: sem.courses.filter(c => c.id !== courseId) }
        : sem
    ));
    setErrors(prev => {
        const newSemErrors = {...(prev[semesterId] || {})};
        delete newSemErrors[courseId];
        return {...prev, [semesterId]: newSemErrors};
    });
    setOverallCgpa(null);
  };

  const handleCourseChange = (semesterId: string, courseId: string, field: keyof Course, value: string) => {
    setSemesters(semesters.map(sem => 
      sem.id === semesterId 
        ? { ...sem, sgpa: null, courses: sem.courses.map(c => c.id === courseId ? { ...c, [field]: value } : c) }
        : sem
    ));
    setOverallCgpa(null);
    // Clear specific error for this field if it's being changed
    setErrors(prev => {
        const semErrors = prev[semesterId] || {};
        const courseErrors = semErrors[courseId] || {};
        const newCourseErrors = { ...courseErrors };
        if (field === 'credits') delete newCourseErrors.credits;
        // if (field === 'courseName') delete newCourseErrors.courseName; // if courseName validation is added

        return { ...prev, [semesterId]: { ...semErrors, [courseId]: newCourseErrors }};
    });
  };

  const validateAllCourses = (): boolean => {
    let isValid = true;
    const newGlobalErrors: Record<string, Record<string, { courseName?: string; credits?: string }>> = {};

    semesters.forEach(semester => {
      newGlobalErrors[semester.id] = {};
      if(semester.courses.length === 0) {
        // Optionally handle empty semesters - for now, they just won't contribute to CGPA
        return;
      }
      semester.courses.forEach(course => {
        const creditValue = parseFloat(course.credits);
        let courseError: { courseName?: string; credits?: string } = {};
        if (isNaN(creditValue) || creditValue <= 0) {
          courseError.credits = 'Credits must be > 0.';
          isValid = false;
        }
        // Add courseName validation if needed
        // if (!course.courseName.trim()) {
        //   courseError.courseName = 'Name required.';
        //   isValid = false;
        // }
        if (Object.keys(courseError).length > 0) {
            newGlobalErrors[semester.id][course.id] = courseError;
        }
      });
    });
    setErrors(newGlobalErrors);
    return isValid;
  };

  const calculateOverallAndSGPAs = useCallback(() => {
    if (!validateAllCourses()) {
      setOverallCgpa(null);
      setSemesters(prev => prev.map(s => ({...s, sgpa: null})));
      return;
    }
    
    let grandTotalCredits = 0;
    let grandTotalGradePoints = 0;
    const updatedSemesters = [...semesters]; 

    updatedSemesters.forEach(semester => {
      if(semester.courses.length === 0) {
        semester.sgpa = null; 
        return;
      }
      let semesterTotalCredits = 0;
      let semesterTotalGradePoints = 0;
      semester.courses.forEach(course => {
        const creditValue = parseFloat(course.credits);
        const selectedGradeOption = activeGradeOptions.find(opt => opt.value === course.grade);
        
        if (!isNaN(creditValue) && creditValue > 0 && selectedGradeOption) {
          semesterTotalCredits += creditValue;
          semesterTotalGradePoints += creditValue * selectedGradeOption.points;
        }
      });

      if (semesterTotalCredits > 0) {
        semester.sgpa = parseFloat((semesterTotalGradePoints / semesterTotalCredits).toFixed(2));
        grandTotalCredits += semesterTotalCredits;
        grandTotalGradePoints += semesterTotalGradePoints;
      } else {
        semester.sgpa = 0; 
      }
    });
    
    setSemesters(updatedSemesters);

    if (grandTotalCredits === 0) {
      // Set to 0 if there are semesters with courses attempted (even if all invalid credits), 
      // or null if no courses/semesters at all or only empty semesters.
      const hasAttemptedCourses = updatedSemesters.some(s => s.courses.length > 0);
      setOverallCgpa(hasAttemptedCourses ? 0 : null);
      return;
    }
    setOverallCgpa(parseFloat((grandTotalGradePoints / grandTotalCredits).toFixed(2)));

  }, [semesters, activeGradeOptions]);


  const generatePdfContent = () => {
    let html = `
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .pdf-container { width: 100%; }
        h1, h2, h3 { color: #0284C7; font-family: 'Lora', serif; }
        h1 { text-align: center; margin-bottom: 20px; font-size: 1.8em; }
        h2 { margin-top: 20px; border-bottom: 1px solid #ccc; padding-bottom: 5px; font-size: 1.4em;}
        h3 { margin-top: 15px; font-size: 1.2em; color: #0369A1;}
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.9em; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f0f9ff; font-weight: bold; }
        .summary-card { background-color: #e0f2fe; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
        .summary-card p { margin: 5px 0; font-size: 1.2em; }
        .summary-card strong { font-size: 1.6em; color: #0369A1; }
        .grade-mapping-table { margin-top: 30px; }
        .grade-mapping-table ul { list-style: none; padding: 0; column-count: 2; column-gap: 20px; }
        .grade-mapping-table li { background-color: #f9fafb; margin-bottom: 6px; padding: 6px 8px; border-radius: 4px; border: 1px solid #eee;}
        .semester-block { margin-bottom: 25px; page-break-inside: avoid; }
      </style>
      <div class="pdf-container">
        <h1>Academic Performance Report</h1>
        <div class="summary-card">
          <h2>Overall CGPA</h2>
          <p><strong>${overallCgpa !== null ? overallCgpa.toFixed(2) : 'N/A'}</strong> (on ${scale} Scale)</p>
        </div>
    `;

    semesters.forEach(semester => {
      if(semester.courses.length === 0 && semester.sgpa === null) return; 

      html += `
          <div class="semester-block">
              <h3>${semester.name || `Semester ${semesters.indexOf(semester) + 1}`} (SGPA: ${semester.sgpa !== null && semester.sgpa !== undefined ? semester.sgpa.toFixed(2) : 'N/A'})</h3>
      `;
      if (semester.courses.length > 0) {
        html += `
              <table>
                  <thead>
                      <tr>
                          <th>Course Name</th>
                          <th>Credits</th>
                          <th>Grade</th>
                          <th>Points Used</th>
                      </tr>
                  </thead>
                  <tbody>
        `;
        semester.courses.forEach(course => {
            const gradeOption = activeGradeOptions.find(g => g.value === course.grade);
            const creditVal = parseFloat(course.credits);
            html += `
                <tr>
                    <td>${course.courseName || 'N/A'}</td>
                    <td>${!isNaN(creditVal) && creditVal > 0 ? creditVal : 'N/A'}</td>
                    <td>${course.grade}</td>
                    <td>${gradeOption && !isNaN(creditVal) && creditVal > 0 ? gradeOption.points.toFixed(2) : 'N/A'}</td>
                </tr>
            `;
        });
        html += `
                  </tbody>
              </table>
        `;
      } else {
        html += `<p>No courses entered for this semester.</p>`;
      }
      html += `</div>`;
    });
    
    html += `
        <div class="grade-mapping-table">
            <h2>Grade Point Mapping Used (${scale} Scale)</h2>
            <ul>
    `;
    activeGradeOptions.forEach(opt => {
        html += `<li>${opt.label.split(' (')[0]} (${opt.value}): ${opt.points.toFixed(1)} points</li>`;
    });
    html += `
            </ul>
        </div>
      </div>
    `;
    return html;
  };

  const handleDownloadPdf = async () => {
    if (overallCgpa === null && semesters.every(s => s.sgpa === null)) {
        alert("Please calculate CGPA & SGPAs first to generate the PDF report.");
        return;
    }
    setIsDownloading(true);
    console.log("handleDownloadPdf started. html2pdf module:", html2pdf);

    if (typeof html2pdf !== 'function') {
        console.error("CRITICAL: html2pdf is not imported as a function. Type:", typeof html2pdf, "Value:", html2pdf);
        alert("PDF generation library (html2pdf.js) is not loaded correctly. Please check the console for details.");
        setIsDownloading(false);
        return;
    }

    let content = "";
    try {
        content = generatePdfContent();
        if (!content || typeof content !== 'string' || content.trim() === "") {
            console.error("PDF content generation failed or returned empty.");
            alert("Could not generate PDF content. Please try again.");
            setIsDownloading(false);
            return;
        }
    } catch (genError) {
        console.error("Error during PDF content generation:", genError);
        alert("An error occurred while preparing the PDF content. Check console for details.");
        setIsDownloading(false);
        return;
    }

    const options = {
        margin: [15, 10, 15, 10], 
        filename: `CGPA_SGPA_Report_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 }, 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
        console.log("Step 1: Initializing html2pdf()...");
        const workerInstance = html2pdf();
        console.log("Step 1 Result: workerInstance:", workerInstance);
        if (!workerInstance || typeof workerInstance.from !== 'function') {
            console.error("Error after html2pdf(): `workerInstance` is invalid or `workerInstance.from` is not a function.", "Type of workerInstance.from:", typeof workerInstance?.from);
            throw new Error("html2pdf() did not return a valid worker instance with a .from method.");
        }

        console.log("Step 2: Calling .from(content)...");
        const fromInstance = workerInstance.from(content);
        console.log("Step 2 Result: fromInstance:", fromInstance);
        if (!fromInstance || typeof fromInstance.set !== 'function') {
            console.error("Error after .from(content): `fromInstance` is invalid or `fromInstance.set` is not a function.", "Type of fromInstance.set:", typeof fromInstance?.set);
            throw new Error(".from(content) did not return a valid instance with a .set method.");
        }
        
        console.log("Step 3: Calling .set(options)...");
        const setInstance = fromInstance.set(options);
        console.log("Step 3 Result: setInstance:", setInstance);
        if (!setInstance || typeof setInstance.save !== 'function') {
            console.error("Error after .set(options): `setInstance` is invalid or `setInstance.save` is not a function.", "Type of setInstance.save:", typeof setInstance?.save);
            throw new Error(".set(options) did not return a valid instance with a .save method.");
        }

        console.log("Step 4: Calling .save()...");
        await setInstance.save();
        console.log("PDF generation initiated successfully by html2pdf.js.");

    } catch (error) {
        console.error("Error generating PDF with html2pdf.js:", error);
        let errorMessage = "Sorry, there was an error generating the PDF. Please try again.";
        if (error instanceof Error) {
            errorMessage += ` Details: ${error.message}`;
        } else if (typeof error === 'string') {
            errorMessage += ` Details: ${error}`;
        } else {
            errorMessage += ` An unknown error occurred.`;
        }
        alert(errorMessage + " Check the console for more details.");
    } finally {
        setIsDownloading(false);
    }
  };


  return (
    <div>
      <h2 className="text-2xl font-semibold text-mercury-black mb-1 font-serif">CGPA & SGPA  Calculator</h2>
      <p className="text-sm text-slate-600 mb-6">Calculate your SGPA per semester and overall CGPA. Customize grade points as per your university.</p>
      
      <div className="space-y-6">
        <div className="flex items-end gap-2">
            <Select
              label="Grading Scale"
              id="gpScale"
              options={SCALES}
              value={scale}
              onChange={(e) => setScale(e.target.value as GradingScale)}
              className="flex-grow"
            />
            <InfoTooltip text="Select your institution's grading system. Grade options and defaults will update." />
            <Button
  onClick={() => setIsGradeEditorOpen(true)}
  variant="secondary"
  Icon={EditIcon}
  className="w-full sm:w-auto"
  title="Edit Grade Points"
>
  Edit Grades
</Button>

        </div>

        <div className="space-y-4">
            {semesters.map((semester, index) => (
                <SemesterCard
                    key={semester.id}
                    semester={semester}
                    semesterIndex={index}
                    onNameChange={handleSemesterNameChange}
                    onRemoveSemester={removeSemester}
                    onAddCourse={addCourseToSemester}
                    onRemoveCourse={removeCourseFromSemester}
                    onCourseChange={handleCourseChange}
                    gradeOptions={activeGradeOptions}
                    errors={errors[semester.id] || {}}
                />
            ))}
        </div>
        
        <div className=" flex flex-col sm:flex-column gap-3 pt-2 border-t border-slate-200 w-full">
        <Button
  onClick={addSemester}
  variant="primary"
  Icon={PlusIcon}
  className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white"
>
  Add Semester
</Button>

<Button
  onClick={() => setShowGradeTable(!showGradeTable)}
  variant="secondary"
  Icon={TableIcon}
  className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-black"
  aria-expanded={showGradeTable}
>
  {showGradeTable ? 'Hide' : 'Show'} Grade Table
</Button>


       

        {showGradeTable && (
            <div className=" mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 shadow">
                <h4 className="text-md font-semibold text-mercury-black mb-2">Current Grade Point Mapping ({SCALES.find(s => s.value === scale)?.label || scale} Scale)</h4>
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
                    {activeGradeOptions.map(opt => (
                        <li key={opt.value} className="p-2 bg-white rounded shadow-sm">
                            <span className="font-medium">{opt.label.split(' (')[0]} ({opt.value}):</span> {opt.points.toFixed(1)} points
                        </li>
                    ))}
                </ul>
                <p className="text-xs text-slate-500 mt-2">Use the "Edit Grades" button to customize these points.</p>
            </div>
        )}

        <Button onClick={calculateOverallAndSGPAs} className="w-full" size="lg">
          Calculate CGPA & SGPAs
        </Button>
        <Button
  onClick={handleDownloadPdf}
  variant="success"
  Icon={DownloadIcon}
  className={`w-full sm:w-auto ${
    isDownloading
      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700 text-white'
  }`}
  disabled={isDownloading || (overallCgpa === null && semesters.every(s => s.sgpa === null))}
>
  {isDownloading ? 'Generating Report...' : 'Download PDF'}
</Button>

</div>
      </div>

      {overallCgpa !== null && (
        <ResultCard 
            title="Overall Calculated CGPA" 
            value={overallCgpa.toFixed(2)} 
            unit={semesters.length > 0 && semesters.some(s => s.courses.length > 0) ? `on ${scale} scale` : "(No valid courses/credits entered)"}
        />
      )}
      
      {/* SGPA Summary Section */}
      {semesters.some(s => s.sgpa !== null && s.sgpa !== undefined) && (
        <div className="mt-8 p-4 sm:p-6 bg-slate-50 rounded-xl shadow-lg border border-slate-200">
            <h3 className="text-xl font-semibold text-mercury-black mb-4 flex items-center">
                <ClipboardListIcon className="w-6 h-6 mr-2 text-academic-blue"/>
                Semester Performance Summary
            </h3>
            {semesters.filter(s => s.sgpa !== null && s.sgpa !== undefined && s.courses.length > 0).length > 0 ? (
                 <ul className="space-y-3">
                    {semesters.map(semester => {
                        if (semester.sgpa !== null && semester.sgpa !== undefined && semester.courses.length > 0) {
                            return (
                                <li key={semester.id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                    <span className="font-medium text-slate-700">{semester.name}</span>
                                    <span className={`font-bold text-lg ${semester.sgpa >= (scale === GradingScale.SCALE_4 ? 3.0 : 7.5) ? 'text-green-600' : semester.sgpa >= (scale === GradingScale.SCALE_4 ? 2.0 : 5.0) ? 'text-yellow-600' : 'text-red-600'}`}>
                                        SGPA: {semester.sgpa.toFixed(2)}
                                    </span>
                                </li>
                            );
                        }
                        return null;
                    })}
                </ul>
            ) : (
                <p className="text-slate-500">No semester data with calculated SGPA to display. Calculate SGPAs first or add courses to existing semesters.</p>
            )}
        </div>
      )}

      {/* Post-Calculation Ad Placeholder */}
      {(overallCgpa !== null || semesters.some(s => s.sgpa !== null)) && (
          <AdPlaceholder type="Post-Calculation Square" />
      )}


      {Object.values(errors).some(semErr => Object.values(semErr).some(courseErr => Object.keys(courseErr).length > 0)) && overallCgpa === null && (
         <p className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">Please correct the errors in course inputs before calculating.</p>
      )}

      {isGradeEditorOpen && (
        <EditGradeMappingModal
            isOpen={isGradeEditorOpen}
            onClose={() => setIsGradeEditorOpen(false)}
            currentGradeOptions={activeGradeOptions}
            defaultGradeOptions={getDefaultGradeOptions(scale)}
            onSave={handleSaveGradeOptions}
            scale={scale}
        />
      )}
    </div>
  );
};

export default GradePointCalculator;
