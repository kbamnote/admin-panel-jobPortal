import React, { useState, useEffect } from 'react';
import { updateJob } from '../../utils/Api';

const JobUpdateForm = ({ job, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    jobType: '',
    salary: { min: '', max: '', currency: 'INR' },
    experienceLevel: '',
    category: '',
    numberOfOpenings: '',
    noticePeriod: '',
    workType: '',
    interviewType: '',
    requirements: '',
    responsibilities: '',
    skills: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        location: job.location?.join(', ') || '',
        jobType: job.jobType || '',
        salary: {
          min: job.salary?.min || '',
          max: job.salary?.max || '',
          currency: job.salary?.currency || 'INR'
        },
        experienceLevel: job.experienceLevel || '',
        category: job.category || '',
        numberOfOpenings: job.numberOfOpenings || '',
        noticePeriod: job.noticePeriod || '',
        workType: job.workType || '',
        interviewType: job.interviewType || '',
        requirements: job.requirements?.join('\n') || '',
        responsibilities: job.responsibilities?.join('\n') || '',
        skills: job.skills?.join(', ') || ''
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('salary.')) {
      const salaryField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        salary: {
          ...prev.salary,
          [salaryField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        location: formData.location.split(',').map(loc => loc.trim()).filter(loc => loc),
        requirements: formData.requirements.split('\n').map(req => req.trim()).filter(req => req),
        responsibilities: formData.responsibilities.split('\n').map(resp => resp.trim()).filter(resp => resp),
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      };

      const response = await updateJob(job._id, submitData);
      
      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      } else {
        setError('Failed to update job: ' + (response.data.message || 'Unknown error'));
      }
    } catch (err) {
      setError('Error updating job: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Type *
          </label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter locations separated by commas"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Experience Level
          </label>
          <input
            type="text"
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Salary Min (INR)
          </label>
          <input
            type="number"
            name="salary.min"
            value={formData.salary.min}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Salary Max (INR)
          </label>
          <input
            type="number"
            name="salary.max"
            value={formData.salary.max}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Openings
          </label>
          <input
            type="number"
            name="numberOfOpenings"
            value={formData.numberOfOpenings}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notice Period
          </label>
          <input
            type="text"
            name="noticePeriod"
            value={formData.noticePeriod}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Work Type
          </label>
          <select
            name="workType"
            value={formData.workType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Work Type</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interview Type
          </label>
          <select
            name="interviewType"
            value={formData.interviewType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Interview Type</option>
            <option value="On-site">On-site</option>
            <option value="Video">Video</option>
            <option value="Phone">Phone</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Requirements (one per line)
        </label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          rows={4}
          placeholder="Enter each requirement on a new line"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Responsibilities (one per line)
        </label>
        <textarea
          name="responsibilities"
          value={formData.responsibilities}
          onChange={handleChange}
          rows={4}
          placeholder="Enter each responsibility on a new line"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Skills (comma separated)
        </label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="Enter skills separated by commas"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Job'}
        </button>
      </div>
    </form>
  );
};

export default JobUpdateForm;