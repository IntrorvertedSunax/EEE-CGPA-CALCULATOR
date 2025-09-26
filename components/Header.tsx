
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-transparent py-6">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">
            GPA &amp; CGPA Calculator
          </span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
