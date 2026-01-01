import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as storage from '../utils/storage';
import { subscribeToNetworkChanges } from '../utils/networkHelper';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [appSettings, setAppSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: true,
    darkMode: false,
    language: 'en',
  });

  // ============================================================
  // INITIALIZATION
  // ============================================================

  useEffect(() => {
    loadAppSettings();
    setupNetworkListener();
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

  // ============================================================
  // NETWORK STATUS MONITORING
  // ============================================================

  const setupNetworkListener = () => {
    const unsubscribe = subscribeToNetworkChanges((isConnected, state) => {
      const wasOffline = isOffline;
      
      setIsOnline(isConnected);
      setIsOffline(!isConnected);
      
      if (__DEV__) {
        console.log('📡 Network status changed:', {
          isConnected,
          type: state?.type,
          isInternetReachable: state?.isInternetReachable,
        });
      }
      
      // Show alert when going offline
      if (!isConnected && !wasOffline) {
        Alert.alert(
          'Offline',
          'No internet connection. Some features may be unavailable.',
          [{ text: 'OK' }]
        );
      }
      
      // Show alert when coming back online
      if (isConnected && wasOffline) {
        Alert.alert(
          'Back Online',
          'Internet connection restored.',
          [{ text: 'OK' }]
        );
      }
    });
    
    // Cleanup on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  };

  // ============================================================
  // APP SETTINGS
  // ============================================================

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

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

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

  // ============================================================
  // NETWORK STATUS SETTERS
  // ============================================================

  const setNetworkStatus = (status) => {
    setIsOnline(status);
    setIsOffline(!status);
  };

  // ============================================================
  // CONTEXT VALUE
  // ============================================================

  const value = {
    // Network status
    isOnline,
    isOffline,
    setNetworkStatus,
    
    // Notifications
    notifications,
    unreadCount,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    
    // App settings
    appSettings,
    updateAppSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};