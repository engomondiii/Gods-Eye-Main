// ========================================
// NOTIFICATIONS SCREEN - SHARED
// Backend Integration: GET /api/notifications/my_notifications/
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Card,
  Badge,
  IconButton,
  Button,
  Menu,
  Chip,
  Text,
  Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import * as notificationService from '../../services/notificationService';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { SCREENS } from '../../utils/constants';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedReadStatus, setSelectedReadStatus] = useState(null);

  // Fetch notifications
  const fetchNotifications = async (page = 1, append = false) => {
    try {
      setError('');
      
      if (page === 1 && !append) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const params = {
        page,
        page_size: 20,
      };

      if (selectedType) {
        params.notification_type = selectedType;
      }

      if (selectedReadStatus !== null) {
        params.is_read = selectedReadStatus;
      }

      const response = await notificationService.getMyNotifications(params);

      if (response.success) {
        const { results, count, next } = response.data;

        if (append) {
          setNotifications((prev) => [...prev, ...results]);
        } else {
          setNotifications(results);
        }

        setTotalCount(count);
        setHasMore(!!next);
        setCurrentPage(page);
      } else {
        throw new Error(response.message || 'Failed to load notifications');
      }
    } catch (err) {
      setError('Failed to load notifications. Please try again.');
      console.error('Fetch notifications error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [selectedType, selectedReadStatus]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchNotifications(1, false);
  }, [selectedType, selectedReadStatus]);

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchNotifications(currentPage + 1, true);
    }
  };

  // Mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await notificationService.markAsRead(notificationId);

      if (response.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId
              ? { ...n, is_read: true, read_at: new Date().toISOString() }
              : n
          )
        );
      }
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();

      if (response.success) {
        Alert.alert('Success', response.message);
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            is_read: true,
            read_at: new Date().toISOString(),
          }))
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to mark all as read');
      }
    } catch (error) {
      console.error('Mark all as read error:', error);
      Alert.alert('Error', 'Failed to mark all as read');
    }
  };

  // Delete notification
  const handleDelete = async (notificationId) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await notificationService.deleteNotification(
                notificationId
              );

              if (response.success) {
                setNotifications((prev) =>
                  prev.filter((n) => n.id !== notificationId)
                );
                setTotalCount((prev) => prev - 1);
              } else {
                Alert.alert('Error', response.message || 'Failed to delete');
              }
            } catch (error) {
              console.error('Delete notification error:', error);
              Alert.alert('Error', 'Failed to delete notification');
            }
          },
        },
      ]
    );
  };

  // Handle notification press - navigate to related screen
  const handleNotificationPress = (notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.payment_request) {
      navigation.navigate(SCREENS.PAYMENT_REQUESTS);
    } else if (notification.attendance_record) {
      navigation.navigate(SCREENS.ATTENDANCE_HISTORY);
    } else if (notification.student) {
      navigation.navigate(SCREENS.STUDENT_DETAIL, {
        studentId: notification.student,
      });
    }
  };

  // Apply filter
  const applyTypeFilter = (type) => {
    setSelectedType(type);
    setFilterMenuVisible(false);
  };

  const applyReadStatusFilter = (status) => {
    setSelectedReadStatus(status);
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedType(null);
    setSelectedReadStatus(null);
  };

  const renderNotification = ({ item }) => {
    const icon = notificationService.getNotificationIcon(item.notification_type);
    const color = notificationService.getNotificationColor(
      item.notification_type
    );

    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <Card
          style={[styles.notificationCard, !item.is_read && styles.unreadCard]}
        >
          <Card.Content style={styles.cardContent}>
            {/* Icon */}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: color + '20' },
              ]}
            >
              <MaterialCommunityIcons name={icon} size={24} color={color} />
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.notificationTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                {!item.is_read && <Badge size={8} style={styles.unreadBadge} />}
              </View>

              <Text style={styles.notificationMessage} numberOfLines={2}>
                {item.message}
              </Text>

              {/* Student name if available */}
              {item.student_name && (
                <Text style={styles.studentName}>
                  <MaterialCommunityIcons name="account" size={12} />  {item.student_name}
                </Text>
              )}

              <View style={styles.footerRow}>
                <Text style={styles.timestamp}>
                  {formatRelativeTime(item.created_at)}
                </Text>
                <Text style={styles.notificationType}>
                  {notificationService.getNotificationEmoji(
                    item.notification_type
                  )}{' '}
                  {item.notification_type_display}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderHiddenItem = ({ item }) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => handleMarkAsRead(item.id)}
      >
        <MaterialCommunityIcons name="check" size={24} color="#FFFFFF" />
        <Text style={styles.backTextWhite}>Read</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => handleDelete(item.id)}
      >
        <MaterialCommunityIcons name="delete" size={24} color="#FFFFFF" />
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {totalCount} notification{totalCount !== 1 ? 's' : ''}
        </Text>
        {notifications.filter((n) => !n.is_read).length > 0 && (
          <Text style={styles.unreadText}>
            {notifications.filter((n) => !n.is_read).length} unread
          </Text>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        {/* Mark All as Read */}
        {notifications.some((n) => !n.is_read) && (
          <Button
            mode="outlined"
            compact
            onPress={handleMarkAllAsRead}
            style={styles.markAllButton}
            icon="check-all"
          >
            Mark All Read
          </Button>
        )}

        {/* Filter Menu */}
        <Menu
          visible={filterMenuVisible}
          onDismiss={() => setFilterMenuVisible(false)}
          anchor={
            <IconButton
              icon="filter"
              size={24}
              onPress={() => setFilterMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => applyTypeFilter(null)}
            title="All Types"
            leadingIcon={!selectedType ? 'check' : undefined}
          />
          <Divider />
          <Menu.Item
            onPress={() => applyTypeFilter('attendance')}
            title="📅 Attendance"
            leadingIcon={selectedType === 'attendance' ? 'check' : undefined}
          />
          <Menu.Item
            onPress={() => applyTypeFilter('payment')}
            title="💰 Payment"
            leadingIcon={selectedType === 'payment' ? 'check' : undefined}
          />
          <Menu.Item
            onPress={() => applyTypeFilter('academic')}
            title="🎓 Academic"
            leadingIcon={selectedType === 'academic' ? 'check' : undefined}
          />
          <Menu.Item
            onPress={() => applyTypeFilter('general')}
            title="📢 General"
            leadingIcon={selectedType === 'general' ? 'check' : undefined}
          />
          <Menu.Item
            onPress={() => applyTypeFilter('emergency')}
            title="🚨 Emergency"
            leadingIcon={selectedType === 'emergency' ? 'check' : undefined}
          />
        </Menu>
      </View>

      {/* Filter Chips */}
      <View style={styles.filtersRow}>
        <Chip
          selected={selectedReadStatus === false}
          onPress={() =>
            applyReadStatusFilter(selectedReadStatus === false ? null : false)
          }
          style={styles.filterChip}
        >
          Unread
        </Chip>
        <Chip
          selected={selectedReadStatus === true}
          onPress={() =>
            applyReadStatusFilter(selectedReadStatus === true ? null : true)
          }
          style={styles.filterChip}
        >
          Read
        </Chip>
        {(selectedType || selectedReadStatus !== null) && (
          <Chip
            onPress={clearFilters}
            icon="close"
            style={styles.filterChip}
          >
            Clear Filters
          </Chip>
        )}
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footer}>
        <LoadingSpinner size="small" />
      </View>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Error Message */}
      {error ? (
        <ErrorMessage message={error} onRetry={() => fetchNotifications()} />
      ) : null}

      {/* Header */}
      {renderHeader()}

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <SwipeListView
          data={notifications}
          renderItem={renderNotification}
          renderHiddenItem={renderHiddenItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          rightOpenValue={-150}
          disableRightSwipe
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="bell-off"
          title="No Notifications"
          message={
            selectedType || selectedReadStatus !== null
              ? 'No notifications match your filters'
              : "You're all caught up! No new notifications."
          }
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
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#757575',
    marginRight: 12,
  },
  unreadText: {
    fontSize: 13,
    color: '#6200EE',
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  markAllButton: {
    flex: 1,
    marginRight: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 4,
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
    alignItems: 'flex-start',
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
  studentName: {
    fontSize: 12,
    color: '#2196F3',
    marginBottom: 4,
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
  notificationType: {
    fontSize: 11,
    color: '#757575',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15,
    marginBottom: 12,
    borderRadius: 8,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: '#4CAF50',
    right: 75,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  backRightBtnRight: {
    backgroundColor: '#F44336',
    right: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  backTextWhite: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default NotificationsScreen;