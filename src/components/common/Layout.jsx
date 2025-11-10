import React from 'react';
import Sidebar from './sidebar/Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 p-6 mt-20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;