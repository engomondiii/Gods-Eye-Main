// ========================================
// GOD'S EYE EDTECH - ATTENDANCE DASHBOARD SCREEN
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Text, Card, FAB, Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import useAttendance from '../../hooks/useAttendance';

const AttendanceDashboardScreen = ({ navigation }) => {
  const {
    dashboardData,
    isLoading,
    error,
    fetchDashboardData,
  } = useAttendance();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
  }, [fetchDashboardData]);

  const quickActions = [
    {
      id: 1,
      title: 'QR Scan',
      icon: 'qrcode-scan',
      color: theme.colors.primary,
      onPress: () => navigation.navigate('CheckInScreen', { method: 'qr_code' }),
    },
    {
      id: 2,
      title: 'Manual Entry',
      icon: 'pencil',
      color: theme.colors.success,
      onPress: () => navigation.navigate('ManualAttendanceScreen'),
    },
    {
      id: 3,
      title: 'History',
      icon: 'history',
      color: theme.colors.info,
      onPress: () => navigation.navigate('AttendanceHistoryScreen'),
    },
    {
      id: 4,
      title: 'Reports',
      icon: 'chart-bar',
      color: theme.colors.warning,
      onPress: () => navigation.navigate('AttendanceReportsScreen'),
    },
  ];

  const getAttendanceRate = () => {
    const { present, total } = dashboardData.stats;
    if (total === 0) return 0;
    return ((present / total) * 100).toFixed(1);
  };

  if (isLoading && !isRefreshing) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Attendance</Text>
            <Text style={styles.headerSubtitle}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
        </View>

        {/* Error Message */}
        {error ? <ErrorMessage message={error} onRetry={fetchDashboardData} /> : null}

        {/* Search Bar */}
        <Searchbar
          placeholder="Search students..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <Card style={[styles.statCard, styles.statCardPresent]}>
            <Card.Content>
              <MaterialCommunityIcons name="check-circle" size={32} color={theme.colors.success} />
              <Text style={styles.statValue}>{dashboardData.stats.present}</Text>
              <Text style={styles.statLabel}>Present</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, styles.statCardAbsent]}>
            <Card.Content>
              <MaterialCommunityIcons name="close-circle" size={32} color={theme.colors.error} />
              <Text style={styles.statValue}>{dashboardData.stats.absent}</Text>
              <Text style={styles.statLabel}>Absent</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, styles.statCardLate]}>
            <Card.Content>
              <MaterialCommunityIcons name="clock-alert" size={32} color={theme.colors.warning} />
              <Text style={styles.statValue}>{dashboardData.stats.late}</Text>
              <Text style={styles.statLabel}>Late</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, styles.statCardExcused]}>
            <Card.Content>
              <MaterialCommunityIcons name="information" size={32} color={theme.colors.info} />
              <Text style={styles.statValue}>{dashboardData.stats.excused}</Text>
              <Text style={styles.statLabel}>Excused</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Attendance Rate */}
        <Card style={styles.rateCard}>
          <Card.Content>
            <View style={styles.rateContent}>
              <View style={styles.rateLeft}>
                <Text style={styles.rateTitle}>Today's Attendance Rate</Text>
                <Text style={styles.rateSubtitle}>
                  {dashboardData.stats.present} of {dashboardData.stats.total} students present
                </Text>
              </View>
              <View style={styles.rateRight}>
                <Text style={styles.rateValue}>{getAttendanceRate()}%</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={action.onPress}
              >
                <View style={[
                  styles.quickActionIcon,
                  { backgroundColor: action.color + '20' }
                ]}>
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

        {/* Recent Activity */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('AttendanceHistoryScreen')}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.recentRecordsContainer}>
            {dashboardData.recentRecords.slice(0, 5).map((record, index) => (
              <Card key={index} style={styles.recentRecordCard}>
                <Card.Content style={styles.recentRecordContent}>
                  <View style={styles.recentRecordLeft}>
                    <MaterialCommunityIcons
                      name="account-circle"
                      size={40}
                      color={theme.colors.primary}
                    />
                    <View style={styles.recentRecordInfo}>
                      <Text style={styles.recentRecordName}>
                        {record.student_name || 'Unknown Student'}
                      </Text>
                      <Text style={styles.recentRecordTime}>
                        {new Date(record.check_in_time || record.created_at).toLocaleTimeString()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.recentRecordBadge}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color={theme.colors.success}
                    />
                  </View>
                </Card.Content>
              </Card>
            ))}

            {dashboardData.recentRecords.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="clipboard-text-outline"
                  size={64}
                  color={theme.colors.textSecondary}
                />
                <Text style={styles.emptyStateText}>No recent activity</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="qrcode-scan"
        label="Check In"
        onPress={() => navigation.navigate('CheckInScreen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  headerTitle: {
    fontSize: theme.fontSizes.h2,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  searchBar: {
    margin: theme.spacing.md,
    elevation: 0,
    backgroundColor: theme.colors.surface,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  statCard: {
    width: '48%',
    ...theme.shadows.small,
  },
  statCardPresent: {
    backgroundColor: '#E8F5E9',
  },
  statCardAbsent: {
    backgroundColor: '#FFEBEE',
  },
  statCardLate: {
    backgroundColor: '#FFF3E0',
  },
  statCardExcused: {
    backgroundColor: '#E3F2FD',
  },
  statValue: {
    fontSize: theme.fontSizes.h1,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  rateCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    ...theme.shadows.medium,
  },
  rateContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateLeft: {
    flex: 1,
  },
  rateTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.surface,
  },
  rateSubtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.surface,
    marginTop: theme.spacing.xs,
    opacity: 0.9,
  },
  rateRight: {
    marginLeft: theme.spacing.md,
  },
  rateValue: {
    fontSize: theme.fontSizes.h1,
    fontWeight: 'bold',
    color: theme.colors.surface,
  },
  sectionContainer: {
    padding: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  viewAllText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  quickActionTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  recentRecordsContainer: {
    gap: theme.spacing.sm,
  },
  recentRecordCard: {
    backgroundColor: theme.colors.surface,
    ...theme.shadows.small,
  },
  recentRecordContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentRecordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recentRecordInfo: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  recentRecordName: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  recentRecordTime: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  recentRecordBadge: {
    marginLeft: theme.spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.md,
    bottom: theme.spacing.md,
    backgroundColor: theme.colors.primary,
  },
});

export default AttendanceDashboardScreen;