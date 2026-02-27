import React, { useState, useEffect } from 'react';
import { Upload, FileSpreadsheet, Users, Mail, BarChart3, Search, RefreshCw, Send, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { importJobSeekers, getImportedJobSeekers, sendWelcomeEmails, getImportStatistics } from '../../../components/utils/Api';

const ImportData = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [importedUsers, setImportedUsers] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [emailResult, setEmailResult] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch statistics on component mount
  useEffect(() => {
    fetchStatistics();
    fetchImportedUsers();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await getImportStatistics();
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchImportedUsers = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await getImportedJobSeekers(page, 10, search);
      if (response.data.success) {
        setImportedUsers(response.data.data.users);
        setTotalPages(response.data.data.totalPages);
        setCurrentPage(response.data.data.currentPage);
      }
    } catch (error) {
      console.error('Error fetching imported users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
        'application/vnd.ms-excel',
        'application/json'
      ];
      if (!validTypes.includes(selectedFile.type)) {
        alert('Please upload a valid Excel file (.xlsx or .xls) or JSON file (.json)');
        return;
      }
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const response = await importJobSeekers(formData);
      if (response.data.success) {
        setUploadResult({
          success: true,
          message: response.data.message,
          data: response.data.data
        });
        // Refresh data after successful import
        fetchStatistics();
        fetchImportedUsers();
        setFile(null);
        document.getElementById('fileInput').value = '';
      } else {
        setUploadResult({
          success: false,
          message: response.data.message,
          errors: response.data.data?.errors || []
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      setUploadResult({
        success: false,
        message: error.response?.data?.message || 'Import failed',
        errors: error.response?.data?.data?.errors || []
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendEmails = async () => {
    if (selectedUsers.length === 0) {
      alert('Please select users to send emails to');
      return;
    }

    setSendingEmails(true);
    try {
      const response = await sendWelcomeEmails({ userIds: selectedUsers });
      if (response.data.success) {
        setEmailResult({
          success: true,
          message: response.data.message,
          data: response.data.data
        });
        setSelectedUsers([]);
      } else {
        setEmailResult({
          success: false,
          message: response.data.message
        });
      }
    } catch (error) {
      console.error('Send emails error:', error);
      setEmailResult({
        success: false,
        message: error.response?.data?.message || 'Failed to send emails'
      });
    } finally {
      setSendingEmails(false);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === importedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(importedUsers.map(user => user._id));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchImportedUsers(1, searchTerm);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchImportedUsers(newPage, searchTerm);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-dark)] mb-2">Import Data</h1>
        <p className="text-[var(--color-text-light)]">Import job seeker data from Excel files and manage imported users</p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[var(--color-border-light)]">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[var(--color-text-light)]">Total Imported</p>
                <p className="text-2xl font-bold text-[var(--color-text-dark)]">{statistics.totalImported}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[var(--color-border-light)]">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[var(--color-text-light)]">Verified</p>
                <p className="text-2xl font-bold text-[var(--color-text-dark)]">{statistics.verifiedImported}</p>
                <p className="text-xs text-green-600">{statistics.verificationRate}% verified</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[var(--color-border-light)]">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[var(--color-text-light)]">Pending Verification</p>
                <p className="text-2xl font-bold text-[var(--color-text-dark)]">{statistics.unverifiedImported}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Import Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-[var(--color-border-light)]">
          <h2 className="text-xl font-bold text-[var(--color-text-dark)] mb-6 flex items-center">
            <Upload className="mr-2 h-5 w-5" />
            Import Job Seekers
          </h2>
          
          <div className="border-2 border-dashed border-[var(--color-border-light)] rounded-lg p-8 text-center mb-6">
            <FileSpreadsheet className="mx-auto h-12 w-12 text-[var(--color-text-light)] mb-4" />
            <p className="text-lg font-medium text-[var(--color-text-dark)] mb-2">Upload Excel File</p>
            <p className="text-sm text-[var(--color-text-light)] mb-4">
              Supported formats: .xlsx, .xls, .json
            </p>
            
            <input
              id="fileInput"
              type="file"
              accept=".xlsx,.xls,.json"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <label
              htmlFor="fileInput"
              className="inline-flex items-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg cursor-pointer hover:bg-[var(--color-accent)] transition-colors"
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </label>
            
            {file && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-[var(--color-text-dark)]">
                  Selected: <span className="font-medium">{file.name}</span>
                </p>
                <p className="text-xs text-[var(--color-text-light)]">
                  Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>
          
          <button
            onClick={handleImport}
            disabled={!file || isUploading}
            className="w-full py-3 px-4 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isUploading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </>
            )}
          </button>
          
          {/* Upload Result */}
          {uploadResult && (
            <div className={`mt-4 p-4 rounded-lg ${uploadResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start">
                {uploadResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                )}
                <div className="flex-1">
                  <h3 className={`font-medium ${uploadResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {uploadResult.message}
                  </h3>
                  
                  {uploadResult.data && (
                    <div className="mt-2 text-sm">
                      <p className={uploadResult.success ? 'text-green-700' : 'text-red-700'}>
                        <span className="font-medium">Records:</span> {uploadResult.data.totalRecords} total, 
                        {uploadResult.data.insertedRecords} imported, 
                        {uploadResult.data.skippedRecords} skipped
                      </p>
                    </div>
                  )}
                  
                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-red-800">Errors:</p>
                      <ul className="mt-1 text-sm text-red-700 max-h-32 overflow-y-auto">
                        {uploadResult.errors.slice(0, 5).map((error, index) => (
                          <li key={index} className="mb-1">• {error}</li>
                        ))}
                        {uploadResult.errors.length > 5 && (
                          <li className="font-medium">...and {uploadResult.errors.length - 5} more errors</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-[var(--color-border-light)]">
          <h2 className="text-xl font-bold text-[var(--color-text-dark)] mb-6 flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Imported Users
          </h2>
          
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--color-text-light)]" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
            </form>
            
            <button
              onClick={() => fetchImportedUsers(currentPage, searchTerm)}
              className="px-4 py-2 border border-[var(--color-border-light)] rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
          
          {/* Send Emails Button */}
          {selectedUsers.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-800">
                  Selected {selectedUsers.length} user(s) for email
                </p>
                <button
                  onClick={handleSendEmails}
                  disabled={sendingEmails}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {sendingEmails ? (
                    <>
                      <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-1 h-3 w-3" />
                      Send Welcome Emails
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          
          {/* Email Result */}
          {emailResult && (
            <div className={`mb-4 p-3 rounded-lg ${emailResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-sm ${emailResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {emailResult.message}
              </p>
              {emailResult.data && (
                <p className={`text-xs mt-1 ${emailResult.success ? 'text-green-700' : 'text-red-700'}`}>
                  Sent: {emailResult.data.successCount}, Failed: {emailResult.data.failedCount}
                </p>
              )}
            </div>
          )}
          
          {/* Users List */}
          <div className="border border-[var(--color-border-light)] rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-[var(--color-border-light)]">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === importedUsers.length && importedUsers.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-[var(--color-primary)] rounded border-[var(--color-border-light)]"
                />
                <span className="ml-2 text-sm font-medium text-[var(--color-text-dark)]">
                  Select All
                </span>
              </div>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <RefreshCw className="mx-auto h-8 w-8 text-[var(--color-text-light)] animate-spin" />
                <p className="mt-2 text-[var(--color-text-light)]">Loading users...</p>
              </div>
            ) : importedUsers.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="mx-auto h-12 w-12 text-[var(--color-text-light)] mb-4" />
                <p className="text-[var(--color-text-light)]">No imported users found</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-border-light)] max-h-96 overflow-y-auto">
                {importedUsers.map((user) => (
                  <div key={user._id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleUserSelect(user._id)}
                        className="mt-1 h-4 w-4 text-[var(--color-primary)] rounded border-[var(--color-border-light)]"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-[var(--color-text-dark)]">{user.name}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.isVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--color-text-light)] mt-1">{user.email}</p>
                        {user.profile?.phone && (
                          <p className="text-sm text-[var(--color-text-light)]">Phone: {user.profile.phone}</p>
                        )}
                        <p className="text-xs text-[var(--color-text-light)] mt-1">
                          Imported on: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-[var(--color-border-light)] rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-[var(--color-text-light)]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-[var(--color-border-light)] rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportData;