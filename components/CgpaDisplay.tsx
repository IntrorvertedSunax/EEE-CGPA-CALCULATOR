
import React from 'react';

interface CgpaDisplayProps {
  cgpa: number;
  totalCredits: number;
  isSticky: boolean;
}

const CgpaDisplay: React.FC<CgpaDisplayProps> = ({ cgpa, totalCredits, isSticky }) => {
    const getCgpaGradient = () => {
        if (cgpa >= 3.75) return 'from-green-500 to-green-400';
        if (cgpa >= 3.25) return 'from-sky-500 to-sky-400';
        if (cgpa >= 2.5) return 'from-amber-500 to-amber-400';
        if (cgpa > 0) return 'from-orange-500 to-red-500';
        return 'from-neutral-500 to-neutral-400';
    };

    const baseCardClasses = "transition-all duration-300 ease-in-out";
    const glassEffectClasses = "bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl shadow-neutral-300/10 dark:shadow-black/20";
    
    if (isSticky) {
        return (
            <div className="max-w-3xl mx-auto px-4">
                <div className="flex justify-between items-center gap-4">
                    <div>
                        <h2 className="text-sm sm:text-base font-semibold text-neutral-700 dark:text-neutral-200">
                            Cumulative Grade Point Average (CGPA)
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Based on <span className="font-semibold text-primary-500 dark:text-primary-400">{totalCredits.toFixed(2)}</span> total credits.
                        </p>
                    </div>
                    <p className={`text-4xl font-bold bg-gradient-to-br ${getCgpaGradient()} bg-clip-text text-transparent flex-shrink-0`}>
                        {cgpa.toFixed(3)}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${baseCardClasses} ${glassEffectClasses} rounded-2xl p-6 max-w-2xl mx-auto text-center`}>
            <h2 className="text-lg font-medium text-neutral-500 dark:text-neutral-400">
                Cumulative Grade Point Average (CGPA)
            </h2>
            <p className={`text-6xl sm:text-7xl font-extrabold my-2 bg-gradient-to-br ${getCgpaGradient()} bg-clip-text text-transparent`}>
                {cgpa.toFixed(3)}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Based on <span className="font-semibold text-primary-500 dark:text-primary-400">{totalCredits.toFixed(2)}</span> total credits.
            </p>
        </div>
    );
};

export default CgpaDisplay;