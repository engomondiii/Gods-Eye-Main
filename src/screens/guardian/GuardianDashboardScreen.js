import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Card, Title, Paragraph, Avatar, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { SCREENS } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const GuardianDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    pendingApprovals: 0,
    pendingPayments: 0,
    recentActivities: [],
    // ✨ NEW - Attendance Data
    attendanceSummary: {
      todayPresent: 0,
      todayTotal: 0,
      weeklyAverage: 0,
    },
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setError('');
      // TODO: Replace with actual API calls
      // const response = await guardianService.getDashboardStats();
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardData({
        totalStudents: 2,
        pendingApprovals: 1,
        pendingPayments: 3,
        // ✨ NEW - Attendance Data
        attendanceSummary: {
          todayPresent: 2,
          todayTotal: 2,
          weeklyAverage: 95,
        },
        recentActivities: [
          // ✨ NEW - Attendance Activities
          {
            id: 0,
            type: 'attendance_checkin',
            message: 'John Doe checked in at 07:45 AM',
            time: '30 minutes ago',
          },
          {
            id: 1,
            type: 'approval_request',
            message: 'New guardian link request for John Doe',
            time: '2 hours ago',
          },
          {
            id: 2,
            type: 'payment_request',
            message: 'Payment request for Sarah Smith - KES 5,000',
            time: '1 day ago',
          },
          {
            id: 3,
            type: 'payment_paid',
            message: 'Payment confirmed for John Doe',
            time: '2 days ago',
          },
        ],
      });
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchDashboardData();
  }, []);

  // Quick action cards
  const quickActions = [
    {
      id: 1,
      title: 'My Students',
      icon: 'account-multiple',
      color: '#2196F3',
      onPress: () => navigation.navigate('StudentsTab', {
        screen: SCREENS.MY_STUDENTS,
      }),
    },
    {
      id: 2,
      title: 'Approvals',
      icon: 'clipboard-check',
      color: '#FF9800',
      onPress: () => navigation.navigate('ApprovalsTab', {
        screen: SCREENS.PENDING_APPROVALS,
      }),
      badge: dashboardData.pendingApprovals,
    },
    {
      id: 3,
      title: 'Payments',
      icon: 'cash',
      color: '#4CAF50',
      onPress: () => navigation.navigate('PaymentsTab', {
        screen: SCREENS.PAYMENT_REQUESTS,
      }),
      badge: dashboardData.pendingPayments,
    },
    {
      id: 4,
      title: 'Notifications',
      icon: 'bell',
      color: '#9C27B0',
      onPress: () => navigation.navigate(SCREENS.NOTIFICATIONS),
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      // ✨ NEW - Attendance Icons
      case 'attendance_checkin':
        return 'login';
      case 'attendance_checkout':
        return 'logout';
      case 'attendance_late':
        return 'clock-alert';
      case 'approval_request':
        return 'clipboard-check';
      case 'payment_request':
        return 'cash-clock';
      case 'payment_paid':
        return 'check-circle';
      default:
        return 'information';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      // ✨ NEW - Attendance Colors
      case 'attendance_checkin':
        return '#4CAF50';
      case 'attendance_checkout':
        return '#2196F3';
      case 'attendance_late':
        return '#FF9800';
      case 'approval_request':
        return '#FF9800';
      case 'payment_request':
        return '#2196F3';
      case 'payment_paid':
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.guardianName}>
            {user?.first_name || 'Guardian'}!
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(SCREENS.NOTIFICATIONS)}
        >
          <MaterialCommunityIcons name="bell" size={28} color="#6200EE" />
          {(dashboardData.pendingApprovals > 0 || dashboardData.pendingPayments > 0) && (
            <Badge style={styles.notificationBadge}>
              {dashboardData.pendingApprovals + dashboardData.pendingPayments}
            </Badge>
          )}
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchDashboardData} /> : null}

      {/* ✨ NEW - Today's Attendance Summary */}
      <Card style={styles.attendanceCard}>
        <Card.Content>
          <View style={styles.attendanceHeader}>
            <Title style={styles.attendanceTitle}>Today's Attendance</Title>
            <TouchableOpacity
              onPress={() => navigation.navigate('StudentsTab', {
                screen: SCREENS.ATTENDANCE_HISTORY,
              })}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.attendanceStatsRow}>
            <View style={styles.attendanceStat}>
              <Text style={styles.attendanceNumber}>
                {dashboardData.attendanceSummary.todayPresent}/{dashboardData.attendanceSummary.todayTotal}
              </Text>
              <Text style={styles.attendanceLabel}>Present Today</Text>
            </View>
            
            <View style={styles.attendanceStatDivider} />
            
            <View style={styles.attendanceStat}>
              <Text style={[styles.attendanceNumber, { color: '#4CAF50' }]}>
                {dashboardData.attendanceSummary.weeklyAverage}%
              </Text>
              <Text style={styles.attendanceLabel}>Weekly Average</Text>
            </View>
          </View>

          <View style={styles.attendanceIndicator}>
            <MaterialCommunityIcons
              name={
                dashboardData.attendanceSummary.todayPresent === dashboardData.attendanceSummary.todayTotal
                  ? 'check-circle'
                  : 'alert-circle'
              }
              size={20}
              color={
                dashboardData.attendanceSummary.todayPresent === dashboardData.attendanceSummary.todayTotal
                  ? '#4CAF50'
                  : '#FF9800'
              }
            />
            <Text style={styles.attendanceIndicatorText}>
              {dashboardData.attendanceSummary.todayPresent === dashboardData.attendanceSummary.todayTotal
                ? 'All students checked in'
                : `${dashboardData.attendanceSummary.todayTotal - dashboardData.attendanceSummary.todayPresent} student(s) not checked in`}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <Card style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
          <Card.Content style={styles.statCardContent}>
            <MaterialCommunityIcons
              name="account-multiple"
              size={32}
              color="#2196F3"
            />
            <View style={styles.statTextContainer}>
              <Title style={styles.statNumber}>{dashboardData.totalStudents}</Title>
              <Paragraph style={styles.statLabel}>My Students</Paragraph>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
          <Card.Content style={styles.statCardContent}>
            <MaterialCommunityIcons
              name="clipboard-check"
              size={32}
              color="#FF9800"
            />
            <View style={styles.statTextContainer}>
              <Title style={styles.statNumber}>
                {dashboardData.pendingApprovals}
              </Title>
              <Paragraph style={styles.statLabel}>Pending Approvals</Paragraph>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
          <Card.Content style={styles.statCardContent}>
            <MaterialCommunityIcons name="cash" size={32} color="#4CAF50" />
            <View style={styles.statTextContainer}>
              <Title style={styles.statNumber}>
                {dashboardData.pendingPayments}
              </Title>
              <Paragraph style={styles.statLabel}>Payment Requests</Paragraph>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              onPress={action.onPress}
            >
              <View
                style={[
                  styles.quickActionIconContainer,
                  { backgroundColor: action.color + '20' },
                ]}
              >
                <MaterialCommunityIcons
                  name={action.icon}
                  size={28}
                  color={action.color}
                />
                {action.badge > 0 && (
                  <Badge style={styles.actionBadge}>{action.badge}</Badge>
                )}
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activities */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {dashboardData.recentActivities.length > 0 ? (
          dashboardData.recentActivities.map((activity) => (
            <Card key={activity.id} style={styles.activityCard}>
              <Card.Content style={styles.activityCardContent}>
                <View
                  style={[
                    styles.activityIconContainer,
                    { backgroundColor: getActivityColor(activity.type) + '20' },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={getActivityIcon(activity.type)}
                    size={24}
                    color={getActivityColor(activity.type)}
                  />
                </View>
                <View style={styles.activityTextContainer}>
                  <Text style={styles.activityMessage}>{activity.message}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text style={styles.noDataText}>No recent activities</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 16,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#757575',
  },
  guardianName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
  },
  // ✨ NEW - Attendance Card Styles
  attendanceCard: {
    marginBottom: 16,
    elevation: 3,
    backgroundColor: '#FFFFFF',
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  attendanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  viewAllText: {
    fontSize: 14,
    color: '#6200EE',
    fontWeight: '600',
  },
  attendanceStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  attendanceStat: {
    alignItems: 'center',
    flex: 1,
  },
  attendanceStatDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  attendanceNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  attendanceLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  attendanceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  attendanceIndicatorText: {
    fontSize: 14,
    color: '#212121',
    marginLeft: 8,
    flex: 1,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statCard: {
    marginBottom: 12,
    elevation: 2,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statTextContainer: {
    marginLeft: 16,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
    marginTop: 0,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },
  quickActionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  actionBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
  },
  activityCard: {
    marginBottom: 12,
    elevation: 1,
  },
  activityCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  activityMessage: {
    fontSize: 14,
    color: '#212121',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#757575',
  },
  noDataText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default GuardianDashboardScreen;