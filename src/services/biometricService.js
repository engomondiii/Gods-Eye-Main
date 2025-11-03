import api from './api';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Biometric Service
 * Handles fingerprint and face recognition operations
 */
class BiometricService {
  constructor() {
    this.STORAGE_KEY = '@biometric_data';
  }

  /**
   * Check if device supports biometric authentication
   */
  async checkBiometricSupport() {
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
      };
    }
  }

  /**
   * Authenticate using biometrics
   * @param {Object} options - Authentication options
   */
  async authenticate(options = {}) {
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
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Setup fingerprint for a student
   * @param {string} studentId - Student ID
   * @param {Object} data - Fingerprint data
   */
  async setupFingerprint(studentId, data = {}) {
    try {
      // First, authenticate the user
      const authResult = await this.authenticate({
        promptMessage: 'Scan fingerprint to enroll',
      });

      if (!authResult.success) {
        throw new Error('Fingerprint authentication failed');
      }

      // Send to backend
      const payload = {
        student_id: studentId,
        biometric_type: 'fingerprint',
        enrolled_at: new Date().toISOString(),
        device_info: {
          platform: data.platform || 'mobile',
          device_id: data.deviceId || null,
        },
      };

      const response = await api.post('/biometric/fingerprint/setup', payload);

      // Store locally
      await this.storeBiometricData(studentId, {
        type: 'fingerprint',
        enabled: true,
        enrolledAt: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('Setup fingerprint error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Setup face recognition for a student
   * @param {string} studentId - Student ID
   * @param {Object} imageData - Face image data
   */
  async setupFaceRecognition(studentId, imageData) {
    try {
      if (!imageData || !imageData.base64) {
        throw new Error('Invalid image data');
      }

      const payload = {
        student_id: studentId,
        biometric_type: 'face_recognition',
        image_data: imageData.base64,
        enrolled_at: new Date().toISOString(),
      };

      const response = await api.post('/biometric/face/setup', payload);

      // Store locally
      await this.storeBiometricData(studentId, {
        type: 'face_recognition',
        enabled: true,
        enrolledAt: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('Setup face recognition error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Verify fingerprint for attendance
   * @param {string} studentId - Student ID
   */
  async verifyFingerprint(studentId) {
    try {
      // Authenticate using device biometrics
      const authResult = await this.authenticate({
        promptMessage: 'Scan fingerprint for attendance',
      });

      if (!authResult.success) {
        throw new Error('Fingerprint verification failed');
      }

      // Verify with backend
      const response = await api.post('/biometric/fingerprint/verify', {
        student_id: studentId,
        timestamp: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('Verify fingerprint error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Verify face for attendance
   * @param {string} studentId - Student ID
   * @param {Object} imageData - Face image data
   */
  async verifyFace(studentId, imageData) {
    try {
      if (!imageData || !imageData.base64) {
        throw new Error('Invalid image data');
      }

      const response = await api.post('/biometric/face/verify', {
        student_id: studentId,
        image_data: imageData.base64,
        timestamp: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('Verify face error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get biometric info for a student
   * @param {string} studentId - Student ID
   */
  async getBiometricInfo(studentId) {
    try {
      const response = await api.get(`/students/${studentId}/biometric`);
      return response.data;
    } catch (error) {
      console.error('Get biometric info error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Remove fingerprint data
   * @param {string} studentId - Student ID
   */
  async removeFingerprint(studentId) {
    try {
      const response = await api.delete(`/students/${studentId}/biometric/fingerprint`);

      // Remove local data
      await this.removeBiometricData(studentId, 'fingerprint');

      return response.data;
    } catch (error) {
      console.error('Remove fingerprint error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Remove face recognition data
   * @param {string} studentId - Student ID
   */
  async removeFaceRecognition(studentId) {
    try {
      const response = await api.delete(`/students/${studentId}/biometric/face`);

      // Remove local data
      await this.removeBiometricData(studentId, 'face_recognition');

      return response.data;
    } catch (error) {
      console.error('Remove face recognition error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Update biometric data
   * @param {string} studentId - Student ID
   * @param {string} type - Biometric type
   * @param {Object} data - Update data
   */
  async updateBiometric(studentId, type, data) {
    try {
      const response = await api.put(`/students/${studentId}/biometric/${type}`, data);
      return response.data;
    } catch (error) {
      console.error('Update biometric error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get biometric enrollment status
   * @param {string} studentId - Student ID
   */
  async getEnrollmentStatus(studentId) {
    try {
      const response = await api.get(`/students/${studentId}/biometric/status`);
      return response.data;
    } catch (error) {
      console.error('Get enrollment status error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Store biometric data locally
   * @param {string} studentId - Student ID
   * @param {Object} data - Biometric data
   */
  async storeBiometricData(studentId, data) {
    try {
      const key = `${this.STORAGE_KEY}_${studentId}`;
      const existingData = await AsyncStorage.getItem(key);
      const biometricData = existingData ? JSON.parse(existingData) : {};

      biometricData[data.type] = {
        enabled: data.enabled,
        enrolledAt: data.enrolledAt,
        lastVerified: null,
      };

      await AsyncStorage.setItem(key, JSON.stringify(biometricData));
    } catch (error) {
      console.error('Store biometric data error:', error);
    }
  }

  /**
   * Get local biometric data
   * @param {string} studentId - Student ID
   */
  async getLocalBiometricData(studentId) {
    try {
      const key = `${this.STORAGE_KEY}_${studentId}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Get local biometric data error:', error);
      return null;
    }
  }

  /**
   * Remove local biometric data
   * @param {string} studentId - Student ID
   * @param {string} type - Biometric type
   */
  async removeBiometricData(studentId, type) {
    try {
      const key = `${this.STORAGE_KEY}_${studentId}`;
      const existingData = await AsyncStorage.getItem(key);
      
      if (existingData) {
        const biometricData = JSON.parse(existingData);
        delete biometricData[type];
        await AsyncStorage.setItem(key, JSON.stringify(biometricData));
      }
    } catch (error) {
      console.error('Remove biometric data error:', error);
    }
  }

  /**
   * Clear all local biometric data
   * @param {string} studentId - Student ID
   */
  async clearLocalData(studentId) {
    try {
      const key = `${this.STORAGE_KEY}_${studentId}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Clear local data error:', error);
    }
  }

  /**
   * Test biometric authentication
   */
  async testAuthentication() {
    try {
      const support = await this.checkBiometricSupport();
      
      if (!support.isSupported) {
        return {
          success: false,
          message: 'Biometric authentication not available',
        };
      }

      const result = await this.authenticate({
        promptMessage: 'Test biometric authentication',
      });

      return {
        success: result.success,
        message: result.success
          ? 'Authentication successful'
          : result.error || 'Authentication failed',
      };
    } catch (error) {
      console.error('Test authentication error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   */
  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Invalid biometric data');
        case 401:
          return new Error('Authentication required');
        case 403:
          return new Error('Biometric access denied');
        case 404:
          return new Error('Biometric data not found');
        case 409:
          return new Error('Biometric already enrolled');
        case 422:
          return new Error(data.message || 'Biometric verification failed');
        case 500:
          return new Error('Server error. Please try again later');
        default:
          return new Error(data.message || 'An error occurred');
      }
    } else if (error.request) {
      return new Error('Network error. Please check your connection');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export default new BiometricService();