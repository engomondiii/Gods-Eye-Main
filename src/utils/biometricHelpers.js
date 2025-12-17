// ========================================
// GOD'S EYE EDTECH - BIOMETRIC HELPERS
// ========================================

import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

// ============================================================
// BIOMETRIC SUPPORT CHECKS
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
    console.error('Check biometric support error:', error);
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
 * Check if biometric is available for specific platform
 * @returns {boolean} True if available
 */
export const isBiometricAvailableForPlatform = () => {
  return Platform.OS === 'ios' || Platform.OS === 'android';
};

// ============================================================
// BIOMETRIC TYPE UTILITIES
// ============================================================

/**
 * Get biometric type name
 * @param {number} type - Authentication type
 * @returns {string} Type name
 */
export const getBiometricTypeName = (type) => {
  switch (type) {
    case LocalAuthentication.AuthenticationType.FINGERPRINT:
      return 'Fingerprint';
    case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
      return 'Face Recognition';
    case LocalAuthentication.AuthenticationType.IRIS:
      return 'Iris';
    default:
      return 'Biometric';
  }
};

/**
 * Get available biometric types as array of names
 * @param {Array} supportedTypes - Array of supported types
 * @returns {Array} Array of type names
 */
export const getAvailableBiometricTypes = (supportedTypes) => {
  return supportedTypes.map(type => getBiometricTypeName(type));
};

/**
 * Get biometric icon name for Material Community Icons
 * @param {number} type - Authentication type
 * @returns {string} Icon name
 */
export const getBiometricIcon = (type) => {
  switch (type) {
    case LocalAuthentication.AuthenticationType.FINGERPRINT:
      return 'fingerprint';
    case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
      return 'face-recognition';
    case LocalAuthentication.AuthenticationType.IRIS:
      return 'eye';
    default:
      return 'security';
  }
};

/**
 * Get platform-specific biometric name
 * @returns {string} Platform-specific name
 */
export const getPlatformBiometricName = () => {
  if (Platform.OS === 'ios') {
    return 'Touch ID / Face ID';
  } else if (Platform.OS === 'android') {
    return 'Fingerprint / Face Unlock';
  }
  return 'Biometric';
};

/**
 * Get recommended biometric type
 * @param {Array} supportedTypes - Supported types
 * @returns {number|null} Recommended type
 */
export const getRecommendedBiometricType = (supportedTypes) => {
  // Prefer Face Recognition > Fingerprint > Iris
  if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION;
  }
  if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return LocalAuthentication.AuthenticationType.FINGERPRINT;
  }
  if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
    return LocalAuthentication.AuthenticationType.IRIS;
  }
  return null;
};

// ============================================================
// ERROR HANDLING
// ============================================================

/**
 * Get user-friendly error message
 * @param {string} error - Error code or message
 * @returns {string} User-friendly message
 */
export const getBiometricErrorMessage = (error) => {
  const errorMessages = {
    'user_cancel': 'Authentication was cancelled',
    'user_fallback': 'User chose to use fallback authentication',
    'system_cancel': 'System cancelled authentication',
    'passcode_not_set': 'Passcode is not set on the device',
    'biometric_not_enrolled': 'No biometrics are enrolled',
    'biometric_locked_out': 'Too many failed attempts. Try again later',
    'too_many_attempts': 'Too many failed attempts',
    'app_cancel': 'App cancelled authentication',
    'invalid_context': 'Invalid authentication context',
    'biometric_not_available': 'Biometric authentication is not available',
    'lockout': 'Biometric authentication is locked',
    'lockout_permanent': 'Biometric authentication is permanently locked',
  };

  return errorMessages[error] || 'Authentication failed. Please try again.';
};

/**
 * Validate biometric authentication result
 * @param {Object} result - Authentication result
 * @returns {Object} Validation result
 */
export const validateBiometricResult = (result) => {
  if (!result) {
    return {
      valid: false,
      error: 'No authentication result',
    };
  }

  if (result.success) {
    return {
      valid: true,
      message: 'Authentication successful',
    };
  }

  return {
    valid: false,
    error: getBiometricErrorMessage(result.error),
  };
};

// ============================================================
// STATUS & FORMATTING
// ============================================================

/**
 * Format biometric enrollment status
 * @param {boolean} hasHardware - Has biometric hardware
 * @param {boolean} isEnrolled - Has enrolled biometrics
 * @returns {Object} Status information
 */
export const formatBiometricStatus = (hasHardware, isEnrolled) => {
  if (!hasHardware) {
    return {
      status: 'not_available',
      message: 'Biometric hardware not available',
      canEnroll: false,
    };
  }

  if (!isEnrolled) {
    return {
      status: 'not_enrolled',
      message: 'No biometrics enrolled on device',
      canEnroll: true,
    };
  }

  return {
    status: 'available',
    message: 'Biometric authentication available',
    canEnroll: true,
  };
};

/**
 * Get security level for biometric type
 * @param {number} type - Authentication type
 * @returns {Object} Security level info
 */
export const getBiometricSecurityLevel = (type) => {
  switch (type) {
    case LocalAuthentication.AuthenticationType.FINGERPRINT:
      return {
        level: 'high',
        score: 8,
        description: 'Secure fingerprint authentication',
      };
    case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
      return {
        level: 'high',
        score: 9,
        description: 'Advanced face recognition',
      };
    case LocalAuthentication.AuthenticationType.IRIS:
      return {
        level: 'very_high',
        score: 10,
        description: 'Maximum security iris scanning',
      };
    default:
      return {
        level: 'medium',
        score: 5,
        description: 'Standard biometric authentication',
      };
  }
};

// ============================================================
// AUTHENTICATION OPTIONS
// ============================================================

/**
 * Create authentication options
 * @param {Object} config - Configuration options
 * @returns {Object} LocalAuthentication options
 */
export const createAuthOptions = (config = {}) => {
  return {
    promptMessage: config.promptMessage || 'Authenticate to continue',
    cancelLabel: config.cancelLabel || 'Cancel',
    fallbackLabel: config.fallbackLabel || 'Use Passcode',
    disableDeviceFallback: config.disableDeviceFallback || false,
    requireConfirmation: config.requireConfirmation || false,
  };
};

/**
 * Check if biometric should be used based on settings
 * @param {Object} settings - User settings
 * @returns {boolean} Should use biometric
 */
export const shouldUseBiometric = (settings = {}) => {
  if (!settings.biometricEnabled) return false;
  if (!isBiometricAvailableForPlatform()) return false;
  
  return true;
};

// ============================================================
// VALIDATION
// ============================================================

/**
 * Validate biometric data format
 * @param {Object} data - Biometric data
 * @returns {Object} Validation result
 */
export const validateBiometricData = (data) => {
  const errors = [];

  if (!data.studentId) {
    errors.push('Student ID is required');
  }

  if (!data.biometricType || !['fingerprint', 'face_recognition', 'iris'].includes(data.biometricType)) {
    errors.push('Valid biometric type is required');
  }

  if (data.biometricType === 'face_recognition' && !data.imageData) {
    errors.push('Image data is required for face recognition');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Check if biometric re-enrollment is needed
 * @param {Date} lastEnrolled - Last enrollment date
 * @param {number} maxAgeDays - Maximum age in days
 * @returns {boolean} True if re-enrollment needed
 */
export const needsBiometricReEnrollment = (lastEnrolled, maxAgeDays = 365) => {
  if (!lastEnrolled) return true;
  
  const enrollDate = new Date(lastEnrolled);
  const now = new Date();
  const ageInDays = (now - enrollDate) / (1000 * 60 * 60 * 24);
  
  return ageInDays > maxAgeDays;
};

/**
 * Get biometric quality score
 * @param {Object} metadata - Biometric metadata
 * @returns {number} Quality score (0-100)
 */
export const getBiometricQualityScore = (metadata = {}) => {
  let score = 50; // Base score

  // Adjust based on various factors
  if (metadata.captureQuality === 'high') score += 30;
  if (metadata.captureQuality === 'medium') score += 15;
  
  if (metadata.lightingConditions === 'good') score += 10;
  if (metadata.lightingConditions === 'poor') score -= 20;
  
  if (metadata.deviceQuality === 'high') score += 10;

  return Math.max(0, Math.min(100, score));
};

// ============================================================
// LOGGING & TRACKING
// ============================================================

/**
 * Format biometric attempt log
 * @param {boolean} success - Success status
 * @param {string} type - Biometric type
 * @param {string} error - Error message
 * @returns {Object} Log entry
 */
export const formatBiometricLog = (success, type, error = null) => {
  return {
    timestamp: new Date().toISOString(),
    success,
    type: getBiometricTypeName(type),
    error,
    platform: Platform.OS,
  };
};

/**
 * Get biometric usage statistics
 * @param {Array} logs - Array of biometric logs
 * @returns {Object} Usage statistics
 */
export const getBiometricStats = (logs = []) => {
  const totalAttempts = logs.length;
  const successfulAttempts = logs.filter(log => log.success).length;
  const failedAttempts = totalAttempts - successfulAttempts;
  const successRate = totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0;

  const typeBreakdown = logs.reduce((acc, log) => {
    acc[log.type] = (acc[log.type] || 0) + 1;
    return acc;
  }, {});

  return {
    totalAttempts,
    successfulAttempts,
    failedAttempts,
    successRate: successRate.toFixed(2),
    typeBreakdown,
  };
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Support Checks
  checkBiometricSupport,
  isBiometricAvailableForPlatform,

  // Type Utilities
  getBiometricTypeName,
  getAvailableBiometricTypes,
  getBiometricIcon,
  getPlatformBiometricName,
  getRecommendedBiometricType,

  // Error Handling
  getBiometricErrorMessage,
  validateBiometricResult,

  // Status & Formatting
  formatBiometricStatus,
  getBiometricSecurityLevel,

  // Authentication Options
  createAuthOptions,
  shouldUseBiometric,

  // Validation
  validateBiometricData,
  needsBiometricReEnrollment,
  getBiometricQualityScore,

  // Logging & Tracking
  formatBiometricLog,
  getBiometricStats,
};