import axios, { 
  AxiosError, 
  AxiosInstance, 
  InternalAxiosRequestConfig, 
  AxiosResponse 
} from 'axios';

/**
 * Custom error interface for API errors
 */
export interface ApiError {
  isAxiosError: boolean;
  message: string;
  status: number;
  type?: string;
  originalError: AxiosError;
}

/**
 * Create a customized axios instance
 */
const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 15000, // 15 seconds timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Fix request interceptor typing
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // You could add auth tokens here
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for handling common error cases
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const customError: ApiError = {
        isAxiosError: true,
        message: error.message || 'Unknown error occurred',
        status: error.response?.status || 0,
        originalError: error,
      };

      // Special handling for 404 errors
      if (error.response?.status === 404) {
        return Promise.resolve({
          data: null,
          status: 404,
          headers: error.response?.headers,
          config: error.config,
          statusText: error.response?.statusText,
        });
      }

      // Network errors
      if (!error.response) {
        customError.message = 'Network error: Please check your connection';
        customError.type = 'NETWORK_ERROR';
      } else {
        // Server errors
        switch (error.response.status) {
          case 400:
            customError.type = 'BAD_REQUEST';
            customError.message = 'Bad request: The server could not process your request';
            break;
          case 401:
            customError.type = 'UNAUTHORIZED';
            customError.message = 'Unauthorized: Please log in to continue';
            break;
          case 403:
            customError.type = 'FORBIDDEN';
            customError.message = 'Forbidden: You don\'t have permission to access this resource';
            break;
          case 500:
            customError.type = 'SERVER_ERROR';
            customError.message = 'Server error: Our team has been notified';
            break;
          default:
            customError.type = 'UNKNOWN_ERROR';
            customError.message = `Error ${error.response.status}: Something went wrong`;
        }
      }

      // Log error for debugging
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: customError.message,
      });

      return Promise.reject(customError);
    }
  );

  return client;
};

export const apiClient = createApiClient('http://localhost:8000/api');
