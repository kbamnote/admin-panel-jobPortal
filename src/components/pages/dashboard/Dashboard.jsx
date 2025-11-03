import React from 'react';

const Dashboard = () => {
  return (
    <div className="bg-[var(--color-white)] p-6 rounded-lg shadow card">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">Welcome to Admin Panel</h1>
        <p className="text-[var(--color-text-muted)]">Dashboard overview and statistics will be shown here.</p>
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[var(--color-white)] p-6 rounded-lg shadow card">
              <h3 className="text-lg font-medium text-[var(--color-text-primary)]">Users</h3>
              <p className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">120</p>
            </div>
            <div className="bg-[var(--color-white)] p-6 rounded-lg shadow card">
              <h3 className="text-lg font-medium text-[var(--color-text-primary)]">Jobs</h3>
              <p className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">42</p>
            </div>
            <div className="bg-[var(--color-white)] p-6 rounded-lg shadow card">
              <h3 className="text-lg font-medium text-[var(--color-text-primary)]">Applications</h3>
              <p className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">280</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;