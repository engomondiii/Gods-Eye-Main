// ========================================
// PUSH NOTIFICATION SERVICE (OPTIONAL)
// Expo Push Notifications Integration
// ========================================

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import { API_BASE_URL } from '../utils/constants';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Check if push notifications are supported
 * @returns {Promise<boolean>} True if supported
 */
export const isSupported = async () => {
  if (!Device.isDevice) {
    console.warn('Push notifications only work on physical devices');
    return false;
  }

  return true;
};

/**
 * Request push notification permissions
 * @returns {Promise<Object>} Permission status
 */
export const requestPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return {
        success: false,
        message: 'Permission to receive push notifications was denied',
      };
    }

    if (__DEV__) {
      console.log('✅ Push notification permissions granted');
    }

    return {
      success: true,
      status: finalStatus,
    };
  } catch (error) {
    console.error('❌ Error requesting push permissions:', error);
    return {
      success: false,
      message: error.message || 'Failed to request permissions',
    };
  }
};

/**
 * Get Expo push token
 * @returns {Promise<Object>} Push token result
 */
export const getPushToken = async () => {
  try {
    if (!Device.isDevice) {
      return {
        success: false,
        message: 'Must use physical device for push notifications',
      };
    }

    // Request permissions first
    const permissionResult = await requestPermissions();
    if (!permissionResult.success) {
      return permissionResult;
    }

    // Get the token
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // TODO: Replace with your Expo project ID
    });

    if (__DEV__) {
      console.log('✅ Expo Push Token:', token.data);
    }

    return {
      success: true,
      token: token.data,
    };
  } catch (error) {
    console.error('❌ Error getting push token:', error);
    return {
      success: false,
      message: error.message || 'Failed to get push token',
    };
  }
};

/**
 * Register device token with backend
 * @param {string} token - Expo push token
 * @returns {Promise<Object>} Registration result
 */
export const registerDeviceToken = async (token) => {
  try {
    if (__DEV__) {
      console.log('📤 Registering device token with backend...');
    }

    const deviceType = Platform.OS === 'ios' ? 'ios' : 'android';

    const response = await fetch(`${API_BASE_URL}/notifications/register_device/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization header will be added by API client
      },
      body: JSON.stringify({
        device_token: token,
        device_type: deviceType,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to register device token');
    }

    if (__DEV__) {
      console.log('✅ Device token registered successfully');
    }

    return {
      success: true,
      message: 'Device registered for push notifications',
    };
  } catch (error) {
    console.error('❌ Error registering device token:', error);
    return {
      success: false,
      message: error.message || 'Failed to register device',
    };
  }
};

/**
 * Register for push notifications (complete flow)
 * @returns {Promise<Object>} Registration result
 */
export const registerForPushNotifications = async () => {
  try {
    // Check if supported
    const supported = await isSupported();
    if (!supported) {
      return {
        success: false,
        message: 'Push notifications not supported on this device',
      };
    }

    // Get push token
    const tokenResult = await getPushToken();
    if (!tokenResult.success) {
      return tokenResult;
    }

    // Register with backend
    const registerResult = await registerDeviceToken(tokenResult.token);
    
    return registerResult;
  } catch (error) {
    console.error('❌ Error in push notification registration:', error);
    return {
      success: false,
      message: error.message || 'Failed to register for push notifications',
    };
  }
};

/**
 * Add listener for notification received (app in foreground)
 * @param {Function} handler - Callback function
 * @returns {Object} Subscription object
 */
export const addNotificationReceivedListener = (handler) => {
  return Notifications.addNotificationReceivedListener((notification) => {
    if (__DEV__) {
      console.log('🔔 Notification received:', notification);
    }
    
    if (handler) {
      handler(notification);
    }
  });
};

/**
 * Add listener for notification response (user tapped notification)
 * @param {Function} handler - Callback function
 * @returns {Object} Subscription object
 */
export const addNotificationResponseListener = (handler) => {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    if (__DEV__) {
      console.log('👆 Notification tapped:', response);
    }

    // Extract notification data
    const notification = response.notification;
    const data = notification.request.content.data;

    if (handler) {
      handler(notification, data);
    }
  });
};

/**
 * Handle notification when app is opened from notification tap
 * @param {Object} navigation - Navigation object
 * @param {Object} notification - Notification object
 * @param {Object} data - Notification data
 */
export const handleNotificationTap = (navigation, notification, data) => {
  try {
    if (__DEV__) {
      console.log('🎯 Handling notification tap with data:', data);
    }

    // Navigate based on notification type
    if (data.type === 'payment' && data.payment_request_id) {
      navigation.navigate('PaymentRequests');
    } else if (data.type === 'attendance' && data.attendance_id) {
      navigation.navigate('AttendanceHistory');
    } else if (data.type === 'student' && data.student_id) {
      navigation.navigate('StudentDetail', { studentId: data.student_id });
    } else {
      // Default to notifications screen
      navigation.navigate('Notifications');
    }
  } catch (error) {
    console.error('❌ Error handling notification tap:', error);
  }
};

/**
 * Schedule a local notification (for testing)
 * @param {Object} options - Notification options
 * @returns {Promise<string>} Notification ID
 */
export const scheduleLocalNotification = async (options) => {
  try {
    const { title, body, data, seconds = 1 } = options;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: title || 'Test Notification',
        body: body || 'This is a test notification',
        data: data || {},
        sound: true,
      },
      trigger: {
        seconds: seconds,
      },
    });

    if (__DEV__) {
      console.log('✅ Local notification scheduled:', notificationId);
    }

    return notificationId;
  } catch (error) {
    console.error('❌ Error scheduling local notification:', error);
    throw error;
  }
};

/**
 * Cancel a scheduled notification
 * @param {string} notificationId - Notification ID to cancel
 */
export const cancelNotification = async (notificationId) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    
    if (__DEV__) {
      console.log('✅ Notification canceled:', notificationId);
    }
  } catch (error) {
    console.error('❌ Error canceling notification:', error);
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    if (__DEV__) {
      console.log('✅ All notifications canceled');
    }
  } catch (error) {
    console.error('❌ Error canceling all notifications:', error);
  }
};

/**
 * Get notification badge count
 * @returns {Promise<number>} Badge count
 */
export const getBadgeCount = async () => {
  try {
    const count = await Notifications.getBadgeCountAsync();
    return count;
  } catch (error) {
    console.error('❌ Error getting badge count:', error);
    return 0;
  }
};

/**
 * Set notification badge count
 * @param {number} count - Badge count
 */
export const setBadgeCount = async (count) => {
  try {
    await Notifications.setBadgeCountAsync(count);
    
    if (__DEV__) {
      console.log('✅ Badge count set to:', count);
    }
  } catch (error) {
    console.error('❌ Error setting badge count:', error);
  }
};

/**
 * Clear notification badge
 */
export const clearBadge = async () => {
  try {
    await Notifications.setBadgeCountAsync(0);
    
    if (__DEV__) {
      console.log('✅ Badge cleared');
    }
  } catch (error) {
    console.error('❌ Error clearing badge:', error);
  }
};

/**
 * Get all delivered notifications
 * @returns {Promise<Array>} Array of delivered notifications
 */
export const getDeliveredNotifications = async () => {
  try {
    const notifications = await Notifications.getPresentedNotificationsAsync();
    return notifications;
  } catch (error) {
    console.error('❌ Error getting delivered notifications:', error);
    return [];
  }
};

/**
 * Dismiss a delivered notification
 * @param {string} notificationId - Notification ID to dismiss
 */
export const dismissNotification = async (notificationId) => {
  try {
    await Notifications.dismissNotificationAsync(notificationId);
    
    if (__DEV__) {
      console.log('✅ Notification dismissed:', notificationId);
    }
  } catch (error) {
    console.error('❌ Error dismissing notification:', error);
  }
};

/**
 * Dismiss all delivered notifications
 */
export const dismissAllNotifications = async () => {
  try {
    await Notifications.dismissAllNotificationsAsync();
    
    if (__DEV__) {
      console.log('✅ All notifications dismissed');
    }
  } catch (error) {
    console.error('❌ Error dismissing all notifications:', error);
  }
};

export default {
  isSupported,
  requestPermissions,
  getPushToken,
  registerDeviceToken,
  registerForPushNotifications,
  addNotificationReceivedListener,
  addNotificationResponseListener,
  handleNotificationTap,
  scheduleLocalNotification,
  cancelNotification,
  cancelAllNotifications,
  getBadgeCount,
  setBadgeCount,
  clearBadge,
  getDeliveredNotifications,
  dismissNotification,
  dismissAllNotifications,
};