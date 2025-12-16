import React from 'react';
import { updateJob, updateCompanyLogo, getJobCategories } from '../../utils/Api';
import { Edit3, Image as ImageIcon, Upload } from 'lucide-react';

const JobUpdateFormModal = ({ job, onClose, onSuccess }) => {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    location: '',
    jobType: '',
    salary: { min: '', max: '', currency: 'INR' },
    experienceLevel: '',
    minEducation: '',
    category: '',
    numberOfOpenings: '',
    noticePeriod: '',
    yearOfPassing: '',
    workType: '',
    interviewType: '',
    walkInDate: '',
    walkInTime: '',
    shift: '',
    requirements: '',
    responsibilities: '',
    skills: '',
    company: { name: '', description: '', website: '', logo: '' },
    directLink: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [logoFile, setLogoFile] = React.useState(null);
  const [logoPreview, setLogoPreview] = React.useState('');
  // State to track which fields are using custom input
  const [customInputs, setCustomInputs] = React.useState({
    jobType: false,
    experienceLevel: false,
    category: false,
    noticePeriod: false,
    workType: false,
    interviewType: false,
    shift: false
  });
  // State for dynamic categories
  const [categoryOptions, setCategoryOptions] = React.useState([]);
  const [categoriesLoading, setCategoriesLoading] = React.useState(true);

  // Fetch categories on component mount
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await getJobCategories();
        if (response.data.success) {
          // Extract just the category names from the response and sort them alphabetically
          const categories = response.data.data
            .map(item => item.category)
            .sort((a, b) => a.localeCompare(b));
          setCategoryOptions(categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        // Fallback to hardcoded options if API fails, sorted alphabetically
        setCategoryOptions([
          "Accounting", 
          "Customer Service", 
          "Data Science", 
          "Digital Marketing", 
          "Human Resource", 
          "IT & Networking", 
          "Project Manager", 
          "Sales & Marketing",
          "Other"
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  React.useEffect(() => {
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
        minEducation: job.minEducation || '',
        category: job.category || '',
        numberOfOpenings: job.numberOfOpenings || '',
        noticePeriod: job.noticePeriod || '',
        yearOfPassing: job.yearOfPassing || '',
        workType: job.workType || '',
        interviewType: job.interviewType || '',
        walkInDate: job.walkInDate || '',
        walkInTime: job.walkInTime || '',
        shift: job.shift || '',
        requirements: job.requirements?.join('\n') || '',
        responsibilities: job.responsibilities?.join('\n') || '',
        skills: job.skills?.join(', ') || '',
        company: {
          name: job.company?.name || '',
          description: job.company?.description || '',
          website: job.company?.website || '',
          logo: job.company?.logo || ''
        },
        directLink: job.directLink || ''
      });
      setLogoPreview(job.company?.logo || '');
    }
  }, [job]);

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

  const handleCustomInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const toggleCustomInput = (fieldName) => {
    setCustomInputs(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const uploadLogo = async () => {
    if (!logoFile) return null;
    
    const formData = new FormData();
    formData.append('companyLogo', logoFile);
    
    try {
      const response = await updateCompanyLogo(job._id, formData);
      if (response.data.success && response.data.data.company?.logo) {
        return response.data.data.company.logo;
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
    setError('');

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

      const response = await updateJob(job._id, submitData);
      
      if (response.data.success) {
        onSuccess(response.data.data);
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
        <div className="bg-[var(--color-accent-light)] border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded relative">
          {error}
        </div>
      )}

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
              Job Type
            </label>
            {customInputs.jobType ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.jobType}
                  onChange={(e) => handleCustomInputChange('jobType', e.target.value)}
                  placeholder="Enter custom job type"
                  className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
                />
                <button
                  type="button"
                  onClick={() => toggleCustomInput('jobType')}
                  className="px-3 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-md hover:bg-[var(--color-dark-secondary)]"
                >
                  Select
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
                >
                  <option value="">Select Job Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                </select>
                <button
                  type="button"
                  onClick={() => toggleCustomInput('jobType')}
                  className="px-3 py-2 bg-[var(--color-accent-light)] text-[var(--color-accent)] rounded-md hover:bg-[var(--color-accent)] hover:text-[var(--color-text-white)]"
                >
                  <Edit3 className="h-5 w-5" />
                </button>
              </div>
            )}
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
            {customInputs.experienceLevel ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.experienceLevel}
                  onChange={(e) => handleCustomInputChange('experienceLevel', e.target.value)}
                  placeholder="Enter custom experience level"
                  className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
                />
                <button
                  type="button"
                  onClick={() => toggleCustomInput('experienceLevel')}
                  className="px-3 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-md hover:bg-[var(--color-dark-secondary)]"
                >
                  Select
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
                >
                  <option value="">Select Experience Level</option>
                  <option value="Fresher">Fresher</option>
                  <option value="0-1 year of experience">0-1 year of experience</option>
                  <option value="1-2 year of experience">1-2 year of experience</option>
                  <option value="2-4 year of experience">2-4 year of experience</option>
                  <option value="5+ year of experience">5+ year of experience</option>
                </select>
                <button
                  type="button"
                  onClick={() => toggleCustomInput('experienceLevel')}
                  className="px-3 py-2 bg-[var(--color-accent-light)] text-[var(--color-accent)] rounded-md hover:bg-[var(--color-accent)] hover:text-[var(--color-text-white)]"
                >
                  <Edit3 className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Salary Min
            </label>
            <input
              type="text"
              name="salary.min"
              value={formData.salary.min}
              onChange={handleInputChange}
              placeholder="e.g., 500000, 5L, As per company standard"
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Salary Max
            </label>
            <input
              type="text"
              name="salary.max"
              value={formData.salary.max}
              onChange={handleInputChange}
              placeholder="e.g., 1000000, 10L, As per company standard"
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Minimum Education
            </label>
            <input
              type="text"
              name="minEducation"
              value={formData.minEducation}
              onChange={handleInputChange}
              placeholder="e.g., Bachelor's Degree, Master's Degree"
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Category *
            </label>
            {customInputs.category ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleCustomInputChange('category', e.target.value)}
                  placeholder="Enter custom category"
                  className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
                />
                <button
                  type="button"
                  onClick={() => toggleCustomInput('category')}
                  className="px-3 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-md hover:bg-[var(--color-dark-secondary)]"
                >
                  Select
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
                >
                  <option value="">Select Category</option>
                  {categoriesLoading ? (
                    <option value="" disabled>Loading...</option>
                  ) : (
                    categoryOptions.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))
                  )}
                </select>
                <button
                  type="button"
                  onClick={() => toggleCustomInput('category')}
                  className="px-3 py-2 bg-[var(--color-accent-light)] text-[var(--color-accent)] rounded-md hover:bg-[var(--color-accent)] hover:text-[var(--color-text-white)]"
                >
                  <Edit3 className="h-5 w-5" />
                </button>
              </div>
            )}
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
            {customInputs.noticePeriod ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.noticePeriod}
                  onChange={(e) => handleCustomInputChange('noticePeriod', e.target.value)}
                  placeholder="Enter custom notice period"
                  className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
                />
                <button
                  type="button"
                  onClick={() => toggleCustomInput('noticePeriod')}
                  className="px-3 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-md hover:bg-[var(--color-dark-secondary)]"
                >
                  Select
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <select
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
                >
                  <option value="">Select Notice Period</option>
                  <option value="Immediate Joiner">Immediate Joiner</option>
                  <option value="Upto 1 week">Upto 1 week</option>
                  <option value="Upto 1 month">Upto 1 month</option>
                  <option value="Upto 2 month">Upto 2 month</option>
                  <option value="Any">Any</option>
                </select>
                <button
                  type="button"
                  onClick={() => toggleCustomInput('noticePeriod')}
                  className="px-3 py-2 bg-[var(--color-accent-light)] text-[var(--color-accent)] rounded-md hover:bg-[var(--color-accent)] hover:text-[var(--color-text-white)]"
                >
                  <Edit3 className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Year of Passing
            </label>
            <input
              type="text"
              name="yearOfPassing"
              value={formData.yearOfPassing}
              onChange={handleInputChange}
              placeholder="e.g., 2023/2024 or 2023-2024"
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Direct Link
            </label>
            <input
              type="text"
              name="directLink"
              value={formData.directLink}
              onChange={handleInputChange}
              placeholder="e.g., https://company.com/careers/position"
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Work Type
            </label>
            {customInputs.workType ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.workType}
                  onChange={(e) => handleCustomInputChange('workType', e.target.value)}
                  placeholder="Enter custom work type"
                  className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
                />
                <button
                  type="button"
                  onClick={() => toggleCustomInput('workType')}
                  className="px-3 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-md hover:bg-[var(--color-dark-secondary)]"
                >
                  Select
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <select
                  name="workType"
                  value={formData.workType}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
                >
                  <option value="">Select Work Type</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                <button
                  type="button"
                  onClick={() => toggleCustomInput('workType')}
                  className="px-3 py-2 bg-[var(--color-accent-light)] text-[var(--color-accent)] rounded-md hover:bg-[var(--color-accent)] hover:text-[var(--color-text-white)]"
                >
                  <Edit3 className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Interview Type
            </label>
            {customInputs.interviewType ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.interviewType}
                  onChange={(e) => handleCustomInputChange('interviewType', e.target.value)}
                  placeholder="Enter custom interview type"
                  className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
                />
                <button
                  type="button"
                  onClick={() => toggleCustomInput('interviewType')}
                  className="px-3 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-md hover:bg-[var(--color-dark-secondary)]"
                >
                  Select
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <select
                  name="interviewType"
                  value={formData.interviewType}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
                >
                  <option value="">Select Interview Type</option>
                  <option value="Online">Online</option>
                  <option value="On-site">On-site</option>
                  <option value="Walk-in">Walk-in</option>
                </select>
                <button
                  type="button"
                  onClick={() => toggleCustomInput('interviewType')}
                  className="px-3 py-2 bg-[var(--color-accent-light)] text-[var(--color-accent)] rounded-md hover:bg-[var(--color-accent)] hover:text-[var(--color-text-white)]"
                >
                  <Edit3 className="h-5 w-5" />
                </button>
              </div>
            )}
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
            {customInputs.shift ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.shift}
                  onChange={(e) => handleCustomInputChange('shift', e.target.value)}
                  placeholder="Enter custom shift"
                  className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
                />
                <button
                  type="button"
                  onClick={() => toggleCustomInput('shift')}
                  className="px-3 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-md hover:bg-[var(--color-dark-secondary)]"
                >
                  Select
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
                >
                  <option value="">Select Shift</option>
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                </select>
                <button
                  type="button"
                  onClick={() => toggleCustomInput('shift')}
                  className="px-3 py-2 bg-[var(--color-accent-light)] text-[var(--color-accent)] rounded-md hover:bg-[var(--color-accent)] hover:text-[var(--color-text-white)]"
                >
                  <Edit3 className="h-5 w-5" />
                </button>
              </div>
            )}
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
          onClick={onClose}
          className="px-4 py-2 border border-[var(--color-border)] rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-background-light)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--color-text-white)] bg-[var(--color-primary)] hover:bg-[var(--color-dark-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] btn-primary disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Job'}
        </button>
      </div>
    </form>
  );
};

export default JobUpdateFormModal;