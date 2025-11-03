import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Keys
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';
const APP_SETTINGS_KEY = 'app_settings';

// Token management (use SecureStore for sensitive data)
export const setToken = async (token) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Set token error:', error);
    throw error;
  }
};

export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Get token error:', error);
    return null;
  }
};

export const setRefreshToken = async (token) => {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Set refresh token error:', error);
    throw error;
  }
};

export const getRefreshToken = async () => {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Get refresh token error:', error);
    return null;
  }
};

// User data management
export const setUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Set user data error:', error);
    throw error;
  }
};

export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Get user data error:', error);
    return null;
  }
};

// App settings management
export const setAppSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Set app settings error:', error);
    throw error;
  }
};

export const getAppSettings = async () => {
  try {
    const data = await AsyncStorage.getItem(APP_SETTINGS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Get app settings error:', error);
    return null;
  }
};

// Generic storage functions
export const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Set item ${key} error:`, error);
    throw error;
  }
};

export const getItem = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Get item ${key} error:`, error);
    return null;
  }
};

export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Remove item ${key} error:`, error);
    throw error;
  }
};

// Clear all storage
export const clearAll = async () => {
  try {
    // Clear AsyncStorage
    await AsyncStorage.clear();
    
    // Clear SecureStore
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Clear all error:', error);
    throw error;
  }
};

// Multi-get and multi-set
export const multiGet = async (keys) => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    return values.map(([key, value]) => [key, value ? JSON.parse(value) : null]);
  } catch (error) {
    console.error('Multi-get error:', error);
    return [];
  }
};

export const multiSet = async (keyValuePairs) => {
  try {
    const pairs = keyValuePairs.map(([key, value]) => [
      key,
      JSON.stringify(value),
    ]);
    await AsyncStorage.multiSet(pairs);
  } catch (error) {
    console.error('Multi-set error:', error);
    throw error;
  }
};