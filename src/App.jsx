import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/pages/auth/Login';
import Dashboard from './components/pages/dashboard/Dashboard';
import Jobs from './components/pages/jobs/Jobs';
import JobDetails from './components/pages/jobs/JobDetails';
import Applicants from './components/pages/applicants/Applicants';
import Team from './components/pages/team/Team';
import Layout from './components/common/Layout';
import './App.css';
import Cookies from 'js-cookie';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('token');
  return token ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const token = Cookies.get('token');
  return token ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route - redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Login route - redirect to dashboard if already authenticated */}
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
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
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
            path="/applicants" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Applicants />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/team" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Team />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;