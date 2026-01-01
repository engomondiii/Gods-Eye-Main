// ========================================
// GOD'S EYE EDTECH - NETWORK HELPER
// Network connectivity and retry utilities
// ========================================

import NetInfo from '@react-native-community/netinfo';
import { API_CONFIG } from './constants';

// ============================================================
// NETWORK CONNECTIVITY
// ============================================================

/**
 * Check if device is connected to internet
 * @returns {Promise<boolean>} Connection status
 */
export const checkNetworkConnection = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable !== false;
  } catch (error) {
    console.error('Network check error:', error);
    return false;
  }
};

/**
 * Get detailed network state
 * @returns {Promise<Object>} Network state object
 */
export const getNetworkState = async () => {
  try {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
      type: state.type, // wifi, cellular, none, etc.
      details: state.details,
    };
  } catch (error) {
    console.error('Get network state error:', error);
    return {
      isConnected: false,
      isInternetReachable: false,
      type: 'unknown',
      details: null,
    };
  }
};

/**
 * Subscribe to network status changes
 * @param {Function} callback - Callback function (isConnected) => void
 * @returns {Function} Unsubscribe function
 */
export const subscribeToNetworkChanges = (callback) => {
  const unsubscribe = NetInfo.addEventListener((state) => {
    const isConnected = state.isConnected && state.isInternetReachable !== false;
    callback(isConnected, state);
  });
  
  return unsubscribe;
};

/**
 * Wait for network connection
 * @param {number} timeout - Maximum wait time in ms (default: 30000)
 * @returns {Promise<boolean>} True if connected within timeout
 */
export const waitForConnection = (timeout = 30000) => {
  return new Promise((resolve) => {
    let timer;
    
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isConnected = state.isConnected && state.isInternetReachable !== false;
      
      if (isConnected) {
        clearTimeout(timer);
        unsubscribe();
        resolve(true);
      }
    });
    
    // Set timeout
    timer = setTimeout(() => {
      unsubscribe();
      resolve(false);
    }, timeout);
  });
};

// ============================================================
// RETRY LOGIC
// ============================================================

/**
 * Retry a request with exponential backoff
 * @param {Function} requestFn - Async function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelay - Base delay in ms
 * @returns {Promise} Result of request
 */
export const retryRequest = async (
  requestFn,
  maxRetries = API_CONFIG?.RETRY_ATTEMPTS || 3,
  baseDelay = API_CONFIG?.RETRY_DELAY || 1000
) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx) except 408 (timeout) and 429 (rate limit)
      const status = error?.response?.status;
      if (status && status >= 400 && status < 500) {
        if (status !== 408 && status !== 429) {
          throw error;
        }
      }
      
      // Last attempt - throw error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff + jitter
      const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 500; // Add randomness to prevent thundering herd
      const delay = Math.min(exponentialDelay + jitter, 10000); // Cap at 10 seconds
      
      if (__DEV__) {
        console.log(`🔄 Retry attempt ${attempt}/${maxRetries} after ${delay.toFixed(0)}ms`);
      }
      
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Retry a request only when network is available
 * @param {Function} requestFn - Async function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise} Result of request
 */
export const retryWithNetworkCheck = async (requestFn, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Check network before attempting
      const isConnected = await checkNetworkConnection();
      
      if (!isConnected) {
        if (__DEV__) {
          console.log('📡 No network connection, waiting...');
        }
        
        // Wait for connection (max 30 seconds)
        const connected = await waitForConnection(30000);
        
        if (!connected && attempt === maxRetries) {
          throw new Error('No network connection available');
        }
        
        if (!connected) {
          continue; // Try next attempt
        }
      }
      
      // Network available, make request
      return await requestFn();
    } catch (error) {
      // Last attempt - throw error
      if (attempt === maxRetries) {
        throw error;
      }
      
      if (__DEV__) {
        console.log(`🔄 Network retry attempt ${attempt}/${maxRetries}`);
      }
      
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

/**
 * Execute request with automatic retry on network errors
 * @param {Function} requestFn - Async function to execute
 * @param {Object} options - Retry options
 * @returns {Promise} Result of request
 */
export const executeWithRetry = async (
  requestFn,
  options = {}
) => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    checkNetwork = true,
    onRetry = null,
  } = options;
  
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Check network if enabled
      if (checkNetwork) {
        const isConnected = await checkNetworkConnection();
        
        if (!isConnected) {
          throw new Error('No network connection');
        }
      }
      
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Last attempt - throw error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Call retry callback if provided
      if (onRetry) {
        onRetry(attempt, maxRetries, error);
      }
      
      // Calculate delay
      const delay = baseDelay * Math.pow(2, attempt - 1);
      
      if (__DEV__) {
        console.log(`🔄 Retry attempt ${attempt}/${maxRetries} after ${delay}ms`);
      }
      
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// ============================================================
// NETWORK TYPE HELPERS
// ============================================================

/**
 * Check if connected via WiFi
 * @returns {Promise<boolean>} True if WiFi connection
 */
export const isWiFiConnection = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.type === 'wifi';
  } catch (error) {
    console.error('WiFi check error:', error);
    return false;
  }
};

/**
 * Check if connected via cellular
 * @returns {Promise<boolean>} True if cellular connection
 */
export const isCellularConnection = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.type === 'cellular';
  } catch (error) {
    console.error('Cellular check error:', error);
    return false;
  }
};

/**
 * Get connection type
 * @returns {Promise<string>} Connection type (wifi, cellular, none, unknown)
 */
export const getConnectionType = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.type || 'unknown';
  } catch (error) {
    console.error('Connection type error:', error);
    return 'unknown';
  }
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Connectivity
  checkNetworkConnection,
  getNetworkState,
  subscribeToNetworkChanges,
  waitForConnection,
  
  // Retry
  retryRequest,
  retryWithNetworkCheck,
  executeWithRetry,
  
  // Network type
  isWiFiConnection,
  isCellularConnection,
  getConnectionType,
};