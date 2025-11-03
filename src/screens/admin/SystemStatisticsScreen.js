import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
  Dimensions,
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const { width } = Dimensions.get('window');

const SystemStatisticsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalSchools: 0,
    totalStudents: 0,
    totalGuardians: 0,
    totalTeachers: 0,
    totalPayments: 0,
    totalPaymentAmount: 0,
    pendingApprovals: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    newSchoolsThisMonth: 0,
    // ✨ NEW - Attendance Statistics
    attendance: {
      totalRecords: 0,
      todayPresent: 0,
      todayTotal: 0,
      weeklyAverage: 0,
      qrCodeScans: 0,
      fingerprintScans: 0,
      faceRecognitionScans: 0,
      manualEntries: 0,
      otcEntries: 0,
    },
  });

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await adminService.getSystemStatistics();
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatistics({
        totalUsers: 1690,
        totalSchools: 125,
        totalStudents: 2567,
        totalGuardians: 1234,
        totalTeachers: 456,
        totalPayments: 3456,
        totalPaymentAmount: 12500000,
        pendingApprovals: 23,
        activeUsers: 1589,
        newUsersThisMonth: 87,
        newSchoolsThisMonth: 12,
        // ✨ NEW - Attendance Statistics
        attendance: {
          totalRecords: 45678,
          todayPresent: 2234,
          todayTotal: 2567,
          weeklyAverage: 87,
          qrCodeScans: 28000,
          fingerprintScans: 12000,
          faceRecognitionScans: 3500,
          manualEntries: 1800,
          otcEntries: 378,
        },
      });
    } catch (err) {
      setError('Failed to load statistics. Please try again.');
      console.error('Fetch statistics error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchStatistics();
  }, []);

  const StatisticCard = ({ title, value, icon, color, suffix = '' }) => (
    <Card style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <Card.Content style={styles.statCardContent}>
        <View style={styles.statIconContainer}>
          <View style={[styles.statIconCircle, { backgroundColor: color + '20' }]}>
            <MaterialCommunityIcons name={icon} size={28} color={color} />
          </View>
        </View>
        <View style={styles.statTextContainer}>
          <Title style={styles.statValue}>{value}{suffix}</Title>
          <Paragraph style={styles.statTitle}>{title}</Paragraph>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const attendancePercentage = statistics.attendance.todayTotal > 0 
    ? Math.round((statistics.attendance.todayPresent / statistics.attendance.todayTotal) * 100)
    : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchStatistics} /> : null}

      {/* Overall System Stats */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Overall System Statistics</Text>
        
        <StatisticCard
          title="Total Users"
          value={statistics.totalUsers.toLocaleString()}
          icon="account-group"
          color="#2196F3"
        />
        
        <StatisticCard
          title="Active Users (Last 30 Days)"
          value={statistics.activeUsers.toLocaleString()}
          icon="account-check"
          color="#4CAF50"
        />
        
        <StatisticCard
          title="New Users This Month"
          value={statistics.newUsersThisMonth.toLocaleString()}
          icon="account-plus"
          color="#FF9800"
        />
      </View>

      {/* ✨ NEW - Attendance Statistics Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Attendance Statistics</Text>
        
        {/* Today's Attendance */}
        <Card style={styles.attendanceSummaryCard}>
          <Card.Content>
            <View style={styles.attendanceHeader}>
              <View style={styles.attendanceHeaderLeft}>
                <MaterialCommunityIcons name="calendar-today" size={24} color="#6200EE" />
                <Text style={styles.attendanceHeaderTitle}>Today's Attendance</Text>
              </View>
              <View style={styles.attendancePercentageBadge}>
                <Text style={styles.attendancePercentageText}>{attendancePercentage}%</Text>
              </View>
            </View>
            
            <View style={styles.attendanceSummaryRow}>
              <View style={styles.attendanceSummaryItem}>
                <Text style={styles.attendanceSummaryNumber}>
                  {statistics.attendance.todayPresent.toLocaleString()}
                </Text>
                <Text style={styles.attendanceSummaryLabel}>Present</Text>
              </View>
              <View style={styles.attendanceSummaryDivider} />
              <View style={styles.attendanceSummaryItem}>
                <Text style={styles.attendanceSummaryNumber}>
                  {(statistics.attendance.todayTotal - statistics.attendance.todayPresent).toLocaleString()}
                </Text>
                <Text style={styles.attendanceSummaryLabel}>Absent</Text>
              </View>
              <View style={styles.attendanceSummaryDivider} />
              <View style={styles.attendanceSummaryItem}>
                <Text style={styles.attendanceSummaryNumber}>
                  {statistics.attendance.todayTotal.toLocaleString()}
                </Text>
                <Text style={styles.attendanceSummaryLabel}>Total</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <StatisticCard
          title="Total Attendance Records"
          value={statistics.attendance.totalRecords.toLocaleString()}
          icon="clipboard-check"
          color="#9C27B0"
        />
        
        <StatisticCard
          title="Weekly Average Attendance"
          value={statistics.attendance.weeklyAverage.toLocaleString()}
          icon="chart-line"
          color="#4CAF50"
          suffix="%"
        />

        {/* Attendance Methods Breakdown */}
        <Card style={styles.methodsCard}>
          <Card.Content>
            <Text style={styles.methodsTitle}>Attendance by Method</Text>
            
            <View style={styles.methodItem}>
              <View style={styles.methodLeft}>
                <MaterialCommunityIcons name="qrcode-scan" size={24} color="#2196F3" />
                <Text style={styles.methodName}>QR Code Scans</Text>
              </View>
              <View style={styles.methodRight}>
                <Text style={styles.methodCount}>
                  {statistics.attendance.qrCodeScans.toLocaleString()}
                </Text>
                <Text style={styles.methodPercentage}>
                  {Math.round((statistics.attendance.qrCodeScans / statistics.attendance.totalRecords) * 100)}%
                </Text>
              </View>
            </View>

            <View style={styles.methodItem}>
              <View style={styles.methodLeft}>
                <MaterialCommunityIcons name="fingerprint" size={24} color="#4CAF50" />
                <Text style={styles.methodName}>Fingerprint</Text>
              </View>
              <View style={styles.methodRight}>
                <Text style={styles.methodCount}>
                  {statistics.attendance.fingerprintScans.toLocaleString()}
                </Text>
                <Text style={styles.methodPercentage}>
                  {Math.round((statistics.attendance.fingerprintScans / statistics.attendance.totalRecords) * 100)}%
                </Text>
              </View>
            </View>

            <View style={styles.methodItem}>
              <View style={styles.methodLeft}>
                <MaterialCommunityIcons name="face-recognition" size={24} color="#FF9800" />
                <Text style={styles.methodName}>Face Recognition</Text>
              </View>
              <View style={styles.methodRight}>
                <Text style={styles.methodCount}>
                  {statistics.attendance.faceRecognitionScans.toLocaleString()}
                </Text>
                <Text style={styles.methodPercentage}>
                  {Math.round((statistics.attendance.faceRecognitionScans / statistics.attendance.totalRecords) * 100)}%
                </Text>
              </View>
            </View>

            <View style={styles.methodItem}>
              <View style={styles.methodLeft}>
                <MaterialCommunityIcons name="numeric" size={24} color="#9C27B0" />
                <Text style={styles.methodName}>One-Time Code</Text>
              </View>
              <View style={styles.methodRight}>
                <Text style={styles.methodCount}>
                  {statistics.attendance.otcEntries.toLocaleString()}
                </Text>
                <Text style={styles.methodPercentage}>
                  {Math.round((statistics.attendance.otcEntries / statistics.attendance.totalRecords) * 100)}%
                </Text>
              </View>
            </View>

            <View style={styles.methodItem}>
              <View style={styles.methodLeft}>
                <MaterialCommunityIcons name="pencil" size={24} color="#757575" />
                <Text style={styles.methodName}>Manual Entry</Text>
              </View>
              <View style={styles.methodRight}>
                <Text style={styles.methodCount}>
                  {statistics.attendance.manualEntries.toLocaleString()}
                </Text>
                <Text style={styles.methodPercentage}>
                  {Math.round((statistics.attendance.manualEntries / statistics.attendance.totalRecords) * 100)}%
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Schools Statistics */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Schools</Text>
        
        <StatisticCard
          title="Total Schools"
          value={statistics.totalSchools.toLocaleString()}
          icon="school"
          color="#9C27B0"
        />
        
        <StatisticCard
          title="Pending School Approvals"
          value={statistics.pendingApprovals.toLocaleString()}
          icon="clock-alert"
          color="#F44336"
        />
        
        <StatisticCard
          title="New Schools This Month"
          value={statistics.newSchoolsThisMonth.toLocaleString()}
          icon="school-outline"
          color="#00BCD4"
        />
      </View>

      {/* User Types Statistics */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Users by Type</Text>
        
        <StatisticCard
          title="Teachers"
          value={statistics.totalTeachers.toLocaleString()}
          icon="account-tie"
          color="#3F51B5"
        />
        
        <StatisticCard
          title="Guardians"
          value={statistics.totalGuardians.toLocaleString()}
          icon="account-heart"
          color="#E91E63"
        />
        
        <StatisticCard
          title="Students"
          value={statistics.totalStudents.toLocaleString()}
          icon="account-school"
          color="#009688"
        />
      </View>

      {/* Financial Statistics */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Financial Overview</Text>
        
        <StatisticCard
          title="Total Payment Requests"
          value={statistics.totalPayments.toLocaleString()}
          icon="cash-multiple"
          color="#FF5722"
        />
        
        <StatisticCard
          title="Total Payment Amount"
          value={`KES ${(statistics.totalPaymentAmount / 1000000).toFixed(2)}M`}
          icon="currency-usd"
          color="#4CAF50"
        />
      </View>

      {/* System Health */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>System Health</Text>
        
        <Card style={styles.healthCard}>
          <Card.Content>
            <View style={styles.healthRow}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
              <Text style={styles.healthText}>All systems operational</Text>
            </View>
            <View style={styles.healthRow}>
              <MaterialCommunityIcons name="database" size={24} color="#2196F3" />
              <Text style={styles.healthText}>Database: Healthy</Text>
            </View>
            <View style={styles.healthRow}>
              <MaterialCommunityIcons name="server" size={24} color="#4CAF50" />
              <Text style={styles.healthText}>Server: Online</Text>
            </View>
            <View style={styles.healthRow}>
              <MaterialCommunityIcons name="api" size={24} color="#4CAF50" />
              <Text style={styles.healthText}>API: Responsive</Text>
            </View>
            {/* ✨ NEW - Attendance System Health */}
            <View style={styles.healthRow}>
              <MaterialCommunityIcons name="fingerprint" size={24} color="#4CAF50" />
              <Text style={styles.healthText}>Biometric Service: Active</Text>
            </View>
            <View style={styles.healthRow}>
              <MaterialCommunityIcons name="qrcode" size={24} color="#4CAF50" />
              <Text style={styles.healthText}>QR Code Service: Active</Text>
            </View>
          </Card.Content>
        </Card>
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
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  statCard: {
    marginBottom: 12,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    marginRight: 16,
  },
  statIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 0,
  },
  statTitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 0,
  },
  // ✨ NEW - Attendance Styles
  attendanceSummaryCard: {
    marginBottom: 12,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  attendanceHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendanceHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginLeft: 8,
  },
  attendancePercentageBadge: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  attendancePercentageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  attendanceSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  attendanceSummaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  attendanceSummaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  attendanceSummaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  attendanceSummaryLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  methodsCard: {
    marginBottom: 12,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  methodsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  methodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodName: {
    fontSize: 14,
    color: '#212121',
    marginLeft: 12,
  },
  methodRight: {
    alignItems: 'flex-end',
  },
  methodCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  methodPercentage: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  healthCard: {
    elevation: 2,
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  healthText: {
    fontSize: 14,
    color: '#212121',
    marginLeft: 12,
  },
});

export default SystemStatisticsScreen;