import React, { createContext, useState, useEffect } from 'react';
import * as storage from '../utils/storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [appSettings, setAppSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: true,
    darkMode: false,
    language: 'en',
  });

  useEffect(() => {
    loadAppSettings();
  }, []);

  const loadAppSettings = async () => {
    try {
      const settings = await storage.getAppSettings();
      if (settings) {
        setAppSettings(settings);
      }
    } catch (error) {
      console.error('Load app settings error:', error);
    }
  };

  const updateAppSettings = async (newSettings) => {
    try {
      const updatedSettings = { ...appSettings, ...newSettings };
      await storage.setAppSettings(updatedSettings);
      setAppSettings(updatedSettings);
      return { success: true };
    } catch (error) {
      console.error('Update app settings error:', error);
      return { success: false, error: error.message };
    }
  };

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount((prev) => prev + 1);
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }
      return prev.filter((n) => n.id !== notificationId);
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const setNetworkStatus = (status) => {
    setIsOnline(status);
  };

  const value = {
    notifications,
    unreadCount,
    isOnline,
    appSettings,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    setNetworkStatus,
    updateAppSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};