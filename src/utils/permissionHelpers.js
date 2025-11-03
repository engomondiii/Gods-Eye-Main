import { Platform, Alert, Linking } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

/**
 * Permission Helper Functions
 * Utility functions for handling app permissions
 */

/**
 * Request camera permission
 * @returns {Promise<Object>} - Permission result
 */
export const requestCameraPermission = async () => {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync();
    
    return {
      granted: status === 'granted',
      status,
      canAskAgain: status !== 'denied',
    };
  } catch (error) {
    console.error('Request camera permission error:', error);
    return {
      granted: false,
      status: 'error',
      error: error.message,
    };
  }
};

/**
 * Check camera permission status
 * @returns {Promise<Object>} - Permission status
 */
export const checkCameraPermission = async () => {
  try {
    const { status } = await Camera.getCameraPermissionsAsync();
    
    return {
      granted: status === 'granted',
      status,
    };
  } catch (error) {
    console.error('Check camera permission error:', error);
    return {
      granted: false,
      status: 'error',
    };
  }
};

/**
 * Request location permission
 * @returns {Promise<Object>} - Permission result
 */
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    return {
      granted: status === 'granted',
      status,
      canAskAgain: status !== 'denied',
    };
  } catch (error) {
    console.error('Request location permission error:', error);
    return {
      granted: false,
      status: 'error',
      error: error.message,
    };
  }
};

/**
 * Check location permission status
 * @returns {Promise<Object>} - Permission status
 */
export const checkLocationPermission = async () => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    
    return {
      granted: status === 'granted',
      status,
    };
  } catch (error) {
    console.error('Check location permission error:', error);
    return {
      granted: false,
      status: 'error',
    };
  }
};

/**
 * Request multiple permissions
 * @param {Array} permissionTypes - Array of permission types
 * @returns {Promise<Object>} - Results for all permissions
 */
export const requestMultiplePermissions = async (permissionTypes) => {
  const results = {};
  
  for (const type of permissionTypes) {
    switch (type) {
      case 'camera':
        results.camera = await requestCameraPermission();
        break;
      case 'location':
        results.location = await requestLocationPermission();
        break;
      default:
        results[type] = { granted: false, status: 'unknown' };
    }
  }
  
  return results;
};

/**
 * Check all app permissions
 * @returns {Promise<Object>} - Status of all permissions
 */
export const checkAllPermissions = async () => {
  const camera = await checkCameraPermission();
  const location = await checkLocationPermission();
  
  return {
    camera,
    location,
    allGranted: camera.granted && location.granted,
  };
};

/**
 * Show permission denied alert
 * @param {string} permissionType - Type of permission
 * @param {Function} onSettings - Callback for settings button
 */
export const showPermissionDeniedAlert = (permissionType, onSettings) => {
  const messages = {
    camera: {
      title: 'Camera Permission Required',
      message: 'This app needs camera access to scan QR codes and capture photos for attendance. Please enable camera permission in settings.',
    },
    location: {
      title: 'Location Permission Required',
      message: 'This app needs location access to verify attendance location. Please enable location permission in settings.',
    },
  };

  const config = messages[permissionType] || {
    title: 'Permission Required',
    message: 'This app needs additional permissions to function properly.',
  };

  Alert.alert(
    config.title,
    config.message,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open Settings',
        onPress: () => {
          if (onSettings) {
            onSettings();
          } else {
            openAppSettings();
          }
        },
      },
    ]
  );
};

/**
 * Open app settings
 */
export const openAppSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};

/**
 * Get permission status text
 * @param {string} status - Permission status
 * @returns {string} - User-friendly status text
 */
export const getPermissionStatusText = (status) => {
  const statusTexts = {
    granted: 'Granted',
    denied: 'Denied',
    undetermined: 'Not Requested',
    restricted: 'Restricted',
    error: 'Error',
  };

  return statusTexts[status] || 'Unknown';
};

/**
 * Get permission icon
 * @param {string} permissionType - Type of permission
 * @returns {string} - Icon name
 */
export const getPermissionIcon = (permissionType) => {
  const icons = {
    camera: 'camera',
    location: 'map-marker',
    microphone: 'microphone',
    storage: 'folder',
    notifications: 'bell',
  };

  return icons[permissionType] || 'help-circle';
};

/**
 * Check if permission can be requested
 * @param {string} status - Current permission status
 * @returns {boolean} - Can request permission
 */
export const canRequestPermission = (status) => {
  return status === 'undetermined' || status === 'denied';
};

/**
 * Format permission result for display
 * @param {Object} result - Permission result
 * @returns {Object} - Formatted result
 */
export const formatPermissionResult = (result) => {
  return {
    granted: result.granted,
    statusText: getPermissionStatusText(result.status),
    canRequest: canRequestPermission(result.status),
    needsSettings: result.status === 'denied' && !result.canAskAgain,
  };
};

/**
 * Validate required permissions
 * @param {Array} required - Required permission types
 * @param {Object} current - Current permission statuses
 * @returns {Object} - Validation result
 */
export const validateRequiredPermissions = (required, current) => {
  const missing = [];
  
  required.forEach(permission => {
    if (!current[permission] || !current[permission].granted) {
      missing.push(permission);
    }
  });

  return {
    valid: missing.length === 0,
    missing,
    message: missing.length > 0 
      ? `Missing permissions: ${missing.join(', ')}`
      : 'All required permissions granted',
  };
};

/**
 * Get permission request message
 * @param {string} permissionType - Type of permission
 * @param {string} feature - Feature requiring permission
 * @returns {string} - Request message
 */
export const getPermissionRequestMessage = (permissionType, feature) => {
  const messages = {
    camera: `${feature || 'This feature'} requires camera access to scan QR codes and take photos.`,
    location: `${feature || 'This feature'} requires location access to verify your attendance location.`,
  };

  return messages[permissionType] || `${feature || 'This feature'} requires additional permissions.`;
};

/**
 * Handle permission request with user guidance
 * @param {string} permissionType - Type of permission
 * @param {string} feature - Feature name
 * @returns {Promise<boolean>} - True if granted
 */
export const handlePermissionRequest = async (permissionType, feature) => {
  // First check current status
  let currentStatus;
  
  switch (permissionType) {
    case 'camera':
      currentStatus = await checkCameraPermission();
      break;
    case 'location':
      currentStatus = await checkLocationPermission();
      break;
    default:
      return false;
  }

  // If already granted, return true
  if (currentStatus.granted) {
    return true;
  }

  // If cannot ask again, show settings alert
  if (currentStatus.status === 'denied' && !currentStatus.canAskAgain) {
    showPermissionDeniedAlert(permissionType);
    return false;
  }

  // Show explanation before requesting
  return new Promise((resolve) => {
    Alert.alert(
      'Permission Required',
      getPermissionRequestMessage(permissionType, feature),
      [
        {
          text: 'Cancel',
          onPress: () => resolve(false),
          style: 'cancel',
        },
        {
          text: 'Allow',
          onPress: async () => {
            let result;
            
            switch (permissionType) {
              case 'camera':
                result = await requestCameraPermission();
                break;
              case 'location':
                result = await requestLocationPermission();
                break;
              default:
                resolve(false);
                return;
            }
            
            if (!result.granted) {
              showPermissionDeniedAlert(permissionType);
            }
            
            resolve(result.granted);
          },
        },
      ]
    );
  });
};

/**
 * Create permission summary
 * @param {Object} permissions - Permission statuses
 * @returns {Object} - Summary information
 */
export const createPermissionSummary = (permissions) => {
  const granted = [];
  const denied = [];
  const notRequested = [];

  Object.entries(permissions).forEach(([type, status]) => {
    if (status.granted) {
      granted.push(type);
    } else if (status.status === 'denied') {
      denied.push(type);
    } else if (status.status === 'undetermined') {
      notRequested.push(type);
    }
  });

  return {
    granted,
    denied,
    notRequested,
    allGranted: denied.length === 0 && notRequested.length === 0,
    partiallyGranted: granted.length > 0 && (denied.length > 0 || notRequested.length > 0),
  };
};

export default {
  requestCameraPermission,
  checkCameraPermission,
  requestLocationPermission,
  checkLocationPermission,
  requestMultiplePermissions,
  checkAllPermissions,
  showPermissionDeniedAlert,
  openAppSettings,
  getPermissionStatusText,
  getPermissionIcon,
  canRequestPermission,
  formatPermissionResult,
  validateRequiredPermissions,
  getPermissionRequestMessage,
  handlePermissionRequest,
  createPermissionSummary,
};