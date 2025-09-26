import React, { useState, useMemo, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Course } from '../types';
import { SEMESTER_COURSES, GRADE_POINTS, GRADE_OPTIONS } from '../constants';
import SgpaDisplay from './SgpaDisplay';
import DownloadIcon from './icons/DownloadIcon';

interface SgpaCalculatorProps {
  sgpaState: {
    selectedSemesterKey: string;
    grades: Record<string, string>;
  };
  setSgpaState: React.Dispatch<React.SetStateAction<{
    selectedSemesterKey: string;
    grades: Record<string, string>;
  }>>;
}

const SgpaCalculator: React.FC<SgpaCalculatorProps> = ({ sgpaState, setSgpaState }) => {
  const { selectedSemesterKey, grades } = sgpaState;
  const [isSticky, setIsSticky] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const displayElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const displayElement = displayElementRef.current;
    if (!displayElement) return;

    const observer = new IntersectionObserver(
        ([entry]) => {
            setIsSticky(!entry.isIntersecting && entry.boundingClientRect.y < 0);
        },
        { rootMargin: '-1px 0px 0px 0px', threshold: 1 }
    );
    
    observer.observe(displayElement);

    return () => {
        if (displayElement) observer.unobserve(displayElement);
    };
  }, []);

  const courses: Course[] = useMemo(
    () => (selectedSemesterKey ? SEMESTER_COURSES[selectedSemesterKey] : []),
    [selectedSemesterKey]
  );

  const semesterStats = useMemo(() => {
    let totalPoints = 0;
    let attemptedCredits = 0;
    let securedCredits = 0;

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

  const handleGradeChange = (courseCode: string, grade: string) => {
    setSgpaState(prev => ({ 
      ...prev,
      grades: { ...prev.grades, [courseCode]: grade }
    }));
  };
  
  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSemesterKey = e.target.value;
      setSgpaState({
        selectedSemesterKey: newSemesterKey,
        grades: {}
      });
  };

  const handleDownloadPdf = () => {
    if (!selectedSemesterKey) return;

    const doc = new jsPDF();
    doc.setFont('helvetica');

    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text('GPA Report', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Department of Electrical and Electronic Engineering', 105, 28, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text(`Semester: ${selectedSemesterKey}`, 14, 45);

    const tableColumn = ["Course Code", "Course Name", "Credits", "Grade", "Points"];
    const tableRows: (string | number)[][] = [];

    courses.forEach(course => {
      const grade = grades[course.code] || 'N/A';
      const gradePoint = GRADE_POINTS[grade];
      const row = [
        course.code,
        course.name,
        course.credits,
        grade,
        grade === 'N/A' ? 'N/A' : (gradePoint * course.credits).toFixed(2),
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }, // primary-600
    });
    
    const finalY = (doc as any).lastAutoTable.finalY;

    const summaryBoxY = finalY + 15;
    const summaryBoxWidth = doc.internal.pageSize.getWidth() - 28;
    
    doc.setFillColor(241, 245, 249); // neutral-100
    doc.setDrawColor(226, 232, 240); // neutral-200
    doc.roundedRect(14, summaryBoxY, summaryBoxWidth, 38, 3, 3, 'FD');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    
    let currentY = summaryBoxY + 10;
    doc.text(`Credit Offered:`, 22, currentY);
    doc.text(`${semesterStats.offeredCredits.toFixed(2)}`, 65, currentY, { align: 'right' });

    currentY += 6;
    doc.text(`Credit Attempted:`, 22, currentY);
    doc.text(`${semesterStats.attemptedCredits.toFixed(2)}`, 65, currentY, { align: 'right' });

    currentY += 6;
    doc.text(`Credit Secured:`, 22, currentY);
    doc.text(`${semesterStats.securedCredits.toFixed(2)}`, 65, currentY, { align: 'right' });

    currentY += 6;
    doc.text(`Points Secured:`, 22, currentY);
    doc.text(`${semesterStats.totalPoints.toFixed(2)}`, 65, currentY, { align: 'right' });

    const rightAlignX = doc.internal.pageSize.getWidth() - 22;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100);
    doc.text('GPA', rightAlignX, summaryBoxY + 12, { align: 'right' });

    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229); // primary-600
    doc.text(semesterStats.sgpa.toFixed(3), rightAlignX, summaryBoxY + 25, { align: 'right' });

    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
        doc.text(`Generated by Interactive GPA & CGPA Calculator`, 14, doc.internal.pageSize.getHeight() - 10);
    }

    doc.save(`GPA_Report_Semester_${selectedSemesterKey}.pdf`);
  };

  const canTakeAction = semesterStats.attemptedCredits > 0;
  const cardBaseClasses = "transition-all duration-300 ease-in-out";
  const glassEffectClasses = "bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-white/20 dark:border-neutral-800/80 shadow-lg";

  return (
    <section className={`transition-all duration-500 ease-out ${isMounted ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
        <div ref={displayElementRef} className="py-4">
            <SgpaDisplay 
                sgpa={semesterStats.sgpa}
                offeredCredits={semesterStats.offeredCredits}
                securedCredits={semesterStats.securedCredits}
                totalPoints={semesterStats.totalPoints}
                isSticky={false}
            />
        </div>

        <div className={`fixed top-0 left-0 right-0 z-20 py-4 ${glassEffectClasses} transition-all duration-300 ease-in-out ${isSticky ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
            <SgpaDisplay 
                sgpa={semesterStats.sgpa}
                offeredCredits={semesterStats.offeredCredits}
                securedCredits={semesterStats.securedCredits}
                totalPoints={semesterStats.totalPoints}
                isSticky={true}
            />
        </div>

        <div className="max-w-3xl mx-auto">
            <div className={`mt-8 ${cardBaseClasses} ${glassEffectClasses} rounded-2xl p-4 sm:p-6`}>
                <div className="flex justify-center mb-6">
                     <select
                      value={selectedSemesterKey}
                      onChange={handleSemesterChange}
                      className="w-full max-w-sm bg-white/50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary-500/80 focus:border-primary-500 outline-none transition"
                    >
                      <option value="">Select a Semester</option>
                      {Object.keys(SEMESTER_COURSES).map(key => (
                        <option key={key} value={key}>
                          Semester {key}
                        </option>
                      ))}
                    </select>
                </div>
                
                <div className="space-y-2">
                  {courses.length > 0 ? (
                    courses.map(course => (
                      <div key={course.code} className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg transition-colors hover:bg-neutral-500/10">
                        <div className="flex-grow">
                          <p className="font-semibold text-neutral-800 dark:text-neutral-100">{course.name}</p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {course.code} &bull; {course.credits} Credits
                          </p>
                        </div>
                        <select
                          value={grades[course.code] || 'N/A'}
                          onChange={e => handleGradeChange(course.code, e.target.value)}
                          className="w-full sm:w-32 bg-white/50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary-500/80 focus:border-primary-500 outline-none transition"
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
                    <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
                      <p>Please select a semester to see courses.</p>
                    </div>
                  )}
                </div>
            </div>

            {canTakeAction && (
                <div className="mt-8 text-center">
                    <button
                        onClick={handleDownloadPdf}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-950 focus:ring-neutral-500/70 transition-all duration-300 bg-neutral-700 text-white shadow-lg hover:shadow-neutral-500/40 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        <DownloadIcon />
                        Download Report
                    </button>
                </div>
            )}
        </div>
    </section>
  );
};

export default SgpaCalculator;