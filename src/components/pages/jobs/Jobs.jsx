import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { allJobs } from '../../utils/Api';
import { MapPin, Building, Clock, DollarSign, Calendar } from 'lucide-react';

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await allJobs();
        if (response.data.success) {
          setJobs(response.data.data.jobs);
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
  }, []);

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

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">All Posted Jobs</h2>
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="flex justify-between items-center">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
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
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">All Posted Jobs</h2>
        <div className="text-red-500 text-center py-12 bg-red-50 rounded-lg">
          <div className="text-xl font-semibold mb-2">Error Loading Jobs</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Posted Jobs</h2>
        <div className="text-sm text-gray-500">
          {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
        </div>
      </div>
      
      {jobs.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="text-gray-400 text-5xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
          <p className="text-gray-500">There are currently no job postings available.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div 
              key={job._id} 
              className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-300"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 cursor-pointer transition-colors">
                      {job.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      job.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <Building className="h-4 w-4 mr-2" />
                    <span className="font-medium text-indigo-600">{job.company?.name}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{job.location?.[0] || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {job.salary?.min ? 
                          `${(job.salary.min/100000).toFixed(1)}-${(job.salary.max/100000).toFixed(1)}L ${job.salary.currency}` : 
                          'Not disclosed'}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{job.jobType}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Posted on {formatDate(job.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row md:flex-col md:items-end gap-3">
                  <button
                    onClick={() => handleViewDetails(job._id)}
                    className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;