// ========================================
// GOD'S EYE EDTECH - STORAGE UTILITIES
// ========================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// ============================================================
// STORAGE KEYS
// ============================================================

const STORAGE_KEYS = {
  TOKEN: 'gods_eye_auth_token',
  REFRESH_TOKEN: 'gods_eye_refresh_token',
  USER_DATA: 'gods_eye_user_data',
  APP_SETTINGS: 'gods_eye_app_settings',
  BIOMETRIC_ENABLED: 'gods_eye_biometric_enabled',
  LAST_SYNC: 'gods_eye_last_sync',
  CACHED_DATA: 'gods_eye_cached_data',
  ONBOARDING_COMPLETE: 'gods_eye_onboarding_complete',
  ATTENDANCE_PREFERENCES: 'gods_eye_attendance_preferences',
};

// ============================================================
// SECURE STORAGE (for sensitive data like tokens)
// ============================================================

/**
 * Save access token securely
 * @param {string} token - JWT access token
 */
export const setToken = async (token) => {
  try {
    if (!token) {
      throw new Error('Token is required');
    }
    
    if (Platform.OS === 'web') {
      // Web fallback to localStorage
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } else {
      // Mobile: Use SecureStore
      await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token);
    }
    
    if (__DEV__) {
      console.log('✅ Token saved successfully');
    }
  } catch (error) {
    console.error('❌ Set token error:', error);
    throw new Error('Failed to save token');
  }
};

/**
 * Get access token from secure storage
 * @returns {Promise<string|null>} JWT access token or null
 */
export const getToken = async () => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(STORAGE_KEYS.TOKEN);
    } else {
      return await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
    }
  } catch (error) {
    console.error('❌ Get token error:', error);
    return null;
  }
};

/**
 * Remove access token from secure storage
 */
export const removeToken = async () => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } else {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
    }
    
    if (__DEV__) {
      console.log('✅ Token removed successfully');
    }
  } catch (error) {
    console.error('❌ Remove token error:', error);
  }
};

/**
 * Save refresh token securely
 * @param {string} token - JWT refresh token
 */
export const setRefreshToken = async (token) => {
  try {
    if (!token) {
      throw new Error('Refresh token is required');
    }
    
    if (Platform.OS === 'web') {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } else {
      await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, token);
    }
    
    if (__DEV__) {
      console.log('✅ Refresh token saved successfully');
    }
  } catch (error) {
    console.error('❌ Set refresh token error:', error);
    throw new Error('Failed to save refresh token');
  }
};

/**
 * Get refresh token from secure storage
 * @returns {Promise<string|null>} JWT refresh token or null
 */
export const getRefreshToken = async () => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } else {
      return await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    }
  } catch (error) {
    console.error('❌ Get refresh token error:', error);
    return null;
  }
};

/**
 * Remove refresh token from secure storage
 */
export const removeRefreshToken = async () => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } else {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    }
    
    if (__DEV__) {
      console.log('✅ Refresh token removed successfully');
    }
  } catch (error) {
    console.error('❌ Remove refresh token error:', error);
  }
};

// ============================================================
// USER DATA STORAGE
// ============================================================

/**
 * Save user data to AsyncStorage
 * @param {Object} userData - User object from backend
 */
export const setUserData = async (userData) => {
  try {
    if (!userData) {
      throw new Error('User data is required');
    }
    
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, jsonValue);
    
    if (__DEV__) {
      console.log('✅ User data saved:', userData.email || userData.id);
    }
  } catch (error) {
    console.error('❌ Set user data error:', error);
    throw new Error('Failed to save user data');
  }
};

/**
 * Get user data from AsyncStorage
 * @returns {Promise<Object|null>} User object or null
 */
export const getUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('❌ Get user data error:', error);
    return null;
  }
};

/**
 * Remove user data from AsyncStorage
 */
export const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    if (__DEV__) {
      console.log('✅ User data removed successfully');
    }
  } catch (error) {
    console.error('❌ Remove user data error:', error);
  }
};

// ============================================================
// APP SETTINGS STORAGE
// ============================================================

/**
 * Save app settings to AsyncStorage
 * @param {Object} settings - App settings object
 */
export const setAppSettings = async (settings) => {
  try {
    if (!settings) {
      throw new Error('Settings are required');
    }
    
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, jsonValue);
    
    if (__DEV__) {
      console.log('✅ App settings saved');
    }
  } catch (error) {
    console.error('❌ Set app settings error:', error);
    throw new Error('Failed to save app settings');
  }
};

/**
 * Get app settings from AsyncStorage
 * @returns {Promise<Object|null>} Settings object or null
 */
export const getAppSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('❌ Get app settings error:', error);
    return null;
  }
};

// ============================================================
// GENERIC STORAGE FUNCTIONS
// ============================================================

/**
 * Save any data to AsyncStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 */
export const setItem = async (key, value) => {
  try {
    if (!key) {
      throw new Error('Storage key is required');
    }
    
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    
    if (__DEV__) {
      console.log(`✅ Item saved: ${key}`);
    }
  } catch (error) {
    console.error(`❌ Set item ${key} error:`, error);
    throw new Error(`Failed to save item: ${key}`);
  }
};

/**
 * Get any data from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<any|null>} Parsed value or null
 */
export const getItem = async (key) => {
  try {
    if (!key) {
      throw new Error('Storage key is required');
    }
    
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`❌ Get item ${key} error:`, error);
    return null;
  }
};

/**
 * Remove any data from AsyncStorage
 * @param {string} key - Storage key
 */
export const removeItem = async (key) => {
  try {
    if (!key) {
      throw new Error('Storage key is required');
    }
    
    await AsyncStorage.removeItem(key);
    
    if (__DEV__) {
      console.log(`✅ Item removed: ${key}`);
    }
  } catch (error) {
    console.error(`❌ Remove item ${key} error:`, error);
    throw new Error(`Failed to remove item: ${key}`);
  }
};

// ============================================================
// CLEAR ALL STORAGE
// ============================================================

/**
 * Clear all storage (tokens, user data, settings, etc.)
 * Used on logout
 */
export const clearAll = async () => {
  try {
    // Clear AsyncStorage
    await AsyncStorage.clear();
    
    // Clear SecureStore tokens
    if (Platform.OS !== 'web') {
      try {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
      } catch (e) {
        // Token might not exist, ignore error
      }
      
      try {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      } catch (e) {
        // Refresh token might not exist, ignore error
      }
    } else {
      // Web: clear localStorage
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
    
    if (__DEV__) {
      console.log('✅ All storage cleared successfully');
    }
  } catch (error) {
    console.error('❌ Clear all storage error:', error);
    throw new Error('Failed to clear storage');
  }
};

/**
 * Clear only authentication data (tokens and user data)
 * Keeps app settings and other data
 */
export const clearAuthData = async () => {
  try {
    // Remove tokens
    await removeToken();
    await removeRefreshToken();
    
    // Remove user data
    await removeUserData();
    
    if (__DEV__) {
      console.log('✅ Auth data cleared successfully');
    }
  } catch (error) {
    console.error('❌ Clear auth data error:', error);
    throw new Error('Failed to clear auth data');
  }
};

// ============================================================
// BATCH OPERATIONS
// ============================================================

/**
 * Get multiple items from AsyncStorage at once
 * @param {Array<string>} keys - Array of storage keys
 * @returns {Promise<Array<[string, any]>>} Array of [key, value] pairs
 */
export const multiGet = async (keys) => {
  try {
    if (!keys || keys.length === 0) {
      return [];
    }
    
    const values = await AsyncStorage.multiGet(keys);
    return values.map(([key, value]) => [
      key,
      value ? JSON.parse(value) : null,
    ]);
  } catch (error) {
    console.error('❌ Multi-get error:', error);
    return [];
  }
};

/**
 * Set multiple items in AsyncStorage at once
 * @param {Array<[string, any]>} keyValuePairs - Array of [key, value] pairs
 */
export const multiSet = async (keyValuePairs) => {
  try {
    if (!keyValuePairs || keyValuePairs.length === 0) {
      return;
    }
    
    const pairs = keyValuePairs.map(([key, value]) => [
      key,
      JSON.stringify(value),
    ]);
    
    await AsyncStorage.multiSet(pairs);
    
    if (__DEV__) {
      console.log(`✅ ${pairs.length} items saved successfully`);
    }
  } catch (error) {
    console.error('❌ Multi-set error:', error);
    throw new Error('Failed to save multiple items');
  }
};

/**
 * Remove multiple items from AsyncStorage at once
 * @param {Array<string>} keys - Array of storage keys
 */
export const multiRemove = async (keys) => {
  try {
    if (!keys || keys.length === 0) {
      return;
    }
    
    await AsyncStorage.multiRemove(keys);
    
    if (__DEV__) {
      console.log(`✅ ${keys.length} items removed successfully`);
    }
  } catch (error) {
    console.error('❌ Multi-remove error:', error);
    throw new Error('Failed to remove multiple items');
  }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Check if token exists
 * @returns {Promise<boolean>} True if token exists
 */
export const hasToken = async () => {
  try {
    const token = await getToken();
    return !!token;
  } catch (error) {
    return false;
  }
};

/**
 * Check if user data exists
 * @returns {Promise<boolean>} True if user data exists
 */
export const hasUserData = async () => {
  try {
    const userData = await getUserData();
    return !!userData;
  } catch (error) {
    return false;
  }
};

/**
 * Get all storage keys
 * @returns {Promise<Array<string>>} Array of all storage keys
 */
export const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('❌ Get all keys error:', error);
    return [];
  }
};

/**
 * Get storage size info (for debugging)
 * @returns {Promise<Object>} Storage info
 */
export const getStorageInfo = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    
    let totalSize = 0;
    items.forEach(([key, value]) => {
      if (value) {
        totalSize += value.length;
      }
    });
    
    return {
      totalKeys: keys.length,
      totalSize: totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      keys: keys,
    };
  } catch (error) {
    console.error('❌ Get storage info error:', error);
    return {
      totalKeys: 0,
      totalSize: 0,
      totalSizeKB: '0',
      keys: [],
    };
  }
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Token management
  setToken,
  getToken,
  removeToken,
  setRefreshToken,
  getRefreshToken,
  removeRefreshToken,
  hasToken,
  
  // User data
  setUserData,
  getUserData,
  removeUserData,
  hasUserData,
  
  // App settings
  setAppSettings,
  getAppSettings,
  
  // Generic storage
  setItem,
  getItem,
  removeItem,
  
  // Batch operations
  multiGet,
  multiSet,
  multiRemove,
  
  // Clear operations
  clearAll,
  clearAuthData,
  
  // Utilities
  getAllKeys,
  getStorageInfo,
  
  // Storage keys (for reference)
  STORAGE_KEYS,
};