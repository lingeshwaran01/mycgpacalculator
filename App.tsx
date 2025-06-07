import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import CgpaToPercentageConverter from './components/CgpaToPercentageConverter';
import PercentageToCgpaConverter from './components/PercentageToCgpaConverter';
import GradePointCalculator from './components/GradePointCalculator';
import AdPlaceholder from './components/shared/AdPlaceholder';
import NotFound from './components/NotFound';

const tabClass =
  'px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-academic-blue';

const App: React.FC = () => {
  return (

<div className="flex flex-col">
<div className="max-w-3xl mx-auto px-4 py-6">

      
   
        {/* <AdPlaceholder type="Top Banner" className="mb-6" /> */}

        {/* ✅ Nav with NavLink */}
        <nav className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3 p-2 bg-white/70 backdrop-blur-sm rounded-xl shadow-md">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? `${tabClass} bg-academic-blue text-white shadow-md scale-105`
                : `${tabClass} bg-slate-200 text-mercury-black hover:bg-slate-300`
            }
          >
            CGPA Calculator
          </NavLink>

          <NavLink
            to="/cgpa-to-percentage"
            className={({ isActive }) =>
              isActive
                ? `${tabClass} bg-academic-blue text-white shadow-md scale-105`
                : `${tabClass} bg-slate-200 text-mercury-black hover:bg-slate-300`
            }
          >
            CGPA to Percentage
          </NavLink>

          <NavLink
            to="/percentage-to-cgpa"
            className={({ isActive }) =>
              isActive
                ? `${tabClass} bg-academic-blue text-white shadow-md scale-105`
                : `${tabClass} bg-slate-200 text-mercury-black hover:bg-slate-300`
            }
          >
            Percentage to CGPA
          </NavLink>
        </nav>

        {/* ✅ Routed Content */}
        <section className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl transition-all duration-300 ease-in-out">
          <Routes>
            <Route path="/" element={<GradePointCalculator />} />
            <Route path="/cgpa-to-percentage" element={<CgpaToPercentageConverter />} />
            <Route path="/percentage-to-cgpa" element={<PercentageToCgpaConverter />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </section>
    
        </div></div>)
};

export default App;
