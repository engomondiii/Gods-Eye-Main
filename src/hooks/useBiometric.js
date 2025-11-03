import { useState, useEffect, useCallback } from 'react';
import biometricService from '../services/biometricService';
import { biometricHelpers } from '../utils/biometricHelpers';

/**
 * Custom hook for biometric operations
 */
const useBiometric = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [supportedTypes, setSupportedTypes] = useState([]);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Check biometric support
   */
  const checkSupport = useCallback(async () => {
    try {
      const support = await biometricHelpers.checkBiometricSupport();
      setIsSupported(support.isSupported);
      setIsEnrolled(support.isEnrolled);
      setSupportedTypes(support.supportedTypes);
      return support;
    } catch (err) {
      setError(err.message);
      console.error('Check biometric support error:', err);
      return null;
    }
  }, []);

  /**
   * Authenticate using biometrics
   */
  const authenticate = useCallback(async (options = {}) => {
    try {
      setIsAuthenticating(true);
      setError(null);
      
      const result = await biometricService.authenticate(options);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Biometric authentication error:', err);
      return { success: false, error: err.message };
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  /**
   * Setup fingerprint
   */
  const setupFingerprint = useCallback(async (studentId, data = {}) => {
    try {
      setError(null);
      const result = await biometricService.setupFingerprint(studentId, data);
      await checkSupport();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Setup fingerprint error:', err);
      throw err;
    }
  }, [checkSupport]);

  /**
   * Setup face recognition
   */
  const setupFaceRecognition = useCallback(async (studentId, imageData) => {
    try {
      setError(null);
      const result = await biometricService.setupFaceRecognition(studentId, imageData);
      await checkSupport();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Setup face recognition error:', err);
      throw err;
    }
  }, [checkSupport]);

  /**
   * Verify fingerprint
   */
  const verifyFingerprint = useCallback(async (studentId) => {
    try {
      setError(null);
      const result = await biometricService.verifyFingerprint(studentId);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Verify fingerprint error:', err);
      throw err;
    }
  }, []);

  /**
   * Verify face
   */
  const verifyFace = useCallback(async (studentId, imageData) => {
    try {
      setError(null);
      const result = await biometricService.verifyFace(studentId, imageData);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Verify face error:', err);
      throw err;
    }
  }, []);

  /**
   * Get biometric info
   */
  const getBiometricInfo = useCallback(async (studentId) => {
    try {
      setError(null);
      const data = await biometricService.getBiometricInfo(studentId);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Get biometric info error:', err);
      throw err;
    }
  }, []);

  /**
   * Remove fingerprint
   */
  const removeFingerprint = useCallback(async (studentId) => {
    try {
      setError(null);
      const result = await biometricService.removeFingerprint(studentId);
      await checkSupport();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Remove fingerprint error:', err);
      throw err;
    }
  }, [checkSupport]);

  /**
   * Remove face recognition
   */
  const removeFaceRecognition = useCallback(async (studentId) => {
    try {
      setError(null);
      const result = await biometricService.removeFaceRecognition(studentId);
      await checkSupport();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Remove face recognition error:', err);
      throw err;
    }
  }, [checkSupport]);

  /**
   * Get enrollment status
   */
  const getEnrollmentStatus = useCallback(async (studentId) => {
    try {
      setError(null);
      const data = await biometricService.getEnrollmentStatus(studentId);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Get enrollment status error:', err);
      throw err;
    }
  }, []);

  /**
   * Test authentication
   */
  const testAuthentication = useCallback(async () => {
    try {
      setError(null);
      const result = await biometricService.testAuthentication();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Test authentication error:', err);
      throw err;
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Check support on mount
   */
  useEffect(() => {
    checkSupport();
  }, [checkSupport]);

  return {
    // State
    isSupported,
    isEnrolled,
    supportedTypes,
    isAuthenticating,
    error,

    // Actions
    checkSupport,
    authenticate,
    setupFingerprint,
    setupFaceRecognition,
    verifyFingerprint,
    verifyFace,
    getBiometricInfo,
    removeFingerprint,
    removeFaceRecognition,
    getEnrollmentStatus,
    testAuthentication,
    clearError,

    // Helpers
    getBiometricTypeName: biometricHelpers.getBiometricTypeName,
    getBiometricIcon: biometricHelpers.getBiometricIcon,
    getBiometricErrorMessage: biometricHelpers.getBiometricErrorMessage,
  };
};

export default useBiometric;