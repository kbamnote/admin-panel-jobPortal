import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { allJobs, allApplicants, getTeamDetails, getAllApplicants } from '../../utils/Api';
import { Users, Briefcase, FileText, Users2, Building, Clock } from 'lucide-react';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = Cookies.get('userRole') || 'admin';
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    totalTeamMembers: 0,
    activeJobs: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplicants, setRecentApplicants] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all required data in parallel
        const [jobsResponse, applicantsResponse, teamResponse, allUsersResponse] = await Promise.all([
          allJobs(1, 100), // Get first 100 jobs to count total and active
          allApplicants(1, 100), // Get first 100 applicants
          getTeamDetails(),
          getAllApplicants()
        ]);

        // Process jobs data
        let totalJobs = 0;
        let activeJobs = 0;
        let jobsData = [];
        
        if (jobsResponse.data.success) {
          const jobs = jobsResponse.data.data.jobs || jobsResponse.data.data;
          totalJobs = jobsResponse.data.data.totalJobs || jobs.length || 0;
          activeJobs = jobs.filter(job => job.isActive).length;
          // Get 5 most recent jobs
          jobsData = jobs.slice(0, 5);
        }

        // Process applicants data
        let totalApplicants = 0;
        let applicantsData = [];
        
        if (applicantsResponse.data.success) {
          const applicants = applicantsResponse.data.data.jobSeekers || [];
          totalApplicants = applicantsResponse.data.data.totalJobSeekers || applicants.length || 0;
          // Get 5 most recent applicants
          applicantsData = applicants.slice(0, 5);
        }

        // Process team data
        let totalTeamMembers = 0;
        
        if (teamResponse.data.success) {
          totalTeamMembers = teamResponse.data.data.length || 0;
        }

        // Process all users data
        let totalUsers = 0;
        
        if (allUsersResponse.data.success) {
          totalUsers = allUsersResponse.data.data.length || 0;
        }

        setStats({
          totalJobs,
          totalApplicants,
          totalTeamMembers,
          activeJobs,
          totalUsers
        });

        setRecentJobs(jobsData);
        setRecentApplicants(applicantsData);
      } catch (err) {
        setError('Error fetching dashboard data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleApplicantClick = (applicantId) => {
    navigate(`/applicants/${applicantId}`);
  };

  if (loading) {
    return (
      <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">Dashboard</h1>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="bg-[var(--color-background-light)] p-6 rounded-xl">
                <div className="h-6 bg-[var(--color-border)] rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-[var(--color-border)] rounded w-3/4"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[var(--color-background-light)] p-6 rounded-xl">
              <div className="h-6 bg-[var(--color-border)] rounded w-1/3 mb-4"></div>
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-4 bg-[var(--color-border)] rounded w-full mb-3"></div>
              ))}
            </div>
            <div className="bg-[var(--color-background-light)] p-6 rounded-xl">
              <div className="h-6 bg-[var(--color-border)] rounded w-1/3 mb-4"></div>
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-4 bg-[var(--color-border)] rounded w-full mb-3"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">Dashboard</h1>
        <div className="text-[var(--color-error)] text-center py-12 bg-[var(--color-accent-light)] rounded-lg">
          <div className="text-xl font-semibold mb-2">Error Loading Dashboard</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-dark-secondary)] p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Jobs</p>
              <p className="text-3xl font-bold mt-1">{stats.totalJobs}</p>
            </div>
            <Briefcase className="h-10 w-10 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[var(--color-accent)] to-[#E94560] p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Active Jobs</p>
              <p className="text-3xl font-bold mt-1">{stats.activeJobs}</p>
            </div>
            <Clock className="h-10 w-10 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#10b981] to-[#047857] p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Applicants</p>
              <p className="text-3xl font-bold mt-1">{stats.totalApplicants}</p>
            </div>
            <Users className="h-10 w-10 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Team Members</p>
              <p className="text-3xl font-bold mt-1">{stats.totalTeamMembers}</p>
            </div>
            <Users2 className="h-10 w-10 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#f59e0b] to-[#d97706] p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Users</p>
              <p className="text-3xl font-bold mt-1">{stats.totalUsers}</p>
            </div>
            <Users className="h-10 w-10 opacity-80" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-[var(--color-background-light)] rounded-xl p-6">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
            Recent Jobs
          </h2>
          {recentJobs.length === 0 ? (
            <p className="text-[var(--color-text-muted)] text-center py-4">No jobs found</p>
          ) : (
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div 
                  key={job._id} 
                  className="bg-[var(--color-white)] p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] cursor-pointer transition-colors"
                  onClick={() => handleJobClick(job._id)}
                >
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-[var(--color-text-primary)]">{job.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      job.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">{job.company?.name}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-[var(--color-text-muted)]">
                      Posted: {formatDate(job.createdAt)}
                    </span>
                    <span className="text-xs bg-[var(--color-accent-light)] text-[var(--color-accent)] px-2 py-1 rounded">
                      {job.jobType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Recent Applicants */}
        <div className="bg-[var(--color-background-light)] rounded-xl p-6">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
            Recent Applicants
          </h2>
          {recentApplicants.length === 0 ? (
            <p className="text-[var(--color-text-muted)] text-center py-4">No applicants found</p>
          ) : (
            <div className="space-y-4">
              {recentApplicants.map((applicant) => (
                <div 
                  key={applicant._id} 
                  className="bg-[var(--color-white)] p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] cursor-pointer transition-colors"
                  onClick={() => handleApplicantClick(applicant._id)}
                >
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-[var(--color-text-primary)]">{applicant.name}</h3>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">{applicant.email}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-[var(--color-text-muted)]">
                      Joined: {formatDate(applicant.createdAt)}
                    </span>
                    {applicant.profile?.designation && (
                      <span className="text-xs bg-[var(--color-accent-light)] text-[var(--color-accent)] px-2 py-1 rounded">
                        {applicant.profile.designation}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {userRole === 'admin' && (
        <div className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
          <p>Welcome back, Administrator. You have full access to all system features.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;