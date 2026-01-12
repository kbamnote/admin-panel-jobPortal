import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { allApplicants, deleteAccount } from '../../utils/Api';
import { User, Mail, Calendar, Briefcase, Building, FileText, Trash2 } from 'lucide-react';
import SuccessModal from '../../common/modal/SuccessModal';
import ErrorModal from '../../common/modal/ErrorModal';
import DeleteConfirmationModal from '../../common/modal/DeleteConfirmationModal';


const AllRoleDetails = () => {
  const [applicants, setApplicants] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [limit] = useState(10);

  // Keep currentPage within available range when totalPages changes
  useEffect(() => {
    setCurrentPage((p) => Math.min(p, Math.max(1, totalPages)));
  }, [totalPages]);


  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        setLoading(true);

        const response = await allApplicants(currentPage, limit);

        if (response.data?.success) {
          const data = response.data.data || {};
          const jobSeekers = data.jobSeekers || [];
          setApplicants(jobSeekers);
          setTotalPages(data.totalPages || 1);
          setTotalApplicants(data.totalJobSeekers ?? data.totalItems ?? jobSeekers.length);
          setCurrentPage((prev) => (data.currentPage && data.currentPage !== prev ? data.currentPage : prev));
        } else {
          setError('Failed to fetch applicants');
        }
      } catch (err) {
        setError('Error fetching applicants: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllApplicants();
  }, [currentPage, limit]);


  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUserRoleBadge = (role) => {
    const roleStyles = {
      admin: 'bg-purple-100 text-purple-800',
      eliteTeam: 'bg-blue-100 text-blue-800',
      jobHoster: 'bg-green-100 text-green-800',
      recruiter: 'bg-yellow-100 text-yellow-800',
      jobSeeker: 'bg-indigo-100 text-indigo-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleStyles[role] || 'bg-gray-100 text-gray-800'}`}>
        {role}
      </span>
    );
  };

  const getApplicationStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      const idToDelete = userToDelete?.user?._id || userToDelete?._id;
      if (!idToDelete) {
        setErrorMessage('User id not found');
        setIsErrorModalOpen(true);
        return;
      }
      const response = await deleteAccount(idToDelete);
      if (response.data.success) {
        // Remove the deleted user from the list
        setApplicants(applicants.filter(applicant => (applicant?.user?._id || applicant?._id) !== idToDelete));
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        setSuccessMessage('User deleted successfully!');
        setIsSuccessModalOpen(true);
      } else {
        setErrorMessage('Failed to delete user: ' + response.data.message);
        setIsErrorModalOpen(true);
      }
    } catch (err) {
      setErrorMessage('Error deleting user: ' + (err.response?.data?.message || err.message));
      setIsErrorModalOpen(true);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">All Role Details</h1>
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border border-[var(--color-border)] rounded-xl p-5">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-border)] mr-4"></div>
                <div>
                  <div className="h-4 bg-[var(--color-border)] rounded w-32 mb-2"></div>
                  <div className="h-3 bg-[var(--color-border)] rounded w-48"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-3 bg-[var(--color-border)] rounded w-full"></div>
                <div className="h-3 bg-[var(--color-border)] rounded w-full"></div>
                <div className="h-3 bg-[var(--color-border)] rounded w-full"></div>
                <div className="h-3 bg-[var(--color-border)] rounded w-full"></div>
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
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">All Role Details</h1>
        <div className="text-[var(--color-error)] text-center py-12 bg-[var(--color-accent-light)] rounded-lg">
          <div className="text-xl font-semibold mb-2">Error Loading Data</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (selectedUser) {
    const user = selectedUser?.user || selectedUser || {};
    const profile = user?.profile || {};
    const applications = user.role === 'jobSeeker' ? selectedUser.applications || [] : [];
    const postedJobs = user.role !== 'jobSeeker' ? selectedUser.postedJobs || [] : [];

    return (
      <div className="bg-[var(--color-white)] p-4 rounded-xl shadow-lg sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center">
            <button
              onClick={() => setSelectedUser(null)}
              className="flex items-center text-[var(--color-primary)] hover:text-[var(--color-dark-secondary)] mr-4"
            >
              <span className="text-lg font-medium">←</span>
              <span className="ml-1">Back to All Users</span>
            </button>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">User Details</h1>
          </div>
          <button
            onClick={() => handleDeleteClick(selectedUser)}
            className="flex items-center px-4 py-2 bg-[var(--color-error)] text-[var(--color-text-white)] rounded-lg hover:bg-[#dc2626] transition-colors self-start sm:self-auto"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete User
          </button>
        </div>

        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-dark-secondary)] rounded-xl p-4 mb-6 text-white sm:p-6">
          <div className="flex flex-col md:flex-row md:items-start">
            {profile.photo ? (
              <img
                src={profile.photo}
                alt={user.name}
                className="w-24 h-24 object-cover rounded-full mr-0 mb-4 md:mr-6 md:mb-0 border-4 border-white shadow-lg mx-auto md:mx-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mr-0 mb-4 md:mr-6 md:mb-0 border-4 border-white shadow-lg mx-auto md:mx-0">
                <span className="text-3xl font-bold text-[var(--color-primary)]">
                  {user.name?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2 text-white sm:text-3xl">
                {user.name || 'Unknown User'}
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                {getUserRoleBadge(user.role)}
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-[#E94560]">
                  Joined {formatDate(user.createdAt)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center justify-center sm:justify-start">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>{user.email || 'No email provided'}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center justify-center sm:justify-start">
                    <span className="font-medium">{profile.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Profile Information */}
            <div className="bg-[var(--color-background-light)] rounded-xl p-4 mb-6 sm:p-6">
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Profile Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.companyName && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Company Name</p>
                    <p className="font-medium">{profile.companyName}</p>
                  </div>
                )}
                {profile.companyDescription && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Company Description</p>
                    <p className="font-medium">{profile.companyDescription}</p>
                  </div>
                )}
                {profile.companyWebsite && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Company Website</p>
                    <a href={profile.companyWebsite} target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-primary)] hover:underline">
                      {profile.companyWebsite}
                    </a>
                  </div>
                )}
                {profile.companyEmail && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Company Email</p>
                    <p className="font-medium">{profile.companyEmail}</p>
                  </div>
                )}
                {profile.numberOfEmployees && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Number of Employees</p>
                    <p className="font-medium">{profile.numberOfEmployees}</p>
                  </div>
                )}
                {profile.companyPhone && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Company Phone</p>
                    <p className="font-medium">{profile.companyPhone}</p>
                  </div>
                )}
                {profile.panCardNumber && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">PAN Card Number</p>
                    <p className="font-medium">{profile.panCardNumber}</p>
                  </div>
                )}
                {profile.gstNumber && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">GST Number</p>
                    <p className="font-medium">{profile.gstNumber}</p>
                  </div>
                )}
                {profile.age && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Age</p>
                    <p className="font-medium">{profile.age} years</p>
                  </div>
                )}
                {profile.gender && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Gender</p>
                    <p className="font-medium">{profile.gender}</p>
                  </div>
                )}
                {profile.address && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg sm:col-span-2">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Address</p>
                    <p className="font-medium">{profile.address}</p>
                  </div>
                )}
                {profile.designation && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Designation</p>
                    <p className="font-medium">{profile.designation}</p>
                  </div>
                )}
                {profile.expInWork && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Experience</p>
                    <p className="font-medium">{profile.expInWork}</p>
                  </div>
                )}
                {profile.noticePeriod && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Notice Period</p>
                    <p className="font-medium">{profile.noticePeriod}</p>
                  </div>
                )}
                {profile.highestEducation && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Highest Education</p>
                    <p className="font-medium">{profile.highestEducation}</p>
                  </div>
                )}
                {profile.preferredCategory && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Preferred Category</p>
                    <p className="font-medium">{profile.preferredCategory}</p>
                  </div>
                )}
                {profile.preferredLocation && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Preferred Location</p>
                    <p className="font-medium">{profile.preferredLocation}</p>
                  </div>
                )}
                {profile.salaryExpectation && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Salary Expectation</p>
                    <p className="font-medium">{profile.salaryExpectation}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Applications (only for jobSeeker) */}
            {user.role === 'jobSeeker' && (
              <div className="bg-[var(--color-background-light)] rounded-xl p-4 sm:p-6">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Applications ({applications.length})</h3>
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div
                        key={application._id}
                        className="bg-[var(--color-white)] rounded-lg p-4 border border-[var(--color-border)] hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/jobs/${application.jobId?._id}`)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-[var(--color-text-primary)]">{application.jobId?.title || 'Unknown Job'}</h4>
                          {getApplicationStatusBadge(application.status)}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)] mb-3">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            <span>{application.jobId?.company?.name || 'Unknown Company'}</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            <span>{application.jobId?.jobType || 'Not specified'}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Applied: {formatDate(application.appliedAt)}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {application.jobId?.skills?.slice(0, 3).map((skill, index) => (
                            <span key={index} className="bg-[var(--color-accent-light)] px-2 py-1 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                          {application.jobId?.skills && application.jobId.skills.length > 3 && (
                            <span className="bg-[var(--color-accent-light)] px-2 py-1 rounded-full text-xs">
                              +{application.jobId.skills.length - 3} more
                            </span>
                          )}
                        </div>
                        {application.resume && (
                          <div className="mt-3">
                            <a
                              href={application.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-dark-secondary)] transition-colors text-sm"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              View Resume
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--color-text-muted)]">No applications found for this user.</p>
                )}
              </div>
            )}

            {/* Posted Jobs (for non-jobSeeker roles) */}
            {user.role !== 'jobSeeker' && (
              <div className="bg-[var(--color-background-light)] rounded-xl p-4 sm:p-6">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Posted Jobs ({postedJobs.length})</h3>
                {postedJobs.length > 0 ? (
                  <div className="space-y-4">
                    {postedJobs.map((job) => (
                      <div
                        key={job._id}
                        className="bg-[var(--color-white)] rounded-lg p-4 border border-[var(--color-border)] hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/jobs/${job._id}`)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-[var(--color-text-primary)]">{job.title || 'Unknown Job'}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {job.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)] mb-3">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            <span>{job.company?.name || 'Unknown Company'}</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            <span>{job.jobType || 'Not specified'}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Posted: {formatDate(job.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {job.skills?.slice(0, 3).map((skill, index) => (
                            <span key={index} className="bg-[var(--color-accent-light)] px-2 py-1 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                          {job.skills && job.skills.length > 3 && (
                            <span className="bg-[var(--color-accent-light)] px-2 py-1 rounded-full text-xs">
                              +{job.skills.length - 3} more
                            </span>
                          )}
                        </div>
                        <div className="mt-3">
                          <span className="text-sm text-[var(--color-text-secondary)]">
                            {job.location?.join(', ') || 'No location specified'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--color-text-muted)]">No posted jobs found for this user.</p>
                )}
              </div>
            )}
          </div>

          <div>
            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="bg-[var(--color-background-light)] rounded-xl p-4 mb-6 sm:p-6">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-[#E94560] bg-opacity-10 text-white px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {(profile.githubUrl || profile.linkedinUrl) && (
              <div className="bg-[var(--color-background-light)] rounded-xl p-4 mb-6 sm:p-6">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Social Links</h3>
                <div className="space-y-3">
                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-[var(--color-white)] rounded-lg hover:bg-[var(--color-accent-light)] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-xs">GH</span>
                      </div>
                      <span className="font-medium">GitHub Profile</span>
                    </a>
                  )}
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-[var(--color-white)] rounded-lg hover:bg-[var(--color-accent-light)] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-xs">IN</span>
                      </div>
                      <span className="font-medium">LinkedIn Profile</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Education */}
            {profile.education && profile.education.length > 0 && (
              <div className="bg-[var(--color-background-light)] rounded-xl p-4 mb-6 sm:p-6">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Education</h3>
                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="bg-[var(--color-white)] p-4 rounded-lg">
                      <h4 className="font-bold text-[var(--color-text-primary)]">{edu.degree}</h4>
                      <p className="text-[var(--color-primary)] font-medium">{edu.institution}</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">{edu.field}</p>
                      <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {profile.experience && profile.experience.length > 0 && (
              <div className="bg-[var(--color-background-light)] rounded-xl p-4 sm:p-6">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Work Experience</h3>
                <div className="space-y-4">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="bg-[var(--color-white)] p-4 rounded-lg">
                      <h4 className="font-bold text-[var(--color-text-primary)]">{exp.position}</h4>
                      <p className="text-[var(--color-primary)] font-medium">{exp.company}</p>
                      <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                      </p>
                      <p className="text-[var(--color-text-secondary)] mt-2">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-white)] p-4 rounded-xl shadow-lg sm:p-6">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">All Role Details ({applicants.length})</h1>

      {applicants.length === 0 ? (
        <div className="text-center py-12 bg-[var(--color-background-light)] rounded-lg">
          <div className="text-[var(--color-text-light)] text-5xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-[var(--color-text-secondary)] mb-2">No Users Found</h3>
          <p className="text-[var(--color-text-muted)]">There are no users in the system yet.</p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

            {Array.isArray(applicants) && applicants.map((applicant) => {
              const user = applicant?.user || applicant || {};
              const profile = user?.profile || {};

              return (
                <div
                  key={user._id}
                  onClick={() => setSelectedUser(applicant)}
                  className="group relative cursor-pointer rounded-2xl border border-[var(--color-border)]
             bg-gradient-to-br from-[var(--color-background-light)] to-[var(--color-white)]
             p-5 shadow-sm transition-all duration-300
             hover:-translate-y-1 hover:shadow-xl hover:border-[var(--color-primary)]"
                >
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(applicant);
                    }}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full
               bg-[var(--color-error)]/90 text-[var(--color-text-white)]
               opacity-0 scale-90 transition-all
               group-hover:opacity-100 group-hover:scale-100
               hover:bg-[#dc2626]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Header */}
                  <div className="flex items-center gap-4 mb-5">
                    {profile.photo ? (
                      <img
                        src={profile.photo}
                        alt={user.name}
                        className="h-14 w-14 rounded-full object-cover border-2 border-[var(--color-border)]
                   shadow-sm group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-full
                   border-2 border-[var(--color-border)]
                   bg-[var(--color-accent-light)] text-lg font-bold
                   text-[var(--color-text-secondary)]"
                      >
                        {user.name?.charAt(0) || 'U'}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-[var(--color-text-primary)]
                     group-hover:text-[var(--color-primary)] transition-colors">
                        {user.name || 'Unknown User'}
                      </h3>
                      <p className="truncate text-sm text-[var(--color-text-secondary)]">
                        {user.email || 'No email'}
                      </p>
                    </div>
                  </div>

                  <div>
                    {/* Badges */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {getUserRoleBadge(user.role)}
                      <span className="rounded-full bg-[var(--color-accent-light)]
                     px-3 py-1 text-xs font-medium
                     text-[var(--color-text-secondary)]">
                        {formatDate(user.createdAt)}
                      </span>
                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--color-text-muted)]">
                          {user.role === 'jobSeeker'
                            ? `${applicant.applications?.length || 0} applications`
                            : `${applicant.postedJobs?.length || 0} posted jobs`}
                        </span>

                        {profile.companyName && (
                          <span
                            title={profile.companyName}
                            className="max-w-[140px] truncate text-xs
                   text-[var(--color-text-secondary)]"
                          >
                            {profile.companyName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">

              {/* Previous */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-[var(--color-border)]
                 px-4 py-2 text-sm
                 text-[var(--color-text-secondary)]
                 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:bg-[var(--color-accent-light)] transition"
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-lg px-4 py-2 text-sm transition
            ${currentPage === page
                        ? "bg-[var(--color-primary)] text-[var(--color-text-white)]"
                        : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-light)]"
                      }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-[var(--color-border)]
                 px-4 py-2 text-sm
                 text-[var(--color-text-secondary)]
                 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:bg-[var(--color-accent-light)] transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteUser}
        title="Confirm Deletion"
        message={`Are you sure you want to delete user "${userToDelete?.user?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AllRoleDetails;