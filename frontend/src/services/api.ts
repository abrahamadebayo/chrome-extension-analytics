import axios, { AxiosError } from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000, // Adding timeout for network requests
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens or other headers here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced error handling using a function to get user-friendly error messages
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Handle offline/network errors
    if (!axiosError.response) {
      return 'Network error: Please check your internet connection';
    }
    
    // Handle different status codes with specific messages
    switch (axiosError.response.status) {
      case 400:
        return 'Bad request: The request could not be understood by the server';
      case 401:
        return 'Unauthorized: Please sign in again';
      case 403:
        return 'Forbidden: You don\'t have permission to access this resource';
      case 404:
        return 'Not found: The requested resource doesn\'t exist';
      case 500:
        return 'Server error: Something went wrong on our end';
      default:
        return `Error ${axiosError.response.status}: ${axiosError.message}`;
    }
  }
  
  // For non-Axios errors
  return error instanceof Error ? error.message : 'An unknown error occurred';
};

// Add response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 404 errors specially
    if (error.response && error.response.status === 404) {
      return Promise.resolve({ data: null, status: 404 });
    }
    
    // Log errors with better context
    console.error('API Error:', {
      message: error.message,
      endpoint: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText
    });
    
    // Enhance error with user-friendly message
    const enhancedError = error;
    enhancedError.userMessage = getErrorMessage(error);
    
    return Promise.reject(enhancedError);
  }
);

// Analytics API functions
export const analyticsApi = {
  getCurrentAnalytics: async () => {
    try {
      const response = await api.get('/analytics/current');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
  
  getVisitHistory: async () => {
    try {
      const response = await api.get('/analytics/history');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  }
};

export default api;
