import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add 
// token (to request)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API
const api = {

  register: (data) => axiosInstance.post('/auth/register', data),

  login: (data) => axiosInstance.post('/auth/login', data),

  // Schemes endpoints
  getSchemes: () => axiosInstance.get('/schemes'),

  getScheme: (id) => axiosInstance.get(`/schemes/${id}`),

  checkEligibility: (data) => axiosInstance.post('/eligibility/check', data),

  // OCR endpoint (if needed)

  uploadDocument: (formData) => {
    return axiosInstance.post('/ocr', formData, {
      headers: {

        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default api;