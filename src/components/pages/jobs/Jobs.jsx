import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { allJobs, deleteJob, jobsByTeamMember, adminPostedJobs, getTeamDetails } from '../../utils/Api';
import SuccessModal from '../../common/modal/SuccessModal';
import ErrorModal from '../../common/modal/ErrorModal';
import DeleteConfirmationModal from '../../common/modal/DeleteConfirmationModal';
import { MapPin, Building, Clock, DollarSign, Calendar, Trash2, Eye, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Cookies from 'js-cookie';

const Jobs = () => {
  const navigate = useNavigate();
  const userRole = Cookies.get('userRole') || 'admin';
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all', 'admin', 'teamMember'
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [limit] = useState(10); // Items per page

  useEffect(() => {
    // Only fetch team members for admin role, not for eliteTeam
    if (userRole === 'admin') {
      const fetchTeamMembers = async () => {
        try {
          const response = await getTeamDetails();
          if (response.data.success) {
            setTeamMembers(response.data.data);
          }
        } catch (err) {
          console.error('Error fetching team members:', err);
        }
      };

      fetchTeamMembers();
    }
  }, [userRole]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        let response;
        
        // For eliteTeam role, only show all jobs (no filtering)
        if (userRole === 'eliteTeam') {
          response = await allJobs(currentPage, limit);
        } else {
          // Admin role can use filters
          switch (filterType) {
            case 'admin':
              response = await adminPostedJobs(currentPage, limit);
              break;
            case 'teamMember':
              if (selectedTeamMember) {
                response = await jobsByTeamMember(selectedTeamMember, currentPage, limit);
              } else {
                response = await allJobs(currentPage, limit);
              }
              break;
            default: // 'all'
              response = await allJobs(currentPage, limit);
          }
        }
        
        if (response && response.data.success) {
          const data = response.data.data;
          setJobs(data.jobs || data);
          setTotalPages(data.totalPages || 1);
          setCurrentPage(data.currentPage || 1);
          setTotalJobs(data.totalJobs || data.length || 0);
        } else {
          setError('Failed to fetch jobs');
        }
      } catch (err) {
        setError('Error fetching jobs: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filterType, selectedTeamMember, userRole, currentPage, limit]);

  const handleViewDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    
    try {
      setIsDeleting(true);
      const response = await deleteJob(jobToDelete._id);
      if (response.data.success) {
        // Remove the deleted job from the list
        setJobs(jobs.filter(job => job._id !== jobToDelete._id));
        setIsDeleteModalOpen(false);
        setJobToDelete(null);
        setSuccessMessage('Job deleted successfully!');
        setIsSuccessModalOpen(true);
        // Also update total jobs count
        setTotalJobs(prev => prev - 1);
      } else {
        setErrorMessage('Failed to delete job: ' + response.data.message);
        setIsErrorModalOpen(true);
      }
    } catch (err) {
      setErrorMessage('Error deleting job: ' + (err.response?.data?.message || err.message));
      setIsErrorModalOpen(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    if (e.target.value !== 'teamMember') {
      setSelectedTeamMember('');
    }
    // Reset to first page when filter changes
    setCurrentPage(1);
  };

  const handleTeamMemberChange = (e) => {
    setSelectedTeamMember(e.target.value);
    // Reset to first page when team member changes
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
        {/* Hide filter dropdown for eliteTeam role */}
        {userRole === 'admin' && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Job Management</h2>
            <div className="flex space-x-2">
              <select 
                value={filterType}
                onChange={handleFilterChange}
                className="px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              >
                <option value="all">All Posted Jobs</option>
                <option value="admin">Admin Posted Jobs</option>
                <option value="teamMember">Team Member Jobs</option>
              </select>
              {filterType === 'teamMember' && (
                <select 
                  value={selectedTeamMember}
                  onChange={handleTeamMemberChange}
                  className="px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                >
                  <option value="">Select Team Member</option>
                  {teamMembers.map(member => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}
        {/* For eliteTeam role, show simple header */}
        {userRole === 'eliteTeam' && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Job Management</h2>
          </div>
        )}
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
        {/* Hide filter dropdown for eliteTeam role */}
        {userRole === 'admin' && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Job Management</h2>
            <div className="flex space-x-2">
              <select 
                value={filterType}
                onChange={handleFilterChange}
                className="px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              >
                <option value="all">All Posted Jobs</option>
                <option value="admin">Admin Posted Jobs</option>
                <option value="teamMember">Team Member Jobs</option>
              </select>
              {filterType === 'teamMember' && (
                <select 
                  value={selectedTeamMember}
                  onChange={handleTeamMemberChange}
                  className="px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                >
                  <option value="">Select Team Member</option>
                  {teamMembers.map(member => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}
        {/* For eliteTeam role, show simple header */}
        {userRole === 'eliteTeam' && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Job Management</h2>
          </div>
        )}
        <div className="text-[var(--color-error)] text-center py-12 bg-[var(--color-accent-light)] rounded-lg">
          <div className="text-xl font-semibold mb-2">Error Loading Jobs</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const getFilterTitle = () => {
    // For eliteTeam role, always show "All Posted Jobs"
    if (userRole === 'eliteTeam') {
      return 'All Posted Jobs';
    }
    
    switch (filterType) {
      case 'admin':
        return 'Admin Posted Jobs';
      case 'teamMember':
        if (selectedTeamMember) {
          const member = teamMembers.find(m => m._id === selectedTeamMember);
          return member ? `${member.name}'s Posted Jobs` : 'Team Member Jobs';
        }
        return 'Team Member Jobs';
      default:
        return 'All Posted Jobs';
    }
  };

  return (
    <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{getFilterTitle()}</h2>
        {/* Hide filter dropdown for eliteTeam role */}
        {userRole === 'admin' && (
          <div className="flex flex-col sm:flex-row gap-2">
            <select 
              value={filterType}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            >
              <option value="all">All Posted Jobs</option>
              <option value="admin">Admin Posted Jobs</option>
              <option value="teamMember">Team Member Jobs</option>
            </select>
            {filterType === 'teamMember' && (
              <select 
                value={selectedTeamMember}
                onChange={handleTeamMemberChange}
                className="px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              >
                <option value="">Select Team Member</option>
                {teamMembers.map(member => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
        <div className="text-sm text-[var(--color-text-muted)]">
          {totalJobs} {totalJobs === 1 ? 'job' : 'jobs'} found
        </div>
      </div>
      
      {jobs.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-background-light)] rounded-xl">
          <div className="text-[var(--color-text-light)] text-5xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-[var(--color-text-secondary)] mb-2">No jobs found</h3>
          <p className="text-[var(--color-text-muted)]">
            {userRole === 'admin' ? (
              filterType === 'admin' 
                ? 'There are currently no jobs posted by admin.' 
                : filterType === 'teamMember' 
                  ? (selectedTeamMember ? 'This team member has not posted any jobs yet.' : 'Please select a team member to view their jobs.')
                  : 'There are currently no job postings available.'
            ) : (
              'There are currently no job postings available.'
            )}
          </p>
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
                    
                    <div className="flex items-start mb-4">
                      {job.company?.logo ? (
                        <img 
                          src={job.company.logo} 
                          alt={job.company.name} 
                          className="w-12 h-12 object-contain rounded-md mr-3 border border-[var(--color-border)]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-md mr-3 border border-[var(--color-border)] bg-[var(--color-background-light)] flex items-center justify-center">
                          <Building className="h-6 w-6 text-[var(--color-text-muted)]" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-[var(--color-primary)]">{job.company?.name}</div>
                        <div className="text-sm text-[var(--color-text-muted)] mt-1 line-clamp-2">
                          {job.company?.description || 'No company description provided'}
                        </div>
                      </div>
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
                    {/* Only show delete button for admin role */}
                    {userRole === 'admin' && (
                      <button
                        onClick={() => handleDeleteClick(job)}
                        className="flex items-center px-4 py-2 bg-[var(--color-error)] text-[var(--color-text-white)] text-sm font-medium rounded-lg hover:bg-[#dc2626] transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-[var(--color-error)] focus:ring-offset-2"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    )}
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
                Page {currentPage} of {totalPages}
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

      {/* Success Modal */}
      <SuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
        title="Success" 
        message={successMessage} 
      />

      {/* Error Modal */}
      <ErrorModal 
        isOpen={isErrorModalOpen} 
        onClose={() => setIsErrorModalOpen(false)} 
        title="Error" 
        message={errorMessage} 
      />

      {/* Delete Confirmation Modal - only show for admin */}
      {userRole === 'admin' && (
        <DeleteConfirmationModal 
          isOpen={isDeleteModalOpen} 
          onClose={() => {
            setIsDeleteModalOpen(false);
            setJobToDelete(null);
          }} 
          onConfirm={handleDeleteJob} 
          title="Confirm Deletion" 
          message={`Are you sure you want to delete the job "${jobToDelete?.title}"? This action cannot be undone.`} 
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default Jobs;