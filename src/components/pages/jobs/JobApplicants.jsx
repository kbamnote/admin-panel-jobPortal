import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobApplications } from '../../utils/Api';
import { ArrowLeft, Calendar, MapPin, Briefcase, GraduationCap, FileText, Mail, Phone, Github, Linkedin, User, Home, DollarSign } from 'lucide-react';

const JobApplicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const response = await getJobApplications(id);
        if (response.data.success) {
          setApplicants(response.data.data);
        } else {
          setError('Failed to fetch applicants');
        }
      } catch (err) {
        setError('Error fetching applicants: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplicants();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatExperience = (experience) => {
    if (!experience || experience.length === 0) return 'No experience listed';
    
    return experience.map((exp, index) => (
      <div key={index} className="mb-4 pb-4 border-b border-[var(--color-border)] last:border-0 last:pb-0 last:mb-0">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-[var(--color-text-primary)] text-lg">{exp.position}</h4>
            <p className="text-[var(--color-primary)] font-medium">{exp.company}</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
            </p>
          </div>
        </div>
        <p className="text-[var(--color-text-secondary)] mt-2">{exp.description}</p>
      </div>
    ));
  };

  const formatEducation = (education) => {
    if (!education || education.length === 0) return 'No education listed';
    
    return education.map((edu, index) => (
      <div key={index} className="mb-4 pb-4 border-b border-[var(--color-border)] last:border-0 last:pb-0 last:mb-0">
        <h4 className="font-bold text-[var(--color-text-primary)] text-lg">{edu.degree}</h4>
        <p className="text-[var(--color-primary)] font-medium">{edu.institution}</p>
        <p className="text-sm text-[var(--color-text-secondary)]">{edu.field}</p>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
        </p>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-[var(--color-primary)] hover:text-[var(--color-dark-secondary)] mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Loading Applicants...</h1>
        </div>
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
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-[var(--color-primary)] hover:text-[var(--color-dark-secondary)] mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Job Applicants</h1>
        </div>
        <div className="text-[var(--color-error)] text-center py-12 bg-[var(--color-accent-light)] rounded-lg">
          <div className="text-xl font-semibold mb-2">Error Loading Applicants</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (selectedApplicant) {
    const profile = selectedApplicant.applicantId?.profile || {};
    const skills = profile.skills || [];
    const education = profile.education || [];
    const experience = profile.experience || [];
    
    return (
      <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setSelectedApplicant(null)}
            className="flex items-center text-[var(--color-primary)] hover:text-[var(--color-dark-secondary)] mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Applicants
          </button>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Applicant Details</h1>
        </div>
        
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-dark-secondary)] rounded-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-start">
            {profile.photo ? (
              <img 
                src={profile.photo} 
                alt={selectedApplicant.applicantId?.name} 
                className="w-24 h-24 object-cover rounded-full mr-6 mb-4 md:mb-0 border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mr-6 mb-4 md:mb-0 border-4 border-white shadow-lg">
                <span className="text-3xl font-bold text-[var(--color-primary)]">
                  {selectedApplicant.applicantId?.name?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2 text-white">
                {selectedApplicant.applicantId?.name || 'Unknown Applicant'}
              </h2>
              <p className="text-xl mb-3 opacity-90">{profile.designation || 'No designation specified'}</p>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>{selectedApplicant.applicantId?.email || 'No email provided'}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {profile.preferredLocation && (
                  <div className="flex items-center bg-[#E94560] bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{profile.preferredLocation}</span>
                  </div>
                )}
                {profile.expInWork && (
                  <div className="flex items-center bg-[#E94560] bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>{profile.expInWork}</span>
                  </div>
                )}
                {profile.noticePeriod && (
                  <div className="flex items-center bg-[#E94560] bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{profile.noticePeriod}</span>
                  </div>
                )}
                {profile.highestEducation && (
                  <div className="flex items-center bg-[#E94560] bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    <span>{profile.highestEducation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[var(--color-background-light)] rounded-xl p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Application Details</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedApplicant.status === 'accepted' 
                    ? 'bg-green-100 text-green-800' 
                    : selectedApplicant.status === 'rejected' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedApplicant.status?.toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--color-white)] p-4 rounded-lg">
                  <p className="text-sm text-[var(--color-text-muted)] mb-1">Applied At</p>
                  <p className="font-medium">{formatDate(selectedApplicant.appliedAt)}</p>
                </div>
                <div className="bg-[var(--color-white)] p-4 rounded-lg">
                  <p className="text-sm text-[var(--color-text-muted)] mb-1">Application ID</p>
                  <p className="font-medium font-mono">{selectedApplicant._id}</p>
                </div>
                {profile.salaryExpectation && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Salary Expectation</p>
                    <p className="font-medium flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {profile.salaryExpectation}
                    </p>
                  </div>
                )}
                {profile.gender && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Gender</p>
                    <p className="font-medium">{profile.gender}</p>
                  </div>
                )}
                {profile.age && (
                  <div className="bg-[var(--color-white)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Age</p>
                    <p className="font-medium">{profile.age} years</p>
                  </div>
                )}
              </div>
              
              {profile.resume && (
                <div className="mt-6">
                  <a 
                    href={profile.resume} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-dark-secondary)] transition-colors"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    View Resume
                  </a>
                </div>
              )}
            </div>
            
            <div className="bg-[var(--color-background-light)] rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Work Experience</h3>
              <div>
                {experience.length > 0 ? formatExperience(experience) : (
                  <p className="text-[var(--color-text-muted)]">No work experience listed</p>
                )}
              </div>
            </div>
            
            <div className="bg-[var(--color-background-light)] rounded-xl p-6">
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Education</h3>
              <div>
                {education.length > 0 ? formatEducation(education) : (
                  <p className="text-[var(--color-text-muted)]">No education listed</p>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-[var(--color-background-light)] rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Skills</h3>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-[#E94560] bg-opacity-10 text-white px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[var(--color-text-muted)]">No skills listed</p>
              )}
            </div>
            
            <div className="bg-[var(--color-background-light)] rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Additional Information</h3>
              <div className="space-y-4">
                {profile.address && (
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Address</p>
                    <p className="font-medium flex items-start">
                      <Home className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{profile.address}</span>
                    </p>
                  </div>
                )}
                
                {profile.preferredCategory && (
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Preferred Category</p>
                    <p className="font-medium">{profile.preferredCategory}</p>
                  </div>
                )}
                
                {profile.githubUrl && (
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">GitHub</p>
                    <a 
                      href={profile.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--color-primary)] hover:underline flex items-center"
                    >
                      <Github className="h-5 w-5 mr-2" />
                      <span>GitHub Profile</span>
                    </a>
                  </div>
                )}
                
                {profile.linkedinUrl && (
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">LinkedIn</p>
                    <a 
                      href={profile.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--color-primary)] hover:underline flex items-center"
                    >
                      <Linkedin className="h-5 w-5 mr-2" />
                      <span>LinkedIn Profile</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-[var(--color-primary)] hover:text-[var(--color-dark-secondary)] mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Job Applicants ({applicants.length})</h1>
      </div>
      
      {applicants.length === 0 ? (
        <div className="text-center py-12 bg-[var(--color-background-light)] rounded-lg">
          <div className="text-[var(--color-text-light)] text-5xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-[var(--color-text-secondary)] mb-2">No Applicants Yet</h3>
          <p className="text-[var(--color-text-muted)]">No one has applied for this job yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicants.map((application) => {
            const applicant = application.applicantId;
            const profile = applicant?.profile || {};
            
            return (
              <div 
                key={application._id} 
                className="border border-[var(--color-border)] rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer bg-[var(--color-background-light)] hover:bg-[var(--color-white)]"
                onClick={() => setSelectedApplicant(application)}
              >
                <div className="flex items-center mb-4">
                  {profile.photo ? (
                    <img 
                      src={profile.photo} 
                      alt={applicant?.name} 
                      className="w-12 h-12 object-cover rounded-full mr-4 border-2 border-[var(--color-border)]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[var(--color-border)] flex items-center justify-center mr-4 border-2 border-[var(--color-border)]">
                      <span className="text-lg font-bold text-[var(--color-text-muted)]">
                        {applicant?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-[var(--color-text-primary)]">{applicant?.name || 'Unknown Applicant'}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">{profile.designation || 'No designation'}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-[var(--color-text-secondary)]">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="truncate">{applicant?.email || 'No email'}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center text-sm text-[var(--color-text-secondary)]">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile.preferredLocation && (
                    <div className="flex items-center text-sm text-[var(--color-text-secondary)]">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="truncate">{profile.preferredLocation}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.skills && profile.skills.slice(0, 3).map((skill, index) => (
                    <div key={index} className="bg-[var(--color-white)] px-2 py-1 rounded-full text-xs">
                      {skill}
                    </div>
                  ))}
                  {profile.skills && profile.skills.length > 3 && (
                    <div className="bg-[var(--color-white)] px-2 py-1 rounded-full text-xs">
                      +{profile.skills.length - 3} more
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--color-text-muted)]">
                    Applied on {formatDate(application.appliedAt)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    application.status === 'accepted' 
                      ? 'bg-green-100 text-green-800' 
                      : application.status === 'rejected' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {application.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobApplicants;