import React from 'react';
import LightBulbIcon from './icons/LightBulbIcon';

interface AiAnalysisProps {
  analysis: string;
  isLoading: boolean;
  error: string | null;
}

const AiAnalysis: React.FC<AiAnalysisProps> = ({ analysis, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="mt-8 max-w-3xl mx-auto">
        <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-white/20 dark:border-neutral-800/80 shadow-lg rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 flex-shrink-0 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                <LightBulbIcon />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">AI Powered Analysis</h3>
          </div>
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-full"></div>
            <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-5/6"></div>
            <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-full"></div>
            <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 max-w-3xl mx-auto">
        <div className="bg-red-100/60 dark:bg-red-900/30 backdrop-blur-xl border border-red-200/50 dark:border-red-800/50 shadow-lg rounded-2xl p-6">
           <h3 className="text-lg font-bold text-red-800 dark:text-red-200">An Error Occurred</h3>
           <p className="text-red-700 dark:text-red-300 mt-2 text-sm whitespace-pre-wrap">{error}</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="mt-8 max-w-3xl mx-auto transition-opacity duration-500 opacity-100">
      <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-white/20 dark:border-neutral-800/80 shadow-lg rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 flex-shrink-0 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
              <LightBulbIcon />
          </div>
          <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">AI Powered Analysis</h3>
        </div>
        <div className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
          {analysis}
        </div>
      </div>
    </div>
  );
};

export default AiAnalysis;
