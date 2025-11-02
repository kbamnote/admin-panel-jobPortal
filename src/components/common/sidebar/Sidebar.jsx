import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, UserCircle, LogOut } from 'lucide-react';
import Cookies from 'js-cookie';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = Cookies.get('userRole') || 'admin';

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Applicants', href: '/applicants', icon: Users },
    { name: 'Team', href: '/team', icon: UserCircle },
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
    <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-indigo-700 to-indigo-800 text-white shadow-lg z-10">
      <div className="flex flex-col h-full">
        {/* Sidebar header */}
        <div className="flex items-center justify-center h-16 border-b border-indigo-600">
          <h1 className="text-xl font-bold text-white">Job Admin Panel</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-white text-indigo-700 shadow-md'
                        : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
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
        <div className="px-4 py-6 border-t border-indigo-600">
          <div className="bg-indigo-600 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="bg-indigo-500 rounded-xl w-10 h-10 flex items-center justify-center">
                  <UserCircle className="text-white h-6 w-6" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-white">Current Role</p>
                  <p className="text-xs text-indigo-200 capitalize">{userRole}</p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-indigo-800">
                Active
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-900 hover:bg-indigo-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;