
import React, { useState, useEffect, useMemo } from 'react';
import { Course, SemesterResult } from '../types';
import { SEMESTER_COURSES, GRADE_POINTS, GRADE_OPTIONS } from '../constants';
import TrashIcon from './icons/TrashIcon';

interface SemesterCardProps {
  id: number;
  semesterNumber: number;
  onUpdate: (result: SemesterResult) => void;
  onRemove: (id: number) => void;
}

const SemesterCard: React.FC<SemesterCardProps> = ({ id, semesterNumber, onUpdate, onRemove }) => {
  const [selectedSemesterKey, setSelectedSemesterKey] = useState<string>('');
  const [grades, setGrades] = useState<Record<string, string>>({});

  const courses: Course[] = useMemo(
    () => (selectedSemesterKey ? SEMESTER_COURSES[selectedSemesterKey] : []),
    [selectedSemesterKey]
  );

  const semesterStats = useMemo(() => {
    let totalPoints = 0; // This is Point Secured, and also used for SGPA/CGPA
    let attemptedCredits = 0; // For SGPA/CGPA denominator
    let securedCredits = 0; // This is the new "Credit Secured" stat

    const offeredCredits = courses.reduce((sum, course) => sum + course.credits, 0);

    courses.forEach(course => {
      const grade = grades[course.code];
      if (grade && grade !== 'N/A') {
        const gradePoint = GRADE_POINTS[grade];
        attemptedCredits += course.credits;
        totalPoints += gradePoint * course.credits;
        if (grade !== 'F') {
            securedCredits += course.credits;
        }
      }
    });

    const sgpa = attemptedCredits > 0 ? totalPoints / attemptedCredits : 0;

    return { 
        totalPoints, 
        attemptedCredits,
        offeredCredits,
        securedCredits,
        sgpa 
    };
  }, [grades, courses]);

  useEffect(() => {
    onUpdate({ 
        id, 
        totalCredits: semesterStats.attemptedCredits, 
        totalPoints: semesterStats.totalPoints 
    });
  }, [id, onUpdate, semesterStats]);

  const handleGradeChange = (courseCode: string, grade: string) => {
    setGrades(prev => ({ ...prev, [courseCode]: grade }));
  };
  
  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSemesterKey = e.target.value;
      setSelectedSemesterKey(newSemesterKey);
      setGrades({}); // Reset grades when semester changes
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col h-full relative">
      <button 
        onClick={() => onRemove(id)}
        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        aria-label="Remove semester"
      >
        <TrashIcon />
      </button>

      <div className="flex-grow">
        <div className="flex items-baseline gap-4 mb-6">
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">
                Semester {semesterNumber}
            </h3>
            <select
              value={selectedSemesterKey}
              onChange={handleSemesterChange}
              className="w-full max-w-xs bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select a Semester</option>
              {Object.keys(SEMESTER_COURSES).map(key => (
                <option key={key} value={key}>
                  Semester {key}
                </option>
              ))}
            </select>
        </div>
        
        <div className="space-y-4">
          {courses.length > 0 ? (
            courses.map(course => (
              <div key={course.code} className="grid grid-cols-3 gap-2 items-center">
                <div className="col-span-2">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{course.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {course.code} &bull; {course.credits} Credits
                  </p>
                </div>
                <select
                  value={grades[course.code] || 'N/A'}
                  onChange={e => handleGradeChange(course.code, e.target.value)}
                  className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {GRADE_OPTIONS.map(grade => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
              <p>Please select a semester to see courses.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-end">
        <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
            <p>Credit Offered: <span className="font-semibold text-slate-700 dark:text-slate-200">{semesterStats.offeredCredits.toFixed(2)}</span></p>
            <p>Credit Secured: <span className="font-semibold text-slate-700 dark:text-slate-200">{semesterStats.securedCredits.toFixed(2)}</span></p>
            <p>Point Secured: <span className="font-semibold text-slate-700 dark:text-slate-200">{semesterStats.totalPoints.toFixed(2)}</span></p>
        </div>
        <div className="text-right">
            <p className="text-slate-500 dark:text-slate-400">Semester GPA (SGPA)</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{semesterStats.sgpa.toFixed(3)}</p>
        </div>
      </div>
    </div>
  );
};

export default SemesterCard;