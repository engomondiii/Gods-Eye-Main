// ========================================
// SCHOOL ADMIN DASHBOARD SCREEN
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
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useAuth } from '../../hooks/useAuth';
import { SCREENS } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import * as analyticsService from '../../services/analyticsService';

const screenWidth = Dimensions.get('window').width;

const SchoolAdminDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [comparative, setComparative] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setError('');
      
      // Fetch metrics
      const metricsResponse = await analyticsService.getDashboardMetrics();
      
      if (metricsResponse.success) {
        setDashboardData(metricsResponse.data);
      }
      
      // Fetch comparative analytics
      const compareResponse = await analyticsService.getComparativeAnalytics(selectedPeriod);
      
      if (compareResponse.success) {
        setComparative(compareResponse.data);
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
  }, [selectedPeriod]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchDashboardData();
  }, [selectedPeriod]);

  // Quick action cards
  const quickActions = [
    {
      id: 1,
      title: 'Manage Teachers',
      icon: 'account-tie',
      color: '#4CAF50',
      onPress: () => navigation.navigate(SCREENS.TEACHERS_LIST),
    },
    {
      id: 2,
      title: 'View Reports',
      icon: 'chart-bar',
      color: '#2196F3',
      onPress: () => navigation.navigate(SCREENS.ATTENDANCE_HISTORY),
    },
    {
      id: 3,
      title: 'Approve Links',
      icon: 'shield-check',
      color: '#FF9800',
      onPress: () => navigation.navigate(SCREENS.GUARDIAN_LINK_REQUESTS),
    },
    {
      id: 4,
      title: 'School Settings',
      icon: 'cog',
      color: '#9C27B0',
      onPress: () => navigation.navigate(SCREENS.SETTINGS),
    },
  ];

  // Prepare attendance trend chart data
  const getAttendanceChartData = () => {
    if (!dashboardData?.attendance_trend) return null;

    const trend = dashboardData.attendance_trend.slice(-7);
    
    return {
      labels: trend.map(item => {
        const date = new Date(item.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }),
      datasets: [{
        data: trend.map(item => item.rate),
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      }],
    };
  };

  // Prepare payment trend chart data
  const getPaymentChartData = () => {
    if (!dashboardData?.payment_trend) return null;

    const trend = dashboardData.payment_trend.slice(-7);
    
    return {
      labels: trend.map(item => {
        const date = new Date(item.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }),
      datasets: [{
        data: trend.map(item => item.collected / 1000), // Convert to thousands
      }],
    };
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const attendanceChartData = getAttendanceChartData();
  const paymentChartData = getPaymentChartData();

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
          <Text style={styles.welcomeText}>School Overview</Text>
          <Text style={styles.adminName}>
            {user?.school?.name || 'Dashboard'}
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
          {/* Overview Cards */}
          <View style={styles.overviewGrid}>
            <Card style={[styles.overviewCard, { backgroundColor: '#E3F2FD' }]}>
              <Card.Content style={styles.overviewContent}>
                <MaterialCommunityIcons
                  name="account-group"
                  size={32}
                  color="#2196F3"
                />
                <View style={styles.overviewText}>
                  <Title style={styles.overviewNumber}>
                    {dashboardData.total_students}
                  </Title>
                  <Paragraph style={styles.overviewLabel}>Students</Paragraph>
                </View>
              </Card.Content>
            </Card>

            <Card style={[styles.overviewCard, { backgroundColor: '#E8F5E9' }]}>
              <Card.Content style={styles.overviewContent}>
                <MaterialCommunityIcons
                  name="account-tie"
                  size={32}
                  color="#4CAF50"
                />
                <View style={styles.overviewText}>
                  <Title style={styles.overviewNumber}>
                    {dashboardData.total_teachers}
                  </Title>
                  <Paragraph style={styles.overviewLabel}>Teachers</Paragraph>
                </View>
              </Card.Content>
            </Card>

            <Card style={[styles.overviewCard, { backgroundColor: '#F3E5F5' }]}>
              <Card.Content style={styles.overviewContent}>
                <MaterialCommunityIcons
                  name="account-supervisor"
                  size={32}
                  color="#9C27B0"
                />
                <View style={styles.overviewText}>
                  <Title style={styles.overviewNumber}>
                    {dashboardData.total_guardians}
                  </Title>
                  <Paragraph style={styles.overviewLabel}>Guardians</Paragraph>
                </View>
              </Card.Content>
            </Card>
          </View>

          {/* Today's Performance */}
          <Card style={styles.performanceCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Today's Performance</Title>
              
              <View style={styles.performanceRow}>
                <View style={styles.performanceStat}>
                  <Text style={styles.performanceLabel}>Attendance Rate</Text>
                  <Text style={[
                    styles.performanceValue,
                    { color: analyticsService.getAttendanceRateColor(
                      dashboardData.today_attendance_rate
                    )}
                  ]}>
                    {dashboardData.today_attendance_rate.toFixed(1)}%
                  </Text>
                </View>
                
                <View style={styles.performanceDivider} />
                
                <View style={styles.performanceStat}>
                  <Text style={styles.performanceLabel}>Present</Text>
                  <Text style={styles.performanceValue}>
                    {dashboardData.today_present}
                  </Text>
                </View>
                
                <View style={styles.performanceDivider} />
                
                <View style={styles.performanceStat}>
                  <Text style={styles.performanceLabel}>Absent</Text>
                  <Text style={[styles.performanceValue, { color: '#F44336' }]}>
                    {dashboardData.today_absent}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Period Selector & Comparative Analytics */}
          {comparative && (
            <Card style={styles.comparativeCard}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Title style={styles.cardTitle}>Period Comparison</Title>
                  <View style={styles.periodSelector}>
                    {['week', 'month'].map(period => (
                      <Chip
                        key={period}
                        selected={selectedPeriod === period}
                        onPress={() => setSelectedPeriod(period)}
                        style={styles.periodChip}
                      >
                        {period === 'week' ? 'Week' : 'Month'}
                      </Chip>
                    ))}
                  </View>
                </View>

                <View style={styles.comparisonRow}>
                  {/* Attendance Comparison */}
                  <View style={styles.comparisonItem}>
                    <Text style={styles.comparisonLabel}>Attendance</Text>
                    <View style={styles.comparisonValues}>
                      <Text style={styles.currentValue}>
                        {comparative.current_period.attendance_rate.toFixed(1)}%
                      </Text>
                      <MaterialCommunityIcons
                        name={analyticsService.getTrendIcon(
                          comparative.comparison.attendance_trend
                        )}
                        size={20}
                        color={analyticsService.getTrendColor(
                          comparative.comparison.attendance_trend
                        )}
                      />
                      <Text style={[
                        styles.changeValue,
                        { color: analyticsService.getTrendColor(
                          comparative.comparison.attendance_trend
                        )}
                      ]}>
                        {comparative.comparison.attendance_change > 0 ? '+' : ''}
                        {comparative.comparison.attendance_change.toFixed(1)}%
                      </Text>
                    </View>
                  </View>

                  {/* Payment Comparison */}
                  <View style={styles.comparisonItem}>
                    <Text style={styles.comparisonLabel}>Collection</Text>
                    <View style={styles.comparisonValues}>
                      <Text style={styles.currentValue}>
                        {analyticsService.formatCurrency(
                          comparative.current_period.total_collected
                        )}
                      </Text>
                      <MaterialCommunityIcons
                        name={analyticsService.getTrendIcon(
                          comparative.comparison.payment_trend
                        )}
                        size={20}
                        color={analyticsService.getTrendColor(
                          comparative.comparison.payment_trend
                        )}
                      />
                      <Text style={[
                        styles.changeValue,
                        { color: analyticsService.getTrendColor(
                          comparative.comparison.payment_trend
                        )}
                      ]}>
                        {comparative.comparison.payment_change_percentage > 0 ? '+' : ''}
                        {comparative.comparison.payment_change_percentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Monthly Summary */}
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>This Month</Title>
              
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <MaterialCommunityIcons
                    name="calendar-check"
                    size={24}
                    color="#4CAF50"
                  />
                  <View style={styles.summaryText}>
                    <Text style={styles.summaryLabel}>Attendance</Text>
                    <Text style={styles.summaryValue}>
                      {dashboardData.month_attendance_rate.toFixed(1)}%
                    </Text>
                  </View>
                </View>

                <View style={styles.summaryItem}>
                  <MaterialCommunityIcons
                    name="cash-check"
                    size={24}
                    color="#4CAF50"
                  />
                  <View style={styles.summaryText}>
                    <Text style={styles.summaryLabel}>Collected</Text>
                    <Text style={styles.summaryValue}>
                      {analyticsService.formatCurrency(dashboardData.month_collected)}
                    </Text>
                  </View>
                </View>

                <View style={styles.summaryItem}>
                  <MaterialCommunityIcons
                    name="cash-remove"
                    size={24}
                    color="#F44336"
                  />
                  <View style={styles.summaryText}>
                    <Text style={styles.summaryLabel}>Outstanding</Text>
                    <Text style={styles.summaryValue}>
                      {analyticsService.formatCurrency(dashboardData.month_outstanding)}
                    </Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Attendance Trend Chart */}
          {attendanceChartData && (
            <Card style={styles.chartCard}>
              <Card.Content>
                <Title style={styles.cardTitle}>Attendance Trend (7 Days)</Title>
                <LineChart
                  data={attendanceChartData}
                  width={screenWidth - 64}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#FFFFFF',
                    backgroundGradientFrom: '#FFFFFF',
                    backgroundGradientTo: '#FFFFFF',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: { borderRadius: 16 },
                    propsForDots: {
                      r: '4',
                      strokeWidth: '2',
                      stroke: '#4CAF50',
                    },
                  }}
                  bezier
                  style={styles.chart}
                  formatYLabel={(value) => `${value}%`}
                />
              </Card.Content>
            </Card>
          )}

          {/* Payment Trend Chart */}
          {paymentChartData && (
            <Card style={styles.chartCard}>
              <Card.Content>
                <Title style={styles.cardTitle}>Payment Trend (7 Days)</Title>
                <BarChart
                  data={paymentChartData}
                  width={screenWidth - 64}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#FFFFFF',
                    backgroundGradientFrom: '#FFFFFF',
                    backgroundGradientTo: '#FFFFFF',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: { borderRadius: 16 },
                  }}
                  style={styles.chart}
                  formatYLabel={(value) => `${value}K`}
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
    fontSize: 14,
    color: '#757575',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  adminName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  overviewCard: {
    width: '31%',
    marginBottom: 12,
    elevation: 2,
  },
  overviewContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  overviewText: {
    alignItems: 'center',
    marginTop: 8,
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 0,
  },
  performanceCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  performanceStat: {
    alignItems: 'center',
    flex: 1,
  },
  performanceLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  performanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  performanceDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  comparativeCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
  },
  periodChip: {
    marginLeft: 8,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comparisonItem: {
    flex: 1,
    paddingHorizontal: 8,
  },
  comparisonLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  comparisonValues: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginRight: 8,
  },
  changeValue: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  summaryCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  summaryText: {
    marginLeft: 8,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#757575',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
  },
  chartCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
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

export default SchoolAdminDashboardScreen;