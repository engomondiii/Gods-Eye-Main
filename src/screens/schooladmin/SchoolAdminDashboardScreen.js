import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Card, Title, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { SCREENS } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StatCard from '../../components/admin/StatCard';

const SchoolAdminDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    totalTeachers: 0,
    totalStudents: 0,
    totalGuardians: 0,
    pendingApprovals: 0,
    pendingPayments: 0,
    todayAttendance: {
      present: 0,
      absent: 0,
      late: 0,
      percentage: 0,
    },
    recentActivities: [],
  });

  // Fetch dashboard data for this specific school
  const fetchDashboardData = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await schoolAdminService.getDashboardStats(user.school.id);
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardData({
        totalTeachers: 25,
        totalStudents: 450,
        totalGuardians: 678,
        pendingApprovals: 5,
        pendingPayments: 12,
        todayAttendance: {
          present: 420,
          absent: 18,
          late: 12,
          percentage: 93,
        },
        recentActivities: [
          {
            id: 1,
            type: 'teacher_added',
            message: 'New teacher registered: Mary Wanjiru',
            time: '30 minutes ago',
          },
          {
            id: 2,
            type: 'student_enrolled',
            message: 'New student enrolled: John Kamau Mwangi - Grade 5 Red',
            time: '2 hours ago',
          },
          {
            id: 3,
            type: 'payment_received',
            message: 'Payment received: KES 5,000 from Jane Odhiambo',
            time: '3 hours ago',
          },
          {
            id: 4,
            type: 'attendance_alert',
            message: 'Low attendance alert: Grade 3 Blue (75%)',
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

  // 🆕 UPDATED - School statistics data with proper navigation
  const schoolStats = [
    {
      id: 1,
      title: 'Total Students',
      value: dashboardData.totalStudents,
      icon: 'account-school',
      color: '#2196F3',
      bgColor: '#E3F2FD',
      onPress: () => navigation.navigate('StudentsTab', {
        screen: SCREENS.MANAGE_STUDENTS,
      }),
    },
    {
      id: 2,
      title: 'Teachers',
      value: dashboardData.totalTeachers,
      icon: 'account-tie',
      color: '#4CAF50',
      bgColor: '#E8F5E9',
      onPress: () => navigation.navigate('TeachersTab', {
        screen: SCREENS.MANAGE_TEACHERS,
      }),
    },
    {
      id: 3,
      title: 'Guardians',
      value: dashboardData.totalGuardians,
      icon: 'account-supervisor',
      color: '#9C27B0',
      bgColor: '#F3E5F5',
      onPress: () => navigation.navigate('GuardiansTab', {
        screen: SCREENS.MANAGE_GUARDIANS,
      }),
    },
    {
      id: 4,
      title: 'Pending Approvals',
      value: dashboardData.pendingApprovals,
      icon: 'clock-alert',
      color: '#FF9800',
      bgColor: '#FFF3E0',
      badge: dashboardData.pendingApprovals,
    },
    {
      id: 5,
      title: 'Pending Payments',
      value: dashboardData.pendingPayments,
      icon: 'cash-clock',
      color: '#F44336',
      bgColor: '#FFEBEE',
      badge: dashboardData.pendingPayments,
    },
  ];

  // 🆕 UPDATED - Quick action cards with proper navigation
  const quickActions = [
    {
      id: 1,
      title: 'Add Teacher',
      icon: 'account-plus',
      color: '#4CAF50',
      onPress: () => navigation.navigate('TeachersTab', {
        screen: SCREENS.ADD_TEACHER,
      }),
    },
    {
      id: 2,
      title: 'Add Student',
      icon: 'account-school-outline',
      color: '#2196F3',
      onPress: () => navigation.navigate('StudentsTab', {
        screen: SCREENS.ADD_STUDENT,
      }),
    },
    {
      id: 3,
      title: 'Add Guardian',
      icon: 'account-heart-outline',
      color: '#9C27B0',
      onPress: () => navigation.navigate('GuardiansTab', {
        screen: SCREENS.ADD_GUARDIAN,
      }),
    },
    {
      id: 4,
      title: 'View Reports',
      icon: 'chart-bar',
      color: '#FF9800',
      onPress: () => navigation.navigate('ReportsTab', {
        screen: SCREENS.SCHOOL_REPORTS,
      }),
    },
    {
      id: 5,
      title: 'Manage Teachers',
      icon: 'account-tie',
      color: '#00BCD4',
      onPress: () => navigation.navigate('TeachersTab', {
        screen: SCREENS.MANAGE_TEACHERS,
      }),
    },
    {
      id: 6,
      title: 'Manage Students',
      icon: 'account-group',
      color: '#673AB7',
      onPress: () => navigation.navigate('StudentsTab', {
        screen: SCREENS.MANAGE_STUDENTS,
      }),
    },
    {
      id: 7,
      title: 'Manage Guardians',
      icon: 'account-supervisor',
      color: '#E91E63',
      onPress: () => navigation.navigate('GuardiansTab', {
        screen: SCREENS.MANAGE_GUARDIANS,
      }),
    },
    {
      id: 8,
      title: 'School Settings',
      icon: 'cog',
      color: '#607D8B',
      onPress: () => navigation.navigate('ProfileTab', {
        screen: SCREENS.SCHOOL_SETTINGS,
      }),
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'teacher_added':
        return 'account-plus';
      case 'student_enrolled':
        return 'account-school';
      case 'payment_received':
        return 'cash-check';
      case 'attendance_alert':
        return 'alert-circle';
      default:
        return 'information';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'teacher_added':
        return '#4CAF50';
      case 'student_enrolled':
        return '#2196F3';
      case 'payment_received':
        return '#00BCD4';
      case 'attendance_alert':
        return '#FF9800';
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
          <Text style={styles.welcomeText}>School Admin Portal</Text>
          <Text style={styles.schoolName}>
            {user?.school?.name || 'Your School'}
          </Text>
          <Text style={styles.adminName}>
            Welcome, {user?.first_name || 'Admin'}!
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(SCREENS.NOTIFICATIONS)}
        >
          <MaterialCommunityIcons name="bell" size={28} color="#FF9800" />
          {dashboardData.pendingApprovals > 0 && (
            <Badge style={styles.notificationBadge}>
              {dashboardData.pendingApprovals}
            </Badge>
          )}
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchDashboardData} /> : null}

      {/* Today's Attendance Summary */}
      <Card style={styles.attendanceCard}>
        <Card.Content>
          <View style={styles.attendanceHeader}>
            <MaterialCommunityIcons name="clipboard-check" size={32} color="#FF9800" />
            <View style={styles.attendanceHeaderText}>
              <Title style={styles.attendanceTitle}>Today's Attendance</Title>
              <Text style={styles.attendanceDate}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
          </View>
          
          <View style={styles.attendanceStats}>
            <View style={styles.attendanceStat}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
              <Text style={styles.attendanceNumber}>{dashboardData.todayAttendance.present}</Text>
              <Text style={styles.attendanceLabel}>Present</Text>
            </View>
            <View style={styles.attendanceStat}>
              <MaterialCommunityIcons name="clock-alert" size={24} color="#FF9800" />
              <Text style={styles.attendanceNumber}>{dashboardData.todayAttendance.late}</Text>
              <Text style={styles.attendanceLabel}>Late</Text>
            </View>
            <View style={styles.attendanceStat}>
              <MaterialCommunityIcons name="close-circle" size={24} color="#F44336" />
              <Text style={styles.attendanceNumber}>{dashboardData.todayAttendance.absent}</Text>
              <Text style={styles.attendanceLabel}>Absent</Text>
            </View>
          </View>
          
          <View style={styles.attendancePercentage}>
            <Text style={styles.percentageText}>
              {dashboardData.todayAttendance.percentage}% Attendance Rate
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* School Statistics */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>School Overview</Text>
        <View style={styles.statsGrid}>
          {schoolStats.map((stat) => (
            <StatCard key={stat.id} stat={stat} onPress={stat.onPress} />
          ))}
        </View>
      </View>

      {/* Quick Actions - 🆕 UPDATED with 4x2 grid */}
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
                  size={24}
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
        <Text style={styles.sectionTitle}>Recent School Activities</Text>
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

      {/* 🆕 NEW - Management Summary Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Management Summary</Text>
        
        <TouchableOpacity 
          style={styles.managementCard}
          onPress={() => navigation.navigate('TeachersTab', {
            screen: SCREENS.MANAGE_TEACHERS,
          })}
        >
          <View style={styles.managementCardLeft}>
            <MaterialCommunityIcons name="account-tie" size={32} color="#4CAF50" />
            <View style={styles.managementCardText}>
              <Text style={styles.managementCardTitle}>Teachers</Text>
              <Text style={styles.managementCardSubtitle}>
                View and manage all teachers
              </Text>
            </View>
          </View>
          <View style={styles.managementCardRight}>
            <Text style={styles.managementCardValue}>{dashboardData.totalTeachers}</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#757575" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.managementCard}
          onPress={() => navigation.navigate('StudentsTab', {
            screen: SCREENS.MANAGE_STUDENTS,
          })}
        >
          <View style={styles.managementCardLeft}>
            <MaterialCommunityIcons name="account-school" size={32} color="#2196F3" />
            <View style={styles.managementCardText}>
              <Text style={styles.managementCardTitle}>Students</Text>
              <Text style={styles.managementCardSubtitle}>
                View and manage all students
              </Text>
            </View>
          </View>
          <View style={styles.managementCardRight}>
            <Text style={styles.managementCardValue}>{dashboardData.totalStudents}</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#757575" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.managementCard}
          onPress={() => navigation.navigate('GuardiansTab', {
            screen: SCREENS.MANAGE_GUARDIANS,
          })}
        >
          <View style={styles.managementCardLeft}>
            <MaterialCommunityIcons name="account-supervisor" size={32} color="#9C27B0" />
            <View style={styles.managementCardText}>
              <Text style={styles.managementCardTitle}>Guardians</Text>
              <Text style={styles.managementCardSubtitle}>
                View and manage all guardians
              </Text>
            </View>
          </View>
          <View style={styles.managementCardRight}>
            <Text style={styles.managementCardValue}>{dashboardData.totalGuardians}</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#757575" />
          </View>
        </TouchableOpacity>
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
    paddingBottom: 32,
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
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
    marginTop: 4,
  },
  adminName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
  },
  attendanceCard: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    borderRadius: 12,
  },
  attendanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  attendanceHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  attendanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  attendanceDate: {
    fontSize: 12,
    color: '#757575',
  },
  attendanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  attendanceStat: {
    alignItems: 'center',
  },
  attendanceNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginVertical: 8,
  },
  attendanceLabel: {
    fontSize: 12,
    color: '#757575',
  },
  attendancePercentage: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
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
  // 🆕 UPDATED - Quick Actions with better layout for 8 items
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },
  quickActionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
  },
  activityCard: {
    marginBottom: 12,
    elevation: 1,
    borderRadius: 12,
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
  // 🆕 NEW - Management Summary Cards
  managementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  managementCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  managementCardText: {
    marginLeft: 12,
    flex: 1,
  },
  managementCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  managementCardSubtitle: {
    fontSize: 12,
    color: '#757575',
  },
  managementCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  managementCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800',
    marginRight: 8,
  },
});

export default SchoolAdminDashboardScreen;