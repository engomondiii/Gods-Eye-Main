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
import { SCREENS } from '../../utils/constants';
import AttendanceStats from '../../components/attendance/AttendanceStats';
import RecentAttendanceList from '../../components/attendance/RecentAttendanceList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AttendanceDashboardScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardData, setDashboardData] = useState({
    stats: {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      total: 0,
    },
    recentRecords: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await attendanceService.getDashboardData();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        stats: {
          present: 35,
          absent: 5,
          late: 3,
          excused: 2,
          total: 45,
        },
        recentRecords: [
          {
            id: 1,
            student: { first_name: 'John', last_name: 'Doe' },
            attendance_type: 'check_in',
            method: 'qr_code',
            timestamp: new Date().toISOString(),
          },
          {
            id: 2,
            student: { first_name: 'Sarah', last_name: 'Smith' },
            attendance_type: 'check_in',
            method: 'fingerprint',
            timestamp: new Date(Date.now() - 300000).toISOString(),
          },
        ],
      };
      
      setDashboardData(mockData);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      id: 1,
      title: 'QR Scan',
      icon: 'qrcode-scan',
      color: theme.colors.primary,
      onPress: () => navigation.navigate(SCREENS.CHECK_IN, { method: 'qr_code' }),
    },
    {
      id: 2,
      title: 'Manual Entry',
      icon: 'pencil',
      color: theme.colors.success,
      onPress: () => navigation.navigate(SCREENS.MANUAL_ATTENDANCE),
    },
    {
      id: 3,
      title: 'History',
      icon: 'history',
      color: theme.colors.info,
      onPress: () => navigation.navigate(SCREENS.ATTENDANCE_HISTORY),
    },
    {
      id: 4,
      title: 'Reports',
      icon: 'chart-bar',
      color: theme.colors.warning,
      onPress: () => navigation.navigate(SCREENS.ATTENDANCE_REPORTS),
    },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
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

        {/* Statistics */}
        <AttendanceStats
          present={dashboardData.stats.present}
          absent={dashboardData.stats.absent}
          late={dashboardData.stats.late}
          excused={dashboardData.stats.excused}
          total={dashboardData.stats.total}
          dateRange="Today"
          showPercentage={true}
        />

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
              onPress={() => navigation.navigate(SCREENS.ATTENDANCE_HISTORY)}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.recentRecordsContainer}>
            {dashboardData.recentRecords.map((record) => (
              <Card key={record.id} style={styles.recentRecordCard}>
                <Card.Content style={styles.recentRecordContent}>
                  <View style={styles.recentRecordLeft}>
                    <MaterialCommunityIcons
                      name="account-circle"
                      size={40}
                      color={theme.colors.primary}
                    />
                    <View style={styles.recentRecordInfo}>
                      <Text style={styles.recentRecordName}>
                        {record.student.first_name} {record.student.last_name}
                      </Text>
                      <Text style={styles.recentRecordTime}>
                        {new Date(record.timestamp).toLocaleTimeString()}
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
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="qrcode-scan"
        label="Check In"
        onPress={() => navigation.navigate(SCREENS.CHECK_IN)}
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
  fab: {
    position: 'absolute',
    right: theme.spacing.md,
    bottom: theme.spacing.md,
    backgroundColor: theme.colors.primary,
  },
});

export default AttendanceDashboardScreen;