// lib/api.ts

import axios from 'axios';
import { API_URL } from './apiUrl';

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Helper function to get the token from localStorage (only in the browser)
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Request interceptor to add the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle specific status codes
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      console.error('Unauthorized! Redirecting to login...');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
