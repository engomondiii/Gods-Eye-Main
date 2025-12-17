// ========================================
// GOD'S EYE EDTECH - OTC SERVICE
// ========================================

import { get, post, handleApiError } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS, OTC_CONFIG } from '../utils/constants';

const STORAGE_KEY = '@otc_codes';

// ============================================================
// OTC GENERATION
// ============================================================

/**
 * Generate OTC for a student (Guardian only)
 * @param {number} studentId - Student ID
 * @returns {Promise<Object>} Generated OTC data
 * 
 * Backend Endpoint: POST /api/otc/generate/
 */
export const generateOTC = async (studentId) => {
  try {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    if (__DEV__) {
      console.log(`🔢 Generating OTC for student ${studentId}...`);
    }

    const response = await post(`${API_ENDPOINTS.OTC.BASE}/generate/`, {
      student: studentId,
    });

    if (__DEV__) {
      console.log(`✅ OTC generated: ${response.otc?.code}`);
    }

    // Cache locally
    await cacheOTC(studentId, response.otc);

    return {
      success: true,
      data: response.otc,
      message: response.message || 'OTC generated successfully',
    };
  } catch (error) {
    console.error('❌ Generate OTC error:', error);

    return {
      success: false,
      message: 'Failed to generate OTC',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// OTC VERIFICATION
// ============================================================

/**
 * Verify OTC code and mark attendance
 * @param {string} code - OTC code
 * @returns {Promise<Object>} Verification result with attendance data
 * 
 * Backend Endpoint: POST /api/otc/verify/
 */
export const verifyOTC = async (code) => {
  try {
    if (!code) {
      throw new Error('OTC code is required');
    }

    // Validate format
    const validation = validateCodeFormat(code);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    if (__DEV__) {
      console.log(`🔍 Verifying OTC: ${code}...`);
    }

    const response = await post(`${API_ENDPOINTS.OTC.BASE}/verify/`, {
      code: validation.code,
    });

    if (__DEV__) {
      console.log(`✅ OTC verified successfully: ${response.student?.name}`);
    }

    return {
      success: true,
      data: response,
      student: response.student,
      attendance: response.attendance,
      message: response.message || 'Attendance marked successfully',
    };
  } catch (error) {
    console.error('❌ Verify OTC error:', error);

    return {
      success: false,
      message: error.response?.data?.error || 'Failed to verify OTC',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// OTC RETRIEVAL
// ============================================================

/**
 * Get guardian's generated OTC codes
 * @returns {Promise<Object>} Guardian's OTC codes
 * 
 * Backend Endpoint: GET /api/otc/my_codes/
 */
export const getMyOTCCodes = async () => {
  try {
    if (__DEV__) {
      console.log('📋 Fetching my OTC codes...');
    }

    const response = await get(`${API_ENDPOINTS.OTC.BASE}/my_codes/`);

    if (__DEV__) {
      console.log(`✅ Fetched ${response.count} OTC code(s)`);
    }

    return {
      success: true,
      data: response.codes,
      count: response.count,
    };
  } catch (error) {
    console.error('❌ Get my OTC codes error:', error);

    return {
      success: false,
      message: 'Failed to fetch OTC codes',
      error: handleApiError(error),
    };
  }
};

/**
 * Get active OTC codes (admin/teacher)
 * @returns {Promise<Object>} Active OTC codes
 * 
 * Backend Endpoint: GET /api/otc/active_codes/
 */
export const getActiveOTCCodes = async () => {
  try {
    if (__DEV__) {
      console.log('📋 Fetching active OTC codes...');
    }

    const response = await get(`${API_ENDPOINTS.OTC.BASE}/active_codes/`);

    if (__DEV__) {
      console.log(`✅ Fetched ${response.count} active OTC code(s)`);
    }

    return {
      success: true,
      data: response.codes,
      count: response.count,
    };
  } catch (error) {
    console.error('❌ Get active OTC codes error:', error);

    return {
      success: false,
      message: 'Failed to fetch active OTC codes',
      error: handleApiError(error),
    };
  }
};

/**
 * Get all OTC codes
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} OTC codes list
 * 
 * Backend Endpoint: GET /api/otc/
 */
export const getOTCCodes = async (filters = {}) => {
  try {
    if (__DEV__) {
      console.log('📋 Fetching OTC codes...', filters);
    }

    const params = new URLSearchParams();
    
    if (filters.student) params.append('student', filters.student);
    if (filters.guardian) params.append('guardian', filters.guardian);
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active);
    if (filters.is_used !== undefined) params.append('is_used', filters.is_used);
    if (filters.page) params.append('page', filters.page);
    if (filters.page_size) params.append('page_size', filters.page_size);

    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.OTC.LIST}?${queryString}`
      : API_ENDPOINTS.OTC.LIST;

    const response = await get(url);

    if (__DEV__) {
      const count = Array.isArray(response) ? response.length : response.results?.length || 0;
      console.log(`✅ Fetched ${count} OTC codes`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get OTC codes error:', error);

    return {
      success: false,
      message: 'Failed to fetch OTC codes',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Validate OTC code format
 * @param {string} code - Code to validate
 * @returns {Object} Validation result
 */
export const validateCodeFormat = (code) => {
  if (!code || typeof code !== 'string') {
    return {
      valid: false,
      error: 'Invalid code format',
    };
  }

  // Remove any spaces or dashes
  const cleanCode = code.replace(/[\s-]/g, '');

  // Check length
  const expectedLength = OTC_CONFIG?.LENGTH || 6;
  if (cleanCode.length !== expectedLength) {
    return {
      valid: false,
      error: `Code must be ${expectedLength} digits`,
    };
  }

  // Check if all characters are digits
  if (!/^\d+$/.test(cleanCode)) {
    return {
      valid: false,
      error: 'Code must contain only numbers',
    };
  }

  return {
    valid: true,
    code: cleanCode,
  };
};

/**
 * Calculate remaining time for OTC
 * @param {string} expiresAt - Expiration timestamp
 * @returns {Object} Remaining time info
 */
export const getRemainingTime = (expiresAt) => {
  const now = new Date().getTime();
  const expiry = new Date(expiresAt).getTime();
  const remaining = Math.max(0, expiry - now);

  return {
    milliseconds: remaining,
    seconds: Math.floor(remaining / 1000),
    minutes: Math.floor(remaining / 60000),
    isExpired: remaining === 0,
  };
};

/**
 * Format OTC with separators
 * @param {string} code - Code to format
 * @returns {string} Formatted code
 */
export const formatOTC = (code) => {
  if (!code) return '';
  
  // Format as XXX-XXX for 6 digits
  const clean = code.replace(/\D/g, '');
  if (clean.length === 6) {
    return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  }
  
  return clean;
};

/**
 * Check if OTC is expired
 * @param {Object} otc - OTC data
 * @returns {boolean} True if expired
 */
export const isOTCExpired = (otc) => {
  if (!otc || !otc.expires_at) return true;
  
  const expiryTime = new Date(otc.expires_at).getTime();
  const now = new Date().getTime();
  
  return now > expiryTime;
};

// ============================================================
// CACHE MANAGEMENT
// ============================================================

/**
 * Cache OTC locally
 * @param {number} studentId - Student ID
 * @param {Object} data - OTC data
 */
const cacheOTC = async (studentId, data) => {
  try {
    const cacheData = {
      studentId,
      data,
      cachedAt: new Date().toISOString(),
    };

    const key = `${STORAGE_KEY}_${studentId}`;
    await AsyncStorage.setItem(key, JSON.stringify(cacheData));

    if (__DEV__) {
      console.log(`📦 Cached OTC for student ${studentId}`);
    }
  } catch (error) {
    console.error('❌ Cache OTC error:', error);
  }
};

/**
 * Get cached OTC
 * @param {number} studentId - Student ID
 * @returns {Promise<Object|null>} Cached data
 */
export const getCachedOTC = async (studentId) => {
  try {
    const key = `${STORAGE_KEY}_${studentId}`;
    const cached = await AsyncStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('❌ Get cached OTC error:', error);
    return null;
  }
};

/**
 * Clear OTC cache
 * @param {number} studentId - Student ID
 */
export const clearOTCCache = async (studentId) => {
  try {
    const key = `${STORAGE_KEY}_${studentId}`;
    await AsyncStorage.removeItem(key);

    if (__DEV__) {
      console.log(`🗑️ Cleared OTC cache for student ${studentId}`);
    }
  } catch (error) {
    console.error('❌ Clear cache error:', error);
  }
};

/**
 * Clear all OTC caches
 */
export const clearAllOTCCaches = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const otcKeys = keys.filter(key => key.startsWith(STORAGE_KEY));
    await AsyncStorage.multiRemove(otcKeys);

    if (__DEV__) {
      console.log(`🗑️ Cleared ${otcKeys.length} OTC caches`);
    }
  } catch (error) {
    console.error('❌ Clear all caches error:', error);
  }
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Generation & Verification
  generateOTC,
  verifyOTC,

  // Retrieval
  getMyOTCCodes,
  getActiveOTCCodes,
  getOTCCodes,

  // Utilities
  validateCodeFormat,
  getRemainingTime,
  formatOTC,
  isOTCExpired,

  // Cache
  getCachedOTC,
  clearOTCCache,
  clearAllOTCCaches,
};