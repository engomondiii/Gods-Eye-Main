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

const TeacherDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    pendingApprovals: 0,
    pendingPayments: 0,
    recentActivities: [],
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setError('');
      // TODO: Replace with actual API calls
      // const response = await studentService.getDashboardStats();
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardData({
        totalStudents: 45,
        pendingApprovals: 3,
        pendingPayments: 7,
        recentActivities: [
          {
            id: 1,
            type: 'student_added',
            message: 'New student John Doe registered',
            time: '2 hours ago',
          },
          {
            id: 2,
            type: 'approval_pending',
            message: 'Guardian link request pending approval',
            time: '5 hours ago',
          },
          {
            id: 3,
            type: 'payment_created',
            message: 'Payment request created for Jane Smith',
            time: '1 day ago',
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

  // Quick action cards - FIXED NAVIGATION
  const quickActions = [
    {
      id: 1,
      title: 'Add Student',
      icon: 'account-plus',
      color: '#4CAF50',
      onPress: () => navigation.navigate('StudentsTab', {
        screen: SCREENS.CREATE_STUDENT,
      }),
    },
    {
      id: 2,
      title: 'Link Guardian',
      icon: 'account-multiple-plus',
      color: '#2196F3',
      onPress: () => navigation.navigate('ApprovalsTab', {
        screen: SCREENS.CREATE_GUARDIAN_LINK,
      }),
    },
    {
      id: 3,
      title: 'Payment Request',
      icon: 'cash-plus',
      color: '#FF9800',
      onPress: () => navigation.navigate('PaymentsTab', {
        screen: SCREENS.CREATE_PAYMENT_REQUEST,
      }),
    },
    {
      id: 4,
      title: 'View Students',
      icon: 'account-group',
      color: '#9C27B0',
      onPress: () => navigation.navigate('StudentsTab', {
        screen: SCREENS.STUDENT_LIST,
      }),
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'student_added':
        return 'account-plus';
      case 'approval_pending':
        return 'clock-alert';
      case 'payment_created':
        return 'cash';
      default:
        return 'information';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'student_added':
        return '#4CAF50';
      case 'approval_pending':
        return '#FF9800';
      case 'payment_created':
        return '#2196F3';
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
          <Text style={styles.teacherName}>
            {user?.first_name || 'Teacher'}!
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(SCREENS.NOTIFICATIONS)}
        >
          <MaterialCommunityIcons name="bell" size={28} color="#6200EE" />
          {dashboardData.pendingApprovals > 0 && (
            <Badge style={styles.notificationBadge}>
              {dashboardData.pendingApprovals}
            </Badge>
          )}
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchDashboardData} /> : null}

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <Card style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
          <Card.Content style={styles.statCardContent}>
            <MaterialCommunityIcons
              name="account-group"
              size={32}
              color="#2196F3"
            />
            <View style={styles.statTextContainer}>
              <Title style={styles.statNumber}>{dashboardData.totalStudents}</Title>
              <Paragraph style={styles.statLabel}>Total Students</Paragraph></View>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
          <Card.Content style={styles.statCardContent}>
            <MaterialCommunityIcons
              name="clock-alert"
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

        <Card style={[styles.statCard, { backgroundColor: '#F3E5F5' }]}>
          <Card.Content style={styles.statCardContent}>
            <MaterialCommunityIcons name="cash" size={32} color="#9C27B0" />
            <View style={styles.statTextContainer}>
              <Title style={styles.statNumber}>
                {dashboardData.pendingPayments}
              </Title>
              <Paragraph style={styles.statLabel}>Pending Payments</Paragraph>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Quick Actions - FIXED */}
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
  teacherName: {
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

export default TeacherDashboardScreen;