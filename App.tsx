
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CgpaToPercentageConverter from './components/CgpaToPercentageConverter';
import PercentageToCgpaConverter from './components/PercentageToCgpaConverter';
import GradePointCalculator from './components/GradePointCalculator';
import TabButton from './components/TabButton';
import AdPlaceholder from './components/shared/AdPlaceholder'; // Import shared component
import { CalculatorMode } from './types';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<CalculatorMode>(CalculatorMode.GRADE_POINT_CALCULATOR);

  const renderCalculator = () => {
    switch (activeMode) {
      case CalculatorMode.CGPA_TO_PERCENTAGE:
        return <CgpaToPercentageConverter />;
      case CalculatorMode.PERCENTAGE_TO_CGPA:
        return <PercentageToCgpaConverter />;
      case CalculatorMode.GRADE_POINT_CALCULATOR:
        return <GradePointCalculator />;
      default:
        return <CgpaToPercentageConverter />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-academic-blue-light via-slate-50 to-blue-100 text-mercury-black">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          
          <AdPlaceholder type="Top Banner" className="mb-6" />

          <nav className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3 p-2 bg-white/70 backdrop-blur-sm rounded-xl shadow-md">
          <TabButton
              label="CGPA Calculator"
              isActive={activeMode === CalculatorMode.GRADE_POINT_CALCULATOR}
              onClick={() => setActiveMode(CalculatorMode.GRADE_POINT_CALCULATOR)}
            />
            <TabButton
              label="CGPA to Percentage"
              isActive={activeMode === CalculatorMode.CGPA_TO_PERCENTAGE}
              onClick={() => setActiveMode(CalculatorMode.CGPA_TO_PERCENTAGE)}
            />
            <TabButton
              label="Percentage to CGPA"
              isActive={activeMode === CalculatorMode.PERCENTAGE_TO_CGPA}
              onClick={() => setActiveMode(CalculatorMode.PERCENTAGE_TO_CGPA)}
            />
          
          </nav>
          <section className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl transition-all duration-300 ease-in-out">
            {renderCalculator()}
          </section>
          
          <article className="mt-10 text-sm text-slate-700 bg-white/60 backdrop-blur-sm p-6 rounded-lg shadow-lg leading-relaxed">
            <h2 className="text-2xl font-semibold text-mercury-black mb-4 font-serif">Master Your Grades: CGPA, SGPA & Conversions Explained</h2>
            
            <p className="mb-3">
              Navigating academic assessments requires understanding key metrics like CGPA and SGPA. This comprehensive calculator is designed to empower students worldwide by providing accurate, customizable tools for grade management and conversion. This tool is ad-supported to keep it free for everyone.
            </p>

            <h3 className="text-xl font-semibold text-mercury-black mb-2 mt-4 font-serif">Understanding CGPA (Cumulative Grade Point Average)</h3>
            <p className="mb-2">
              CGPA represents your overall academic performance across all semesters completed in your course. It's a weighted average of the grade points you've earned, providing a holistic view of your academic standing. Many universities and employers use CGPA as a primary indicator of academic success.
            </p>

            <h3 className="text-xl font-semibold text-mercury-black mb-2 mt-4 font-serif">What is SGPA (Semester Grade Point Average)?</h3>
            <p className="mb-2">
              SGPA, or Semester Grade Point Average, is a measure of your academic performance within a single semester. It's calculated based on the grades and credit hours of the courses you took during that specific academic term. Our Grade Point Calculator helps you easily compute your SGPA for each semester.
            </p>

            <h3 className="text-xl font-semibold text-mercury-black mb-2 mt-4 font-serif">Why Track Your SGPA & CGPA?</h3>
            <ul className="list-disc list-inside space-y-1 mb-3 pl-2">
              <li><strong>Monitor Progress:</strong> Regularly calculating your SGPA helps you understand your performance in each semester, allowing you to identify strengths and areas for improvement.</li>
              <li><strong>Set Academic Goals:</strong> Knowing your current CGPA and SGPA trends can help you set realistic targets for future semesters.</li>
              <li><strong>Application Requirements:</strong> Many scholarships, internships, and further education programs have minimum CGPA requirements.</li>
              <li><strong>Informed Decision Making:</strong> Understanding your academic standing can influence course selection and study strategies.</li>
            </ul>

            <h3 className="text-xl font-semibold text-mercury-black mb-2 mt-4 font-serif">Converting CGPA and Percentages</h3>
            <p className="mb-2">
              Converting CGPA to percentages, or vice-versa, is often necessary for applications or comparative analysis. However, it's crucial to remember:
            </p>
            <p className="mb-2 p-3 bg-academic-blue-light/50 border-l-4 border-academic-blue rounded-md">
              <strong>Important Note:</strong> Conversion formulas (multipliers or divisors) can vary significantly between universities, educational boards, and countries. While this tool offers customizable conversion factors based on common standards (e.g., multiplying by 9.5 for a 10-point scale, or 25 for a 4-point scale), <strong>always confirm with your specific institution for their official conversion methodology.</strong>
            </p>

            <h3 className="text-xl font-semibold text-mercury-black mb-2 mt-4 font-serif">How Our Advanced Calculator Helps You:</h3>
            <ul className="list-disc list-inside space-y-1 mb-3 pl-2">
              <li><strong>CGPA/Percentage Conversion:</strong> Seamlessly convert between CGPA and percentage with customizable conversion factors for both 4.0 and 10.0 scales.</li>
              <li><strong>Detailed Grade Point Calculator:</strong>
                <ul className="list-['-_'] list-inside space-y-1 ml-4 mt-1">
                    <li>Organize courses by semester and add custom semester names.</li>
                    <li>Input course names (optional), credits, and grades.</li>
                    <li>Calculates SGPA for each semester and your overall CGPA.</li>
                    <li>Remove entire semesters or individual courses easily.</li>
                </ul>
              </li>
              <li><strong>Customizable Grading Scales:</strong> Edit the grade points associated with each letter grade (e.g., A+, A, B) to match your university's specific grading system. These customizations are saved in your browser!</li>
              <li><strong>PDF Academic Report:</strong> Download a comprehensive PDF summary of your SGPAs, overall CGPA, courses, and the grade mapping used – perfect for your records or informal sharing.</li>
              <li><strong>User-Friendly & Responsive:</strong> Clean, intuitive design that works beautifully on all devices.</li>
            </ul>
            
            <p className="mt-4 text-xs text-mercury-grey">
              This tool is designed as a helper for academic planning and self-assessment. For official transcripts or conversions, always refer to your educational institution.
            </p>
          </article>
          
          <AdPlaceholder type="Bottom Banner" className="mt-10" />

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
