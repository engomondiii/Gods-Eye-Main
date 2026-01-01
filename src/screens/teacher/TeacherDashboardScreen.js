// ========================================
// TEACHER DASHBOARD SCREEN
// Backend Integration: GET /api/analytics/dashboard/metrics/
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { Card, Title, Paragraph, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useAuth } from '../../hooks/useAuth';
import { SCREENS } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import * as analyticsService from '../../services/analyticsService';

const screenWidth = Dimensions.get('window').width;

const TeacherDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setError('');
      
      const response = await analyticsService.getDashboardMetrics();
      
      if (response.success) {
        setDashboardData(response.data);
      } else {
        throw new Error(response.message || 'Failed to load dashboard data');
      }
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
      title: 'Mark Attendance',
      icon: 'clipboard-check',
      color: '#4CAF50',
      onPress: () => navigation.navigate('AttendanceTab', {
        screen: SCREENS.ATTENDANCE_DASHBOARD,
      }),
    },
    {
      id: 2,
      title: 'Add Student',
      icon: 'account-plus',
      color: '#2196F3',
      onPress: () => navigation.navigate('StudentsTab', {
        screen: SCREENS.CREATE_STUDENT,
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
      title: 'View Reports',
      icon: 'chart-bar',
      color: '#9C27B0',
      onPress: () => navigation.navigate('AttendanceTab', {
        screen: SCREENS.ATTENDANCE_HISTORY,
      }),
    },
  ];

  // Prepare attendance trend chart data
  const getAttendanceChartData = () => {
    if (!dashboardData?.attendance_trend) {
      return null;
    }

    const trend = dashboardData.attendance_trend;
    
    return {
      labels: trend.map(item => {
        const date = new Date(item.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }),
      datasets: [
        {
          data: trend.map(item => item.rate),
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const chartData = getAttendanceChartData();

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
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchDashboardData} /> : null}

      {dashboardData && (
        <>
          {/* Today's Attendance Stats */}
          <Card style={styles.todayCard}>
            <Card.Content>
              <View style={styles.todayHeader}>
                <MaterialCommunityIcons
                  name="calendar-today"
                  size={24}
                  color="#6200EE"
                />
                <Title style={styles.todayTitle}>Today's Attendance</Title>
              </View>

              <View style={styles.attendanceRateContainer}>
                <Text style={styles.attendanceRateValue}>
                  {dashboardData.today_attendance_rate.toFixed(1)}%
                </Text>
                <Text style={styles.attendanceRateLabel}>Attendance Rate</Text>
              </View>

              <View style={styles.attendanceStatsRow}>
                <View style={styles.attendanceStat}>
                  <View
                    style={[styles.statIconContainer, { backgroundColor: '#4CAF5020' }]}
                  >
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color="#4CAF50"
                    />
                  </View>
                  <Text style={styles.statValue}>{dashboardData.today_present}</Text>
                  <Text style={styles.statLabel}>Present</Text>
                </View>

                <View style={styles.attendanceStat}>
                  <View
                    style={[styles.statIconContainer, { backgroundColor: '#F4433620' }]}
                  >
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={24}
                      color="#F44336"
                    />
                  </View>
                  <Text style={styles.statValue}>{dashboardData.today_absent}</Text>
                  <Text style={styles.statLabel}>Absent</Text>
                </View>

                <View style={styles.attendanceStat}>
                  <View
                    style={[styles.statIconContainer, { backgroundColor: '#FF980020' }]}
                  >
                    <MaterialCommunityIcons
                      name="clock-alert"
                      size={24}
                      color="#FF9800"
                    />
                  </View>
                  <Text style={styles.statValue}>{dashboardData.today_late}</Text>
                  <Text style={styles.statLabel}>Late</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Overview Stats */}
          <View style={styles.statsContainer}>
            <Card style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
              <Card.Content style={styles.statCardContent}>
                <MaterialCommunityIcons
                  name="account-group"
                  size={32}
                  color="#2196F3"
                />
                <View style={styles.statTextContainer}>
                  <Title style={styles.statNumber}>
                    {dashboardData.total_students}
                  </Title>
                  <Paragraph style={styles.statLabel}>Total Students</Paragraph>
                </View>
              </Card.Content>
            </Card>

            <Card style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
              <Card.Content style={styles.statCardContent}>
                <MaterialCommunityIcons
                  name="chart-line"
                  size={32}
                  color="#4CAF50"
                />
                <View style={styles.statTextContainer}>
                  <Title style={styles.statNumber}>
                    {dashboardData.week_attendance_rate.toFixed(1)}%
                  </Title>
                  <Paragraph style={styles.statLabel}>Week Rate</Paragraph>
                </View>
              </Card.Content>
            </Card>

            <Card style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
              <Card.Content style={styles.statCardContent}>
                <MaterialCommunityIcons name="cash" size={32} color="#FF9800" />
                <View style={styles.statTextContainer}>
                  <Title style={styles.statNumber}>
                    {analyticsService.formatCurrency(dashboardData.week_collected)}
                  </Title>
                  <Paragraph style={styles.statLabel}>Week Collection</Paragraph>
                </View>
              </Card.Content>
            </Card>
          </View>

          {/* Attendance Trend Chart */}
          {chartData && (
            <Card style={styles.chartCard}>
              <Card.Content>
                <View style={styles.chartHeader}>
                  <MaterialCommunityIcons
                    name="chart-line"
                    size={20}
                    color="#6200EE"
                  />
                  <Title style={styles.chartTitle}>7-Day Attendance Trend</Title>
                </View>

                <LineChart
                  data={chartData}
                  width={screenWidth - 64}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#FFFFFF',
                    backgroundGradientFrom: '#FFFFFF',
                    backgroundGradientTo: '#FFFFFF',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: '4',
                      strokeWidth: '2',
                      stroke: '#6200EE',
                    },
                  }}
                  bezier
                  style={styles.chart}
                />
              </Card.Content>
            </Card>
          )}

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
                  </View>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      )}
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
  todayCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  todayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#212121',
  },
  attendanceRateContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 16,
  },
  attendanceRateValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  attendanceRateLabel: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  attendanceStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  attendanceStat: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  statsContainer: {
    marginBottom: 16,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  chartCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#212121',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
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
});

export default TeacherDashboardScreen;