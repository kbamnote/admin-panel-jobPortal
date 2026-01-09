import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { allApplicants } from '../../utils/Api';
import SuccessModal from '../../common/modal/SuccessModal';
import ErrorModal from '../../common/modal/ErrorModal';
import { Mail, Phone, Calendar, Eye, User, ChevronLeft, ChevronRight } from 'lucide-react';

const Applicants = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [limit] = useState(10); // Items per page

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const response = await allApplicants(currentPage, limit);
        if (response.data.success) {
          setApplicants(response.data.data.jobSeekers || []);
          setTotalPages(response.data.data.totalPages || 1);
          setCurrentPage(response.data.data.currentPage || 1);
          setTotalApplicants(response.data.data.totalJobSeekers || 0);
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
  }, [currentPage, limit]);

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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
          {totalApplicants} {totalApplicants === 1 ? 'applicant' : 'applicants'} found
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
        <>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="min-w-full border-collapse bg-[var(--color-white)]">

              {/* TABLE HEADER */}
              <thead className="bg-[var(--color-background-light)]">
                <tr>
                  <th className="px-5 py-3 text-left pl-20 text-sm font-semibold text-[var(--color-text-muted)]">
                    Applicant
                  </th>
                  <th className="px-5 py-3 text-center text-sm font-semibold text-[var(--color-text-muted)]">
                    Email
                  </th>
                  <th className="px-5 py-3 text-center pr-10 text-sm font-semibold text-[var(--color-text-muted)]">
                    Designation
                  </th>
                  <th className="px-5 py-3 text-center text-sm font-semibold text-[var(--color-text-muted)]">
                    Phone
                  </th>
                  <th className="px-5 py-3 text-right text-sm font-semibold text-[var(--color-text-muted)]">
                    Registered On
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody>
                {applicants.map((applicant, index) => (
                  <tr
                    onClick={() => handleViewDetails(applicant._id)}
                    key={applicant._id}
                    className={`group cursor-pointer border-t border-[var(--color-border)]
    transition-all duration-300
    hover:bg-[var(--color-primary)] hover:shadow-lg
    ${index % 2 === 0 ? 'bg-[var(--color-white)]' : 'bg-[#f8fafc]'}`}
                  >

                    {/* Applicant */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {applicant.profile?.photo ? (
                          <img
                            src={applicant.profile.photo}
                            alt={applicant.name}
                            className="w-10 h-10 rounded-lg object-cover border
    transition-all duration-300
    group-hover:scale-110
    group-hover:ring-2
    group-hover:ring-[var(--color-primary)]"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-lg bg-[var(--color-background-light)]
    flex items-center justify-center border
    transition-all duration-300
    group-hover:scale-110
    group-hover:bg-[#1e293b]"
                          >
                            <User className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-white" />
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-[var(--color-text-primary)] transition group-hover:text-white">
                            {applicant.name}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)] transition group-hover:text-gray-300">
                            Job Applicant
                          </p>

                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4 text-sm text-[var(--color-text-muted)]">
                      {applicant.email || '-'}
                    </td>

                    {/* Designation */}
                    <td className="px-5 py-4 text-center">
                      {applicant.profile?.designation || '-'}
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4 text-sm text-[var(--color-text-muted)]">
                      {applicant.profile?.phone || '-'}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-right text-sm text-[var(--color-text-muted)]">
                      {formatDate(applicant.createdAt)}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 rounded-lg ${currentPage === 1
                  ? 'bg-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed'
                  : 'bg-[var(--color-primary)] text-[var(--color-text-white)] hover:bg-[var(--color-dark-secondary)]'
                  }`}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </button>

              <div className="text-sm text-[var(--color-text-muted)]">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center px-4 py-2 rounded-lg ${currentPage === totalPages
                  ? 'bg-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed'
                  : 'bg-[var(--color-primary)] text-[var(--color-text-white)] hover:bg-[var(--color-dark-secondary)]'
                  }`}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          )}
        </>
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