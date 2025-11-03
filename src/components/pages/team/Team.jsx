import React, { useState, useEffect } from 'react';
import { getTeamDetails, createTeam, updateTeam, deleteTeam } from '../../utils/Api';
import Modal from '../../common/modal/Modal';
import SuccessModal from '../../common/modal/SuccessModal';
import ErrorModal from '../../common/modal/ErrorModal';
import DeleteConfirmationModal from '../../common/modal/DeleteConfirmationModal';
import { Plus, Edit, Trash2, User, Mail, Key } from 'lucide-react';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [memberToUpdate, setMemberToUpdate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await getTeamDetails();
      if (response.data.success) {
        setTeamMembers(response.data.data || []);
      } else {
        setError('Failed to fetch team members');
      }
    } catch (err) {
      setError('Error fetching team members: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.password) {
        setErrorMessage('All fields are required');
        setIsErrorModalOpen(true);
        setIsSubmitting(false);
        return;
      }

      const response = await createTeam(formData);
      
      if (response.data.success) {
        setSuccessMessage('Team member created successfully!');
        setIsSuccessModalOpen(true);
        setIsCreateModalOpen(false);
        setFormData({ name: '', email: '', password: '' });
        fetchTeamMembers(); // Refresh the list
      } else {
        setErrorMessage('Failed to create team member: ' + (response.data.message || 'Unknown error'));
        setIsErrorModalOpen(true);
      }
    } catch (err) {
      setErrorMessage('Error creating team member: ' + (err.response?.data?.message || err.message));
      setIsErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.email) {
        setErrorMessage('Name and email are required');
        setIsErrorModalOpen(true);
        setIsSubmitting(false);
        return;
      }

      // For update, we don't send password unless it's being changed
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await updateTeam(memberToUpdate._id, updateData);
      
      if (response.data.success) {
        setSuccessMessage('Team member updated successfully!');
        setIsSuccessModalOpen(true);
        setIsUpdateModalOpen(false);
        setFormData({ name: '', email: '', password: '' });
        setMemberToUpdate(null);
        fetchTeamMembers(); // Refresh the list
      } else {
        setErrorMessage('Failed to update team member: ' + (response.data.message || 'Unknown error'));
        setIsErrorModalOpen(true);
      }
    } catch (err) {
      setErrorMessage('Error updating team member: ' + (err.response?.data?.message || err.message));
      setIsErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;

    try {
      const response = await deleteTeam(memberToDelete._id);
      
      if (response.data.success) {
        setSuccessMessage('Team member deleted successfully!');
        setIsSuccessModalOpen(true);
        setIsDeleteModalOpen(false);
        setMemberToDelete(null);
        fetchTeamMembers(); // Refresh the list
      } else {
        setErrorMessage('Failed to delete team member: ' + (response.data.message || 'Unknown error'));
        setIsErrorModalOpen(true);
      }
    } catch (err) {
      setErrorMessage('Error deleting team member: ' + (err.response?.data?.message || err.message));
      setIsErrorModalOpen(true);
    }
  };

  const openUpdateModal = (member) => {
    setMemberToUpdate(member);
    setFormData({
      name: member.name || '',
      email: member.email || '',
      password: ''
    });
    setIsUpdateModalOpen(true);
  };

  const openDeleteModal = (member) => {
    setMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-[var(--color-white)] p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Team Management</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-dark-secondary)] transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </button>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border border-[var(--color-border)] rounded-xl p-4 bg-[var(--color-background-light)] animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-[var(--color-border)] rounded-full w-12 h-12"></div>
                  <div className="ml-4">
                    <div className="h-4 bg-[var(--color-border)] rounded w-32 mb-2"></div>
                    <div className="h-3 bg-[var(--color-border)] rounded w-24"></div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-[var(--color-border)] rounded"></div>
                  <div className="h-8 w-8 bg-[var(--color-border)] rounded"></div>
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
      <div className="bg-[var(--color-white)] p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Team Management</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-dark-secondary)] transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </button>
        </div>
        
        <div className="text-[var(--color-error)] text-center py-8 bg-[var(--color-accent-light)] rounded-lg">
          <div className="text-xl font-semibold mb-2">Error Loading Team Members</div>
          <p>{error}</p>
          <button
            onClick={fetchTeamMembers}
            className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-dark-secondary)] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-white)] p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Team Management</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-dark-secondary)] transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </button>
      </div>
      
      {teamMembers.length === 0 ? (
        <div className="text-center py-12 bg-[var(--color-background-light)] rounded-lg">
          <div className="text-[var(--color-text-light)] text-5xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-[var(--color-text-secondary)] mb-2">No Team Members</h3>
          <p className="text-[var(--color-text-muted)] mb-6">Get started by adding a new team member.</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-dark-secondary)] transition-colors"
          >
            Add Your First Member
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member._id} className="border border-[var(--color-border)] rounded-xl p-4 bg-[var(--color-background-light)] hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-[var(--color-primary)] rounded-full w-12 h-12 flex items-center justify-center">
                    <User className="h-6 w-6 text-[var(--color-text-white)]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{member.name}</h3>
                    <div className="flex items-center text-[var(--color-text-muted)]">
                      <Mail className="h-4 w-4 mr-1" />
                      <span className="text-sm">{member.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openUpdateModal(member)}
                    className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] rounded-full transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(member)}
                    className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:bg-[var(--color-background)] rounded-full transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Team Member Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add Team Member">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              placeholder="Enter full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              placeholder="Enter password"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-[var(--color-border)] rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-background-light)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--color-text-white)] bg-[var(--color-primary)] hover:bg-[var(--color-dark-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] btn-primary disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Update Team Member Modal */}
      <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} title="Update Team Member">
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              placeholder="Enter full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Password (leave blank to keep current)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] input-field"
              placeholder="Enter new password"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsUpdateModalOpen(false)}
              className="px-4 py-2 border border-[var(--color-border)] rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-background-light)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--color-text-white)] bg-[var(--color-primary)] hover:bg-[var(--color-dark-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] btn-primary disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Member'}
            </button>
          </div>
        </form>
      </Modal>

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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDeleteConfirm} 
        title="Confirm Deletion" 
        message={`Are you sure you want to delete team member "${memberToDelete?.name}"? This action cannot be undone.`} 
        isLoading={false}
      />
    </div>
  );
};

export default Team;