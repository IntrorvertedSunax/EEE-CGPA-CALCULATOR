
import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import SgpaCalculator from './components/SgpaCalculator';
import CgpaCalculator from './components/CgpaCalculator';
import ConfirmationModal from './components/ConfirmationModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && userPrefersDark)) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

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

  const handleClearAllData = () => {
    setSgpaState({ selectedSemesterKey: '', grades: {} });
    setCgpaState({ gpas: {} });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen text-neutral-800 dark:text-neutral-200 relative">
      <div className="absolute top-0 left-0 -z-10 h-full w-full bg-neutral-50 dark:bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(0,0,0,0))]"></div>

      <Header theme={theme} onToggleTheme={handleThemeToggle} />
      <main className="container mx-auto px-4 py-6 sm:py-12">
        <div className="flex justify-center mb-8">
          <div className="relative flex p-1 bg-neutral-200/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-xl shadow-md border border-white/50 dark:border-neutral-800/50" role="tablist">
            <span 
                className="absolute top-1 bottom-1 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] bg-white dark:bg-neutral-800 rounded-lg shadow-sm"
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
        <button
         onClick={() => setIsModalOpen(true)}
         className="mt-4 text-sm font-medium text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-950 focus:ring-red-500/50 rounded-md px-2 py-1 transition-colors"
       >
         Clear All Data
       </button>
      </footer>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleClearAllData}
        title="Confirm Data Deletion"
      >
        Are you sure you want to clear all your saved SGPA and CGPA data? This action cannot be undone.
      </ConfirmationModal>
    </div>
  );
};

export default App;
