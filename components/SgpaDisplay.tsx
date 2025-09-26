
import React from 'react';

interface SgpaDisplayProps {
  sgpa: number;
  offeredCredits: number;
  securedCredits: number;
  totalPoints: number;
  isSticky: boolean;
}

const SgpaDisplay: React.FC<SgpaDisplayProps> = ({ sgpa, offeredCredits, securedCredits, totalPoints, isSticky }) => {
    const getSgpaGradient = () => {
        if (sgpa >= 3.75) return 'from-green-500 to-green-400';
        if (sgpa >= 3.25) return 'from-sky-500 to-sky-400';
        if (sgpa >= 2.5) return 'from-amber-500 to-amber-400';
        if (sgpa > 0) return 'from-orange-500 to-red-500';
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
                            Grade Point Average (GPA)
                        </h2>
                        <div className="flex gap-x-4 sm:gap-x-6 text-xs sm:text-sm text-center text-neutral-500 dark:text-neutral-400 mt-1.5">
                            <div>
                                <span className="block font-semibold text-neutral-700 dark:text-neutral-200">{offeredCredits.toFixed(2)}</span>
                                Offered
                            </div>
                            <div>
                                <span className="block font-semibold text-neutral-700 dark:text-neutral-200">{securedCredits.toFixed(2)}</span>
                                Secured
                            </div>
                            <div>
                                <span className="block font-semibold text-neutral-700 dark:text-neutral-200">{totalPoints.toFixed(2)}</span>
                                Points
                            </div>
                        </div>
                    </div>
                    <p className={`text-4xl font-bold bg-gradient-to-br ${getSgpaGradient()} bg-clip-text text-transparent text-right flex-shrink-0`}>
                        {sgpa.toFixed(3)}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${baseCardClasses} ${glassEffectClasses} rounded-2xl p-6 max-w-2xl mx-auto text-center`}>
            <h2 className="text-lg font-medium text-neutral-500 dark:text-neutral-400">
                Grade Point Average (GPA)
            </h2>
            <p className={`text-6xl sm:text-7xl font-extrabold my-2 bg-gradient-to-br ${getSgpaGradient()} bg-clip-text text-transparent`}>
                {sgpa.toFixed(3)}
            </p>
            <div className="mt-4 pt-4 border-t border-neutral-300/50 dark:border-neutral-700/50 flex justify-center gap-x-6 sm:gap-x-8 text-sm text-neutral-500 dark:text-neutral-400">
                <div>
                    <span className="block text-lg font-semibold text-neutral-700 dark:text-neutral-200">{offeredCredits.toFixed(2)}</span>
                    Credit Offered
                </div>
                <div>
                    <span className="block text-lg font-semibold text-neutral-700 dark:text-neutral-200">{securedCredits.toFixed(2)}</span>
                    Credit Secured
                </div>
                 <div>
                    <span className="block text-lg font-semibold text-neutral-700 dark:text-neutral-200">{totalPoints.toFixed(2)}</span>
                    Points Secured
                </div>
            </div>
        </div>
    );
};

export default SgpaDisplay;