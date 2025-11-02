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
export const allJobs = () => Api.get("/jobs");
export const jobsById = (id) => Api.get(`/jobs/${id}`);

// ============== Job Management ==============
export const updateJob = (id, jobData) => Api.put(`/jobs/${id}`, jobData);
export const deleteJob = (id) => Api.delete(`/jobs/${id}`);
