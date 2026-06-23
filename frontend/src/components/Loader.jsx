import React from 'react';

const Loader = ({ message = "Loading, please wait..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-xl max-w-sm mx-4">
        
        {/* Simple Tailwind Spinner */}
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        
        {/* Loading Message */}
        <p className="mt-4 text-base font-semibold text-slate-800 text-center animate-pulse">
          {message}
        </p>
        
      </div>
    </div>
  );
};

export default Loader;