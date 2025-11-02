import React from 'react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  // Function to get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/jobs':
        return 'All Posted Jobs';
      case '/applicants':
        return 'All Applicants';
      case '/team':
        return 'Team Management';
      default:
        // Check if it's a job details page
        if (location.pathname.startsWith('/jobs/')) {
          return 'Job Details';
        }
        return 'Admin Panel';
    }
  };

  // Function to get current date in a readable format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="fixed top-0 right-0 left-64 bg-white shadow z-10"> {/* Make header fixed */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
        <div className="text-sm font-medium text-gray-700">
          {getCurrentDate()}
        </div>
      </div>
    </header>
  );
};

export default Header;