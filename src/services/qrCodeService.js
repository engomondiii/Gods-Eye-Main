// ========================================
// GOD'S EYE EDTECH - QR CODE SERVICE
// ========================================

import { get, post, del, handleApiError } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../utils/constants';

const STORAGE_KEY = '@qr_codes';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// ============================================================
// QR CODE GENERATION
// ============================================================

/**
 * Generate QR code for a student
 * @param {number} studentId - Student ID
 * @returns {Promise<Object>} Generated QR code data
 * 
 * Backend Endpoint: POST /api/qrcodes/generate_for_student/
 */
export const generateQRCodeForStudent = async (studentId) => {
  try {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    if (__DEV__) {
      console.log(`📱 Generating QR code for student ${studentId}...`);
    }

    const response = await post(`${API_ENDPOINTS.QRCODES.BASE}/generate_for_student/`, {
      student: studentId,
    });

    if (__DEV__) {
      console.log(`✅ QR code generated: ${response.qr_code?.code}`);
    }

    // Cache locally
    await cacheQRCode(studentId, response.qr_code);

    return {
      success: true,
      data: response.qr_code,
      message: response.message || 'QR code generated successfully',
    };
  } catch (error) {
    console.error('❌ Generate QR code error:', error);

    return {
      success: false,
      message: 'Failed to generate QR code',
      error: handleApiError(error),
    };
  }
};

/**
 * Bulk generate QR codes for multiple students
 * @param {Array<number>} studentIds - Array of student IDs
 * @returns {Promise<Object>} Generated QR codes
 * 
 * Backend Endpoint: POST /api/qrcodes/bulk_generate/
 */
export const bulkGenerateQRCodes = async (studentIds) => {
  try {
    if (!studentIds || studentIds.length === 0) {
      throw new Error('Student IDs are required');
    }

    if (__DEV__) {
      console.log(`📱 Bulk generating ${studentIds.length} QR codes...`);
    }

    const response = await post(`${API_ENDPOINTS.QRCODES.BASE}/bulk_generate/`, {
      students: studentIds,
    });

    if (__DEV__) {
      console.log(`✅ Generated ${response.count} QR codes`);
    }

    return {
      success: true,
      data: response.qr_codes,
      count: response.count,
      message: response.message || 'QR codes generated successfully',
    };
  } catch (error) {
    console.error('❌ Bulk generate QR codes error:', error);

    return {
      success: false,
      message: 'Failed to generate QR codes',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// QR CODE SCANNING
// ============================================================

/**
 * Scan QR code and mark attendance
 * @param {string} code - QR code string
 * @param {Object} options - Scan options
 * @returns {Promise<Object>} Scan result with attendance data
 * 
 * Backend Endpoint: POST /api/qrcodes/scan/
 */
export const scanQRCode = async (code, options = {}) => {
  try {
    if (!code) {
      throw new Error('QR code is required');
    }

    if (__DEV__) {
      console.log(`🔍 Scanning QR code: ${code}...`);
    }

    const payload = {
      code,
      location: options.location || '',
      device_info: options.deviceInfo || '',
    };

    const response = await post(`${API_ENDPOINTS.QRCODES.BASE}/scan/`, payload);

    if (__DEV__) {
      console.log(`✅ QR code scanned successfully: ${response.student?.name}`);
    }

    return {
      success: true,
      data: response,
      student: response.student,
      attendance: response.attendance,
      message: response.message || 'Attendance marked successfully',
    };
  } catch (error) {
    console.error('❌ Scan QR code error:', error);

    return {
      success: false,
      message: error.response?.data?.error || 'Failed to scan QR code',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// QR CODE RETRIEVAL
// ============================================================

/**
 * Get QR codes for a student
 * @param {number} studentId - Student ID
 * @param {boolean} forceRefresh - Force API call
 * @returns {Promise<Object>} Student's QR codes
 * 
 * Backend Endpoint: GET /api/qrcodes/by_student/?student=ID
 */
export const getStudentQRCodes = async (studentId, forceRefresh = false) => {
  try {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    // Check cache first
    if (!forceRefresh) {
      const cached = await getCachedQRCode(studentId);
      if (cached && !isCacheExpired(cached)) {
        if (__DEV__) {
          console.log(`📦 Using cached QR code for student ${studentId}`);
        }
        return {
          success: true,
          data: [cached.data],
        };
      }
    }

    if (__DEV__) {
      console.log(`📋 Fetching QR codes for student ${studentId}...`);
    }

    const response = await get(`${API_ENDPOINTS.QRCODES.BASE}/by_student/?student=${studentId}`);

    if (__DEV__) {
      console.log(`✅ Fetched ${response.count} QR code(s)`);
    }

    // Cache the active QR code
    const activeQR = response.qr_codes?.find(qr => qr.is_active);
    if (activeQR) {
      await cacheQRCode(studentId, activeQR);
    }

    return {
      success: true,
      data: response.qr_codes,
      count: response.count,
    };
  } catch (error) {
    console.error('❌ Get student QR codes error:', error);

    return {
      success: false,
      message: 'Failed to fetch QR codes',
      error: handleApiError(error),
    };
  }
};

/**
 * Get all QR codes (admin/teacher)
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} QR codes list
 * 
 * Backend Endpoint: GET /api/qrcodes/
 */
export const getQRCodes = async (filters = {}) => {
  try {
    if (__DEV__) {
      console.log('📋 Fetching QR codes...', filters);
    }

    const params = new URLSearchParams();
    
    if (filters.student) params.append('student', filters.student);
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.page_size) params.append('page_size', filters.page_size);

    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.QRCODES.LIST}?${queryString}`
      : API_ENDPOINTS.QRCODES.LIST;

    const response = await get(url);

    if (__DEV__) {
      const count = Array.isArray(response) ? response.length : response.results?.length || 0;
      console.log(`✅ Fetched ${count} QR codes`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get QR codes error:', error);

    return {
      success: false,
      message: 'Failed to fetch QR codes',
      error: handleApiError(error),
    };
  }
};

/**
 * Get QR code scan logs
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Scan logs
 * 
 * Backend Endpoint: GET /api/qrcodes/scan-logs/
 */
export const getQRCodeScanLogs = async (filters = {}) => {
  try {
    if (__DEV__) {
      console.log('📋 Fetching QR code scan logs...', filters);
    }

    const params = new URLSearchParams();
    
    if (filters.qr_code) params.append('qr_code', filters.qr_code);
    if (filters.success !== undefined) params.append('success', filters.success);
    if (filters.scanned_by) params.append('scanned_by', filters.scanned_by);
    if (filters.page) params.append('page', filters.page);
    if (filters.page_size) params.append('page_size', filters.page_size);

    const queryString = params.toString();
    const url = `${API_ENDPOINTS.QRCODES.BASE}/scan-logs/${queryString ? '?' + queryString : ''}`;

    const response = await get(url);

    if (__DEV__) {
      const count = Array.isArray(response) ? response.length : response.results?.length || 0;
      console.log(`✅ Fetched ${count} scan logs`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get scan logs error:', error);

    return {
      success: false,
      message: 'Failed to fetch scan logs',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// CACHE MANAGEMENT
// ============================================================

/**
 * Cache QR code locally
 * @param {number} studentId - Student ID
 * @param {Object} data - QR code data
 */
const cacheQRCode = async (studentId, data) => {
  try {
    const cacheData = {
      studentId,
      data,
      cachedAt: new Date().toISOString(),
    };

    const key = `${STORAGE_KEY}_${studentId}`;
    await AsyncStorage.setItem(key, JSON.stringify(cacheData));

    if (__DEV__) {
      console.log(`📦 Cached QR code for student ${studentId}`);
    }
  } catch (error) {
    console.error('❌ Cache QR code error:', error);
  }
};

/**
 * Get cached QR code
 * @param {number} studentId - Student ID
 * @returns {Promise<Object|null>} Cached data
 */
const getCachedQRCode = async (studentId) => {
  try {
    const key = `${STORAGE_KEY}_${studentId}`;
    const cached = await AsyncStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('❌ Get cached QR code error:', error);
    return null;
  }
};

/**
 * Check if cache is expired
 * @param {Object} cached - Cached data
 * @returns {boolean} True if expired
 */
const isCacheExpired = (cached) => {
  if (!cached || !cached.cachedAt) return true;
  
  const cachedTime = new Date(cached.cachedAt).getTime();
  const now = new Date().getTime();
  
  return now - cachedTime > CACHE_DURATION;
};

/**
 * Clear QR code cache
 * @param {number} studentId - Student ID
 */
export const clearQRCodeCache = async (studentId) => {
  try {
    const key = `${STORAGE_KEY}_${studentId}`;
    await AsyncStorage.removeItem(key);

    if (__DEV__) {
      console.log(`🗑️ Cleared QR code cache for student ${studentId}`);
    }
  } catch (error) {
    console.error('❌ Clear cache error:', error);
  }
};

/**
 * Clear all QR code caches
 */
export const clearAllQRCodeCaches = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const qrCodeKeys = keys.filter(key => key.startsWith(STORAGE_KEY));
    await AsyncStorage.multiRemove(qrCodeKeys);

    if (__DEV__) {
      console.log(`🗑️ Cleared ${qrCodeKeys.length} QR code caches`);
    }
  } catch (error) {
    console.error('❌ Clear all caches error:', error);
  }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Parse QR code data
 * @param {string} qrCode - QR code string
 * @returns {Object} Parsed data
 */
export const parseQRCode = (qrCode) => {
  try {
    // Expected format: GE-{studentId}-{timestamp}
    const parts = qrCode.split('-');
    
    if (parts.length < 3 || parts[0] !== 'GE') {
      return {
        valid: false,
        error: 'Invalid QR code format',
      };
    }

    return {
      valid: true,
      studentId: parseInt(parts[1]),
      timestamp: parseInt(parts[2]),
      data: qrCode,
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Failed to parse QR code',
    };
  }
};

/**
 * Validate QR code format
 * @param {string} qrCode - QR code string
 * @returns {boolean} True if valid
 */
export const isValidQRCode = (qrCode) => {
  const parsed = parseQRCode(qrCode);
  return parsed.valid;
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Generation
  generateQRCodeForStudent,
  bulkGenerateQRCodes,

  // Scanning
  scanQRCode,

  // Retrieval
  getStudentQRCodes,
  getQRCodes,
  getQRCodeScanLogs,

  // Cache
  clearQRCodeCache,
  clearAllQRCodeCaches,

  // Utilities
  parseQRCode,
  isValidQRCode,
};