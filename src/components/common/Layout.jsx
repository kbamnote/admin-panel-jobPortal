import React from 'react';
import Sidebar from './sidebar/Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64"> {/* Adjust margin based on sidebar width */}
        <Header />
        <main className="flex-1 p-6 mt-20"> {/* Add top margin to account for fixed header */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;