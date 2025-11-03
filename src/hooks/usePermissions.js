import { useState, useEffect, useCallback } from 'react';
import { permissionHelpers } from '../utils/permissionHelpers';

/**
 * Custom hook for managing app permissions
 */
const usePermissions = (requiredPermissions = []) => {
  const [permissions, setPermissions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [allGranted, setAllGranted] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Check all permissions
   */
  const checkAllPermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const results = await permissionHelpers.checkAllPermissions();
      setPermissions(results);
      setAllGranted(results.allGranted);

      return results;
    } catch (err) {
      setError(err.message);
      console.error('Check all permissions error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Request specific permission
   */
  const requestPermission = useCallback(async (permissionType, feature) => {
    try {
      setError(null);
      const granted = await permissionHelpers.handlePermissionRequest(
        permissionType,
        feature
      );

      // Refresh permission status
      await checkAllPermissions();

      return granted;
    } catch (err) {
      setError(err.message);
      console.error('Request permission error:', err);
      return false;
    }
  }, [checkAllPermissions]);

  /**
   * Request multiple permissions
   */
  const requestMultiplePermissions = useCallback(async (permissionTypes) => {
    try {
      setError(null);
      const results = await permissionHelpers.requestMultiplePermissions(permissionTypes);

      // Refresh permission status
      await checkAllPermissions();

      return results;
    } catch (err) {
      setError(err.message);
      console.error('Request multiple permissions error:', err);
      return null;
    }
  }, [checkAllPermissions]);

  /**
   * Request camera permission
   */
  const requestCameraPermission = useCallback(async () => {
    return requestPermission('camera', 'Camera access');
  }, [requestPermission]);

  /**
   * Request location permission
   */
  const requestLocationPermission = useCallback(async () => {
    return requestPermission('location', 'Location access');
  }, [requestPermission]);

  /**
   * Check camera permission
   */
  const checkCameraPermission = useCallback(async () => {
    try {
      const result = await permissionHelpers.checkCameraPermission();
      return result.granted;
    } catch (err) {
      console.error('Check camera permission error:', err);
      return false;
    }
  }, []);

  /**
   * Check location permission
   */
  const checkLocationPermission = useCallback(async () => {
    try {
      const result = await permissionHelpers.checkLocationPermission();
      return result.granted;
    } catch (err) {
      console.error('Check location permission error:', err);
      return false;
    }
  }, []);

  /**
   * Validate required permissions
   */
  const validateRequiredPermissions = useCallback(() => {
    return permissionHelpers.validateRequiredPermissions(
      requiredPermissions,
      permissions
    );
  }, [requiredPermissions, permissions]);

  /**
   * Show permission denied alert
   */
  const showPermissionDeniedAlert = useCallback((permissionType) => {
    permissionHelpers.showPermissionDeniedAlert(permissionType);
  }, []);

  /**
   * Open app settings
   */
  const openAppSettings = useCallback(() => {
    permissionHelpers.openAppSettings();
  }, []);

  /**
   * Get permission summary
   */
  const getPermissionSummary = useCallback(() => {
    return permissionHelpers.createPermissionSummary(permissions);
  }, [permissions]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Check all permissions on mount
   */
  useEffect(() => {
    checkAllPermissions();
  }, [checkAllPermissions]);

  /**
   * Validate required permissions when permissions change
   */
  useEffect(() => {
    if (requiredPermissions.length > 0 && Object.keys(permissions).length > 0) {
      const validation = validateRequiredPermissions();
      setAllGranted(validation.valid);
    }
  }, [permissions, requiredPermissions, validateRequiredPermissions]);

  return {
    // State
    permissions,
    isLoading,
    allGranted,
    error,

    // Actions
    checkAllPermissions,
    requestPermission,
    requestMultiplePermissions,
    requestCameraPermission,
    requestLocationPermission,
    checkCameraPermission,
    checkLocationPermission,
    validateRequiredPermissions,
    showPermissionDeniedAlert,
    openAppSettings,
    getPermissionSummary,
    clearError,

    // Helpers
    getPermissionStatusText: permissionHelpers.getPermissionStatusText,
    getPermissionIcon: permissionHelpers.getPermissionIcon,
  };
};

export default usePermissions;