// ========================================
// GOD'S EYE EDTECH - API CLIENT
// ========================================

import axios from 'axios';
import { Platform } from 'react-native';
import * as storage from '../utils/storage';
import { API_BASE_URL, API_CONFIG, API_ERRORS } from '../utils/constants';

// ============================================================
// AXIOS INSTANCE CONFIGURATION
// ============================================================

/**
 * Create axios instance with base configuration
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    ...API_CONFIG.HEADERS,
    'X-Platform': Platform.OS,
    'X-App-Version': '1.0.0',
  },
});

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

/**
 * Request interceptor to add JWT token to all requests
 */
api.interceptors.request.use(
  async (config) => {
    try {
      // Get token from secure storage
      const token = await storage.getToken();
      
      // Add Authorization header if token exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log request in development
      if (__DEV__) {
        console.log('📤 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          hasToken: !!token,
          data: config.data,
        });
      }
      
      return config;
    } catch (error) {
      console.error('❌ Request interceptor error:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

/**
 * Response interceptor to handle token refresh, errors, and retries
 */
api.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (__DEV__) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error in development
    if (__DEV__) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: originalRequest?.url,
        message: error.message,
        data: error.response?.data,
      });
    }
    
    // Retry on network errors
    if (!originalRequest._retry && error.message === 'Network Error') {
      originalRequest._retry = true;
      
      if (__DEV__) {
        console.log('🔄 Retrying request after network error...');
      }
      
      try {
        return await retryRequest(() => api(originalRequest), 2);
      } catch (retryError) {
        if (__DEV__) {
          console.error('❌ Retry failed:', retryError);
        }
        return Promise.reject(retryError);
      }
    }
    
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get refresh token
        const refreshToken = await storage.getRefreshToken();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        if (__DEV__) {
          console.log('🔄 Attempting token refresh...');
        }
        
        // Call refresh endpoint
        const response = await axios.post(
          `${API_BASE_URL}/auth/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );
        
        const { access } = response.data;
        
        if (!access) {
          throw new Error('No access token in refresh response');
        }
        
        // Save new access token
        await storage.setToken(access);
        
        if (__DEV__) {
          console.log('✅ Token refreshed successfully');
        }
        
        // Update Authorization header with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Retry original request with new token
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear auth data and reject
        console.error('❌ Token refresh failed:', refreshError);
        
        // Clear all auth data
        await storage.clearAuthData();
        
        // Emit logout event (can be caught by AuthContext)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth:logout'));
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    return Promise.reject(error);
  }
);

// ============================================================
// ERROR HANDLER
// ============================================================

/**
 * Parse API error and return user-friendly message
 * @param {Error} error - Axios error object
 * @returns {Object} Formatted error object
 */
export const handleApiError = (error) => {
  // Network error (no response from server)
  if (!error.response) {
    return {
      message: API_ERRORS.NETWORK_ERROR,
      type: 'network',
      originalError: error,
    };
  }
  
  const { status, data } = error.response;
  
  // Handle different status codes
  switch (status) {
    case 400:
      return {
        message: data?.error || data?.detail || API_ERRORS.VALIDATION_ERROR,
        type: 'validation',
        errors: data?.errors || data,
        status,
      };
      
    case 401:
      return {
        message: data?.detail || API_ERRORS.UNAUTHORIZED,
        type: 'unauthorized',
        status,
      };
      
    case 403:
      return {
        message: data?.detail || API_ERRORS.FORBIDDEN,
        type: 'forbidden',
        status,
      };
      
    case 404:
      return {
        message: data?.detail || API_ERRORS.NOT_FOUND,
        type: 'not_found',
        status,
      };
      
    case 500:
    case 502:
    case 503:
      return {
        message: API_ERRORS.SERVER_ERROR,
        type: 'server',
        status,
      };
      
    default:
      return {
        message: data?.detail || data?.error || API_ERRORS.UNKNOWN_ERROR,
        type: 'unknown',
        status,
      };
  }
};

// ============================================================
// RETRY LOGIC
// ============================================================

/**
 * Retry a request with exponential backoff
 * @param {Function} requestFn - Function that returns a promise
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Result of request
 */
export const retryRequest = async (
  requestFn,
  maxRetries = API_CONFIG.RETRY_ATTEMPTS,
  baseDelay = API_CONFIG.RETRY_DELAY
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      // Don't retry on client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }
      
      // Last attempt - throw error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      
      if (__DEV__) {
        console.log(`🔄 Retry attempt ${attempt}/${maxRetries} after ${delay}ms`);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// ============================================================
// MULTIPART FORM DATA HELPER
// ============================================================

/**
 * Create FormData for file uploads
 * @param {Object} data - Data object with files
 * @returns {FormData} FormData instance
 */
export const createFormData = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach((key) => {
    const value = data[key];
    
    if (value === null || value === undefined) {
      return;
    }
    
    // Handle file objects
    if (value?.uri) {
      // Extract file extension from URI
      const uriParts = value.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append(key, {
        uri: value.uri,
        type: value.type || `image/${fileType}`,
        name: value.name || `upload.${fileType}`,
      });
    }
    // Handle arrays
    else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item?.uri) {
          formData.append(`${key}[${index}]`, {
            uri: item.uri,
            type: item.type || 'image/jpeg',
            name: item.name || `upload_${index}.jpg`,
          });
        } else {
          formData.append(`${key}[${index}]`, item);
        }
      });
    }
    // Handle regular values
    else {
      formData.append(key, value);
    }
  });
  
  return formData;
};

// ============================================================
// REQUEST HELPERS
// ============================================================

/**
 * Make a GET request with error handling
 * @param {string} url - API endpoint
 * @param {Object} config - Axios config
 * @returns {Promise} Response data
 */
export const get = async (url, config = {}) => {
  try {
    const response = await api.get(url, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Make a POST request with error handling
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @param {Object} config - Axios config
 * @returns {Promise} Response data
 */
export const post = async (url, data = {}, config = {}) => {
  try {
    const response = await api.post(url, data, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Make a PUT request with error handling
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @param {Object} config - Axios config
 * @returns {Promise} Response data
 */
export const put = async (url, data = {}, config = {}) => {
  try {
    const response = await api.put(url, data, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Make a PATCH request with error handling
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @param {Object} config - Axios config
 * @returns {Promise} Response data
 */
export const patch = async (url, data = {}, config = {}) => {
  try {
    const response = await api.patch(url, data, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Make a DELETE request with error handling
 * @param {string} url - API endpoint
 * @param {Object} config - Axios config
 * @returns {Promise} Response data
 */
export const del = async (url, config = {}) => {
  try {
    const response = await api.delete(url, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Upload file with multipart form data
 * @param {string} url - API endpoint
 * @param {Object} data - Data with files
 * @param {Function} onProgress - Progress callback
 * @returns {Promise} Response data
 */
export const upload = async (url, data, onProgress) => {
  try {
    const formData = createFormData(data);
    
    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
    
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============================================================
// EXPORTS
// ============================================================

export default api;

export {
  // Error handling
  handleApiError,
  retryRequest,
  
  // Request helpers
  get,
  post,
  put,
  patch,
  del,
  upload,
  createFormData,
};