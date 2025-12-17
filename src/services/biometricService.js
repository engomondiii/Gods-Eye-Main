// ========================================
// GOD'S EYE EDTECH - BIOMETRIC SERVICE
// ========================================

import { get, post, del, handleApiError } from './api';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../utils/constants';

const STORAGE_KEY = '@biometric_data';

// ============================================================
// DEVICE CAPABILITY CHECKS
// ============================================================

/**
 * Check if device supports biometric authentication
 * @returns {Promise<Object>} Support information
 */
export const checkBiometricSupport = async () => {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    return {
      isSupported: hasHardware && isEnrolled,
      hasHardware,
      isEnrolled,
      supportedTypes,
      hasFingerprint: supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT
      ),
      hasFaceRecognition: supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      ),
      hasIris: supportedTypes.includes(
        LocalAuthentication.AuthenticationType.IRIS
      ),
    };
  } catch (error) {
    console.error('❌ Check biometric support error:', error);
    return {
      isSupported: false,
      hasHardware: false,
      isEnrolled: false,
      supportedTypes: [],
      hasFingerprint: false,
      hasFaceRecognition: false,
      hasIris: false,
    };
  }
};

/**
 * Authenticate using device biometrics
 * @param {Object} options - Authentication options
 * @returns {Promise<Object>} Authentication result
 */
export const authenticate = async (options = {}) => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: options.promptMessage || 'Authenticate to continue',
      cancelLabel: options.cancelLabel || 'Cancel',
      fallbackLabel: options.fallbackLabel || 'Use Passcode',
      disableDeviceFallback: options.disableDeviceFallback || false,
    });

    return {
      success: result.success,
      error: result.error || null,
    };
  } catch (error) {
    console.error('❌ Biometric authentication error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ============================================================
// BIOMETRIC ENROLLMENT
// ============================================================

/**
 * Enroll fingerprint for a student
 * @param {number} studentId - Student ID
 * @param {Object} data - Fingerprint data
 * @returns {Promise<Object>} Enrollment result
 * 
 * Backend Endpoint: POST /api/biometrics/enroll/
 */
export const enrollFingerprint = async (studentId, data = {}) => {
  try {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    if (__DEV__) {
      console.log(`👆 Enrolling fingerprint for student ${studentId}...`);
    }

    // First, authenticate the user with device biometrics
    const authResult = await authenticate({
      promptMessage: 'Scan fingerprint to enroll',
    });

    if (!authResult.success) {
      throw new Error('Fingerprint authentication failed');
    }

    // Send to backend
    const payload = {
      student: studentId,
      biometric_type: 'fingerprint',
      fingerprint_template: data.fingerprintTemplate || 'DEVICE_ENROLLED',
    };

    const response = await post(`${API_ENDPOINTS.BIOMETRICS.BASE}/enroll/`, payload);

    if (__DEV__) {
      console.log(`✅ Fingerprint enrolled successfully`);
    }

    // Store locally
    await storeBiometricData(studentId, {
      type: 'fingerprint',
      enabled: true,
      enrolledAt: new Date().toISOString(),
    });

    return {
      success: true,
      data: response.biometric,
      message: response.message || 'Fingerprint enrolled successfully',
    };
  } catch (error) {
    console.error('❌ Enroll fingerprint error:', error);

    return {
      success: false,
      message: 'Failed to enroll fingerprint',
      error: handleApiError(error),
    };
  }
};

/**
 * Enroll face recognition for a student
 * @param {number} studentId - Student ID
 * @param {Object} imageData - Face image data
 * @returns {Promise<Object>} Enrollment result
 * 
 * Backend Endpoint: POST /api/biometrics/enroll/
 */
export const enrollFaceRecognition = async (studentId, imageData) => {
  try {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    if (!imageData || !imageData.base64) {
      throw new Error('Face image data is required');
    }

    if (__DEV__) {
      console.log(`📸 Enrolling face recognition for student ${studentId}...`);
    }

    const payload = {
      student: studentId,
      biometric_type: 'face',
      face_encoding: imageData.base64,
    };

    // If we have a file URI, we can send it as FormData
    if (imageData.uri) {
      const formData = new FormData();
      formData.append('student', studentId);
      formData.append('biometric_type', 'face');
      formData.append('face_image', {
        uri: imageData.uri,
        type: 'image/jpeg',
        name: 'face.jpg',
      });

      const response = await post(`${API_ENDPOINTS.BIOMETRICS.BASE}/enroll/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (__DEV__) {
        console.log(`✅ Face recognition enrolled successfully`);
      }

      // Store locally
      await storeBiometricData(studentId, {
        type: 'face_recognition',
        enabled: true,
        enrolledAt: new Date().toISOString(),
      });

      return {
        success: true,
        data: response.biometric,
        message: response.message || 'Face recognition enrolled successfully',
      };
    } else {
      // Send as JSON
      const response = await post(`${API_ENDPOINTS.BIOMETRICS.BASE}/enroll/`, payload);

      if (__DEV__) {
        console.log(`✅ Face recognition enrolled successfully`);
      }

      await storeBiometricData(studentId, {
        type: 'face_recognition',
        enabled: true,
        enrolledAt: new Date().toISOString(),
      });

      return {
        success: true,
        data: response.biometric,
        message: response.message || 'Face recognition enrolled successfully',
      };
    }
  } catch (error) {
    console.error('❌ Enroll face recognition error:', error);

    return {
      success: false,
      message: 'Failed to enroll face recognition',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// BIOMETRIC VERIFICATION
// ============================================================

/**
 * Verify fingerprint for attendance
 * @param {number} studentId - Student ID
 * @param {Object} options - Verification options
 * @returns {Promise<Object>} Verification result
 * 
 * Backend Endpoint: POST /api/biometrics/verify/
 */
export const verifyFingerprint = async (studentId, options = {}) => {
  try {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    if (__DEV__) {
      console.log(`👆 Verifying fingerprint for student ${studentId}...`);
    }

    // Authenticate using device biometrics
    const authResult = await authenticate({
      promptMessage: 'Scan fingerprint for attendance',
    });

    if (!authResult.success) {
      throw new Error('Fingerprint verification failed');
    }

    // Verify with backend
    const payload = {
      biometric_type: 'fingerprint',
      fingerprint_template: 'DEVICE_VERIFIED',
      device_info: options.deviceInfo || '',
      location: options.location || '',
    };

    const response = await post(`${API_ENDPOINTS.BIOMETRICS.BASE}/verify/`, payload);

    if (__DEV__) {
      console.log(`✅ Fingerprint verified: ${response.student?.name}`);
    }

    return {
      success: true,
      data: response,
      student: response.student,
      attendance: response.attendance,
      confidenceScore: response.confidence_score,
      message: response.message || 'Fingerprint verified successfully',
    };
  } catch (error) {
    console.error('❌ Verify fingerprint error:', error);

    return {
      success: false,
      message: error.response?.data?.error || 'Failed to verify fingerprint',
      error: handleApiError(error),
    };
  }
};

/**
 * Verify face for attendance
 * @param {number} studentId - Student ID
 * @param {Object} imageData - Face image data
 * @param {Object} options - Verification options
 * @returns {Promise<Object>} Verification result
 * 
 * Backend Endpoint: POST /api/biometrics/verify/
 */
export const verifyFaceRecognition = async (studentId, imageData, options = {}) => {
  try {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    if (!imageData || !imageData.base64) {
      throw new Error('Face image data is required');
    }

    if (__DEV__) {
      console.log(`📸 Verifying face recognition for student ${studentId}...`);
    }

    const payload = {
      biometric_type: 'face',
      face_encoding: imageData.base64,
      device_info: options.deviceInfo || '',
      location: options.location || '',
    };

    const response = await post(`${API_ENDPOINTS.BIOMETRICS.BASE}/verify/`, payload);

    if (__DEV__) {
      console.log(`✅ Face verified: ${response.student?.name}`);
    }

    return {
      success: true,
      data: response,
      student: response.student,
      attendance: response.attendance,
      confidenceScore: response.confidence_score,
      message: response.message || 'Face verified successfully',
    };
  } catch (error) {
    console.error('❌ Verify face recognition error:', error);

    return {
      success: false,
      message: error.response?.data?.error || 'Failed to verify face recognition',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// BIOMETRIC DATA RETRIEVAL
// ============================================================

/**
 * Get biometric records for a student
 * @param {number} studentId - Student ID
 * @returns {Promise<Object>} Biometric records
 * 
 * Backend Endpoint: GET /api/biometrics/by_student/?student=ID
 */
export const getStudentBiometrics = async (studentId) => {
  try {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    if (__DEV__) {
      console.log(`📋 Fetching biometrics for student ${studentId}...`);
    }

    const response = await get(`${API_ENDPOINTS.BIOMETRICS.BASE}/by_student/?student=${studentId}`);

    if (__DEV__) {
      console.log(`✅ Fetched ${response.count} biometric record(s)`);
    }

    return {
      success: true,
      data: response.biometrics,
      count: response.count,
    };
  } catch (error) {
    console.error('❌ Get student biometrics error:', error);

    return {
      success: false,
      message: 'Failed to fetch biometric records',
      error: handleApiError(error),
    };
  }
};

/**
 * Get all biometric records (admin/teacher)
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Biometric records
 * 
 * Backend Endpoint: GET /api/biometrics/
 */
export const getBiometricRecords = async (filters = {}) => {
  try {
    if (__DEV__) {
      console.log('📋 Fetching biometric records...', filters);
    }

    const params = new URLSearchParams();
    
    if (filters.student) params.append('student', filters.student);
    if (filters.biometric_type) params.append('biometric_type', filters.biometric_type);
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active);
    if (filters.page) params.append('page', filters.page);
    if (filters.page_size) params.append('page_size', filters.page_size);

    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.BIOMETRICS.LIST}?${queryString}`
      : API_ENDPOINTS.BIOMETRICS.LIST;

    const response = await get(url);

    if (__DEV__) {
      const count = Array.isArray(response) ? response.length : response.results?.length || 0;
      console.log(`✅ Fetched ${count} biometric records`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get biometric records error:', error);

    return {
      success: false,
      message: 'Failed to fetch biometric records',
      error: handleApiError(error),
    };
  }
};

/**
 * Get biometric scan logs
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Scan logs
 * 
 * Backend Endpoint: GET /api/biometrics/scan-logs/
 */
export const getBiometricScanLogs = async (filters = {}) => {
  try {
    if (__DEV__) {
      console.log('📋 Fetching biometric scan logs...', filters);
    }

    const params = new URLSearchParams();
    
    if (filters.biometric_type) params.append('biometric_type', filters.biometric_type);
    if (filters.success !== undefined) params.append('success', filters.success);
    if (filters.student) params.append('student', filters.student);
    if (filters.page) params.append('page', filters.page);
    if (filters.page_size) params.append('page_size', filters.page_size);

    const queryString = params.toString();
    const url = `${API_ENDPOINTS.BIOMETRICS.BASE}/scan-logs/${queryString ? '?' + queryString : ''}`;

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
// BIOMETRIC DELETION
// ============================================================

/**
 * Delete biometric record
 * @param {number} biometricId - Biometric record ID
 * @returns {Promise<Object>} Deletion result
 * 
 * Backend Endpoint: DELETE /api/biometrics/{id}/
 */
export const deleteBiometric = async (biometricId) => {
  try {
    if (!biometricId) {
      throw new Error('Biometric ID is required');
    }

    if (__DEV__) {
      console.log(`🗑️ Deleting biometric record ${biometricId}...`);
    }

    await del(API_ENDPOINTS.BIOMETRICS.DETAIL(biometricId));

    if (__DEV__) {
      console.log(`✅ Biometric record deleted`);
    }

    return {
      success: true,
      message: 'Biometric record deleted successfully',
    };
  } catch (error) {
    console.error('❌ Delete biometric error:', error);

    return {
      success: false,
      message: 'Failed to delete biometric record',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// LOCAL STORAGE MANAGEMENT
// ============================================================

/**
 * Store biometric data locally
 * @param {number} studentId - Student ID
 * @param {Object} data - Biometric data
 */
const storeBiometricData = async (studentId, data) => {
  try {
    const key = `${STORAGE_KEY}_${studentId}`;
    const existingData = await AsyncStorage.getItem(key);
    const biometricData = existingData ? JSON.parse(existingData) : {};

    biometricData[data.type] = {
      enabled: data.enabled,
      enrolledAt: data.enrolledAt,
      lastVerified: null,
    };

    await AsyncStorage.setItem(key, JSON.stringify(biometricData));

    if (__DEV__) {
      console.log(`📦 Stored ${data.type} data for student ${studentId}`);
    }
  } catch (error) {
    console.error('❌ Store biometric data error:', error);
  }
};

/**
 * Get local biometric data
 * @param {number} studentId - Student ID
 * @returns {Promise<Object|null>} Biometric data
 */
export const getLocalBiometricData = async (studentId) => {
  try {
    const key = `${STORAGE_KEY}_${studentId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('❌ Get local biometric data error:', error);
    return null;
  }
};

/**
 * Remove local biometric data
 * @param {number} studentId - Student ID
 * @param {string} type - Biometric type
 */
export const removeLocalBiometricData = async (studentId, type) => {
  try {
    const key = `${STORAGE_KEY}_${studentId}`;
    const existingData = await AsyncStorage.getItem(key);
    
    if (existingData) {
      const biometricData = JSON.parse(existingData);
      delete biometricData[type];
      await AsyncStorage.setItem(key, JSON.stringify(biometricData));

      if (__DEV__) {
        console.log(`🗑️ Removed ${type} data for student ${studentId}`);
      }
    }
  } catch (error) {
    console.error('❌ Remove biometric data error:', error);
  }
};

/**
 * Clear all local biometric data for a student
 * @param {number} studentId - Student ID
 */
export const clearLocalBiometricData = async (studentId) => {
  try {
    const key = `${STORAGE_KEY}_${studentId}`;
    await AsyncStorage.removeItem(key);

    if (__DEV__) {
      console.log(`🗑️ Cleared all biometric data for student ${studentId}`);
    }
  } catch (error) {
    console.error('❌ Clear local data error:', error);
  }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Test biometric authentication
 * @returns {Promise<Object>} Test result
 */
export const testBiometricAuthentication = async () => {
  try {
    const support = await checkBiometricSupport();
    
    if (!support.isSupported) {
      return {
        success: false,
        message: 'Biometric authentication not available',
      };
    }

    const result = await authenticate({
      promptMessage: 'Test biometric authentication',
    });

    return {
      success: result.success,
      message: result.success
        ? 'Authentication successful'
        : result.error || 'Authentication failed',
    };
  } catch (error) {
    console.error('❌ Test authentication error:', error);
    return {
      success: false,
      message: error.message,
    };
  }
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Device Capabilities
  checkBiometricSupport,
  authenticate,

  // Enrollment
  enrollFingerprint,
  enrollFaceRecognition,

  // Verification
  verifyFingerprint,
  verifyFaceRecognition,

  // Data Retrieval
  getStudentBiometrics,
  getBiometricRecords,
  getBiometricScanLogs,

  // Deletion
  deleteBiometric,

  // Local Storage
  getLocalBiometricData,
  removeLocalBiometricData,
  clearLocalBiometricData,

  // Utilities
  testBiometricAuthentication,
};