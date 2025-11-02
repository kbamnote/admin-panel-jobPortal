import React from 'react';

const Dashboard = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Admin Panel</h1>
        <p className="text-gray-600">Dashboard overview and statistics will be shown here.</p>
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Users</h3>
              <p className="mt-2 text-3xl font-semibold text-indigo-600">120</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Jobs</h3>
              <p className="mt-2 text-3xl font-semibold text-indigo-600">42</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Applications</h3>
              <p className="mt-2 text-3xl font-semibold text-indigo-600">280</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;