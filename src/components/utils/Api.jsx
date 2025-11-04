import axios from "axios";
import Cookies from "js-cookie";

// Base URL - Update this to your backend URL
const BASE_URL = "https://elite-jobs-backend.onrender.com";

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
export const allJobs = (page = 1, limit = 10) => Api.get(`/jobs?page=${page}&limit=${limit}`);
export const jobsById = (id) => Api.get(`/jobs/${id}`);
export const jobsByTeamMember = (teamMemberId, page = 1, limit = 10) => Api.get(`/admin/jobs?postedBy=${teamMemberId}&page=${page}&limit=${limit}`);
export const adminPostedJobs = (page = 1, limit = 10) => Api.get(`/admin/jobs?postedByAdmin=true&page=${page}&limit=${limit}`);

// ============== Job Management ==============
export const createJob = (jobData) => Api.post("/jobs", jobData);
export const updateJob = (id, jobData) => Api.put(`/jobs/${id}`, jobData);
export const deleteJob = (id) => Api.delete(`/jobs/${id}`);

// ============== Job Applications ==============
export const getJobApplications = (jobId) => Api.get(`/jobs/${jobId}/applications`);
export const getAllApplicants = () => Api.get('/admin/applicants');

// ============== Uploading companyLogo ==============
export const uploadFileHoster = (formData) =>
  Api.post("/auth/profile/upload-multiple", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ============== Updating Company logo ==============
export const updateCompanyLogo = (formData) =>
  Api.put("/auth/profile/company-logo", formData, {
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