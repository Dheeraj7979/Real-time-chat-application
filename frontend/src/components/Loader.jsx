import React from 'react';

const Loader = ({ message = "Loading, please wait..." }) => {
  return (
    
        <>
        {/* Simple Tailwind Spinner */}
        <div className="mx-auto w-10 h-10 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>
        </>
  );
};

export default Loader;