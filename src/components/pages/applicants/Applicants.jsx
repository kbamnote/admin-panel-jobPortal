import React from 'react';
import SuccessModal from '../../common/modal/SuccessModal';
import ErrorModal from '../../common/modal/ErrorModal';

const Applicants = () => {
  return (
    <div className="bg-[var(--color-white)] p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Applicants Management</h2>
      <p className="text-[var(--color-text-muted)]">Manage all job applicants here.</p>
      {/* Add applicants management content here */}
    </div>
  );
};

export default Applicants;