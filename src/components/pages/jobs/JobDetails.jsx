import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsById, deleteJob } from '../../utils/Api';
import Modal from '../../common/modal/Modal';
import JobUpdateForm from './JobUpdateForm';
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
  Trash2
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
  };

  const handleDeleteJob = async () => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        const response = await deleteJob(id);
        if (response.data.success) {
          navigate('/jobs');
        } else {
          alert('Failed to delete job: ' + response.data.message);
        }
      } catch (err) {
        alert('Error deleting job: ' + (err.response?.data?.message || err.message));
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-gray-200 rounded-xl p-5">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="mb-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="text-red-500 text-center py-12 bg-red-50 rounded-lg">
          <div className="text-xl font-semibold mb-2">Error Loading Job Details</div>
          <p>{error}</p>
          <button
            onClick={() => navigate('/jobs')}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Job Not Found</h3>
          <p className="text-gray-500 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <div className="flex items-center text-indigo-600 mb-4">
              <Building className="h-5 w-5 mr-2" />
              <span className="text-xl font-semibold">{job.company?.name}</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Update Job
            </button>
            <button
              onClick={handleDeleteJob}
              disabled={isDeleting}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete Job'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
            <span>{job.location?.join(', ') || 'Location not specified'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-5 w-5 mr-2 text-indigo-500" />
            <span>
              {job.salary?.min ? 
                `${(job.salary.min/100000).toFixed(1)}-${(job.salary.max/100000).toFixed(1)}L ${job.salary.currency}` : 
                'Not disclosed'}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <User className="h-5 w-5 mr-2 text-indigo-500" />
            <span>{job.experienceLevel}</span>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-xl p-5 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Category</div>
              <div className="font-medium">{job.category || 'Not specified'}</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Openings</div>
              <div className="font-medium">{job.numberOfOpenings || 'Not specified'}</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Deadline</div>
              <div className="font-medium">
                {job.applicationDeadline ? formatDate(job.applicationDeadline) : 'Not specified'}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Posted</div>
              <div className="font-medium">
                {job.createdAt ? formatDate(job.createdAt) : 'Not specified'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
          Job Description
        </h2>
        <div className="prose max-w-none bg-gray-50 rounded-xl p-5">
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-indigo-500" />
            Requirements
          </h2>
          <ul className="bg-gray-50 rounded-xl p-5 space-y-3">
            {job.requirements?.length > 0 ? (
              job.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span className="text-gray-700">{req}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No requirements specified</li>
            )}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-indigo-500" />
            Responsibilities
          </h2>
          <ul className="bg-gray-50 rounded-xl p-5 space-y-3">
            {job.responsibilities?.length > 0 ? (
              job.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span className="text-gray-700">{resp}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No responsibilities specified</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Tag className="h-5 w-5 mr-2 text-indigo-500" />
          Required Skills
        </h2>
        <div className="bg-gray-50 rounded-xl p-5">
          {job.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills specified</p>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Job Details">
        <JobUpdateForm job={job} onClose={() => setIsModalOpen(false)} onUpdate={handleUpdateJob} />
      </Modal>
    </div>
  );
};

export default JobDetails;