import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Card, Badge, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await notificationService.getNotifications();
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNotifications = [
        {
          id: 1,
          type: 'approval_request',
          title: 'New Guardian Link Request',
          message: 'A new guardian link request has been created for John Doe',
          created_at: '2025-10-27T10:00:00Z',
          read: false,
          priority: 'high',
        },
        {
          id: 2,
          type: 'payment_request',
          title: 'Payment Request',
          message: 'New payment request for KES 5,000 - School fees',
          created_at: '2025-10-26T14:30:00Z',
          read: false,
          priority: 'medium',
        },
        {
          id: 3,
          type: 'approval_approved',
          title: 'Request Approved',
          message: 'Your guardian link request has been approved',
          created_at: '2025-10-25T09:15:00Z',
          read: true,
          priority: 'low',
        },
        {
          id: 4,
          type: 'payment_received',
          title: 'Payment Confirmed',
          message: 'Payment of KES 3,500 has been received',
          created_at: '2025-10-24T16:45:00Z',
          read: true,
          priority: 'low',
        },
      ];
      
      setNotifications(mockNotifications);
    } catch (err) {
      setError('Failed to load notifications. Please try again.');
      console.error('Fetch notifications error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      // TODO: Replace with actual API call
      // await notificationService.markAsRead(notificationId);
      
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // TODO: Replace with actual API call
      // await notificationService.deleteNotification(notificationId);
      
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Delete notification error:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'approval_request':
        return 'clipboard-check';
      case 'payment_request':
        return 'cash-clock';
      case 'approval_approved':
        return 'check-circle';
      case 'payment_received':
        return 'cash-check';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'approval_request':
        return '#FF9800';
      case 'payment_request':
        return '#2196F3';
      case 'approval_approved':
        return '#4CAF50';
      case 'payment_received':
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#F44336';
      case 'medium':
        return '#FF9800';
      case 'low':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  };

  const handleNotificationPress = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // TODO: Navigate to relevant screen based on notification type
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <Card style={[styles.notificationCard, !item.read && styles.unreadCard]}>
        <Card.Content style={styles.cardContent}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: getNotificationColor(item.type) + '20' },
            ]}
          >
            <MaterialCommunityIcons
              name={getNotificationIcon(item.type)}
              size={24}
              color={getNotificationColor(item.type)}
            />
          </View>
          
          <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.notificationTitle} numberOfLines={1}>
                {item.title}
              </Text>
              {!item.read && (
                <Badge size={8} style={styles.unreadBadge} />
              )}
            </View>
            
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {item.message}
            </Text>
            
            <View style={styles.footerRow}>
              <Text style={styles.timestamp}>
                {formatDate(item.created_at)}
              </Text>
              {item.priority === 'high' && (
                <Badge
                  size={18}
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityBadgeColor(item.priority) },
                  ]}
                >
                  !
                </Badge>
              )}
            </View>
          </View>
          
          <IconButton
            icon="delete"
            size={20}
            iconColor="#757575"
            onPress={() => deleteNotification(item.id)}
          />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchNotifications} /> : null}

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="bell-off"
          title="No Notifications"
          message="You're all caught up! No new notifications."
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    padding: 16,
  },
  notificationCard: {
    marginBottom: 12,
    elevation: 1,
    backgroundColor: '#FFFFFF',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#6200EE',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#212121',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#6200EE',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 6,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timestamp: {
    fontSize: 11,
    color: '#9E9E9E',
  },
  priorityBadge: {
    marginLeft: 8,
  },
});

export default NotificationsScreen;