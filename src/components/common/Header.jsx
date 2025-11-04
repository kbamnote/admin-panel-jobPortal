import React from 'react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  // Function to get page title based on current route
  const getPageTitle = () => {
    // Split the path and get the main section
    const pathParts = location.pathname.split('/').filter(part => part !== '');
    
    // Handle specific routes
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/jobs':
        return 'Job Management';
      case '/jobs/post':
        return 'Post New Job';
      case '/applicants':
        return 'Applicant Management';
      case '/team':
        return 'Team Management';
      case '/team/posted-jobs':
        return 'Team Posted Jobs';
      case '/all-role-details':
        return 'User Role Details';
      default:
        // Handle dynamic routes
        if (location.pathname.startsWith('/jobs/') && location.pathname.endsWith('/applicants')) {
          return 'Job Applicants';
        }
        if (location.pathname.startsWith('/jobs/') && !location.pathname.endsWith('/applicants')) {
          return 'Job Details';
        }
        if (location.pathname.startsWith('/applicants/')) {
          return 'Applicant Details';
        }
        
        // Handle other potential routes with a more generic approach
        if (pathParts.length > 0) {
          // Capitalize first letter of each word
          return pathParts.map(part => {
            // Handle ID parameters by showing the section name
            if (part.length === 24 && /^[0-9a-fA-F]+$/.test(part)) {
              // This looks like an ID, skip it
              return null;
            }
            // Convert kebab-case to Title Case
            return part.split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          }).filter(Boolean).join(' > ') || 'Admin Panel';
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
    <header className="fixed top-0 right-0 left-64 bg-[var(--color-white)] shadow z-10"> {/* Make header fixed */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{getPageTitle()}</h1>
        <div className="text-sm font-medium text-[var(--color-text-muted)]">
          {getCurrentDate()}
        </div>
      </div>
    </header>
  );
};

export default Header;