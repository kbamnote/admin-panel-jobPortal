import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsByTeamMember, getTeamDetails } from '../../utils/Api';
import { MapPin, Building, Clock, DollarSign, Calendar, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const TeamPostedJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jobsError, setJobsError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [limit] = useState(10); // Items per page

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await getTeamDetails();
      if (response.data.success) {
        setTeamMembers(response.data.data || []);
      } else {
        setError('Failed to fetch team members');
      }
    } catch (err) {
      setError('Error fetching team members: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobsByTeamMember = async (teamMemberId, page = 1) => {
    if (!teamMemberId) return;
    
    try {
      setJobsLoading(true);
      setJobsError(null);
      const response = await jobsByTeamMember(teamMemberId, page, limit);
      if (response.data.success) {
        const data = response.data.data;
        setJobs(data.jobs || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
        setTotalJobs(data.totalJobs || 0);
      } else {
        setJobsError('Failed to fetch jobs');
      }
    } catch (err) {
      setJobsError('Error fetching jobs: ' + err.message);
    } finally {
      setJobsLoading(false);
    }
  };

  const handleTeamMemberChange = (e) => {
    const teamMemberId = e.target.value;
    setSelectedTeamMember(teamMemberId);
    setJobs([]); // Clear previous jobs
    setCurrentPage(1); // Reset to first page
    setTotalPages(1);
    setTotalJobs(0);
    if (teamMemberId) {
      fetchJobsByTeamMember(teamMemberId, 1);
    }
  };

  const handleViewDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && selectedTeamMember) {
      setCurrentPage(newPage);
      fetchJobsByTeamMember(selectedTeamMember, newPage);
    }
  };

  if (loading) {
    return (
      <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Team Posted Jobs</h2>
        
        <div className="mb-6">
          <div className="animate-pulse">
            <div className="h-10 bg-[var(--color-border)] rounded w-full"></div>
          </div>
        </div>
        
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border border-[var(--color-border)] rounded-xl p-6 bg-gradient-to-br from-[var(--color-white)] to-[var(--color-background-light)] shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="animate-pulse">
                <div className="h-6 bg-[var(--color-border)] rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-[var(--color-border)] rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-[var(--color-border)] rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-[var(--color-border)] rounded w-1/2 mb-6"></div>
                <div className="flex justify-between items-center">
                  <div className="h-8 bg-[var(--color-border)] rounded w-24"></div>
                  <div className="h-6 bg-[var(--color-border)] rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Team Posted Jobs</h2>
        
        <div className="mb-6">
          <select
            value={selectedTeamMember}
            onChange={handleTeamMemberChange}
            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-[var(--color-background-light)]"
            disabled
          >
            <option value="">Select a team member</option>
          </select>
        </div>
        
        <div className="text-[var(--color-error)] text-center py-12 bg-[var(--color-accent-light)] rounded-lg">
          <div className="text-xl font-semibold mb-2">Error Loading Team Members</div>
          <p>{error}</p>
          <button
            onClick={fetchTeamMembers}
            className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-dark-secondary)] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Team Posted Jobs</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          Select Team Member
        </label>
        <select
          value={selectedTeamMember}
          onChange={handleTeamMemberChange}
          className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        >
          <option value="">Select a team member</option>
          {teamMembers.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name} ({member.email})
            </option>
          ))}
        </select>
      </div>
      
      {jobsLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border border-[var(--color-border)] rounded-xl p-6 bg-gradient-to-br from-[var(--color-white)] to-[var(--color-background-light)] shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="animate-pulse">
                <div className="h-6 bg-[var(--color-border)] rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-[var(--color-border)] rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-[var(--color-border)] rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-[var(--color-border)] rounded w-1/2 mb-6"></div>
                <div className="flex justify-between items-center">
                  <div className="h-8 bg-[var(--color-border)] rounded w-24"></div>
                  <div className="h-6 bg-[var(--color-border)] rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : jobsError ? (
        <div className="text-[var(--color-error)] text-center py-12 bg-[var(--color-accent-light)] rounded-lg">
          <div className="text-xl font-semibold mb-2">Error Loading Jobs</div>
          <p>{jobsError}</p>
        </div>
      ) : !selectedTeamMember ? (
        <div className="text-center py-16 bg-[var(--color-background-light)] rounded-xl">
          <div className="text-[var(--color-text-light)] text-5xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-[var(--color-text-secondary)] mb-2">Select a Team Member</h3>
          <p className="text-[var(--color-text-muted)]">Choose a team member from the dropdown to view their posted jobs.</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-background-light)] rounded-xl">
          <div className="text-[var(--color-text-light)] text-5xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-[var(--color-text-secondary)] mb-2">No Jobs Found</h3>
          <p className="text-[var(--color-text-muted)]">This team member hasn't posted any jobs yet.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {jobs.map((job) => (
              <div 
                key={job._id} 
                className="border border-[var(--color-border)] rounded-xl p-6 bg-gradient-to-br from-[var(--color-white)] to-[var(--color-background-light)] shadow-sm hover:shadow-md transition-all duration-300 hover:border-[var(--color-primary)]"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] cursor-pointer transition-colors">
                        {job.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center text-[var(--color-text-secondary)] mb-4">
                      <Building className="h-4 w-4 mr-2" />
                      <span className="font-medium text-[var(--color-primary)]">{job.company?.name}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="flex items-center text-[var(--color-text-muted)]">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{job.location?.[0] || 'Location not specified'}</span>
                      </div>
                      <div className="flex items-center text-[var(--color-text-muted)]">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {job.salary?.min ? 
                            `${(job.salary.min/100000).toFixed(1)}-${(job.salary.max/100000).toFixed(1)}L ${job.salary.currency}` : 
                            'Not disclosed'}
                        </span>
                      </div>
                      <div className="flex items-center text-[var(--color-text-muted)]">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">{job.jobType}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-[var(--color-text-muted)] text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Posted on {formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row md:flex-col md:items-end gap-3">
                    <button
                      onClick={() => handleViewDetails(job._id)}
                      className="flex items-center px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] text-sm font-medium rounded-lg hover:bg-[var(--color-dark-secondary)] transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  currentPage === 1 
                    ? 'bg-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed' 
                    : 'bg-[var(--color-primary)] text-[var(--color-text-white)] hover:bg-[var(--color-dark-secondary)]'
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </button>
              
              <div className="text-sm text-[var(--color-text-muted)]">
                Page {currentPage} of {totalPages} ({totalJobs} total jobs)
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  currentPage === totalPages 
                    ? 'bg-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed' 
                    : 'bg-[var(--color-primary)] text-[var(--color-text-white)] hover:bg-[var(--color-dark-secondary)]'
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeamPostedJobs;