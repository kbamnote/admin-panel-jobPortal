import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/pages/auth/Login';
import Dashboard from './components/pages/dashboard/Dashboard';
import Jobs from './components/pages/jobs/Jobs';
import JobDetails from './components/pages/jobs/JobDetails';
import JobApplicants from './components/pages/jobs/JobApplicants';
import PostJob from './components/pages/jobs/PostJob';
import Applicants from './components/pages/applicants/Applicants';
import ApplicantsDetails from './components/pages/applicants/ApplicantsDetails';
import AllRoleDetails from './components/pages/applicants/AllRoleDetails';
import Team from './components/pages/team/Team';
import TeamPostedJobs from './components/pages/team/TeamPostedJobs';
import Layout from './components/common/Layout';
import './App.css';
import Cookies from 'js-cookie';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = Cookies.get('token');
  const userRole = Cookies.get('userRole');
  
  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If allowedRoles is specified and userRole is not in allowedRoles, redirect to appropriate page
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect eliteTeam members to jobs page
    if (userRole === 'eliteTeam') {
      return <Navigate to="/jobs" replace />;
    }
    // For other roles, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Public Route Component (redirect to appropriate page if already logged in)
const PublicRoute = ({ children }) => {
  const token = Cookies.get('token');
  const userRole = Cookies.get('userRole');
  
  if (token) {
    // If user is eliteTeam, redirect to jobs page
    if (userRole === 'eliteTeam') {
      return <Navigate to="/jobs" replace />;
    }
    // For other roles, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route - redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Login route - redirect to appropriate page if already authenticated */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          
          {/* Protected routes with layout */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'recruiter', 'jobHoster']}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/jobs/post" 
            element={
              <ProtectedRoute>
                <Layout>
                  <PostJob />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/jobs/:id/applicants" 
            element={
              <ProtectedRoute>
                <Layout>
                  <JobApplicants />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/jobs/:id" 
            element={
              <ProtectedRoute>
                <Layout>
                  <JobDetails />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/jobs" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Jobs />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/applicants/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <ApplicantsDetails />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/applicants" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <Applicants />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/all-role-details" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <AllRoleDetails />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/team/posted-jobs" 
            element={
              <ProtectedRoute>
                <Layout>
                  <TeamPostedJobs />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/team" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <Team />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route - redirect to appropriate page */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;