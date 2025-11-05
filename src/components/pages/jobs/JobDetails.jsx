import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsById, deleteJob, updateJobVerificationStatus } from '../../utils/Api';
import Modal from '../../common/modal/Modal';
import SuccessModal from '../../common/modal/SuccessModal';
import ErrorModal from '../../common/modal/ErrorModal';
import DeleteConfirmationModal from '../../common/modal/DeleteConfirmationModal';
import JobUpdateFormModal from './JobUpdateFormModal';
import { 
  MapPin, 
  Building, 
  Clock, 
  DollarSign, 
  Calendar, 
  User, 
  BookOpen, 
  CheckCircle, 
  Target, 
  Tag,
  Edit,
  Trash2,
  Globe,
  Image as ImageIcon,
  Users,
  GraduationCap,
  Briefcase,
  Sun,
  Check,
  X
} from 'lucide-react';
import Cookies from 'js-cookie';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userRole = Cookies.get('userRole') || 'admin';
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingVerification, setIsUpdatingVerification] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await jobsById(id);
        if (response.data.success) {
          setJob(response.data.data);
        } else {
          setError('Failed to fetch job details');
        }
      } catch (err) {
        setError('Error fetching job details: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleUpdateJob = (updatedJob) => {
    setJob(updatedJob);
    setSuccessMessage('Job updated successfully!');
    setIsSuccessModalOpen(true);
  };

  const handleDeleteJob = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteJob(id);
      if (response.data.success) {
        navigate('/jobs');
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

  const handleVerificationStatusUpdate = async (status) => {
    try {
      setIsUpdatingVerification(true);
      const response = await updateJobVerificationStatus(id, status);
      if (response.data.success) {
        // Update the job state with the new verification status
        setJob(prevJob => ({
          ...prevJob,
          verificationStatus: status
        }));
        setSuccessMessage(`Job ${status} successfully!`);
        setIsSuccessModalOpen(true);
      } else {
        setErrorMessage('Failed to update verification status: ' + response.data.message);
        setIsErrorModalOpen(true);
      }
    } catch (err) {
      setErrorMessage('Error updating verification status: ' + (err.response?.data?.message || err.message));
      setIsErrorModalOpen(true);
    } finally {
      setIsUpdatingVerification(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-[var(--color-border)] rounded w-1/3 mb-6"></div>
          <div className="h-6 bg-[var(--color-border)] rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-[var(--color-border)] rounded-xl p-5">
              <div className="h-6 bg-[var(--color-border)] rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-[var(--color-border)] rounded"></div>
                <div className="h-4 bg-[var(--color-border)] rounded w-5/6"></div>
                <div className="h-4 bg-[var(--color-border)] rounded w-2/3"></div>
              </div>
            </div>
            <div className="border border-[var(--color-border)] rounded-xl p-5">
              <div className="h-6 bg-[var(--color-border)] rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-[var(--color-border)] rounded"></div>
                <div className="h-4 bg-[var(--color-border)] rounded w-5/6"></div>
                <div className="h-4 bg-[var(--color-border)] rounded w-2/3"></div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="mb-6">
                <div className="h-6 bg-[var(--color-border)] rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-[var(--color-border)] rounded w-full mb-2"></div>
                <div className="h-4 bg-[var(--color-border)] rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-[var(--color-border)] rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
        <div className="text-[var(--color-error)] text-center py-12 bg-[var(--color-accent-light)] rounded-lg">
          <div className="text-xl font-semibold mb-2">Error Loading Job Details</div>
          <p>{error}</p>
          <button
            onClick={() => navigate('/jobs')}
            className="mt-6 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-dark-secondary)] transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
        <div className="text-center py-12 bg-[var(--color-background-light)] rounded-lg">
          <div className="text-[var(--color-text-light)] text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-[var(--color-text-secondary)] mb-2">Job Not Found</h3>
          <p className="text-[var(--color-text-muted)] mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-dark-secondary)] transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">{job.title}</h1>
            <div className="flex items-start mb-6">
              {job.company?.logo ? (
                <img 
                  src={job.company.logo} 
                  alt={job.company.name} 
                  className="w-16 h-16 object-contain rounded-lg mr-4 border border-[var(--color-border)]"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg mr-4 border border-[var(--color-border)] bg-[var(--color-background-light)] flex items-center justify-center">
                  <Building className="h-8 w-8 text-[var(--color-text-muted)]" />
                </div>
              )}
              <div>
                <div className="text-2xl font-bold text-[var(--color-primary)] mb-1">{job.company?.name}</div>
                <div className="text-[var(--color-text-secondary)] mb-2">
                  {job.company?.description || 'No company description provided'}
                </div>
                {job.company?.website && (
                  <a 
                    href={job.company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-[var(--color-primary)] hover:underline"
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    <span className="text-sm">{job.company.website}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            {/* Only show View Applicants and Delete Job buttons for admin role */}
            {userRole === 'admin' && (
              <>
                <button
                  onClick={() => navigate(`/jobs/${id}/applicants`)}
                  className="flex items-center px-4 py-2 bg-[var(--color-accent)] text-[var(--color-text-white)] rounded-lg transition-colors"
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Applicants
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={isDeleting}
                  className="flex items-center px-4 py-2 bg-[var(--color-error)] text-[var(--color-text-white)] rounded-lg hover:bg-[#dc2626] transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete Job'}
                </button>
              </>
            )}
            {/* Show Update Job button for both admin and eliteTeam roles */}
            <button
              onClick={() => setIsUpdateModalOpen(true)}
              className="flex items-center px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-dark-secondary)] transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Update Job
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center text-[var(--color-text-secondary)]">
            <MapPin className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
            <span>{job.location?.join(', ') || 'Location not specified'}</span>
          </div>
          <div className="flex items-center text-[var(--color-text-secondary)]">
            <DollarSign className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
            <span>
              {job.salary?.min ? 
                `${(job.salary.min/100000).toFixed(1)}-${(job.salary.max/100000).toFixed(1)}L ${job.salary.currency}` : 
                'Not disclosed'}
            </span>
          </div>
          <div className="flex items-center text-[var(--color-text-secondary)]">
            <User className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
            <span>{job.experienceLevel}</span>
          </div>
          {/* Verification Status Badge */}
          <div className="flex items-center text-[var(--color-text-secondary)]">
            {job.verificationStatus === 'verified' ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <Check className="h-4 w-4 mr-1" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                <X className="h-4 w-4 mr-1" />
                Not Verified
              </span>
            )}
          </div>
        </div>

        {/* Verification Status Update Buttons - for admin and eliteTeam */}
        {(userRole === 'admin' || userRole === 'eliteTeam') && (
          <div className="bg-[var(--color-accent-light)] rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Verification Status</h3>
            <div className="flex flex-wrap gap-3">
              {job.verificationStatus !== 'verified' ? (
                <button
                  onClick={() => handleVerificationStatusUpdate('verified')}
                  disabled={isUpdatingVerification}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {isUpdatingVerification ? 'Verifying...' : 'Mark as Verified'}
                </button>
              ) : (
                <button
                  onClick={() => handleVerificationStatusUpdate('not verified')}
                  disabled={isUpdatingVerification}
                  className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  {isUpdatingVerification ? 'Updating...' : 'Mark as Not Verified'}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="bg-[var(--color-accent-light)] rounded-xl p-5 mb-8">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Job Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[var(--color-white)] p-3 rounded-lg">
              <div className="text-xs text-[var(--color-text-muted)] mb-1">Category</div>
              <div className="font-medium">{job.category || 'Not specified'}</div>
            </div>
            <div className="bg-[var(--color-white)] p-3 rounded-lg">
              <div className="text-xs text-[var(--color-text-muted)] mb-1">Openings</div>
              <div className="font-medium">{job.numberOfOpenings || 'Not specified'}</div>
            </div>
            <div className="bg-[var(--color-white)] p-3 rounded-lg">
              <div className="text-xs text-[var(--color-text-muted)] mb-1">Deadline</div>
              <div className="font-medium">
                {job.applicationDeadline ? formatDate(job.applicationDeadline) : 'Not specified'}
              </div>
            </div>
            <div className="bg-[var(--color-white)] p-3 rounded-lg">
              <div className="text-xs text-[var(--color-text-muted)] mb-1">Posted</div>
              <div className="font-medium">
                {job.createdAt ? formatDate(job.createdAt) : 'Not specified'}
              </div>
            </div>
            <div className="bg-[var(--color-white)] p-3 rounded-lg">
              <div className="text-xs text-[var(--color-text-muted)] mb-1">Interview Type</div>
              <div className="font-medium">{job.interviewType || 'Not specified'}</div>
            </div>
            <div className="bg-[var(--color-white)] p-3 rounded-lg">
              <div className="text-xs text-[var(--color-text-muted)] mb-1">Work Type</div>
              <div className="font-medium">{job.workType || 'Not specified'}</div>
            </div>
            <div className="bg-[var(--color-white)] p-3 rounded-lg">
              <div className="text-xs text-[var(--color-text-muted)] mb-1">Minimum Education</div>
              <div className="font-medium">{job.minEducation || 'Not specified'}</div>
            </div>
            <div className="bg-[var(--color-white)] p-3 rounded-lg">
              <div className="text-xs text-[var(--color-text-muted)] mb-1">Shift</div>
              <div className="font-medium">{job.shift || 'Not specified'}</div>
            </div>
            <div className="bg-[var(--color-white)] p-3 rounded-lg">
              <div className="text-xs text-[var(--color-text-muted)] mb-1">Notice Period</div>
              <div className="font-medium">{job.noticePeriod || 'Not specified'}</div>
            </div>
            <div className="bg-[var(--color-white)] p-3 rounded-lg">
              <div className="text-xs text-[var(--color-text-muted)] mb-1">Year of Passing</div>
              <div className="font-medium">{job.yearOfPassing || 'Not specified'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
          Job Description
        </h2>
        <div className="prose max-w-none bg-[var(--color-background-light)] rounded-xl p-5">
          <p className="text-[var(--color-text-secondary)] whitespace-pre-line">{job.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
            Requirements
          </h2>
          <ul className="bg-[var(--color-background-light)] rounded-xl p-5 space-y-3">
            {job.requirements?.length > 0 ? (
              job.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[var(--color-primary)] mr-2">•</span>
                  <span className="text-[var(--color-text-secondary)]">{req}</span>
                </li>
              ))
            ) : (
              <li className="text-[var(--color-text-muted)]">No requirements specified</li>
            )}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
            Responsibilities
          </h2>
          <ul className="bg-[var(--color-background-light)] rounded-xl p-5 space-y-3">
            {job.responsibilities?.length > 0 ? (
              job.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[var(--color-primary)] mr-2">•</span>
                  <span className="text-[var(--color-text-secondary)]">{resp}</span>
                </li>
              ))
            ) : (
              <li className="text-[var(--color-text-muted)]">No responsibilities specified</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center">
          <Tag className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
          Required Skills
        </h2>
        <div className="bg-[var(--color-background-light)] rounded-xl p-5">
          {job.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-[var(--color-accent-light)] text-[var(--color-accent)] px-3 py-1.5 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[var(--color-text-muted)]">No skills specified</p>
          )}
        </div>
      </div>

      {/* Posted By Information */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
          Posted By
        </h2>
        <div className="bg-[var(--color-background-light)] rounded-xl p-5">
          <div className="flex items-center mb-4">
            {job.postedBy?.profile?.photo ? (
              <img 
                src={job.postedBy.profile.photo} 
                alt={job.postedBy.name} 
                className="w-16 h-16 object-cover rounded-lg mr-4 border border-[var(--color-border)]"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg mr-4 border border-[var(--color-border)] bg-[var(--color-background-light)] flex items-center justify-center">
                <User className="h-8 w-8 text-[var(--color-text-muted)]" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-[var(--color-text-primary)] text-xl">{job.postedBy?.name || 'Unknown'}</h3>
              <p className="text-[var(--color-text-secondary)]">{job.postedBy?.email || 'No email provided'}</p>
     
            </div>
          </div>
          
          {job.postedBy?.profile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {job.postedBy.profile.companyName && (
                <div className="bg-[var(--color-white)] p-3 rounded-lg">
                  <div className="text-xs text-[var(--color-text-muted)] mb-1">Company Name</div>
                  <div className="font-medium">{job.postedBy.profile.companyName}</div>
                </div>
              )}
              {job.postedBy.profile.companyDescription && (
                <div className="bg-[var(--color-white)] p-3 rounded-lg">
                  <div className="text-xs text-[var(--color-text-muted)] mb-1">Company Description</div>
                  <div className="font-medium">{job.postedBy.profile.companyDescription}</div>
                </div>
              )}
              {job.postedBy.profile.companyWebsite && (
                <div className="bg-[var(--color-white)] p-3 rounded-lg">
                  <div className="text-xs text-[var(--color-text-muted)] mb-1">Company Website</div>
                  <a 
                    href={job.postedBy.profile.companyWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-[var(--color-primary)] hover:underline"
                  >
                    {job.postedBy.profile.companyWebsite}
                  </a>
                </div>
              )}
              {job.postedBy.profile.companyEmail && (
                <div className="bg-[var(--color-white)] p-3 rounded-lg">
                  <div className="text-xs text-[var(--color-text-muted)] mb-1">Company Email</div>
                  <div className="font-medium">{job.postedBy.profile.companyEmail}</div>
                </div>
              )}
              {job.postedBy.profile.numberOfEmployees && (
                <div className="bg-[var(--color-white)] p-3 rounded-lg">
                  <div className="text-xs text-[var(--color-text-muted)] mb-1">Number of Employees</div>
                  <div className="font-medium">{job.postedBy.profile.numberOfEmployees}</div>
                </div>
              )}
              {job.postedBy.profile.companyPhone && (
                <div className="bg-[var(--color-white)] p-3 rounded-lg">
                  <div className="text-xs text-[var(--color-text-muted)] mb-1">Company Phone</div>
                  <div className="font-medium">{job.postedBy.profile.companyPhone}</div>
                </div>
              )}
              {job.postedBy.profile.phone && (
                <div className="bg-[var(--color-white)] p-3 rounded-lg">
                  <div className="text-xs text-[var(--color-text-muted)] mb-1">Phone</div>
                  <div className="font-medium">{job.postedBy.profile.phone}</div>
                </div>
              )}
              {job.postedBy.profile.panCardNumber && (
                <div className="bg-[var(--color-white)] p-3 rounded-lg">
                  <div className="text-xs text-[var(--color-text-muted)] mb-1">PAN Card Number</div>
                  <div className="font-medium">{job.postedBy.profile.panCardNumber}</div>
                </div>
              )}
              {job.postedBy.profile.gstNumber && (
                <div className="bg-[var(--color-white)] p-3 rounded-lg">
                  <div className="text-xs text-[var(--color-text-muted)] mb-1">GST Number</div>
                  <div className="font-medium">{job.postedBy.profile.gstNumber}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Update Job Modal */}
      <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} title="Update Job Details">
        <JobUpdateFormModal 
          job={job} 
          onClose={() => setIsUpdateModalOpen(false)} 
          onSuccess={handleUpdateJob} 
        />
      </Modal>

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
          onClose={() => setIsDeleteModalOpen(false)} 
          onConfirm={handleDeleteJob} 
          title="Confirm Deletion" 
          message="Are you sure you want to delete this job? This action cannot be undone." 
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default JobDetails;