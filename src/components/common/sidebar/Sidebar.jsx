import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, UserCircle, LogOut, ChevronDown, Plus, X } from 'lucide-react';
import Cookies from 'js-cookie';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = Cookies.get('userRole') || 'admin';
  const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);

  // Filter nav items based on user role
  const navItems = [
    // Show Dashboard for all roles including eliteTeam
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', href: '/jobs', icon: Briefcase, hasDropdown: true },
    // Only show these items for admin role
    ...(userRole === 'admin' ? [
      { name: 'Applicants', href: '/applicants', icon: Users },
      { name: 'All Role Details', href: '/all-role-details', icon: UserCircle },
      { name: 'Team', href: '/team', icon: UserCircle, hasDropdown: true }
    ] : [])
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Remove token and role from cookies
    Cookies.remove('token');
    Cookies.remove('userRole');
    // Redirect to login
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      <div className={`fixed inset-y-0 left-0 w-64 bg-[var(--color-primary)] text-[var(--color-text-white)] shadow-lg z-30 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 border-b border-[var(--color-dark-secondary)] px-4">
            <h1 className="text-xl font-bold text-white text-[var(--color-text-white)]">Job Admin Panel</h1>
            <button 
              className="md:hidden text-[var(--color-text-white)]"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                
                if (item.name === 'Jobs' && item.hasDropdown) {
                  return (
                    <li key={item.name}>
                      <div
                        className={`flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                          isActive(item.href)
                            ? 'bg-[var(--color-accent)] text-[var(--color-text-white)] shadow-md'
                            : 'text-[var(--color-text-light)] hover:bg-[var(--color-dark-secondary)] hover:text-[var(--color-text-white)]'
                        }`}
                        onClick={() => setIsJobsDropdownOpen(!isJobsDropdownOpen)}
                      >
                        <div className="flex items-center">
                          <Icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isJobsDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>
                      
                      {isJobsDropdownOpen && (
                        <div className="ml-8 mt-2 space-y-2">
                          <Link
                            to="/jobs"
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              isActive('/jobs')
                                ? 'bg-[var(--color-accent)] text-[var(--color-text-white)]'
                                : 'text-[var(--color-text-light)] hover:bg-[var(--color-dark-secondary)] hover:text-[var(--color-text-white)]'
                            }`}
                          >
                            <Briefcase className="mr-2 h-4 w-4" />
                            All Jobs
                          </Link>
                          <Link
                            to="/jobs/verified"
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              isActive('/jobs/verified')
                                ? 'bg-[var(--color-accent)] text-[var(--color-text-white)]'
                                : 'text-[var(--color-text-light)] hover:bg-[var(--color-dark-secondary)] hover:text-[var(--color-text-white)]'
                            }`}
                          >
                            <Briefcase className="mr-2 h-4 w-4" />
                            Verified Jobs
                          </Link>
                          <Link
                            to="/jobs/not-verified"
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              isActive('/jobs/not-verified')
                                ? 'bg-[var(--color-accent)] text-[var(--color-text-white)]'
                                : 'text-[var(--color-text-light)] hover:bg-[var(--color-dark-secondary)] hover:text-[var(--color-text-white)]'
                            }`}
                          >
                            <Briefcase className="mr-2 h-4 w-4" />
                            Not Verified Jobs
                          </Link>
                          <Link
                            to="/jobs/post"
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              isActive('/jobs/post')
                                ? 'bg-[var(--color-accent)] text-[var(--color-text-white)]'
                                : 'text-[var(--color-text-light)] hover:bg-[var(--color-dark-secondary)] hover:text-[var(--color-text-white)]'
                            }`}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Post Job
                          </Link>
                        </div>
                      )}
                    </li>
                  );
                }
                
                if (item.name === 'Team' && item.hasDropdown) {
                  return (
                    <li key={item.name}>
                      <div
                        className={`flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                          isActive(item.href)
                            ? 'bg-[var(--color-accent)] text-[var(--color-text-white)] shadow-md'
                            : 'text-[var(--color-text-light)] hover:bg-[var(--color-dark-secondary)] hover:text-[var(--color-text-white)]'
                        }`}
                        onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}
                      >
                        <div className="flex items-center">
                          <Icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isTeamDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>
                      
                      {isTeamDropdownOpen && (
                        <div className="ml-8 mt-2 space-y-2">
                          <Link
                            to="/team"
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              isActive('/team')
                                ? 'bg-[var(--color-accent)] text-[var(--color-text-white)]'
                                : 'text-[var(--color-text-light)] hover:bg-[var(--color-dark-secondary)] hover:text-[var(--color-text-white)]'
                            }`}
                          >
                            <UserCircle className="mr-2 h-4 w-4" />
                            Manage Team
                          </Link>
                          <Link
                            to="/team/posted-jobs"
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              isActive('/team/posted-jobs')
                                ? 'bg-[var(--color-accent)] text-[var(--color-text-white)]'
                                : 'text-[var(--color-text-light)] hover:bg-[var(--color-dark-secondary)] hover:text-[var(--color-text-white)]'
                            }`}
                          >
                            <Briefcase className="mr-2 h-4 w-4" />
                            Team Posted Jobs
                          </Link>
                        </div>
                      )}
                    </li>
                  );
                }
                
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-[var(--color-accent)] text-[var(--color-text-white)] shadow-md'
                          : 'text-[var(--color-text-light)] hover:bg-[var(--color-dark-secondary)] hover:text-[var(--color-text-white)]'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User role and logout - Enhanced design */}
          <div className="px-4 py-6 border-t border-[var(--color-dark-secondary)]">
            <div className="bg-[var(--color-dark-secondary)] rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-[var(--color-primary)] rounded-xl w-10 h-10 flex items-center justify-center">
                    <UserCircle className="text-[var(--color-text-white)] h-6 w-6" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-[var(--color-text-white)] capitalize">{userRole}</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-accent)] text-[var(--color-text-white)]">
                  Active
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-[var(--color-text-white)] bg-[var(--color-accent)] hover:bg-[#d63851] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] transition-colors duration-200"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;