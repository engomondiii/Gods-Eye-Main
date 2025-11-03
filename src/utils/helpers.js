import { Alert, Platform } from 'react-native';
import * as Linking from 'expo-linking';

// Show alert
export const showAlert = (title, message, buttons = [{ text: 'OK' }]) => {
  Alert.alert(title, message, buttons);
};

// Show confirmation dialog
export const showConfirmation = (title, message, onConfirm, onCancel) => {
  Alert.alert(title, message, [
    {
      text: 'Cancel',
      onPress: onCancel,
      style: 'cancel',
    },
    {
      text: 'Confirm',
      onPress: onConfirm,
    },
  ]);
};

// Open URL
export const openURL = async (url) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      showAlert('Error', `Cannot open URL: ${url}`);
    }
  } catch (error) {
    showAlert('Error', `Failed to open URL: ${error.message}`);
  }
};

// Make phone call
export const makePhoneCall = async (phoneNumber) => {
  const url = `tel:${phoneNumber}`;
  await openURL(url);
};

// Send SMS
export const sendSMS = async (phoneNumber, message = '') => {
  const separator = Platform.OS === 'ios' ? '&' : '?';
  const url = `sms:${phoneNumber}${separator}body=${message}`;
  await openURL(url);
};

// Send Email
export const sendEmail = async (email, subject = '', body = '') => {
  const url = `mailto:${email}?subject=${subject}&body=${body}`;
  await openURL(url);
};

// Generate unique ID
export const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Delay function
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

// Sort array by key
export const sortBy = (array, key, order = 'asc') => {
  return array.sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    }
    return a[key] < b[key] ? 1 : -1;
  });
};

// Filter unique values
export const unique = (array, key = null) => {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

// Chunk array into smaller arrays
export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Calculate age from date of birth
export const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Check if date is past
export const isPast = (date) => {
  return new Date(date) < new Date();
};

// Check if date is future
export const isFuture = (date) => {
  return new Date(date) > new Date();
};

// Get error message from error object
export const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data.message || error.response.data.detail || 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unknown error occurred';
  }
};

// Retry function with exponential backoff
export const retry = async (fn, maxAttempts = 3, delayMs = 1000) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      await delay(delayMs * Math.pow(2, attempt - 1));
    }
  }
};