import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu } from 'lucide-react';

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
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

  // Function to determine if we should show back button
  const shouldShowBackButton = () => {
    // Show back button for detail pages and nested routes
    return location.pathname.includes('/jobs/') || 
           location.pathname.includes('/applicants/') ||
           location.pathname.includes('/team/');
  };

  // Function to determine back button destination
  const getBackButtonDestination = () => {
    if (location.pathname.startsWith('/jobs/') && location.pathname.endsWith('/applicants')) {
      // From job applicants back to job details
      const jobId = location.pathname.split('/')[2];
      return `/jobs/${jobId}`;
    } else if (location.pathname.startsWith('/jobs/') && !location.pathname.endsWith('/applicants')) {
      // From job details back to jobs list
      return '/jobs';
    } else if (location.pathname.startsWith('/applicants/')) {
      // From applicant details back to applicants list
      return '/applicants';
    } else if (location.pathname.startsWith('/team/posted-jobs')) {
      // From team posted jobs back to team
      return '/team';
    }
    // Default back to dashboard
    return '/dashboard';
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 bg-[var(--color-white)] shadow z-10"> {/* Make header fixed */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="md:hidden mr-4 p-2 rounded-lg hover:bg-[var(--color-background-light)] transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-[var(--color-text-primary)]" />
          </button>
          {shouldShowBackButton() && (
            <button
              onClick={() => navigate(getBackButtonDestination())}
              className="mr-4 p-2 rounded-lg hover:bg-[var(--color-background-light)] transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-[var(--color-text-primary)]" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{getPageTitle()}</h1>
        </div>
        <div className="text-sm font-medium text-[var(--color-text-muted)]">
          {getCurrentDate()}
        </div>
      </div>
    </header>
  );
};

export default Header;