// ========================================
// NOTIFICATION BADGE COMPONENT
// Displays unread notification count
// ========================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge } from 'react-native-paper';
import * as notificationService from '../../services/notificationService';

const NotificationBadge = ({
  count,
  position = 'top-right',
  color = '#F44336',
  size = 18,
  textStyle = {},
  containerStyle = {},
}) => {
  if (!count || count === 0) {
    return null;
  }

  const displayCount = count > 99 ? '99+' : count.toString();

  const positionStyles = {
    'top-right': styles.topRight,
    'top-left': styles.topLeft,
    'bottom-right': styles.bottomRight,
    'bottom-left': styles.bottomLeft,
  };

  return (
    <View
      style={[
        styles.badge,
        positionStyles[position],
        { backgroundColor: color, width: size, height: size, borderRadius: size / 2 },
        containerStyle,
      ]}
    >
      <Text style={[styles.badgeText, { fontSize: size * 0.6 }, textStyle]}>
        {displayCount}
      </Text>
    </View>
  );
};

/**
 * Hook to fetch and track unread notification count
 */
export const useUnreadCount = (refreshInterval = 60000) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.unread_count);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // Refresh periodically
    const interval = setInterval(fetchUnreadCount, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { unreadCount, isLoading, refresh: fetchUnreadCount };
};

const styles = StyleSheet.create({
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  topRight: {
    top: 0,
    right: 0,
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
  },
});

export default NotificationBadge;