import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { allJobs, allApplicants, getTeamDetails, getAllApplicants, getUserStatistics } from '../../utils/Api';
import { Users, Briefcase, FileText, Users2, Building, Clock } from 'lucide-react';
import Cookies from 'js-cookie';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
  const [userStats, setUserStats] = useState({
    overallStats: {
      weeklyStats: [],
      monthlyStats: [],
      totalUsers: 0
    },
    roleStats: {
      eliteTeam: 0,
      jobSeeker: 0,
      recruiter: 0,
      admin: 0,
      jobHoster: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [userStatsLoading, setUserStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [filterRole, setFilterRole] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('week');

  const handleFilterChange = async (role, period) => {
    setUserStatsLoading(true);
    try {
      const response = await getUserStatistics({ role, period });
      if (response.data.success) {
        setUserStats(response.data.data);
      }
    } catch (err) {
      setError('Error fetching user statistics: ' + err.message);
    } finally {
      setUserStatsLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    setFilterRole(role);
    handleFilterChange(role, filterPeriod);
  };

  const handlePeriodChange = (period) => {
    setFilterPeriod(period);
    handleFilterChange(filterRole, period);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all required data in parallel
        const [jobsResponse, applicantsResponse, teamResponse, allUsersResponse, userStatsResponse] = await Promise.all([
          allJobs(1, 100), // Get first 100 jobs to count total and active
          allApplicants(1, 100), // Get first 100 applicants
          getTeamDetails(),
          getAllApplicants(),
          getUserStatistics({ period: 'week', role: 'all' })
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

        // Process user statistics data
        let userStatsData = {
          overallStats: {
            weeklyStats: [],
            monthlyStats: [],
            totalUsers: 0
          },
          roleStats: {
            eliteTeam: 0,
            jobSeeker: 0,
            recruiter: 0,
            admin: 0,
            jobHoster: 0
          }
        };
      
        if (userStatsResponse.data.success) {
          userStatsData = userStatsResponse.data.data;
        }

        setStats({
          totalJobs,
          totalApplicants,
          totalTeamMembers,
          activeJobs,
          totalUsers
        });

        setUserStats(userStatsData);
        setRecentJobs(jobsData);
        setRecentApplicants(applicantsData);
      } catch (err) {
        setError('Error fetching dashboard data: ' + err.message);
      } finally {
        setLoading(false);
        setUserStatsLoading(false);
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

  const prepareChartData = () => {
    if (!userStats.overallStats) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Get data based on selected period
    let chartData = [];
    if (filterPeriod === 'week') {
      chartData = userStats.overallStats.weeklyStats || [];
    } else {
      chartData = userStats.overallStats.monthlyStats || [];
    }

    // Extract labels and data points
    let labels = [];
    let dataPoints = [];
  
    if (filterPeriod === 'week') {
      // For weekly data, use days
      labels = chartData.map(item => item.day || item.date);
      dataPoints = chartData.map(item => item.count || 0);
    } else {
      // For monthly data, use week ranges
      labels = chartData.map(item => {
        if (item.weekStart && item.weekEnd) {
          const start = new Date(item.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const end = new Date(item.weekEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return `${start} - ${end}`;
        }
        return item.weekStart || 'Unknown';
      });
      dataPoints = chartData.map(item => item.count || 0);
    }

    // Create dataset
    const dataset = {
      label: 'User Registrations',
      data: dataPoints,
      borderColor: '#3b82f6',
      backgroundColor: '#3b82f633',
      fill: true,
      tension: 0.4
    };

    return {
      labels: labels,
      datasets: [dataset]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Growth Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    }
  };

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
      
      {/* User Statistics Section */}
      <div className="bg-[var(--color-background-light)] rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 md:mb-0">
            User Statistics
          </h2>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center">
              <label className="mr-2 text-sm text-[var(--color-text-secondary)]">Period:</label>
              <select 
                value={filterPeriod}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="border border-[var(--color-border)] rounded-md px-2 py-1 text-sm"
              >
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="mr-2 text-sm text-[var(--color-text-secondary)]">Role:</label>
              <select 
                value={filterRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="border border-[var(--color-border)] rounded-md px-2 py-1 text-sm"
              >
                <option value="all">All Roles</option>
                <option value="jobSeeker">Job Seekers</option>
                <option value="jobHoster">Job Hosters</option>
                <option value="recruiter">Recruiters</option>
                <option value="eliteTeam">Elite Team</option>
              </select>
            </div>
          </div>
        </div>
        
        {userStatsLoading ? (
          <div className="animate-pulse h-64 flex items-center justify-center">
            <div className="text-[var(--color-text-muted)]">Loading statistics...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-[var(--color-border)]">
                <p className="text-sm text-[var(--color-text-secondary)]">Job Seekers</p>
                <p className="text-2xl font-bold text-[var(--color-primary)]">
                  {userStats.roleStats?.jobSeeker || 0}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-[var(--color-border)]">
                <p className="text-sm text-[var(--color-text-secondary)]">Job Hosters</p>
                <p className="text-2xl font-bold text-[#10b981]">
                  {userStats.roleStats?.jobHoster || 0}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-[var(--color-border)]">
                <p className="text-sm text-[var(--color-text-secondary)]">Recruiters</p>
                <p className="text-2xl font-bold text-[#8b5cf6]">
                  {userStats.roleStats?.recruiter || 0}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-[var(--color-border)]">
                <p className="text-sm text-[var(--color-text-secondary)]">Elite Team</p>
                <p className="text-2xl font-bold text-[#f59e0b]">
                  {userStats.roleStats?.eliteTeam || 0}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-[var(--color-border)]">
                <p className="text-sm text-[var(--color-text-secondary)]">Total Users</p>
                <p className="text-2xl font-bold text-[#ef4444]">
                  {userStats.overallStats?.totalUsers || 0}
                </p>
              </div>
            </div>
            
            <div className="h-80">
              <Line data={prepareChartData()} options={chartOptions} />
            </div>
          </>
        )}
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