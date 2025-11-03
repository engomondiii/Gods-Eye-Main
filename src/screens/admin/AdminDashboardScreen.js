import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Card, Title, Paragraph, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { SCREENS } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StatCard from '../../components/admin/StatCard';

const AdminDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    totalSchools: 0,
    pendingSchools: 0,
    totalTeachers: 0,
    totalGuardians: 0,
    totalStudents: 0,
    recentActivities: [],
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setError('');
      // TODO: Replace with actual API calls
      // const response = await adminService.getDashboardStats();
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardData({
        totalSchools: 125,
        pendingSchools: 8,
        totalTeachers: 456,
        totalGuardians: 1234,
        totalStudents: 2567,
        recentActivities: [
          {
            id: 1,
            type: 'school_pending',
            message: 'New school registration: Mombasa High School',
            time: '1 hour ago',
          },
          {
            id: 2,
            type: 'school_approved',
            message: 'School approved: Kisumu Primary School',
            time: '3 hours ago',
          },
          {
            id: 3,
            type: 'user_registered',
            message: 'New teacher registered: John Kamau',
            time: '5 hours ago',
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

  // System statistics data
  const systemStats = [
    {
      id: 1,
      title: 'Total Schools',
      value: dashboardData.totalSchools,
      icon: 'school',
      color: '#2196F3',
      bgColor: '#E3F2FD',
    },
    {
      id: 2,
      title: 'Pending Approvals',
      value: dashboardData.pendingSchools,
      icon: 'clock-alert',
      color: '#FF9800',
      bgColor: '#FFF3E0',
      badge: dashboardData.pendingSchools,
    },
    {
      id: 3,
      title: 'Teachers',
      value: dashboardData.totalTeachers,
      icon: 'account-tie',
      color: '#4CAF50',
      bgColor: '#E8F5E9',
    },
    {
      id: 4,
      title: 'Guardians',
      value: dashboardData.totalGuardians,
      icon: 'account-group',
      color: '#9C27B0',
      bgColor: '#F3E5F5',
    },
    {
      id: 5,
      title: 'Students',
      value: dashboardData.totalStudents,
      icon: 'account-school',
      color: '#00BCD4',
      bgColor: '#E0F7FA',
    },
  ];

  // Quick action cards - FIXED NAVIGATION
  const quickActions = [
    {
      id: 1,
      title: 'Approve Schools',
      icon: 'school-outline',
      color: '#FF9800',
      onPress: () => navigation.navigate('SchoolsTab', {
        screen: SCREENS.SCHOOLS_LIST,
      }),
    },
    {
      id: 2,
      title: 'Manage Users',
      icon: 'account-cog',
      color: '#2196F3',
      onPress: () => navigation.navigate('UsersTab', {
        screen: SCREENS.USERS_MANAGEMENT,
      }),
    },
    {
      id: 3,
      title: 'View Statistics',
      icon: 'chart-bar',
      color: '#4CAF50',
      onPress: () => navigation.navigate('SystemTab', {
        screen: SCREENS.SYSTEM_STATISTICS,
      }),
    },
    {
      id: 4,
      title: 'System Health',
      icon: 'heart-pulse',
      color: '#F44336',
      onPress: () => navigation.navigate('SystemTab', {
        screen: SCREENS.SYSTEM_STATISTICS,
      }),
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'school_pending':
        return 'school-outline';
      case 'school_approved':
        return 'check-circle';
      case 'user_registered':
        return 'account-plus';
      default:
        return 'information';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'school_pending':
        return '#FF9800';
      case 'school_approved':
        return '#4CAF50';
      case 'user_registered':
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
          <Text style={styles.welcomeText}>Super Admin Portal</Text>
          <Text style={styles.adminName}>
            Welcome, {user?.first_name || 'Admin'}!
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(SCREENS.NOTIFICATIONS)}
        >
          <MaterialCommunityIcons name="bell" size={28} color="#6200EE" />
          {dashboardData.pendingSchools > 0 && (
            <Badge style={styles.notificationBadge}>
              {dashboardData.pendingSchools}
            </Badge>
          )}
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchDashboardData} /> : null}

      {/* System Statistics */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>System Overview</Text>
        <View style={styles.statsGrid}>
          {systemStats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </View>
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
        <Text style={styles.sectionTitle}>Recent System Activities</Text>
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
    fontSize: 14,
    color: '#757575',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  adminName: {
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
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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

export default AdminDashboardScreen;