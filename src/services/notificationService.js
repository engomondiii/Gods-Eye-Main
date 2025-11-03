import api from './api';

export const getNotifications = async () => {
  try {
    const response = await api.get('/notifications/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUnreadNotifications = async () => {
  try {
    const response = await api.get('/notifications/unread/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAsRead = async (notificationId) => {
  try {
    const response = await api.post(`/notifications/${notificationId}/read/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAllAsRead = async () => {
  try {
    const response = await api.post('/notifications/mark-all-read/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNotificationSettings = async () => {
  try {
    const response = await api.get('/notifications/settings/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateNotificationSettings = async (settings) => {
  try {
    const response = await api.patch('/notifications/settings/', settings);
    return response.data;
  } catch (error) {
    throw error;
  }
};