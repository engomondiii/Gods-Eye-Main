// ========================================
// GUARDIAN DASHBOARD SCREEN
// Backend Integration: GET /api/analytics/dashboard/metrics/ (filtered by guardian)
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Button, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { SCREENS } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import * as studentService from '../../services/studentService';
import * as paymentService from '../../services/paymentService';
import * as otcService from '../../services/otcService';
import * as analyticsService from '../../services/analyticsService';

const GuardianDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [children, setChildren] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState([]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setError('');
      
      // Fetch linked students
      const studentsResponse = await studentService.getMyStudents();
      
      if (studentsResponse.success) {
        setChildren(studentsResponse.data.results || []);
        
        // Fetch payment summary for each child
        const paymentPromises = studentsResponse.data.results.map(async (child) => {
          const paymentsResponse = await paymentService.getMyPayments({
            student: child.id,
          });
          
          if (paymentsResponse.success) {
            const payments = paymentsResponse.data.results || [];
            const totalBalance = payments.reduce(
              (sum, p) => sum + parseFloat(p.balance || 0),
              0
            );
            const overdueCount = payments.filter(p => p.is_overdue).length;
            
            return {
              studentId: child.id,
              totalBalance,
              overdueCount,
              payments: payments.length,
            };
          }
          
          return {
            studentId: child.id,
            totalBalance: 0,
            overdueCount: 0,
            payments: 0,
          };
        });
        
        const paymentData = await Promise.all(paymentPromises);
        setPaymentSummary(paymentData);
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

  // Generate OTC for child
  const handleGenerateOTC = async (studentId) => {
    try {
      const response = await otcService.generateOTC(studentId);
      
      if (response.success) {
        Alert.alert(
          'OTC Generated',
          `One-Time Code: ${response.data.code}\n\nValid for: ${response.data.validity_minutes} minutes`,
          [
            {
              text: 'Share Code',
              onPress: () => {
                // TODO: Implement share functionality
                console.log('Share OTC:', response.data.code);
              },
            },
            { text: 'OK' },
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to generate OTC');
      }
    } catch (error) {
      console.error('Generate OTC error:', error);
      Alert.alert('Error', 'Failed to generate OTC');
    }
  };

  // Quick action cards
  const quickActions = [
    {
      id: 1,
      title: 'View Payments',
      icon: 'cash',
      color: '#4CAF50',
      onPress: () => navigation.navigate(SCREENS.PAYMENT_REQUESTS),
    },
    {
      id: 2,
      title: 'Attendance History',
      icon: 'calendar-clock',
      color: '#2196F3',
      onPress: () => navigation.navigate(SCREENS.ATTENDANCE_HISTORY),
    },
    {
      id: 3,
      title: 'Notifications',
      icon: 'bell',
      color: '#FF9800',
      onPress: () => navigation.navigate(SCREENS.NOTIFICATIONS),
    },
    {
      id: 4,
      title: 'My Children',
      icon: 'account-group',
      color: '#9C27B0',
      onPress: () => navigation.navigate(SCREENS.MY_STUDENTS),
    },
  ];

  // Get payment summary for child
  const getChildPaymentSummary = (studentId) => {
    return paymentSummary.find(p => p.studentId === studentId) || {
      totalBalance: 0,
      overdueCount: 0,
      payments: 0,
    };
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
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.guardianName}>
            {user?.first_name || 'Guardian'}!
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

      {/* Children Summary */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>My Children</Text>
        
        {children.length > 0 ? (
          children.map((child) => {
            const paymentInfo = getChildPaymentSummary(child.id);
            const attendanceRate = child.attendance_percentage || 0;
            
            return (
              <Card key={child.id} style={styles.childCard}>
                <Card.Content>
                  {/* Child Header */}
                  <View style={styles.childHeader}>
                    <View style={styles.childInfo}>
                      <Text style={styles.childName}>{child.full_name}</Text>
                      <Text style={styles.childGrade}>
                        {child.grade_and_stream} • Adm: {child.admission_number}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.otcButton}
                      onPress={() => handleGenerateOTC(child.id)}
                    >
                      <MaterialCommunityIcons
                        name="qrcode"
                        size={24}
                        color="#6200EE"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Attendance */}
                  <View style={styles.childStat}>
                    <View style={styles.statHeader}>
                      <MaterialCommunityIcons
                        name="calendar-check"
                        size={18}
                        color="#4CAF50"
                      />
                      <Text style={styles.statTitle}>Attendance Rate</Text>
                    </View>
                    <View style={styles.progressContainer}>
                      <ProgressBar
                        progress={attendanceRate / 100}
                        color={analyticsService.getAttendanceRateColor(attendanceRate)}
                        style={styles.progressBar}
                      />
                      <Text style={styles.progressText}>
                        {attendanceRate.toFixed(1)}%
                      </Text>
                    </View>
                  </View>

                  {/* Payment Balance */}
                  <View style={styles.childStat}>
                    <View style={styles.statHeader}>
                      <MaterialCommunityIcons
                        name="cash"
                        size={18}
                        color="#FF9800"
                      />
                      <Text style={styles.statTitle}>Payment Balance</Text>
                    </View>
                    <View style={styles.paymentInfo}>
                      <Text style={styles.balanceAmount}>
                        {analyticsService.formatCurrency(paymentInfo.totalBalance)}
                      </Text>
                      {paymentInfo.overdueCount > 0 && (
                        <View style={styles.overdueBadge}>
                          <MaterialCommunityIcons
                            name="alert"
                            size={14}
                            color="#FFFFFF"
                          />
                          <Text style={styles.overdueText}>
                            {paymentInfo.overdueCount} Overdue
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.childActions}>
                    <Button
                      mode="outlined"
                      icon="cash"
                      onPress={() =>
                        navigation.navigate(SCREENS.PAYMENT_REQUESTS, {
                          studentId: child.id,
                        })
                      }
                      style={styles.actionButton}
                      compact
                    >
                      Pay Fees
                    </Button>
                    <Button
                      mode="outlined"
                      icon="calendar"
                      onPress={() =>
                        navigation.navigate(SCREENS.ATTENDANCE_HISTORY, {
                          studentId: child.id,
                        })
                      }
                      style={styles.actionButton}
                      compact
                    >
                      Attendance
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            );
          })
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <MaterialCommunityIcons
                name="account-off"
                size={48}
                color="#9E9E9E"
              />
              <Text style={styles.emptyText}>No linked children</Text>
              <Text style={styles.emptySubtext}>
                Contact your school to link your children
              </Text>
            </Card.Content>
          </Card>
        )}
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
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  childCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  childGrade: {
    fontSize: 13,
    color: '#757575',
  },
  otcButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6200EE20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childStat: {
    marginBottom: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginLeft: 6,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
    marginLeft: 12,
    width: 50,
    textAlign: 'right',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  overdueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overdueText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  childActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  emptyCard: {
    elevation: 1,
    backgroundColor: '#FFFFFF',
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#9E9E9E',
    marginTop: 8,
    textAlign: 'center',
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

export default GuardianDashboardScreen;