// ========================================
// GOD'S EYE EDTECH - ERROR HANDLER
// Global error handling utilities
// ========================================

import { Alert } from 'react-native';
import { API_ERRORS } from './constants';

// ============================================================
// API ERROR HANDLER
// ============================================================

/**
 * Parse API error and return user-friendly message
 * @param {Error} error - Error object (Axios or custom)
 * @returns {Object} Formatted error object
 */
export const handleApiError = (error) => {
  // Already formatted error (from api.js)
  if (error.type && error.message) {
    return error;
  }

  // Network error (no response from server)
  if (!error.response) {
    if (error.request) {
      return {
        message: API_ERRORS.NETWORK_ERROR || 'Network error. Check your connection.',
        type: 'network',
        statusCode: null,
        originalError: error,
      };
    }
    
    return {
      message: error.message || API_ERRORS.UNKNOWN_ERROR || 'An error occurred.',
      type: 'unknown',
      statusCode: null,
      originalError: error,
    };
  }
  
  const { status, data } = error.response;
  
  // Handle different status codes
  switch (status) {
    case 400:
      return {
        message: data?.error || data?.detail || API_ERRORS.VALIDATION_ERROR || 'Invalid request',
        type: 'validation',
        statusCode: 400,
        errors: data?.errors || data,
        originalError: error,
      };
      
    case 401:
      return {
        message: data?.detail || API_ERRORS.UNAUTHORIZED || 'Session expired. Please login again.',
        type: 'auth',
        statusCode: 401,
        originalError: error,
      };
      
    case 403:
      return {
        message: data?.detail || API_ERRORS.FORBIDDEN || 'You do not have permission for this action.',
        type: 'permission',
        statusCode: 403,
        originalError: error,
      };
      
    case 404:
      return {
        message: data?.detail || API_ERRORS.NOT_FOUND || 'Resource not found.',
        type: 'notfound',
        statusCode: 404,
        originalError: error,
      };
      
    case 500:
    case 502:
    case 503:
      return {
        message: API_ERRORS.SERVER_ERROR || 'Server error. Please try again later.',
        type: 'server',
        statusCode: status,
        originalError: error,
      };
      
    default:
      return {
        message: data?.detail || data?.error || API_ERRORS.UNKNOWN_ERROR || 'Something went wrong.',
        type: 'unknown',
        statusCode: status,
        originalError: error,
      };
  }
};

// ============================================================
// ERROR DISPLAY
// ============================================================

/**
 * Show error alert to user
 * @param {Error|Object} error - Error object
 * @param {string} title - Alert title (optional)
 */
export const showError = (error, title = 'Error') => {
  const { message, type } = handleApiError(error);
  
  // Customize title based on error type
  let alertTitle = title;
  switch (type) {
    case 'network':
      alertTitle = 'Connection Error';
      break;
    case 'auth':
      alertTitle = 'Authentication Error';
      break;
    case 'permission':
      alertTitle = 'Permission Denied';
      break;
    case 'server':
      alertTitle = 'Server Error';
      break;
    case 'validation':
      alertTitle = 'Validation Error';
      break;
  }
  
  Alert.alert(alertTitle, message);
};

/**
 * Show error alert with retry option
 * @param {Error|Object} error - Error object
 * @param {Function} onRetry - Retry callback
 * @param {string} title - Alert title (optional)
 */
export const showErrorWithRetry = (error, onRetry, title = 'Error') => {
  const { message, type } = handleApiError(error);
  
  // Customize title based on error type
  let alertTitle = title;
  switch (type) {
    case 'network':
      alertTitle = 'Connection Error';
      break;
    case 'server':
      alertTitle = 'Server Error';
      break;
  }
  
  Alert.alert(
    alertTitle,
    message,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Retry',
        onPress: onRetry,
      },
    ]
  );
};

/**
 * Show success alert
 * @param {string} message - Success message
 * @param {string} title - Alert title (optional)
 */
export const showSuccess = (message, title = 'Success') => {
  Alert.alert(title, message);
};

/**
 * Show confirmation dialog
 * @param {string} message - Confirmation message
 * @param {Function} onConfirm - Confirm callback
 * @param {Function} onCancel - Cancel callback (optional)
 * @param {string} title - Alert title (optional)
 */
export const showConfirmation = (
  message,
  onConfirm,
  onCancel = () => {},
  title = 'Confirm'
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: 'Confirm',
        onPress: onConfirm,
      },
    ]
  );
};

// ============================================================
// ERROR LOGGING
// ============================================================

/**
 * Log error to console (development) or error tracking service (production)
 * @param {Error|Object} error - Error object
 * @param {Object} context - Additional context
 */
export const logError = (error, context = {}) => {
  const formattedError = handleApiError(error);
  
  if (__DEV__) {
    console.error('🚨 Error Log:', {
      ...formattedError,
      context,
      timestamp: new Date().toISOString(),
    });
  } else {
    // In production, send to error tracking service (e.g., Sentry)
    // Example: Sentry.captureException(error, { extra: context });
    console.error('Error:', formattedError.message);
  }
};

// ============================================================
// VALIDATION ERROR HELPERS
// ============================================================

/**
 * Format validation errors for display
 * @param {Object} errors - Validation errors object
 * @returns {string} Formatted error message
 */
export const formatValidationErrors = (errors) => {
  if (!errors || typeof errors !== 'object') {
    return 'Validation failed';
  }
  
  const errorMessages = [];
  
  Object.keys(errors).forEach((field) => {
    const fieldErrors = errors[field];
    
    if (Array.isArray(fieldErrors)) {
      fieldErrors.forEach((error) => {
        errorMessages.push(`${field}: ${error}`);
      });
    } else if (typeof fieldErrors === 'string') {
      errorMessages.push(`${field}: ${fieldErrors}`);
    }
  });
  
  return errorMessages.join('\n') || 'Validation failed';
};

/**
 * Show validation errors alert
 * @param {Object} errors - Validation errors object
 */
export const showValidationErrors = (errors) => {
  const message = formatValidationErrors(errors);
  Alert.alert('Validation Error', message);
};

// ============================================================
// ERROR BOUNDARY HELPERS
// ============================================================

/**
 * Get error boundary fallback message
 * @param {Error} error - Error object
 * @returns {string} User-friendly message
 */
export const getErrorBoundaryMessage = (error) => {
  if (__DEV__) {
    return error.message || 'An unexpected error occurred';
  }
  
  return 'Something went wrong. Please restart the app.';
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  handleApiError,
  showError,
  showErrorWithRetry,
  showSuccess,
  showConfirmation,
  logError,
  formatValidationErrors,
  showValidationErrors,
  getErrorBoundaryMessage,
};