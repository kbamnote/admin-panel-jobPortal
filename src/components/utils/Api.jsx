import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "https://api.eliteindiajobs.com";

const Api = axios.create({
  baseURL: BASE_URL,
});

const Apiauth = axios.create({
  baseURL: BASE_URL,
});

Api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, remove cookies and redirect to login
      Cookies.remove("token");
      Cookies.remove("userRole");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ============== AUTH ==============
export const login = (post) => {
  console.log('Login request data:', post); // Debug log
  return Apiauth.post("/auth/login", post);
};

// ============== All Jobs GET ==============
export const allJobs = (page = 1, limit = 10, search = '', category = '', verificationStatus = '', postedBy = '') => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);

  if (search) {
    params.append('search', search);
  }

  if (category && category !== 'all') {
    params.append('category', category);
  }

  if (verificationStatus && verificationStatus !== 'all') {
    params.append('verificationStatus', verificationStatus);
  }

  // Handle postedBy parameter for filtering by admin or team member
  if (postedBy) {
    if (postedBy === 'admin') {
      params.append('postedByAdmin', 'true');
    } else {
      // Assume it's a team member ID
      params.append('postedBy', postedBy);
    }
  }

  return Api.get(`/jobs?${params.toString()}`);
};

export const jobsById = (id) => Api.get(`/jobs/${id}`);
export const jobsByTeamMember = (teamMemberId, page = 1, limit = 10) => Api.get(`/admin/jobs?postedBy=${teamMemberId}&page=${page}&limit=${limit}`);
export const adminPostedJobs = (page = 1, limit = 10) => Api.get(`/admin/jobs?postedByAdmin=true&page=${page}&limit=${limit}`);

// ============== Job Management ==============
export const createJob = (jobData) => Api.post("/jobs", jobData);
export const updateJob = (id, jobData) => Api.put(`/jobs/${id}`, jobData);
export const deleteJob = (id) => Api.delete(`/jobs/${id}`);

// ============== Job Applications ==============
export const getJobApplications = (jobId) => Api.get(`/jobs/${jobId}/applications`);
export const getAllApplicants = (page = 1, limit = 10) => Api.get(`/admin/applicants?page=${page}&limit=${limit}`);

// ============== Uploading companyLogo ==============
export const uploadFileHoster = (formData) =>
  Api.post("/auth/upload-multiple", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ============== Updating Company logo ==============
export const updateCompanyLogo = (jobId, formData) =>
  Api.put(`/auth/job/${jobId}/company-logo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ============== All Jobs GET ==============
export const allApplicants = (page = 1, limit = 10) => Api.get(`/admin/jobseekers?page=${page}&limit=${limit}`);
export const applicantsById = (id) => Api.get(`/admin/jobseekers/${id}`);

// ============== Team Management ==============
export const createTeam = (formData) => Api.post("/elite-team", formData);
export const updateTeam = (id, formData) => Api.put(`/elite-team/${id}`, formData);
export const deleteTeam = (id) => Api.delete(`/elite-team/${id}`);
export const getTeamDetails = () => Api.get("/elite-team");

// ============== Delete Account ============== 
export const deleteAccount = (id) => Api.delete(`/admin/users/${id}`);

// ============== User Statistics ==============
export const getUserStatistics = (params = {}) => Api.get('/admin/statistics/users', { params });

// ============== Job Categories ==============
export const getJobCategories = () => Api.get('/jobs/categories');

// ============== Job Verification Status ==============
export const getJobsByVerificationStatus = (status, page = 1, limit = 10) => Api.get(`/jobs?verificationStatus=${encodeURIComponent(status)}&page=${page}&limit=${limit}`);
export const updateJobVerificationStatus = (id, status) => Api.patch(`/jobs/${id}/verification`, { verificationStatus: status });
export const getJobVerificationCounts = () => Api.get('/jobs/verification-counts');

// ============== Team Member Stats ==============
export const getTeamMemberStats = () => Api.get('/jobs/team-stats');

// ============== All Companies ==============
export const getAllCompanies = () => Api.get("/jobs/companies");

// ============== Contact Management ==============
export const getAllContacts = (page = 1, limit = 10, status = "", search = "") => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  
  if (status) {
    params.append("status", status);
  }
  
  if (search) {
    params.append("search", search);
  }
  
  return Api.get(`/contact?${params.toString()}`);
};

export const getContactById = (id) => Api.get(`/contact/${id}`);

export const updateContact = (id, data) => Api.put(`/contact/${id}`, data);

export const deleteContact = (id) => Api.delete(`/contact/${id}`);

export const getContactStats = () => Api.get("/contact/stats");

export default Api;
