import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicantsById } from '../../utils/Api';
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  GraduationCap,
  Briefcase,
  FileText,
  Github,
  Linkedin,
  Home,
  ArrowLeft
} from 'lucide-react';

const ApplicantsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        setLoading(true);
        const response = await applicantsById(id);
        if (response.data.success) {
          setApplicant(response.data.data.jobSeeker);
          setApplications(response.data.data.applications || []);
        } else {
          setError('Failed to fetch applicant details');
        }
      } catch (err) {
        setError('Error fetching applicant details: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplicantDetails();
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
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Loading Applicant Details...</h1>
        </div>
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
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[var(--color-primary)] hover:text-[var(--color-dark-secondary)] mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Applicant Details</h1>
        </div>
        <div className="text-[var(--color-error)] text-center py-12 bg-[var(--color-accent-light)] rounded-lg">
          <div className="text-xl font-semibold mb-2">Error Loading Applicant Details</div>
          <p>{error}</p>
          <button
            onClick={() => navigate('/applicants')}
            className="mt-6 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-dark-secondary)] transition-colors"
          >
            Back to Applicants
          </button>
        </div>
      </div>
    );
  }

  if (!applicant) {
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
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Applicant Details</h1>
        </div>
        <div className="text-center py-12 bg-[var(--color-background-light)] rounded-lg">
          <div className="text-[var(--color-text-light)] text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-[var(--color-text-secondary)] mb-2">Applicant Not Found</h3>
          <p className="text-[var(--color-text-muted)] mb-6">The applicant you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/applicants')}
            className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-dark-secondary)] transition-colors"
          >
            Back to Applicants
          </button>
        </div>
      </div>
    );
  }

  const profile = applicant.profile || {};

  return (
    <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/applicants')}
          className="flex items-center text-sm font-medium
    text-[var(--color-primary)] hover:text-[var(--color-dark-secondary)] mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Applicants
        </button>

        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Applicant Profile
        </h1>
      </div>


      <div className="mb-8">
        <div className="rounded-2xl border border-[var(--color-border)]
bg-[var(--color-white)] p-6 shadow-sm mb-10">

          <div className="flex flex-col md:flex-row gap-6">

            {/* Avatar */}
            <div className="flex-shrink-0">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt={applicant.name}
                  className="w-20 h-20 rounded-xl object-cover border"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-[var(--color-background-light)]
        flex items-center justify-center border">
                  <User className="w-10 h-10 text-[var(--color-text-muted)]" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-left">
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                {applicant.name}
              </h2>

              <p className="text-[var(--color-primary)] font-medium">
                {profile.designation || 'Designation not specified'}
              </p>

              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                {profile.highestEducation || 'Education not specified'}
              </p>

            </div>
            {/* Contact */}
            <div className="text-sm">
              <div className="flex mb-1 items-center text-[var(--color-text-secondary)]">
                <Mail className="w-4 h-4 mr-1" />
                {applicant.email}
              </div>

              {profile.phone && (
                <div className="flex items-center text-[var(--color-text-secondary)]">
                  <Phone className="w-4 h-4 mr-1" />
                  {profile.phone}
                </div>
              )}
            </div>

          </div>
        </div>


        <div className="flex flex-wrap gap-4 mb-6">
          {profile.preferredLocation && (
            <div className="flex items-center text-[var(--color-text-secondary)]">
              <MapPin className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
              <span>{profile.preferredLocation}</span>
            </div>
          )}
          {profile.expInWork && (
            <div className="flex items-center text-[var(--color-text-secondary)]">
              <Briefcase className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
              <span>{profile.expInWork}</span>
            </div>
          )}
          {profile.noticePeriod && (
            <div className="flex items-center text-[var(--color-text-secondary)]">
              <Calendar className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
              <span>Notice: {profile.noticePeriod}</span>
            </div>
          )}
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-5">
            Profile Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">

            {[
              { label: 'Gender', value: profile.gender },
              { label: 'Expected Salary', value: profile.salaryExpectation },
              { label: 'Preferred Category', value: profile.preferredCategory },
              { label: 'Member Since', value: formatDate(applicant.createdAt) },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--color-border)]
  bg-[var(--color-white)] p-5
  transition-all duration-300 ease-out
  hover:-translate-y-1
  hover:shadow-lg"
              >

                <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-2">
                  {item.label}
                </p>
                <p className="text-lg font-semibold text-[var(--color-text-primary)]">
                  {item.value || 'Not specified'}
                </p>
              </div>
            ))}

          </div>
        </div>


      </div>

      <div className="mb-8 grid lg:grid-cols-2 grid-cols-1 gap-8">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center">
            <Home className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
            Address
          </h2>
          <div className="prose max-w-none bg-[var(--color-background-light)] rounded-xl p-5">
            <p className="text-[var(--color-text-secondary)] text-left">
              {profile.address || 'No address provided'}
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
            Education
          </h2>
          <div className="bg-[var(--color-background-light)] text-left rounded-xl p-5">
            {formatEducation(profile.education)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center">
            <Github className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
            GitHub Profile
          </h2>
          <div className="bg-[var(--color-background-light)] rounded-xl p-5">
            {profile.githubUrl ? (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary)] hover:underline"
              >
                {profile.githubUrl}
              </a>
            ) : (
              <p className="text-[var(--color-text-muted)]">No GitHub profile provided</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center">
            <Linkedin className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
            LinkedIn Profile
          </h2>
          <div className="bg-[var(--color-background-light)] rounded-xl p-5">
            {profile.linkedinUrl ? (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary)] hover:underline"
              >
                {profile.linkedinUrl}
              </a>
            ) : (
              <p className="text-[var(--color-text-muted)]">No LinkedIn profile provided</p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
            Work Experience
          </h2>
          <div className="bg-[var(--color-background-light)] text-left rounded-xl p-5">
            {formatExperience(profile.experience)}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
            Skills
          </h2>
          <div className="bg-[var(--color-background-light)] rounded-xl p-5">
            {profile.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
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
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
          Applied Jobs ({applications.length})
        </h2>
        <div className="bg-[var(--color-background-light)] rounded-xl p-5">
          {applications.length > 0 ? (
            <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {applications.map((application) => (
                <div
                  key={application._id}
                  className="border border-[var(--color-border)] rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/jobs/${application.jobId?._id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[var(--color-text-primary)]">{application.jobId?.title || 'Job Title'}</h3>
                      <p className="text-[var(--color-primary)]">{application.jobId?.company?.name || 'Company Name'}</p>
                      <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Applied on {formatDate(application.appliedAt)}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-[var(--color-accent-light)] text-[var(--color-accent)] rounded-full text-xs font-medium">
                      {application.status}
                    </span>
                  </div>
                  {application.resume && (
                    <div className="mt-3">
                      <a
                        href={application.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-primary)] hover:underline text-sm flex items-center"
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
            <p className="text-[var(--color-text-muted)]">No job applications found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantsDetails;