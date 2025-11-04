import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { allApplicants } from '../../utils/Api';
import SuccessModal from '../../common/modal/SuccessModal';
import ErrorModal from '../../common/modal/ErrorModal';
import { Mail, Phone, Calendar, Eye, User } from 'lucide-react';

const Applicants = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const response = await allApplicants();
        if (response.data.success) {
          setApplicants(response.data.data.jobSeekers || []);
        } else {
          setError('Failed to fetch applicants');
        }
      } catch (err) {
        setError('Error fetching applicants: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const handleViewDetails = (applicantId) => {
    navigate(`/applicants/${applicantId}`);
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
      <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Applicants Management</h2>
        </div>
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Applicants Management</h2>
        </div>
        <div className="text-[var(--color-error)] text-center py-12 bg-[var(--color-accent-light)] rounded-lg">
          <div className="text-xl font-semibold mb-2">Error Loading Applicants</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-white)] p-6 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">All Applicants</h2>
        <div className="text-sm text-[var(--color-text-muted)]">
          {applicants.length} {applicants.length === 1 ? 'applicant' : 'applicants'} found
        </div>
      </div>
      
      {applicants.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-background-light)] rounded-xl">
          <div className="text-[var(--color-text-light)] text-5xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-[var(--color-text-secondary)] mb-2">No applicants found</h3>
          <p className="text-[var(--color-text-muted)]">
            There are currently no job applicants.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {applicants.map((applicant) => (
            <div 
              key={applicant._id} 
              className="border border-[var(--color-border)] rounded-xl p-6 bg-gradient-to-br from-[var(--color-white)] to-[var(--color-background-light)] shadow-sm hover:shadow-md transition-all duration-300 hover:border-[var(--color-primary)]"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] cursor-pointer transition-colors">
                      {applicant.name}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center text-[var(--color-text-muted)]">
                      <Mail className="h-4 w-4 mr-1" />
                      <span className="text-sm">{applicant.email || 'Email not provided'}</span>
                    </div>
                    {applicant.profile?.phone && (
                      <div className="flex items-center text-[var(--color-text-muted)]">
                        <Phone className="h-4 w-4 mr-1" />
                        <span className="text-sm">{applicant.profile.phone}</span>
                        </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-[var(--color-text-muted)] text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Registered on {formatDate(applicant.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row md:flex-col md:items-end gap-3">
                  <button
                    onClick={() => handleViewDetails(applicant._id)}
                    className="flex items-center px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] text-sm font-medium rounded-lg hover:bg-[var(--color-dark-secondary)] transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
};

export default Applicants;