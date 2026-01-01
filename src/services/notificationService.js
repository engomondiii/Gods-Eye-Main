// ========================================
// GOD'S EYE EDTECH - NOTIFICATION SERVICE
// Backend Integration: /api/notifications/
// ========================================

import { handleApiError } from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Get current user's notifications with pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Response with notifications
 */
export const getMyNotifications = async (params = {}) => {
  try {
    const {
      page = 1,
      page_size = 20,
      notification_type = null,
      is_read = null,
    } = params;

    if (__DEV__) {
      console.log('📬 Fetching notifications...', { page, page_size });
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    });

    if (notification_type) {
      queryParams.append('notification_type', notification_type);
    }

    if (is_read !== null) {
      queryParams.append('is_read', is_read.toString());
    }

    const response = await fetch(
      `${API_ENDPOINTS.NOTIFICATIONS.MY_NOTIFICATIONS}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Authorization header will be added by API client
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch notifications');
    }

    if (__DEV__) {
      console.log('✅ Notifications fetched:', data.count);
    }

    return {
      success: true,
      data: {
        count: data.count,
        next: data.next,
        previous: data.previous,
        results: data.results,
      },
    };
  } catch (error) {
    console.error('❌ Get notifications error:', error);
    return handleApiError(error);
  }
};

/**
 * Get unread notification count
 * @returns {Promise<Object>} Response with unread count
 */
export const getUnreadCount = async () => {
  try {
    if (__DEV__) {
      console.log('🔔 Fetching unread count...');
    }

    const response = await fetch(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch unread count');
    }

    if (__DEV__) {
      console.log('✅ Unread count:', data.unread_count);
    }

    return {
      success: true,
      data: {
        unread_count: data.unread_count,
      },
    };
  } catch (error) {
    console.error('❌ Get unread count error:', error);
    return handleApiError(error);
  }
};

/**
 * Mark single notification as read
 * @param {number} notificationId - Notification ID
 * @returns {Promise<Object>} Response
 */
export const markAsRead = async (notificationId) => {
  try {
    if (__DEV__) {
      console.log('📖 Marking notification as read:', notificationId);
    }

    const response = await fetch(
      API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to mark as read');
    }

    if (__DEV__) {
      console.log('✅ Notification marked as read');
    }

    return {
      success: true,
      data: data.notification,
      message: data.message,
    };
  } catch (error) {
    console.error('❌ Mark as read error:', error);
    return handleApiError(error);
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Response with count
 */
export const markAllAsRead = async () => {
  try {
    if (__DEV__) {
      console.log('📚 Marking all notifications as read...');
    }

    const response = await fetch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to mark all as read');
    }

    if (__DEV__) {
      console.log('✅ All notifications marked as read:', data.count);
    }

    return {
      success: true,
      data: {
        count: data.count,
      },
      message: data.message,
    };
  } catch (error) {
    console.error('❌ Mark all as read error:', error);
    return handleApiError(error);
  }
};

/**
 * Delete notification
 * @param {number} notificationId - Notification ID
 * @returns {Promise<Object>} Response
 */
export const deleteNotification = async (notificationId) => {
  try {
    if (__DEV__) {
      console.log('🗑️ Deleting notification:', notificationId);
    }

    const response = await fetch(
      API_ENDPOINTS.NOTIFICATIONS.DETAIL(notificationId),
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete notification');
    }

    if (__DEV__) {
      console.log('✅ Notification deleted');
    }

    return {
      success: true,
      message: 'Notification deleted successfully',
    };
  } catch (error) {
    console.error('❌ Delete notification error:', error);
    return handleApiError(error);
  }
};

/**
 * Get user's notification preferences
 * @returns {Promise<Object>} Response with preferences
 */
export const getMyPreferences = async () => {
  try {
    if (__DEV__) {
      console.log('⚙️ Fetching notification preferences...');
    }

    const response = await fetch(
      API_ENDPOINTS.NOTIFICATIONS.PREFERENCES.MY_PREFERENCES,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch preferences');
    }

    if (__DEV__) {
      console.log('✅ Preferences fetched');
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get preferences error:', error);
    return handleApiError(error);
  }
};

/**
 * Update notification preferences
 * @param {Object} preferences - Preference settings
 * @returns {Promise<Object>} Response with updated preferences
 */
export const updatePreferences = async (preferences) => {
  try {
    if (__DEV__) {
      console.log('⚙️ Updating notification preferences...', preferences);
    }

    const response = await fetch(
      API_ENDPOINTS.NOTIFICATIONS.PREFERENCES.UPDATE,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update preferences');
    }

    if (__DEV__) {
      console.log('✅ Preferences updated');
    }

    return {
      success: true,
      data: data.preferences,
      message: data.message,
    };
  } catch (error) {
    console.error('❌ Update preferences error:', error);
    return handleApiError(error);
  }
};

/**
 * Send custom notification (admin only)
 * @param {Object} notificationData - Notification data
 * @returns {Promise<Object>} Response
 */
export const sendNotification = async (notificationData) => {
  try {
    if (__DEV__) {
      console.log('📤 Sending custom notification...', notificationData);
    }

    const response = await fetch(
      API_ENDPOINTS.NOTIFICATIONS.SEND_NOTIFICATION,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send notification');
    }

    if (__DEV__) {
      console.log('✅ Notification sent:', data.count);
    }

    return {
      success: true,
      data: {
        count: data.count,
        notifications: data.notifications,
      },
      message: data.message,
    };
  } catch (error) {
    console.error('❌ Send notification error:', error);
    return handleApiError(error);
  }
};

/**
 * Get notification type icon
 * @param {string} type - Notification type
 * @returns {string} Icon name
 */
export const getNotificationIcon = (type) => {
  const icons = {
    attendance: 'calendar-check',
    payment: 'cash',
    general: 'bell',
    academic: 'school',
    emergency: 'alert',
    approval_request: 'clipboard-check',
    approval_approved: 'check-circle',
    approval_rejected: 'close-circle',
    payment_request: 'cash-clock',
    payment_received: 'cash-check',
    payment_reminder: 'cash-alert',
    payment_overdue: 'cash-remove',
    attendance_checkin: 'login',
    attendance_checkout: 'logout',
    attendance_late: 'clock-alert',
    attendance_absent: 'account-remove',
  };

  return icons[type] || 'bell';
};

/**
 * Get notification type color
 * @param {string} type - Notification type
 * @returns {string} Color hex code
 */
export const getNotificationColor = (type) => {
  const colors = {
    attendance: '#2196F3',
    payment: '#4CAF50',
    general: '#757575',
    academic: '#FF9800',
    emergency: '#F44336',
    approval_request: '#FF9800',
    approval_approved: '#4CAF50',
    approval_rejected: '#F44336',
    payment_request: '#2196F3',
    payment_received: '#4CAF50',
    payment_reminder: '#FF9800',
    payment_overdue: '#F44336',
    attendance_checkin: '#4CAF50',
    attendance_checkout: '#2196F3',
    attendance_late: '#FF9800',
    attendance_absent: '#F44336',
  };

  return colors[type] || '#757575';
};

/**
 * Get notification display emoji
 * @param {string} type - Notification type
 * @returns {string} Emoji
 */
export const getNotificationEmoji = (type) => {
  const emojis = {
    attendance: '📅',
    payment: '💰',
    general: '📢',
    academic: '🎓',
    emergency: '🚨',
  };

  return emojis[type] || '📬';
};

export default {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getMyPreferences,
  updatePreferences,
  sendNotification,
  getNotificationIcon,
  getNotificationColor,
  getNotificationEmoji,
};