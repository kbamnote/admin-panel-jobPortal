import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob, updateCompanyLogo } from '../../utils/Api';
import SuccessModal from '../../common/modal/SuccessModal';
import ErrorModal from '../../common/modal/ErrorModal';
import { Image as ImageIcon, Upload } from 'lucide-react';

const PostJob = () => {
  const navigate = useNavigate();
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
    walkInDate: '',
    walkInTime: '',
    shift: '',
    requirements: '',
    responsibilities: '',
    skills: '',
    company: { name: '', description: '', website: '', logo: '' },
    applicationDeadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  const handleInputChange = (e) => {
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
    } else if (name.startsWith('company.')) {
      const companyField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        company: {
          ...prev.company,
          [companyField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return null;
    
    const formData = new FormData();
    formData.append('companyLogo', logoFile);
    
    try {
      const response = await updateCompanyLogo(formData);
      if (response.data.success && response.data.data.profile?.companyLogo) {
        return response.data.data.profile.companyLogo;
      }
      return null;
    } catch (error) {
      console.error('Logo upload failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Upload logo first if a file is selected
      let logoUrl = formData.company.logo;
      if (logoFile) {
        logoUrl = await uploadLogo();
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        company: {
          ...formData.company,
          logo: logoUrl || formData.company.logo
        },
        location: formData.location.split(',').map(loc => loc.trim()).filter(loc => loc),
        requirements: formData.requirements.split('\n').map(req => req.trim()).filter(req => req),
        responsibilities: formData.responsibilities.split('\n').map(resp => resp.trim()).filter(resp => resp),
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      };

      // Remove empty fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] === null || submitData[key] === undefined) {
          delete submitData[key];
        }
      });

      // Remove empty salary fields
      if (submitData.salary) {
        Object.keys(submitData.salary).forEach(key => {
          if (submitData.salary[key] === '' || submitData.salary[key] === null || submitData.salary[key] === undefined) {
            delete submitData.salary[key];
          }
        });
        if (Object.keys(submitData.salary).length === 0) {
          delete submitData.salary;
        }
      }

      // Remove empty company fields
      if (submitData.company) {
        Object.keys(submitData.company).forEach(key => {
          if (submitData.company[key] === '' || submitData.company[key] === null || submitData.company[key] === undefined) {
            delete submitData.company[key];
          }
        });
        if (Object.keys(submitData.company).length === 0) {
          delete submitData.company;
        }
      }

      const response = await createJob(submitData);
      
      if (response.data.success) {
        setSuccessMessage('Job posted successfully!');
        setIsSuccessModalOpen(true);
        // Reset form
        setFormData({
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
          walkInDate: '',
          walkInTime: '',
          shift: '',
          requirements: '',
          responsibilities: '',
          skills: '',
          company: { name: '', description: '', website: '', logo: '' },
          applicationDeadline: ''
        });
        setLogoFile(null);
        setLogoPreview('');
      } else {
        setErrorMessage('Failed to post job: ' + (response.data.message || 'Unknown error'));
        setIsErrorModalOpen(true);
      }
    } catch (err) {
      setErrorMessage('Error posting job: ' + (err.response?.data?.message || err.message));
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Post New Job</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Information Section */}
        <div className="bg-[var(--color-background-light)] p-5 rounded-xl">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Job Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g., Senior Software Engineer"
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Job Type *
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              >
                <option value="">Select Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter locations separated by commas"
                required
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              >
                <option value="">Select Experience Level</option>
                <option value="Fresher">Fresher</option>
                <option value="0-1 year of experience">0-1 year of experience</option>
                <option value="1-2 year of experience">1-2 year of experience</option>
                <option value="2-4 year of experience">2-4 year of experience</option>
                <option value="5+ year of experience">5+ year of experience</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Salary Min (INR)
              </label>
              <input
                type="number"
                name="salary.min"
                value={formData.salary.min}
                onChange={handleInputChange}
                placeholder="e.g., 500000"
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Salary Max (INR)
              </label>
              <input
                type="number"
                name="salary.max"
                value={formData.salary.max}
                onChange={handleInputChange}
                placeholder="e.g., 1000000"
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              >
                <option value="">Select Category</option>
                <option value="IT & Networking">IT & Networking</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
                <option value="Accounting">Accounting</option>
                <option value="Data Science">Data Science</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Human Resource">Human Resource</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Number of Openings
              </label>
              <input
                type="number"
                name="numberOfOpenings"
                value={formData.numberOfOpenings}
                onChange={handleInputChange}
                placeholder="e.g., 5"
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Notice Period
              </label>
              <select
                name="noticePeriod"
                value={formData.noticePeriod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              >
                <option value="">Select Notice Period</option>
                <option value="Immediate Joiner">Immediate Joiner</option>
                <option value="Upto 1 week">Upto 1 week</option>
                <option value="Upto 1 month">Upto 1 month</option>
                <option value="Upto 2 month">Upto 2 month</option>
                <option value="Any">Any</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Work Type
              </label>
              <select
                name="workType"
                value={formData.workType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              >
                <option value="">Select Work Type</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Interview Type
              </label>
              <select
                name="interviewType"
                value={formData.interviewType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              >
                <option value="">Select Interview Type</option>
                <option value="Online">Online</option>
                <option value="On-site">On-site</option>
                <option value="Walk-in">Walk-in</option>
              </select>
            </div>

            {/* Conditional fields for Walk-in interview type */}
            {formData.interviewType === 'Walk-in' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                    Walk-in Date *
                  </label>
                  <input
                    type="date"
                    name="walkInDate"
                    value={formData.walkInDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                    Walk-in Time *
                  </label>
                  <input
                    type="time"
                    name="walkInTime"
                    value={formData.walkInTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Shift
              </label>
              <select
                name="shift"
                value={formData.shift}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              >
                <option value="">Select Shift</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
              </select>
            </div>
          </div>
        </div>

        {/* Company Information Section */}
        <div className="bg-[var(--color-background-light)] p-5 rounded-xl">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Company Name *
              </label>
              <input
                type="text"
                name="company.name"
                value={formData.company.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Tech Solutions Inc."
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Company Website
              </label>
              <input
                type="text"
                name="company.website"
                value={formData.company.website}
                onChange={handleInputChange}
                placeholder="e.g., https://company.com"
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Company Description
            </label>
            <textarea
              name="company.description"
              value={formData.company.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Brief description of the company..."
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Company Logo
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[var(--color-border)] border-dashed rounded-lg cursor-pointer bg-[var(--color-background-light)] hover:bg-[var(--color-accent-light)] transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-[var(--color-text-muted)]" />
                      <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
                {logoFile && (
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    Selected file: {logoFile.name}
                  </p>
                )}
              </div>
              
              {(logoPreview || formData.company.logo) && (
                <div className="flex flex-col items-center">
                  <div className="text-xs text-[var(--color-text-secondary)] mb-2">Preview</div>
                  <img 
                    src={logoPreview || formData.company.logo} 
                    alt="Preview" 
                    className="w-20 h-20 object-contain border border-[var(--color-border)] rounded-md"
                  />
                </div>
              )}
              
              {formData.company.logo && !logoFile && (
                <div className="flex flex-col items-center">
                  <div className="text-xs text-[var(--color-text-secondary)] mb-2">Current Logo</div>
                  <img 
                    src={formData.company.logo} 
                    alt="Current Logo" 
                    className="w-20 h-20 object-contain border border-[var(--color-border)] rounded-md"
                  />
                </div>
              )}
              
              {!logoPreview && !formData.company.logo && (
                <div className="flex flex-col items-center">
                  <div className="text-xs text-[var(--color-text-secondary)] mb-2">No Logo</div>
                  <div className="w-20 h-20 flex items-center justify-center border border-[var(--color-border)] rounded-md bg-[var(--color-background-light)]">
                    <ImageIcon className="w-8 h-8 text-[var(--color-text-muted)]" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Job Description Section */}
        <div className="bg-[var(--color-background-light)] p-5 rounded-xl">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Job Description</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Detailed description of the role, responsibilities, and what candidates will be doing..."
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Requirements (one per line)
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              rows={4}
              placeholder="Enter each requirement on a new line
e.g., Bachelor's degree in Computer Science
e.g., 3+ years of experience in React"
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Responsibilities (one per line)
            </label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleInputChange}
              rows={4}
              placeholder="Enter each responsibility on a new line
e.g., Develop and maintain web applications
e.g., Collaborate with cross-functional teams"
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="e.g., JavaScript, React, Node.js, Python"
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/jobs')}
            className="px-4 py-2 border border-[var(--color-border)] rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-background-light)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--color-text-white)] bg-[var(--color-primary)] hover:bg-[var(--color-dark-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] btn-primary disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>

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
    </div>
  );
};

export default PostJob;