
import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import SgpaCalculator from './components/SgpaCalculator';
import CgpaCalculator from './components/CgpaCalculator';

type View = 'sgpa' | 'cgpa';

interface SgpaState {
  selectedSemesterKey: string;
  grades: Record<string, string>;
}

interface CgpaState {
  gpas: Record<string, string>;
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('sgpa');

  const [sgpaState, setSgpaState] = useState<SgpaState>(() => {
    try {
      const saved = localStorage.getItem('sgpaState');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error reading sgpaState from localStorage', error);
    }
    return { selectedSemesterKey: '', grades: {} };
  });

  const [cgpaState, setCgpaState] = useState<CgpaState>(() => {
    try {
      const saved = localStorage.getItem('cgpaState');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error reading cgpaState from localStorage', error);
    }
    return { gpas: {} };
  });

  useEffect(() => {
    try {
      localStorage.setItem('sgpaState', JSON.stringify(sgpaState));
    } catch (error) {
      console.error('Error saving sgpaState to localStorage', error);
    }
  }, [sgpaState]);

  useEffect(() => {
    try {
      localStorage.setItem('cgpaState', JSON.stringify(cgpaState));
    } catch (error) {
      console.error('Error saving cgpaState to localStorage', error);
    }
  }, [cgpaState]);

  const sgpaButtonRef = useRef<HTMLButtonElement>(null);
  const cgpaButtonRef = useRef<HTMLButtonElement>(null);
  const [gliderStyle, setGliderStyle] = useState({});

  useEffect(() => {
    const targetButton = activeView === 'sgpa' ? sgpaButtonRef.current : cgpaButtonRef.current;

    if (targetButton) {
      setGliderStyle({
        width: `${targetButton.offsetWidth}px`,
        transform: `translateX(${targetButton.offsetLeft}px)`,
      });
    }
  }, [activeView]);

  return (
    <div className="min-h-screen text-neutral-800 dark:text-neutral-200">
      <Header />
      <main className="container mx-auto px-4 py-6 sm:py-12">
        <div className="flex justify-center mb-8">
          <div className="relative flex p-1 bg-neutral-200/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-xl shadow-inner-lg" role="tablist">
            <span 
                className="absolute top-1 bottom-1 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] bg-white dark:bg-neutral-800 rounded-lg shadow-md"
                style={gliderStyle}
                aria-hidden="true"
            ></span>

            <button 
                ref={sgpaButtonRef}
                onClick={() => setActiveView('sgpa')}
                className={`relative z-10 px-4 sm:px-5 py-2 font-semibold rounded-lg focus:outline-none transition-colors duration-300 ${activeView === 'sgpa' ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'}`}
                role="tab"
                aria-selected={activeView === 'sgpa'}
                aria-controls="sgpa-panel"
            >
                GPA Calculator
            </button>
            <button 
                ref={cgpaButtonRef}
                onClick={() => setActiveView('cgpa')}
                className={`relative z-10 px-4 sm:px-5 py-2 font-semibold rounded-lg focus:outline-none transition-colors duration-300 ${activeView === 'cgpa' ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'}`}
                role="tab"
                aria-selected={activeView === 'cgpa'}
                aria-controls="cgpa-panel"
            >
                CGPA Calculator
            </button>
          </div>
        </div>
        
        <div className="text-center mb-8">
            <h3 className="text-base sm:text-lg font-medium tracking-wide text-neutral-500 dark:text-neutral-400">
                Department of Electrical and Electronic Engineering
            </h3>
        </div>

        <div role="tabpanel" id="sgpa-panel" hidden={activeView !== 'sgpa'}>
          {activeView === 'sgpa' && <SgpaCalculator sgpaState={sgpaState} setSgpaState={setSgpaState} />}
        </div>
        <div role="tabpanel" id="cgpa-panel" hidden={activeView !== 'cgpa'}>
          {activeView === 'cgpa' && <CgpaCalculator cgpaState={cgpaState} setCgpaState={setCgpaState} />}
        </div>
      </main>
      <footer className="text-center py-10 mt-12 text-neutral-500 dark:text-neutral-400 text-sm">
        <p>Developed with passion by Introverted Sunax</p>
      </footer>
    </div>
  );
};

export default App;
