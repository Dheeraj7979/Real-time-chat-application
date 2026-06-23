import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-9xl font-extrabold text-indigo-600 tracking-widest animate-bounce">
            404
          </h1>
          <div className="bg-indigo-100 text-indigo-700 px-3 py-1 text-sm rounded rotate-12 absolute inline-block translate-x-12 -translate-y-12 font-medium select-none">
            Page Not Found
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Lost in space?
          </h2>
          <p className="text-base text-gray-600">
            The page you are looking for doesn't exist or has been moved to another URL. 
            Don't worry, it happens to the best of us!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/"
            className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go back home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;